import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, ExternalLink, Image as ImageIcon, Package, Store, Tag } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { usePreferences } from "@/contexts/PreferencesContext";

interface Seller { id: string; store_name_ar: string; store_name_en?: string | null; description_ar?: string | null; description_en?: string | null; phone?: string | null; whatsapp_url?: string | null; logo_url?: string | null; }
interface Product { id: string; title_ar: string; title_en?: string | null; description_ar?: string | null; description_en?: string | null; benefit_ar?: string | null; benefit_en?: string | null; price?: number | null; currency?: string | null; image_url?: string | null; image_urls?: string[] | null; stock_label_ar?: string | null; stock_label_en?: string | null; }

export default function MarketplaceStore() {
  const { sellerId } = useParams<{ sellerId: string }>();
  const { lang, dir } = usePreferences();
  const isAr = lang === "ar";
  const [seller, setSeller] = useState<Seller | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!sellerId) { setLoading(false); return; }
      const [sellerRes, productsRes] = await Promise.all([
        supabase.from("marketplace_sellers").select("id,store_name_ar,store_name_en,description_ar,description_en,phone,whatsapp_url,logo_url").eq("id", sellerId).eq("is_approved", true).eq("is_active", true).maybeSingle(),
        supabase.from("marketplace_products").select("id,title_ar,title_en,description_ar,description_en,benefit_ar,benefit_en,price,currency,image_url,image_urls,stock_label_ar,stock_label_en").eq("seller_id", sellerId).eq("status", "approved").order("is_featured", { ascending: false }).order("created_at", { ascending: false }).limit(100),
      ]);
      if (mounted) { setSeller(sellerRes.data as Seller | null); setProducts((productsRes.data || []) as Product[]); setLoading(false); }
    }
    load();
    return () => { mounted = false; };
  }, [sellerId]);

  if (loading) return <div className="min-h-[70vh] flex items-center justify-center text-cyan-300 font-black" dir={dir}>{isAr ? "جاري تحميل المتجر..." : "Loading store..."}</div>;
  if (!seller) return <div className="min-h-[70vh] flex flex-col items-center justify-center gap-5 text-center" dir={dir}><Store className="w-14 h-14 text-slate-500" /><h1 className="text-2xl font-black">{isAr ? "المتجر غير موجود" : "Store not found"}</h1><Link to="/marketplace" className="rounded-2xl bg-cyan-300 px-5 py-3 font-black text-slate-950">{isAr ? "العودة إلى السوق" : "Back to marketplace"}</Link></div>;

  const storeName = isAr ? seller.store_name_ar : seller.store_name_en || seller.store_name_ar;
  const description = isAr ? seller.description_ar || seller.description_en : seller.description_en || seller.description_ar;
  return <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8 md:py-12" dir={dir}>
    <div className="mb-7 flex items-center justify-between gap-3"><Link to="/marketplace" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-black text-slate-200 hover:bg-white/10"><ArrowRight className="h-4 w-4" />{isAr ? "العودة إلى السوق" : "Back to marketplace"}</Link></div>
    <section className="relative overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-gradient-to-br from-[#112c4b] via-[#0b1727] to-[#101b35] p-7 md:p-10"><div className="absolute -end-20 -top-20 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" /><div className="relative flex flex-col gap-6 sm:flex-row sm:items-center"><div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[1.75rem] border border-white/10 bg-cyan-300/10">{seller.logo_url ? <img src={seller.logo_url} alt={storeName} className="h-full w-full object-cover" /> : <Store className="h-10 w-10 text-cyan-300" />}</div><div><p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">MURSHID STORE</p><h1 className="mt-2 text-3xl font-black text-white md:text-5xl">{storeName}</h1>{description && <p className="mt-3 max-w-2xl text-sm font-bold leading-7 text-slate-300">{description}</p>}</div>{seller.whatsapp_url && <a href={seller.whatsapp_url} target="_blank" rel="noreferrer" className="sm:ms-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3 font-black text-slate-950 hover:bg-white"><ExternalLink className="h-4 w-4" />{isAr ? "تواصل مع المتجر" : "Contact store"}</a>}</div></section>
    <div className="mt-9 flex items-end justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-widest text-cyan-300">STORE CATALOG</p><h2 className="mt-2 text-2xl font-black text-white md:text-3xl">{isAr ? "منتجات المتجر" : "Store products"}</h2></div><span className="rounded-xl bg-white/5 px-3 py-2 text-xs font-black text-slate-300">{products.length} {isAr ? "منتج" : "products"}</span></div>
    {products.length === 0 ? <div className="mt-6 rounded-[2rem] border border-dashed border-white/15 bg-[#0b1727] py-16 text-center text-slate-400"><Package className="mx-auto h-12 w-12 text-cyan-300/60" /><p className="mt-3 font-black">{isAr ? "لا توجد منتجات منشورة في هذا المتجر بعد" : "This store has no published products yet"}</p></div> : <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{products.map((product) => { const title = isAr ? product.title_ar : product.title_en || product.title_ar; const description = isAr ? product.description_ar || product.description_en : product.description_en || product.description_ar; const image = product.image_urls?.[0] || product.image_url; return <article key={product.id} className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0b1727] transition hover:-translate-y-1 hover:border-cyan-300/35"><div className="h-48 bg-gradient-to-br from-cyan-400/20 to-violet-500/20">{image ? <img src={image} alt={title} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center"><ImageIcon className="h-14 w-14 text-cyan-300/70" /></div>}</div><div className="p-5"><div className="flex items-start justify-between gap-3"><h3 className="line-clamp-2 text-lg font-black text-white">{title}</h3>{product.price != null && <span className="shrink-0 text-sm font-black text-cyan-300">{Number(product.price).toFixed(2)} {product.currency || "JOD"}</span>}</div>{description && <p className="mt-3 line-clamp-2 text-sm font-bold leading-6 text-slate-400">{description}</p>}<div className="mt-5 flex items-center justify-between gap-3"><span className="text-xs font-black text-emerald-300">{isAr ? product.stock_label_ar || "متوفر" : product.stock_label_en || "Available"}</span><Link to={`/marketplace/product/${product.id}`} className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-300 px-3 py-2 text-xs font-black text-slate-950 hover:bg-white">{isAr ? "التفاصيل" : "Details"}<ArrowRight className="h-3.5 w-3.5" /></Link></div></div></article>; })}</div>}
  </main>;
}
