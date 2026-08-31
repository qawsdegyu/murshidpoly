import { Link, useNavigate, useParams } from "react-router-dom";
import { m } from "framer-motion";
import { 
  ArrowLeft, ArrowRight, MapPin, Clock, UtensilsCrossed, Coffee, Dumbbell,
  HelpCircle, Settings, Edit, Store, Trophy, Plus, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  recCategoriesMeta,
  priceLevelLabel,
  recPlaces,
  type RecCategory,
} from "@/data/recreation";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useAuth } from "@/contexts/AuthContext";
import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import { isUserAdmin } from "@/lib/admin";
import { toast } from "sonner";
import { getOptimizedStorageUrl } from "@/lib/utils";
import BrandedLoader from "@/components/BrandedLoader";
import PageHeader from "@/components/PageHeader";

const iconMap: Record<string, any> = { 
  UtensilsCrossed, 
  Coffee, 
  Dumbbell, 
  Store, 
  Trophy, 
  Plus, 
  MapPin, 
  Clock, 
  Settings, 
  Edit, 
  Trash2,
  ArrowLeft,
  ArrowRight
};

const LucideIcon = ({ name, ...props }: { name: string; [key: string]: any }) => {
  const Icon = iconMap[name] || iconMap[name?.charAt(0).toUpperCase() + name?.slice(1)] || HelpCircle;
  return <Icon {...props} />;
};
const validCats: RecCategory[] = ["restaurants_inside", "restaurants_outside", "cafes", "university_life"];

export default function RecreationCategory() {
  const { category } = useParams();
  const nav = useNavigate();
  const { lang, dir } = usePreferences();
  const { user } = useAuth();

  const handleBack = () => {
    if (window.history.length > 1) {
      nav(-1);
    } else {
      nav("/recreation");
    }
  };

  const isAdmin = isUserAdmin(user?.email);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [uploadedUrls, setUploadedUrls] = useState<{ [key: string]: string }>({});

  const [places, setPlaces] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function fetchPlaces() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("recreation_places")
          .select("id, name_ar, name_en, description_ar, description_en, category, price_level, distance_ar, distance_en, image_url, map_url, icon_name, phone")
          .eq("category", category);

        if (!active) return;

        if (error) throw error;

        if (data && data.length > 0) {
          // Map snake_case to UI expectations
          const mapped = data.map(p => ({
            id: p.id,
            nameAr: p.name_ar,
            name: p.name_en,
            descriptionAr: p.description_ar || "لا يوجد وصف متاح حالياً.",
            description: p.description_en || "No description available at the moment.",
            category: p.category,
            priceLevel: p.price_level,
            distanceAr: p.distance_ar,
            distance: p.distance_en,
            imageUrl: p.image_url,
            mapUrl: p.map_url,
            iconName: p.icon_name,
            phone: p.phone
          }));
          setPlaces(mapped);
        } else {
          setPlaces([]);
        }
      } catch (err) {
        if (active) {
          console.error("Error fetching recreation places:", err);
          setPlaces([]);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }
    if (category) fetchPlaces();

    return () => {
      active = false;
    };
  }, [category]);

  const sortedPlaces = useMemo(() => {
    return [...places].sort((a, b) => {
      const score = (val: any) => {
        const s = String(val || "");
        const n = parseInt(s, 10) || 99;
        return n + (s.includes("walk") || s.includes("مشياً") ? 0 : 100);
      };
      return score(a.distance) - score(b.distance);
    });
  }, [places]);

  const handleEdit = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingItem(item);
    setUploadedUrls({
      image_url: item.imageUrl || ""
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const { error } = await supabase
        .from("recreation_places")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setPlaces(prev => prev.filter(p => p.id !== id));
      toast.success(lang === "ar" ? "تم حذف المكان بنجاح" : "Place deleted successfully");
    } catch (err) {
      toast.error(lang === "ar" ? "فشل الحذف" : "Delete failed");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const payload = {
      name_en: formData.get("name_en"),
      name_ar: formData.get("name_ar"),
      description_en: formData.get("description_en"),
      description_ar: formData.get("description_ar"),
      distance_en: formData.get("distance_en"),
      distance_ar: formData.get("distance_ar"),
      image_url: formData.get("image_url"),
      price_level: parseInt(formData.get("price_level") as string),
      category: category
    };

    try {
      if (editingItem) {
        const { error } = await supabase
          .from("recreation_places")
          .update(payload)
          .eq("id", editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("recreation_places")
          .insert([{ ...payload, id: `rec-${Date.now()}` }]);
        if (error) throw error;
      }

      toast.success(lang === "ar" ? "تم حفظ البيانات بنجاح" : "Data saved successfully");
      setIsFormOpen(false);
      setEditingItem(null);
      // Reload page or re-fetch
      window.location.reload();
    } catch (err) {
      toast.error("Error saving data");
    }
  };

  if (isLoading) {
    return <BrandedLoader />;
  }

  if (!category || !validCats.includes(category as RecCategory)) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground mb-4">
          {lang === "ar" ? "الفئة غير موجودة." : "Category not found."}
        </p>
        <Button onClick={() => nav("/recreation")}>
          {lang === "ar" ? "رجوع" : "Back"}
        </Button>
      </div>
    );
  }

  const cat = category as RecCategory;
  const meta = recCategoriesMeta[cat];

  return (
    <m.div
      dir={dir}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="font-cairo min-h-screen bg-background w-full overflow-x-hidden pb-20"
    >
                <PageHeader
            title={lang === "ar" ? meta.labelAr : meta.label}
            subtitle={lang === "ar" ? meta.blurbAr : meta.blurb}
            icon={<LucideIcon name={meta.icon} className="w-6 h-6 md:w-12 md:h-12 text-primary dark:text-accent" />}
            className="mb-4 md:mb-8"
          />

{/* Main Listing Area */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20">
        

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-[2rem] bg-surface/50" />
            ))
          ) : sortedPlaces.map((p, i) => (
            <m.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
              className="relative group/admin"
            >
              <Link
                to={`/recreation/${cat}/${p.id}`}
                state={{ place: p }}
                className="group block glass rounded-2xl overflow-hidden border border-border hover:border-accent/60 hover:-translate-y-0.5 hover:shadow-elegant transition-all h-full"
              >
                {p.imageUrl && (
                  <div className="h-40 w-full overflow-hidden relative">
                    <img 
                      src={getOptimizedStorageUrl(p.imageUrl, 400, 250)} 
                      alt={p.name} 
                      width={400}
                      height={250}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute top-3 ltr:left-3 rtl:right-3 h-8 w-8 rounded-xl bg-black/40 backdrop-blur-md grid place-items-center text-white border border-white/20">
                      <LucideIcon name={p.iconName || meta.icon} className="w-4 h-4" />
                    </div>
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-black text-lg group-hover:text-accent transition-colors">
                    {lang === "ar" ? p.nameAr : p.name}
                  </h3>
                  <span className="text-xs font-extrabold text-accent bg-accent/10 px-2 py-0.5 rounded-md border border-accent/30 tabular-nums">
                    {priceLevelLabel(p.priceLevel)}
                  </span>
                </div>

                <p className="text-sm text-foreground/75 leading-relaxed line-clamp-2 mb-4 px-5">
                  {lang === "ar" ? p.descriptionAr : p.description}
                </p>

                <div className="flex items-center justify-between text-xs p-5 pt-0 mt-auto">
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground font-bold">
                    <Clock className="h-3.5 w-3.5 text-accent" />
                    {lang === "ar" ? p.distanceAr : p.distance}
                  </span>
                  <span className="inline-flex items-center gap-1 text-accent font-black group-hover:gap-2 transition-all">
                    {lang === "ar" ? "التفاصيل" : "Details"}
                    <ArrowRight className={`h-3.5 w-3.5 ${dir === "rtl" ? "rotate-180" : ""}`} />
                  </span>
                </div>
              </Link>

              {isAdmin && (
                <div className="absolute top-2 ltr:right-2 rtl:left-2 flex gap-2 opacity-0 group-hover/admin:opacity-100 transition-opacity z-20">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 rounded-lg shadow-lg bg-white/90 backdrop-blur-sm text-blue-600 hover:text-blue-700 hover:bg-white"
                    onClick={(e) => {
                      e.preventDefault();
                      nav(`/admin?tab=restaurants&edit=${p.id}`);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8 rounded-lg shadow-lg"
                    onClick={(e) => handleDelete(e, p.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </m.div>
          ))}
        </div>
      </div>


    </m.div>
  );
}
