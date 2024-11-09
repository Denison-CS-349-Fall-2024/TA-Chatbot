from django.http import JsonResponse
from .models import CourseMaterial
from class_management.models import Course
from django.views.decorators.csrf import csrf_exempt
import os
from django.conf import settings

@csrf_exempt
def post_material(request):
    if request.method == 'POST' and request.FILES.get('file'):
        try:
            data = request.POST
            file = request.FILES['file']
            file_name = data.get('fileName', file.name)
            material_type = data.get('materialType')
            course_id = data.get('course_id')

            # Get the course object
            course = Course.objects.get_course(course_id)
            
            # Path for saving the uploaded file
            file_path = os.path.join(settings.MEDIA_ROOT, file_name)
            
            # Save the file to the 'uploads' directory
            with open(file_path, 'wb+') as destination:
                for chunk in file.chunks():
                    destination.write(chunk)
            
            # Create a new CourseMaterial instance
            material = CourseMaterial.objects.create_material(title=file_name, category=material_type, course=course)
            return JsonResponse({'message': 'File uploaded and material created successfully', 'material_id': material.id, 'fileName': file_name}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'File not uploaded'}, status=400)

@csrf_exempt
def delete_material(request, material_id):
    if request.method == 'DELETE':
        try:
            material = CourseMaterial.objects.get_file(material_id)
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
