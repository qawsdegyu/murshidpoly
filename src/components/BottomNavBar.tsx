import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Calendar, BookOpen, MapPin, User } from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { PAGE_IMPORTS, prefetchPage } from "@/lib/prefetch";

interface BottomNavBarProps {
  isSidebarOpen?: boolean;
}

export default function BottomNavBar({ isSidebarOpen = false }: BottomNavBarProps) {
  const { lang, dir } = usePreferences();
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    {
      to: "/",
      icon: LayoutDashboard,
      labelAr: "الرئيسية",
      labelEn: "Home",
      prefetch: PAGE_IMPORTS.Dashboard
    },
    {
      to: "/my-schedule",
      icon: Calendar,
      labelAr: "جدولي",
      labelEn: "Schedule",
      prefetch: PAGE_IMPORTS.MySchedule
    },
    {
      to: "/vault",
      icon: BookOpen,
      labelAr: "الخزانة",
      labelEn: "Vault",
      prefetch: PAGE_IMPORTS.Vault
    },
    {
      to: "/campus-map",
      icon: MapPin,
      labelAr: "المباني",
      labelEn: "Buildings",
      prefetch: PAGE_IMPORTS.BuildingsPage
    },
    {
      to: user ? "/profile" : "/auth",
      icon: User,
      labelAr: user ? "الملف" : "دخول",
      labelEn: user ? "Profile" : "Login",
      prefetch: PAGE_IMPORTS.Profile
    }
  ];

  return (
    <div
      className={cn(
        "fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-[400px] z-50 md:hidden",
        "bg-background/70 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-2xl shadow-black/50 mobile-bottom-nav",
        "transition-all duration-300 ease-out transform",
        isSidebarOpen ? "translate-y-[150%] opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
      )}
    >
      <nav className="flex items-center justify-around h-[56px] px-2">
        {navItems.map((item) => {
          const isActive = item.to === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(item.to);

          const Icon = item.icon;
          const label = lang === "ar" ? item.labelAr : item.labelEn;

          return (
            <Link
              key={item.to}
              to={item.to}
              onMouseEnter={() => prefetchPage(item.prefetch)}
              className="relative flex flex-col items-center justify-center flex-1 h-full min-h-[44px] focus:outline-none transition-colors"
              aria-label={label}
            >
              <div className="relative flex flex-col items-center justify-center gap-1 z-10 w-full h-full">
                <Icon
                  className={cn(
                    "h-5 w-5 transition-all duration-300",
                    isActive ? "text-accent translate-y-[-2px]" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] font-bold tracking-tight transition-all duration-300 absolute bottom-0",
                    isActive ? "text-accent opacity-100 translate-y-1" : "text-muted-foreground opacity-0 translate-y-3"
                  )}
                >
                  {label}
                </span>
              </div>

              {isActive && (
                <motion.div
                  layoutId="bottomTabGlow"
                  className="absolute inset-x-2 inset-y-1 bg-accent/10 border border-accent/20 rounded-2xl -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
