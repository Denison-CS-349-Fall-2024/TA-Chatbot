"""
ChatBot Management Views
Handles AI-powered chat functionality using OpenAI and Pinecone for vector search.

This module provides functionality to:
- Process user queries against course materials
- Perform similarity searches using Pinecone
- Generate AI responses using OpenAI's GPT models
"""

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
    """
    Performs similarity search in Pinecone index for relevant course materials.

    Args:
        index: Pinecone index instance
        query_embedding: Vector embedding of the query
        class_id (str): Identifier for the course
        top_k (int): Number of results to return

    Returns:
        dict: Pinecone search results containing similar documents
    """
    # Construct metadata filters for class_id
    query_filter = {
        'class_id': class_id,
    }
    
    # Perform vector similarity search
    results = index.query(
        vector=query_embedding.tolist(),
        top_k=top_k,
        include_metadata=True,
        filter=query_filter
    )
    return results

# Function to process the query and get the response
def process_query_and_generate_response(query, class_id, top_k=20):
    """
    Processes a user query and generates an AI response.

    Args:
        query (str): User's question
        class_id (str): Identifier for the course
        top_k (int): Number of similar documents to consider

    Returns:
        str: AI-generated response based on course materials
    """
    # Initialize sentence transformer model
    model = SentenceTransformer('all-MiniLM-L6-v2')
    query_embedding = model.encode(query, convert_to_tensor=True)

    # Initialize Pinecone index and perform search
    index = pc.Index(index_name)
    search_results = search_embeddings(index, query_embedding, class_id, top_k)

    # Aggregate relevant results
    results_text = ""
    for match in search_results['matches']:
        results_text += match['metadata']['text'] + '\n'

    # Generate response using GPT-4o
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
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
    return completion.choices[0].message.content

# View to handle the query request
@csrf_exempt
def process_query(request):
    """
    API endpoint to handle chat queries.

    Args:
        request: HTTP request containing query and class_id

    Returns:
        JsonResponse: AI-generated response to the query
    """
    # Parse request data
    data = json.loads(request.body)
    class_id = data.get("class_id")
    question = data.get("query")

    # Process query and return response
    response_content = process_query_and_generate_response(question, class_id)
    return JsonResponse({'response': response_content})