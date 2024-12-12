from django.http import JsonResponse
from .models import CourseMaterial
from class_management.models import Course
from django.views.decorators.csrf import csrf_exempt
import os
from django.conf import settings
import os
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec
from langchain.text_splitter import CharacterTextSplitter
from sentence_transformers import SentenceTransformer
from pypdf import PdfReader
from openai import OpenAI
import re
from django.shortcuts import get_object_or_404

# Load environment variables from .env file
load_dotenv()
# Initialize OpenAI client with API key from environment variable
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Pinecone configuration from environment variables
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_ENVIRONMENT = "us-east-1"
INDEX_DIMENSION = 384

# Initialize Pinecone client
pc = Pinecone(api_key=PINECONE_API_KEY)

# Define the index name
index_name = "course-embeddings"  # Use a unique index name for each course

# Load PDF file
def load_pdf(file_path):
    with open(file_path, 'rb') as file:
        reader = PdfReader(file)
        text = ''
        for page in reader.pages:
            text += page.extract_text()
        text = re.sub(r'\s+', ' ', text)  # Normalize whitespace
        text = re.sub(r'[^\w\s.,;!?]', '', text)
    return text

# Split text into chunks
def split_text_into_chunks(text, chunk_size=1000, chunk_overlap=200):
    text_splitter = CharacterTextSplitter(
        separator=" ",
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len
    )
    chunks = text_splitter.split_text(text)
    return chunks

# Embed chunks of text
def embed_chunks(chunks, model_name='all-MiniLM-L6-v2'):
    model = SentenceTransformer(model_name)
    embeddings = model.encode(chunks, convert_to_tensor=True)
    return embeddings


# Initialize Pinecone index
def initialize_index(index_name, dimension = INDEX_DIMENSION, metric="cosine"):
    if index_name not in pc.list_indexes().names():
        pc.create_index(name=index_name, dimension=dimension, metric=metric, 
                         spec=ServerlessSpec(cloud='aws', region=PINECONE_ENVIRONMENT))
    index = pc.Index(index_name)
    return index

def delete_embeddings(index, class_id, material_name):
    prefix = f"{class_id}#{material_name}#"
    
    # First, list all vectors with this prefix
    vector_ids = []
    pagination_token = None
    
    while True:
        list_response = index.list_vectors(
            prefix=prefix,
            limit=10000,
            pagination_token=pagination_token
        )
        
        vector_ids.extend(list_response.vectors.ids)
        
        pagination_token = list_response.pagination.next
        if not pagination_token:
            break
    
    if vector_ids:
        index.delete(ids=vector_ids)

def upload_embeddings(index, chunks, embeddings, class_id, material_name):
    vectors = [
        {
            "id": f"{class_id}#{material_name}#chunk{i}",
            "values": embedding.tolist(),
            "metadata": {
                "text": chunk,
                "class_id": class_id,
                "file_name": material_name,
            }
        }
        for i, (embedding, chunk) in enumerate(zip(embeddings, chunks))
    ]
    index.upsert(vectors)

def parse_course_string(course_str):

    pattern = r"([A-Za-z]+)(\d{3})-(\d{2})"
    
    match = re.match(pattern, course_str)
    
    if match:
        department = match.group(1)
        course_number = match.group(2)
        class_number = match.group(3)
        return department, course_number, class_number
    else:
        raise ValueError("Invalid course format")

@csrf_exempt
def post_material(request):
    if request.method == 'POST' and request.FILES.get('file'):
        try:
            data = request.POST
            file = request.FILES['file']
            file_name = data.get('fileName', file.name)
            material_type = data.get('materialType', file.name)
            material_name = data.get('materialName', '')
            material_semester = data.get('semester', '')
            course_identififer = data.get("class_id", "")
            file_size = file.size
            file_type = file.name.split('.')[-1]

            parsed_string = parse_course_string(course_identififer)

            course = Course.objects.get_course_by_course_identifier(material_semester, parsed_string[0], parsed_string[1], parsed_string[2])
            
            # Directly read the PDF content from the uploaded file
            reader = PdfReader(file)
            text = ''
            for page in reader.pages:
                text += page.extract_text()

            # Continue with the existing processing
            chunks = split_text_into_chunks(text, chunk_size=1000, chunk_overlap=200)
            embeddings = embed_chunks(chunks)

            index = initialize_index(index_name, INDEX_DIMENSION)

            upload_embeddings(index, chunks, embeddings, class_id=course_identififer, material_name=material_name)
            material = CourseMaterial.objects.create_material(title=material_name, category=material_type, course=course, file_type=file_type, size=file_size)
            
            return JsonResponse({'message': 'File uploaded and material created successfully', 'material_id': material.id, 'fileName': file_name}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'File not uploaded'}, status=400)

@csrf_exempt
def delete_material(request, material_id):
    if request.method == 'DELETE':
        try:
            material = get_object_or_404(CourseMaterial, id=material_id)
            course = get_object_or_404(Course, id = material.course_id)

            course_identifier = f"{course.department}{course.course_number}-{course.section}#{material.title}"

            index = initialize_index(index_name, INDEX_DIMENSION)
            
            for ids in index.list(prefix=course_identifier):
                index.delete(ids = ids)
                
            material.delete()

            return JsonResponse({'message': 'File deleted successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid HTTP method'}, status=405)

def get_materials(request, course_id):
    try:
        course = Course.objects.get_course(course_id)
        materials = CourseMaterial.objects.filter(course=course)
        materials_list = [{'id': material.id,'title': material.title, 'category': material.category, 'uploaded_date': material.uploaded_date} for material in materials]
        
        return JsonResponse({'materials': materials_list}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    
def get_material(request, material_id):
    try:
        material = CourseMaterial.objects.get_file(material_id)
        material_data = {'id': material.id, 'title': material.title, 'category': material.category, 'uploaded_date': material.uploaded_date}
        return JsonResponse({'material': material_data}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def get_materials_by_class_id(request, semester, classId):
    
    if request.method == "GET":
        try:
            department, courseNumber, section = parse_course_string(classId)
            course = Course.objects.get_course_by_course_identifier(semester, department, courseNumber, section)
            # materials = CourseMaterial.get_materials_by_course_id(course.id)
            materials = CourseMaterial.objects.get_materials_by_course_id(course.id)


            materials_list = [{'id': material.id, 'title': material.title, 'category': material.category, 'uploadDate': material.uploaded_date, 'type': material.file_type, 'size': material.size} for material in materials]
            return JsonResponse({'materials': materials_list}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)


    return JsonResponse({'error': 'Invalid HTTP method'}, status=405)

@csrf_exempt
def update_material(request, material_id):
    if request.method == 'PUT' or request.method == 'POST':
        try:
            material = CourseMaterial.objects.get_file(material_id)
            if request.method == 'POST':
                data = request.POST
                new_file = request.FILES.get('file')
                # Update category and course_id if provided
                material.category = data.get('materialType', material.category)
                course_id = data.get('course_id')
                if course_id:
                    course = Course.objects.get_course(course_id)
                    material.course = course

                # If new file is uploaded
                if new_file:
                    file_name = data.get('fileName', new_file.name)
                    new_file_path = os.path.join(settings.MEDIA_ROOT, file_name)

                    # Remove old file
                    old_file_path = os.path.join(settings.MEDIA_ROOT, material.title)
                    if os.path.exists(old_file_path):
                        os.remove(old_file_path)

                    # Save new file
                    with open(new_file_path, 'wb+') as destination:
                        for chunk in new_file.chunks():
                            destination.write(chunk)

                    # Update title
                    material.title = file_name
                material.save()
                return JsonResponse({'message': 'Material updated successfully', 'material_id': material.id, 'fileName': material.title}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid HTTP method'}, status=405)
