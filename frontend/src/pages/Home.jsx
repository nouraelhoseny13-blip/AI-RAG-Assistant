import { useState, useEffect, useRef } from "react";
import ChatBox from "../components/Chat/ChatBox";
import UploadBox from "../components/Upload/UploadBox";
import Sidebar from "../components/Sidebar/Sidebar";
import toast from "react-hot-toast";
import { Mic, MicOff, Send } from "lucide-react";
import { askQuestion } from "../services/api";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8001";

export default function Home() {
  const uploadRef = useRef(null);
  const recognitionRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      role: "ai",
      content:
        "👋 Please upload a PDF file, then ask any question about it.",
    },
  ]);

  const [chatHistory, setChatHistory] = useState(
    JSON.parse(localStorage.getItem("chatHistory")) || []
  );

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [pdfFiles, setPdfFiles] = useState([]);

  const [listening, setListening] = useState(false);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  }, [chatHistory]);

  // 🎤 Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();

    recognition.lang = "ar-EG";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");

      setInput(transcript);
    };

    recognition.onerror = (event) => {
      setListening(false);

      if (event.error === "no-speech") {
        toast.error("No speech detected, try again");
      } else if (event.error === "not-allowed") {
        toast.error("Please allow microphone access in your browser settings");
      } else {
        toast.error("Microphone error occurred");
      }
    };

    recognitionRef.current = recognition;

    // Cleanup when the component unmounts or page closes
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error("Speech recognition is not supported in this browser");
      return;
    }

    try {
      if (listening) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
      }
    } catch (error) {
      // happens if start is called while it's already running
      toast.error("Please try again in a moment");
    }
  };

  // Send Question
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    // Stop listening if the mic is still active before sending
    if (listening) {
      recognitionRef.current?.stop();
    }

    const question = input.trim();

    const userMessage = {
      role: "user",
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);

    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();

      let aiMessage = data.answer || data.error || "Something went wrong";

      if (data.sources && data.sources.length > 0) {
        aiMessage +=
          "\n\n📄 Sources:\n\n" +
          data.sources.join("\n\n----------------\n\n");
      }

      const aiResponse = {
        role: "ai",
        content: aiMessage,
      };

      setMessages((prev) => [...prev, aiResponse]);

      setChatHistory((prev) => [
        ...prev,
        {
          id: Date.now(),
          title: question.slice(0, 30),
          messages: [userMessage, aiResponse],
        },
      ]);
    } catch (error) {
      const errorMessage = error.message?.includes("Failed to fetch")
        ? "❌ Can't reach the server, make sure the backend is running."
        : "❌ Something went wrong while sending your question, please try again.";

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: errorMessage,
        },
      ]);

      toast.error(errorMessage, {
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  // ⌨️ Send on Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "ai",
        content:
          "👋 Please upload a PDF file, then ask any question about it.",
      },
    ]);
  };

  const newChat = () => {
    setMessages([
      {
        role: "ai",
        content: "✨ New chat started. Upload a PDF and ask anything.",
      },
    ]);
  };

  const removePDF = () => {
    setPdfFiles([]);
    setChatHistory([]);
    localStorage.removeItem("chatHistory");

    setMessages([
      {
        role: "ai",
        content:
          "👋 Please upload a PDF file, then ask any question about it.",
      },
    ]);

    toast.success("PDF removed successfully!");
  };

  return (
    <div
      className={`min-h-screen flex transition duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white"
          : "bg-[#0B1B3A] text-white"
      }`}
    >
      <Sidebar
        pdfFiles={pdfFiles}
        setPdfFiles={setPdfFiles}
        removePDF={removePDF}
        uploadRef={uploadRef}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        newChat={newChat}
        clearChat={clearChat}
      />

      <div className="flex-1 p-8 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          🤖 AI RAG Assistant
        </h1>

        <UploadBox
          darkMode={darkMode}
          uploadRef={uploadRef}
          onUploaded={(data) => {
            setPdfFiles((prev) => [
              ...prev,
              {
                name: data.fileName || data.file || "Uploaded PDF",
                chunks: data.chunks || 0,
              },
            ]);

            setMessages((prev) => [
              ...prev,
              {
                role: "ai",
                content: `✅ ${
                  data.fileName || data.file || "PDF"
                } uploaded successfully. You can ask questions now.`,
              },
            ]);

            toast.success(`${data.fileName} uploaded successfully`);

            if (uploadRef.current) {
              uploadRef.current.value = "";
            }
          }}
        />

        <ChatBox messages={messages} darkMode={darkMode} loading={loading} />

        <div className="mt-5 w-full max-w-4xl">
          <div
            className={`flex items-center rounded-2xl shadow-lg border p-2 ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white/10 border-white/20 backdrop-blur-xl"
            }`}
          >
            <input
              autoComplete="off"
              className={`flex-1 p-3 outline-none bg-transparent ${
                "text-white"
              }`}
              placeholder="💬 Ask anything about your document..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />

            <button
              onClick={toggleListening}
              disabled={loading}
              className={`w-11 h-11 rounded-xl mr-2 flex items-center justify-center text-white transition disabled:opacity-50 ${
                listening ? "bg-red-600 animate-pulse" : "bg-blue-600"
              }`}
            >
              {listening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="w-28 h-11 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
              {loading ? "Thinking..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}