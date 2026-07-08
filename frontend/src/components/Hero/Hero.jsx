import { useState } from "react";
import api from "../../services/api";

function Hero() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [results, setResults] = useState([]);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("اختاري PDF أولاً");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      await api.post("/upload", formData);
      alert("تم رفع الملف بنجاح 🚀");
    } catch (err) {
      alert("Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleAsk = async () => {
    if (!question) return;

    try {
      setLoading(true);

      const res = await api.post("/ask", {
        question,
      });

      setResults(res.data.context || []);
      setAnswer(res.data.answer || "");
    } catch (err) {
      alert("Ask failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex items-center justify-center p-6">

      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-8">

        {/* Title */}
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-2">
          AI RAG Assistant 🤖
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Upload PDF → Ask Questions → Get AI Answers
        </p>

        {/* Upload Section */}
        <div className="border rounded-2xl p-5 mb-6 bg-gray-50">
          <h2 className="font-semibold mb-3">📄 Upload PDF</h2>

          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full"
          />

          <button
            onClick={handleUpload}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl"
          >
            Upload
          </button>
        </div>

        {/* Ask Section */}
        <div className="border rounded-2xl p-5 mb-6 bg-gray-50">
          <h2 className="font-semibold mb-3">💬 Ask Question</h2>

          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="اكتب سؤالك هنا..."
            className="w-full p-3 border rounded-xl"
          />

          <button
            onClick={handleAsk}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl"
          >
            Ask AI
          </button>
        </div>

        {/* Answer */}
        {answer && (
          <div className="bg-blue-50 border rounded-2xl p-4 mb-4">
            <h3 className="font-bold mb-2">🧠 AI Answer</h3>
            <p>{answer}</p>
          </div>
        )}

        {/* Context */}
        {results.length > 0 && (
          <div className="bg-gray-100 border rounded-2xl p-4">
            <h3 className="font-bold mb-2">📚 Retrieved Context</h3>

            {results.map((r, i) => (
              <p key={i} className="mb-2 text-sm">
                • {r}
              </p>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Hero;