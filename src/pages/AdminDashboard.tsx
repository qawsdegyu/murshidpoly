import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { usePreferences } from "@/contexts/PreferencesContext";
import PageHeader from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShieldAlert, Users, Building2, Utensils, Edit, Trash2, Plus, X, Save, Search,
  GraduationCap, BookOpen, Megaphone, Settings as SettingsIcon, FileText,
  Sparkles, Terminal, RefreshCw, AlertCircle, LayoutDashboard,
  Database, Copy, Calendar, Hammer, CheckCircle2, AlertTriangle, ClipboardCopy,
  ChevronLeft, ChevronRight, Eye, TrendingUp, Activity, Store, UserCheck, UserPlus,
  ToggleLeft, ToggleRight, PackageCheck, Ban, BellRing, Mail, Car, Home
} from "lucide-react";
import { performRAG, detectOllama, type AIResponse } from "@/services/ai-integration";
import { toast } from "sonner";
import { cn, sanitize } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { MAJOR_OPTIONS } from "@/lib/majors";
import FileUpload from "@/components/FileUpload";
import { isUserAdmin } from "@/lib/admin";
import BrandedLoader from "@/components/BrandedLoader";
import ChatbotKnowledgeManager from "@/components/ChatbotKnowledgeManager";
import CourseAlertsManager from "@/components/CourseAlertsManager";
import AdminAccountsManager from "@/components/AdminAccountsManager";
import SiteSettingsManager from "@/components/SiteSettingsManager";
import FeatureAccessManager from "@/components/FeatureAccessManager";
import ContactMessagesManager from "@/components/ContactMessagesManager";
import RideShareManager from "@/components/RideShareManager";
import RoommateMatchManager from "@/components/RoommateMatchManager";

const MASTER_SQL_SCRIPT = `-- ====================================================================
-- 🔑 Murshid Admin: Master Setup Script
-- شغّل هذا في Supabase SQL Editor مرة واحدة فقط
-- ====================================================================

-- الخطوة 1: دالة is_admin محسّنة (تقرأ من auth.users مباشرة)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
DECLARE
  user_email TEXT;
BEGIN
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = auth.uid()
  LIMIT 1;

  IF user_email IN (
    'mocvskhfssr@gmail.com',
    'mohammedsaqer151@gmail.com',
    'abdallahtahat2006@gmail.com',
    'murshidpolytechnic372@gmail.com'
  ) THEN
    RETURN true;
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  ) THEN
    RETURN true;
  END IF;

  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- الخطوة 2: تفعيل is_admin لجميع الأدمن
INSERT INTO public.profiles (id, is_admin)
SELECT u.id, true
FROM auth.users u
WHERE u.email IN (
  'mocvskhfssr@gmail.com',
  'mohammedsaqer151@gmail.com',
  'abdallahtahat2006@gmail.com',
  'murshidpolytechnic372@gmail.com'
)
ON CONFLICT (id) DO UPDATE SET is_admin = true;

-- الخطوة 3: تفعيل RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recreation_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_mode ENABLE ROW LEVEL SECURITY;

-- الخطوة 4: حذف policies القديمة
DO $$
DECLARE t text; p text;
BEGIN
  FOR t, p IN
    SELECT tablename, policyname FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename IN ('profiles','professors','buildings','recreation_places','courses','resources','announcements','maintenance_mode')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', p, t);
  END LOOP;
END $$;

-- الخطوة 5: إنشاء policies جديدة
CREATE POLICY "public_read_profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "own_update_profiles" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "admin_all_profiles" ON public.profiles TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_professors" ON public.professors FOR SELECT USING (true);
CREATE POLICY "admin_all_professors" ON public.professors TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_buildings" ON public.buildings FOR SELECT USING (true);
CREATE POLICY "admin_all_buildings" ON public.buildings TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_recreation" ON public.recreation_places FOR SELECT USING (true);
CREATE POLICY "admin_all_recreation" ON public.recreation_places TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "admin_all_courses" ON public.courses TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_resources" ON public.resources FOR SELECT USING (true);
CREATE POLICY "admin_all_resources" ON public.resources TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_announcements" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "admin_all_announcements" ON public.announcements TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public_read_maintenance" ON public.maintenance_mode FOR SELECT USING (true);
CREATE POLICY "admin_all_maintenance" ON public.maintenance_mode TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- الخطوة 6: إضافة أعمدة ناقصة
ALTER TABLE public.professors ADD COLUMN IF NOT EXISTS rank TEXT;
ALTER TABLE public.professors ADD COLUMN IF NOT EXISTS rank_ar TEXT;
ALTER TABLE public.professors ADD COLUMN IF NOT EXISTS office_hours TEXT;
ALTER TABLE public.professors ADD COLUMN IF NOT EXISTS profile_url TEXT;
ALTER TABLE public.professors ADD COLUMN IF NOT EXISTS building_id INTEGER;
ALTER TABLE public.recreation_places ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.recreation_places ADD COLUMN IF NOT EXISTS description_ar TEXT;
ALTER TABLE public.recreation_places ADD COLUMN IF NOT EXISTS description_en TEXT;
ALTER TABLE public.recreation_places ADD COLUMN IF NOT EXISTS map_url TEXT;
ALTER TABLE public.recreation_places ADD COLUMN IF NOT EXISTS icon_name TEXT;
ALTER TABLE public.recreation_places ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.recreation_places ADD COLUMN IF NOT EXISTS menu JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS instructors TEXT[];
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS uploader TEXT DEFAULT 'المشرف';
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS size TEXT;

-- ✅ انتهى! ارجع للتطبيق وجرب التعديل.
SELECT 'Setup Complete ✅' as status;`;

const MAJORS = MAJOR_OPTIONS;

const parseTargetMajors = (value: unknown): string[] => {
  const values = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(/[,|]/)
      : [];
  return Array.from(new Set(values
    .map(item => String(item).trim())
    .filter(item => item && item.toLowerCase() !== "all")));
};

const isLegacyGlobalTarget = (value: unknown): boolean => {
  const normalized = String(value ?? "").trim().toLowerCase();
  return normalized === "all" || normalized === "*";
};

// ─── Confirm Dialog Component ────────────────────────────────────────────────
function ConfirmDialog({ open, title, message, onConfirm, onCancel, danger = true }: {
  open: boolean; title: string; message: string;
  onConfirm: () => void; onCancel: () => void; danger?: boolean;
}) {
  if (!open) return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onCancel} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative z-10 w-full max-w-sm bg-card border border-border/50 rounded-3xl p-8 shadow-2xl text-center space-y-5">
          <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mx-auto",
            danger ? "bg-red-500/10" : "bg-primary/10")}>
            {danger ? <AlertTriangle className="w-8 h-8 text-red-500" /> : <CheckCircle2 className="w-8 h-8 text-primary" />}
          </div>
          <h3 className="text-xl font-black">{title}</h3>
          <p className="text-muted-foreground font-bold text-sm">{message}</p>
          <div className="flex gap-3">
            <button onClick={onCancel}
              className="flex-1 px-4 py-3 bg-surface border border-border rounded-2xl font-black text-sm hover:bg-white/5 transition-all">
              إلغاء
            </button>
            <button onClick={onConfirm}
              className={cn("flex-1 px-4 py-3 rounded-2xl font-black text-sm text-white transition-all",
                danger ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:opacity-90")}>
              تأكيد
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// ─── SQL Script Modal ─────────────────────────────────────────────────────────
function SqlScriptModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const copyScript = () => {
    navigator.clipboard.writeText(MASTER_SQL_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };
  if (!open) return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[180] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
        <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative z-10 w-full max-w-3xl max-h-[85vh] flex flex-col bg-card border border-primary/20 rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-border/50 bg-primary/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Database className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-black text-lg">SQL Script للإعداد</h3>
                <p className="text-xs text-muted-foreground font-bold">شغّله مرة واحدة في Supabase SQL Editor</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={copyScript}
                className={cn("flex items-center gap-2 px-4 py-2 rounded-xl font-black text-sm transition-all",
                  copied ? "bg-emerald-500 text-white" : "bg-primary text-white hover:opacity-90")}>
                {copied ? <CheckCircle2 className="w-4 h-4" /> : <ClipboardCopy className="w-4 h-4" />}
                {copied ? "تم النسخ ✓" : "نسخ الكود"}
              </button>
              <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center border border-border/50">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="overflow-y-auto flex-1 p-4">
            <pre className="text-xs font-mono text-emerald-400 bg-black/60 rounded-2xl p-5 whitespace-pre-wrap leading-relaxed border border-white/5">
              {MASTER_SQL_SCRIPT}
            </pre>
          </div>
          <div className="p-4 border-t border-border/30 bg-amber-500/5">
            <p className="text-xs text-amber-400 font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              افتح Supabase → SQL Editor → New Query → الصق الكود → Run
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const { lang, dir } = usePreferences();
  const navigate = useNavigate();
  const ar = lang === "ar";

  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "professors";
  const shouldOpenModal = searchParams.get("openModal") === "true";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [isModalOpen, setIsModalOpen] = useState(shouldOpenModal);
  const [modalType, setModalType] = useState<string | null>(shouldOpenModal ? initialTab : null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [uploadedUrls, setUploadedUrls] = useState<Record<string, string>>({});
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [selectedTargetMajors, setSelectedTargetMajors] = useState<string[]>([]);
  const [buildingFloors, setBuildingFloors] = useState<any[]>([]);
  const [menuPage, setMenuPage] = useState(1);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean; title: string; message: string; onConfirm: () => void;
  }>({ open: false, title: "", message: "", onConfirm: () => {} });

  const [data, setData] = useState<any>({
    professors: [], buildings: [], restaurants: [], majors: [],
    courses: [], announcements: [], ads: [], resources: [], sections: [], roadmap: []
  });
  const [maintenanceSettings, setMaintenanceSettings] = useState<any[]>([]);
  const [marketplaceSettings, setMarketplaceSettings] = useState<any>(null);
  const [marketplaceSellers, setMarketplaceSellers] = useState<any[]>([]);
  const [marketplaceProducts, setMarketplaceProducts] = useState<any[]>([]);
  const [marketplaceEmailQuery, setMarketplaceEmailQuery] = useState("");
  const [marketplaceEmailResults, setMarketplaceEmailResults] = useState<any[]>([]);
  const [selectedSellerUserId, setSelectedSellerUserId] = useState("");
  const [sellerStoreName, setSellerStoreName] = useState("");
  const [isSearchingMarketplaceUsers, setIsSearchingMarketplaceUsers] = useState(false);
  const [isMarketplaceLoading, setIsMarketplaceLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncingUniversity, setIsSyncingUniversity] = useState(false);
  const [academicYearRollovers, setAcademicYearRollovers] = useState<any[]>([]);
  const [academicYearDistribution, setAcademicYearDistribution] = useState<Record<string, number>>({});
  const [academicYearCycle, setAcademicYearCycle] = useState("");
  const [isRollingAcademicYear, setIsRollingAcademicYear] = useState(false);
  const [stats, setStats] = useState<Record<string, number>>({});

  const [aiQuery, setAiQuery] = useState("");
  const [aiResult, setAiResult] = useState<AIResponse | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState<{ status: string, models: string[] }>({ status: "checking", models: [] });

  const [dbAdminChecked, setDbAdminChecked] = useState(false);
  const [isUserAdminDB, setIsUserAdminDB] = useState(false);
  const [adminPermissions, setAdminPermissions] = useState<string[]>([]);
  const ALL_ADMIN_PERMISSIONS = ["professors", "buildings", "restaurants", "courses", "resources", "announcements", "chatbot_knowledge", "alert_access", "marketplace", "site_settings", "contact_messages", "rideshare", "roommate"];

  useEffect(() => {
    async function checkAdminDB() {
      if (!user) { setDbAdminChecked(true); setIsUserAdminDB(false); return; }
      const emailAdmin = isUserAdmin(user.email);
      if (emailAdmin) { setAdminPermissions(ALL_ADMIN_PERMISSIONS); setIsUserAdminDB(true); setDbAdminChecked(true); return; }
      try {
        const { data: profile, error } = await supabase
          .from("profiles").select("is_admin").eq("id", user.id).maybeSingle();
        if (!error && profile) {
          setIsUserAdminDB(!!profile.is_admin);
          if (profile.is_admin) { const { data: permissions } = await supabase.rpc("get_my_admin_permissions"); setAdminPermissions(Array.isArray(permissions) ? permissions : []); }
        } else setIsUserAdminDB(false);
      } catch { setIsUserAdminDB(false); }
      finally { setDbAdminChecked(true); }
    }
    checkAdminDB();
  }, [user]);

  useEffect(() => {
    if (activeTab && activeTab !== "settings" && activeTab !== "ai" && activeTab !== "marketplace" && activeTab !== "knowledge" && activeTab !== "chatbot-sources" && activeTab !== "site-settings" && activeTab !== "contact-messages") {
      fetchData(activeTab);
      if (["sections", "resources", "roadmap"].includes(activeTab) && data.courses.length === 0) fetchData("courses");
    }
    if (activeTab === "ai") checkOllama();
    if (activeTab === "settings") { fetchMaintenanceSettings(); fetchAcademicYearRolloverData(); }
    if (activeTab === "marketplace") fetchMarketplaceAdmin();
    setSearchQuery("");
  }, [activeTab]);

  // Fetch quick stats
  useEffect(() => {
    if (!isUserAdminDB) return;
    const tables = ["professors", "buildings", "courses", "resources", "announcements"];
    Promise.all(tables.map(t =>
      supabase.from(t).select("*", { count: "exact", head: true }).then(({ count }) => ({ t, count: count || 0 }))
    )).then(results => {
      const s: Record<string, number> = {};
      results.forEach(r => { s[r.t] = r.count; });
      setStats(s);
    });
  }, [isUserAdminDB]);

  useEffect(() => {
    const editId = searchParams.get("edit");
    if (editId && data[activeTab] && data[activeTab].length > 0) {
      const item = data[activeTab].find((i: any) => String(i.id) === String(editId));
      if (item) {
        openModal(activeTab, item);
        const newParams = new URLSearchParams(searchParams);
        newParams.delete("edit");
        navigate(`/admin?${newParams.toString()}`, { replace: true });
      }
    }
  }, [searchParams, data, activeTab, navigate]);

  async function checkOllama() {
    const status = await detectOllama();
    setOllamaStatus(status);
  }

  const handleAiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    setIsAiLoading(true); setAiResult(null);
    try {
      const result = await performRAG(aiQuery);
      setAiResult(result);
    } catch { setAiResult({ success: false, error: "Unexpected error occurred" }); }
    finally { setIsAiLoading(false); }
  };

  async function fetchData(tab: string) {
    setIsLoading(true);
    let tableName = tab;
    if (tab === "restaurants") tableName = "recreation_places";
    if (tab === "sections") tableName = "available_sections";

    const { data: result, error } = await supabase
      .from(tableName).select("*").order('created_at', { ascending: false });

    if (error) {
      const { data: retryResult } = await supabase.from(tableName).select("*");
      setData((prev: any) => ({ ...prev, [tab]: retryResult || [] }));
    } else {
      setData((prev: any) => ({ ...prev, [tab]: result || [] }));
    }
    setIsLoading(false);
  }

  async function fetchMaintenanceSettings() {
    setIsLoading(true);
    const { data: res, error } = await supabase.from('maintenance_mode').select('*');
    if (!error && res) setMaintenanceSettings(res);
    setIsLoading(false);
  }

  async function fetchAcademicYearRolloverData() {
    const [profilesRes, rolloversRes] = await Promise.all([
      supabase.from('profiles').select('academic_year').limit(500),
      supabase.from('academic_year_rollovers').select('cycle_key,changed_at,updated_rows,capped_rows,skipped_rows').order('changed_at', { ascending: false }).limit(8),
    ]);
    const distribution: Record<string, number> = {};
    (profilesRes.data || []).forEach((profile: any) => {
      const rawValue = profile.academic_year == null || String(profile.academic_year).trim() === '' ? '' : String(profile.academic_year).trim();
      const value = ['1', '2', '3', '4'].includes(rawValue) ? rawValue : 'غير محدد';
      distribution[value] = (distribution[value] || 0) + 1;
    });
    setAcademicYearDistribution(distribution);
    if (!rolloversRes.error) setAcademicYearRollovers(rolloversRes.data || []);
  }

  function requestAcademicYearRollover() {
    const cycle = academicYearCycle.trim();
    if (!/^\d{4}-\d{4}$/.test(cycle)) {
      toast.error(ar ? 'اكتب الدورة بصيغة 2026-2027' : 'Use the cycle format 2026-2027');
      return;
    }
    setConfirmDialog({
      open: true,
      title: ar ? 'تأكيد تدوير السنة الأكاديمية' : 'Confirm academic-year rollover',
      message: ar ? `سيتم رفع السنة للطلاب من 1 إلى 2، ومن 2 إلى 3، ومن 3 إلى 4 لدورة ${cycle}. السنة 4 ستبقى 4، وسيتم تجاهل القيم الفارغة. لا يمكن تشغيل الدورة نفسها مرتين.` : `Students will move from year 1 to 2, 2 to 3, and 3 to 4 for ${cycle}. Year 4 remains 4 and blank values are skipped. This cycle cannot run twice.`,
      onConfirm: async () => {
        setConfirmDialog((current) => ({ ...current, open: false }));
        setIsRollingAcademicYear(true);
        const { data: result, error } = await supabase.rpc('rollover_academic_year', { p_cycle_key: cycle });
        if (error) toast.error(ar ? 'فشل تدوير السنة الأكاديمية' : 'Academic-year rollover failed');
        else {
          const summary = Array.isArray(result) ? result[0] : result;
          toast.success(ar ? `تم التحديث: ${summary?.updated_rows || 0} طالب، وبقي ${summary?.capped_rows || 0} في السنة الرابعة` : `Updated ${summary?.updated_rows || 0} students; ${summary?.capped_rows || 0} remain in year 4`);
          setAcademicYearCycle('');
          fetchAcademicYearRolloverData();
        }
        setIsRollingAcademicYear(false);
      },
    });
  }

  async function fetchMarketplaceAdmin() {
    setIsMarketplaceLoading(true);
    const [settingsRes, sellersRes, productsRes] = await Promise.all([
      supabase.from('marketplace_settings').select('*').eq('id', 'global').maybeSingle(),
      supabase.from('marketplace_sellers').select('*').order('created_at', { ascending: false }).limit(200),
      supabase.from('marketplace_products').select('id,seller_id,title_ar,title_en,status,price,currency,is_featured,created_at').order('created_at', { ascending: false }).limit(300),
    ]);
    if (settingsRes.error || sellersRes.error || productsRes.error) {
      toast.error(ar ? 'تعذر تحميل بيانات السوق' : 'Unable to load marketplace data');
    }
    const sellers = sellersRes.data || [];
    setMarketplaceSettings(settingsRes.data || { id: 'global', is_enabled: false, message_ar: 'السوق مغلق مؤقتًا.', message_en: 'The marketplace is temporarily closed.' });
    setMarketplaceSellers(sellers);
    setMarketplaceProducts(productsRes.data || []);
    setIsMarketplaceLoading(false);
  }

  async function toggleMarketplace() {
    const nextEnabled = !Boolean(marketplaceSettings?.is_enabled);
    const { error } = await supabase.from('marketplace_settings').update({ is_enabled: nextEnabled, updated_by: user?.id }).eq('id', 'global');
    if (error) toast.error(ar ? 'فشل تغيير حالة السوق' : 'Failed to change marketplace status');
    else { setMarketplaceSettings((current: any) => ({ ...(current || {}), is_enabled: nextEnabled })); toast.success(nextEnabled ? (ar ? 'تم تشغيل السوق' : 'Marketplace is live') : (ar ? 'تم إيقاف السوق' : 'Marketplace is paused')); }
  }

  async function searchMarketplaceUsers() {
    const emailQuery = marketplaceEmailQuery.trim().toLowerCase();
    if (!emailQuery || !emailQuery.includes('@gmail.com')) {
      toast.error(ar ? 'اكتب Gmail صحيحًا للبحث' : 'Enter a valid Gmail address to search');
      return;
    }
    setIsSearchingMarketplaceUsers(true);
    const { data: results, error } = await supabase.rpc('marketplace_find_users_by_email', { search_email: emailQuery });
    if (error) toast.error(ar ? 'تعذر البحث عبر Gmail' : 'Unable to search Gmail accounts');
    setMarketplaceEmailResults(results || []);
    setSelectedSellerUserId('');
    setIsSearchingMarketplaceUsers(false);
  }

  async function grantSellerAccess() {
    if (!selectedSellerUserId || !sellerStoreName.trim()) {
      toast.error(ar ? 'اختر حسابًا وأدخل اسم المتجر' : 'Choose an account and enter a store name');
      return;
    }
    const { error } = await supabase.from('marketplace_sellers').insert({ user_id: selectedSellerUserId, store_name_ar: sellerStoreName.trim(), is_approved: true, is_active: true });
    if (error) toast.error(ar ? 'تعذر منح صلاحية التاجر. قد يكون الحساب مضافًا مسبقًا.' : 'Could not grant seller access. The account may already be a seller.');
    else { toast.success(ar ? 'تم منح صلاحية التاجر' : 'Seller access granted'); setSelectedSellerUserId(''); setSellerStoreName(''); fetchMarketplaceAdmin(); }
  }

  async function updateSellerAccess(id: string, patch: Record<string, any>) {
    const { error } = await supabase.from('marketplace_sellers').update(patch).eq('id', id);
    if (error) toast.error(ar ? 'فشل تحديث صلاحية التاجر' : 'Failed to update seller access');
    else { toast.success(ar ? 'تم تحديث صلاحية التاجر' : 'Seller access updated'); fetchMarketplaceAdmin(); }
  }

  async function moderateMarketplaceProduct(id: string, status: 'approved' | 'rejected' | 'archived') {
    const { error } = await supabase.from('marketplace_products').update({ status, is_featured: status === 'approved' }).eq('id', id);
    if (error) toast.error(ar ? 'فشل تحديث المنتج' : 'Failed to update product');
    else { toast.success(ar ? 'تم تحديث حالة المنتج' : 'Product status updated'); fetchMarketplaceAdmin(); }
  }

  async function toggleMaintenance(pageId: string, currentStatus: boolean) {
    const { error } = await supabase.from('maintenance_mode').upsert({
      page_id: pageId, is_active: !currentStatus, updated_at: new Date().toISOString()
    });
    if (error) toast.error(ar ? "فشل تحديث حالة الصيانة" : "Failed to update maintenance status");
    else { toast.success(ar ? "تم تحديث الحالة" : "Status updated"); fetchMaintenanceSettings(); }
  }

  const openModal = (type: string, item?: any) => {
    setModalType(type);
    setEditingItem(item || null);
    if (item) {
      setUploadedUrls({ image_url: item.image_url || "", study_plan_url: item.study_plan_url || "", banner_url: item.image_url || item.banner_url || "" });
      let floorsData = item.floors || [];
      if (floorsData && !Array.isArray(floorsData) && typeof floorsData === "object") floorsData = [floorsData];
      setBuildingFloors(floorsData);
      setMenuItems(item.menu || []);
      setSelectedTargetMajors(parseTargetMajors(item.target_major));
    } else {
      setUploadedUrls({}); setBuildingFloors([]); setMenuItems([]); setSelectedTargetMajors([]);
    }
    setIsModalOpen(true); setMenuPage(1);
  };

  const closeModal = () => {
    setIsModalOpen(false); setEditingItem(null);
    setUploadedUrls({}); setBuildingFloors([]); setMenuItems([]); setSelectedTargetMajors([]);
  };

  const handleUniversitySync = async () => {
    if (isSyncingUniversity) return;
    setIsSyncingUniversity(true);
    try {
      const { data: result, error } = await supabase.functions.invoke("sync-university-courses", { body: {} });
      if (error) throw error;
      if (!result?.ok) throw new Error(result?.error || "Sync failed");
      toast.success(ar ? `تم تحديث جريدة المواد: ${result.rows_seen ?? 0} شعبة` : `Course newspaper updated: ${result.rows_seen ?? 0} sections`);
    } catch (error: any) {
      toast.error(ar ? `تعذر تحديث جريدة المواد: ${error?.message || "خطأ غير معروف"}` : `Course newspaper update failed: ${error?.message || "Unknown error"}`);
    } finally {
      setIsSyncingUniversity(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const formValues = Object.fromEntries(formData.entries());
    setIsLoading(true);
    const tableName = modalType === "restaurants" ? "recreation_places" : modalType as string;

    const payload: any = {};
    Object.entries(formValues).forEach(([key, value]) => {
      payload[key] = typeof value === "string" ? sanitize(value) : value;
    });

    if (uploadedUrls.image_url) payload.image_url = uploadedUrls.image_url;
    if (uploadedUrls.study_plan_url) payload.study_plan_url = uploadedUrls.study_plan_url;
    if (uploadedUrls.banner_url) payload.banner_url = uploadedUrls.banner_url;

    if (modalType === "professors") {
      payload.building_id = payload.building_id ? parseInt(payload.building_id) : null;
    }

    if (modalType === "buildings") {
      payload.is_featured = formData.get("is_featured") === "on";
      payload.floors = buildingFloors;
      if (payload.id) payload.id = parseInt(payload.id);
      if (typeof payload.tags === "string") {
        payload.tags = payload.tags.split(",").map((t: string) => t.trim()).filter(Boolean);
      }
      payload.tag_ar = payload.tag_ar || payload.tagAr;
      payload.tag_en = payload.tag_en || payload.tagEn;
    }

    if (modalType === "restaurants") {
      payload.price_level = parseInt(payload.price_level || "1");
      payload.menu = menuItems;
    }

    if (modalType === "courses") {
      payload.credit_hours = parseInt(payload.credit_hours || "3");
      payload.name_en = payload.name_en || payload.name;
      payload.name_ar = payload.name_ar || payload.nameAr;
      delete payload.name; delete payload.nameAr;
      if (typeof payload.instructors === "string") {
        payload.instructors = payload.instructors.split(",").map((i: string) => i.trim()).filter(Boolean);
      }
    }

    if (modalType === "announcements") {
      payload.is_global = payload.is_global === "true" || formData.get("is_global") === "on";
      // announcements uses image_url; banner_url is a legacy UI field and must never be sent to Supabase.
      if (uploadedUrls.banner_url) payload.image_url = uploadedUrls.banner_url;
      delete payload.banner_url;
      // Keep the existing text column and store multiple IDs as a comma-separated list.
      payload.target_major = payload.is_global ? null : (selectedTargetMajors.join(",") || null);
      if (typeof payload.tags === "string") {
        payload.tags = payload.tags.split(",").map((t: string) => t.trim()).filter(Boolean);
      }
      payload.title = payload.title_en || payload.title;
      payload.title_ar = payload.title_ar || payload.titleAr;
      const keysToRemove = ['title_en', 'titleAr', 'imageUrl', 'short_description_en', 'full_description_en'];
      keysToRemove.forEach(k => delete payload[k]);
    }

    if (modalType === "resources") {
      if (uploadedUrls.study_plan_url) payload.url = uploadedUrls.study_plan_url;
      if (!payload.uploader || !payload.uploader.trim()) payload.uploader = "المشرف";
    }

    try {
      if (editingItem) {
        // ✅ FIXED: Use .select() and check returned rows (not count which is always null without head:true)
        const { data: updatedRows, error } = await supabase
          .from(tableName)
          .update(payload)
          .eq("id", editingItem.id)
          .select("id");

        if (error) throw new Error(error.message);

        // If no rows were returned, RLS silently blocked the update
        if (!updatedRows || updatedRows.length === 0) {
          const { data: sessionData } = await supabase.auth.getSession();
          if (!sessionData?.session) {
            throw new Error(ar
              ? "انتهت جلستك. سجّل الدخول مرة أخرى."
              : "Your session has expired. Please log in again."
            );
          }
          throw new Error(ar
            ? "🔒 تم حظر التعديل بواسطة RLS. شغّل الـ SQL Script أولاً من زر (إعداد قاعدة البيانات) في التبويب أعلاه."
            : "🔒 Update blocked by RLS. Please run the SQL Setup Script from the Database Setup button above."
          );
        }
      } else {
        const { error } = await supabase.from(tableName).insert([payload]);
        if (error) throw new Error(error.message);
      }

      toast.success(ar ? "تم الحفظ بنجاح! ✅" : "Saved successfully! ✅");
      fetchData(modalType as string);
      // Update stats
      setStats(prev => ({
        ...prev,
        [modalType as string]: editingItem ? prev[modalType as string] : (prev[modalType as string] || 0) + 1
      }));
      closeModal();
    } catch (err: any) {
      console.error("Save error:", err);
      toast.error(err.message || (ar ? "خطأ غير معروف" : "Unknown error"), { duration: 8000 });
    }

    setIsLoading(false);
  };

  const handleDeleteRequest = (tab: string, id: string, name?: string) => {
    setConfirmDialog({
      open: true,
      title: ar ? "تأكيد الحذف" : "Confirm Delete",
      message: ar
        ? `هل أنت متأكد من حذف "${name || id}"؟ لا يمكن التراجع عن هذه العملية.`
        : `Are you sure you want to delete "${name || id}"? This cannot be undone.`,
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, open: false }));
        setIsLoading(true);
        const tableName = tab === "restaurants" ? "recreation_places" : tab;
        const { error } = await supabase.from(tableName).delete().eq("id", id);
        if (error) toast.error(ar ? "خطأ في الحذف" : "Error deleting");
        else {
          toast.success(ar ? "تم الحذف بنجاح" : "Deleted successfully");
          fetchData(tab);
          setStats(prev => ({ ...prev, [tab]: Math.max(0, (prev[tab] || 0) - 1) }));
        }
        setIsLoading(false);
      }
    });
  };

  // Filtered data for current tab
  const filteredData = useMemo(() => {
    const items = data[activeTab] || [];
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter((item: any) => {
      const fields = Object.values(item).filter(v => typeof v === "string");
      return fields.some((f: any) => f.toLowerCase().includes(q));
    });
  }, [data, activeTab, searchQuery]);

  const tabs = [
    { id: "professors", icon: Users, label: ar ? "الدكاترة" : "Professors", statKey: "professors" },
    { id: "buildings", icon: Building2, label: ar ? "المباني" : "Buildings", statKey: "buildings" },
    { id: "restaurants", icon: Utensils, label: ar ? "المطاعم والاستراحات" : "Restaurants", statKey: null },
    { id: "courses", icon: BookOpen, label: ar ? "المواد الدراسية" : "Courses", statKey: "courses" },
    { id: "resources", icon: FileText, label: ar ? "الملفات والمصادر" : "Files & Resources", statKey: "resources" },
    { id: "announcements", icon: Megaphone, label: ar ? "الإعلانات" : "Announcements", statKey: "announcements" },
    { id: "chatbot-sources", icon: FileText, label: ar ? "مصادر الشات بوت القديم" : "Legacy Chatbot Sources", statKey: null },
    { id: "knowledge", icon: Sparkles, label: ar ? "مصادر مُرشد الذكي" : "Murshid Knowledge", statKey: null },
    { id: "knowledge-settings", icon: Sparkles, label: ar ? "تحكم مُرشد الذكي" : "Murshid AI Access", statKey: null },
    { id: "exam-settings", icon: Calendar, label: ar ? "تحكم جدول الامتحانات" : "Exam Planner Access", statKey: null },
    { id: "study-settings", icon: Calendar, label: ar ? "تحكم الجدول الدراسي" : "Study Planner Access", statKey: null },
    { id: "alert-access", icon: BellRing, label: ar ? "اشتراكات التنبيهات" : "Alert Subscriptions", statKey: null },
    { id: "admins", icon: UserCheck, label: ar ? "حسابات المشرفين" : "Admin Accounts", statKey: null },
    { id: "site-settings", icon: SettingsIcon, label: ar ? "محتوى وروابط الموقع" : "Site Content & Links", statKey: null },
    { id: "contact-messages", icon: Mail, label: ar ? "رسائل تواصل معنا" : "Contact Messages", statKey: null },
    { id: "marketplace", icon: Store, label: ar ? "سوق التجار" : "Marketplace Sellers", statKey: null },
    { id: "rideshare", icon: Car, label: ar ? "مرشد توصيل" : "Murshid Carpool", statKey: null },
    { id: "roommate", icon: Home, label: ar ? "مرشد سكني" : "Murshid Housing", statKey: null },
    { id: "settings", icon: SettingsIcon, label: ar ? "إعدادات النظام" : "Global Settings", statKey: null },
  ].filter(t => {
    if (t.id === "admins") return user?.email?.toLowerCase() === "mocvskhfssr@gmail.com";
    const required = ["chatbot-sources", "knowledge"].includes(t.id) ? "chatbot_knowledge" : ["knowledge-settings", "exam-settings", "study-settings"].includes(t.id) ? "site_settings" : t.id === "alert-access" ? "alert_access" : t.id === "site-settings" || t.id === "settings" ? "site_settings" : t.id === "contact-messages" ? "contact_messages" : t.id === "rideshare" ? "rideshare" : t.id === "roommate" ? "roommate" : t.id;
    return adminPermissions.includes(required);
  });

  const tabGroups = [
    { label: ar ? "المحتوى الأكاديمي" : "Academic content", ids: ["courses", "resources", "professors", "buildings", "restaurants"] },
    { label: ar ? "التواصل والمساعد الذكي" : "Communication & AI", ids: ["announcements", "chatbot-sources", "knowledge", "knowledge-settings", "exam-settings", "study-settings", "contact-messages"] },
    { label: ar ? "المستخدمون والخدمات" : "Users & services", ids: ["alert-access", "marketplace", "rideshare", "roommate", "admins"] },
    { label: ar ? "الإعدادات" : "Settings", ids: ["site-settings", "settings"] },
  ].map(group => ({ ...group, items: group.ids.map(id => tabs.find(tab => tab.id === id)).filter(Boolean) as typeof tabs })).filter(group => group.items.length);

  if (!dbAdminChecked) return <BrandedLoader />;

  if (!isUserAdminDB) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="w-20 h-20 text-destructive mb-6" />
        <h2 className="text-3xl font-black text-foreground mb-3">{ar ? "وصول غير مصرح" : "Unauthorized Access"}</h2>
        <p className="text-lg text-muted-foreground font-bold max-w-md mx-auto">{ar ? "هذه الصفحة مخصصة لمديري النظام فقط." : "This page is strictly for system administrators."}</p>
      </div>
    );
  }

  return (
    <motion.div dir={dir} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-[1440px] mx-auto px-4 md:px-8 pt-28 pb-36 md:pb-20">
      <PageHeader
        title={ar ? "التحكم الشامل (CMS)" : "Master Admin CMS"}
        subtitle={ar ? "إدارة كاملة لكل تفاصيل التطبيق." : "Complete management of the app content."}
        icon={<ShieldAlert className="w-8 h-8 md:w-12 md:h-12 text-primary" />}
        actions={
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <button onClick={handleUniversitySync} disabled={isSyncingUniversity}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/30 text-primary font-black text-sm hover:bg-primary/20 transition-all disabled:opacity-50">
              <RefreshCw className={cn("w-4 h-4", isSyncingUniversity && "animate-spin")} />
              {isSyncingUniversity ? (ar ? "جاري تحديث الجريدة..." : "Updating newspaper...") : (ar ? "تحديث جريدة المواد" : "Update Course Newspaper")}
            </button>
            <button onClick={() => setShowSqlModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-black text-sm hover:bg-amber-500/20 transition-all">
              <Database className="w-4 h-4" />
              {ar ? "إعداد قاعدة البيانات" : "DB Setup SQL"}
            </button>
            <button onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-border/50 text-foreground font-bold text-sm hover:bg-white/5 transition-all">
              <LayoutDashboard className="w-4 h-4" />
              {ar ? "العودة للرئيسية" : "Back to Hub"}
            </button>
          </div>
        }
      />

      {/* Stats Cards */}
      {Object.keys(stats).length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { key: "professors", label: ar ? "دكتور" : "Professors", icon: Users, color: "text-blue-400 bg-blue-500/10" },
            { key: "buildings", label: ar ? "مبنى" : "Buildings", icon: Building2, color: "text-emerald-400 bg-emerald-500/10" },
            { key: "courses", label: ar ? "مادة" : "Courses", icon: BookOpen, color: "text-purple-400 bg-purple-500/10" },
            { key: "resources", label: ar ? "ملف" : "Files", icon: FileText, color: "text-orange-400 bg-orange-500/10" },
            { key: "announcements", label: ar ? "إعلان" : "Announcements", icon: Megaphone, color: "text-pink-400 bg-pink-500/10" },
          ].map(({ key, label, icon: Icon, color }) => (
            <motion.div key={key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-surface border border-border/50 flex items-center gap-3 cursor-pointer hover:border-primary/30 transition-all"
              onClick={() => setActiveTab(key)}>
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", color)}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-black">{stats[key] ?? "—"}</p>
                <p className="text-xs text-muted-foreground font-bold">{label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mb-6 rounded-3xl border border-primary/15 bg-gradient-to-r from-primary/10 via-card to-accent/10 p-5 md:p-7 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-1 text-xs font-black uppercase tracking-[0.18em] text-primary">{ar ? "دليل المشرف السريع" : "Quick admin guide"}</p>
            <h2 className="text-xl md:text-2xl font-black">{ar ? "تحكم بالموقع من ثلاث خطوات واضحة" : "Control the portal in three clear steps"}</h2>
            <p className="mt-2 max-w-3xl text-sm font-bold leading-6 text-muted-foreground">{ar ? "اختر القسم من القائمة، عدّل البيانات، ثم احفظ. استخدم إعدادات الموقع لإظهار الخصائص أو إخفائها وتحديد الحسابات المسموحة." : "Choose a section, edit its data, then save. Use Site Settings to show or hide features and control allowed accounts."}</p>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[440px]">
            {[{ n: "1", t: ar ? "اختر القسم" : "Choose a section", d: ar ? "مواد، إعلانات، تجار أو إعدادات" : "Courses, ads, market or settings" }, { n: "2", t: ar ? "عدّل واحفظ" : "Edit and save", d: ar ? "راجع الحقول قبل اعتماد التغيير" : "Review fields before saving" }, { n: "3", t: ar ? "اختبر النتيجة" : "Test the result", d: ar ? "افتح الموقع كطالب وتحقق" : "Open the portal as a student" }].map((step) => <div key={step.n} className="rounded-2xl border border-border/50 bg-background/50 p-3"><span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-black text-primary-foreground">{step.n}</span><p className="mt-2 text-xs font-black">{step.t}</p><p className="mt-1 text-[10px] font-bold leading-4 text-muted-foreground">{step.d}</p></div>)}
          </div>
        </div>
      </div>

      <div className="bg-surface/50 border border-border/50 rounded-3xl p-4 md:p-8 backdrop-blur-xl shadow-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col md:flex-row gap-6">
          <div className="md:w-64 shrink-0">
            <TabsList className="bg-transparent border-none flex md:flex-col gap-2 h-auto w-max md:w-full overflow-x-auto no-scrollbar">
              {tabGroups.map(group => (
                <React.Fragment key={group.label}>
                  <p className="px-3 pt-3 pb-1 text-[10px] font-black uppercase tracking-wider text-muted-foreground/70">{group.label}</p>
                  {group.items.map(t => (
                    <TabsTrigger key={t.id} value={t.id}
                      className="rounded-xl px-4 py-3 font-black data-[state=active]:bg-primary data-[state=active]:text-white transition-all text-sm justify-start w-full whitespace-nowrap md:whitespace-normal text-start">
                      <t.icon className="w-4 h-4 ltr:mr-3 rtl:ml-3 shrink-0 inline-block" />
                      <span className="truncate">{t.label}</span>
                      {t.statKey && stats[t.statKey] !== undefined && <span className="mr-auto ltr:ml-auto ltr:mr-0 text-[10px] bg-white/10 px-2 py-0.5 rounded-full">{stats[t.statKey]}</span>}
                    </TabsTrigger>
                  ))}
                </React.Fragment>
              ))}
            </TabsList>
          </div>

          <div className="flex-1 min-w-0 bg-card rounded-3xl border border-border/50 p-6 shadow-sm overflow-hidden">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
              <h3 className="text-2xl font-black">{tabs.find(t => t.id === activeTab)?.label}</h3>
              <div className="flex items-center gap-3">
                {activeTab !== "settings" && activeTab !== "ai" && activeTab !== "marketplace" && activeTab !== "knowledge" && activeTab !== "chatbot-sources" && activeTab !== "site-settings" && activeTab !== "contact-messages" && (
                  <>
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder={ar ? "بحث..." : "Search..."}
                        className="w-44 pr-9 pl-4 py-2.5 rounded-xl bg-surface border border-border/50 focus:border-primary outline-none transition-all font-bold text-sm"
                      />
                    </div>
                    <button onClick={() => { setSearchQuery(""); fetchData(activeTab); }}
                      className="p-2.5 rounded-xl bg-surface border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all" title="Refresh">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button onClick={() => openModal(activeTab)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
                      <Plus className="w-5 h-5" />{ar ? "إضافة جديد" : "Add New"}
                    </button>
                  </>
                )}
              </div>
            </div>

            <TabsContent value="professors" className="mt-0 animate-in fade-in duration-300">
              <TableLayout
                headers={[ar ? "الاسم" : "Name", ar ? "القسم" : "Dept", ar ? "المبنى" : "Building"]}
                items={(filteredData || []).map((p: any) => ({
                  id: p.id,
                  col1: ar ? (p.name_ar || p.nameAr || "—") : (p.name_en || p.name || "—"),
                  col2: p.department || "—", col3: p.office_number || "—", raw: p
                }))}
                onEdit={(item: any) => openModal("professors", item.raw)}
                onDelete={(item: any) => handleDeleteRequest("professors", item.id, ar ? item.raw?.name_ar : item.raw?.name_en)}
                ar={ar} isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="buildings" className="mt-0 animate-in fade-in duration-300">
              <TableLayout
                headers={[ar ? "المبنى" : "Building", ar ? "الصورة" : "Image", ar ? "الحالة" : "Status"]}
                items={(filteredData || []).map((b: any) => ({
                  id: b.id,
                  col1: ar ? (b.name_ar || "—") : (b.name_en || "—"),
                  col2: b.image_url ? (ar ? "موجودة ✓" : "Available ✓") : (ar ? "لا يوجد" : "None"),
                  col3: b.is_featured ? (ar ? "⭐ مميز" : "⭐ Featured") : (ar ? "عادي" : "Normal"), raw: b
                }))}
                onEdit={(item: any) => openModal("buildings", item.raw)}
                onDelete={(item: any) => handleDeleteRequest("buildings", item.id, ar ? item.raw?.name_ar : item.raw?.name_en)}
                ar={ar} isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="restaurants" className="mt-0 animate-in fade-in duration-300">
              <TableLayout
                headers={[ar ? "الاسم" : "Name", ar ? "المسافة" : "Distance", ar ? "السعر" : "Price"]}
                items={(filteredData || []).map((r: any) => ({
                  id: r.id,
                  col1: ar ? (r.name_ar || "—") : (r.name_en || "—"),
                  col2: ar ? (r.distance_ar || "—") : (r.distance_en || "—"),
                  col3: "$".repeat(r.price_level || 1), raw: r
                }))}
                onEdit={(item: any) => openModal("restaurants", item.raw)}
                onDelete={(item: any) => handleDeleteRequest("restaurants", item.id, ar ? item.raw?.name_ar : item.raw?.name_en)}
                ar={ar} isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="courses" className="mt-0 animate-in fade-in duration-300">
              <TableLayout
                headers={[ar ? "المادة" : "Course", ar ? "الرمز" : "Code", ar ? "الساعات" : "Hrs"]}
                items={(filteredData || []).map((c: any) => ({
                  id: c.id, col1: ar ? c.name_ar : c.name_en, col2: c.code, col3: c.credit_hours, raw: c
                }))}
                onEdit={(item: any) => openModal("courses", item.raw)}
                onDelete={(item: any) => handleDeleteRequest("courses", item.id, ar ? item.raw?.name_ar : item.raw?.name_en)}
                ar={ar} isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="resources" className="mt-0 animate-in fade-in duration-300">
              <TableLayout
                headers={[ar ? "العنوان" : "Title", ar ? "المادة" : "Course ID", ar ? "النوع" : "Type"]}
                items={(filteredData || []).map((r: any) => ({
                  id: r.id, col1: r.title, col2: r.course_id, col3: r.type, raw: r
                }))}
                onEdit={(item: any) => openModal("resources", item.raw)}
                onDelete={(item: any) => handleDeleteRequest("resources", item.id, item.raw?.title)}
                ar={ar} isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="announcements" className="mt-0 animate-in fade-in duration-300">
              <TableLayout
                headers={[ar ? "العنوان" : "Title", ar ? "الحالة" : "Status", ar ? "التاريخ" : "Date"]}
                items={(filteredData || []).map((a: any) => ({
                  id: a.id, col1: ar ? a.title_ar : a.title,
                  col2: a.is_global ? "🌐 Global" : "Specific",
                  col3: a.created_at?.split('T')[0] || "—", raw: a
                }))}
                onEdit={(item: any) => openModal("announcements", item.raw)}
                onDelete={(item: any) => handleDeleteRequest("announcements", item.id, ar ? item.raw?.title_ar : item.raw?.title)}
                ar={ar} isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="chatbot-sources" className="mt-0 animate-in fade-in duration-300">
              <ChatbotKnowledgeManager ar={ar} />
            </TabsContent>
            <TabsContent value="knowledge" className="mt-0 animate-in fade-in duration-300">
              <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-6">
                <h4 className="text-lg font-black">{ar ? "مصادر مُرشد الذكي" : "Murshid AI sources"}</h4>
                <p className="mt-2 text-sm font-bold leading-6 text-muted-foreground">{ar ? "تتم إدارة مصادر مُرشد الذكي من خلال الاستيراد والمعالجة المخصصة. لا يمكن إضافة هذه المصادر من قسم الشات بوت القديم." : "Murshid AI sources are managed through its dedicated ingestion flow. They cannot be added from the legacy chatbot section."}</p>
              </div>
            </TabsContent>
            <TabsContent value="knowledge-settings" className="mt-0 animate-in fade-in duration-300"><FeatureAccessManager feature="knowledge" /></TabsContent>
            <TabsContent value="exam-settings" className="mt-0 animate-in fade-in duration-300"><FeatureAccessManager feature="exam" /></TabsContent>
            <TabsContent value="study-settings" className="mt-0 animate-in fade-in duration-300"><FeatureAccessManager feature="study" /></TabsContent>

            <TabsContent value="alert-access" className="mt-0 animate-in fade-in duration-300">
              <CourseAlertsManager ar={ar} />
            </TabsContent>

            <TabsContent value="admins" className="mt-0 animate-in fade-in duration-300">
              <AdminAccountsManager currentEmail={user?.email} />
            </TabsContent>

            <TabsContent value="site-settings" className="mt-0 animate-in fade-in duration-300">
              <SiteSettingsManager />
            </TabsContent>

            <TabsContent value="contact-messages" className="mt-0 animate-in fade-in duration-300">
              <ContactMessagesManager />
            </TabsContent>

            <TabsContent value="rideshare" className="mt-0 animate-in fade-in duration-300">
              <RideShareManager />
            </TabsContent>

            <TabsContent value="roommate" className="mt-0 animate-in fade-in duration-300">
              <RoommateMatchManager />
            </TabsContent>

            <TabsContent value="marketplace" className="mt-0 animate-in fade-in duration-300">
              <div className="space-y-6">
                <div className={cn("rounded-3xl border p-6 flex flex-col md:flex-row md:items-center justify-between gap-5", marketplaceSettings?.is_enabled ? "border-emerald-400/25 bg-emerald-400/5" : "border-amber-400/25 bg-amber-400/5")}>
                  <div className="flex items-center gap-4">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", marketplaceSettings?.is_enabled ? "bg-emerald-400/15 text-emerald-300" : "bg-amber-400/15 text-amber-300")}>
                      {marketplaceSettings?.is_enabled ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                    </div>
                    <div>
                      <p className="text-xs font-black tracking-[0.2em] uppercase text-muted-foreground">MURSHID MARKETPLACE</p>
                      <h4 className="mt-1 text-xl font-black">{marketplaceSettings?.is_enabled ? (ar ? "السوق يعمل الآن" : "Marketplace is live") : (ar ? "السوق متوقف" : "Marketplace is paused")}</h4>
                      <p className="mt-1 text-sm font-bold text-muted-foreground">{ar ? "هذا المفتاح يتحكم بظهور المنتجات للطلاب." : "This switch controls whether approved listings are visible to students."}</p>
                    </div>
                  </div>
                  <button onClick={toggleMarketplace} disabled={isMarketplaceLoading} className={cn("inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-black text-sm text-white transition-all disabled:opacity-50", marketplaceSettings?.is_enabled ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600")}>
                    {marketplaceSettings?.is_enabled ? <ToggleLeft className="w-5 h-5" /> : <ToggleRight className="w-5 h-5" />}
                    {marketplaceSettings?.is_enabled ? (ar ? "إيقاف السوق" : "Pause marketplace") : (ar ? "تشغيل السوق" : "Enable marketplace")}
                  </button>
                </div>

                <div className="rounded-3xl border border-cyan-300/20 bg-[#10213a] p-6 shadow-lg shadow-cyan-950/10">
                  <div className="flex items-center gap-3 mb-5"><UserPlus className="w-5 h-5 text-cyan-300" /><div><h4 className="font-black text-lg">{ar ? "منح صلاحية تاجر" : "Grant seller access"}</h4><p className="text-xs text-muted-foreground font-bold">{ar ? "اختر حسابًا مسجلًا وأنشئ له مساحة متجر." : "Choose a registered account and create a seller storefront."}</p></div></div>
                  <div className="grid md:grid-cols-[1fr_1fr_auto] gap-3 items-end">
                    <div className="md:col-span-2"><label className="mb-2 block text-xs font-black text-foreground">{ar ? "Gmail الخاص بالتاجر" : "Seller Gmail"}</label><div className="flex gap-2"><input type="email" autoComplete="off" value={marketplaceEmailQuery} onChange={(e) => { setMarketplaceEmailQuery(e.target.value); setMarketplaceEmailResults([]); setSelectedSellerUserId(''); }} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); searchMarketplaceUsers(); } }} placeholder="student@gmail.com" className="min-w-0 flex-1 rounded-2xl bg-[#0f2034] text-foreground placeholder:text-muted-foreground border border-cyan-300/20 px-4 py-3 text-sm font-bold outline-none focus:border-cyan-300/70" /><button type="button" onClick={searchMarketplaceUsers} disabled={isSearchingMarketplaceUsers} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm font-black text-cyan-200 hover:bg-cyan-300/20 disabled:opacity-50"><Search className="w-4 h-4" />{ar ? "بحث Gmail" : "Search Gmail"}</button></div>{marketplaceEmailResults.length > 0 && <div className="mt-3 space-y-2 rounded-2xl border border-cyan-300/20 bg-[#0c192b] p-2">{marketplaceEmailResults.map((result: any) => <button type="button" key={result.user_id} onClick={() => !result.is_seller && setSelectedSellerUserId(result.user_id)} disabled={result.is_seller} className={cn("w-full flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-start text-sm font-black transition-colors", selectedSellerUserId === result.user_id ? "bg-cyan-300 text-slate-950" : result.is_seller ? "bg-white/5 text-slate-500 cursor-not-allowed" : "bg-white/5 text-foreground hover:bg-cyan-300/10 hover:text-cyan-200")}><span className="truncate">{result.email}</span><span className="shrink-0 text-[10px]">{result.is_seller ? (ar ? "مضاف مسبقًا" : "Already added") : selectedSellerUserId === result.user_id ? (ar ? "محدد" : "Selected") : (ar ? "اختيار" : "Select")}</span></button>)}</div>}</div>
                    <div><label className="mb-2 block text-xs font-black text-foreground">{ar ? "اسم المتجر" : "Store name"}</label><input value={sellerStoreName} onChange={(e) => setSellerStoreName(e.target.value)} placeholder={ar ? "مثال: متجر هندسة الحاسوب" : "Example: Computer Engineering Store"} className="w-full rounded-2xl bg-[#0f2034] text-foreground placeholder:text-muted-foreground border border-cyan-300/20 px-4 py-3 text-sm font-bold outline-none focus:border-cyan-300/70" /></div>
                    <button type="button" onClick={grantSellerAccess} disabled={isMarketplaceLoading || !selectedSellerUserId} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 hover:bg-white transition-colors disabled:opacity-50"><UserCheck className="w-4 h-4" />{ar ? "منح الصلاحية" : "Grant access"}</button>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-[#0f1e33] p-6">
                  <div className="flex items-center justify-between gap-3 mb-5"><div><h4 className="font-black text-lg text-foreground">{ar ? "التجار المعتمدون" : "Approved sellers"}</h4><p className="text-xs text-muted-foreground font-bold">{ar ? "يمكنك تعليق المتجر أو إعادة تفعيله في أي وقت." : "Suspend or reactivate any seller at any time."}</p></div><span className="rounded-xl bg-primary/10 px-3 py-2 text-xs font-black text-primary">{marketplaceSellers.length}</span></div>
                  {isMarketplaceLoading ? <div className="py-10 text-center text-muted-foreground font-black">{ar ? "جاري التحميل..." : "Loading..."}</div> : marketplaceSellers.length === 0 ? <div className="py-10 text-center text-muted-foreground font-bold">{ar ? "لم تتم إضافة تجار بعد." : "No sellers have been added yet."}</div> : <div className="space-y-3">{marketplaceSellers.map((seller: any) => <div key={seller.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-border/50 bg-card p-4"><div className="flex items-center gap-3 min-w-0"><div className="w-11 h-11 rounded-xl bg-cyan-400/10 flex items-center justify-center text-cyan-300"><Store className="w-5 h-5" /></div><div className="min-w-0"><h5 className="font-black truncate">{seller.store_name_ar}</h5><p className="text-xs text-muted-foreground font-bold truncate">{seller.store_name_en || seller.user_id}</p></div></div><div className="flex items-center gap-2"><span className={cn("rounded-xl px-3 py-1.5 text-[11px] font-black", seller.is_approved && seller.is_active ? "bg-emerald-400/10 text-emerald-300" : "bg-amber-400/10 text-amber-300")}>{seller.is_approved && seller.is_active ? (ar ? "نشط" : "Active") : seller.is_approved ? (ar ? "متوقف" : "Suspended") : (ar ? "بانتظار الاعتماد" : "Pending")}</span>{seller.is_approved && <button onClick={() => updateSellerAccess(seller.id, { is_active: !seller.is_active })} className={cn("rounded-xl px-3 py-2 text-xs font-black text-white", seller.is_active ? "bg-red-500/80 hover:bg-red-500" : "bg-emerald-500/80 hover:bg-emerald-500")}>{seller.is_active ? (ar ? "إيقاف" : "Suspend") : (ar ? "تفعيل" : "Activate")}</button>}{!seller.is_approved && <button onClick={() => updateSellerAccess(seller.id, { is_approved: true, is_active: true })} className="rounded-xl bg-emerald-500/80 px-3 py-2 text-xs font-black text-white hover:bg-emerald-500">{ar ? "اعتماد" : "Approve"}</button>}</div></div>)}</div>}
                </div>

                <div className="rounded-3xl border border-white/10 bg-[#0f1e33] p-6">
                  <div className="flex items-center justify-between gap-3 mb-5"><div><h4 className="font-black text-lg text-foreground">{ar ? "مراجعة المنتجات" : "Product moderation"}</h4><p className="text-xs text-muted-foreground font-bold">{ar ? "اعتمد المنتجات قبل ظهورها في السوق العام." : "Approve listings before they appear in the public marketplace."}</p></div><span className="rounded-xl bg-primary/10 px-3 py-2 text-xs font-black text-primary">{marketplaceProducts.length}</span></div>
                  {marketplaceProducts.length === 0 ? <div className="py-10 text-center text-muted-foreground font-bold">{ar ? "لا توجد منتجات حتى الآن." : "No products yet."}</div> : <div className="space-y-3">{marketplaceProducts.map((product: any) => { const seller = marketplaceSellers.find((item: any) => item.id === product.seller_id); return <div key={product.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-border/50 bg-card p-4"><div className="min-w-0"><h5 className="font-black truncate">{ar ? product.title_ar : product.title_en || product.title_ar}</h5><p className="mt-1 text-xs text-muted-foreground font-bold">{seller?.store_name_ar || (ar ? "تاجر غير معروف" : "Unknown seller")} · {product.price != null ? `${Number(product.price).toFixed(2)} ${product.currency || "JOD"}` : (ar ? "بدون سعر" : "No price")}</p></div><div className="flex items-center gap-2"><span className={cn("rounded-xl px-3 py-1.5 text-[11px] font-black", product.status === "approved" ? "bg-emerald-400/10 text-emerald-300" : product.status === "rejected" ? "bg-red-400/10 text-red-300" : "bg-amber-400/10 text-amber-300")}>{product.status === "approved" ? (ar ? "منشور" : "Published") : product.status === "rejected" ? (ar ? "مرفوض" : "Rejected") : product.status === "archived" ? (ar ? "مؤرشف" : "Archived") : (ar ? "قيد المراجعة" : "Pending")}</span>{product.status === "pending" && <><button onClick={() => moderateMarketplaceProduct(product.id, "approved")} className="rounded-xl bg-emerald-500/80 px-3 py-2 text-xs font-black text-white hover:bg-emerald-500"><PackageCheck className="inline w-4 h-4" /> {ar ? "اعتماد" : "Approve"}</button><button onClick={() => moderateMarketplaceProduct(product.id, "rejected")} className="rounded-xl bg-red-500/80 px-3 py-2 text-xs font-black text-white hover:bg-red-500"><Ban className="inline w-4 h-4" /> {ar ? "رفض" : "Reject"}</button></>}</div></div>; })}</div>}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="mt-0 animate-in fade-in duration-300">
              <div className="space-y-8">
                {/* Academic Year Rollover */}
                <div className="rounded-3xl border border-blue-400/20 bg-[#10213a] p-6 shadow-lg shadow-blue-950/10">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 shrink-0 rounded-2xl bg-blue-400/15 flex items-center justify-center"><Calendar className="w-6 h-6 text-blue-300" /></div>
                      <div>
                        <p className="text-xs font-black tracking-[0.2em] uppercase text-blue-300">ACADEMIC YEAR CONTROL</p>
                        <h4 className="mt-1 text-xl font-black text-foreground">{ar ? "تحديث السنة الأكاديمية" : "Academic-year rollover"}</h4>
                        <p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-muted-foreground">{ar ? "عند بداية العام الجديد، اكتب دورة السنة ثم نفّذ العملية مرة واحدة لرفع سنة جميع الطلاب المسجلين." : "At the start of a new academic year, enter the cycle and run this once to promote all enrolled students."}</p>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-xs font-bold leading-5 text-amber-100">{ar ? "السنة الرابعة تبقى 4، والقيم الفارغة أو غير المعروفة لا تتغير." : "Year 4 remains 4; blank or unknown values are not changed."}</div>
                  </div>
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {["1", "2", "3", "4"].map((year) => <div key={year} className="rounded-2xl border border-white/10 bg-[#0b192b] p-4"><p className="text-2xl font-black text-white">{academicYearDistribution[year] || 0}</p><p className="mt-1 text-xs font-bold text-slate-400">{ar ? `السنة ${year}` : `Year ${year}`}</p></div>)}
                    <div className="col-span-2 sm:col-span-4 rounded-2xl border border-white/10 bg-[#0b192b] px-4 py-3 text-xs font-bold text-slate-400">{ar ? `غير محدد أو قيمة غير معروفة: ${academicYearDistribution["غير محدد"] || 0} طالب` : `Blank or unknown values: ${academicYearDistribution["غير محدد"] || 0} students`}</div>
                  </div>
                  <div className="mt-6 grid md:grid-cols-[1fr_auto] gap-3 items-end">
                    <div><label className="mb-2 block text-xs font-black text-foreground">{ar ? "دورة السنة الجديدة" : "New academic cycle"}</label><input value={academicYearCycle} onChange={(e) => setAcademicYearCycle(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); requestAcademicYearRollover(); } }} placeholder="2026-2027" inputMode="numeric" className="w-full rounded-2xl border border-blue-300/25 bg-[#0b192b] px-4 py-3 text-sm font-black text-white placeholder:text-slate-500 outline-none focus:border-blue-300/70" /><p className="mt-2 text-xs font-bold text-muted-foreground">{ar ? "مثال: 2026-2027 — لن تسمح قاعدة البيانات بتكرار الدورة نفسها." : "Example: 2026-2027 — the database prevents running the same cycle twice."}</p></div>
                    <button type="button" onClick={requestAcademicYearRollover} disabled={isRollingAcademicYear} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-500 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-500/20 hover:bg-blue-400 transition-colors disabled:opacity-50"><RefreshCw className={cn("w-4 h-4", isRollingAcademicYear && "animate-spin")} />{isRollingAcademicYear ? (ar ? "جاري التحديث..." : "Updating...") : (ar ? "رفع سنة الطلاب" : "Promote students")}</button>
                  </div>
                  {academicYearRollovers.length > 0 && <div className="mt-6 border-t border-white/10 pt-5"><p className="mb-3 text-xs font-black uppercase tracking-widest text-muted-foreground">{ar ? "آخر عمليات التحديث" : "Recent rollover history"}</p><div className="space-y-2">{academicYearRollovers.map((rollover: any) => <div key={rollover.cycle_key} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#0b192b] px-4 py-3 text-xs font-bold"><span className="text-white">{rollover.cycle_key}</span><span className="text-emerald-300">{rollover.updated_rows} {ar ? "تم تحديثهم" : "promoted"}</span><span className="text-slate-400">{rollover.changed_at ? new Date(rollover.changed_at).toLocaleDateString(ar ? "ar-JO" : "en-US") : "—"}</span></div>)}</div></div>}
                </div>

                {/* SQL Script Section */}
                <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                        <Database className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <h4 className="font-black">{ar ? "إعداد قاعدة البيانات" : "Database Setup"}</h4>
                        <p className="text-xs text-muted-foreground font-bold">{ar ? "شغّل هذا الـ SQL مرة واحدة لتفعيل صلاحيات الأدمن" : "Run this SQL once to enable admin permissions"}</p>
                      </div>
                    </div>
                    <button onClick={() => setShowSqlModal(true)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white rounded-xl font-black text-sm hover:bg-amber-600 transition-all">
                      <ClipboardCopy className="w-4 h-4" />
                      {ar ? "عرض SQL Script" : "View SQL Script"}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    {[
                      { icon: "1️⃣", text: ar ? "افتح Supabase SQL Editor" : "Open Supabase SQL Editor" },
                      { icon: "2️⃣", text: ar ? "انسخ الكود من الزر أعلاه" : "Copy the code from the button above" },
                      { icon: "3️⃣", text: ar ? "الصق وشغّل (Run)" : "Paste and Run" },
                    ].map((step, i) => (
                      <div key={i} className="flex items-center gap-2 p-3 bg-black/20 rounded-xl">
                        <span className="text-xl">{step.icon}</span>
                        <p className="font-bold text-xs text-muted-foreground">{step.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Maintenance Center */}
                <div>
                  <div className="flex items-center gap-3 text-primary mb-4">
                    <Hammer className="w-6 h-6" />
                    <h4 className="font-black text-lg">{ar ? "مركز الصيانة" : "Maintenance Center"}</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {maintenanceSettings.map((page) => (
                      <div key={page.page_id}
                        className="p-5 rounded-2xl bg-surface border border-border/50 flex items-center justify-between hover:border-primary/30 transition-all">
                        <div>
                          <span className="text-[10px] font-black uppercase text-muted-foreground">{page.page_id}</span>
                          <h5 className="font-bold">{page.page_id}</h5>
                          <p className="text-xs text-muted-foreground">{page.is_active ? (ar ? "⚠️ في وضع الصيانة" : "⚠️ Under maintenance") : (ar ? "✅ يعمل بشكل طبيعي" : "✅ Live & running")}</p>
                        </div>
                        <button onClick={() => toggleMaintenance(page.page_id, page.is_active)}
                          className={cn("px-4 py-2 rounded-xl text-xs font-black transition-all shadow-sm",
                            page.is_active ? "bg-red-500 text-white hover:bg-red-600" : "bg-emerald-500 text-white hover:bg-emerald-600")}>
                          {page.is_active ? "🔴 Maintenance" : "🟢 Live"}
                        </button>
                      </div>
                    ))}
                    {maintenanceSettings.length === 0 && (
                      <div className="col-span-2 py-12 text-center border-2 border-dashed border-border rounded-2xl opacity-40">
                        <p className="font-black">{ar ? "لا توجد إعدادات صيانة" : "No maintenance settings found"}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Edit/Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeModal} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto cyber-glass border border-primary/20 rounded-[2.5rem] bg-card p-0 shadow-2xl z-10" dir="rtl">
              <div className="sticky top-0 flex items-center justify-between p-8 border-b border-white/10 bg-black/40 backdrop-blur-2xl z-20">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                    <Edit className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black">{editingItem ? "تعديل البيانات" : "إضافة سجل جديد"}</h3>
                    {editingItem && (
                      <p className="text-xs text-muted-foreground font-bold mt-0.5">
                        ID: {editingItem.id}
                      </p>
                    )}
                  </div>
                </div>
                <button onClick={closeModal} className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all border border-white/10">
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-6">
                {modalType === "buildings" && (
                  <>
                    <Input name="id" label="رقم المبنى" type="number" defaultValue={editingItem?.id} required={true} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input name="name_en" label="Name (EN)" defaultValue={editingItem?.name_en} required={true} />
                      <Input name="name_ar" label="الاسم (عربي)" defaultValue={editingItem?.name_ar} required={true} />
                      <Input name="tag_ar" label="التصنيف (عربي)" defaultValue={editingItem?.tag_ar} />
                      <Input name="tag_en" label="Tag (EN)" defaultValue={editingItem?.tag_en} />
                    </div>
                    <Input name="tags" label="الكلمات الدلالية (فواصل ,)" defaultValue={editingItem?.tags?.join(", ")} />
                    <Input name="map_url" label="رابط جوجل ماب" defaultValue={editingItem?.map_url} />

                    <FileUpload
                      label={ar ? "صورة المبنى" : "Building Image"}
                      name="image_url" folder="buildings"
                      value={uploadedUrls.image_url}
                      onChange={(url) => setUploadedUrls(prev => ({ ...prev, image_url: url }))}
                      ar={ar}
                    />

                    {/* Image preview */}
                    {(uploadedUrls.image_url || editingItem?.image_url) && (
                      <div className="rounded-2xl overflow-hidden border border-white/10 aspect-video bg-black/20">
                        <img src={uploadedUrls.image_url || editingItem?.image_url} alt="Preview"
                          className="w-full h-full object-cover" />
                      </div>
                    )}

                    <div className="flex items-center gap-2 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                      <input type="checkbox" name="is_featured" id="is_featured"
                        defaultChecked={editingItem?.is_featured} className="w-5 h-5 rounded accent-primary" />
                      <label htmlFor="is_featured" className="text-sm font-black">ظهور في الصفحة الرئيسية (مميز)</label>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/10">
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-sm text-primary">إدارة الطوابق والأقسام</h4>
                        <button type="button"
                          onClick={() => setBuildingFloors([...buildingFloors, { name: "", right: "", left: "" }])}
                          className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 transition-all">
                          + إضافة طابق
                        </button>
                      </div>
                      {buildingFloors.map((floor, idx) => (
                        <div key={idx} className="p-4 bg-surface border border-white/5 rounded-2xl space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-primary">الطابق #{idx + 1}</span>
                            <button type="button" onClick={() => setBuildingFloors(buildingFloors.filter((_, i) => i !== idx))}
                              className="p-1 text-red-500 hover:bg-red-500/10 rounded-lg">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <input value={floor.name}
                            onChange={(e) => { const n = [...buildingFloors]; n[idx].name = e.target.value; setBuildingFloors(n); }}
                            placeholder="اسم الطابق..." className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold" />
                          <div className="grid grid-cols-2 gap-4">
                            <textarea value={floor.right}
                              onChange={(e) => { const n = [...buildingFloors]; n[idx].right = e.target.value; setBuildingFloors(n); }}
                              placeholder="الجهة اليمنى..." rows={2}
                              className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold resize-none" />
                            <textarea value={floor.left}
                              onChange={(e) => { const n = [...buildingFloors]; n[idx].left = e.target.value; setBuildingFloors(n); }}
                              placeholder="الجهة اليسرى..." rows={2}
                              className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold resize-none" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {modalType === "professors" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input name="name_en" label="Name (EN)" defaultValue={editingItem?.name_en} required={true} />
                    <Input name="name_ar" label="الاسم (عربي)" defaultValue={editingItem?.name_ar} required={true} />
                    <Input name="rank" label="Rank (EN)" defaultValue={editingItem?.rank} />
                    <Input name="rank_ar" label="الرتبة الأكاديمية (عربي)" defaultValue={editingItem?.rank_ar} />
                    <Input name="department" label="القسم" defaultValue={editingItem?.department} required={true} />
                    <Input name="office_number" label="رقم المكتب" defaultValue={editingItem?.office_number} />
                    <Input name="office_hours" label="الساعات المكتبية" defaultValue={editingItem?.office_hours} />
                    <Input name="email" label="Email" defaultValue={editingItem?.email} />
                    <Input name="subjects" label="المواد التي يدرسها (مفصولة بفاصلة)" defaultValue={editingItem?.subjects} />
                    <Input name="profile_url" label="رابط الملف الشخصي (Profile URL)" defaultValue={editingItem?.profile_url} />
                    <Input name="building_id" label="رقم مبنى المكتب" type="number" defaultValue={editingItem?.building_id} />
                  </div>
                )}

                {modalType === "restaurants" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input name="name_en" label="Name (EN)" defaultValue={editingItem?.name_en} required={true} />
                      <Input name="name_ar" label="الاسم (عربي)" defaultValue={editingItem?.name_ar} required={true} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-muted-foreground uppercase">التصنيف</label>
                      <select name="category" defaultValue={editingItem?.category || "restaurants_inside"}
                        className="w-full px-4 py-3 rounded-2xl bg-surface border border-border focus:border-primary outline-none transition-all font-bold text-sm text-foreground">
                        <option value="restaurants_inside">{ar ? "مطاعم داخل الحرم الجامعي" : "Inside Campus"}</option>
                        <option value="restaurants_outside">{ar ? "مطاعم خارج الحرم الجامعي" : "Outside Campus"}</option>
                        <option value="cafes">{ar ? "كافيهات واستراحات" : "Cafes & Lounges"}</option>
                        <option value="university_life">{ar ? "حياة جامعية وخدمات" : "University Life & Services"}</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-muted-foreground uppercase">الوصف (عربي)</label>
                      <textarea name="description_ar" defaultValue={editingItem?.description_ar} rows={3}
                        className="w-full px-4 py-3 rounded-2xl bg-surface border border-border focus:border-primary outline-none transition-all font-bold text-sm resize-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-muted-foreground uppercase">Description (EN)</label>
                      <textarea name="description_en" defaultValue={editingItem?.description_en} rows={3}
                        className="w-full px-4 py-3 rounded-2xl bg-surface border border-border focus:border-primary outline-none transition-all font-bold text-sm resize-none" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input name="distance_en" label="Distance (EN)" defaultValue={editingItem?.distance_en} />
                      <Input name="distance_ar" label="المسافة (عربي)" defaultValue={editingItem?.distance_ar} />
                      <Input name="price_level" label="مستوى السعر (1-5)" type="number" defaultValue={editingItem?.price_level || 1} />
                      <Input name="phone" label="رقم الهاتف" defaultValue={editingItem?.phone} />
                      <Input name="map_url" label="رابط جوجل ماب (Map URL)" defaultValue={editingItem?.map_url} />
                      <Input name="icon_name" label="اسم الأيقونة (مثال: Utensils, Coffee)" defaultValue={editingItem?.icon_name} />
                    </div>
                    <FileUpload
                      label={ar ? "صورة المكان" : "Place Image"}
                      name="image_url" folder="restaurants"
                      value={uploadedUrls.image_url}
                      onChange={(url) => setUploadedUrls(prev => ({ ...prev, image_url: url }))}
                      ar={ar}
                    />
                    {(uploadedUrls.image_url || editingItem?.image_url) && (
                      <div className="rounded-2xl overflow-hidden border border-white/10 aspect-video bg-black/20">
                        <img src={uploadedUrls.image_url || editingItem?.image_url} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="space-y-4 pt-4 border-t border-white/10">
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-sm text-primary">{ar ? "قائمة الطعام (المنيو)" : "Menu Management"}</h4>
                        <button type="button" onClick={() => setMenuItems([...menuItems, { name: "", price: "" }])}
                          className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 transition-all">
                          + إضافة صنف
                        </button>
                      </div>
                      {menuItems.map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-center bg-surface border border-white/5 p-3 rounded-xl">
                          <input value={item.name}
                            onChange={(e) => { const n = [...menuItems]; n[idx].name = e.target.value; setMenuItems(n); }}
                            placeholder={ar ? "اسم الوجبة/العصير..." : "Meal name..."}
                            className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold" />
                          <input value={item.price}
                            onChange={(e) => { const n = [...menuItems]; n[idx].price = e.target.value; setMenuItems(n); }}
                            placeholder={ar ? "السعر..." : "Price..."}
                            className="w-24 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold" />
                          <button type="button" onClick={() => setMenuItems(menuItems.filter((_, i) => i !== idx))}
                            className="p-1 text-red-500 hover:bg-red-500/10 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {modalType === "courses" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input name="code" label="رمز المادة (مثال: ELE6466)" defaultValue={editingItem?.code} required={true} />
                    <Input name="name_en" label="Course Name (EN)" defaultValue={editingItem?.name_en} required={true} />
                    <Input name="name_ar" label="اسم المادة (عربي)" defaultValue={editingItem?.name_ar} required={true} />
                    <Input name="credit_hours" label="الساعات الدراسية" type="number" defaultValue={editingItem?.credit_hours || 3} />
                    <Input name="department" label="القسم المسؤول" defaultValue={editingItem?.department} />
                    <Input name="category" label="التصنيف (مثال: engineering)" defaultValue={editingItem?.category || "engineering"} />
                    <div className="md:col-span-2">
                      <Input name="instructors" label="المدرسون (فواصل ,)"
                        defaultValue={Array.isArray(editingItem?.instructors) ? editingItem?.instructors?.join(", ") : editingItem?.instructors} />
                    </div>
                  </div>
                )}

                {modalType === "resources" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input name="title" label="عنوان الملف/المصدر" defaultValue={editingItem?.title} required={true} />
                      {data.courses?.length ? (
                        <div className="space-y-2">
                          <label className="text-xs font-black text-muted-foreground uppercase">المادة</label>
                          <select
                            name="course_id"
                            defaultValue={editingItem?.course_id || ""}
                            required
                            className="w-full appearance-none rounded-2xl border border-slate-600 bg-[#0F172A] px-4 py-3 text-sm font-bold text-white outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30"
                            style={{ colorScheme: "dark" }}
                          >
                            <option value="" className="bg-[#0F172A] text-white">اختر المادة لإضافة المصدر إليها</option>
                            {data.courses.map((course: any) => (
                              <option key={course.id} value={course.id} className="bg-[#0F172A] text-white">
                                {course.code ? `${course.code} — ` : ""}{course.name_ar || course.name_en || course.name || course.title || course.id}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <Input name="course_id" label="رمز المادة" defaultValue={editingItem?.course_id} required={true} />
                      )}
                      <Input name="uploader" label="اسم رافع الملف" defaultValue={editingItem?.uploader || "المشرف"} />
                      <Input name="size" label="حجم الملف (مثال: 2.4 MB)" defaultValue={editingItem?.size} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-muted-foreground uppercase">نوع المصدر</label>
                      <select name="type" defaultValue={editingItem?.type || "summary"}
                        className="w-full appearance-none rounded-2xl border border-slate-600 bg-[#0F172A] px-4 py-3 text-sm font-bold text-white outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30"
                        style={{ colorScheme: "dark" }}>
                        <option value="summary" className="bg-[#0F172A] text-white">{ar ? "ملخصات ودفاتر" : "Summaries & Notes"}</option>
                        <option value="exam" className="bg-[#0F172A] text-white">{ar ? "امتحانات وأسئلة سنوات" : "Exams & Past Papers"}</option>
                        <option value="book" className="bg-[#0F172A] text-white">{ar ? "كتب ومراجع" : "Books & References"}</option>
                        <option value="video" className="bg-[#0F172A] text-white">{ar ? "فيديوهات وشروحات" : "Videos & Explanations"}</option>
                      </select>
                    </div>
                    <FileUpload
                      label={ar ? "رفع الملف أو المصدر" : "Upload Resource File"}
                      name="study_plan_url" folder="resources"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,image/*"
                      value={uploadedUrls.study_plan_url}
                      onChange={(url) => setUploadedUrls(prev => ({ ...prev, study_plan_url: url }))}
                      ar={ar}
                    />
                    <Input name="url" label="أو أدخل رابطاً مباشراً للملف" defaultValue={editingItem?.url || uploadedUrls.study_plan_url} />
                  </div>
                )}

                {modalType === "announcements" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input name="title_ar" label="العنوان (عربي)" defaultValue={editingItem?.title_ar} required={true} />
                      <Input name="title_en" label="Title (EN)" defaultValue={editingItem?.title_en} required={true} />
                      <Input name="short_description_ar" label="الوصف القصير (عربي)" defaultValue={editingItem?.short_description_ar} required={true} />
                      <Input name="short_description_en" label="Short Description (EN)" defaultValue={editingItem?.short_description_en} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-muted-foreground uppercase">المحتوى الكامل (عربي)</label>
                      <textarea name="full_description_ar" defaultValue={editingItem?.full_description_ar} rows={3}
                        className="w-full px-4 py-3 rounded-2xl bg-surface border border-border focus:border-primary outline-none transition-all font-bold text-sm resize-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-muted-foreground uppercase">Full Description (EN)</label>
                      <textarea name="full_description_en" defaultValue={editingItem?.full_description_en} rows={3}
                        className="w-full px-4 py-3 rounded-2xl bg-surface border border-border focus:border-primary outline-none transition-all font-bold text-sm resize-none" />
                    </div>
                    <Input name="tags" label="الوسوم (فواصل ,)" defaultValue={editingItem?.tags?.join(", ")} />
                    <div className="space-y-4 rounded-3xl border border-cyan-400/25 bg-gradient-to-br from-cyan-500/10 via-surface to-indigo-500/10 p-4 md:p-5 shadow-inner">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-400/15 text-cyan-300">
                            <GraduationCap className="h-5 w-5" />
                          </div>
                          <div>
                            <label className="block text-sm font-black text-foreground">تخصيص الإعلان حسب التخصصات</label>
                            <p className="mt-1 text-xs font-bold leading-5 text-muted-foreground">اختر تخصصًا واحدًا أو أكثر. يمكنك تحديد أي عدد من التخصصات في الإعلان نفسه.</p>
                          </div>
                        </div>
                        <span className="shrink-0 rounded-full border border-cyan-300/25 bg-cyan-400/10 px-3 py-1 text-[11px] font-black text-cyan-300">
                          {selectedTargetMajors.length ? `${selectedTargetMajors.length} تخصص` : "غير محدد"}
                        </span>
                      </div>
                      <input type="hidden" name="target_major" value={selectedTargetMajors.join(",")} />
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" role="listbox" aria-multiselectable="true" aria-label="التخصصات المستهدفة">
                        {MAJORS.map((major, index) => {
                          const selected = selectedTargetMajors.includes(major.id);
                          return (
                            <button
                              key={major.id}
                              type="button"
                              role="option"
                              aria-selected={selected}
                              onClick={() => setSelectedTargetMajors(prev => selected ? prev.filter(id => id !== major.id) : [...prev, major.id])}
                              className={cn(
                                "flex min-h-12 items-center gap-3 rounded-2xl border px-3 py-2.5 text-right text-xs font-black transition-all duration-150 active:scale-[0.98]",
                                selected
                                  ? "border-cyan-200 bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                                  : "border-slate-200/15 bg-slate-950/35 text-slate-200 hover:border-cyan-300/50 hover:bg-cyan-400/10 dark:border-white/10 dark:bg-black/20"
                              )}
                            >
                              <span className={cn(
                                "flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border text-[11px]",
                                selected ? "border-white/40 bg-white/20" : "border-white/10 bg-white/5 text-cyan-200"
                              )}>
                                {selected ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                              </span>
                              <span className="leading-5">{major.name}</span>
                            </button>
                          );
                        })}
                      </div>
                      {selectedTargetMajors.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setSelectedTargetMajors([])}
                          className="text-xs font-black text-cyan-300 underline decoration-cyan-300/40 underline-offset-4 hover:text-cyan-100"
                        >
                          مسح التخصصات المحددة
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-emerald-300/20 bg-emerald-500/10 p-4">
                      <input type="checkbox" name="is_global" id="is_global"
                        defaultChecked={editingItem?.is_global || isLegacyGlobalTarget(editingItem?.target_major)} className="h-5 w-5 rounded accent-emerald-400" />
                      <label htmlFor="is_global" className="text-sm font-black text-foreground">
                        {ar ? "إعلان عام لجميع الطلاب 🌐" : "Global announcement for all students 🌐"}
                      </label>
                    </div>
                    <p className="-mt-2 text-xs font-bold text-muted-foreground">عند تفعيل الإعلان العام، ستُعرض الرسالة لجميع الطلاب ويتجاهل النظام التخصصات المحددة.</p>
                    <FileUpload
                      label={ar ? "صورة الإعلان / البانر" : "Announcement Banner Image"}
                      name="banner_url" folder="announcements"
                      value={uploadedUrls.banner_url}
                      onChange={(url) => setUploadedUrls(prev => ({ ...prev, banner_url: url }))}
                      ar={ar}
                    />
                    {(uploadedUrls.banner_url || editingItem?.banner_url) && (
                      <div className="rounded-2xl overflow-hidden border border-white/10 aspect-video bg-black/20">
                        <img src={uploadedUrls.banner_url || editingItem?.banner_url} alt="Banner Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-4 flex gap-3 sticky bottom-0 bg-card z-10 pb-2">
                  <button type="submit" disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-50">
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        {ar ? "جاري الحفظ..." : "Saving..."}
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        {ar ? "حفظ التغييرات" : "Save Changes"}
                      </>
                    )}
                  </button>
                  <button type="button" onClick={closeModal}
                    className="flex-1 px-6 py-4 bg-surface text-foreground rounded-2xl font-black hover:bg-white/5 transition-all">
                    {ar ? "إلغاء" : "Cancel"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SQL Modal */}
      <SqlScriptModal open={showSqlModal} onClose={() => setShowSqlModal(false)} />

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
      />
    </motion.div>
  );
}

function Input({ label, name, type = "text", defaultValue, required = false }: any) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">{label}</label>
      <input name={name} defaultValue={defaultValue} required={required} type={type}
        className="w-full px-4 py-3 rounded-2xl bg-surface border border-border focus:border-primary outline-none transition-all font-bold text-sm" />
    </div>
  );
}

function TableLayout({ headers, items, onEdit, onDelete, ar, isLoading }: any) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const currentItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (isLoading) return (
    <div className="py-20 flex flex-col items-center gap-4">
      <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      <p className="font-black text-muted-foreground animate-pulse">{ar ? "جاري التحميل..." : "Loading..."}</p>
    </div>
  );

  if (items.length === 0) return (
    <div className="py-20 text-center border-2 border-dashed border-border rounded-2xl">
      <Database className="w-12 h-12 mx-auto text-muted-foreground opacity-30 mb-4" />
      <p className="font-black opacity-30">{ar ? "لا توجد بيانات" : "No Data"}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto rounded-2xl border border-border/50 bg-card shadow-sm">
        <table className="w-full text-sm text-left rtl:text-right">
          <thead className="text-xs text-muted-foreground uppercase bg-surface/80 border-b border-border/50">
            <tr>
              {headers.map((h: any, i: any) => <th key={i} className="px-6 py-5 font-black">{h}</th>)}
              <th className="px-6 py-5 font-black text-center">{ar ? "إجراءات" : "Actions"}</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item: any) => (
              <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="border-b border-border/30 hover:bg-primary/5 transition-colors group">
                <td className="px-6 py-4 font-bold max-w-[200px] truncate">{item.col1}</td>
                <td className="px-6 py-4 font-semibold text-muted-foreground">{item.col2}</td>
                <td className="px-6 py-4 font-semibold text-muted-foreground">{item.col3}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => onEdit(item)}
                      className="p-2.5 text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl transition-all hover:scale-110">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(item)}
                      className="p-2.5 text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-all hover:scale-110">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 flex-wrap gap-3">
          <p className="text-[10px] font-black uppercase text-muted-foreground">
            {ar
              ? `الصفحة ${currentPage} من ${totalPages} · ${items.length} سجل`
              : `Page ${currentPage} of ${totalPages} · ${items.length} records`}
          </p>
          <div className="flex items-center gap-1.5">
            {/* زر الأول */}
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-surface border border-border rounded-xl text-xs font-black disabled:opacity-30 hover:border-primary/50 transition-all"
              title={ar ? "الصفحة الأولى" : "First page"}>
              «
            </button>
            {/* زر السابق */}
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 bg-surface border border-border rounded-xl text-xs font-black disabled:opacity-30 hover:border-primary/50 transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* أرقام الصفحات الذكية */}
            {(() => {
              const pages: (number | "...")[] = [];
              const delta = 2; // كم صفحة نعرض حول الحالية

              const rangeStart = Math.max(2, currentPage - delta);
              const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

              // الصفحة الأولى دائماً
              pages.push(1);

              // ... إذا هناك فجوة بعد 1
              if (rangeStart > 2) pages.push("...");

              // صفحات الوسط
              for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);

              // ... إذا هناك فجوة قبل الأخيرة
              if (rangeEnd < totalPages - 1) pages.push("...");

              // الصفحة الأخيرة دائماً
              if (totalPages > 1) pages.push(totalPages);

              return pages.map((page, idx) =>
                page === "..." ? (
                  <span key={`dots-${idx}`}
                    className="w-9 h-9 flex items-center justify-center text-muted-foreground text-xs font-black">
                    ···
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page as number)}
                    className={cn(
                      "w-9 h-9 rounded-xl text-xs font-black transition-all",
                      currentPage === page
                        ? "bg-primary text-white shadow-md shadow-primary/30 scale-105"
                        : "bg-surface border border-border hover:border-primary/50 hover:bg-primary/5"
                    )}>
                    {page}
                  </button>
                )
              );
            })()}

            {/* زر التالي */}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 bg-surface border border-border rounded-xl text-xs font-black disabled:opacity-30 hover:border-primary/50 transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {/* زر الأخير */}
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-surface border border-border rounded-xl text-xs font-black disabled:opacity-30 hover:border-primary/50 transition-all"
              title={ar ? "الصفحة الأخيرة" : "Last page"}>
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
