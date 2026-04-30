import { memo } from "react";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import MurshidAssistant from "@/components/MurshidAssistant";
import StaticBackground from "@/components/StaticBackground";
import TopHeader from "@/components/TopHeader";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useState } from "react";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = memo(({ children }: AppLayoutProps) => {
  const { dir } = usePreferences();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen selection:bg-accent/30 flex flex-col relative" dir={dir}>
      <StaticBackground />
      <TopHeader isMenuOpen={isMenuOpen} onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
      <Sidebar isOpen={isMenuOpen} onOpenChange={setIsMenuOpen} />
      <main className="flex-1 w-full relative z-10">
        {children}
      </main>
      <Footer />
      <ScrollToTop />
      <MurshidAssistant />
    </div>
  );
});

AppLayout.displayName = "AppLayout";

export default AppLayout;
