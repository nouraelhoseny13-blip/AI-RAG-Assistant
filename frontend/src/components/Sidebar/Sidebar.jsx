import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Moon, Sun, Sparkles, UploadCloud, Trash2 } from "lucide-react";

export default function Sidebar({
  pdfFiles = [],
  removePDF,
  darkMode,
  setDarkMode,
  uploadRef,
  newChat,
}) {
  // بنستخدمها عشان نعرف الملف اللي طالبين تأكيد شيله
  const [confirmRemoveIndex, setConfirmRemoveIndex] = useState(null);

  const handleRemoveClick = (index) => {
    setConfirmRemoveIndex(index);
  };

  const confirmRemove = (index) => {
    removePDF(index);
    setConfirmRemoveIndex(null);
  };

  const cancelRemove = () => {
    setConfirmRemoveIndex(null);
  };

  return (
    <div
      className={`w-80 shrink-0 min-h-screen p-5 transition duration-500 ${
        darkMode ? "bg-black text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🤖 AI RAG
          </h2>

          <p className="text-xs opacity-70 mt-1">Intelligent PDF Assistant</p>
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setDarkMode(!darkMode)}
          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110
          ${darkMode ? "bg-gray-900 hover:bg-gray-800" : "bg-gray-100 hover:bg-gray-200"}`}
        >
          {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-indigo-500" />}
        </motion.button>
      </div>

      {/* New Chat Button */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={newChat}
        className={`w-full mb-5 py-3 rounded-xl font-semibold shadow-md transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2
        ${
          darkMode
            ? "bg-gray-900 hover:bg-gray-800 text-white border border-gray-700"
            : "bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200"
        }`}
      >
        <Sparkles size={16} />
        New Chat
      </motion.button>

      {/* PDF Card */}
      <div
        className={`rounded-2xl p-5 mb-5 shadow-lg border transition-all duration-300
        ${darkMode ? "bg-gray-950 border-gray-800" : "bg-white border-gray-200"}`}
      >
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <FileText size={16} />
          Document
        </h3>

        {pdfFiles.length > 0 ? (
          <>
            <div
              className={`rounded-xl p-3 text-sm break-all flex items-start gap-2 ${
                darkMode ? "bg-blue-500/10" : "bg-blue-50"
              }`}
            >
              <div className="w-8 h-8 shrink-0 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center">
                <FileText size={15} />
              </div>

              <div>
                {pdfFiles[0]?.name}
                <span className="block text-xs opacity-60 mt-1">
                  {pdfFiles[0]?.chunks || 0} chunks
                </span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {confirmRemoveIndex === 0 ? (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`mt-4 rounded-xl p-3 text-sm overflow-hidden ${
                    darkMode ? "bg-red-900/30" : "bg-red-50"
                  }`}
                >
                  <p className="mb-3 font-medium">⚠️ Are you sure you want to remove this PDF?</p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => confirmRemove(0)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-all duration-300"
                    >
                      Yes, remove
                    </button>

                    <button
                      onClick={cancelRemove}
                      className={`flex-1 py-2 rounded-lg transition-all duration-300 ${
                        darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.button
                  key="remove-btn"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRemoveClick(0)}
                  className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <Trash2 size={15} />
                  Remove PDF
                </motion.button>
              )}
            </AnimatePresence>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => uploadRef.current?.click()}
              className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <UploadCloud size={15} />
              Upload New PDF
            </motion.button>
          </>
        ) : (
          <>
            <div className="text-sm opacity-70 mb-4">No document uploaded</div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => uploadRef.current?.click()}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl shadow-md hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <UploadCloud size={16} />
              Upload PDF
            </motion.button>
          </>
        )}
      </div>

      {/* AI Status */}
      <div
        className={`rounded-2xl p-5 mb-5 border shadow-md transition-all duration-300
        ${darkMode ? "bg-green-900/20 border-green-800" : "bg-green-50 border-green-200"}`}
      >
        <h3 className="font-bold text-green-500">🟢 AI Status</h3>

        <p className="text-sm mt-2">
          {pdfFiles.length > 0 ? "PDF uploaded successfully" : "Waiting for PDF..."}
        </p>
      </div>

      {/* RAG Info */}
      <div
        className={`rounded-2xl p-5 border shadow-md transition-all duration-300
        ${darkMode ? "bg-blue-900/20 border-blue-800" : "bg-blue-50 border-blue-200"}`}
      >
        <h3 className="font-bold text-blue-500 mb-3">🧠 RAG Pipeline</h3>

        <div className="space-y-2 text-sm">
          <p>✅ Text Chunking</p>
          <p>✅ Embeddings</p>
          <p>✅ FAISS Vector DB</p>
          <p>✅ Semantic Search</p>
        </div>
      </div>

      {/* Uploaded Documents */}
      <div
        className={`rounded-xl p-4 mt-5 transition-all duration-300 border ${
          darkMode ? "bg-gray-950 border-gray-800" : "bg-gray-50 border-gray-200"
        }`}
      >
        <h3 className="font-semibold mb-3">📂 Uploaded PDFs ({pdfFiles.length})</h3>

        {pdfFiles.length === 0 ? (
          <p className="text-sm opacity-60">No PDFs uploaded yet</p>
        ) : (
          <AnimatePresence>
            {pdfFiles.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-lg p-3 mb-2 flex items-start gap-2 transition-all duration-300 hover:scale-[1.01] border ${
                  darkMode
                    ? "bg-gray-900 hover:bg-gray-800 border-gray-800"
                    : "bg-white hover:bg-gray-50 border-gray-200"
                }`}
              >
                <div className="w-7 h-7 shrink-0 rounded-md bg-red-500/10 text-red-500 flex items-center justify-center">
                  <FileText size={13} />
                </div>

                <div>
                  <p className="text-sm font-medium break-all">{file?.name}</p>
                  <p className="text-xs opacity-60 mt-1">Chunks: {file?.chunks || 0}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}