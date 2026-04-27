import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, GraduationCap, BookOpen, Users, Calculator, ShoppingBag, Sparkles, Settings, Menu, X, MapPin,
} from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const { t, dir } = usePreferences();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = [
    { to: "/", icon: LayoutDashboard, label: t.nav.dashboard, end: true },

    { to: "/majors", icon: GraduationCap, label: t.nav.majors },
    { to: "/vault", icon: BookOpen, label: t.nav.vault },
    { to: "/faculty", icon: Users, label: t.nav.faculty },
    { to: "/gpa", icon: Calculator, label: t.nav.gpa },
    { to: "/campus-map", icon: MapPin, label: t.nav.campusMap },
    { to: "/marketplace", icon: ShoppingBag, label: t.nav.marketplace },
    { to: "/recreation", icon: Sparkles, label: t.nav.recreation },
  ];

  const isActive = (to: string, end?: boolean) =>
    end ? location.pathname === to : location.pathname.startsWith(to);

  const sideClasses = cn(
    "fixed top-0 z-40 h-screen bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-slate-200 dark:border-white/10 transition-all duration-300 flex flex-col transition-colors duration-300",
    dir === "rtl" ? "right-0 border-l" : "left-0 border-r",
    collapsed ? "w-20" : "w-64",
    "md:translate-x-0",
    mobileOpen ? "translate-x-0" : (dir === "rtl" ? "translate-x-full" : "-translate-x-full"),
    "md:!translate-x-0"
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(o => !o)}
        className={cn(
          "md:hidden fixed top-4 z-50 p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 backdrop-blur-xl shadow-lg transition-colors duration-300",
          dir === "rtl" ? "right-4" : "left-4"
        )}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="h-5 w-5 text-slate-900 dark:text-slate-100" /> : <Menu className="h-5 w-5 text-slate-900 dark:text-slate-100" />}
      </button>

      {/* Backdrop */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-background/60 backdrop-blur-sm z-30" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={sideClasses}>
        {/* Logo */}
        <div className="p-5 flex items-center gap-3 border-b border-slate-200 dark:border-white/10">
          <div className="h-12 w-12 rounded-xl bg-white p-1.5 shadow-gold shrink-0 border border-border/40">
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/2/2d/Al-Balqa_Applied_University_logo.png" 
              alt="BAU Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="font-extrabold text-xl tracking-tighter leading-none text-slate-900 dark:text-slate-100">{t.appName}</div>
              <div className="text-[10px] font-bold text-accent mt-1 tracking-widest uppercase truncate">{t.tagline}</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
          {items.map((it) => {
            const active = isActive(it.to, it.end);
            return (
              <Link
                key={it.to}
                to={it.to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all active-press",
                  active
                    ? "bg-primary text-white shadow-lg"
                    : "hover:bg-slate-200/50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="active-accent-bar"
                    className={cn(
                      "absolute top-1.5 bottom-1.5 w-[3px] rounded-full bg-accent shadow-[0_0_10px_hsl(var(--accent)/0.7)]",
                      dir === "rtl" ? "right-0" : "left-0"
                    )}
                  />
                )}
                <it.icon className={cn("h-5 w-5 shrink-0 transition-colors", active ? "text-accent" : "group-hover:text-accent")} />
                {!collapsed && <span className="font-medium text-sm truncate">{it.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Settings + collapse */}
        <div className="p-3 border-t border-slate-200 dark:border-white/10 space-y-1">
          <Link
            to="/settings"
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
              isActive("/settings")
                ? "bg-primary text-white shadow-lg"
                : "hover:bg-slate-200/50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            )}
          >
            <Settings className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="font-medium text-sm">{t.nav.settings}</span>}
          </Link>
          <button
            onClick={() => setCollapsed(c => !c)}
            className="hidden md:flex w-full items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent text-muted-foreground text-sm"
          >
            <Menu className="h-4 w-4" />
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Spacer for desktop */}
      <div className={cn("hidden md:block transition-all", collapsed ? "w-20" : "w-64")} />
    </>
  );
}
