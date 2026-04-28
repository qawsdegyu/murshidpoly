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
      {/* ── Ultra-Performance Static Background System ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-0">
        {/* Subtle Static Glows - Enabled only for Desktop */}
        <div
          style={{ willChange: "transform", background: "radial-gradient(circle, hsl(var(--accent)/0.08) 0%, transparent 70%)" }}
          className="absolute -top-40 -right-40 h-[45rem] w-[45rem] rounded-full hidden md:block"
        />
        <div
          style={{ willChange: "transform", background: "radial-gradient(circle, hsl(var(--primary)/0.1) 0%, transparent 70%)" }}
          className="absolute -bottom-60 -left-40 h-[50rem] w-[50rem] rounded-full hidden md:block"
        />

        {/* Glassmorphic Accents - Optimized */}
        <div className="absolute top-[15%] right-[10%] w-32 h-32 rounded-3xl bg-white/[0.02] border border-white/5 hidden lg:block" />
        <div className="absolute bottom-[20%] left-[15%] w-48 h-48 rounded-full bg-accent/[0.01] border border-accent/5 hidden lg:block" />

        {/* Optimized Grain Texture */}
        <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.1] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
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
