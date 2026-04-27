import { motion } from "framer-motion";
import { usePreferences } from "@/contexts/PreferencesContext";
import { cn } from "@/lib/utils";

export default function Footer() {
  const { lang, theme } = usePreferences();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-auto py-8 px-4 flex flex-col items-center justify-center gap-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={cn(
          "max-w-2xl w-full text-center p-6 rounded-[2rem] border backdrop-blur-xl transition-all duration-500",
          "bg-card/40 border-border shadow-sm",
          theme === "pink" ? "shadow-[0_8px_30px_rgba(255,105,180,0.05)]" : "shadow-sm"
        )}
      >
        <p className={cn(
          "text-sm font-bold tracking-tight mb-2",
          theme === "dark" ? "text-slate-400" : 
          theme === "pink" ? "text-primary/60" : "text-slate-500"
        )}>
          {lang === "ar" ? `© ${currentYear} منصة مرشد. جميع الحقوق محفوظة.` : `© ${currentYear} Murshid Platform. All Rights Reserved.`}
        </p>
        
        <div className={cn(
          "text-xs font-medium tracking-wide flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2",
          theme === "dark" ? "text-slate-500" : 
          theme === "pink" ? "text-primary/40" : "text-slate-400"
        )}>
          <span>
            {lang === "ar" ? "تطوير م. عبد الرحمن السلحوت" : "Developed by Eng. Abdulrahman Al-Salhout"}
          </span>
          <span className="hidden md:inline opacity-30">|</span>
          <a 
            href="https://linkedin.com" // Placeholder for portfolio
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "font-black tracking-[0.2em] transition-all hover:scale-105",
              theme === "dark" ? "text-accent hover:text-accent/80" : 
              theme === "pink" ? "text-primary hover:text-primary/80" : "text-primary hover:text-primary/80"
            )}
          >
            Powered by HADEED
          </a>
        </div>
      </motion.div>
      
      {/* Visual buffer to prevent overlap with floating elements */}
      <div className="h-12 md:h-0" />
    </footer>
  );
}
