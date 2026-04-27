import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, MapPin, Clock, Phone, Navigation, ImagePlus,
  UtensilsCrossed, Coffee, Dumbbell, ListOrdered,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  recCategoriesMeta,
  recPlaces,
  priceLevelLabel,
  type RecCategory,
} from "@/data/recreation";
import { usePreferences } from "@/contexts/PreferencesContext";

const iconMap = { UtensilsCrossed, Coffee, Dumbbell };

export default function RecreationDetail() {
  const { category, placeId } = useParams();
  const nav = useNavigate();
  const { lang, dir } = usePreferences();

  const place = recPlaces.find(p => p.id === placeId && p.category === category);
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

  const meta = recCategoriesMeta[place.category as RecCategory];
  const Icon = iconMap[meta.icon];
  const name = lang === "ar" ? place.nameAr : place.name;
  const desc = lang === "ar" ? place.descriptionAr : place.description;
  const dist = lang === "ar" ? place.distanceAr : place.distance;

  return (
    <div className="font-cairo">
      <Link
        to={`/recreation/${place.category}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent mb-6 transition-colors"
      >
        <ArrowLeft className={`h-4 w-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
        {lang === "ar" ? meta.labelAr : meta.label}
      </Link>

      {/* HERO */}
      <motion.section
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden shadow-elegant mb-6 border border-border"
      >
        {place.imageUrl ? (
          <img src={place.imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className={`relative w-full h-full bg-gradient-to-br ${meta.gradient}`}>
            <div
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.35) 1px, transparent 1px)`,
                backgroundSize: "40px 40px",
              }}
            />
            <div className="relative z-10 h-full grid place-items-center">
              <div className="text-center">
                <div className="mx-auto h-16 w-16 rounded-2xl bg-white/15 backdrop-blur-md grid place-items-center border border-white/30 shadow-elegant mb-2">
                  <ImagePlus className="h-8 w-8 text-white" strokeWidth={1.5} />
                </div>
                <div className="text-white font-bold drop-shadow">
                  {lang === "ar" ? "أضف صورة المكان" : "Place image placeholder"}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent pointer-events-none" />
        <div className={`absolute top-4 ltr:left-4 rtl:right-4 h-12 w-12 rounded-xl bg-gradient-to-br ${meta.gradient} grid place-items-center text-white shadow-gold ring-2 ring-white/20`}>
          <Icon className="h-6 w-6" strokeWidth={1.6} />
        </div>
      </motion.section>

      {/* TITLE + meta */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="mb-6"
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gold tracking-tight mb-3">
          {name}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/60 text-foreground/85">
            <Clock className="h-3.5 w-3.5 text-accent" /> {dist}
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/30 font-extrabold tabular-nums">
            {priceLevelLabel(place.priceLevel)}
          </span>
        </div>
        <p className="mt-4 text-base leading-[1.85] text-foreground/90 max-w-3xl">{desc}</p>
      </motion.div>

      {/* CONTENT GRID */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Menu / Services */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="lg:col-span-2 glass rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold flex items-center gap-2 mb-5">
            <ListOrdered className="h-5 w-5 text-accent" />
            {lang === "ar" ? "القائمة والأسعار" : "Menu & Prices"}
          </h2>
          <ul className="divide-y divide-border/60">
            {place.menu.map((item, i) => (
              <motion.li
                key={item.name}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.04 }}
                className="flex items-center justify-between gap-4 py-3"
              >
                <span className="text-sm md:text-base text-foreground/90 flex-1 min-w-0">
                  {lang === "ar" ? item.nameAr : item.name}
                </span>
                <span className="text-sm md:text-base font-extrabold text-gold tabular-nums shrink-0" dir="ltr">
                  {item.price.toFixed(2)} {lang === "ar" ? "د.أ" : "JOD"}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.section>

        {/* Quick contact + Maps */}
        <motion.aside
          initial={{ opacity: 0, x: dir === "rtl" ? -16 : 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="glass-strong rounded-2xl p-6 self-start border-2 border-accent/20 space-y-3"
        >
          <h2 className="text-sm uppercase tracking-wider font-bold text-muted-foreground mb-2">
            {lang === "ar" ? "تواصل وموقع" : "Contact & Location"}
          </h2>

          <Button
            asChild
            className="w-full h-12 gradient-gold text-primary font-extrabold hover:opacity-90 shadow-gold"
          >
            <a href={`tel:${place.phone}`}>
              <Phone className="h-4 w-4" />
              <span dir="ltr" className="tabular-nums">
                {place.phone}
              </span>
            </a>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full h-12 border-accent/40 hover:border-accent hover:text-accent"
          >
            <a href={place.mapsUrl} target="_blank" rel="noopener noreferrer">
              <Navigation className="h-4 w-4" />
              {lang === "ar" ? "الاتجاهات على Google Maps" : "Directions on Google Maps"}
            </a>
          </Button>

          <div className="flex items-start gap-2 text-xs text-muted-foreground pt-2 border-t border-border/60">
            <MapPin className="h-4 w-4 text-accent shrink-0 mt-0.5" />
            <span>
              {lang === "ar"
                ? "بالقرب من كلية الهندسة التكنولوجية (البوليتكنك)، ماركا – عمّان، الأردن."
                : "Near the Faculty of Engineering Technology (Polytechnic), Marka – Amman, Jordan."}
            </span>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
