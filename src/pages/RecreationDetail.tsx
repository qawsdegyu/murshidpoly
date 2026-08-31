import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { m, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, MapPin, Clock, Phone, Navigation, ImagePlus,
  UtensilsCrossed, Coffee, Dumbbell, ListOrdered, Edit, Trash2, 
  ShieldAlert, Search, ChevronLeft, ChevronRight, HelpCircle, Store, Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  recCategoriesMeta,
  priceLevelLabel,
  recPlaces,
  type RecCategory,
} from "@/data/recreation";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import { isUserAdmin } from "@/lib/admin";
import { toast } from "sonner";
import { getOptimizedStorageUrl } from "@/lib/utils";
import React, { useState, useEffect, useMemo, memo } from "react";
import BrandedLoader from "@/components/BrandedLoader";

const iconMap: Record<string, any> = { 
  UtensilsCrossed, 
  Coffee, 
  Dumbbell, 
  Store, 
  Trophy,
  MapPin,
  Clock,
  Phone,
  Navigation,
  ImagePlus,
  ListOrdered,
  Edit,
  Trash2,
  ShieldAlert,
  Search,
  ChevronLeft,
  ChevronRight,
  HelpCircle
};

const LucideIcon = memo(({ name, ...props }: { name: string; [key: string]: any }) => {
  const Icon = iconMap[name] || iconMap[name?.charAt(0).toUpperCase() + name?.slice(1)] || HelpCircle;
  return <Icon {...props} />;
});

const MenuItem = memo(React.forwardRef<HTMLDivElement, { item: any; lang: string; categoryLabels: any }>(
  ({ item, lang, categoryLabels }, ref) => (
    <m.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="flex items-center justify-between gap-4 py-4 px-2 hover:bg-accent/5 rounded-xl transition-colors group border-b border-border/40 last:border-0"
    >
      <div className="flex-1 min-w-0">
        <span className="text-base sm:text-lg font-bold text-foreground block truncate">
          {lang === "ar" ? (item.nameAr || item.name) : (item.name || item.nameAr)}
        </span>
        {item.category && (
          <span className="text-[10px] font-black uppercase tracking-widest text-accent/60">
            {categoryLabels[item.category] || item.category}
          </span>
        )}
      </div>
      <span className="text-base sm:text-lg font-black text-accent tabular-nums shrink-0 bg-accent/5 px-3 py-1.5 rounded-xl border border-accent/10" dir="ltr">
        {Number(item?.price || 0).toFixed(2)} {lang === "ar" ? "د.أ" : "JOD"}
      </span>
    </m.div>
  )
));

MenuItem.displayName = "MenuItem";

export default function RecreationDetail() {
  const { category, placeId } = useParams();
  const nav = useNavigate();
  const location = useLocation();
  const { lang, dir } = usePreferences();
  const { user } = useAuth();

  const handleBack = () => {
    if (window.history.length > 1) {
      nav(-1);
    } else {
      nav(place?.category ? `/recreation/${place.category}` : "/recreation");
    }
  };
  const isAdmin = isUserAdmin(user?.email);

  const [place, setPlace] = useState<any>(location.state?.place || null);
  const [isLoading, setIsLoading] = useState(!location.state?.place);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenuCategory, setActiveMenuCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    let active = true;

    async function fetchPlace() {
      try {
        if (!location.state?.place) {
          setIsLoading(true);
        }
        
        const { data, error } = await supabase
          .from("recreation_places")
          .select("*")
          .eq("id", placeId)
          .single();

        if (!active) return;

        if (error) throw error;

        if (data) {
          setPlace({
            id: data.id,
            category: data.category,
            name: data.name_en,
            nameAr: data.name_ar,
            description: data.description_en,
            descriptionAr: data.description_ar,
            distance: data.distance_en,
            distanceAr: data.distance_ar,
            priceLevel: data.price_level,
            phone: data.phone,
            mapsUrl: data.map_url,
            imageUrl: data.image_url,
            iconName: data.icon_name,
            menu: data.menu || []
          });
        } else {
          setPlace(null);
        }
      } catch (err) {
        if (active) {
          console.error("Error fetching place:", err);
          setPlace(null);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    if (placeId) fetchPlace();

    return () => {
      active = false;
    };
  }, [placeId, category]);

  const handleDelete = async () => {
    if (!window.confirm(lang === "ar" ? "هل أنت متأكد من الحذف؟" : "Are you sure you want to delete?")) return;
    
    try {
      const { error } = await supabase
        .from("recreation_places")
        .delete()
        .eq("id", placeId);

      if (error) throw error;

      toast.success(lang === "ar" ? "تم الحذف بنجاح" : "Deleted successfully");
      nav(`/recreation/${category}`);
    } catch (err) {
      toast.error(lang === "ar" ? "فشل الحذف" : "Delete failed");
    }
  };

  // Menu logic
  const menuCategories = useMemo(() => {
    if (!Array.isArray(place?.menu)) return [];
    const cats = new Set<string>();
    place.menu.forEach((item: any) => {
      if (item?.category) cats.add(item.category);
    });
    return Array.from(cats);
  }, [place?.menu]);

  const filteredMenu = useMemo(() => {
    if (!Array.isArray(place?.menu)) return [];
    return place.menu.filter((item: any) => {
      const nameEn = String(item?.name || item?.nameAr || "").toLowerCase();
      const nameAr = String(item?.nameAr || item?.name || "").toLowerCase();
      const search = searchQuery.toLowerCase();
      const matchesSearch = nameEn.includes(search) || nameAr.includes(search);
      const matchesCat = activeMenuCategory === "all" || item?.category === activeMenuCategory;
      return matchesSearch && matchesCat;
    });
  }, [place?.menu, searchQuery, activeMenuCategory]);

  const totalPages = Math.ceil(filteredMenu.length / itemsPerPage);
  const paginatedMenu = filteredMenu.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeMenuCategory]);

  if (isLoading) {
    return <BrandedLoader />;
  }

  if (!place) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground mb-4">
          {lang === "ar" ? "المكان غير موجود." : "Place not found."}
        </p>
        <Button onClick={() => nav("/recreation")}>
          {lang === "ar" ? "رجوع" : "Back"}
        </Button>
      </div>
    );
  }

  const meta = recCategoriesMeta[place.category as RecCategory] || { gradient: "from-gray-500 to-gray-700", icon: "HelpCircle" };
  const name = lang === "ar" ? place.nameAr : place.name;
  const desc = lang === "ar" ? place.descriptionAr : place.description;
  const dist = lang === "ar" ? place.distanceAr : place.distance;
  const iconName = place.iconName || meta.icon;

  const categoryLabels: any = {
    all: lang === "ar" ? "الكل" : "All",
    sandwiches: lang === "ar" ? "ساندويشات" : "Sandwiches",
    drinks: lang === "ar" ? "مشروبات" : "Drinks",
    meals: lang === "ar" ? "وجبات" : "Meals",
    pastries: lang === "ar" ? "معجنات" : "Pastries",
    smoothies: lang === "ar" ? "سموزي" : "Smoothies",
    mojito: lang === "ar" ? "موهيتو" : "Mojito"
  };

  return (
    <m.div
      dir={dir}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="font-cairo min-h-screen bg-background w-full px-0 pt-4 md:pt-8 pb-12 overflow-x-hidden"
    >
      <div className="fixed top-28 ltr:left-6 rtl:right-6 z-50">
        <button
          onClick={handleBack}
          className="flex items-center justify-center h-12 w-12 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-xl hover:bg-accent hover:text-accent-foreground transition-all duration-300 group"
        >
          <ArrowLeft className={`h-6 w-6 transition-transform group-hover:scale-110 ${dir === "rtl" ? "rotate-180" : ""}`} />
        </button>
      </div>

      

      

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-foreground tracking-tighter leading-tight font-['Cairo']">
              {name}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10 text-accent border border-accent/20 font-black text-sm md:text-base">
                <Clock className="h-4 w-4 md:h-5 md:w-5" /> {dist}
              </span>
              <span className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-secondary/20 text-foreground font-black text-sm md:text-base tabular-nums">
                {priceLevelLabel(place.priceLevel)}
              </span>
            </div>
          </div>
          <p className="text-xs sm:text-sm md:text-base leading-relaxed text-muted-foreground font-medium max-w-4xl opacity-90">{desc}</p>
        </m.div>

      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
        <m.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="order-2 lg:order-1 lg:col-span-2 space-y-6"
        >
          <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <h2 className="text-lg sm:text-xl md:text-2xl font-black flex items-center gap-2 text-foreground">
                <ListOrdered className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                {lang === "ar" ? "القائمة والأسعار" : "Menu & Prices"}
              </h2>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder={lang === "ar" ? "بحث في القائمة..." : "Search menu..."}
                  className="pl-10 h-10 rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Category Tabs */}
            {menuCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                <button
                  onClick={() => setActiveMenuCategory("all")}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${activeMenuCategory === "all" ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/20' : 'bg-surface hover:bg-border/50 text-muted-foreground'}`}
                >
                  {categoryLabels.all}
                </button>
                {menuCategories.map((cat: string) => (
                  <button
                    key={cat}
                    onClick={() => setActiveMenuCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${activeMenuCategory === cat ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/20' : 'bg-surface hover:bg-border/50 text-muted-foreground'}`}
                  >
                    {categoryLabels[cat] || cat}
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-1">
              <AnimatePresence mode="popLayout">
                {paginatedMenu.length > 0 ? (
                  paginatedMenu.map((item: any, i: number) => (
                    <MenuItem 
                      key={item.name + i} 
                      item={item} 
                      lang={lang} 
                      categoryLabels={categoryLabels} 
                    />
                  ))
                ) : (
                  <div className="py-12 text-center text-muted-foreground font-bold">
                    {lang === "ar" ? "لا توجد نتائج بحث" : "No results found"}
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-10 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="rounded-xl"
                >
                  <ChevronLeft className={`h-4 w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                </Button>
                <span className="text-sm font-black text-foreground">
                  {lang === "ar" ? `صفحة ${currentPage} من ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="rounded-xl"
                >
                  <ChevronRight className={`h-4 w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                </Button>
              </div>
            )}
          </div>
        </m.section>

                <div className="order-1 lg:order-2 flex flex-col gap-6 self-start">
          <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl overflow-hidden shadow-md border-2 border-accent/20 aspect-video lg:aspect-square w-full relative group"
          >
            {place.imageUrl ? (
              <img 
                src={getOptimizedStorageUrl(place.imageUrl, 800, 800)} 
                alt={name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${meta.gradient}`} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            <div className={`absolute bottom-4 ltr:left-4 rtl:right-4 h-12 w-12 rounded-xl bg-white/20 backdrop-blur-md grid place-items-center text-white shadow-lg border border-white/30`}>
              <LucideIcon name={iconName} className="h-6 w-6" strokeWidth={1.5} />
            </div>
          </m.div>

          <m.aside
          initial={{ opacity: 0, x: dir === "rtl" ? -16 : 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-card rounded-2xl p-5 sm:p-6 border-2 border-accent/20 space-y-4 shadow-sm"
        >
          <h2 className="text-sm sm:text-base uppercase tracking-wider font-black text-muted-foreground mb-3">
            {lang === "ar" ? "تواصل وموقع" : "Contact & Location"}
          </h2>

          {place.phone && place.phone !== "N/A" && (
            <Button
              asChild
              className="w-full h-12 sm:h-14 bg-accent hover:bg-accent/90 text-accent-foreground font-black text-base sm:text-lg shadow-lg shadow-accent/20 transition-all rounded-xl"
            >
              <a href={`tel:${place.phone}`} className="flex items-center justify-center">
                <Phone className="h-5 w-5 sm:h-6 sm:w-6 mx-2" />
                <span dir="ltr" className="tabular-nums tracking-wider">
                  {place.phone}
                </span>
              </a>
            </Button>
          )}

          <Button
            asChild
            variant="outline"
            className="w-full h-12 sm:h-14 border-2 border-accent/30 hover:border-accent hover:bg-accent/10 text-foreground font-bold text-sm sm:text-base transition-all rounded-xl"
          >
            <a href={place.mapsUrl || place.mapUrl || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
              <Navigation className="h-4 w-4 sm:h-5 sm:w-5 mx-2 text-accent" />
              {lang === "ar" ? "الاتجاهات على Google Maps" : "Directions on Google Maps"}
            </a>
          </Button>

          <div className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-muted-foreground pt-4 border-t border-border mt-2">
            <MapPin className="h-5 w-5 text-accent shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              {lang === "ar"
                ? "بالقرب من كلية الهندسة التكنولوجية (البوليتكنك)، ماركا – عمّان، الأردن."
                : "Near the Faculty of Engineering Technology (Polytechnic), Marka – Amman, Jordan."}
            </span>
          </div>
        </m.aside>
        </div>
        </div>
      </div>
    </m.div>
  );
}
