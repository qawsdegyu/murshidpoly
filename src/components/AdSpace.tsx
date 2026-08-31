import { useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import { usePreferences } from "@/contexts/PreferencesContext";
import { ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface Ad {
  id: string;
  advertiser_name: string;
  banner_url: string;
  target_url: string;
  placement: "top_banner" | "sidebar" | "popup" | "vault_banner" | "majors_sidebar";
  end_date?: string;
}

interface AdSpaceProps {
  placement?: "top_banner" | "sidebar" | "vault_banner" | "majors_sidebar";
  className?: string;
}

const AdSpace = ({ placement = "top_banner", className }: AdSpaceProps) => {
  const { lang, dir } = usePreferences();
  const isAr = lang === "ar";
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const { data, error } = await supabase
          .from("ads")
          .select("*")
          .eq("placement", placement)
          .or(`end_date.is.null,end_date.gte.${new Date().toISOString().split('T')[0]}`)
          .order("created_at", { ascending: false });

        if (error) {
          // Ignore silently if table doesn't exist yet
          if (error.code !== 'PGRST205') {
            console.error("Error fetching ads:", error);
          }
          return;
        }
        setAds(data || []);
      } catch (error: any) {
        if (error?.code !== 'PGRST205') {
          console.error("Error fetching ads:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    // Defer DB fetch by 800ms when system is idle to completely unlock the initial critical path
    const timer = setTimeout(() => {
      if (typeof window !== "undefined" && "requestIdleCallback" in window) {
        window.requestIdleCallback(() => fetchAds());
      } else {
        fetchAds();
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [placement]);

  // Rotation logic if multiple ads exist
  useEffect(() => {
    if (ads.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [ads.length]);

  if (loading) return null;

  const currentAd = ads[currentIndex];

  if (!currentAd) {
    return null;
  }

  return (
    <section className={cn("w-full overflow-hidden py-6", className)}>
      <div className="max-w-[1440px] mx-auto flex justify-center">
        <AnimatePresence mode="wait">
          <m.a
            key={currentAd.id}
            href={currentAd.target_url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="w-[95%] md:w-[85%] relative group block aspect-[21/9] md:aspect-[5/1] rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10"
          >
            <img 
              src={currentAd.banner_url} 
              alt={currentAd.advertiser_name}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
            
            <div className="absolute bottom-4 ltr:left-6 rtl:right-6 flex flex-col items-start">
              <span className="text-[10px] md:text-xs font-black text-white/70 uppercase tracking-[0.2em] mb-1">
                {isAr ? "إعلان برعاية" : "Sponsored By"}
              </span>
              <h4 className="text-lg md:text-2xl font-black text-white tracking-tight">
                {currentAd.advertiser_name}
              </h4>
            </div>

            <div className="absolute top-4 ltr:right-6 rtl:left-6">
              <div className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
              </div>
            </div>
          </m.a>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default AdSpace;
