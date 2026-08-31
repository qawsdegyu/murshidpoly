import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Minus, Bot, Lock, Send, User as UserIcon, Trash2, ExternalLink } from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useAuth } from "@/contexts/AuthContext";
import { performKnowledgeRAG } from "@/services/knowledge-ai";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";


const STRINGS = {
  ar: {
    title: "مُساعد مُرشد الذكي",
    open: "افتح مساعد مُرشد",
    close: "إغلاق",
    minimize: "تصغير",
    placeholder: "اسألني عن أي شيء تريده...",
    welcome: "أهلاً بك يا مهندس! أنا مساعد مرشد الذكي، جاهز للإجابة على استفساراتك حول القوانين والمواد وكل ما يخص الجامعة.",
    thinking: "جاري تحليل القوانين عبر الذكاء الاصطناعي...",
    noAnswer: "عذراً، لم أجد إجابة دقيقة في قاعدة البيانات الحالية. هل يمكنك صياغة السؤال بشكل مختلف؟",
    prefix: "بناءً على الأنظمة والقوانين الجامعية، إليك ما وجدته: ",
    ollamaOffline: "النظام يعمل حالياً بالبحث المحلي.",
    suggestions: [
      "أنا المهندس...",
      "موعد براءة الذمة؟",
      "إسقاط المواد؟",
      "الخطة الدراسية"
    ]
  },
  en: {
    title: "Murshid AI Assistant",
    open: "Open Murshid Assistant",
    close: "Close",
    minimize: "Minimize",
    placeholder: "Ask me anything you want...",
    welcome: "Welcome, Engineer! I am Murshid AI, ready to answer your questions about laws, courses, and everything related to the university.",
    thinking: "Analyzing laws via AI...",
    noAnswer: "Sorry, I couldn't find a precise answer in my database. Could you try rephrasing your question?",
    prefix: "Based on university laws and regulations, here is what I found: ",
    ollamaOffline: "System is currently running on local search.",
    suggestions: [
      "When is the clearance deadline?",
      "How to drop courses?",
      "What is the health insurance coverage?"
    ]
  },
};

interface Message {
  id: string;
  text: string;
  sender: "bot" | "user";
  isLocal?: boolean;
  refCount?: number;
  sources?: { title: string; url?: string | null }[];
}

export default function KnowledgeAssistant({ embedded = false }: { embedded?: boolean } = {}) {
  const { lang, dir } = usePreferences();
  const { user } = useAuth();
  const s = STRINGS[lang];
  const [open, setOpen] = useState(embedded);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [studentName, setStudentName] = useState<string>(() => {
    return localStorage.getItem("murshid_knowledge_student_name") || "";
  });
  const [hasGreeted, setHasGreeted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  // Fail closed while the access setting is loading so Offline hides every entry point.
  const [assistantAllowed, setAssistantAllowed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const checkAssistantAccess = async () => {
      const { data: settings } = await supabase.from("site_settings").select("key,value").in("key", ["knowledge_assistant_enabled", "knowledge_assistant_access_mode", "knowledge_assistant_allowed_emails", "knowledge_assistant_allowed_majors"]).limit(10);
      const config = Object.fromEntries((settings || []).map(row => [row.key, row.value || ""]));
      if (config.knowledge_assistant_enabled === "false") { if (!cancelled) setAssistantAllowed(false); return; }
      const mode = config.knowledge_assistant_access_mode || "all";
      if (mode === "all") { if (!cancelled) setAssistantAllowed(true); return; }
      const email = (user?.email || "").toLowerCase();
      const profileResult = user ? await supabase.from("profiles").select("major").eq("id", user.id).maybeSingle() : { data: null };
      const profile = profileResult.data as { major?: string | null } | null;
      const value = (mode === "emails" ? config.knowledge_assistant_allowed_emails : config.knowledge_assistant_allowed_majors) || "";
      const allowed = value.split(/[\n,]/).map(v => v.trim().toLowerCase()).filter(Boolean);
      const currentMajor = String(profile?.major || user?.user_metadata?.major || "").trim().toLowerCase();
      if (!cancelled) setAssistantAllowed(mode === "emails" ? allowed.includes(email) : allowed.some(item => currentMajor === item || currentMajor.includes(item) || item.includes(currentMajor)));
    };
    const refresh = () => { void checkAssistantAccess(); };
    void checkAssistantAccess();
    window.addEventListener("site-settings-updated", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      cancelled = true;
      window.removeEventListener("site-settings-updated", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [user]);


  useEffect(() => {
    if (user) {
      const metadata = user.user_metadata || {};
      const fullName = metadata.full_name || metadata.name || "المستقبل";
      let name = fullName.split(" ")[0];
      // Clean name from common titles
      name = name.replace(/^(المهندس|مهندس|دكتور|الاستاذ|الأستاذ|المهندسة|مهندسة|Dr\.?|Eng\.?|Engineer|Doctor|Mr\.?|Ms\.?|Mrs\.?)\s*/i, "").trim();

      if (name && name !== studentName) {
        setStudentName(name);
        localStorage.setItem("murshid_knowledge_student_name", name);
      }
    }
  }, [user]);

  useEffect(() => {
    if (messages.length === 0 && open) {
      const greeting = studentName && !["المهندس", "مهندس"].includes(studentName)
        ? (lang === 'ar' ? `أهلاً بك يا مهندس ${studentName}! أنا مساعد مرشد الذكي، كيف بقدر أساعدك اليوم؟` : `Welcome, Engineer ${studentName}! I am Murshid AI, how can I help you today?`)
        : s.welcome;
      setMessages([{ id: "welcome", text: greeting, sender: "bot" }]);
    }
  }, [open, s.welcome, studentName, lang]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, minimized]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (open && chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = { id: Date.now().toString(), text: input, sender: "user" };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const isFirst = messages.length <= 1 && !hasGreeted;
      const aiResponse = await performKnowledgeRAG(input, studentName, isFirst);

      if (isFirst) setHasGreeted(true);

      if (aiResponse.success && aiResponse.answer) {
        // Try to detect if the user introduced themselves
        const introPatterns = [
          /(?:اسمي|ناديلي|أنا|انا|بتقدر تحكيلي)\s+([آ-يa-zA-Z]+)/i,
          /أنا\s+المهندس\s+([آ-يa-zA-Z]+)/i,
          /(?:i am|i'm|my name is|call me)\s+([آ-يa-zA-Z]+)/i
        ];

        let detectedName = "";
        for (const pattern of introPatterns) {
          const match = input.match(pattern);
          if (match && match[1]) {
            detectedName = match[1];
            break;
          }
        }

        if (detectedName && detectedName !== studentName) {
          const cleanName = detectedName.replace(/^(المهندس|مهندس|دكتور|الاستاذ|الأستاذ|المهندسة|مهندسة|Dr\.?|Eng\.?|Engineer|Doctor|Mr\.?|Ms\.?|Mrs\.?)\s*/i, "").trim();
          if (cleanName) {
            setStudentName(cleanName);
            localStorage.setItem("murshid_student_name", cleanName);
          }
        }

        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: aiResponse.answer!,
          sender: "bot",
          refCount: aiResponse.context?.length || 0,
          sources: aiResponse.sources || []
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: s.noAnswer,
          sender: "bot",
          isLocal: true,
          refCount: 0
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: s.noAnswer,
        sender: "bot",
        isLocal: true,
        refCount: 0
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([{ id: "welcome", text: studentName ? (lang === 'ar' ? `أهلاً بك يا مهندس ${studentName}! كيف بقدر أساعدك اليوم؟` : `Welcome, Engineer ${studentName}! How can I help you today?`) : s.welcome, sender: "bot" }]);
    setHasGreeted(false);
  };

  // FAB Position logic
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem("murshid_ai_pos");
    return saved ? JSON.parse(saved) : { x: 0, y: 0 };
  });

  const handleDragEnd = (_: any, info: any) => {
    const screenWidth = window.innerWidth;
    const snapRight = screenWidth - 56 - 48;
    const targetX = info.point.x < screenWidth / 2 ? 0 : snapRight;
    const newPos = { x: targetX, y: position.y + info.offset.y };
    setPosition(newPos);
    localStorage.setItem("murshid_ai_pos", JSON.stringify(newPos));
    setTimeout(() => { isDragging.current = false; }, 150);
  };

  if (!assistantAllowed) return null;

  return (
    <>
      {!embedded && <AnimatePresence>
        {!open && (
          <motion.button
            key="fab"
            drag
            dragMomentum={false}
            onDragStart={() => { isDragging.current = true; }}
            onDragEnd={handleDragEnd}
            animate={{ x: position.x, y: position.y, opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.8 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => { if (!isDragging.current) { setOpen(true); setMinimized(false); } }}
            aria-label={lang === 'ar' ? "مساعد مرشد الذكي" : "Murshid AI Assistant"}
            className="fixed bottom-28 md:bottom-24 left-6 z-[100] h-14 w-14 rounded-full flex items-center justify-center bg-gradient-to-br from-accent to-[#7B3AED] shadow-[0_0_30px_hsl(var(--accent)/0.4)] cursor-grab active:cursor-grabbing"
          >
            <Sparkles className="h-6 w-6 text-accent-foreground stroke-[2.5]" />
            <motion.span className="absolute inset-0 rounded-full bg-accent/40" animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }} transition={{ duration: 2.5, repeat: Infinity }} />
          </motion.button>
        )}
      </AnimatePresence>}

      <AnimatePresence>
        {open && (
          <div className={embedded ? "relative z-10 flex min-h-[600px] w-full items-stretch" : "fixed inset-0 z-[100] pointer-events-none flex items-end md:items-center justify-start md:justify-center p-4 md:p-0"}>
            <motion.div
              key="chat"
              ref={chatRef}
              dir={dir}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={cn(
                "pointer-events-auto rounded-[2rem] overflow-hidden border border-accent/20 bg-card/95 backdrop-blur-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] transition-all duration-500",
                embedded ? "h-full min-h-[600px] w-full" : minimized ? "w-64 h-14" : "w-full md:w-[480px] h-[600px] md:h-[75vh] max-h-[85vh] max-w-full md:max-w-[calc(100vw-4rem)]"
              )}
            >
              {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900/90 border-b border-white/5 text-white">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center ring-1 ring-accent/40">
                  <Bot className="h-4 w-4 text-accent" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-sm font-black tracking-widest uppercase text-accent leading-none mb-1">{s.title}</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] md:text-[11px] font-bold text-white/40 uppercase tracking-tighter">
                      Cloud Powered
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={clearChat} className="h-8 w-8 rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors text-white/60 hover:text-white"><Trash2 className="h-4 w-4" /></button>
                <button onClick={() => setMinimized(!minimized)} className="h-8 w-8 rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors text-white/60 hover:text-white"><Minus className="h-4 w-4" /></button>
                {!embedded && <button onClick={() => setOpen(false)} className="h-8 w-8 rounded-xl flex items-center justify-center hover:bg-red-500/20 transition-colors text-white/60 hover:text-red-400"><X className="h-4 w-4" /></button>}
              </div>
            </div>

            {!minimized && (
              <div className="flex flex-col h-[calc(100%-64px)]">
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                  {user ? (
                    <>
                      {messages.map((msg) => (
                        <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cn("flex gap-3", msg.sender === 'user' ? "flex-row-reverse" : "flex-row")}>
                          <div className={cn("h-8 w-8 rounded-full flex items-center justify-center shrink-0 shadow-sm", msg.sender === 'user' ? "bg-accent" : "bg-slate-800")}>
                            {msg.sender === 'user' ? <UserIcon className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-accent" />}
                          </div>
                          <div
                            dir={lang === 'ar' ? 'rtl' : 'ltr'}
                            className={cn(
                              "max-w-[85%] px-4 py-3 rounded-2xl text-xs md:text-sm font-bold leading-relaxed shadow-lg transition-all",
                              msg.sender === 'user' ? "bg-accent text-white rounded-tr-none" : "bg-white dark:bg-white/5 border border-border/50 text-foreground rounded-tl-none",
                              lang === 'ar' ? "text-right" : "text-left"
                            )}
                            style={{ unicodeBidi: "plaintext" }}
                          >
                            {/* Simple Markdown Renderer */}
                            <div className="space-y-2">
                              {msg.text.split('\n').map((line, i) => {
                                // Handle Headers
                                if (line.startsWith('### ')) {
                                  return <h3 key={i} className="text-sm font-black text-accent mt-4 mb-2 uppercase tracking-wider">{line.replace('### ', '')}</h3>;
                                }
                                if (line.startsWith('## ')) {
                                  return <h2 key={i} className="text-base font-black text-accent mt-5 mb-3 border-b border-accent/20 pb-1">{line.replace('## ', '')}</h2>;
                                }

                                // Handle Bullet Points
                                if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
                                  return (
                                    <div key={i} className="flex gap-2 items-start mt-1">
                                      <span className="text-accent mt-1.5 shrink-0">•</span>
                                      <p className="leading-relaxed">{line.trim().substring(2)}</p>
                                    </div>
                                  );
                                }

                                // Handle Bold Text **text**
                                const parts = line.split(/(\*\*.*?\*\*)/g);
                                return (
                                  <p key={i} className={cn(i > 0 ? "mt-1.5" : "", "leading-relaxed")}>
                                    {parts.map((part, index) => {
                                      if (part.startsWith('**') && part.endsWith('**')) {
                                        return <strong key={index} className="text-accent font-black">{part.slice(2, -2)}</strong>;
                                      }
                                      return part;
                                    })}
                                  </p>
                                );
                              })}
                            </div>

                            {msg.sender === 'bot' && msg.sources && msg.sources.length > 0 && (
                              <div className="mt-3 border-t border-black/5 pt-3 dark:border-white/5">
                                <div className="mb-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-accent/80"><ExternalLink className="h-3 w-3" />{lang === 'ar' ? "المصادر المستخدمة" : "Sources used"}</div>
                                <div className="flex flex-wrap gap-1.5">
                                  {msg.sources.map((source, index) => source.url ? (
                                    <a key={`${source.title}-${index}`} href={source.url} target="_blank" rel="noreferrer" className="inline-flex max-w-full items-center gap-1 rounded-lg border border-accent/20 bg-accent/5 px-2 py-1 text-[10px] font-bold text-accent transition-colors hover:bg-accent/15"><span className="max-w-[220px] truncate">{source.title}</span><ExternalLink className="h-2.5 w-2.5 shrink-0" /></a>
                                  ) : <span key={`${source.title}-${index}`} className="max-w-full rounded-lg border border-border/50 bg-muted/30 px-2 py-1 text-[10px] font-bold text-muted-foreground"><span className="max-w-[220px] truncate">{source.title}</span></span>)}
                                </div>
                              </div>
                            )}

                            {/* Suggestions for Welcome Message */}
                            {msg.id === 'welcome' && s.suggestions && (
                              <div className="mt-3 flex flex-wrap gap-1.5 items-center">
                                {s.suggestions.map((suggest: string) => (
                                  <button
                                    key={suggest}
                                    onClick={() => {
                                      setInput(suggest);
                                      setTimeout(() => document.getElementById('murshid-knowledge-send-btn')?.click(), 50);
                                    }}
                                    className="px-2 py-1.5 bg-accent/10 border border-accent/20 rounded-lg text-[10px] md:text-xs font-black text-accent hover:bg-accent/20 transition-all whitespace-nowrap"
                                  >
                                    {suggest}
                                  </button>
                                ))}
                              </div>
                            )}

                            {/* Message Footer / Metadata */}
                            <div className="mt-3 pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-4">
                              {msg.sender === 'bot' && msg.refCount !== undefined && msg.refCount > 0 && (
                                <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-black uppercase tracking-tighter text-accent/70 bg-accent/5 px-2 py-0.5 rounded-md">
                                  <Sparkles className="w-2.5 h-2.5" />
                                  <span>{lang === 'ar' ? `${msg.refCount} مراجع تم تحليلها` : `${msg.refCount} References Analyzed`}</span>
                                </div>
                              )}
                              {msg.isLocal && (
                                <span className="text-[10px] md:text-xs opacity-40 font-bold italic uppercase tracking-widest">{lang === 'ar' ? "محرك محلي" : "Local Engine"}</span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      {isTyping && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 items-center">
                          <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center"><Bot className="h-4 w-4 text-accent animate-pulse" /></div>
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-bold text-accent/60 animate-pulse uppercase tracking-widest">{s.thinking}</span>
                            <div className="flex gap-1">
                              {[0, 1, 2].map(i => <motion.span key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} className="w-1.5 h-1.5 rounded-full bg-accent" />)}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <Lock className="h-14 w-14 text-accent mb-6 opacity-20" />
                      <h4 className="font-black text-xl mb-2">{lang === 'ar' ? "وصول خاص" : "Private Access"}</h4>
                      <p className="text-sm text-muted-foreground font-bold px-8 leading-relaxed mb-8">{lang === 'ar' ? "يرجى تسجيل الدخول لتفعيل قدرات مُرشد الذكية." : "Sign in to activate Murshid AI capabilities."}</p>
                      <a href="/auth" className="px-10 py-3.5 bg-accent text-white rounded-2xl font-black text-sm shadow-xl hover:scale-105 transition-all">Login Now</a>
                    </div>
                  )}
                </div>

                {user && (
                  <div className="p-6 border-t border-border/40 bg-white/30 dark:bg-black/20 backdrop-blur-md">
                    <div className="relative flex items-center gap-2">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={s.placeholder}
                        disabled={isTyping}
                        className="flex-1 bg-background border border-border/60 rounded-xl py-3 px-4 text-xs md:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all shadow-inner disabled:opacity-50 min-w-0"
                      />
                      <button
                        id="murshid-knowledge-send-btn"
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping}
                        className="h-11 w-16 md:w-20 rounded-xl bg-slate-900 text-accent flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 border border-accent/20 shrink-0"
                      >
                        <Send className="h-4 w-4 rtl:rotate-180" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
        )}
      </AnimatePresence>
    </>
  );
}
