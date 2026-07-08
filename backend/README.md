# AI RAG Assistant - Backend

FastAPI backend for an AI-powered Retrieval-Augmented Generation (RAG) assistant that answers questions from uploaded PDF documents using semantic search and a Large Language Model.

## Features

* Upload PDF documents
* Extract text from PDFs
* Generate embeddings using Sentence Transformers
* Store embeddings with FAISS
* Retrieve the most relevant chunks using semantic search
* Generate answers with the Groq API (Llama 3.3)

## Tech Stack

* Python
* FastAPI
* FAISS
* Sentence Transformers
* PyPDF
* Groq API
* NumPy

## Installation

Clone the repository:

```bash
git clone https://github.com/nouraelhoseny13-blip/AI-RAG-Assistant-Backend.git
cd AI-RAG-Assistant-Backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it:

Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file:

```env
GROQ_API_KEY=YOUR_GROQ_API_KEY
```

Run the server:

```bash
uvicorn main:app --reload
```

The backend will start on:

```
http://127.0.0.1:8000
```

## API Endpoints

### Upload PDF

```
POST /upload
```

### Ask Question

```
POST /ask
```

## Notes

The `.env` file is intentionally excluded from the repository to keep API keys secure.

## Author

**Noura Elhoseny**
