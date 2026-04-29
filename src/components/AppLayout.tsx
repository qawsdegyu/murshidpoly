import { memo } from "react";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import MurshidAssistant from "@/components/MurshidAssistant";
import StaticBackground from "@/components/StaticBackground";
import { usePreferences } from "@/contexts/PreferencesContext";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = memo(({ children }: AppLayoutProps) => {
  const { dir } = usePreferences();

  return (
    <div className="min-h-screen selection:bg-accent/30 flex flex-col relative" dir={dir}>
      <StaticBackground />
      <Sidebar />
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-2 sm:px-3 lg:px-4 py-3 md:py-4 relative z-10 min-h-screen">
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
