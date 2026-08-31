import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Image as ImageIcon, MessageCircle, Package, Send, Star, Store, Tag, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const getMarketplaceVisitorKey = () => {
  const storageKey = "murshid_marketplace_visitor";
  const existing = window.localStorage.getItem(storageKey);
  if (existing) return existing;
  const generated = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  window.localStorage.setItem(storageKey, generated);
  return generated;
};

interface Category { id: string; name_ar: string; name_en: string; icon?: string | null; }
interface Seller { id: string; store_name_ar: string; store_name_en?: string | null; description_ar?: string | null; description_en?: string | null; phone?: string | null; whatsapp_url?: string | null; logo_url?: string | null; }
interface Product { id: string; seller_id: string; category_id: string | null; title_ar: string; title_en?: string | null; description_ar?: string | null; description_en?: string | null; benefit_ar?: string | null; benefit_en?: string | null; price?: number | null; currency?: string | null; image_url?: string | null; image_urls?: string[] | null; contact_url?: string | null; stock_label_ar?: string | null; stock_label_en?: string | null; category?: Category | null; seller?: Seller | null; }
interface Review { id: string; rating: number; review_text: string; created_at: string; reviewer_label?: string | null; }
interface ReviewSummary { average_rating: number | string; review_count: number | string; can_review?: boolean; reviews: Review[]; }

export default function MarketplaceProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const { lang, dir } = usePreferences();
  const { user } = useAuth();
  const isAr = lang === "ar";
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [reviewSummary, setReviewSummary] = useState<ReviewSummary>({ average_rating: 0, review_count: 0, can_review: true, reviews: [] });
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!productId) { setLoading(false); return; }
      const { data, error } = await supabase.from("marketplace_products").select("id,seller_id,category_id,title_ar,title_en,description_ar,description_en,benefit_ar,benefit_en,price,currency,image_url,image_urls,contact_url,stock_label_ar,stock_label_en").eq("id", productId).eq("status", "approved").maybeSingle();
      if (error || !data) { if (mounted) { setProduct(null); setLoading(false); } return; }
      void supabase.rpc("record_marketplace_product_view", { p_product_id: productId, p_visitor_key: getMarketplaceVisitorKey() });
      const [categoryRes, sellerRes, reviewRes] = await Promise.all([
        data.category_id ? supabase.from("marketplace_categories").select("id,name_ar,name_en,icon").eq("id", data.category_id).maybeSingle() : Promise.resolve({ data: null }),
        supabase.from("marketplace_sellers").select("id,store_name_ar,store_name_en,description_ar,description_en,phone,whatsapp_url,logo_url").eq("id", data.seller_id).eq("is_approved", true).eq("is_active", true).maybeSingle(),
        supabase.rpc("get_marketplace_product_review_summary", { p_product_id: productId }),
      ]);
      if (mounted) { setProduct({ ...(data as Product), category: categoryRes.data as Category | null, seller: sellerRes.data as Seller | null }); setReviewSummary((reviewRes.data as ReviewSummary | null) || { average_rating: 0, review_count: 0, reviews: [] }); setLoading(false); }
    }
    load();
    return () => { mounted = false; };
  }, [productId]);

  const submitReview = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) { setReviewMessage(isAr ? "سجّل الدخول أولًا لإضافة تقييم." : "Please sign in before leaving a review."); return; }
    if (!productId) return;
    setSubmittingReview(true);
    setReviewMessage("");
    const { error } = await supabase.rpc("submit_marketplace_review", { p_product_id: productId, p_rating: reviewRating, p_review_text: reviewText.trim() });
    if (error) {
      const errorText = error.message.toLowerCase();
      const message = errorText.includes("sellers cannot")
        ? (isAr ? "لا يمكنك تقييم منتجك." : "You cannot review your own product.")
        : errorText.includes("not available")
          ? (isAr ? "هذا المنتج غير متاح للتقييم حاليًا." : "This product is not currently available for review.")
          : (isAr ? "تعذر حفظ التقييم. تحقق من تسجيل الدخول وحاول مرة أخرى." : "Unable to save the review. Check your sign-in and try again.");
      setReviewMessage(message);
    } else {
      setReviewText("");
      setReviewRating(5);
      setReviewMessage(isAr ? "تم حفظ تقييمك بنجاح." : "Your review was saved successfully.");
      const { data } = await supabase.rpc("get_marketplace_product_review_summary", { p_product_id: productId });
      setReviewSummary((data as ReviewSummary | null) || { average_rating: 0, review_count: 0, reviews: [] });
    }
    setSubmittingReview(false);
  };

  const images = useMemo(() => {
    if (!product) return [];
    return Array.from(new Set([...(product.image_urls || []), product.image_url].filter((value): value is string => Boolean(value))));
  }, [product]);

  if (loading) return <div className="min-h-[70vh] flex items-center justify-center text-cyan-300 font-black" dir={dir}>{isAr ? "جاري تحميل تفاصيل المنتج..." : "Loading product details..."}</div>;
  if (!product) return <div className="min-h-[70vh] flex flex-col items-center justify-center gap-5 text-center" dir={dir}><Package className="w-14 h-14 text-slate-500" /><h1 className="text-2xl font-black">{isAr ? "المنتج غير موجود" : "Product not found"}</h1><Link to="/marketplace" className="rounded-2xl bg-cyan-300 px-5 py-3 font-black text-slate-950">{isAr ? "العودة إلى السوق" : "Back to marketplace"}</Link></div>;

  const title = isAr ? product.title_ar : product.title_en || product.title_ar;
  const description = isAr ? product.description_ar || product.description_en : product.description_en || product.description_ar;
  const benefit = isAr ? product.benefit_ar || product.benefit_en : product.benefit_en || product.benefit_ar;
  const sellerName = isAr ? product.seller?.store_name_ar : product.seller?.store_name_en || product.seller?.store_name_ar;

  return <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8 md:py-12" dir={dir}>
    <div className="mb-7 flex flex-wrap items-center justify-between gap-3"><button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-black text-slate-200 hover:bg-white/10"><ArrowRight className={cn("w-4 h-4", !isAr && "rotate-180")} />{isAr ? "رجوع" : "Back"}</button><Link to="/marketplace" className="text-sm font-black text-cyan-300 hover:text-white">{isAr ? "السوق المفتوح" : "Open marketplace"}</Link></div>
    <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr]">
      <section className="space-y-4"><div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b1727]">{images[activeImage] ? <img src={images[activeImage]} alt={title} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center"><ImageIcon className="h-24 w-24 text-cyan-300/60" /></div>}{product.category && <span className="absolute start-5 top-5 rounded-xl bg-black/50 px-3 py-2 text-xs font-black text-white backdrop-blur-md">{isAr ? product.category.name_ar : product.category.name_en}</span>}</div>{images.length > 1 && <div className="grid grid-cols-5 gap-3">{images.map((image, index) => <button key={`${image}-${index}`} onClick={() => setActiveImage(index)} className={cn("aspect-square overflow-hidden rounded-2xl border-2 bg-[#0b1727] transition", activeImage === index ? "border-cyan-300" : "border-white/10 opacity-70 hover:opacity-100")}><img src={image} alt={`${title} ${index + 1}`} className="h-full w-full object-cover" /></button>)}</div>}</section>
      <section className="rounded-[2rem] border border-white/10 bg-[#0b1727] p-6 md:p-8"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">PRODUCT DETAILS</p><h1 className="mt-3 text-3xl font-black leading-tight text-white md:text-4xl">{title}</h1></div>{product.price != null && <p className="shrink-0 rounded-2xl bg-cyan-300/10 px-4 py-3 text-lg font-black text-cyan-200">{Number(product.price).toFixed(2)} {product.currency || "JOD"}</p>}</div><div className="mt-5 flex items-center gap-2 text-sm font-bold text-emerald-300"><CheckCircle2 className="h-4 w-4" />{isAr ? product.stock_label_ar || "متوفر" : product.stock_label_en || "Available"}</div>{description && <div className="mt-8 border-t border-white/10 pt-6"><h2 className="text-sm font-black text-slate-300">{isAr ? "عن المنتج" : "About this product"}</h2><p className="mt-3 whitespace-pre-line text-sm font-bold leading-7 text-slate-400">{description}</p></div>}{benefit && <div className="mt-6 rounded-2xl border border-cyan-300/15 bg-cyan-300/5 p-5"><h2 className="flex items-center gap-2 text-sm font-black text-cyan-200"><Tag className="h-4 w-4" />{isAr ? "ماذا سيستفيد الطالب؟" : "What will the student get?"}</h2><p className="mt-3 whitespace-pre-line text-sm font-bold leading-7 text-slate-300">{benefit}</p></div>}<div className="mt-8 flex flex-wrap gap-3">{product.contact_url && <a href={product.contact_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3.5 text-sm font-black text-slate-950 hover:bg-white"><MessageCircle className="h-4 w-4" />{isAr ? "تواصل مع التاجر" : "Contact seller"}</a>}</div></section>
    </div>
    {product.seller && <section className="mt-8 rounded-[2rem] border border-white/10 bg-[#0b1727] p-6"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-4">{product.seller.logo_url ? <img src={product.seller.logo_url} alt={sellerName || "Store"} className="h-16 w-16 rounded-2xl object-cover" /> : <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-300/10"><Store className="h-7 w-7 text-cyan-300" /></div>}<div><p className="text-xs font-black uppercase tracking-widest text-slate-500">{isAr ? "يباع من" : "Sold by"}</p><h2 className="mt-1 text-xl font-black text-white">{sellerName}</h2></div></div><Link to={`/marketplace/store/${product.seller.id}`} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-5 py-3 text-sm font-black text-white hover:bg-cyan-300 hover:text-slate-950"><Store className="h-4 w-4" />{isAr ? "اذهب إلى المتجر" : "Visit store"}</Link></div>{(isAr ? product.seller.description_ar : product.seller.description_en || product.seller.description_ar) && <p className="mt-5 border-t border-white/10 pt-5 text-sm font-bold leading-7 text-slate-400">{isAr ? product.seller.description_ar : product.seller.description_en || product.seller.description_ar}</p>}</section>}
    <section className="mt-8 rounded-[2rem] border border-white/10 bg-[#0b1727] p-6 md:p-8"><div className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">CUSTOMER REVIEWS</p><h2 className="mt-2 text-2xl font-black text-white">{isAr ? "تقييمات الطلاب" : "Customer reviews"}</h2><div className="mt-3 flex flex-wrap items-center gap-3"><Stars value={Number(reviewSummary.average_rating)} /><span className="text-lg font-black text-amber-300">{Number(reviewSummary.average_rating).toFixed(1)}</span><span className="text-xs font-bold text-slate-500">({Number(reviewSummary.review_count).toLocaleString(isAr ? "ar-JO" : "en-US")} {isAr ? "تقييم" : "reviews"})</span></div></div><p className="max-w-sm text-sm font-bold leading-6 text-slate-400">{isAr ? "شارك تجربتك ليساعد تقييمك بقية طلاب مرشد على اتخاذ قرار أفضل." : "Share your experience and help other Murshid students make a better choice."}</p></div><div className="grid gap-6 pt-6 lg:grid-cols-[.85fr_1.15fr]"><div>{user && reviewSummary.can_review === false ? <div className="rounded-2xl border border-amber-300/15 bg-amber-300/[0.05] p-5"><h3 className="font-black text-white">{isAr ? "لا يمكن إضافة تقييم" : "Review unavailable"}</h3><p className="mt-2 text-sm font-bold leading-6 text-slate-400">{isAr ? "لا يمكن للتاجر تقييم منتجه الخاص." : "Sellers cannot review their own products."}</p></div> : user ? <form onSubmit={submitReview} className="rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.04] p-5"><h3 className="font-black text-white">{isAr ? "أضف تقييمك" : "Leave a review"}</h3><p className="mt-2 text-xs font-bold text-slate-500">{isAr ? "يمكنك تعديل تقييمك لاحقًا من خلال إرسال تقييم جديد." : "You can update your review later by submitting again."}</p><div className="mt-5"><p className="mb-2 text-xs font-black text-slate-400">{isAr ? "التقييم" : "Rating"}</p><Stars value={reviewRating} interactive onChange={setReviewRating} /></div><label className="mt-5 block text-xs font-black text-slate-400">{isAr ? "تعليقك (اختياري)" : "Your comment (optional)"}<textarea value={reviewText} onChange={(event) => setReviewText(event.target.value)} maxLength={1200} rows={5} placeholder={isAr ? "اكتب تجربتك مع المنتج..." : "Tell other students about your experience..."} className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-[#0f2034] px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/50" /></label><button disabled={submittingReview} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3.5 font-black text-slate-950 hover:bg-white disabled:opacity-60"><Send className="h-4 w-4" />{submittingReview ? (isAr ? "جاري الحفظ..." : "Saving...") : (isAr ? "إرسال التقييم" : "Submit review")}</button>{reviewMessage && <p className="mt-3 text-center text-xs font-black text-cyan-200">{reviewMessage}</p>}</form> : <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><h3 className="font-black text-white">{isAr ? "هل جربت هذا المنتج؟" : "Tried this product?"}</h3><p className="mt-2 text-sm font-bold leading-6 text-slate-400">{isAr ? "سجّل الدخول لإضافة تقييم ومساعدة بقية الطلاب." : "Sign in to leave a rating and help other students."}</p><Link to="/auth" className="mt-5 inline-flex items-center justify-center rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950">{isAr ? "تسجيل الدخول" : "Sign in"}</Link></div>}</div><div className="space-y-3">{reviewSummary.reviews.length === 0 ? <div className="flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-white/10 text-center text-xs font-bold text-slate-500">{isAr ? "لا توجد تقييمات بعد. كن أول من يقيّم هذا المنتج." : "No reviews yet. Be the first to review this product."}</div> : reviewSummary.reviews.map((review) => <article key={review.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-300/10 text-xs font-black text-cyan-200">م</div><div><p className="text-sm font-black text-slate-200">{review.reviewer_label || (isAr ? "طالب مرشد" : "Murshid student")}</p><p className="text-[11px] font-bold text-slate-500">{new Date(review.created_at).toLocaleDateString(isAr ? "ar-JO" : "en-US")}</p></div></div><Stars value={Number(review.rating)} /></div>{review.review_text && <p className="mt-4 whitespace-pre-line text-sm font-bold leading-7 text-slate-400">{review.review_text}</p>}</article>)}</div></div></section>
  </main>;
}

function Stars({ value, interactive = false, onChange }: { value: number; interactive?: boolean; onChange?: (value: number) => void }) {
  const roundedValue = Math.max(0, Math.min(5, Math.round(value)));
  return <div className="flex items-center gap-1" aria-label={`${roundedValue} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((star) => {
      const icon = <Star className={cn("h-5 w-5", star <= roundedValue ? "fill-amber-300 text-amber-300" : "text-slate-600")} />;
      return interactive ? <button key={star} type="button" onClick={() => onChange?.(star)} className="rounded-lg p-0.5 transition-transform hover:scale-110" aria-label={`Rate ${star} out of 5`}>{icon}</button> : <span key={star}>{icon}</span>;
    })}
  </div>;
}
