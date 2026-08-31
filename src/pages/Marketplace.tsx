import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpLeft,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Cpu,
  ExternalLink,
  FolderOpen,
  Package,
  Search,
  ShoppingBag,
  Store,
  Wrench,
  XCircle,
} from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  icon?: string | null;
}

interface Product {
  id: string;
  seller_id: string;
  category_id: string | null;
  title_ar: string;
  title_en?: string | null;
  description_ar?: string | null;
  description_en?: string | null;
  benefit_ar?: string | null;
  benefit_en?: string | null;
  price?: number | null;
  currency?: string | null;
  image_url?: string | null;
  image_urls?: string[] | null;
  contact_url?: string | null;
  stock_label_ar?: string | null;
  stock_label_en?: string | null;
  is_featured?: boolean;
  sellerName?: string;
  category?: Category;
}

const iconForCategory = (icon?: string | null) => {
  if (icon === "Wrench") return Wrench;
  if (icon === "BriefcaseBusiness") return BriefcaseBusiness;
  if (icon === "Cpu") return Cpu;
  if (icon === "Package") return Package;
  return FolderOpen;
};

const gradients = [
  "from-cyan-500/30 via-blue-500/20 to-indigo-500/30",
  "from-violet-500/30 via-fuchsia-500/20 to-cyan-500/30",
  "from-emerald-500/30 via-teal-500/20 to-cyan-500/30",
  "from-amber-500/25 via-orange-500/20 to-rose-500/25",
];

export default function Marketplace() {
  const { lang, dir } = usePreferences();
  const { user } = useAuth();
  const isAr = lang === "ar";
  const navigate = useNavigate();
  const [enabled, setEnabled] = useState(false);
  const [closedMessage, setClosedMessage] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [canManage, setCanManage] = useState(false);

  useEffect(() => {
    let active = true;
    const loadMarketplace = async () => {
      setLoading(true);
      setLoadError(false);
      const [settingsRes, categoriesRes, productsRes, sellersRes] = await Promise.all([
        supabase.from("marketplace_settings").select("is_enabled,message_ar,message_en").eq("id", "global").maybeSingle(),
        supabase.from("marketplace_categories").select("id,slug,name_ar,name_en,icon").eq("is_active", true).order("sort_order", { ascending: true }).limit(50),
        supabase.from("marketplace_products").select("id,seller_id,category_id,title_ar,title_en,description_ar,description_en,benefit_ar,benefit_en,price,currency,image_url,image_urls,contact_url,stock_label_ar,stock_label_en,is_featured").eq("status", "approved").order("is_featured", { ascending: false }).order("created_at", { ascending: false }).limit(200),
        user?.id
          ? supabase.from("marketplace_sellers").select("id,is_approved,is_active").eq("user_id", user.id).maybeSingle()
          : Promise.resolve({ data: null, error: null }),
      ]);

      if (!active) return;
      if (settingsRes.error || categoriesRes.error || productsRes.error) {
        setLoadError(true);
      }
      setEnabled(Boolean(settingsRes.data?.is_enabled));
      setClosedMessage(isAr ? settingsRes.data?.message_ar || "السوق مغلق مؤقتًا" : settingsRes.data?.message_en || "The marketplace is temporarily closed");
      const categoryRows = (categoriesRes.data || []) as Category[];
      setCategories(categoryRows);
      const categoryMap = new Map(categoryRows.map((category) => [category.id, category]));
      const sellerMap = new Map<string, string>();
      if (productsRes.data?.length) {
        const sellerIds = Array.from(new Set(productsRes.data.map((product: any) => product.seller_id).filter(Boolean)));
        if (sellerIds.length) {
          const { data: sellers } = await supabase.from("marketplace_sellers").select("id,store_name_ar,store_name_en").in("id", sellerIds).limit(200);
          (sellers || []).forEach((seller: any) => sellerMap.set(seller.id, isAr ? seller.store_name_ar : seller.store_name_en || seller.store_name_ar));
        }
      }
      setProducts((productsRes.data || []).map((product: any) => ({
        ...product,
        category: categoryMap.get(product.category_id),
        sellerName: sellerMap.get(product.seller_id) || (isAr ? "تاجر مرشد" : "Murshid seller"),
      })));
      setCanManage(Boolean(sellersRes.data));
      setLoading(false);
    };
    loadMarketplace();
    return () => { active = false; };
  }, [user?.id, isAr]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = activeCategory === "all" || product.category_id === activeCategory;
      const searchable = [product.title_ar, product.title_en, product.description_ar, product.description_en, product.benefit_ar, product.benefit_en, product.sellerName].filter(Boolean).join(" ").toLowerCase();
      return matchesCategory && (!query || searchable.includes(query));
    });
  }, [products, activeCategory, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-[76vh] max-w-[1400px] mx-auto px-4 md:px-8 pt-28 pb-20" dir={dir}>
        <div className="h-10 w-48 rounded-2xl bg-white/5 animate-pulse mb-8" />
        <div className="h-72 rounded-[2.5rem] bg-white/5 animate-pulse mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((item) => <div key={item} className="h-80 rounded-[2rem] bg-white/5 animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (!enabled) {
    return (
      <motion.main initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="min-h-[78vh] max-w-[1400px] mx-auto px-4 md:px-8 pt-28 pb-20" dir={dir}>
        <div className="relative overflow-hidden rounded-[2.75rem] border border-cyan-400/15 bg-[#091423] shadow-2xl shadow-cyan-950/20 min-h-[560px] flex items-center justify-center text-center">
          <div className="absolute -top-28 -right-20 w-96 h-96 rounded-full bg-cyan-500/15 blur-[100px]" />
          <div className="absolute -bottom-40 -left-20 w-[30rem] h-[30rem] rounded-full bg-violet-600/15 blur-[120px]" />
          <div className="relative max-w-2xl px-6">
            <div className="mx-auto mb-8 w-20 h-20 rounded-3xl bg-cyan-400/10 border border-cyan-300/20 flex items-center justify-center shadow-lg shadow-cyan-900/20">
              <Store className="w-10 h-10 text-cyan-300" />
            </div>
            <p className="text-xs font-black tracking-[0.3em] text-cyan-300/80 uppercase mb-4">MURSHID MARKETPLACE</p>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-5">{isAr ? "السوق قريبًا" : "Marketplace is coming soon"}</h1>
            <p className="text-base md:text-lg font-bold leading-8 text-slate-300 max-w-xl mx-auto">{closedMessage || (isAr ? "نرتب لك مساحة موثوقة لبيع وشراء الأدوات والخدمات الهندسية داخل الجامعة." : "A trusted space for engineering tools and services is being prepared for the university community.")}</p>
            <div className="mt-9 inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-black text-slate-300"><ShoppingBag className="w-4 h-4 text-cyan-300" />{isAr ? "سيظهر هنا كل ما يضيفه التجار المعتمدون" : "Approved sellers will appear here"}</div>
            {canManage && <Link to="/marketplace/manage" className="mt-4 mx-auto flex w-fit items-center gap-2 text-sm font-black text-cyan-300 hover:text-white transition-colors"><ArrowUpLeft className="w-4 h-4" />{isAr ? "إدارة متجري" : "Manage my store"}</Link>}
          </div>
        </div>
      </motion.main>
    );
  }

  return (
    <motion.main initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="min-h-[78vh] max-w-[1500px] mx-auto px-4 md:px-8 pt-24 pb-24" dir={dir}>
      <section className="relative overflow-hidden rounded-[2.5rem] bg-[#091423] border border-cyan-400/15 px-6 py-8 md:px-12 md:py-11 shadow-2xl shadow-cyan-950/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.17),transparent_35%),radial-gradient(circle_at_90%_110%,rgba(124,58,237,0.18),transparent_40%)]" />
        <div className="relative grid lg:grid-cols-[1fr_auto] gap-8 items-end">
          <div>
            <div className="flex items-center gap-3 text-cyan-300 mb-5"><span className="w-10 h-10 rounded-2xl bg-cyan-400/10 border border-cyan-300/15 flex items-center justify-center"><ShoppingBag className="w-5 h-5" /></span><span className="text-xs font-black tracking-[0.25em] uppercase">MURSHID MARKETPLACE</span></div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.1]">{isAr ? "كل احتياجاتك الهندسية في مكان واحد" : "Everything engineering, in one place"}</h1>
            <p className="mt-5 max-w-2xl text-slate-300 font-bold leading-8">{isAr ? "اكتشف معدات، كتب، ملخصات وخدمات يقدّمها تجار وطلاب من مجتمع مرشد." : "Discover equipment, books, notes, and services offered by trusted sellers in the Murshid community."}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 min-w-[230px]">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4"><p className="text-2xl font-black text-white">{products.length}</p><p className="mt-1 text-xs font-bold text-slate-400">{isAr ? "منتج منشور" : "Published products"}</p></div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4"><p className="text-2xl font-black text-white">{categories.length}</p><p className="mt-1 text-xs font-bold text-slate-400">{isAr ? "فئة" : "Categories"}</p></div>
          </div>
        </div>
        <div className="relative mt-8 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1"><Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={isAr ? "ابحث عن منتج، خدمة أو تاجر..." : "Search for a product, service, or seller..."} className="w-full rounded-2xl bg-[#0f2034] border border-white/10 px-12 py-4 text-sm font-bold text-white placeholder:text-slate-500 outline-none focus:border-cyan-300/50 transition-colors" /></div>
          {canManage && <Link to="/marketplace/manage" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-4 text-sm font-black text-slate-950 hover:bg-white transition-colors"><Store className="w-4 h-4" />{isAr ? "إدارة متجري" : "Manage my store"}</Link>}
        </div>
      </section>

      <section className="mt-8 flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
        <button onClick={() => setActiveCategory("all")} className={cn("shrink-0 rounded-2xl px-5 py-3 text-sm font-black transition-all border", activeCategory === "all" ? "bg-cyan-300 text-slate-950 border-cyan-300 shadow-lg shadow-cyan-400/15" : "bg-white/5 text-slate-300 border-white/10 hover:border-cyan-300/40")}>{isAr ? "الكل" : "All products"}</button>
        {categories.map((category) => {
          const Icon = iconForCategory(category.icon);
          return <button key={category.id} onClick={() => setActiveCategory(category.id)} className={cn("shrink-0 inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-black transition-all border", activeCategory === category.id ? "bg-cyan-300 text-slate-950 border-cyan-300 shadow-lg shadow-cyan-400/15" : "bg-white/5 text-slate-300 border-white/10 hover:border-cyan-300/40")}><Icon className="w-4 h-4" />{isAr ? category.name_ar : category.name_en}</button>;
        })}
      </section>

      {loadError && <div className="mb-5 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-5 py-4 text-sm font-bold text-amber-200">{isAr ? "تعذر تحميل بعض بيانات السوق. يتم عرض آخر ما توفر من المنتجات." : "Some marketplace data could not be loaded. Showing the latest available products."}</div>}

      {filteredProducts.length === 0 ? (
        <div className="mt-5 rounded-[2.5rem] border border-dashed border-white/15 bg-white/[0.03] py-24 text-center"><Package className="w-12 h-12 mx-auto text-cyan-300/70" /><h2 className="mt-5 text-2xl font-black text-white">{searchQuery || activeCategory !== "all" ? (isAr ? "لا توجد نتائج مطابقة" : "No matching products") : (isAr ? "السوق جاهز لاستقبال أول منتجاته" : "The marketplace is ready for its first products")}</h2><p className="mt-3 text-sm font-bold text-slate-400">{canManage ? (isAr ? "أضف منتجك من صفحة إدارة المتجر وسيظهر بعد اعتماد المشرف." : "Add a product from your seller dashboard; it will appear after admin approval.") : (isAr ? "ستظهر المنتجات هنا فور اعتمادها من المشرف." : "Products will appear here as soon as they are approved.")}</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {filteredProducts.map((product, index) => {
            const category = product.category;
            const Icon = iconForCategory(category?.icon);
            const title = isAr ? product.title_ar : product.title_en || product.title_ar;
            const description = isAr ? product.description_ar || product.description_en : product.description_en || product.description_ar;
            const benefit = isAr ? product.benefit_ar || product.benefit_en : product.benefit_en || product.benefit_ar;
            return <motion.article key={product.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.04, 0.25) }} role="link" tabIndex={0} onClick={(event) => { if (!(event.target as HTMLElement).closest("a,button")) navigate(`/marketplace/product/${product.id}`); }} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") navigate(`/marketplace/product/${product.id}`); }} className="group cursor-pointer overflow-hidden rounded-[2rem] bg-[#0b1727] border border-white/10 hover:border-cyan-300/35 hover:-translate-y-1 transition-all duration-200 shadow-xl shadow-black/10">
              <div className={cn("relative h-48 overflow-hidden bg-gradient-to-br", gradients[index % gradients.length])}>
                {(product.image_urls?.[0] || product.image_url) ? <img src={product.image_urls?.[0] || product.image_url || ""} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className="w-full h-full flex items-center justify-center"><Icon className="w-16 h-16 text-white/70" /></div>}
                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4"><span className="rounded-xl bg-black/35 backdrop-blur-md px-3 py-1.5 text-[10px] font-black text-white">{isAr ? category?.name_ar || "متنوع" : category?.name_en || "Other"}</span>{product.is_featured && <span className="rounded-xl bg-cyan-300 px-3 py-1.5 text-[10px] font-black text-slate-950">{isAr ? "مميز" : "Featured"}</span>}</div>
              </div>
              <div className="p-5"><div className="flex items-start justify-between gap-3"><h3 className="text-lg font-black leading-7 text-white line-clamp-2">{title}</h3>{product.price != null && <p className="shrink-0 text-sm font-black text-cyan-300">{Number(product.price).toFixed(2)} {product.currency || "JOD"}</p>}</div><p className="mt-3 min-h-12 text-sm font-bold leading-6 text-slate-400 line-clamp-2">{description || (isAr ? "منتج من متجر مرشد" : "A Murshid marketplace listing")}</p>{benefit && <div className="mt-3 rounded-xl border border-cyan-300/10 bg-cyan-300/5 px-3 py-2.5"><p className="text-[10px] font-black text-cyan-300">{isAr ? "الفائدة للطالب" : "Student benefit"}</p><p className="mt-1 text-xs font-bold leading-5 text-slate-300 line-clamp-2">{benefit}</p></div>}<div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4"><div className="min-w-0"><Link to={`/marketplace/store/${product.seller_id}`} className="truncate text-xs font-black text-slate-200 hover:text-cyan-200">{product.sellerName}</Link><p className="mt-1 text-[11px] font-bold text-emerald-300">{isAr ? product.stock_label_ar || "متوفر" : product.stock_label_en || "Available"}</p></div><div className="flex flex-wrap items-center gap-2"><Link to={`/marketplace/store/${product.seller_id}`} className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-black text-slate-300 hover:border-cyan-300/30 hover:text-cyan-200 transition-colors"><Store className="w-3.5 h-3.5" />{isAr ? "اذهب إلى المتجر" : "Visit store"}</Link>{product.contact_url ? <a href={product.contact_url} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-cyan-300 px-3 py-2 text-xs font-black text-slate-950 hover:bg-white transition-colors">{isAr ? "تواصل" : "Contact"}<ExternalLink className="w-3.5 h-3.5" /></a> : <span className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-white/5 px-3 py-2 text-[11px] font-black text-slate-500"><XCircle className="w-3.5 h-3.5" />{isAr ? "قريبًا" : "Soon"}</span>}</div></div></div>
            </motion.article>;
          })}
        </div>
      )}

      <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-5"><div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-300" /><p className="text-sm font-bold text-slate-300">{isAr ? "جميع المنتجات المعروضة تمر بمراجعة المشرف قبل النشر." : "Every listing is reviewed by an admin before publication."}</p></div><div className="flex items-center gap-2 text-xs font-black text-slate-500"><ChevronLeft className="w-4 h-4 rtl:hidden" /><ChevronRight className="w-4 h-4 ltr:hidden" />{isAr ? "سوق آمن لمجتمع مرشد" : "A trusted market for Murshid"}</div></div>
    </motion.main>
  );
}
