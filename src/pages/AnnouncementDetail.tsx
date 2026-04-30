import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Megaphone, ImagePlus, Sparkles, ExternalLink, GraduationCap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePreferences } from "@/contexts/PreferencesContext";
import { announcements } from "@/data/announcements";

export default function AnnouncementDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { lang, dir } = usePreferences();
  const [ann, setAnn] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnnouncement() {
      try {
        const { data } = await supabase
          .from("announcements")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (data) {
          setAnn(data);
        } else {
          const mock = announcements.find(a => a.id === id);
          setAnn(mock);
        }
      } catch (err) {
        console.error("Error fetching announcement:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAnnouncement();
  }, [id]);

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
          {lang === "ar" ? "الإعلان غير موجود." : "Announcement not found."}
        </p>
        <Button onClick={() => nav("/")} className="bg-accent hover:bg-accent/80 text-accent-foreground font-bold">
          {lang === "ar" ? "الرئيسية" : "Dashboard"}
        </Button>
      </div>
    );
  }

  const title = lang === "ar" ? (ann.titleAr || ann.title) : ann.title;
  const full = lang === "ar" ? (ann.fullDescriptionAr || ann.fullDescription) : (ann.fullDescription);
  const badge = lang === "ar" ? (ann.badgeAr || ann.badge) : ann.badge;
  const ctaLabel = lang === "ar" ? (ann.ctaLabelAr || ann.ctaLabel) : (ann.ctaLabel);
  const ctaLink = ann.ctaLink;
  const imageUrl = ann.imageUrl;
  const backLabel = lang === "ar" ? "العودة إلى الرئيسية" : "Back to Dashboard";

  return (
    <motion.div
      dir={dir}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-cairo min-h-screen bg-background pb-20"
    >
      {/* Header / Back Navigation */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 pt-8 md:pt-12 mb-8 flex justify-between items-center relative z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface/5 border border-border text-foreground/70 hover:text-accent hover:bg-surface/10 transition-all font-bold"
        >
          <ArrowLeft className={`h-4 w-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
          {backLabel}
        </Link>
        <div className="h-10 w-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent">
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
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
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
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-black uppercase tracking-widest mb-6 shadow-gold"
          >
            {badge}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-7xl font-black text-white font-['Cairo'] tracking-tight mb-4 drop-shadow-2xl"
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
            className="bg-surface/40 backdrop-blur-3xl border border-border rounded-[2.5rem] p-8 md:p-12 shadow-2xl"
          >
            <p className="text-lg md:text-xl leading-[1.8] text-foreground/80 font-bold font-['Cairo'] whitespace-pre-line">
              {full}
            </p>

            {ctaLink && ann.id !== 'official-launch-v1' && (
              <div className="mt-12">
                <a 
                  href={ctaLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-accent hover:bg-accent/80 text-accent-foreground font-black transition-all shadow-gold hover:scale-105"
                >
                  {ctaLabel}
                  <ExternalLink className="h-5 w-5" />
                </a>
              </div>
            )}
          </motion.section>

          {/* TEAM SPECIFICATIONS (Only for official launch) */}
          {ann.id === 'official-launch-v1' && ann.founders && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 space-y-10"
            >
              <div className="flex items-center gap-4">
                <h2 className="text-2xl md:text-4xl font-black text-white font-['Cairo'] tracking-tight">
                  {lang === "ar" ? "المواصفات الفنية للفريق" : "Team Technical Specifications"}
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/30 to-transparent" />
              </div>

              <div className="grid grid-cols-1 gap-6">
                {ann.founders.map((founder: any, idx: number) => (
                  <div 
                    key={idx}
                    className="group bg-surface/60 backdrop-blur-3xl border border-accent/10 p-6 md:p-8 rounded-[2rem] flex flex-col md:flex-row gap-6 items-center md:items-start transition-all hover:border-accent/30"
                  >
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border border-accent/20 overflow-hidden shrink-0">
                      <img src={founder.image} alt={founder.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-4 text-center md:text-start">
                      <div>
                        <h3 className="text-xl md:text-2xl font-black text-white font-['Cairo'] mb-1">
                          {lang === "ar" ? founder.nameAr : founder.name}
                        </h3>
                        <p className="text-accent text-xs font-black uppercase tracking-widest">
                          {lang === "ar" ? founder.roleAr : founder.role}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-surface/5 p-3 rounded-xl border border-border">
                          <span className="block text-[10px] text-foreground/40 uppercase font-black tracking-widest mb-1">{lang === 'ar' ? 'المسؤولية' : 'Responsibility'}</span>
                          <span className="text-foreground/80 text-sm font-bold font-['Cairo']">{lang === 'ar' ? founder.bioAr : founder.bio}</span>
                        </div>
                        <div className="bg-surface/5 p-3 rounded-xl border border-border">
                          <span className="block text-[10px] text-foreground/40 uppercase font-black tracking-widest mb-1">{lang === 'ar' ? 'الدفعة' : 'Class'}</span>
                          <span className="text-foreground/80 text-sm font-bold font-['Cairo']">{lang === 'ar' ? 'دفعة 2028 (مهندس مستقبل)' : 'Class of 2028 (Future Engineer)'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}
        </div>

        {/* Sidebar Info Column */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-surface/5 border border-border rounded-[2rem] p-8"
          >
            <h3 className="text-foreground font-black mb-6 flex items-center gap-2 font-['Cairo']">
              <GraduationCap className="h-5 w-5 text-accent" />
              {lang === "ar" ? "معلومات المشروع" : "Project Info"}
            </h3>
            <ul className="space-y-4">
               <li className="flex flex-col gap-1">
                 <span className="text-[10px] text-foreground/40 uppercase font-black tracking-widest">{lang === 'ar' ? 'الحالة الأكاديمية' : 'Academic Status'}</span>
                 <span className="text-foreground font-bold font-['Cairo']">{lang === 'ar' ? 'طالب هندسة - السنة الثانية - جامعة البلقاء التطبيقية' : 'Engineering Student - 2nd Year - BAU'}</span>
               </li>
               <li className="flex flex-col gap-1">
                 <span className="text-[10px] text-foreground/40 uppercase font-black tracking-widest">{lang === 'ar' ? 'التخصص' : 'Major'}</span>
                 <span className="text-foreground font-bold font-['Cairo']">{lang === 'ar' ? 'جميع التخصصات الهندسية' : 'All Engineering Majors'}</span>
               </li>
               <li className="flex flex-col gap-1">
                 <span className="text-[10px] text-foreground/40 uppercase font-black tracking-widest">{lang === 'ar' ? 'الإصدار' : 'Version'}</span>
                 <span className="text-accent font-black">v1.0.0 Stable</span>
               </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-accent/10 border border-accent/20 rounded-[2rem] p-8 group hover:bg-accent/20 transition-all"
          >
            <h3 className="text-foreground font-black mb-4 flex items-center gap-2 font-['Cairo']">
              <Users className="h-5 w-5 text-accent" />
              {lang === "ar" ? "تواصل معنا" : "Connect with Us"}
            </h3>
            <p className="text-sm text-muted-foreground font-bold mb-6 font-['Cairo']">
              {lang === "ar" ? "للمقترحات والتعاون الأكاديمي، تواصل مع الفريق عبر حسابنا الرسمي." : "For suggestions and academic collaboration, connect with the team via our official handle."}
            </p>
            <a 
              href="https://wa.me/962785159906" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <Button className="w-full bg-foreground text-background font-black hover:bg-accent hover:text-accent-foreground transition-colors">
                {lang === "ar" ? "تواصل عبر الواتساب" : "Contact via WhatsApp"}
              </Button>
            </a>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
