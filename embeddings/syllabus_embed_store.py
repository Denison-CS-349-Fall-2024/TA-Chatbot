from langchain.text_splitter import CharacterTextSplitter
from sentence_transformers import SentenceTransformer, util
import PyPDF2
from pinecone import Pinecone
import torch

# Load the PDF
def load_pdf(file_path):
    with open(file_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ''
        for page in reader.pages:
            text += page.extract_text()
    return text

# Split the text into chunks
def split_text_into_chunks(text, chunk_size=1000, chunk_overlap=200):
    text_splitter = CharacterTextSplitter(
        separator=" ",
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len
    )
    chunks = text_splitter.split_text(text)
    return chunks

# Embed chunks using SentenceTransformer
def embed_chunks(chunks, model_name='all-MiniLM-L6-v2'):
    model = SentenceTransformer(model_name)
    embeddings = model.encode(chunks, convert_to_tensor=True)
    return embeddings, model

# Initialize Pinecone and directly access the existing index
def init_pinecone(api_key, index_name):
    pc = Pinecone(api_key=api_key)
    return pc.Index(index_name)

# Store embeddings in Pinecone
def store_embeddings_in_pinecone(embeddings, chunks, index):
    for i, embedding in enumerate(embeddings):
        # Prepare the data for Pinecone
        vector = embedding.tolist()
        metadata = {"text": chunks[i]}
        
        # Upsert the data into the Pinecone index
        index.upsert([(str(i), vector, metadata)])

# Perform semantic search
def semantic_search(query, chunks, embeddings, model, top_k=3):
    query_embedding = model.encode(query, convert_to_tensor=True)
    scores = util.pytorch_cos_sim(query_embedding, embeddings)[0]
    top_results = scores.topk(top_k)
    results = [(chunks[idx], scores[idx].item()) for idx in top_results[1]]
    return results

# Main function to bring everything together
def main(pdf_file_path, query, pinecone_api_key, pinecone_index_name, chunk_size=200, chunk_overlap=50, top_k=3):
    # Step 1: Load PDF
    text = load_pdf(pdf_file_path)

    # Step 2: Split the PDF text into chunks
    chunks = split_text_into_chunks(text, chunk_size, chunk_overlap)

    # Step 3: Embed the chunks
    embeddings, model = embed_chunks(chunks)

    # Step 4: Initialize Pinecone and store the embeddings
    index = init_pinecone(api_key=pinecone_api_key, index_name=pinecone_index_name)
    store_embeddings_in_pinecone(embeddings, chunks, index)

    # Step 5: Perform semantic search with the query
    results = semantic_search(query, chunks, embeddings, model, top_k)

    # Step 6: Return the top results
    for result, score in results:
        print(f"Score: {score}\nText: {result}\n")

# Example usage
if __name__ == "__main__":
    pdf_file = "./syl.pdf"  # Replace with your PDF path
    query = "What textbook do I need"  # Replace with your desired query
    pinecone_api_key = "6a9323b7-ea93-4846-8a15-7ef29e286b23"  # Replace with your Pinecone API key
    pinecone_index_name = "myenbeddings"  # Replace with your Pinecone index name
    main(pdf_file, query, pinecone_api_key, pinecone_index_name)