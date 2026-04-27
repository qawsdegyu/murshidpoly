import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, MapPin, Clock, UtensilsCrossed, Coffee, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  recCategoriesMeta,
  recPlaces,
  priceLevelLabel,
  type RecCategory,
} from "@/data/recreation";
import { usePreferences } from "@/contexts/PreferencesContext";

const iconMap = { UtensilsCrossed, Coffee, Dumbbell };
const validCats: RecCategory[] = ["restaurants", "cafes", "sports"];

export default function RecreationCategory() {
  const { category } = useParams();
  const nav = useNavigate();
  const { lang, dir } = usePreferences();

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
  const Icon = iconMap[meta.icon];

  // Filter + sort by distance keyword (walk before drive, then numeric prefix)
  const places = recPlaces
    .filter(p => p.category === cat)
    .sort((a, b) => {
      const score = (s: string) => {
        const n = parseInt(s, 10) || 99;
        return n + (s.includes("walk") || s.includes("مشياً") ? 0 : 100);
      };
      return score(a.distance) - score(b.distance);
    });

  return (
    <div className="font-cairo">
      <Link
        to="/recreation"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent mb-6 transition-colors"
      >
        <ArrowLeft className={`h-4 w-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
        {lang === "ar" ? "كل الفئات" : "All categories"}
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${meta.gradient} grid place-items-center shadow-gold ring-2 ring-white/15`}>
          <Icon className="h-7 w-7 text-white" strokeWidth={1.6} />
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gold tracking-tight">
            {lang === "ar" ? meta.labelAr : meta.label}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {lang === "ar" ? meta.blurbAr : meta.blurb}
          </p>
        </div>
      </div>

      {/* Listing */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {places.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.35 }}
          >
            <Link
              to={`/recreation/${cat}/${p.id}`}
              className="group block glass rounded-2xl p-5 border border-border hover:border-accent/60 hover:-translate-y-0.5 hover:shadow-elegant transition-all h-full"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-bold text-base group-hover:text-accent transition-colors">
                  {lang === "ar" ? p.nameAr : p.name}
                </h3>
                <span className="text-xs font-extrabold text-accent bg-accent/10 px-2 py-0.5 rounded-md border border-accent/30 tabular-nums">
                  {priceLevelLabel(p.priceLevel)}
                </span>
              </div>

              <p className="text-xs text-foreground/75 leading-relaxed line-clamp-2 mb-4">
                {lang === "ar" ? p.descriptionAr : p.description}
              </p>

              <div className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 text-accent" />
                  {lang === "ar" ? p.distanceAr : p.distance}
                </span>
                <span className="inline-flex items-center gap-1 text-accent font-bold group-hover:gap-2 transition-all">
                  <MapPin className="h-3.5 w-3.5" />
                  <ArrowRight className={`h-3.5 w-3.5 ${dir === "rtl" ? "rotate-180" : ""}`} />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
