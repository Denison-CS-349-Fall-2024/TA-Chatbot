import os
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec

# Load environment variables from .env file
load_dotenv()

# Initialize Pinecone
pc = Pinecone(
    api_key=os.getenv("PINECONE_API_KEY")
)

# Create index if it doesn't exist (you mentioned it exists, but keep it in case you need it later)
index_name = "myenbeddings"

print("pinecone setup complete")