import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PreferencesProvider } from "@/contexts/PreferencesContext";
import AppLayout from "@/components/AppLayout";
import ScrollRestoration from "@/components/ScrollRestoration";
import GlobalErrorBoundary from "@/components/GlobalErrorBoundary";
import { useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Dashboard from "./pages/Dashboard";
import GPACalculator from "./pages/GPACalculator";
import Faculty from "./pages/Faculty";
import Majors from "./pages/Majors";
import MajorPage from "./pages/MajorPage";
import Vault from "./pages/Vault";
import Marketplace from "./pages/Marketplace";
import Settings from "./pages/Settings";
import Recreation from "./pages/Recreation";
import RecreationCategory from "./pages/RecreationCategory";
import RecreationDetail from "./pages/RecreationDetail";
import AnnouncementDetail from "./pages/AnnouncementDetail";
import CampusMap from "./pages/CampusMap";
import VaultDetail from "./pages/VaultDetail";
import CoursePage from "./pages/CoursePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/gpa" element={<GPACalculator />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/majors" element={<Majors />} />
          <Route path="/major/:id" element={<MajorPage />} />
          <Route path="/materials/:id" element={<CoursePage />} />
          <Route path="/vault" element={<Vault />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/recreation" element={<Recreation />} />
          <Route path="/recreation/:category" element={<RecreationCategory />} />
          <Route path="/recreation/:category/:placeId" element={<RecreationDetail />} />
          <Route path="/campus-map" element={<CampusMap />} />

          <Route path="/settings" element={<Settings />} />
          <Route path="/announcement/:id" element={<AnnouncementDetail />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  console.log("App rendering...");
  return (
    <QueryClientProvider client={queryClient}>
      <PreferencesProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollRestoration />
            <GlobalErrorBoundary>
              <AppRoutes />
            </GlobalErrorBoundary>
          </BrowserRouter>
        </TooltipProvider>
      </PreferencesProvider>
    </QueryClientProvider>
  );
};

export default App;
