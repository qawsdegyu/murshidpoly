import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";
import { cn } from "@/lib/utils";

export default function ScrollToTop() {
  const { dir } = usePreferences();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "fixed bottom-24 z-50 h-10 w-10 rounded-full bg-accent/80 backdrop-blur-md shadow-lg shadow-accent/30 flex items-center justify-center border border-white/20 hover:shadow-xl hover:shadow-accent/40 focus-visible:outline-none transition-all duration-300",
            dir === "rtl" ? "left-8" : "right-8"
          )}
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5 text-accent-foreground stroke-[2.5]" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
