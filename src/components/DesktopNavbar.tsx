import React, { memo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { User, Settings, Headset, Bell, ChevronDown, LogOut, ShieldAlert } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePreferences } from "@/contexts/PreferencesContext";
import { isUserAdmin } from "@/lib/admin";
import NotificationsCenter from "@/components/NotificationsCenter";

const NavLink = ({ to, children, isActive }: { to: string, children: React.ReactNode, isActive?: boolean }) => {
  return (
    <Link to={to} className={cn(
      "inline-flex w-max items-center justify-center px-4 py-2 text-base lg:text-lg font-semibold font-['Cairo'] transition-colors hover:text-[#14B8A6] focus:text-[#14B8A6] focus:outline-none",
      isActive ? "text-[#14B8A6] border-t border-x border-[#5EEAD4] dark:border-[#14B8A6] rounded-t-xl rounded-b-none bg-[#E8FCF9] dark:bg-[#0F172A] relative z-10 translate-y-[1px]" : "bg-transparent text-[#0F172A] dark:text-[#94A3B8] rounded-xl hover:bg-slate-200/50 dark:hover:bg-[#1E293B] focus:bg-slate-200/50"
    )}>
      {children}
    </Link>
  );
};

const DropdownLink = ({ to, title, isActive }: { to: string, title: string, isActive?: boolean }) => (
  <Link
    to={to}
    className={cn(
      "block select-none space-y-1 rounded-xl p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-200/50 dark:hover:bg-[#1E293B] hover:text-[#14B8A6] focus:bg-slate-200/50 focus:text-[#14B8A6]",
      isActive ? "bg-[#E8FCF9] dark:bg-[#0F172A] text-[#14B8A6]" : "text-[#0F172A] dark:text-[#94A3B8]"
    )}
  >
    <div className="text-sm font-bold leading-none font-['Cairo']">{title}</div>
  </Link>
);

const DesktopNavbar = memo(() => {
  const location = useLocation();
  const path = location.pathname;
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isAdmin = isUserAdmin(user?.email);
  const { t, dir } = usePreferences();

  // Determine active states and labels
  const isVaultActive = path.startsWith('/vault');
  const isScheduleActive = path.startsWith('/my-schedule');
  const isMarketplaceActive = path.startsWith('/marketplace');
  const isHomeActive = path === '/';

  // Services Dropdown
  const isInstructors = path.startsWith('/instructors');
  const isRideShare = path.startsWith('/rideshare');
  const isRoommateMatch = path.startsWith('/roommate');
  const isGpa = path.startsWith('/gpa');
  const isMajors = path.startsWith('/majors');
  const isServicesActive = isInstructors || isGpa || isMajors || isRideShare || isRoommateMatch;
  
  let servicesLabel: string = t.nav.services;
  if (isInstructors) servicesLabel = t.nav.faculty;
  if (isRideShare) servicesLabel = t.nav.rideshare;
  if (isRoommateMatch) servicesLabel = t.nav.roommate;
  if (isGpa) servicesLabel = t.nav.gpa;
  if (isMajors) servicesLabel = t.nav.majors;

  // Map Dropdown
  const isCampusMap = path.startsWith('/campus-map');
  const isRecreation = path.startsWith('/recreation');
  const isMapActive = isCampusMap || isRecreation;

  let mapLabel: string = t.nav.map;
  if (isCampusMap) mapLabel = t.nav.campusMap;
  if (isRecreation) mapLabel = t.nav.recreation;

  return (
    <div className="flex w-full h-12 md:h-14 items-center justify-between px-6 lg:px-12 bg-gradient-to-b from-[#F8FAFC] dark:from-[#0B1220] via-transparent dark:via-[#111827] to-[#F1F5F9] dark:to-[#0F172A]" dir={dir}>
      
      {/* Far Right: Logo */}
      <div className="flex items-center justify-start shrink-0">
         <Link to="/" className="hover:opacity-80 transition-opacity flex items-center">
           <img src="/rs.png" alt="Murshid Logo" className="h-10 md:h-12 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
         </Link>
      </div>

      {/* Center: Navigation Links */}
      <div className="flex-1 flex justify-center items-end h-full gap-1 lg:gap-2">
        <NavLink to="/" isActive={isHomeActive}>{t.nav.dashboard}</NavLink>
        <NavLink to="/vault" isActive={isVaultActive}>{t.nav.vault}</NavLink>
        <NavLink to="/my-schedule" isActive={isScheduleActive}>{t.nav.schedule}</NavLink>

        {/* Services Dropdown */}
        <div className="relative group">
          <button className={cn(
            "inline-flex w-max items-center justify-center px-4 py-2 text-base lg:text-lg font-semibold font-['Cairo'] transition-colors hover:text-[#14B8A6] focus:outline-none",
            isServicesActive ? "text-[#14B8A6] border-t border-x border-[#5EEAD4] dark:border-[#14B8A6] rounded-t-xl rounded-b-none bg-[#E8FCF9] dark:bg-[#0F172A] relative z-10 translate-y-[1px]" : "bg-transparent text-[#0F172A] dark:text-[#94A3B8] rounded-xl hover:bg-slate-200/50 dark:hover:bg-[#1E293B]"
          )}>
            {servicesLabel}
            <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
          </button>
          
          <div className="absolute top-full left-1/2 -translate-x-1/2 pt-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="bg-background border border-white/10 rounded-2xl shadow-xl w-[220px] p-2 flex flex-col gap-1 text-right" dir={dir}>
              <DropdownLink to="/instructors" title={t.nav.faculty} isActive={isInstructors} />
              <DropdownLink to="/rideshare" title={t.nav.rideshare} isActive={isRideShare} />
              <DropdownLink to="/roommate" title={t.nav.roommate} isActive={isRoommateMatch} />
              <DropdownLink to="/gpa" title={t.nav.gpa} isActive={isGpa} />
              <DropdownLink to="/majors" title={t.nav.majors} isActive={isMajors} />
            </div>
          </div>
        </div>

        {/* Map Dropdown */}
        <div className="relative group">
          <button className={cn(
            "inline-flex w-max items-center justify-center px-4 py-2 text-base lg:text-lg font-semibold font-['Cairo'] transition-colors hover:text-[#14B8A6] focus:outline-none",
            isMapActive ? "text-[#14B8A6] border-t border-x border-[#5EEAD4] dark:border-[#14B8A6] rounded-t-xl rounded-b-none bg-[#E8FCF9] dark:bg-[#0F172A] relative z-10 translate-y-[1px]" : "bg-transparent text-[#0F172A] dark:text-[#94A3B8] rounded-xl hover:bg-slate-200/50 dark:hover:bg-[#1E293B]"
          )}>
            {mapLabel}
            <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
          </button>
          
          <div className="absolute top-full left-1/2 -translate-x-1/2 pt-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="bg-background border border-white/10 rounded-2xl shadow-xl w-[200px] p-2 flex flex-col gap-1 text-right" dir={dir}>
              <DropdownLink to="/campus-map" title={t.nav.campusMap} isActive={isCampusMap} />
              <DropdownLink to="/recreation" title={t.nav.recreation} isActive={isRecreation} />
            </div>
          </div>
        </div>

        <NavLink to="/marketplace" isActive={isMarketplaceActive}>{t.nav.marketplace}</NavLink>
      </div>

      {/* Far Left: Icons */}
      <div className="flex items-center justify-end gap-1 lg:gap-2 text-[#0F172A] dark:text-[#94A3B8] shrink-0">
        <NotificationsCenter />
        <Link to="/contact" className="hover:text-[#14B8A6] transition-colors p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-[#1E293B]">
          <Headset className="w-5 h-5" />
        </Link>
        <Link to="/settings" className="hover:text-[#14B8A6] transition-colors p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-[#1E293B]">
          <Settings className="w-5 h-5" />
        </Link>
        {user ? (
          <div className="relative group">
            <button className="hover:text-[#14B8A6] transition-colors p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-[#1E293B] block focus:outline-none">
              <User className="w-5 h-5" />
            </button>
            <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl shadow-xl w-[200px] p-2 flex flex-col gap-1 text-right" dir={dir}>
                <Link to="/profile" className="flex items-center gap-2 select-none space-x-reverse rounded-xl p-3 leading-none no-underline outline-none transition-colors hover:bg-[#F1F5F9] dark:hover:bg-[#0F172A] hover:text-[#14B8A6] dark:hover:text-[#14B8A6] text-[#0F172A] dark:text-[#F8FAFC]">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-bold font-['Cairo']">{t.nav.profile}</span>
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="flex items-center gap-2 select-none space-x-reverse rounded-xl p-3 leading-none no-underline outline-none transition-colors hover:bg-[#F1F5F9] dark:hover:bg-[#0F172A] hover:text-amber-500 dark:hover:text-amber-400 text-[#F59E0B] dark:text-[#F59E0B]">
                    <ShieldAlert className="w-4 h-4" />
                    <span className="text-sm font-bold font-['Cairo']">{t.nav.admin}</span>
                  </Link>
                )}
                <button 
                  onClick={async () => {
                    await signOut();
                    navigate("/auth");
                  }}
                  className="flex items-center gap-2 w-full text-right select-none space-x-reverse rounded-xl p-3 leading-none no-underline outline-none transition-colors hover:bg-red-500/10 text-red-500 dark:text-[#F87171] hover:text-red-600 dark:hover:text-red-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-bold font-['Cairo']">{t.nav.logout}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <Link to="/auth" className="hover:text-[#14B8A6] transition-colors p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-[#1E293B]">
            <User className="w-5 h-5" />
          </Link>
        )}
      </div>
    </div>
  );
});

DesktopNavbar.displayName = "DesktopNavbar";
export default DesktopNavbar;
