import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation, Link } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PreferencesProvider, usePreferences } from "@/contexts/PreferencesContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { lazy, Suspense } from "react";
import AppLayout from "@/components/AppLayout";
import ScrollRestoration from "@/components/ScrollRestoration";
import GlobalErrorBoundary from "@/components/GlobalErrorBoundary";
import BrandedLoader from "@/components/BrandedLoader";
import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

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
const Auth = lazy(() => import("./pages/Auth"));
const NotFound = lazy(PAGE_IMPORTS.NotFound);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const { lang } = usePreferences();
  const location = useLocation();

  if (loading) {
    return <BrandedLoader />;
  }

  if (!user) {
    return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h2 className="text-2xl font-black text-foreground">{lang === 'ar' ? 'وصول مقيد' : 'Access Restricted'}</h2>
      <p className="text-muted-foreground font-bold">{lang === 'ar' ? 'يرجى تسجيل الدخول للوصول إلى هذه الميزة' : 'Please sign in to access this feature.'}</p>
      <Link to="/auth" className="bg-secondary text-white px-8 py-3 rounded-2xl hover:scale-105 transition-all font-black shadow-lg shadow-secondary/20">
        {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
      </Link>
    </motion.div>;
  }

  return <>{children}</>;
};

import { LazyMotion, domAnimation } from "framer-motion";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();
  
  return (
    <AppLayout>
      <Suspense fallback={null}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Dashboard /></PageTransition>} />
            <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
            <Route path="/gpa" element={<PageTransition><ProtectedRoute><GPACalculator /></ProtectedRoute></PageTransition>} />
            <Route path="/majors" element={<PageTransition><Majors /></PageTransition>} />
            <Route path="/major/:id" element={<PageTransition><MajorPage /></PageTransition>} />
            <Route path="/materials/:id" element={<PageTransition><CoursePage /></PageTransition>} />
            <Route path="/vault" element={<PageTransition><Vault /></PageTransition>} />
            <Route path="/instructors" element={<PageTransition><Faculty /></PageTransition>} />
            <Route path="/marketplace" element={<PageTransition><Marketplace /></PageTransition>} />
            <Route path="/recreation" element={<PageTransition><Recreation /></PageTransition>} />
            <Route path="/recreation/:category" element={<PageTransition><RecreationCategory /></PageTransition>} />
            <Route path="/recreation/:category/:placeId" element={<PageTransition><RecreationDetail /></PageTransition>} />
            <Route path="/campus-map" element={<PageTransition><BuildingsPage /></PageTransition>} />
            <Route path="/settings" element={<PageTransition><ProtectedRoute><Settings /></ProtectedRoute></PageTransition>} />
            <Route path="/announcement/:id" element={<PageTransition><AnnouncementDetail /></PageTransition>} />
            <Route path="/announcements/founders" element={<PageTransition><AnnouncementDetail /></PageTransition>} />
            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
      </Suspense>
    </AppLayout>

  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PreferencesProvider>
        <TooltipProvider>
          <LazyMotion features={domAnimation}>
            <Toaster />
            <Sonner />
            <Analytics />
            <SpeedInsights />
            <BrowserRouter>
              <ScrollRestoration />
              <GlobalErrorBoundary>
                <AppRoutes />
              </GlobalErrorBoundary>
            </BrowserRouter>
          </LazyMotion>
        </TooltipProvider>
        </PreferencesProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
