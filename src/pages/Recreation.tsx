import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, UtensilsCrossed, Coffee, Dumbbell, MapPin, Store, Trophy } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { recCategoriesMeta, type RecCategory } from "@/data/recreation";
import { usePreferences } from "@/contexts/PreferencesContext";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

import BrandedLoader from "@/components/BrandedLoader";

const iconMap: Record<string, any> = { UtensilsCrossed, Coffee, Dumbbell, Store, Trophy };

export default function Recreation() {
  const { lang, dir, t } = usePreferences();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  const cats: RecCategory[] = ["restaurants_inside", "restaurants_outside", "cafes"];

  useEffect(() => {
    let active = true;

    async function fetchCounts() {
      try {
        const { data, error } = await supabase
          .from("recreation_places")
          .select("category");
        
        if (!active) return;

        if (!error && data) {
          const countsObj: Record<string, number> = {};
          data.forEach(p => {
            countsObj[p.category] = (countsObj[p.category] || 0) + 1;
          });
          setCounts(countsObj);
        }
      } catch (err) {
        console.error("Error fetching recreation counts:", err);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }
    fetchCounts();

    return () => {
      active = false;
    };
  }, []);

  if (isLoading) {
    return <BrandedLoader />;
  }

  return (
    <div dir={dir} className="font-cairo min-h-screen bg-background animate-in fade-in duration-500">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 pt-28 pb-10">
        <PageHeader
          title={t.recreation.title}
          subtitle={t.recreation.subtitle}
          icon={<Sparkles className="h-6 w-6" />}
        />

        <div className="grid md:grid-cols-3 gap-5">
          {cats.map((c, i) => {
            const meta = recCategoriesMeta[c];
            const Icon = iconMap[meta.icon];
            const count = counts[c] || 0;
            return (
              <div key={c} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 100}ms`, animationFillMode: "both" }}>
                <Link
                  to={`/recreation/${c}`}
                  className="group relative block overflow-hidden rounded-2xl glass-strong border border-accent/20 hover:border-accent/60 hover:-translate-y-1 hover:shadow-gold transition-all duration-300 h-full"
                >
                  {/* Gradient banner */}
                  <div className={`relative h-36 bg-gradient-to-br ${meta.gradient} overflow-hidden`}>
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)`,
                        backgroundSize: "28px 28px",
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
                    <div className="absolute bottom-3 ltr:left-4 rtl:right-4 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-white/90 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
                      <MapPin className="h-3 w-3" />
                      {count} {lang === "ar" ? "أماكن" : "places"}
                    </div>
                    {Icon && (
                      <div className="absolute -top-6 ltr:-right-6 rtl:-left-6 h-24 w-24 rounded-full bg-white/15 backdrop-blur-md grid place-items-center border border-white/20 shadow-elegant">
                        <Icon className="h-9 w-9 text-white" strokeWidth={1.6} />
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg md:text-xl font-extrabold text-gold mb-1.5">
                      {lang === "ar" ? meta.labelAr : meta.label}
                    </h3>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {lang === "ar" ? meta.blurbAr : meta.blurb}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-accent group-hover:gap-2.5 transition-all">
                      {lang === "ar" ? "استكشف" : "Explore"}
                      <ArrowRight className={`h-4 w-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
