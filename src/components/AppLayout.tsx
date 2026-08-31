import { memo, lazy, Suspense, useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import StaticBackground from "@/components/StaticBackground";
import TopHeader from "@/components/TopHeader";
import FloatingActionMenu from "@/components/FloatingActionMenu";
import BottomNavBar from "@/components/BottomNavBar";
import { usePreferences } from "@/contexts/PreferencesContext";

// Lazy load heavy global modules to maximize PageSpeed score and avoid layout thrashing
const MurshidAssistant = lazy(() => import("@/components/MurshidAssistant"));
const PopupAd = lazy(() => import("@/components/PopupAd"));

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = memo(({ children }: AppLayoutProps) => {
  const { dir } = usePreferences();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] selection:bg-accent/30 flex flex-col relative" dir={dir}>
      <StaticBackground />
      <TopHeader isMenuOpen={isMenuOpen} onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
      <Sidebar isOpen={isMenuOpen} onOpenChange={setIsMenuOpen} />
      <main className="flex-1 w-full relative z-10 pt-16 md:pt-20 pb-20 md:pb-0 min-h-[75vh]">
        {children}
      </main>
      <Footer />
      <ScrollToTop isNavbarVisible={!isMenuOpen} />
      <Suspense fallback={null}>
        <MurshidAssistant />
        <PopupAd />
      </Suspense>
      <BottomNavBar isSidebarOpen={isMenuOpen} />
    </div>
  );
});

AppLayout.displayName = "AppLayout";

export default AppLayout;
