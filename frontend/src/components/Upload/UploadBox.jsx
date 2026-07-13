import { uploadPDF } from "../../services/api";
import { useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, UploadCloud, Loader2, CheckCircle2 } from "lucide-react";

export default function UploadBox({ onUploaded, darkMode, uploadRef }) {
  const [loading, setLoading] = useState(false);
  const [uploadingName, setUploadingName] = useState("");
  const [dragging, setDragging] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);

  const upload = async (file) => {
    if (!file) return;

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      toast.error("Please upload a PDF file only.");
      return;
    }

    // 20MB limit, adjust if needed
    if (file.size > 20 * 1024 * 1024) {
      toast.error("File is too large. Max size is 20MB.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setUploadingName(file.name);

    try {
      const res = await fetch(uploadPDF, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();

      setFileInfo({
        name: file.name,
        size: (file.size / 1024).toFixed(2) + " KB",
        chunks: data.chunks || 0,
      });

      toast.success(
        `"${file.name}" uploaded and indexed successfully! (${data.chunks || 0} chunks)`
      );

      if (onUploaded) {
        onUploaded({
          fileName: file.name,
          chunks: data.chunks,
          vectors: data.chunks,
          status: "Indexed Successfully",
        });
      }
    } catch (err) {
      const message = err.message?.includes("Failed to fetch")
        ? "Can't reach the server. Please make sure the backend is running."
        : "Failed to upload PDF. Please try again.";

      toast.error(message);
    } finally {
      setLoading(false);
      setUploadingName("");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    const files = Array.from(e.dataTransfer.files);

    files.forEach((file) => {
      upload(file);
    });
  };

  return (
    <div className="w-full max-w-4xl mb-6">
      <motion.div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => {
          setDragging(false);
        }}
        onDrop={handleDrop}
        animate={{ scale: dragging ? 1.02 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`relative overflow-hidden rounded-3xl p-[2px] transition-colors duration-300 ${
          dragging
            ? "bg-gradient-to-r from-green-400 to-emerald-600"
            : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
        }`}
      >
        <div
          className={`rounded-3xl p-10 text-center transition ${
            darkMode ? "bg-gray-950 text-white" : "bg-white/80 text-gray-900 backdrop-blur"
          }`}
        >
          <input
            ref={uploadRef}
            id="pdf"
            type="file"
            accept=".pdf"
            multiple
            hidden
            disabled={loading}
            onChange={(e) => {
              const files = Array.from(e.target.files);

              files.forEach((file) => {
                upload(file);
              });

              // reset input so the same file can be re-selected later
              e.target.value = "";
            }}
          />

          <label
            htmlFor="pdf"
            className={`cursor-pointer ${loading ? "pointer-events-none opacity-70" : ""}`}
          >
            <div className="flex justify-center mb-5">
              <motion.div
                animate={{ y: dragging ? -6 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-xl hover:scale-110 transition"
              >
                <UploadCloud size={40} />
              </motion.div>
            </div>

            <h2 className="text-2xl font-bold">Upload your PDF</h2>

            <p className="opacity-70 mt-2">
              Drag & Drop your document here
              <br />
              or click to browse
            </p>

            <AnimatePresence mode="wait">
              {fileInfo && !loading && (
                <motion.div
                  key="fileInfo"
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`mt-6 inline-flex items-center gap-3 rounded-2xl p-4 ${
                    darkMode ? "bg-green-900/30" : "bg-green-100"
                  }`}
                >
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                    <FileText size={20} />
                  </div>

                  <div className="text-left">
                    <p
                      className={`font-semibold text-sm flex items-center gap-1 ${
                        darkMode ? "text-green-300" : "text-green-700"
                      }`}
                    >
                      <CheckCircle2 size={14} />
                      {fileInfo.name}
                    </p>

                    <span className="text-xs opacity-70">
                      {fileInfo.size}
                      {fileInfo.chunks ? ` • ${fileInfo.chunks} chunks indexed` : ""}
                    </span>
                  </div>
                </motion.div>
              )}

              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-5 flex flex-col items-center gap-2"
                >
                  <Loader2 className="animate-spin text-blue-500" size={28} />
                  <span className="text-blue-500 font-bold text-sm">
                    Processing {uploadingName || "PDF"}...
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </label>
        </div>
      </motion.div>
    </div>
  );
}