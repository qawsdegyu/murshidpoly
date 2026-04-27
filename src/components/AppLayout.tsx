import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import MurshidAssistant from "@/components/MurshidAssistant";
import { usePreferences } from "@/contexts/PreferencesContext";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { dir } = usePreferences();
  const { pathname } = useLocation();

  // Master layout scroll-to-top for instantaneous feel
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div className="min-h-screen flex w-full bg-background transition-colors duration-300 relative" dir={dir}>
      {/* ── Premium Dynamic Background System ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-0">
        {/* Animated Glow Blobs */}
        <motion.div 
          animate={{ 
            x: [0, 40, 0], 
            y: [0, -30, 0],
            scale: [1, 1.1, 1] 
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 h-[45rem] w-[45rem] rounded-full bg-accent/15 blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            x: [0, -50, 0], 
            y: [0, 40, 0],
            scale: [1, 1.2, 1] 
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-60 -left-40 h-[50rem] w-[50rem] rounded-full bg-primary/20 blur-[140px]" 
        />
        <motion.div 
          animate={{ 
            opacity: [0.03, 0.08, 0.03],
            scale: [0.8, 1.1, 0.8] 
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 h-[35rem] w-[35rem] rounded-full bg-accent/10 blur-[100px]" 
        />

        {/* Floating Glassmorphic Elements */}
        <motion.div
          animate={{ y: [-20, 20, -20], rotate: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] right-[10%] w-32 h-32 rounded-3xl bg-white/[0.03] dark:bg-white/[0.01] border border-white/5 backdrop-blur-[2px] hidden lg:block"
        />
        <motion.div
          animate={{ y: [30, -30, 30], rotate: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[20%] left-[15%] w-48 h-48 rounded-full bg-accent/[0.02] border border-accent/5 backdrop-blur-[1px] hidden lg:block"
        />

        {/* Subtle Noise/Grain Texture */}
        <div className="absolute inset-0 opacity-[0.15] dark:opacity-[0.25] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
      </div>
      <Sidebar />
      <main className="flex-1 min-w-0 relative flex flex-col z-10">
        <div className="relative px-4 md:px-10 py-6 md:py-14 max-w-7xl mx-auto w-full flex-1">
          {children}
        </div>
        <Footer />
      </main>
      <ScrollToTop />
      <MurshidAssistant />
    </div>
  );
}
