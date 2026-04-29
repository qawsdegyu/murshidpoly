import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PreferencesProvider } from "@/contexts/PreferencesContext";
import { lazy, Suspense } from "react";
import AppLayout from "@/components/AppLayout";
import ScrollRestoration from "@/components/ScrollRestoration";
import GlobalErrorBoundary from "@/components/GlobalErrorBoundary";
import BrandedLoader from "@/components/BrandedLoader";
import { AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";

import Dashboard from "./pages/Dashboard";
import Majors from "./pages/Majors";
import MajorPage from "./pages/MajorPage";
import Vault from "./pages/Vault";
import VaultDetail from "./pages/VaultDetail";

// Lazy-loaded secondary pages
const GPACalculator = lazy(() => import("./pages/GPACalculator"));
const Faculty = lazy(() => import("./pages/Faculty"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const Settings = lazy(() => import("./pages/Settings"));
const Recreation = lazy(() => import("./pages/Recreation"));
const RecreationCategory = lazy(() => import("./pages/RecreationCategory"));
const RecreationDetail = lazy(() => import("./pages/RecreationDetail"));
const AnnouncementDetail = lazy(() => import("./pages/AnnouncementDetail"));
const CampusMap = lazy(() => import("./pages/CampusMap"));
import CoursePage from "./pages/CoursePage";
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();
  
  return (
    <AppLayout>
      <Suspense fallback={null}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Dashboard /></PageTransition>} />
            <Route path="/gpa" element={<PageTransition><GPACalculator /></PageTransition>} />
            <Route path="/faculty" element={<PageTransition><Faculty /></PageTransition>} />
            <Route path="/majors" element={<PageTransition><Majors /></PageTransition>} />
            <Route path="/major/:id" element={<PageTransition><MajorPage /></PageTransition>} />
            <Route path="/materials/:id" element={<PageTransition><CoursePage /></PageTransition>} />
            <Route path="/vault" element={<PageTransition><Vault /></PageTransition>} />
            <Route path="/marketplace" element={<PageTransition><Marketplace /></PageTransition>} />
            <Route path="/recreation" element={<PageTransition><Recreation /></PageTransition>} />
            <Route path="/recreation/:category" element={<PageTransition><RecreationCategory /></PageTransition>} />
            <Route path="/recreation/:category/:placeId" element={<PageTransition><RecreationDetail /></PageTransition>} />
            <Route path="/campus-map" element={<PageTransition><CampusMap /></PageTransition>} />
            <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
            <Route path="/announcement/:id" element={<PageTransition><AnnouncementDetail /></PageTransition>} />
            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </AppLayout>

  );
};

const App = () => {
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
