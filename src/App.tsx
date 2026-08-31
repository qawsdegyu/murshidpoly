import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation, Link, useNavigate } from "react-router-dom";
import { Toaster as Sonner, toast as SonnerToast } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PreferencesProvider, usePreferences } from "@/contexts/PreferencesContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import React, { lazy, Suspense } from "react";
import AppLayout from "@/components/AppLayout";
import ScrollRestoration from "@/components/ScrollRestoration";
import GlobalErrorBoundary from "@/components/GlobalErrorBoundary";
import BrandedLoader from "@/components/BrandedLoader";
import { m, AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import DashboardSkeleton from "./components/skeletons/DashboardSkeleton";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import MaintenanceGuard from "@/components/maintenance-guard";
import MaintenanceScreen from "@/components/maintenance-screen";

// High-fidelity premium glassmorphic loader for lazy-loaded sections (0 bytes initial download payload)
const ShellSkeleton = () => (
  <div className="w-full min-h-[60vh] p-6 space-y-6 animate-pulse" dir="rtl">
    <div className="h-10 bg-white/5 border border-white/10 rounded-2xl w-48" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-6 rounded-[2rem] bg-card/40 backdrop-blur-xl border border-white/5 space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-white/5" />
          <div className="h-6 bg-white/5 rounded-lg w-2/3" />
          <div className="h-4 bg-white/5 rounded-lg w-full" />
          <div className="h-4 bg-white/5 rounded-lg w-5/6" />
          <div className="h-11 bg-white/5 rounded-xl w-full mt-4" />
        </div>
      ))}
    </div>
  </div>
);

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
  const MarketplaceSellerDashboard = lazy(PAGE_IMPORTS.MarketplaceSellerDashboard);
  const MarketplaceProductDetail = lazy(PAGE_IMPORTS.MarketplaceProductDetail);
  const MarketplaceStore = lazy(PAGE_IMPORTS.MarketplaceStore);

const Settings = lazy(PAGE_IMPORTS.Settings);
const Recreation = lazy(PAGE_IMPORTS.Recreation);
const RecreationCategory = lazy(PAGE_IMPORTS.RecreationCategory);
const RecreationDetail = lazy(PAGE_IMPORTS.RecreationDetail);
const AnnouncementDetail = lazy(PAGE_IMPORTS.AnnouncementDetail);
const BuildingsPage = lazy(PAGE_IMPORTS.BuildingsPage);
const UniversityLaws = lazy(PAGE_IMPORTS.UniversityLaws);
const SchedulePlanner = lazy(PAGE_IMPORTS.SchedulePlanner);
const MySchedule = lazy(PAGE_IMPORTS.MySchedule);
const Profile = lazy(PAGE_IMPORTS.Profile);
const Auth = lazy(() => import("./pages/Auth"));
const NotFound = lazy(PAGE_IMPORTS.NotFound);
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const CourseNewspaper = lazy(PAGE_IMPORTS.CourseNewspaper);
const FAQ = lazy(() => import("./pages/FAQ"));
const RideShare = lazy(PAGE_IMPORTS.RideShare);
const RoommateMatch = lazy(PAGE_IMPORTS.RoommateMatch);
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Copyright = lazy(() => import("./pages/Copyright"));
const Contact = lazy(() => import("@/pages/Contact"));
const StudentAssistant = lazy(() => import("@/pages/StudentAssistant"));

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const { lang } = usePreferences();
  const location = useLocation();

  if (loading) {
    return <BrandedLoader />;
  }

  if (!user) {
    return <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h2 className="text-2xl font-black text-foreground">{lang === 'ar' ? 'وصول مقيد' : 'Access Restricted'}</h2>
      <p className="text-muted-foreground font-bold">{lang === 'ar' ? 'يرجى تسجيل الدخول للوصول إلى هذه الميزة' : 'Please sign in to access this feature.'}</p>
      <Link to="/auth" className="bg-secondary text-white px-8 py-3 rounded-2xl hover:scale-105 transition-all font-black shadow-lg shadow-secondary/20">
        {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
      </Link>
    </m.div>;
  }

  return <>{children}</>;
};

import { LazyMotion, domAnimation } from "framer-motion";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();
  const { lang } = usePreferences();
  const navigate = useNavigate();

  React.useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes("error=access_denied")) {
      const params = new URLSearchParams(hash.replace("#", "?"));
      const errorCode = params.get("error_code");

      if (errorCode === "otp_expired") {
        SonnerToast.error(lang === "ar" ? "انتهت صلاحية الرابط. يرجى طلب رابط جديد." : "Link expired. Please request a new one.");
        navigate("/auth", { replace: true });
      } else if (errorCode === "access_denied") {
        SonnerToast.error(lang === "ar" ? "تم رفض الوصول أو الرابط غير صالح." : "Access denied or invalid link.");
        navigate("/auth", { replace: true });
      }
    }
  }, [lang, navigate]);

  return (
    <AppLayout>
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Suspense fallback={<DashboardSkeleton />}><Dashboard /></Suspense></PageTransition>} />
          <Route path="/auth" element={<PageTransition><Suspense fallback={<BrandedLoader />}><Auth /></Suspense></PageTransition>} />
          <Route path="/majors" element={<PageTransition><Suspense fallback={<ShellSkeleton />}><MaintenanceGuard pageId="majors"><Majors /></MaintenanceGuard></Suspense></PageTransition>} />
          <Route path="/major/:id" element={<PageTransition><Suspense fallback={<ShellSkeleton />}><MaintenanceGuard pageId="majors"><MajorPage /></MaintenanceGuard></Suspense></PageTransition>} />
          <Route path="/materials/:id" element={<PageTransition><Suspense fallback={<ShellSkeleton />}><MaintenanceGuard pageId="vault"><VaultDetail /></MaintenanceGuard></Suspense></PageTransition>} />
          <Route path="/vault" element={<PageTransition><Suspense fallback={<ShellSkeleton />}><MaintenanceGuard pageId="vault"><Vault /></MaintenanceGuard></Suspense></PageTransition>} />
          <Route path="/instructors" element={<PageTransition><Suspense fallback={<ShellSkeleton />}><MaintenanceGuard pageId="professors"><Faculty /></MaintenanceGuard></Suspense></PageTransition>} />
          <Route path="/gpa" element={<PageTransition><Suspense fallback={<ShellSkeleton />}><MaintenanceGuard pageId="gpa"><GPACalculator /></MaintenanceGuard></Suspense></PageTransition>} />
          <Route path="/marketplace" element={<PageTransition><Suspense fallback={<BrandedLoader />}><MaintenanceGuard pageId="marketplace"><Marketplace /></MaintenanceGuard></Suspense></PageTransition>} />
          <Route path="/marketplace/product/:productId" element={<PageTransition><Suspense fallback={<BrandedLoader />}><MaintenanceGuard pageId="marketplace"><MarketplaceProductDetail /></MaintenanceGuard></Suspense></PageTransition>} />
          <Route path="/marketplace/store/:sellerId" element={<PageTransition><Suspense fallback={<BrandedLoader />}><MaintenanceGuard pageId="marketplace"><MarketplaceStore /></MaintenanceGuard></Suspense></PageTransition>} />
          <Route path="/marketplace/manage" element={<PageTransition><Suspense fallback={<BrandedLoader />}><ProtectedRoute><MaintenanceGuard pageId="marketplace"><MarketplaceSellerDashboard /></MaintenanceGuard></ProtectedRoute></Suspense></PageTransition>} />
          <Route path="/recreation" element={<PageTransition><Suspense fallback={<BrandedLoader />}><MaintenanceGuard pageId="restaurants"><Recreation /></MaintenanceGuard></Suspense></PageTransition>} />
          <Route path="/recreation/:category" element={<PageTransition><Suspense fallback={<BrandedLoader />}><MaintenanceGuard pageId="restaurants"><RecreationCategory /></MaintenanceGuard></Suspense></PageTransition>} />
          <Route path="/recreation/:category/:placeId" element={<PageTransition><Suspense fallback={<BrandedLoader />}><MaintenanceGuard pageId="restaurants"><RecreationDetail /></MaintenanceGuard></Suspense></PageTransition>} />
          <Route path="/campus-map" element={<PageTransition><Suspense fallback={<ShellSkeleton />}><MaintenanceGuard pageId="buildings"><BuildingsPage /></MaintenanceGuard></Suspense></PageTransition>} />
          <Route path="/laws" element={<PageTransition><Suspense fallback={<ShellSkeleton />}><UniversityLaws /></Suspense></PageTransition>} />
          <Route path="/schedule" element={<PageTransition><Suspense fallback={<ShellSkeleton />}><ProtectedRoute><MaintenanceGuard pageId="schedule"><SchedulePlanner /></MaintenanceGuard></ProtectedRoute></Suspense></PageTransition>} />
          <Route path="/my-schedule" element={<PageTransition><Suspense fallback={<BrandedLoader />}><ProtectedRoute><MaintenanceGuard pageId="my-schedule"><MySchedule /></MaintenanceGuard></ProtectedRoute></Suspense></PageTransition>} />
          <Route path="/newspaper" element={<PageTransition><Suspense fallback={<ShellSkeleton />}><CourseNewspaper /></Suspense></PageTransition>} />
          <Route path="/assistant" element={<PageTransition><Suspense fallback={<BrandedLoader />}><ProtectedRoute><StudentAssistant /></ProtectedRoute></Suspense></PageTransition>} />
          <Route path="/rideshare" element={<PageTransition><Suspense fallback={<BrandedLoader />}><ProtectedRoute><MaintenanceGuard pageId="rideshare"><RideShare /></MaintenanceGuard></ProtectedRoute></Suspense></PageTransition>} />
          <Route path="/roommate" element={<PageTransition><Suspense fallback={<BrandedLoader />}><ProtectedRoute><MaintenanceGuard pageId="roommate"><RoommateMatch /></MaintenanceGuard></ProtectedRoute></Suspense></PageTransition>} />

          <Route path="/profile" element={<PageTransition><Suspense fallback={<BrandedLoader />}><ProtectedRoute><Profile /></ProtectedRoute></Suspense></PageTransition>} />
          <Route path="/settings" element={<PageTransition><Suspense fallback={<BrandedLoader />}><ProtectedRoute><Settings /></ProtectedRoute></Suspense></PageTransition>} />
          <Route path="/maintenance" element={<PageTransition><Suspense fallback={<BrandedLoader />}><MaintenanceScreen /></Suspense></PageTransition>} />
          <Route path="/announcement/:id" element={<PageTransition><Suspense fallback={<BrandedLoader />}><MaintenanceGuard pageId="announcements"><AnnouncementDetail /></MaintenanceGuard></Suspense></PageTransition>} />
          <Route path="/admin" element={<PageTransition><Suspense fallback={<BrandedLoader />}><ProtectedRoute><AdminDashboard /></ProtectedRoute></Suspense></PageTransition>} />
          <Route path="/reset-password" element={<PageTransition><Suspense fallback={<BrandedLoader />}><ResetPassword /></Suspense></PageTransition>} />
          <Route path="/faq" element={<PageTransition><Suspense fallback={<BrandedLoader />}><FAQ /></Suspense></PageTransition>} />
          <Route path="/privacy" element={<PageTransition><Suspense fallback={<BrandedLoader />}><PrivacyPolicy /></Suspense></PageTransition>} />
          <Route path="/copyright" element={<PageTransition><Suspense fallback={<BrandedLoader />}><Copyright /></Suspense></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Suspense fallback={<BrandedLoader />}><Contact /></Suspense></PageTransition>} />
          <Route path="*" element={<PageTransition><Suspense fallback={<BrandedLoader />}><NotFound /></Suspense></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </AppLayout>
  );
};

const App = () => {
  return (
    <TooltipProvider>
      <LazyMotion features={domAnimation}>
        <Toaster />
        <Sonner />
        <Analytics />
        <SpeedInsights />
        {/* @ts-ignore */}
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollRestoration />
          <GlobalErrorBoundary>
            <AppRoutes />
          </GlobalErrorBoundary>
        </BrowserRouter>
      </LazyMotion>
    </TooltipProvider>
  );
};

export default App;

