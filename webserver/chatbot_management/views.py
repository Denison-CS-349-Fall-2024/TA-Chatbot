import os
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec
from langchain.text_splitter import CharacterTextSplitter
from sentence_transformers import SentenceTransformer
import PyPDF2
from openai import OpenAI
from django.http import JsonResponse

# Load environment variables from .env file
load_dotenv()
print("this is the api key:", os.getenv("OPENAI_API_KEY"))
# Initialize OpenAI client with API key from environment variable
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Pinecone configuration from environment variables
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_ENVIRONMENT = "us-east-1"

# Initialize Pinecone client
pc = Pinecone(api_key=PINECONE_API_KEY)

# Define the index name
index_name = "myenbeddings"  # Use a unique index name for each course

# Load PDF file
def load_pdf(file_path):
    with open(file_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ''
        for page in reader.pages:
            text += page.extract_text()
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
    return embeddings, model

# Initialize Pinecone index
def initialize_index(index_name, dimension, metric="cosine"):
    if index_name not in pc.list_indexes().names():
        pc.create_index(name=index_name, dimension=dimension, metric=metric, 
                         spec=ServerlessSpec(cloud='aws', region=PINECONE_ENVIRONMENT))
    index = pc.Index(index_name)
    return index

# Upload embeddings to Pinecone index
def upload_embeddings(index, chunks, embeddings):
    vectors = [
        {"id": f"chunk-{i}", "values": embedding.tolist(), "metadata": {"text": chunk}}
        for i, (embedding, chunk) in enumerate(zip(embeddings, chunks))
    ]
    index.upsert(vectors)

# Search embeddings in Pinecone
def search_embeddings(index, query_embedding, top_k=3):
    results = index.query(vector=query_embedding.tolist(), top_k=top_k, include_metadata=True)
    return results

# Function to process PDF and query
def process_pdf_and_query(query, chunk_size=250, chunk_overlap=50, top_k=5):
    # Hardcoded path to the PDF file
    pdf_file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'syl.pdf')

    text = load_pdf(pdf_file_path)
    chunks = split_text_into_chunks(text, chunk_size, chunk_overlap)

    # Embed chunks and initialize Pinecone index
    embeddings, model = embed_chunks(chunks)
    dimension = embeddings.shape[1]
    index = initialize_index(index_name, dimension)

    # Upload the embeddings to Pinecone
    upload_embeddings(index, chunks, embeddings)

    # Create an embedding for the query
    query_embedding = model.encode(query, convert_to_tensor=True)

    # Perform a similarity search on Pinecone
    search_results = search_embeddings(index, query_embedding, top_k)
    results_text = ''
    for match in search_results['matches']:
        results_text += match['metadata']['text'] + '\n'

    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a helpful, friendly assistant to CS 349 - Software Engineering, helping students by answering class related questions or referring them to the professor's email if you can't answer the question"},
            {
                "role": "user",
                "content": f"""A student asked the following question:

                         Question: {query}
                         ---

                         Only use the provided text to answer the following question. The responses are ordered by decreasing cosine similarity with the query. Analyze all the responses and construct a result that answers the question the best. Don't include 'Based on the provided text' or make references to the results below in the final answer. Treat the information as if it was in your knowledge base. If the question is irrelevant to the class, decline politely emphasizing that you can only answer class related questions."
                         
                         ---
                        {results_text}
                         """
            }
        ],
        temperature=0.6
    )
    
    response_content = completion.choices[0].message.content
    return response_content  # Return the raw content here for further processing

# View to handle the query request
def process_query(request):
    question = request.GET.get('question', '')  # Get the question from query parameters
    response_content = process_pdf_and_query(question)  # Pass the question to the processing function
    return JsonResponse({'response': response_content})  # Return the JSON response



# If you want to run this script directly, uncomment the lines below
# if __name__ == "__main__":
#     pdf_file = "./syl.pdf"  # Path to your PDF file
#     query = "What time does the class meet?"  # Example query
#     process_pdf_and_query(pdf_file, query)  # Call the function



