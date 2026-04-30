import { motion } from "framer-motion";
import { ShoppingBag, Sparkles, Bell } from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";
import { cn } from "@/lib/utils";

export default function Marketplace() {
  const { lang, dir } = usePreferences();
  const isAr = lang === "ar";

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* ── Cyberpunk Ambient Glows ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 bg-blue-500 animate-pulse hidden md:block" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[100px] opacity-15 bg-emerald-500 animate-bounce-slow hidden md:block" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 text-center px-6"
      >
        {/* Icon Badge */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.1 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-2xl mb-8 group hover:border-white/[0.15] transition-colors duration-500"
        >
          <ShoppingBag className="h-10 w-10 text-blue-400 group-hover:scale-110 transition-transform duration-500" />
        </motion.div>

        {/* Massive Gradient Text */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-4 md:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-emerald-400 to-blue-500 bg-[length:200%_auto] animate-gradient-x leading-tight py-2"
        >
          {isAr ? "قريباً" : "Soon"}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xs sm:text-sm md:text-xl text-muted-foreground font-medium max-w-xl mx-auto leading-relaxed mb-8 md:mb-10"
        >
          {isAr 
            ? "سوق مرشد للمعدات والخدمات الهندسية.. قيد التجهيز لخدمتكم بأفضل صورة." 
            : "Murshid Marketplace for engineering gear and services.. preparing to serve you in the best way possible."}
        </motion.p>

        {/* Teaser Card / CTA */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="inline-block"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative group cursor-pointer"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
            <div className="relative px-8 py-4 bg-background border border-border rounded-2xl backdrop-blur-xl flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-emerald-400" />
              <span className="text-foreground font-black text-[10px] sm:text-sm uppercase tracking-widest">
                {isAr ? "انتظروا مفاجآت مرشد قريباً" : "Expect Murshid surprises soon"}
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Decorative Notification Button (Non-functional) */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="mt-12 flex items-center gap-2 mx-auto text-muted-foreground hover:text-foreground transition-colors text-xs font-black uppercase tracking-[0.2em]"
        >
          <Bell className="h-3.5 w-3.5" />
          {isAr ? "أعلمني عند الإطلاق" : "Notify me on launch"}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
