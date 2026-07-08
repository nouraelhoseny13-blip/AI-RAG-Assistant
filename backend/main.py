import os
import numpy as np
import faiss

from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from pypdf import PdfReader
from sentence_transformers import SentenceTransformer


# ==========================
# Load Environment Variables
# ==========================

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


# ==========================
# Embedding Model
# ==========================

embedding_model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)


# ==========================
# FastAPI
# ==========================

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# ==========================
# Request Model
# ==========================

class Question(BaseModel):
    question: str



# ==========================
# Global Variables
# ==========================

pdf_text = ""

chunks = []

chunk_sources = []

embeddings = None

index = None



# ==========================
# Upload PDF
# ==========================

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):

    global pdf_text
    global chunks
    global chunk_sources
    global embeddings
    global index


    temp_path = "temp.pdf"


    with open(temp_path, "wb") as f:
        f.write(await file.read())



    reader = PdfReader(temp_path)



    new_pdf_text = ""


    for page in reader.pages:

        text = page.extract_text()

        if text:
            new_pdf_text += text + "\n"



    chunk_size = 700


    new_chunks = []


    for i in range(0, len(new_pdf_text), chunk_size):

        new_chunks.append(
            new_pdf_text[i:i + chunk_size]
        )



    # Add chunks

    chunks.extend(new_chunks)



    # Save source filename for every chunk

    for _ in new_chunks:

        chunk_sources.append(
            file.filename
        )



    # Create embeddings

    embeddings = embedding_model.encode(
        chunks
    )


    embeddings = np.array(
        embeddings
    ).astype("float32")



    # Create FAISS index

    index = faiss.IndexFlatL2(
        embeddings.shape[1]
    )


    index.add(
        embeddings
    )



    pdf_text += new_pdf_text



    print("=" * 60)
    print("PDF processed successfully")
    print(f"File       : {file.filename}")
    print(f"Characters : {len(pdf_text)}")
    print(f"Chunks     : {len(chunks)}")
    print(f"Vectors    : {index.ntotal}")
    print("=" * 60)



    return {

        "message": "PDF uploaded successfully.",

        "file": file.filename,

        "characters": len(pdf_text),

        "chunks": len(chunks)

    }




# ==========================
# Ask Question
# ==========================

@app.post("/ask")
async def ask(data: Question):

    global chunks
    global chunk_sources
    global index



    if index is None or len(chunks) == 0:

        return {

            "answer": "Please upload a PDF document first."

        }



    question_embedding = embedding_model.encode(
        [data.question]
    )


    question_embedding = np.array(
        question_embedding
    ).astype("float32")



    k = min(20, len(chunks))


    distances, indices = index.search(
        question_embedding,
        k
    )



    print("Distances:", distances)
    print("Indices:", indices)



    threshold = 100



    if distances[0][0] > threshold:

        return {

            "answer":
            "The answer is not available in the uploaded document."

        }




    retrieved_chunks = []

    sources = []



    for idx in indices[0]:

        retrieved_chunks.append(
            chunks[idx]
        )

        sources.append(
            chunk_sources[idx]
        )



    if (
        "summary" in data.question.lower()
        or "summarize" in data.question.lower()
        or "لخص" in data.question
    ):
        context = pdf_text
    else:
        context = "\n\n".join(retrieved_chunks)

    print("=" * 50)
    print("Retrieved Context:")
    print(context)
    print("=" * 50)

    prompt = f"""
You are an AI assistant specialized in Question Answering over PDF documents.

Your task is to answer ONLY from the provided context.

Rules:

1. If the user asks for a summary, summarize the ENTIRE document.

2. If the user asks multiple questions together, answer EACH question separately.

3. If only some questions are answered by the context:
   - Answer those.
   - For any missing information write:
     "Not mentioned in the document."

4. Do NOT use outside knowledge.

5. Only return:
"The answer is not available in the uploaded document."
when NONE of the questions can be answered.

6. Format the answer clearly using headings and bullet points.

CONTEXT:

{context}

QUESTION:

{data.question}
"""

    try:

        completion = client.chat.completions.create(

            model="llama-3.3-70b-versatile",

            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],

            temperature=0.2

        )

        answer = completion.choices[0].message.content

        return {
            "answer": answer,
            "sources": list(set(sources))
        }

    except Exception as e:

        return {
            "answer": str(e)
        }