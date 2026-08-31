import { useState, memo, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, GraduationCap, BookOpen, Users, Calculator, ShoppingBag, Sparkles, Settings, Menu, X, MapPin, ArrowLeft, ArrowRight, ShieldAlert, Scale, Calendar, Car, Home
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { LogIn, LogOut, User, Megaphone } from "lucide-react";
import AdSpace from "@/components/AdSpace";
import { PAGE_IMPORTS, prefetchPage } from "@/lib/prefetch";
import { maskEmail } from "@/lib/security";
import { isUserAdmin } from "@/lib/admin";
import { supabase } from "@/lib/supabase";


interface AdSpaceProps {
  placement?: "top_banner" | "sidebar" | "vault_banner" | "majors_sidebar";
  className?: string;
}

interface SidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const Sidebar = memo(({ isOpen, onOpenChange }: SidebarProps) => {
  const { t, dir } = usePreferences();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const activeRef = useRef<HTMLAnchorElement>(null);
  const isRoot = location.pathname === "/";
  const [isAdmin, setIsAdmin] = useState(false);
  const [disabledPages, setDisabledPages] = useState<string[]>([]);

  useEffect(() => {
    async function fetchMaintenance() {
      try {
        const { data, error } = await supabase.from('maintenance_mode').select('page_id').eq('is_active', true);
        if (!error && data) {
          setDisabledPages(data.map(d => d.page_id));
        }
      } catch (err) {
        console.error("Error fetching maintenance status", err);
      }
    }
    fetchMaintenance();
  }, []);

  useEffect(() => {
    async function checkAdmin() {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      const emailAdmin = isUserAdmin(user.email);
      if (emailAdmin) {
        setIsAdmin(true);
        return;
      }

      // Check cached status first to optimize load times and eliminate critical network chains
      const cachedAdmin = localStorage.getItem(`is_admin_${user.id}`);
      if (cachedAdmin !== null) {
        setIsAdmin(cachedAdmin === "true");
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", user.id)
          .maybeSingle();

        if (!error && data) {
          const isAdminVal = !!data.is_admin;
          setIsAdmin(isAdminVal);
          localStorage.setItem(`is_admin_${user.id}`, String(isAdminVal));
        } else if (!error && !data) {
          setIsAdmin(false);
          localStorage.setItem(`is_admin_${user.id}`, "false");
        }
      } catch (err) {
        console.error("Error checking sidebar admin status:", err);
        setIsAdmin(false);
      }
    }
    checkAdmin();
  }, [user]);

  // Auto-scroll to active link when menu opens
  useEffect(() => {
    if (isOpen && activeRef.current) {
      const timer = setTimeout(() => {
        activeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Auto-close menu when route changes
  useEffect(() => {
    onOpenChange(false);
  }, [location.pathname, onOpenChange]);

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);


  const items: any[] = [
    { to: "/", icon: LayoutDashboard, label: t.nav.dashboard, end: true, prefetch: PAGE_IMPORTS.Dashboard },

    { isHeader: true, label: dir === "rtl" ? "الأكاديميا" : "Academia" },
    { to: "/my-schedule", icon: Calendar, label: dir === "rtl" ? "جدولي" : "My Schedule", prefetch: PAGE_IMPORTS.MySchedule },
    { to: "/vault", icon: BookOpen, label: t.nav.vault, prefetch: PAGE_IMPORTS.Vault },

    { isHeader: true, label: dir === "rtl" ? "الأدوات" : "Tools" },
    { to: "/gpa", icon: Calculator, label: t.nav.gpa, prefetch: PAGE_IMPORTS.GPACalculator },
    { to: "/instructors", icon: Users, label: t.nav.faculty, prefetch: PAGE_IMPORTS.Faculty },
    { to: "/rideshare", icon: Car, label: t.nav.rideshare, prefetch: PAGE_IMPORTS.RideShare },
    { to: "/roommate", icon: Home, label: t.nav.roommate, prefetch: PAGE_IMPORTS.RoommateMatch },
    { to: "/majors", icon: GraduationCap, label: t.nav.majors, prefetch: PAGE_IMPORTS.Majors },

    { isHeader: true, label: dir === "rtl" ? "الخدمات" : "Services" },
    { to: "/campus-map", icon: MapPin, label: t.nav.campusMap, prefetch: PAGE_IMPORTS.BuildingsPage },
    { to: "/marketplace", icon: ShoppingBag, label: t.nav.marketplace, prefetch: PAGE_IMPORTS.Marketplace },
    { to: "/recreation", icon: Sparkles, label: t.nav.recreation, prefetch: PAGE_IMPORTS.Recreation },
  ].filter(it => !it.to || !disabledPages.includes(it.to.replace("/", "")));

  const isActive = (to: string, end?: boolean) =>
    end ? location.pathname === to : location.pathname.startsWith(to);

  const sideClasses = cn(
    "fixed top-0 right-0 z-40 h-[100dvh] transition-transform duration-300 ease-out flex flex-col shadow-2xl will-change-transform select-none",
    "bg-[#0D0D0D] border-l border-white/5",
    "w-[65%] sm:w-[50%] max-w-[320px]",
    isOpen ? "translate-x-0" : "translate-x-full",
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-xs z-30 transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => onOpenChange(false)}
      />

      <aside className={cn(sideClasses, "font-tajawal font-['Tajawal']")}>
        {/* Drawer Header (56px height) */}
        <div className="h-[56px] min-h-[56px] px-5 flex items-center justify-between relative overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none" />

          {/* Logo area with rs.png image logo */}
          <Link
            to="/"
            onClick={() => onOpenChange(false)}
            className="relative h-12 md:h-14 w-32 md:w-40 flex items-center justify-start transition-all active:scale-95 group/logo z-10"
            title="Hadeed Dashboard"
          >
            <img
              src="/rs.png"
              alt="Hadeed Logo"
              width={180}
              height={56}
              className="h-full object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.15)] group-hover/logo:scale-105 transition-transform"
              loading="eager"
              decoding="async"
            />
          </Link>

          {/* Left side: X close button (44x44px target) */}
          <button
            onClick={() => onOpenChange(false)}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl hover:bg-white/5 active:scale-90 text-sidebar-foreground/70 hover:text-white flex items-center justify-center transition-all z-10"
            aria-label="Close Menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable area wrapper */}
        <div className="flex-1 relative flex flex-col overflow-hidden">
          <nav className="flex-1 overflow-y-auto scrollbar-hide py-1 md:py-1.5 flex flex-col gap-0 select-none">
            {items.map((it, idx) => {
              if (it.isHeader) {
                return (
                  <div key={`header-${idx}`} className="mt-2 md:mt-3 mb-0.5 md:mb-0.5 px-5 text-right first:mt-2">
                    <h4 className="text-[10px] md:text-[11px] font-medium uppercase tracking-[0.1em] text-white/35">{it.label}</h4>
                  </div>
                );
              }

              const active = isActive(it.to, it.end);
              return (
                <div key={it.to} className="w-full transition-transform active:scale-[0.98] duration-120">
                  <Link
                    to={it.to}
                    ref={active ? activeRef : null}
                    onClick={() => onOpenChange(false)}
                    onMouseEnter={() => prefetchPage(it.prefetch)}
                    aria-label={it.label}
                    className={cn(
                      "group relative flex items-center px-5 h-[30px] md:h-[38px] min-h-[30px] md:min-h-[38px] transition-all w-full",
                      active
                        ? "bg-accent/15 border-r-[3px] border-accent text-white"
                        : "hover:bg-white/5 text-white/85 hover:text-white"
                    )}
                  >
                    <it.icon className={cn("h-[16px] md:h-5 w-[16px] md:w-5 ml-2.5 md:ml-3 shrink-0 transition-colors", active ? "text-accent" : "text-white/85 group-hover:text-white")} />
                    <span className={cn("text-[13px] md:text-[15px] flex-1 text-right whitespace-nowrap overflow-hidden text-ellipsis", active ? "font-bold" : "font-normal")}>
                      {it.label}
                    </span>
                  </Link>
                </div>
              );
            })}
            
            {/* Scroll bottom padding spacer */}
            <div className="h-6 shrink-0" />
          </nav>

          {/* Scrollable area gradient fade at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-6 pointer-events-none bg-gradient-to-t from-[#0D0D0D] to-transparent z-10" />
        </div>

        {/* Sidebar Ad Slot - Only shows if an active ad exists */}
        <div className="px-2 shrink-0">
          <AdSpace placement="sidebar" className="py-0" />
        </div>

        {/* Bottom actions */}
        <div className="mt-auto px-0 pb-0 md:pb-2 pt-0 flex flex-col gap-0 select-none shrink-0 bg-[#0D0D0D]">
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => onOpenChange(false)}
              aria-label={dir === "rtl" ? "لوحة المسؤول" : "Admin Panel"}
              className={cn(
                "flex items-center px-5 h-[30px] md:h-[38px] min-h-[30px] md:min-h-[38px] transition-all w-full",
                isActive("/admin")
                  ? "bg-accent/15 border-r-[3px] border-accent text-white"
                  : "hover:bg-white/5 text-[#F59E0B] hover:text-amber-400"
              )}
            >
              <ShieldAlert className="h-[16px] md:h-5 w-[16px] md:w-5 ml-2.5 md:ml-3 shrink-0" />
              <span className="font-bold text-[13px] md:text-[15px] text-right flex-1">{dir === "rtl" ? "لوحة المسؤول" : "Admin Panel"}</span>
            </Link>
          )}

          {user && (
            <Link
              to="/profile"
              onClick={() => onOpenChange(false)}
              onMouseEnter={() => prefetchPage(PAGE_IMPORTS.Profile)}
              aria-label={dir === "rtl" ? "الملف الشخصي" : "Profile"}
              className={cn(
                "flex items-center px-5 h-[30px] md:h-[38px] min-h-[30px] md:min-h-[38px] transition-all w-full",
                isActive("/profile")
                  ? "bg-accent/15 border-r-[3px] border-accent text-white"
                  : "hover:bg-white/5 text-white/85 hover:text-white"
              )}
            >
              <User className="h-[16px] md:h-5 w-[16px] md:w-5 ml-2.5 md:ml-3 shrink-0" />
              <span className={cn("text-[13px] md:text-[15px] text-right flex-1", isActive("/profile") ? "font-bold" : "font-normal")}>
                {dir === "rtl" ? "الملف الشخصي" : "Profile"}
              </span>
            </Link>
          )}

          <Link
            to="/settings"
            onClick={() => onOpenChange(false)}
            aria-label={t.nav.settings}
            className={cn(
              "flex items-center px-5 h-[30px] md:h-[38px] min-h-[30px] md:min-h-[38px] transition-all w-full",
              isActive("/settings")
                ? "bg-accent/15 border-r-[3px] border-accent text-white"
                : "hover:bg-white/5 text-white/85 hover:text-white"
            )}
          >
            <Settings className="h-[16px] md:h-5 w-[16px] md:w-5 ml-2.5 md:ml-3 shrink-0" />
            <span className={cn("text-[13px] md:text-[15px] text-right flex-1", isActive("/settings") ? "font-bold" : "font-normal")}>{t.nav.settings}</span>
          </Link>

          {user ? (
            <button
              onClick={async () => {
                await signOut();
                onOpenChange(false);
                navigate("/auth");
              }}
              aria-label={t.nav.logout}
              className="flex items-center px-5 h-[30px] md:h-[38px] min-h-[30px] md:min-h-[38px] transition-all w-full hover:bg-red-500/10 text-[#F87171] hover:text-red-300"
            >
              <LogOut className="h-[16px] md:h-5 w-[16px] md:w-5 ml-2.5 md:ml-3 shrink-0" />
              <span className="font-bold text-[13px] md:text-[15px] text-right flex-1">{t.nav.logout}</span>
            </button>
          ) : (
            <Link
              to="/auth"
              onClick={() => onOpenChange(false)}
              aria-label="Login"
              className={cn(
                "flex items-center px-5 h-[30px] md:h-[38px] min-h-[30px] md:min-h-[38px] transition-all w-full",
                isActive("/auth")
                  ? "bg-accent/15 border-r-[3px] border-accent text-white"
                  : "hover:bg-white/5 text-white/85 hover:text-white"
              )}
            >
              <LogIn className="h-[16px] md:h-5 w-[16px] md:w-5 ml-2.5 md:ml-3 shrink-0" />
              <span className="text-[13px] md:text-[15px] text-right flex-1">Login</span>
            </Link>
          )}
        </div>
      </aside>
    </>
  );
});

Sidebar.displayName = "Sidebar";

export default Sidebar;
