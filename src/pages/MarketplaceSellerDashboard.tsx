import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Archive,
  ArrowRight,
  BarChart3,
  Banknote,
  CheckCircle2,
  Eye,
  ImagePlus,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  ShoppingCart,
  Store,
  Trash2,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePreferences } from "@/contexts/PreferencesContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import FileUpload from "@/components/FileUpload";
import { cn } from "@/lib/utils";

interface Seller {
  id: string;
  user_id: string;
  store_name_ar: string;
  store_name_en?: string | null;
  description_ar?: string | null;
  description_en?: string | null;
  phone?: string | null;
  whatsapp_url?: string | null;
  logo_url?: string | null;
  is_approved: boolean;
  is_active: boolean;
}

interface Category { id: string; name_ar: string; name_en: string; }
interface Product { id: string; seller_id: string; category_id: string | null; title_ar: string; title_en?: string | null; description_ar?: string | null; description_en?: string | null; benefit_ar?: string | null; benefit_en?: string | null; price?: number | null; currency?: string | null; image_url?: string | null; image_urls?: string[] | null; contact_url?: string | null; status: string; stock_label_ar?: string | null; stock_label_en?: string | null; }
interface ProductAnalytics { product_id: string; title_ar: string; views: number | string; sales: number | string; revenue: number | string; }
interface SellerAnalytics { total_views: number | string; total_sales: number | string; total_revenue: number | string; products: ProductAnalytics[]; }

const emptyProduct = {
  title_ar: "", title_en: "", description_ar: "", description_en: "", benefit_ar: "", benefit_en: "", price: "", currency: "JOD", category_id: "", image_url: "", contact_url: "", stock_label_ar: "متوفر", stock_label_en: "Available",
};

const normalizeUrl = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

export default function MarketplaceSellerDashboard() {
  const { user } = useAuth();
  const { lang, dir } = usePreferences();
  const isAr = lang === "ar";
  const [seller, setSeller] = useState<Seller | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingStore, setSavingStore] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productGallery, setProductGallery] = useState<string[]>([]);
  const [productForm, setProductForm] = useState({ ...emptyProduct });
  const [storeForm, setStoreForm] = useState({ store_name_ar: "", store_name_en: "", description_ar: "", description_en: "", phone: "", whatsapp_url: "", logo_url: "" });
  const [analytics, setAnalytics] = useState<SellerAnalytics | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [recordingSale, setRecordingSale] = useState(false);
  const [saleProductId, setSaleProductId] = useState("");
  const [saleQuantity, setSaleQuantity] = useState("1");
  const [saleAmount, setSaleAmount] = useState("");
  const [saleNote, setSaleNote] = useState("");

  const loadData = async () => {
    if (!user?.id) { setLoading(false); return; }
    setLoading(true);
    const [sellerRes, categoryRes] = await Promise.all([
      supabase.from("marketplace_sellers").select("id,user_id,store_name_ar,store_name_en,description_ar,description_en,phone,whatsapp_url,logo_url,is_approved,is_active").eq("user_id", user.id).maybeSingle(),
      supabase.from("marketplace_categories").select("id,name_ar,name_en").eq("is_active", true).order("sort_order", { ascending: true }).limit(50),
    ]);
    if (sellerRes.error) toast.error(isAr ? "تعذر قراءة بيانات المتجر" : "Unable to load store data");
    setSeller(sellerRes.data as Seller | null);
    setCategories((categoryRes.data || []) as Category[]);
    if (sellerRes.data) {
      const s = sellerRes.data as Seller;
      setStoreForm({ store_name_ar: s.store_name_ar || "", store_name_en: s.store_name_en || "", description_ar: s.description_ar || "", description_en: s.description_en || "", phone: s.phone || "", whatsapp_url: s.whatsapp_url || "", logo_url: s.logo_url || "" });
      const { data: productRows, error: productsError } = await supabase.from("marketplace_products").select("id,seller_id,category_id,title_ar,title_en,description_ar,description_en,benefit_ar,benefit_en,price,currency,image_url,image_urls,contact_url,status,stock_label_ar,stock_label_en").eq("seller_id", s.id).order("created_at", { ascending: false }).limit(100);
      if (productsError) toast.error(isAr ? "تعذر تحميل المنتجات" : "Unable to load products");
      setProducts((productRows || []) as Product[]);
      setLoadingAnalytics(true);
      const { data: analyticsData, error: analyticsError } = await supabase.rpc("get_marketplace_seller_stats", { p_seller_id: s.id });
      if (analyticsError) toast.error(isAr ? "تعذر تحميل الإحصاءات" : "Unable to load analytics");
      setAnalytics((analyticsData as SellerAnalytics | null) || null);
      setLoadingAnalytics(false);
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [user?.id, isAr]);

  const updateStoreField = (key: keyof typeof storeForm, value: string) => setStoreForm((current) => ({ ...current, [key]: value }));
  const updateProductField = (key: keyof typeof productForm, value: string) => setProductForm((current) => ({ ...current, [key]: value }));

  const saveStore = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!seller) return;
    setSavingStore(true);
    const { error } = await supabase.from("marketplace_sellers").update(storeForm).eq("id", seller.id);
    if (error) toast.error(isAr ? "فشل حفظ بيانات المتجر" : "Failed to save store profile");
    else { toast.success(isAr ? "تم حفظ بيانات المتجر" : "Store profile saved"); setSeller({ ...seller, ...storeForm }); }
    setSavingStore(false);
  };

  const closeProductModal = () => { setIsProductModalOpen(false); setEditingProduct(null); setProductGallery([]); setProductForm({ ...emptyProduct }); };
  const openNewProduct = () => { setEditingProduct(null); setProductForm({ ...emptyProduct }); setProductGallery([]); setIsProductModalOpen(true); };
  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({ title_ar: product.title_ar || "", title_en: product.title_en || "", description_ar: product.description_ar || "", description_en: product.description_en || "", benefit_ar: product.benefit_ar || "", benefit_en: product.benefit_en || "", price: product.price == null ? "" : String(product.price), currency: product.currency || "JOD", category_id: product.category_id || "", image_url: product.image_url || "", contact_url: product.contact_url || "", stock_label_ar: product.stock_label_ar || "متوفر", stock_label_en: product.stock_label_en || "Available" });
    setProductGallery(Array.from(new Set([...(product.image_urls || []), product.image_url].filter((value): value is string => Boolean(value)))).slice(0, 5));
    setIsProductModalOpen(true);
  };

  const saveProduct = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!seller) return;
    if (!productForm.title_ar.trim()) { toast.error(isAr ? "أدخل اسم المنتج بالعربية" : "Enter the Arabic product title"); return; }
    setSavingProduct(true);
    const gallery = productGallery.filter(Boolean).slice(0, 5);
    const payload = { seller_id: seller.id, ...productForm, category_id: productForm.category_id || null, title_ar: productForm.title_ar.trim(), price: productForm.price === "" ? null : Number(productForm.price), image_url: gallery[0] || null, image_urls: gallery, contact_url: normalizeUrl(productForm.contact_url), status: "pending" };
    const result = editingProduct
      ? await supabase.from("marketplace_products").update(payload).eq("id", editingProduct.id).eq("seller_id", seller.id)
      : await supabase.from("marketplace_products").insert(payload);
    if (result.error) toast.error(isAr ? "فشل حفظ المنتج. تأكد من البيانات." : "Failed to save the product. Check the fields.");
    else { toast.success(isAr ? "تم إرسال المنتج للمراجعة" : "Product submitted for review"); closeProductModal(); await loadData(); }
    setSavingProduct(false);
  };

  const archiveProduct = async (product: Product) => {
    const { error } = await supabase.from("marketplace_products").update({ status: "archived" }).eq("id", product.id).eq("seller_id", seller?.id || "");
    if (error) toast.error(isAr ? "تعذر أرشفة المنتج" : "Unable to archive product");
    else { toast.success(isAr ? "تمت أرشفة المنتج" : "Product archived"); await loadData(); }
  };

  const recordSale = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!seller || !saleProductId) { toast.error(isAr ? "اختر منتجًا أولًا" : "Choose a product first"); return; }
    const quantity = Number(saleQuantity);
    const amount = Number(saleAmount);
    if (!Number.isInteger(quantity) || quantity < 1) { toast.error(isAr ? "أدخل كمية صحيحة" : "Enter a valid quantity"); return; }
    if (!Number.isFinite(amount) || amount < 0) { toast.error(isAr ? "أدخل قيمة صحيحة" : "Enter a valid amount"); return; }
    setRecordingSale(true);
    const { error } = await supabase.rpc("record_marketplace_sale", { p_product_id: saleProductId, p_quantity: quantity, p_amount: amount, p_note: saleNote.trim() || null });
    if (error) toast.error(isAr ? "تعذر تسجيل المبيعة" : "Unable to record sale");
    else { toast.success(isAr ? "تم تسجيل المبيعة وتحديث الإحصاءات" : "Sale recorded and analytics updated"); setSaleProductId(""); setSaleQuantity("1"); setSaleAmount(""); setSaleNote(""); await loadData(); }
    setRecordingSale(false);
  };

  if (loading) return <div className="min-h-[70vh] flex items-center justify-center text-cyan-300 font-black" dir={dir}>{isAr ? "جاري تحميل لوحة التاجر..." : "Loading seller dashboard..."}</div>;
  if (!seller) return <main className="min-h-[70vh] max-w-2xl mx-auto px-6 pt-32 text-center" dir={dir}><Store className="w-16 h-16 mx-auto text-cyan-300" /><h1 className="mt-6 text-3xl font-black">{isAr ? "لا توجد صلاحية تاجر لهذا الحساب" : "This account is not a seller"}</h1><p className="mt-3 text-muted-foreground font-bold">{isAr ? "يستطيع المشرف منحك الصلاحية من تبويب تجار السوق." : "An admin can grant access from the Marketplace Sellers tab."}</p><Link to="/marketplace" className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-cyan-300 px-6 py-3 font-black text-slate-950"><ArrowRight className="w-4 h-4 rtl:rotate-180" />{isAr ? "العودة للسوق" : "Back to marketplace"}</Link></main>;
  if (!seller.is_approved || !seller.is_active) return <main className="min-h-[70vh] max-w-2xl mx-auto px-6 pt-32 text-center" dir={dir}><div className="mx-auto w-20 h-20 rounded-3xl bg-amber-400/10 border border-amber-300/20 flex items-center justify-center"><Store className="w-10 h-10 text-amber-300" /></div><h1 className="mt-6 text-3xl font-black">{isAr ? "طلب المتجر قيد المراجعة" : "Store access is under review"}</h1><p className="mt-3 text-muted-foreground font-bold leading-7">{seller.is_active ? (isAr ? "سيتم تفعيل لوحة التاجر بعد اعتماد المشرف." : "Your seller dashboard will be enabled after admin approval.") : (isAr ? "تم إيقاف صلاحية هذا المتجر مؤقتًا من قبل المشرف." : "This store has been temporarily suspended by an admin.")}</p><Link to="/marketplace" className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-cyan-300 px-6 py-3 font-black text-slate-950"><ArrowRight className="w-4 h-4 rtl:rotate-180" />{isAr ? "العودة للسوق" : "Back to marketplace"}</Link></main>;

  const analyticsProducts = analytics?.products || [];
  const maxViews = Math.max(1, ...analyticsProducts.map((item) => Number(item.views) || 0));
  const totalViews = Number(analytics?.total_views || 0);
  const totalSales = Number(analytics?.total_sales || 0);
  const totalRevenue = Number(analytics?.total_revenue || 0);

  return <main className="min-h-[80vh] max-w-[1400px] mx-auto px-4 md:px-8 pt-24 pb-24" dir={dir}>
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8"><div><p className="text-xs tracking-[0.25em] font-black text-cyan-300 uppercase">SELLER STUDIO</p><h1 className="mt-3 text-4xl md:text-5xl font-black">{isAr ? "إدارة متجري" : "Seller Studio"}</h1><p className="mt-3 text-muted-foreground font-bold">{isAr ? "أدر واجهة متجرك وأرسل منتجاتك للمراجعة من مكان واحد." : "Manage your storefront and submit listings for review from one place."}</p></div><Link to="/marketplace" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-black hover:border-cyan-300/40 transition-colors"><ArrowRight className="w-4 h-4 rtl:rotate-180" />{isAr ? "عرض السوق" : "View marketplace"}</Link></div>
    <section className="mb-6 rounded-[2rem] border border-cyan-300/15 bg-gradient-to-br from-[#0b1727] via-[#0d1d31] to-[#10213b] p-6 md:p-8 shadow-xl shadow-black/10"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300/10"><BarChart3 className="h-5 w-5 text-cyan-300" /></div><div><h2 className="text-xl font-black">{isAr ? "إحصاءات المتجر" : "Store analytics"}</h2><p className="mt-1 text-xs font-bold text-muted-foreground">{isAr ? "أرقام فعلية من مشاهدات المنتجات والمبيعات المسجلة" : "Live product views and recorded sales"}</p></div></div><button type="button" onClick={loadData} disabled={loadingAnalytics} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-black text-slate-200 hover:border-cyan-300/40 disabled:opacity-60"><RefreshCw className={cn("h-4 w-4", loadingAnalytics && "animate-spin")} />{isAr ? "تحديث الإحصاءات" : "Refresh analytics"}</button></div><div className="mt-6 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><div className="flex items-center justify-between"><p className="text-xs font-black text-slate-400">{isAr ? "مشاهدات المنتجات" : "Product views"}</p><Eye className="h-5 w-5 text-cyan-300" /></div><p className="mt-3 text-3xl font-black text-white">{totalViews.toLocaleString(isAr ? "ar-JO" : "en-US")}</p><p className="mt-1 text-[11px] font-bold text-slate-500">{isAr ? "زائر فريد يوميًا لكل منتج" : "Unique visitor per product/day"}</p></div><div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><div className="flex items-center justify-between"><p className="text-xs font-black text-slate-400">{isAr ? "الوحدات المباعة" : "Units sold"}</p><ShoppingCart className="h-5 w-5 text-emerald-300" /></div><p className="mt-3 text-3xl font-black text-white">{totalSales.toLocaleString(isAr ? "ar-JO" : "en-US")}</p><p className="mt-1 text-[11px] font-bold text-slate-500">{isAr ? "المبيعات المكتملة المسجلة" : "Recorded completed sales"}</p></div><div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><div className="flex items-center justify-between"><p className="text-xs font-black text-slate-400">{isAr ? "الإيرادات" : "Revenue"}</p><Banknote className="h-5 w-5 text-amber-300" /></div><p className="mt-3 text-3xl font-black text-white">{totalRevenue.toFixed(2)} <span className="text-sm text-amber-300">JOD</span></p><p className="mt-1 text-[11px] font-bold text-slate-500">{isAr ? "من المبيعات المكتملة" : "From completed sales"}</p></div></div><div className="mt-6 grid gap-5 lg:grid-cols-[1.15fr_.85fr]"><div className="rounded-2xl border border-white/10 bg-black/10 p-5"><div className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-cyan-300" /><h3 className="font-black text-white">{isAr ? "أداء المنتجات" : "Product performance"}</h3></div>{analyticsProducts.length === 0 ? <p className="py-8 text-center text-xs font-bold text-slate-500">{isAr ? "ستظهر الإحصاءات بعد أول مشاهدة أو مبيعة." : "Analytics will appear after the first view or sale."}</p> : <div className="mt-4 space-y-4">{analyticsProducts.map((item) => { const views = Number(item.views) || 0; const sales = Number(item.sales) || 0; const revenue = Number(item.revenue) || 0; return <div key={item.product_id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><div className="flex items-start justify-between gap-4"><p className="truncate text-sm font-black text-slate-200">{item.title_ar}</p><p className="shrink-0 text-xs font-black text-cyan-300">{views.toLocaleString(isAr ? "ar-JO" : "en-US")} {isAr ? "مشاهدة" : "views"}</p></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-blue-500" style={{ width: `${Math.min(100, Math.round((views / maxViews) * 100))}%` }} /></div><div className="mt-3 flex flex-wrap gap-4 text-[11px] font-bold text-slate-400"><span className="inline-flex items-center gap-1.5"><ShoppingCart className="h-3.5 w-3.5 text-emerald-300" />{sales} {isAr ? "مباع" : "sold"}</span><span className="inline-flex items-center gap-1.5"><Banknote className="h-3.5 w-3.5 text-amber-300" />{revenue.toFixed(2)} JOD</span></div></div>; })}</div>}</div><form onSubmit={recordSale} className="rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.04] p-5"><div className="flex items-center gap-2"><ShoppingCart className="h-4 w-4 text-emerald-300" /><h3 className="font-black text-white">{isAr ? "تسجيل مبيعة" : "Record a sale"}</h3></div><p className="mt-2 text-xs font-bold leading-5 text-slate-400">{isAr ? "سجّل المبيعات التي تمت عبر التواصل معك لتظهر في إحصاءات المتجر." : "Record sales completed through your contact channel."}</p><div className="mt-4 space-y-3"><div><label className="mb-2 block text-xs font-black text-muted-foreground">{isAr ? "المنتج" : "Product"}</label><select value={saleProductId} onChange={(event) => setSaleProductId(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#0f2034] px-4 py-3 text-sm font-bold outline-none focus:border-cyan-300/50"><option value="">{isAr ? "اختر المنتج" : "Choose product"}</option>{products.filter((product) => product.status !== "archived").map((product) => <option key={product.id} value={product.id}>{isAr ? product.title_ar : product.title_en || product.title_ar}</option>)}</select></div><div className="grid grid-cols-2 gap-3"><Field label={isAr ? "الكمية" : "Quantity"} type="number" value={saleQuantity} onChange={setSaleQuantity} /><Field label={isAr ? "القيمة الكلية (JOD)" : "Total amount (JOD)"} type="number" value={saleAmount} onChange={setSaleAmount} required /></div><TextArea label={isAr ? "ملاحظة اختيارية" : "Optional note"} value={saleNote} onChange={setSaleNote} /><button disabled={recordingSale} className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-300 px-5 py-3.5 font-black text-slate-950 hover:bg-white disabled:opacity-60"><Save className="h-4 w-4" />{recordingSale ? (isAr ? "جاري التسجيل..." : "Recording...") : (isAr ? "تسجيل المبيعة" : "Record sale")}</button></div></form></div></section>
    <div className="grid xl:grid-cols-[0.8fr_1.2fr] gap-6 items-start">
      <form onSubmit={saveStore} className="rounded-[2rem] border border-white/10 bg-[#0b1727] p-6 md:p-8 space-y-5"><div className="flex items-center gap-3 border-b border-white/10 pb-5"><div className="w-11 h-11 rounded-2xl bg-cyan-300/10 flex items-center justify-center"><Store className="w-5 h-5 text-cyan-300" /></div><div><h2 className="text-xl font-black">{isAr ? "هوية المتجر" : "Store identity"}</h2><p className="text-xs text-muted-foreground font-bold">{isAr ? "هذه المعلومات تظهر للطلاب" : "This information is visible to students"}</p></div></div><Field label="اسم المتجر بالعربية" value={storeForm.store_name_ar} onChange={(v) => updateStoreField("store_name_ar", v)} required /><Field label="Store name (English)" value={storeForm.store_name_en} onChange={(v) => updateStoreField("store_name_en", v)} /><TextArea label="وصف المتجر" value={storeForm.description_ar} onChange={(v) => updateStoreField("description_ar", v)} /><TextArea label="Store description" value={storeForm.description_en} onChange={(v) => updateStoreField("description_en", v)} /><div className="grid sm:grid-cols-2 gap-4"><Field label="رقم التواصل" value={storeForm.phone} onChange={(v) => updateStoreField("phone", v)} /><Field label="WhatsApp / Contact URL" value={storeForm.whatsapp_url} onChange={(v) => updateStoreField("whatsapp_url", v)} /></div><FileUpload label={isAr ? "شعار المتجر" : "Store logo"} name="logo_url" folder="marketplace/sellers" value={storeForm.logo_url} onChange={(url) => updateStoreField("logo_url", url)} ar={isAr} /><button disabled={savingStore} className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3.5 font-black text-slate-950 hover:bg-white transition-colors disabled:opacity-60"><Save className="w-4 h-4" />{savingStore ? (isAr ? "جاري الحفظ..." : "Saving...") : (isAr ? "حفظ بيانات المتجر" : "Save store profile")}</button></form>
      <section className="rounded-[2rem] border border-white/10 bg-[#0b1727] p-6 md:p-8"><div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5"><div><h2 className="text-xl font-black">{isAr ? "منتجاتي" : "My products"}</h2><p className="mt-1 text-xs text-muted-foreground font-bold">{isAr ? "المنتج الجديد يظهر بعد اعتماد المشرف" : "New listings appear after admin approval"}</p></div><button type="button" onClick={openNewProduct} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-black text-slate-950 hover:bg-white transition-colors"><Plus className="w-4 h-4" />{isAr ? "منتج جديد" : "New product"}</button></div>
        <div className="mt-5 space-y-3">{products.length === 0 && <div className="py-12 text-center text-muted-foreground"><Package className="w-10 h-10 mx-auto text-cyan-300/70" /><p className="mt-3 font-black">{isAr ? "لم تضف منتجات بعد" : "No products yet"}</p></div>}{products.map((product) => <div key={product.id} className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4"><div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-cyan-400/20 to-violet-500/20 flex items-center justify-center">{(product.image_urls?.[0] || product.image_url) ? <img src={product.image_urls?.[0] || product.image_url || ""} alt={product.title_ar} className="w-full h-full object-cover" /> : <ImagePlus className="w-6 h-6 text-cyan-300" />}</div><div className="min-w-0 flex-1"><h3 className="font-black truncate">{isAr ? product.title_ar : product.title_en || product.title_ar}</h3><p className="mt-1 text-xs text-muted-foreground font-bold">{product.price != null ? `${Number(product.price).toFixed(2)} ${product.currency || "JOD"}` : (isAr ? "بدون سعر" : "No price")} · {statusLabel(product.status, isAr)}</p></div><div className="flex items-center gap-2"><button type="button" onClick={() => openEditProduct(product)} className="p-2.5 rounded-xl bg-white/5 text-cyan-300 hover:bg-cyan-300/10" title={isAr ? "تعديل" : "Edit"}><Pencil className="w-4 h-4" /></button>{product.status !== "archived" && <button type="button" onClick={() => archiveProduct(product)} className="p-2.5 rounded-xl bg-white/5 text-amber-300 hover:bg-amber-300/10" title={isAr ? "أرشفة" : "Archive"}><Archive className="w-4 h-4" /></button>}</div></div>)}</div>
      </section>
    </div>
    {isProductModalOpen && <div className="fixed inset-0 z-[120] flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={closeProductModal} /><form onSubmit={saveProduct} className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-cyan-300/20 bg-[#0b1727] p-6 md:p-8 space-y-5"><div className="flex items-center justify-between"><div><p className="text-xs tracking-[0.2em] font-black text-cyan-300 uppercase">LISTING</p><h2 className="mt-2 text-2xl font-black">{editingProduct ? (isAr ? "تعديل المنتج" : "Edit product") : (isAr ? "إضافة منتج" : "Add product")}</h2></div><button type="button" onClick={closeProductModal} className="p-2 rounded-xl bg-white/5"><X className="w-5 h-5" /></button></div><div className="grid md:grid-cols-2 gap-4"><Field label="اسم المنتج بالعربية" value={productForm.title_ar} onChange={(v) => updateProductField("title_ar", v)} required /><Field label="Product title (English)" value={productForm.title_en} onChange={(v) => updateProductField("title_en", v)} /><Field label="السعر" type="number" value={productForm.price} onChange={(v) => updateProductField("price", v)} /><Field label="رابط التواصل" type="url" value={productForm.contact_url} onChange={(v) => updateProductField("contact_url", v)} /><div><label className="mb-2 block text-xs font-black text-muted-foreground">{isAr ? "الفئة" : "Category"}</label><select value={productForm.category_id} onChange={(event) => updateProductField("category_id", event.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#0f2034] px-4 py-3 text-sm font-bold outline-none focus:border-cyan-300/50"><option value="">{isAr ? "اختر الفئة" : "Choose category"}</option>{categories.map((category) => <option key={category.id} value={category.id}>{isAr ? category.name_ar : category.name_en}</option>)}</select></div><div><label className="mb-2 block text-xs font-black text-muted-foreground">{isAr ? "الحالة" : "Availability"}</label><Field label="" value={isAr ? productForm.stock_label_ar : productForm.stock_label_en} onChange={(v) => isAr ? updateProductField("stock_label_ar", v) : updateProductField("stock_label_en", v)} /></div></div><TextArea label="وصف المنتج بالعربية" value={productForm.description_ar} onChange={(v) => updateProductField("description_ar", v)} /><TextArea label="Product description" value={productForm.description_en} onChange={(v) => updateProductField("description_en", v)} /><div className="grid md:grid-cols-2 gap-4"><TextArea label="ما الذي سيستفيده الطالب؟" value={productForm.benefit_ar} onChange={(v) => updateProductField("benefit_ar", v)} /><TextArea label="Student benefit" value={productForm.benefit_en} onChange={(v) => updateProductField("benefit_en", v)} /></div><div className="space-y-3"><div><p className="text-sm font-black text-slate-200">{isAr ? "معرض صور المنتج" : "Product photo gallery"}</p><p className="mt-1 text-xs font-bold text-muted-foreground">{isAr ? "أضف حتى 5 صور. الصورة الأولى هي صورة الغلاف." : "Add up to 5 images. The first image is the cover."}</p></div><div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{Array.from({ length: 5 }).map((_, index) => <div key={index} className="space-y-2"><FileUpload label={`${isAr ? "صورة" : "Image"} ${index + 1}`} name={`image_url_${index}`} folder="marketplace/products" value={productGallery[index] || ""} onChange={(url) => setProductGallery((current) => { const next = [...current]; next[index] = url; return next.slice(0, 5); })} ar={isAr} />{productGallery[index] && <img src={productGallery[index]} alt={`${isAr ? "صورة المنتج" : "Product image"} ${index + 1}`} className="h-24 w-full rounded-xl object-cover" />}</div>)}</div></div><p className="rounded-xl border border-amber-300/15 bg-amber-300/10 px-4 py-3 text-xs font-bold text-amber-100">{isAr ? "سيعود المنتج إلى حالة قيد المراجعة بعد كل تعديل حتى يراجعه المشرف." : "Every edit returns the listing to pending review."}</p><button disabled={savingProduct} className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3.5 font-black text-slate-950 hover:bg-white transition-colors disabled:opacity-60"><Save className="w-4 h-4" />{savingProduct ? (isAr ? "جاري الإرسال..." : "Submitting...") : (isAr ? "إرسال للمراجعة" : "Submit for review")}</button></form></div>}
  </main>;
}

function Field({ label, value, onChange, type = "text", required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) {
  return <div><label className="mb-2 block text-xs font-black text-muted-foreground">{label}</label><input type={type} value={value} required={required} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#0f2034] px-4 py-3 text-sm font-bold outline-none focus:border-cyan-300/50" /></div>;
}
function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <div><label className="mb-2 block text-xs font-black text-muted-foreground">{label}</label><textarea value={value} onChange={(event) => onChange(event.target.value)} rows={3} className="w-full resize-none rounded-2xl border border-white/10 bg-[#0f2034] px-4 py-3 text-sm font-bold outline-none focus:border-cyan-300/50" /></div>;
}
function statusLabel(status: string, isAr: boolean) {
  if (status === "approved") return isAr ? "منشور" : "Published";
  if (status === "rejected") return isAr ? "مرفوض" : "Rejected";
  if (status === "archived") return isAr ? "مؤرشف" : "Archived";
  return isAr ? "قيد المراجعة" : "Pending review";
}
