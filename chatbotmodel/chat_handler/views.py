from django.shortcuts import render

from django.http import JsonResponse
from dotenv import load_dotenv
import os
import openai
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer

# Load environment variables from .env file
load_dotenv()

# Initialize Pinecone and OpenAI
pinecone_api_key = os.getenv("PINECONE_API_KEY")
openai_api_key = os.getenv("OPENAI_API_KEY")

# Initialize Pinecone
pc = Pinecone(api_key=pinecone_api_key)

# Initialize the SentenceTransformer model for embeddings
model = SentenceTransformer('all-MiniLM-L6-v2')

# Function to create an embedding for the query
def create_query_embedding(query):
    # Generate the embedding for the query using SentenceTransformer
    query_embedding = model.encode(query, convert_to_tensor=True).tolist()  # Convert to list for Pinecone
    return query_embedding

# Function to fetch relevant embeddings from Pinecone
def retrieve_embeddings(query):
    # Assume 'your_index_name' is the name of your Pinecone index
    index = pc.index('myenbeddings')
    
    # Create a query embedding
    query_embedding = create_query_embedding(query)
    
    # Retrieve similar embeddings from Pinecone
    response = index.query(queries=[query_embedding], top_k=5)  # Get top 5 similar results
    return response['matches']

# Function to generate response using GPT-4
def generate_response(retrieved_data, query):
    # Use OpenAI GPT-4 to generate a response based on the retrieved data
    context = "\n".join([match['metadata']['text'] for match in retrieved_data])  # Extract text from retrieved matches

    prompt = f"""A student asked the following question:

    Question: {query}
    ---

    Only use the provided text to answer the following question. The responses are ordered by decreasing cosine similarity with the query. Analyze all the responses and construct a result that answers the question the best. Don't include 'Based on the provided text' or make references to the results below in the final answer. Treat the information as if it was in your knowledge base. If the question is irrelevant to the class, decline politely emphasizing that you can only answer class-related questions.

    ---
    {context}
    """
    
    openai.api_key = openai_api_key
    response = openai.ChatCompletion.create(
        model="gpt-4o",  # Ensure you're using the correct model
        messages=[
            {"role": "system", "content": "You are a helpful, friendly assistant to CS 351 - Software Engineering, helping students by answering class related questions or referring them to the professor's email if you can't answer the question"},
            {"role": "user", "content": prompt}
        ],
        temperature=0.6
    )
    
    return response['choices'][0]['message']['content']

# Example view to handle incoming queries
def handle_query(request):
    query = request.GET.get('query', '')  # Get query from request
    if not query:
        return JsonResponse({'error': 'No query provided'}, status=400)

    # Step 4.1: Retrieve relevant embeddings
    retrieved_data = retrieve_embeddings(query)
    
    # Step 4.2: Generate a response using GPT-4
    response = generate_response(retrieved_data, query)
    
    return JsonResponse({'response': response})

