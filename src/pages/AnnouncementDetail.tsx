import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Megaphone, ImagePlus, Sparkles, ExternalLink, GraduationCap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { isAnnouncementVisibleForMajor } from "@/lib/majors";
import { isUserAdmin } from "@/lib/admin";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePreferences } from "@/contexts/PreferencesContext";
import { announcements } from "@/data/announcements";
import { getOptimizedStorageUrl } from "@/lib/utils";

export default function AnnouncementDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { lang, dir } = usePreferences();
  const { user } = useAuth();
  const [ann, setAnn] = useState<any>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function fetchAnnouncement() {
      setLoading(true);
      setAccessDenied(false);
      try {
        const { data } = await supabase
          .from("announcements")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (!active) return;

        if (data) {
          const isAdmin = isUserAdmin(user?.email);
          let currentMajor = user?.user_metadata?.major || null;
          if (user && !isAdmin) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("major")
              .eq("id", user.id)
              .maybeSingle();
            currentMajor = profile?.major || currentMajor;
          }
          if (isAnnouncementVisibleForMajor(data, currentMajor, isAdmin)) {
            setAnn(data);
          } else {
            setAccessDenied(true);
            setAnn(null);
          }
        } else {
          const mock = announcements.find(a => a.id === id);
          setAnn(mock);
        }
      } catch (err) {
        if (active) {
          console.error("Error fetching announcement:", err);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchAnnouncement();

    return () => {
      active = false;
    };
  }, [id, user]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 50);
    return () => clearTimeout(timer);
  }, [id, loading]);

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 pt-28 pb-20">
        <Skeleton className="w-full h-64 md:h-96 rounded-2xl mb-8" />
        <Skeleton className="h-12 w-3/4 mb-6" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  if (!ann) {
    return (
      <div className="text-center py-20 bg-background min-h-screen flex flex-col items-center justify-center">
        <p className="text-muted-foreground mb-4 font-['Cairo']">
          {accessDenied
            ? (lang === "ar" ? "لا تملك صلاحية عرض هذا الإعلان." : "You do not have access to this announcement.")
            : (lang === "ar" ? "الإعلان غير موجود." : "Announcement not found.")}
        </p>
        <Button onClick={() => nav("/")} className="bg-accent hover:bg-accent/80 text-accent-foreground font-bold">
          {lang === "ar" ? "الرئيسية" : "Dashboard"}
        </Button>
      </div>
    );
  }

  const title = lang === "ar" ? (ann.title_ar || ann.title) : (ann.title || ann.title_ar);
  const full = lang === "ar" ? (ann.full_description_ar || ann.full_description) : (ann.full_description || ann.full_description_ar);
  const badge = lang === "ar" ? (ann.badge_ar || ann.badge) : (ann.badge || ann.badge_ar);
  const ctaLabel = lang === "ar" ? (ann.cta_label_ar || ann.cta_label) : (ann.cta_label || ann.cta_label_ar);
  const ctaLink = ann.cta_link;
  const imageUrl = ann.image_url;
  const backLabel = lang === "ar" ? "العودة إلى الرئيسية" : "Back to Dashboard";

  return (
    <motion.div
      dir={dir}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-cairo min-h-screen bg-gradient-to-b from-[#F8FAFC] dark:from-[#0B1220] via-[#F8FAFC] dark:via-[#111827] to-[#F1F5F9] dark:to-[#0F172A] pb-20"
    >
      {/* Header / Back Navigation */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 pt-8 md:pt-12 mb-8 flex justify-between items-center relative z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-[#64748B] dark:text-[#94A3B8] hover:text-[#14B8A6] dark:hover:text-[#14B8A6] hover:bg-[#F1F5F9] dark:hover:bg-[#0F172A] transition-all font-bold shadow-sm"
        >
          <ArrowLeft className={`h-4 w-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
          {backLabel}
        </Link>
        <div className="h-10 w-10 rounded-full bg-[#E8FCF9] dark:bg-[#0F172A] border border-[#5EEAD4]/30 dark:border-[#14B8A6]/30 flex items-center justify-center text-[#14B8A6]">
          <Megaphone className="h-5 w-5" />
        </div>
      </div>

      {/* FULL-WIDTH HERO IMAGE */}
      <motion.section
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full h-[50vh] md:h-[65vh] overflow-hidden"
      >
        {imageUrl ? (
          <img 
            src={getOptimizedStorageUrl(imageUrl, 1200, 800)} 
            width={1200}
            height={800}
            fetchpriority="high"
            className="w-full h-full object-cover" 
            alt={title} 
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#0a192f] to-[#001a33] flex items-center justify-center">
            <Sparkles className="h-20 w-20 text-cyan-500/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        {/* Content Over Hero */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-[1440px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5EEAD4] dark:bg-[#14B8A6] text-[#0F172A] dark:text-[#0B1220] text-xs font-black uppercase tracking-widest mb-6 shadow-sm"
          >
            {badge}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-7xl font-black text-[#F8FAFC] font-['Cairo'] tracking-tight mb-4 drop-shadow-2xl"
          >
            {title}
          </motion.h1>
        </div>
      </motion.section>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Description Column */}
        <div className="lg:col-span-2 space-y-12">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#F8FAFC] dark:bg-[#1E293B] backdrop-blur-3xl border border-[#E2E8F0] dark:border-[#334155] rounded-[2.5rem] p-8 md:p-12 shadow-[0_4px_6px_-1px_rgba(15,23,42,0.05)] dark:shadow-[0_4px_6px_-1px_rgba(15,23,42,0.5)]"
          >
            <p className="text-lg md:text-xl leading-[1.8] text-[#64748B] dark:text-[#94A3B8] font-bold font-['Cairo'] whitespace-pre-line">
              {full}
            </p>

            {ctaLink && ann.id !== 'official-launch-v1' && (
              <div className="mt-12">
                <a
                  href={ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-[#5EEAD4] dark:bg-[#14B8A6] hover:bg-[#5EEAD4]/80 dark:hover:bg-[#0d9488] text-[#0F172A] dark:text-[#0B1220] font-black transition-all shadow-sm hover:scale-105"
                >
                  {ctaLabel}
                  <ExternalLink className="h-5 w-5" />
                </a>
              </div>
            )}
          </motion.section>
        </div>

        {/* Sidebar Info Column */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-[2rem] p-8 shadow-[0_4px_6px_-1px_rgba(15,23,42,0.05)] dark:shadow-[0_4px_6px_-1px_rgba(15,23,42,0.5)]"
          >
            <h3 className="text-[#0F172A] dark:text-[#F8FAFC] font-black mb-6 flex items-center gap-2 font-['Cairo']">
              <GraduationCap className="h-5 w-5 text-[#0F172A] dark:text-[#F8FAFC]" />
              {lang === "ar" ? "معلومات المشروع" : "Project Info"}
            </h3>
            <ul className="space-y-4">
              <li className="flex flex-col gap-1">
                <span className="text-xs text-[#64748B] dark:text-[#94A3B8] uppercase font-black tracking-widest">{lang === 'ar' ? 'الحالة الأكاديمية' : 'Academic Status'}</span>
                <span className="text-[#64748B] dark:text-[#94A3B8] text-lg font-bold font-['Cairo']">{lang === 'ar' ? 'طالب هندسة - السنة الثانية - جامعة البلقاء التطبيقية' : 'Engineering Student - 2nd Year - BAU'}</span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-xs text-[#64748B] dark:text-[#94A3B8] uppercase font-black tracking-widest">{lang === 'ar' ? 'التخصص' : 'Major'}</span>
                <span className="text-[#64748B] dark:text-[#94A3B8] text-lg font-bold font-['Cairo']">{lang === 'ar' ? 'جميع التخصصات الهندسية' : 'All Engineering Majors'}</span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-xs text-[#64748B] dark:text-[#94A3B8] uppercase font-black tracking-widest">{lang === 'ar' ? 'الإصدار' : 'Version'}</span>
                <span className="text-[#14B8A6] text-xl font-black">v1.0.0 Stable</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-[#E8FCF9] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] rounded-[2rem] p-8 group hover:bg-[#E8FCF9]/80 dark:hover:bg-[#0F172A]/80 transition-all shadow-[0_4px_6px_-1px_rgba(15,23,42,0.05)] dark:shadow-[0_4px_6px_-1px_rgba(15,23,42,0.5)]"
          >
            <h3 className="text-[#0F172A] dark:text-[#F8FAFC] font-black mb-4 flex items-center gap-2 font-['Cairo']">
              <Users className="h-5 w-5 text-[#0F172A] dark:text-[#F8FAFC]" />
              {lang === "ar" ? "تواصل معنا" : "Connect with Us"}
            </h3>
            <p className="text-sm text-[#64748B] dark:text-[#94A3B8] font-bold mb-6 font-['Cairo']">
              {lang === "ar" ? "للمقترحات والتعاون الأكاديمي، تواصل معنا عبر حسابنا الرسمي." : "For suggestions and academic collaboration, connect with us via our official handle."}
            </p>
            <a
              href="https://wa.me/962785159906"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button className="w-full bg-[#1E293B] dark:bg-[#2563EB] text-[#F8FAFC] font-black hover:bg-slate-800 dark:hover:bg-blue-700 transition-colors">
                {lang === "ar" ? "تواصل عبر الواتساب" : "Contact via WhatsApp"}
              </Button>
            </a>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
