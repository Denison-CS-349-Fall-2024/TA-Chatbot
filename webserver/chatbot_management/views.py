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

def search_embeddings(index, query_embedding, class_id, top_k=3):
    """
    Perform similarity search using Pinecone.
    
    Args:
        index (Pinecone.Index): The Pinecone index to search.
        query_embedding (np.ndarray): The query embedding vector.
        class_id (str): The class ID to filter results.
        top_k (int): The number of top results to return. Default is 3.
    
    Returns:
        dict: The search results from Pinecone.
    """
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