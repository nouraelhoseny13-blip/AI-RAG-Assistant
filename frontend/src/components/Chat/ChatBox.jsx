import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, ArrowDownCircle, FileText, Bot, User } from "lucide-react";

function AvatarAI() {
  return (
    <div className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-white shadow-md bg-gradient-to-br from-blue-600 to-purple-600">
      <Bot size={18} />
    </div>
  );
}

function AvatarUser({ darkMode }) {
  return (
    <div
      className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center shadow-md ${
        darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-700"
      }`}
    >
      <User size={16} />
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-current opacity-70"
          animate={{ y: [0, -4, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default function ChatBox({ messages, darkMode, loading }) {
  const chatEndRef = useRef(null);

  const [autoScroll, setAutoScroll] = useState(true);
  const [speakingIndex, setSpeakingIndex] = useState(null);

  useEffect(() => {
    if (autoScroll) {
      chatEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages, autoScroll, loading]);

  // Stop any ongoing speech when the component unmounts (e.g. navigating away)
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // 🔊 Text-to-Speech
  const speak = (text, index) => {
    if (!window.speechSynthesis) {
      return;
    }

    // If this message is already being read, stop it
    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }

    // Cancel any ongoing speech before starting a new one
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "en-US";
    utterance.rate = 1;

    utterance.onend = () => {
      setSpeakingIndex(null);
    };

    utterance.onerror = () => {
      setSpeakingIndex(null);
    };

    setSpeakingIndex(index);

    window.speechSynthesis.speak(utterance);
  };

  // Split an AI message into the main answer and its sources (if any)
  const splitAnswerAndSources = (content) => {
    const marker = "📄 Sources:";

    const markerIndex = content.indexOf(marker);

    if (markerIndex === -1) {
      return { answer: content, sources: [] };
    }

    const answer = content.slice(0, markerIndex).trim();

    const sourcesText = content.slice(markerIndex + marker.length).trim();

    const sources = sourcesText
      .split("----------------")
      .map((s) => s.trim())
      .filter(Boolean);

    return { answer, sources };
  };

  const bubbleClasses = (isAI) =>
    `px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words shadow-sm ${
      isAI
        ? darkMode
          ? "bg-gray-800/80 text-gray-100 rounded-tl-sm border border-gray-700"
          : "bg-white text-gray-800 rounded-tl-sm border border-gray-100"
        : "bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-tr-sm"
    }`;

  return (
    <div
      className={`w-full max-w-4xl h-[520px] overflow-y-auto rounded-3xl shadow-xl border p-6 space-y-5 transition duration-500 ${
        darkMode ? "bg-gray-950/80 border-gray-800" : "bg-white/70 border-white"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white">
            <Bot size={20} />
          </div>

          <div>
            <h3 className={`font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
              AI Assistant
            </h3>

            <p className="text-xs opacity-60">Ask anything about your document</p>
          </div>
        </div>

        <button
          onClick={() => setAutoScroll((prev) => !prev)}
          title={autoScroll ? "Auto scroll: On" : "Auto scroll: Off"}
          className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition ${
            autoScroll
              ? "bg-blue-600 text-white border-blue-600"
              : darkMode
              ? "border-gray-700 text-gray-300"
              : "border-gray-300 text-gray-600"
          }`}
        >
          <ArrowDownCircle size={14} />
          Auto Scroll
        </button>
      </div>

      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => {
            const isAI = msg.role === "ai";

            const { answer, sources } = isAI
              ? splitAnswerAndSources(msg.content)
              : { answer: msg.content, sources: [] };

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={`flex items-start gap-3 ${
                  isAI ? "justify-start" : "justify-end"
                }`}
              >
                {isAI && <AvatarAI />}

                <div
                  className={`flex flex-col max-w-[75%] ${
                    isAI ? "items-start" : "items-end"
                  }`}
                >
                  <div className="relative group">
                    <div className={bubbleClasses(isAI)}>{answer}</div>

                    {isAI && (
                      <button
                        onClick={() => speak(answer, index)}
                        title={speakingIndex === index ? "Stop reading" : "Read message aloud"}
                        className={`absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center transition opacity-0 group-hover:opacity-100 ${
                          speakingIndex === index
                            ? "bg-red-600 text-white opacity-100"
                            : darkMode
                            ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {speakingIndex === index ? (
                          <VolumeX size={13} />
                        ) : (
                          <Volume2 size={13} />
                        )}
                      </button>
                    )}
                  </div>

                  {sources.length > 0 && (
                    <div className="mt-2 grid gap-2 w-full sm:grid-cols-2">
                      {sources.map((source, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className={`p-3 rounded-xl border text-xs leading-relaxed ${
                            darkMode
                              ? "bg-gray-900/60 border-gray-800 text-gray-300"
                              : "bg-blue-50/60 border-blue-100 text-gray-600"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 font-semibold opacity-70 mb-1 text-[11px]">
                            <FileText size={12} />
                            Source {i + 1}
                          </div>
                          <p className="line-clamp-4">{source}</p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {!isAI && <AvatarUser darkMode={darkMode} />}
              </motion.div>
            );
          })}

          {loading && (
            <motion.div
              key="typing-indicator"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-3 justify-start"
            >
              <AvatarAI />
              <div className={bubbleClasses(true)}>
                <TypingDots />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div ref={chatEndRef} />
    </div>
  );
}