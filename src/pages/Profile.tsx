import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, Phone, GraduationCap, MapPin, 
  Calendar, ShieldCheck, ArrowRight, Settings as SettingsIcon 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePreferences } from "@/contexts/PreferencesContext";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import BrandedLoader from "@/components/BrandedLoader";
import { usePhoneData } from "@/lib/usePhoneData";
import { MAJOR_LABELS } from "@/lib/majors";



export default function Profile() {
  const { user } = useAuth();
  const { phone: userPhone, loading: phoneLoading } = usePhoneData();
  const { lang, dir } = usePreferences();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const isAr = lang === "ar";

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user]);

  if (loading) {
    return <BrandedLoader />;
  }

  const InfoItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      if (!value) return;
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <motion.button
        onClick={handleCopy}
        whileHover={{ y: -4, scale: 1.01 }}
        whileTap={{ scale: 0.98, opacity: 0.7 }}
        className="flex items-center gap-4 p-5 rounded-2xl bg-surface/30 border border-border/50 backdrop-blur-md w-full text-start group relative overflow-hidden transition-colors hover:border-primary/30"
      >
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary transition-transform group-hover:scale-110">
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-0.5 opacity-60">{label}</p>
          <p className="text-lg font-black text-foreground">{value || "—"}</p>
        </div>
        
        <AnimatePresence>
          {copied && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="absolute inset-y-0 right-0 flex items-center pr-6 bg-gradient-to-l from-primary/20 to-transparent pointer-events-none"
            >
              <span className="text-[10px] font-black uppercase text-primary tracking-tighter">
                {isAr ? "تم النسخ" : "Copied"}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse effect overlay */}
        <motion.div
          initial={false}
          animate={copied ? { opacity: [0, 0.5, 0] } : { opacity: 0 }}
          className="absolute inset-0 bg-primary/10 pointer-events-none"
        />
      </motion.button>
    );
  };

  return (
    <div className="min-h-screen pb-20 pt-6 px-4 max-w-4xl mx-auto overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ 
          duration: 0.6, 
          ease: [0.22, 1, 0.36, 1] 
        }}
        className="space-y-8"
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-sidebar-border/50">
          <div className="flex items-center gap-6">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
              className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-2xl shadow-primary/20"
            >
              <User className="w-12 h-12" />
            </motion.div>
            <div>
              <motion.h1 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-black mb-2"
              >
                {profile?.full_name || user?.email?.split("@")[0]}
              </motion.h1>
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-2 text-primary font-bold"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isAr ? "حساب مُوثق" : "Verified Account"}</span>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link
              to="/settings"
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-surface hover:bg-surface-hover border border-border/50 transition-all font-black text-sm"
            >
              <SettingsIcon className="w-4 h-4" />
              {isAr ? "تعديل الملف الشخصي" : "Edit Profile"}
            </Link>
          </motion.div>
        </div>

        {/* Info Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.4
              }
            }
          }}
        >
          {[
            { icon: User, label: isAr ? "الاسم الكامل" : "Full Name", value: profile?.full_name },
            { icon: Mail, label: isAr ? "البريد الإلكتروني" : "Email", value: user?.email || "" },
            { icon: Phone, label: isAr ? "رقم الهاتف" : "Phone Number", value: phoneLoading ? "جاري التحميل…" : (userPhone ?? profile?.phone) },
            { icon: GraduationCap, label: isAr ? "التخصص" : "Major", value: profile?.major ? MAJOR_LABELS[profile.major] || profile.major : "" },
            { icon: Calendar, label: isAr ? "السنة الدراسية" : "Academic Year", value: profile?.academic_year },
            { icon: ShieldCheck, label: isAr ? "الرقم الجامعي" : "Student ID", value: profile?.student_id },
            { icon: MapPin, label: isAr ? "الجنس" : "Gender", value: profile?.gender === "male" ? (isAr ? "ذكر" : "Male") : profile?.gender === "female" ? (isAr ? "أنثى" : "Female") : "" },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 }
              }}
            >
              <InfoItem 
                icon={item.icon} 
                label={item.label} 
                value={item.value} 
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Footer Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10"
        >
          <p className="text-sm font-bold text-muted-foreground leading-relaxed text-center">
            {isAr 
              ? "هذه المعلومات تُستخدم لتخصيص تجربتك داخل تطبيق مُرشد. إذا لاحظت أي خطأ، يمكنك تعديله من صفحة الإعدادات."
              : "This information is used to personalize your experience within the Murshid app. If you notice any errors, you can edit them from the settings page."}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
