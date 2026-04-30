import { useState, memo, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, GraduationCap, BookOpen, Users, Calculator, ShoppingBag, Sparkles, Settings, Menu, X, MapPin, ArrowLeft, ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { LogIn, LogOut, User } from "lucide-react";
import { PAGE_IMPORTS, prefetchPage } from "@/lib/prefetch";


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

  // Auto-scroll to active link when menu opens
  useEffect(() => {
    if (isOpen && activeRef.current) {
      const timer = setTimeout(() => {
        activeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);


  const items = [
    { to: "/", icon: LayoutDashboard, label: t.nav.dashboard, end: true, prefetch: PAGE_IMPORTS.Dashboard },
    { to: "/majors", icon: GraduationCap, label: t.nav.majors, prefetch: PAGE_IMPORTS.Majors },
    { to: "/vault", icon: BookOpen, label: t.nav.vault, prefetch: PAGE_IMPORTS.Vault },
    { to: "/instructors", icon: Users, label: t.nav.faculty, prefetch: PAGE_IMPORTS.Faculty },
    { to: "/gpa", icon: Calculator, label: t.nav.gpa, prefetch: PAGE_IMPORTS.GPACalculator },
    { to: "/campus-map", icon: MapPin, label: t.nav.campusMap, prefetch: PAGE_IMPORTS.BuildingsPage },
    { to: "/marketplace", icon: ShoppingBag, label: t.nav.marketplace, prefetch: PAGE_IMPORTS.Marketplace },
    { to: "/recreation", icon: Sparkles, label: t.nav.recreation, prefetch: PAGE_IMPORTS.Recreation },
  ];

  const isActive = (to: string, end?: boolean) =>
    end ? location.pathname === to : location.pathname.startsWith(to);

  const sideClasses = cn(
    "fixed top-0 z-40 h-screen bg-sidebar/95 backdrop-blur-[20px] border-sidebar-border transition-all duration-200 ease-[0.33,1,0.68,1] flex flex-col shadow-2xl will-change-transform",
    dir === "rtl" ? "right-0 border-l" : "left-0 border-r",
    "w-[55%] md:w-60", // Strict width: 55% Mobile, 240px Desktop
    isOpen ? "translate-x-0" : (dir === "rtl" ? "translate-x-full" : "-translate-x-full"),
  );

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-background/60 backdrop-blur-sm z-30 transition-opacity duration-200",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => onOpenChange(false)} 
      />

      <aside className={cn(sideClasses, "border-sidebar-border")}>
        {/* Logo area - Highly compact */}
        <div className="p-2 md:p-3 flex items-center gap-2 border-b border-sidebar-border/50">
          <img 
        src="/rs.png" 
            alt="Murshid Logo" 
            className="h-8 w-8 md:h-9 md:w-9 rounded-full object-contain shadow-lg shrink-0 border border-sidebar-border/20"
            loading="lazy"
            decoding="async"
          />
          <div className="overflow-hidden">
            <div className="font-black text-base md:text-lg tracking-tighter leading-none text-sidebar-foreground navy-pop">{t.appName}</div>
            <div className="text-[8px] font-bold text-accent mt-0.5 tracking-widest uppercase truncate navy-pop">{t.tagline}</div>
          </div>
        </div>

        {/* Navigation Content - Maximum vertical space efficiency */}
        <nav className="flex-1 overflow-y-auto scrollbar-hide p-1.5 space-y-1 flex flex-col">
          {items.map((it) => {
            const active = isActive(it.to, it.end);
            return (
              <div key={it.to} className="w-full transition-transform active:scale-95 duration-200">
                <Link
                  to={it.to}
                  ref={active ? activeRef : null}
                  onClick={() => onOpenChange(false)}
                  onMouseEnter={() => prefetchPage(it.prefetch)}
                  className={cn(
                    "group relative flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-all active-press w-full",
                    active
                      ? "gradient-primary text-primary-foreground shadow-md border border-white/20"
                      : "hover:bg-accent/5 text-sidebar-foreground hover:text-accent"
                  )}
                >
                  <it.icon className={cn("h-[18px] w-[18px] shrink-0 transition-colors navy-pop", active ? "text-primary-foreground" : "group-hover:text-accent")} />
                  <span className="font-bold text-sm whitespace-nowrap overflow-hidden text-ellipsis navy-pop">{it.label}</span>
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Bottom actions - Minimalist */}
        <div className="p-2 border-t border-sidebar-border/50 space-y-1">
          {user ? (
            <div className="space-y-1">
              <div className="px-2 py-1 flex items-center gap-2 text-[10px] font-bold text-accent uppercase tracking-widest opacity-80 overflow-hidden">
                <User className="h-3 w-3" />
                <span className="truncate">{user.email}</span>
              </div>
              <button
                onClick={async () => {
                  await signOut();
                  onOpenChange(false);
                  navigate("/auth");
                }}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all w-full hover:bg-red-500/10 text-red-400 hover:text-red-300"
              >
                <LogOut className="h-[18px] w-[18px] shrink-0" />
                <span className="font-bold text-sm whitespace-nowrap">{t.nav.logout}</span>
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              onClick={() => onOpenChange(false)}
              className={cn(
                "flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all w-full",
                isActive("/auth")
                  ? "gradient-primary text-primary-foreground shadow-sm border border-white/20"
                  : "hover:bg-accent/5 text-sidebar-foreground hover:text-accent"
              )}
            >
              <LogIn className="h-[18px] w-[18px] shrink-0" />
              <span className="font-bold text-sm whitespace-nowrap">Login</span>
            </Link>
          )}

          <Link
            to="/settings"
            onClick={() => onOpenChange(false)}
            className={cn(
              "flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all w-full",
              isActive("/settings")
                ? "gradient-primary text-primary-foreground shadow-sm border border-white/20"
                : "hover:bg-accent/5 text-sidebar-foreground hover:text-accent"
            )}
          >
            <Settings className="h-[18px] w-[18px] shrink-0 navy-pop" />
            <span className="font-bold text-sm whitespace-nowrap navy-pop">{t.nav.settings}</span>
          </Link>
        </div>
      </aside>
    </>
  );
});

Sidebar.displayName = "Sidebar";

export default Sidebar;


