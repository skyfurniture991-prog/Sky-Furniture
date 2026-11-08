import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "../ui/Icon";
import { sendChatMessage } from "../../lib/deepseek";
import { waLink } from "../../data/store";

const QUICK_PROMPTS = [
  { label: "⭐ Rekomendasi Sofa", query: "Beri saya rekomendasi sofa terbaik untuk ruang tamu keluarga" },
  { label: "🚚 Info Ongkir", query: "Apakah ada gratis ongkir dan berapa lama pengirimannya?" },
  { label: "🛡️ Garansi & Bahan", query: "Bagaimana garansi dan kualitas rangka serta busanya?" },
  { label: "🎁 Kode Promo", query: "Ada kode promo atau diskon apa yang bisa dipakai hari ini?" },
  { label: "✨ Custom Warna & Ukuran", query: "Apakah bisa request custom warna, bahan, atau ukuran khusus?" },
];

const INITIAL_MESSAGES = [
  {
    role: "assistant",
    content:
      "Halo! Saya **SkyBot**, asisten AI resmi dari **Sky Furniture** 🛋️✨\n\nAda yang bisa saya bantu seputar pemilihan model sofa, ukuran ruangan, opsi bahan, garansi 5 tahun, atau info promo hari ini?",
    time: "Baru saja",
  },
];

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem("sky.chatbot.messages.v3");
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });
  const [notice, setNotice] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    try {
      sessionStorage.setItem("sky.chatbot.messages.v3", JSON.stringify(messages));
    } catch {}
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const handleSend = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg = {
      role: "user",
      content: text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Siapkan payload riwayat pesan untuk API
      const apiHistory = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await sendChatMessage(apiHistory);
      if (res.notice) setNotice(res.notice);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.text,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Maaf, terjadi kendala saat memproses jawaban. Silakan coba kembali atau hubungi admin via WhatsApp.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages(INITIAL_MESSAGES);
    setNotice("");
    try {
      sessionStorage.removeItem("sky.chatbot.messages.v3");
    } catch {}
  };

  /** Format teks dengan Markdown sederhana (bold, link internal / eksternal) */
  const renderFormattedText = (raw) => {
    return raw.split("\n").map((line, lineIdx) => {
      // Parse markdown link [text](url) dan **bold**
      const parts = [];
      let remainder = line;
      let keyCounter = 0;

      // Regex untuk mendeteksi [label](url) dan **bold**
      const combinedRegex = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
      let match;
      let lastIndex = 0;

      while ((match = combinedRegex.exec(remainder)) !== null) {
        if (match.index > lastIndex) {
          parts.push(remainder.substring(lastIndex, match.index));
        }

        if (match[1] && match[2]) {
          // Link [label](url)
          const label = match[1];
          const url = match[2];
          if (url.startsWith("/")) {
            parts.push(
              <Link
                key={`link-${lineIdx}-${keyCounter++}`}
                to={url}
                onClick={() => setIsOpen(false)}
                className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
              >
                {label}
              </Link>
            );
          } else {
            parts.push(
              <a
                key={`ext-${lineIdx}-${keyCounter++}`}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
              >
                {label}
              </a>
            );
          }
        } else if (match[3]) {
          // **Bold**
          parts.push(
            <strong key={`bold-${lineIdx}-${keyCounter++}`} className="font-semibold text-on-surface">
              {match[3]}
            </strong>
          );
        }

        lastIndex = combinedRegex.lastIndex;
      }

      if (lastIndex < remainder.length) {
        parts.push(remainder.substring(lastIndex));
      }

      return (
        <span key={`line-${lineIdx}`} className="block leading-relaxed">
          {parts.length > 0 ? parts : "\u00A0"}
        </span>
      );
    });
  };

  return (
    <>
      {/* Tombol FAB Utama (Melayang di Pojok Kanan Bawah) */}
      <motion.button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Tutup Chat AI" : "Buka Chatbot AI SkyBot"}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 18 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-6 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-sky-500 text-white shadow-2xl transition-all hover:shadow-primary/30"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/30 [animation-duration:3s]" />
        {isOpen ? (
          <Icon name="close" className="relative text-2xl" />
        ) : (
          <div className="relative flex items-center justify-center">
            <Icon name="smart_toy" className="text-2xl" />
            <span className="absolute -right-1 -top-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
            </span>
          </div>
        )}
      </motion.button>

      {/* Jendela Chat Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.95 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed bottom-24 right-4 z-40 flex h-[560px] max-h-[82vh] w-[92vw] max-w-[390px] flex-col overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface shadow-2xl backdrop-blur-md sm:right-6"
          >
            {/* Header Chat */}
            <div className="flex items-center justify-between border-b border-outline-variant/20 bg-gradient-to-r from-primary to-sky-600 px-4 py-3 text-white">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white shadow-inner">
                  <Icon name="smart_toy" className="text-2xl" />
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-primary bg-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-headline-sm text-sm font-semibold tracking-wide">
                    SkyBot AI
                    <span className="rounded bg-white/20 px-1.5 py-0.2 text-[10px] font-medium text-sky-100">
                      DeepSeek
                    </span>
                  </div>
                  <p className="text-[11px] text-sky-100">Konsultan Furnitur Sky Furniture</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleReset}
                  title="Reset percakapan"
                  className="rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
                >
                  <Icon name="refresh" className="text-lg" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Tutup chat"
                  className="rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
                >
                  <Icon name="close" className="text-lg" />
                </button>
              </div>
            </div>

            {/* Area Notifikasi / Warning Fallback jika diperlukan */}
            {notice && (
              <div className="flex items-start gap-2 border-b border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-[11px] text-amber-800 dark:text-amber-200">
                <Icon name="info" className="mt-0.5 text-xs text-amber-600 dark:text-amber-400" />
                <span className="flex-1 leading-snug">{notice}</span>
              </div>
            )}

            {/* Riwayat Pesan */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4 text-xs">
              {messages.map((m, idx) => {
                const isUser = m.role === "user";
                return (
                  <div
                    key={idx}
                    className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-sm ${
                        isUser
                          ? "rounded-tr-xs bg-primary text-white"
                          : "rounded-tl-xs border border-outline-variant/30 bg-surface-container-high text-on-surface"
                      }`}
                    >
                      {renderFormattedText(m.content)}
                    </div>
                    {m.time && (
                      <span className="mt-1 px-1 text-[10px] text-outline">
                        {m.time}
                      </span>
                    )}
                  </div>
                );
              })}

              {loading && (
                <div className="flex items-center gap-2 rounded-2xl rounded-tl-xs border border-outline-variant/30 bg-surface-container-high px-3.5 py-2.5 text-outline">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                  <span className="ml-1 text-[11px]">SkyBot sedang berpikir...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div className="border-t border-outline-variant/20 bg-surface-container-low px-3 py-2">
              <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-0.5">
                {QUICK_PROMPTS.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={loading}
                    onClick={() => handleSend(p.query)}
                    className="shrink-0 rounded-full border border-outline-variant/40 bg-surface px-2.5 py-1 text-[11px] font-medium text-on-surface-variant transition-colors hover:border-primary hover:bg-primary-container hover:text-on-primary-container disabled:opacity-50"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Pesan & Tombol Kirim */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="border-t border-outline-variant/20 bg-surface p-2.5"
            >
              <div className="flex items-center gap-2 rounded-xl border border-outline-variant/40 bg-surface-container px-3 py-1.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Tanya sofa, ukuran, bahan, promo..."
                  disabled={loading}
                  className="flex-1 bg-transparent text-xs text-on-surface placeholder:text-outline focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white transition-opacity hover:opacity-90 disabled:opacity-30"
                  aria-label="Kirim pesan"
                >
                  <Icon name="send" className="text-sm" />
                </button>
              </div>

              {/* Tautan Alternatif CS WhatsApp */}
              <div className="mt-1.5 flex items-center justify-between px-1 text-[10px] text-outline">
                <span>Didukung oleh DeepSeek AI</span>
                <a
                  href={waLink("Halo admin Sky Furniture, saya ingin konsultasi langsung dengan CS.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-0.5 text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  <span className="font-medium">CS WhatsApp</span>
                  <Icon name="open_in_new" className="text-[10px]" />
                </a>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

