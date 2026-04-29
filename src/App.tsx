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
import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import { Analytics } from "@vercel/analytics/react";

import { PAGE_IMPORTS, prefetchPage } from "@/lib/prefetch";

// Lazy-loaded pages
const Dashboard = lazy(PAGE_IMPORTS.Dashboard);
const Majors = lazy(PAGE_IMPORTS.Majors);
const MajorPage = lazy(PAGE_IMPORTS.MajorPage);
const Vault = lazy(PAGE_IMPORTS.Vault);
const VaultDetail = lazy(PAGE_IMPORTS.VaultDetail);
const CoursePage = lazy(PAGE_IMPORTS.CoursePage);
const GPACalculator = lazy(PAGE_IMPORTS.GPACalculator);
const Faculty = lazy(PAGE_IMPORTS.Faculty);
const Marketplace = lazy(PAGE_IMPORTS.Marketplace);
const Settings = lazy(PAGE_IMPORTS.Settings);
const Recreation = lazy(PAGE_IMPORTS.Recreation);
const RecreationCategory = lazy(PAGE_IMPORTS.RecreationCategory);
const RecreationDetail = lazy(PAGE_IMPORTS.RecreationDetail);
const AnnouncementDetail = lazy(PAGE_IMPORTS.AnnouncementDetail);
const BuildingsPage = lazy(PAGE_IMPORTS.BuildingsPage);
const NotFound = lazy(PAGE_IMPORTS.NotFound);

import { LazyMotion, domAnimation } from "framer-motion";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();
  
  return (
    <AppLayout>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<PageTransition><Dashboard /></PageTransition>} />
          <Route path="/gpa" element={<PageTransition><GPACalculator /></PageTransition>} />
          <Route path="/majors" element={<PageTransition><Majors /></PageTransition>} />
          <Route path="/major/:id" element={<PageTransition><MajorPage /></PageTransition>} />
          <Route path="/materials/:id" element={<PageTransition><CoursePage /></PageTransition>} />
          <Route path="/vault" element={<PageTransition><Vault /></PageTransition>} />
          <Route path="/marketplace" element={<PageTransition><Marketplace /></PageTransition>} />
          <Route path="/recreation" element={<PageTransition><Recreation /></PageTransition>} />
          <Route path="/recreation/:category" element={<PageTransition><RecreationCategory /></PageTransition>} />
          <Route path="/recreation/:category/:placeId" element={<PageTransition><RecreationDetail /></PageTransition>} />
          <Route path="/campus-map" element={<PageTransition><BuildingsPage /></PageTransition>} />
          <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
          <Route path="/announcement/:id" element={<PageTransition><AnnouncementDetail /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </Suspense>
    </AppLayout>

  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <PreferencesProvider>
        <TooltipProvider>
          <LazyMotion features={domAnimation}>
            <Toaster />
            <Sonner />
            <Analytics />
            <BrowserRouter>
              <ScrollRestoration />
              <GlobalErrorBoundary>
                <AppRoutes />
              </GlobalErrorBoundary>
            </BrowserRouter>
          </LazyMotion>
        </TooltipProvider>
      </PreferencesProvider>
    </QueryClientProvider>
  );
};

export default App;
