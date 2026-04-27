import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Minus, Send, Bot } from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
}

const STRINGS = {
  ar: {
    title: "مُساعد مُرشد الذكي",
    placeholder: "اكتب سؤالك هنا...",
    welcome: "أهلاً بك يا مهندس! أنا مُرشد، كيف يمكنني مساعدتك في رحلتك في البوليتكنك اليوم؟",
    open: "افتح مساعد مُرشد",
    close: "إغلاق",
    minimize: "تصغير",
    send: "إرسال",
    aiName: "مُرشد AI",
    typing: "يكتب",
  },
  en: {
    title: "Murshid AI Assistant",
    placeholder: "Type your question...",
    welcome: "Welcome engineer! I'm Murshid — how can I help you on your Polytechnic journey today?",
    open: "Open Murshid Assistant",
    close: "Close",
    minimize: "Minimize",
    send: "Send",
    aiName: "Murshid AI",
    typing: "typing",
  },
};

const MOCK_REPLIES_AR = [
  "سؤال ممتاز! يمكنك مراجعة خزنة المساقات للحصول على ملخصات وأسئلة سابقة لهذا المساق.",
  "بناءً على خطتك الدراسية في البوليتكنك، أنصحك بالتسجيل لـ 15-18 ساعة هذا الفصل.",
  "تستطيع حساب معدلك التراكمي بدقة من خلال صفحة 'حاسبة المعدل' في القائمة الجانبية.",
  "تحقق من قسم 'الترفيه والخدمات' للعثور على أقرب مطعم أو كافيه قرب الكلية في ماركا.",
];
const MOCK_REPLIES_EN = [
  "Great question! Check the Course Vault for summaries and past papers.",
  "Based on your Polytechnic plan, I'd suggest registering 15–18 credit hours this semester.",
  "You can compute your CGPA precisely on the GPA Calculator page in the sidebar.",
  "Check Student Life to find the nearest restaurant or café around the Polytechnic in Marka.",
];

export default function MurshidAssistant() {
  const { lang, dir } = usePreferences();
  const s = STRINGS[lang];
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Seed welcome message on first open
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ id: crypto.randomUUID(), role: "ai", content: s.welcome }]);
    }
  }, [open, messages.length, s.welcome]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, thinking, minimized]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || thinking) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setThinking(true);
    const pool = lang === "ar" ? MOCK_REPLIES_AR : MOCK_REPLIES_EN;
    const reply = pool[Math.floor(Math.random() * pool.length)];
    setTimeout(() => {
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: "ai", content: reply }]);
      setThinking(false);
    }, 1100 + Math.random() * 800);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <>
      {/* Floating Action Button — breathing gold orb */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="fab"
            onClick={() => { setOpen(true); setMinimized(false); }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
            aria-label={s.open}
            className="fixed bottom-24 left-8 z-[100] h-14 w-14 rounded-full flex items-center justify-center bg-gradient-to-br from-accent via-accent to-amber-500 shadow-[0_0_25px_hsl(var(--accent)/0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background group"
          >
            {/* Breathing rings */}
            <span className="absolute inset-0 rounded-full bg-accent/40 animate-pulse scale-150 blur-md pointer-events-none" />
            <motion.span
              className="absolute inset-0 rounded-full bg-accent/50"
              animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.span
              className="absolute inset-0 rounded-full bg-accent/40"
              animate={{ scale: [1, 2.2, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
            />
            <motion.span
              animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 flex"
            >
              <Sparkles className="h-6 w-6 text-accent-foreground stroke-[2.5]" />
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat"
            dir={dir}
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{ width: 350 }}
            className="fixed bottom-8 left-8 z-[100] rounded-2xl overflow-hidden border border-accent/40 bg-card/80 backdrop-blur-xl shadow-[0_10px_40px_-10px_hsl(var(--accent)/0.4)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-primary/95 border-b border-accent/30">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center ring-1 ring-accent/50">
                  <Bot className="h-4 w-4 text-accent" />
                </div>
                <h3 className="text-sm font-semibold text-accent drop-shadow-[0_0_6px_hsl(var(--accent)/0.6)]">
                  {s.title}
                </h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMinimized(m => !m)}
                  aria-label={s.minimize}
                  className="h-7 w-7 rounded-md flex items-center justify-center text-primary-foreground/80 hover:bg-accent/20 hover:text-accent transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  aria-label={s.close}
                  className="h-7 w-7 rounded-md flex items-center justify-center text-primary-foreground/80 hover:bg-destructive/30 hover:text-destructive-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {!minimized && (
                <motion.div
                  key="body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col"
                >
                  {/* Messages */}
                  <div
                    ref={scrollRef}
                    className="h-[300px] overflow-y-auto px-3 py-3 space-y-3 bg-background/40"
                  >
                    {messages.map((m) => (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {m.role === "ai" && (
                          <div className="h-7 w-7 shrink-0 rounded-full bg-primary flex items-center justify-center ring-1 ring-accent/50">
                            <Bot className="h-3.5 w-3.5 text-accent" />
                          </div>
                        )}
                        <div
                          className={
                            m.role === "ai"
                              ? "max-w-[78%] rounded-2xl rounded-tr-sm px-3 py-2 text-xs leading-relaxed bg-primary/90 text-accent border border-accent/30 shadow-sm"
                              : "max-w-[78%] rounded-2xl rounded-tl-sm px-3 py-2 text-xs leading-relaxed bg-transparent text-foreground/90 border border-border"
                          }
                        >
                          {m.role === "ai" && (
                            <div className="text-[10px] font-semibold text-accent/80 mb-1">
                              {s.aiName}
                            </div>
                          )}
                          {m.content}
                        </div>
                      </motion.div>
                    ))}

                    {thinking && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-2 justify-start"
                      >
                        <div className="h-7 w-7 shrink-0 rounded-full bg-primary flex items-center justify-center ring-1 ring-accent/50">
                          <Bot className="h-3.5 w-3.5 text-accent" />
                        </div>
                        <div className="rounded-2xl rounded-tr-sm px-3 py-2 bg-primary/90 border border-accent/30">
                          <div className="flex items-center gap-1">
                            {[0, 1, 2].map(i => (
                              <motion.span
                                key={i}
                                className="h-1.5 w-1.5 rounded-full bg-accent"
                                animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                                transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Input */}
                  <div className="flex items-center gap-2 p-3 border-t border-accent/20 bg-card/60">
                    <input
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={onKey}
                      placeholder={s.placeholder}
                      dir={dir}
                      className="flex-1 h-9 rounded-full bg-background/60 border border-border px-3 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || thinking}
                      aria-label={s.send}
                      className="h-9 w-9 shrink-0 rounded-full bg-accent text-accent-foreground flex items-center justify-center hover:shadow-[0_0_16px_hsl(var(--accent)/0.6)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className={`h-4 w-4 ${dir === "rtl" ? "-scale-x-100" : ""}`} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
