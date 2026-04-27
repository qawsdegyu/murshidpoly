import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, UtensilsCrossed, Coffee, Dumbbell, MapPin } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { recCategoriesMeta, recPlaces, type RecCategory } from "@/data/recreation";
import { usePreferences } from "@/contexts/PreferencesContext";

const iconMap = { UtensilsCrossed, Coffee, Dumbbell };

export default function Recreation() {
  const { lang, dir, t } = usePreferences();

  const cats: RecCategory[] = ["restaurants", "cafes", "sports"];

  return (
    <motion.div
      dir={dir}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="font-cairo min-h-screen bg-background"
    >
      <PageHeader
        title={t.recreation.title}
        subtitle={t.recreation.subtitle}
        icon={<Sparkles className="h-6 w-6" />}
      />

      <div className="grid md:grid-cols-3 gap-5">
        {cats.map((c, i) => {
          const meta = recCategoriesMeta[c];
          const Icon = iconMap[meta.icon];
          const count = recPlaces.filter(p => p.category === c).length;
          return (
            <motion.div
              key={c}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4, ease: "easeOut" }}
            >
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
                  <div className="absolute -top-6 ltr:-right-6 rtl:-left-6 h-24 w-24 rounded-full bg-white/15 backdrop-blur-md grid place-items-center border border-white/20 shadow-elegant">
                    <Icon className="h-9 w-9 text-white" strokeWidth={1.6} />
                  </div>
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
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
