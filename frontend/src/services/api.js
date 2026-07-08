const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8001";

export const uploadPDF = `${API_URL}/upload`;

export const askQuestion = `${API_URL}/ask`;