import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings as SettingsIcon, Palette, Languages, Sun, Moon, Check, 
  User, Mail, Phone, MapPin, GraduationCap, Lock, ShieldCheck, 
  Loader2, ArrowRight, Smartphone, Plus, Minus, RotateCcw
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BrandedLoader from "@/components/BrandedLoader";
import { MAJOR_LABELS } from "@/lib/majors";

type TabId = "profile" | "appearance" | "language";



export default function Settings() {
  const { t, theme, setTheme, lang, setLang, dir, fontSize, setFontSize } = usePreferences();
  const { user } = useAuth();
  const [tab, setTab] = useState<TabId>("profile");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  
  // Profile Editable States
  const [newFullName, setNewFullName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newYear, setNewYear] = useState("");
  const [newStudentID, setNewStudentID] = useState("");
  const [newMajor, setNewMajor] = useState("");
  const [newGender, setNewGender] = useState("");
  const [newBio, setNewBio] = useState("");

  const [maintenanceActive, setMaintenanceActive] = useState(false);
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);

  const isAr = lang === "ar";

  useEffect(() => {
    if (profile?.is_admin) {
      fetchMaintenanceStatus();
    }
  }, [profile]);

  async function fetchMaintenanceStatus() {
    setMaintenanceLoading(true);
    try {
      const { data } = await supabase
        .from("maintenance_mode")
        .select("is_active")
        .eq("page_id", "global")
        .maybeSingle();
      if (data) {
        setMaintenanceActive(data.is_active);
      }
    } catch (err) {
      console.error("Error fetching maintenance status:", err);
    } finally {
      setMaintenanceLoading(false);
    }
  }

  async function handleToggleMaintenance() {
    setMaintenanceLoading(true);
    const newStatus = !maintenanceActive;
    try {
      const { error } = await supabase
        .from("maintenance_mode")
        .upsert({
          page_id: "global",
          is_active: newStatus,
          message_ar: "الموقع تحت الصيانة حالياً. سنعود قريباً!",
          message_en: "The website is currently under maintenance. We will be back soon!"
        });
      if (error) throw error;
      setMaintenanceActive(newStatus);
      toast.success(
        isAr 
          ? (newStatus ? "تم تفعيل وضع الصيانة بنجاح" : "تم إلغاء وضع الصيانة بنجاح")
          : (newStatus ? "Maintenance mode enabled successfully" : "Maintenance mode disabled successfully")
      );
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setMaintenanceLoading(false);
    }
  }

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  async function fetchProfile() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .maybeSingle();

      if (data) {
        setProfile(data);
        setNewFullName(data.full_name || "");
        setNewEmail(user?.email || "");
        setNewPhone(data.phone || "");
        setNewYear(data.academic_year || "");
        setNewStudentID(data.student_id || "");
        setNewMajor(data.major || "");
        setNewGender(data.gender || "");
        setNewBio(data.bio || "");
      } else {
        setProfile({ id: user?.id });
        setNewFullName(user?.user_metadata?.full_name || user?.user_metadata?.name || "");
        setNewEmail(user?.email || "");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setUpdating(true);

    try {
      // 1. Update Email if changed
      if (newEmail !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({ email: newEmail });
        if (emailError) throw emailError;
        toast.success(
          isAr 
            ? "تم إرسال روابط تأكيد لكل من البريد القديم والجديد. يجب تأكيد كليهما." 
            : "Confirmation links sent to both old and new emails. You must confirm both."
        );
      }

      // 2. Update Database Profile
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          full_name: newFullName,
          phone: newPhone,
          academic_year: newYear,
          student_id: newStudentID,
          major: newMajor,
          gender: newGender,
          bio: newBio
        });

      if (profileError) throw profileError;
      
      toast.success(isAr ? "تم تحديث البيانات بنجاح" : "Profile updated successfully");
      fetchProfile();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUpdating(false);
    }
  }

  async function handlePasswordReset() {
    if (!user?.email) return;
    setUpdating(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success(isAr ? "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك" : "Password reset link sent to your email");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUpdating(false);
    }
  }

  const tabs: { id: TabId; label: string; icon: any }[] = [
    { id: "profile", label: isAr ? "الملف الشخصي" : "Profile", icon: User },
    { id: "appearance", label: t.settings.tabs.appearance, icon: Palette },
    { id: "language", label: t.settings.tabs.language, icon: Languages },
  ];

  if (loading) {
    return <BrandedLoader />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="max-w-4xl mx-auto w-full pt-28 pb-10 px-4"
    >
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10 flex items-center gap-4"
      >
        <div className="relative h-14 w-14 rounded-2xl grid place-items-center bg-gradient-to-br from-primary to-primary/60 ring-1 ring-accent/40 shadow-[0_0_30px_hsl(var(--accent)/0.35)]">
          <div className="absolute inset-0 rounded-2xl bg-accent/10 blur-md" />
          <SettingsIcon className="relative h-7 w-7 text-primary-foreground drop-shadow-[0_0_8px_hsl(var(--accent)/0.6)]" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none text-foreground">{t.settings.title}</h1>
          <p className="text-muted-foreground text-sm md:text-base mt-2 font-bold">{t.settings.subtitle}</p>
        </div>
      </motion.header>

      {/* Segmented control */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="relative grid grid-cols-3 gap-1 p-2 rounded-2xl border border-border bg-surface/50 dark:bg-surface/10 backdrop-blur-xl mb-8 shadow-sm"
      >
        {tabs.map(({ id, label, icon: Icon }) => {
          const active = tab === id;
          return (
            <motion.button
              key={id}
              onClick={() => setTab(id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "relative z-10 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-black transition-colors duration-300",
                active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {active && (
                <motion.span
                  layoutId="settings-tab-pill"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  className="absolute inset-0 rounded-xl bg-primary shadow-[0_4px_18px_hsl(var(--primary)/0.4),inset_0_1px_0_hsl(0_0%_100%/0.08)] ring-1 ring-primary/30"
                />
              )}
              <Icon className="relative h-4 w-4" />
              <span className="relative">{label}</span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {tab === "profile" && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            {profile ? (
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name (Static) */}
                  <div className="space-y-2">
                    <Label className="text-sm font-black text-foreground/70 uppercase tracking-widest flex items-center gap-2">
                      <User size={14} /> {isAr ? "الاسم الكامل" : "Full Name"}
                    </Label>
                    <Input 
                      value={newFullName} 
                      onChange={(e) => setNewFullName(e.target.value)}
                      className="h-12 bg-surface font-bold border-border focus:border-primary transition-all" 
                    />
                  </div>

                  {/* Student ID (Editable) */}
                  <div className="space-y-2">
                    <Label className="text-sm font-black text-foreground/70 uppercase tracking-widest flex items-center gap-2">
                      <GraduationCap size={14} /> {isAr ? "الرقم الجامعي" : "Student ID"}
                    </Label>
                    <Input 
                      value={newStudentID} 
                      onChange={(e) => setNewStudentID(e.target.value)} 
                      className="h-12 bg-surface font-bold border-border focus:border-primary transition-all" 
                    />
                  </div>

                  {/* Gender (Editable) */}
                  <div className="space-y-2">
                    <Label className="text-sm font-black text-foreground/70 uppercase tracking-widest flex items-center gap-2">
                      <User size={14} /> {isAr ? "الجنس" : "Gender"}
                    </Label>
                    <Select value={newGender} onValueChange={setNewGender}>
                      <SelectTrigger className="h-12 rounded-xl bg-surface border border-border px-4 font-bold outline-none focus:border-primary transition-all">
                        <SelectValue placeholder={isAr ? "اختر الجنس" : "Select Gender"} />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="male" className="font-bold">{isAr ? "ذكر" : "Male"}</SelectItem>
                        <SelectItem value="female" className="font-bold">{isAr ? "أنثى" : "Female"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Email (Editable) */}
                  <div className="space-y-2">
                    <Label className="text-sm font-black text-foreground/70 uppercase tracking-widest flex items-center gap-2">
                      <Mail size={14} /> {isAr ? "البريد الإلكتروني" : "Email Address"}
                    </Label>
                    <div className="relative">
                      <Input 
                        type="email" 
                        value={newEmail} 
                        onChange={(e) => setNewEmail(e.target.value)} 
                        className="h-12 bg-surface font-bold border-border focus:border-primary transition-all" 
                      />
                      {newEmail !== user?.email && (
                        <div className="absolute top-full mt-1 text-[10px] text-accent font-black animate-pulse">
                          {isAr ? "* يتطلب تأكيد البريد الجديد" : "* Requires verification of new email"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Phone (Editable) */}
                  <div className="space-y-2">
                    <Label className="text-sm font-black text-foreground/70 uppercase tracking-widest flex items-center gap-2">
                      <Phone size={14} /> {isAr ? "رقم الهاتف" : "Phone Number"}
                    </Label>
                    <Input 
                      type="tel" 
                      value={newPhone} 
                      onChange={(e) => setNewPhone(e.target.value)} 
                      className="h-12 bg-surface font-bold border-border focus:border-primary transition-all" 
                    />
                  </div>

                  {/* Major (Editable) */}
                  <div className="space-y-2">
                    <Label className="text-sm font-black text-foreground/70 uppercase tracking-widest flex items-center gap-2">
                      <MapPin size={14} /> {isAr ? "التخصص" : "Major"}
                    </Label>
                    <Select value={newMajor} onValueChange={setNewMajor}>
                      <SelectTrigger className="h-12 rounded-xl bg-surface border border-border px-4 font-bold outline-none focus:border-primary transition-all">
                        <SelectValue placeholder={isAr ? "اختر التخصص" : "Select Major"} />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border max-h-[300px]">
                        {Object.entries(MAJOR_LABELS).map(([key, name]) => (
                          <SelectItem key={key} value={key} className="font-bold">
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Academic Year (Editable) */}
                  <div className="space-y-2">
                    <Label className="text-sm font-black text-foreground/70 uppercase tracking-widest flex items-center gap-2">
                      <SettingsIcon size={14} /> {isAr ? "السنة الأكاديمية" : "Academic Year"}
                    </Label>
                    <Select value={newYear} onValueChange={setNewYear}>
                      <SelectTrigger className="h-12 rounded-xl bg-surface border border-border px-4 font-bold outline-none focus:border-primary transition-all">
                        <SelectValue placeholder={isAr ? "اختر السنة" : "Select Year"} />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {[1, 2, 3, 4, 5].map(y => (
                          <SelectItem key={y} value={y.toString()} className="font-bold">
                            {isAr ? `السنة ${y}` : `Year ${y}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Bio (Editable) */}
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-sm font-black text-foreground/70 uppercase tracking-widest flex items-center gap-2">
                      <User size={14} /> {isAr ? "السيرة الذاتية (CV)" : "Bio / CV Summary"}
                    </Label>
                    <textarea 
                      value={newBio} 
                      onChange={(e) => setNewBio(e.target.value)}
                      placeholder={isAr ? "اكتب نبذة قصيرة عنك أو سيرة ذاتية مختصرة..." : "Write a short bio or CV summary..."}
                      className="w-full min-h-[120px] p-4 rounded-xl bg-surface border border-border font-bold outline-none focus:border-primary transition-all resize-none"
                    />
                  </div>
                </div>

                <div className="pt-6 flex flex-col sm:flex-row gap-4">
                  <Button 
                    type="submit" 
                    disabled={updating}
                    className="flex-1 h-14 rounded-2xl bg-primary text-primary-foreground font-black text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    {updating ? <Loader2 className="animate-spin" /> : <ShieldCheck className="mr-2 h-5 w-5" />}
                    {isAr ? "حفظ التغييرات" : "Save Profile Changes"}
                  </Button>

                  <Button 
                    type="button" 
                    onClick={handlePasswordReset}
                    variant="outline" 
                    disabled={updating}
                    className="flex-1 h-14 rounded-2xl border-2 border-accent/20 text-accent font-black text-lg hover:bg-accent/5 hover:border-accent/40 transition-all"
                  >
                    <Lock className="mr-2 h-5 w-5" />
                    {isAr ? "تغيير كلمة المرور" : "Change Password"}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="py-20 text-center">
                <p className="text-muted-foreground">{isAr ? "لم يتم العثور على بيانات الملف الشخصي" : "Profile data not found"}</p>
              </div>
            )}

            {/* Security Notice */}
            <div className="p-6 rounded-3xl bg-accent/5 border border-accent/10 flex items-start gap-4">
              <ShieldCheck className="w-6 h-6 text-accent shrink-0 mt-1" />
              <div>
                <h4 className="font-black text-accent mb-1">{isAr ? "أمان البيانات" : "Data Security"}</h4>
                <p className="text-sm text-muted-foreground font-bold leading-relaxed">
                  {isAr 
                    ? "جميع بياناتك مشفرة ومحمية. تغيير البريد الإلكتروني يتطلب تأكيداً من بريدك الجديد لضمان ملكية الحساب."
                    : "All your data is encrypted and protected. Changing your email requires confirmation from your new address to ensure account ownership."}
                </p>
              </div>
            </div>

            {/* Maintenance Mode for Admin */}
            {profile?.is_admin && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 rounded-[2.5rem] bg-card/45 backdrop-blur-xl border border-white/5 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-foreground flex items-center gap-2">
                      <ShieldCheck className="h-6 w-6 text-primary" />
                      {isAr ? "لوحة الإدارة - وضع الصيانة" : "Admin Panel - Maintenance Mode"}
                    </h3>
                    <p className="text-sm text-muted-foreground font-bold">
                      {isAr 
                        ? "تفعيل وضع الصيانة سيقوم بقفل الموقع بالكامل لجميع الطلاب."
                        : "Enabling maintenance mode will lock the entire site for all students."}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {maintenanceLoading && <Loader2 className="animate-spin text-primary w-5 h-5" />}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={maintenanceActive} 
                        onChange={handleToggleMaintenance} 
                        disabled={maintenanceLoading}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-8 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-foreground after:border-white/20 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary" />
                      <span className="ms-3 text-lg font-black text-foreground">الصيانة</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {tab === "appearance" && (
          <motion.div
            key="appearance"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Theme Selection */}
            <Label className="mb-5 block text-foreground text-base font-black">{t.settings.theme}</Label>
            <div className="grid sm:grid-cols-2 gap-8 mb-10 max-w-3xl mx-auto">
              <ThemeCard
                active={theme === "light"}
                onClick={() => setTheme("light")}
                title={t.settings.light}
                preview={
                  <div className="h-32 rounded-2xl bg-white border border-slate-200 grid place-items-center">
                    <Sun className="h-10 w-10 text-cyan-500" />
                  </div>
                }
              />
              <ThemeCard
                active={theme === "dark"}
                onClick={() => setTheme("dark")}
                title={t.settings.dark}
                preview={
                  <div className="h-32 rounded-2xl bg-black border border-white/10 grid place-items-center">
                    <Moon className="h-10 w-10 text-cyan-400" />
                  </div>
                }
              />
            </div>

          </motion.div>
        )}

        {tab === "language" && (
          <motion.div
            key="language"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Label className="mb-5 block text-foreground text-base font-black">{t.settings.lang}</Label>
            <div className="grid sm:grid-cols-2 gap-5">
              <LanguageCard
                active={lang === "en"}
                onClick={() => setLang("en")}
                flag=""
                title="EN"
                subtitle={t.settings.english}
              />
              <LanguageCard
                active={lang === "ar"}
                onClick={() => setLang("ar")}
                flag=""
                title="JO"
                subtitle={t.settings.arabic}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function CornerCheck() {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
      className="absolute top-4 end-4 h-9 w-9 rounded-full grid place-items-center bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.7)]"
    >
      <Check className="h-5 w-5 stroke-[3]" />
    </motion.div>
  );
}

interface ThemeCardProps {
  active: boolean;
  onClick: () => void;
  title: string;
  preview: React.ReactNode;
}
function ThemeCard({ active, onClick, title, preview }: ThemeCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative p-5 rounded-2xl border text-start transition-all duration-300 backdrop-blur-xl overflow-hidden",
        active
          ? "border-primary bg-surface shadow-[0_0_30px_hsl(var(--primary)/0.2),inset_0_0_30px_hsl(var(--primary)/0.05)]"
          : "border-border bg-card hover:border-primary/50 text-foreground"
      )}
    >
      {preview}
      <div className={cn("font-black text-lg mt-4", active ? "text-primary" : "text-content")}>
        {title}
      </div>
      {active && <CornerCheck />}
    </motion.button>
  );
}

interface LanguageCardProps {
  active: boolean;
  onClick: () => void;
  flag: string;
  title: string;
  subtitle: string;
}
function LanguageCard({ active, onClick, flag, title, subtitle }: LanguageCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative p-8 rounded-2xl border text-start transition-all duration-300 backdrop-blur-xl overflow-hidden min-h-[180px]",
        active
          ? "border-primary bg-surface shadow-[0_0_36px_hsl(var(--primary)/0.2),inset_0_0_40px_hsl(var(--primary)/0.05)]"
          : "border-border bg-card hover:border-primary/50 text-foreground"
      )}
    >
      {active && (
        <div className="absolute -bottom-16 -end-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
      )}
      <div className="relative">
        <div className="text-5xl mb-4">{flag}</div>
        <div className={cn("font-black text-4xl", active ? "text-primary" : "text-content")}>
          {title}
        </div>
        <div className="text-xl text-content/60 mt-2 font-black">{subtitle}</div>
      </div>
      {active && <CornerCheck />}
    </motion.button>
  );
}
