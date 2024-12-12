import os
from dotenv import load_dotenv
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
from django.views.decorators.csrf import csrf_exempt
from openai import OpenAI
from django.http import JsonResponse
import json


# Load environment variables from .env file
load_dotenv()
# Initialize OpenAI client with API key from environment variable
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Pinecone configuration from environment variables
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_ENVIRONMENT = "us-east-1"

# Initialize Pinecone client
pc = Pinecone(api_key=PINECONE_API_KEY)

# Define the index name
index_name = "course-embeddings-prod"  # Your Pinecone index name

# Function to perform similarity search using Pinecone
def search_embeddings(index, query_embedding, class_id, top_k=3):
    # Construct metadata filters for class_id and material_type
    query_filter = {
        'class_id': class_id,
    }
    
    results = index.query(
        vector=query_embedding.tolist(),
        top_k=top_k,
        include_metadata=True,
        filter=query_filter
    )
    return results

# Function to process the query and get the response
def process_query_and_generate_response(query, class_id, top_k=20):

    # Create the query embedding using SentenceTransformer
    model = SentenceTransformer('all-MiniLM-L6-v2')
    query_embedding = model.encode(query, convert_to_tensor=True)

    # Initialize Pinecone index and perform similarity search
    index = pc.Index(index_name)
    search_results = search_embeddings(index, query_embedding, class_id, top_k)

    # Gather the most relevant results
    results_text = ""
    for match in search_results['matches']:
        results_text += match['metadata']['text'] + '\n'


    # Generate a response using GPT-4
    completion = client.chat.completions.create(
        model="gpt-4o-mini",  # Ensure you're using the correct model name
        messages=[
            {"role": "system", "content": "You are a helpful virtual teaching assistant for courses at Denison University, answering class-related questions. Be smart and infer some stuff. When answering questions, do not refer to the source of your information, rather speak as though the knowledge is part of your expertise."},
            {
                "role": "user",
                "content": f"""
                A student asked the following question:

                Question: {query}

                ---
                Only use the provided text below which is a result of a similarity search of the class's corpus. The responses are ordered by decreasing cosine similarity with the query. Analyze the responses and construct an answer that best addresses the question. If the question isn't related to the class, kindly decline and redirect the student.
                ---
                {results_text}
                """
            }
        ],
        temperature=0.6
    )
    # Extract the response from GPT-4
    response_content = completion.choices[0].message.content
    return response_content  # Return the raw content for further processing

# View to handle the query request
@csrf_exempt
def process_query(request):
    data = json.loads(request.body)

    class_id = data.get("class_id")
    question = data.get("query")

    response_content = process_query_and_generate_response(question, class_id)
    return JsonResponse({'response': response_content})

    # if request.method == "POST"
    # question = request.GET.get('question')  # Get the question from query parameters
    # class_id = request.GET.get('class_id')  # Example: Use the class ID from query parameters. if class_id not provided  ,'CS371-01' default 
    # material_type = request.GET.get('material_type')  # Example: Use the material type from query parameters

    # Get the response for the query
    # response_content = process_query_and_generate_response(question, class_id, material_type)
    
    # Return the response as JSON
    # return JsonResponse({'response': response_content})



# If you want to run this script directly, uncomment the lines below
# if __name__ == "__main__":
#     pdf_file = "./syl.pdf"  # Path to your PDF file
#     query = "What time does the class meet?"  # Example query
#     process_pdf_and_query(pdf_file, query)  # Call the function



