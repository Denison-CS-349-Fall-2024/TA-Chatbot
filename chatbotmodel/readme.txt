just to remember, for every file you want to use your api keys:
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Access the API keys
openai_api_key = os.getenv("OPENAI_API_KEY")
pinecone_api_key = os.getenv("PINECONE_API_KEY")