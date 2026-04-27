import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import MurshidAssistant from "@/components/MurshidAssistant";
import { usePreferences } from "@/contexts/PreferencesContext";

export default function AppLayout() {
  const location = useLocation();
  const { dir } = usePreferences();

  return (
    <div className="min-h-screen flex w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative" dir={dir}>
      {/* Spatial corner glows — fixed so they persist across pages */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-0">
        <div className="absolute -top-40 -right-40 h-[36rem] w-[36rem] rounded-full bg-accent/10 blur-[140px]" />
        <div className="absolute -bottom-40 -left-40 h-[36rem] w-[36rem] rounded-full bg-primary/25 blur-[140px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[28rem] w-[28rem] rounded-full bg-accent/[0.04] blur-[120px]" />
      </div>
      <Sidebar />
      <main className="flex-1 min-w-0 relative flex flex-col z-10">
        <div className="relative px-4 sm:px-8 lg:px-12 py-10 md:py-14 max-w-7xl mx-auto w-full flex-1">
          <Outlet />
        </div>
        <Footer />
      </main>
      <ScrollToTop />
      <MurshidAssistant />
    </div>
  );
}
