import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Minus, Bot, Lock } from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useAuth } from "@/contexts/AuthContext";

const STRINGS = {
  ar: {
    title: "مُساعد مُرشد الذكي",
    open: "افتح مساعد مُرشد",
    close: "إغلاق",
    minimize: "تصغير",
  },
  en: {
    title: "Murshid AI Assistant",
    open: "Open Murshid Assistant",
    close: "Close",
    minimize: "Minimize",
  },
};

export default function MurshidAssistant() {
  const { lang, dir } = usePreferences();
  const { user } = useAuth();
  const s = STRINGS[lang];
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const isDragging = useRef(false);
  
  // Persistence logic for FAB position
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem("murshid_ai_pos");
    return saved ? JSON.parse(saved) : { x: 0, y: 0 };
  });

  const handleDragStart = () => {
    isDragging.current = true;
  };

  const handleDragEnd = (_: any, info: any) => {
    const screenWidth = window.innerWidth;
    const fabWidth = 56; // 14 * 4
    const margin = 24;
    
    // Calculate final X position relative to viewport
    const currentX = position.x + info.offset.x;
    const currentY = position.y + info.offset.y;

    // Snap to nearest vertical edge
    // Since it's fixed bottom-24 left-8 initially
    // The initial left is 32px (8 * 4)
    // We want to snap to left (32px) or right (screenWidth - fabWidth - 32px)
    
    const snapLeft = 0;
    const snapRight = screenWidth - fabWidth - (margin * 2); // adjusted for container padding or offset
    
    // Simplified: snap to left/right 5% margin
    const targetX = info.point.x < screenWidth / 2 ? 0 : snapRight;
    
    const newPos = { x: targetX, y: currentY };
    setPosition(newPos);
    localStorage.setItem("murshid_ai_pos", JSON.stringify(newPos));

    setTimeout(() => {
      isDragging.current = false;
    }, 150);
  };

  return (
    <>
      {/* Floating Action Button — breathing gold orb */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="fab"
            drag
            dragMomentum={false}
            dragElastic={0.1}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            animate={{ 
              x: position.x, 
              y: position.y,
              opacity: 1, 
              scale: 1 
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{ 
              willChange: "transform, opacity",
              touchAction: "none" // Essential for dragging on mobile
            }}
            onClick={(e) => { 
              if (isDragging.current) {
                e.preventDefault();
                return;
              }
              setOpen(true); 
              setMinimized(false); 
            }}
            aria-label={s.open}
            className="fixed bottom-24 left-6 z-[100] h-14 w-14 rounded-full flex items-center justify-center bg-gradient-to-br from-accent via-accent to-amber-500 shadow-[0_0_20px_hsl(var(--accent)/0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background group cursor-grab active:cursor-grabbing"
          >
            {/* Breathing rings - Optimized */}
            <span className="absolute inset-0 rounded-full bg-accent/30 animate-pulse scale-125 blur-md pointer-events-none hidden md:block" />
            <motion.span
              className="absolute inset-0 rounded-full bg-accent/40"
              animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
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
                <h3 className="text-sm font-semibold text-primary-foreground drop-shadow-[0_0_6px_hsl(var(--accent)/0.6)]">
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
                  className="flex flex-col h-[350px] bg-background/40"
                >
                  {user ? (
                     <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                       <motion.div 
                         animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                         transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                       >
                         <Bot className="h-20 w-20 text-accent mb-6 opacity-80 drop-shadow-[0_0_15px_hsl(var(--accent)/0.3)]" />
                       </motion.div>
                       <h4 className="text-2xl font-black text-foreground mb-3">{lang === 'ar' ? "قريباً جداً!" : "Coming Soon!"}</h4>
                       <p className="text-sm text-muted-foreground font-bold leading-relaxed">
                         {lang === 'ar' 
                           ? "نعمل حالياً على تدريب مُرشد ليكون المساعد الذكي الأفضل لطلاب الهندسة. ترقبوا الإطلاق قريباً!" 
                           : "We are currently training Murshid to be the best AI assistant for engineering students. Stay tuned!"}
                       </p>
                     </div>
                  ) : (
                     <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                       <Lock className="h-16 w-16 text-muted-foreground mb-5 opacity-40" />
                       <h4 className="text-xl font-black text-foreground mb-3">{lang === 'ar' ? "وصول مقيد" : "Access Restricted"}</h4>
                       <p className="text-sm text-muted-foreground font-bold mb-8 leading-relaxed">
                         {lang === 'ar' 
                           ? "يرجى تسجيل الدخول للوصول إلى المساعد الذكي ورؤية التحديثات القادمة." 
                           : "Please log in to access the AI assistant and see upcoming updates."}
                       </p>
                       <a 
                         href="/auth" 
                         onClick={() => setOpen(false)}
                         className="bg-primary text-primary-foreground px-8 py-3 rounded-2xl font-black shadow-[0_0_20px_hsl(var(--primary)/0.3)] hover:scale-105 active:scale-95 transition-all text-sm w-full"
                       >
                         {lang === 'ar' ? "تسجيل الدخول" : "Sign In"}
                       </a>
                     </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
