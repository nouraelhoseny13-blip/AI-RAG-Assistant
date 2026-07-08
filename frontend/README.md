# 🤖 AI RAG Assistant

An intelligent PDF-based AI assistant that allows users to upload documents and ask questions using **Retrieval Augmented Generation (RAG)**.

The system extracts information from uploaded PDF files, creates semantic embeddings, searches relevant document chunks, and generates accurate answers using an LLM.

## 🚀 Live Demo

🔗 https://ai-rag-assistant-seven.vercel.app/

## ✨ Features

* 📄 Upload PDF documents
* 💬 Chat with your documents using AI
* 🧠 RAG Pipeline implementation
* 🔍 Semantic search using vector embeddings
* ⚡ Fast document retrieval with FAISS
* 🌙 Dark mode support
* 🎤 Voice input support
* 📱 Responsive modern UI
* 📂 Display uploaded documents and status

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* Lucide React Icons

### Backend

* FastAPI
* Python
* FAISS Vector Database
* Sentence Transformers
* Groq LLM API
* PyPDF

## 🏗️ Architecture

```
User
 |
Frontend (React)
 |
FastAPI Backend
 |
PDF Processing
 |
Text Chunking
 |
Embeddings
 |
FAISS Vector Search
 |
LLM Response
```

## 📂 Project Structure

```
AI-RAG-Assistant
│
├── frontend
│   ├── src
│   ├── components
│   └── pages
│
└── backend
    ├── main.py
    ├── requirements.txt
    └── README.md
```

## ⚙️ Installation

### Frontend

```bash
cd frontend

npm install

npm run dev
```

### Backend

```bash
cd backend

pip install -r requirements.txt

uvicorn main:app --reload
```

## 🔐 Environment Variables

Create a `.env` file in the backend:

```
GROQ_API_KEY=your_api_key_here
```

## 📌 How It Works

1. User uploads a PDF file.
2. The backend extracts the text.
3. Text is divided into chunks.
4. Chunks are converted into embeddings.
5. FAISS searches the most relevant sections.
6. The LLM generates an answer based only on the document context.

## 👩‍💻 Author

Noura Elhoseny

AI Student | Machine Learning & Generative AI Enthusiast
