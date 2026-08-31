import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePreferences } from "@/contexts/PreferencesContext";
import { X, ExternalLink, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Ad {
  id: string;
  advertiser_name: string;
  banner_url: string;
  target_url: string;
  placement: string;
}

const PopupAd = () => {
  const { lang } = usePreferences();
  const isAr = lang === "ar";
  const [ad, setAd] = useState<Ad | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchPopupAd = async () => {
      // Check if already shown in this session
      const shown = sessionStorage.getItem("murshid_popup_shown");
      if (shown) return;

      try {
        const { data, error } = await supabase
          .from("ads")
          .select("*")
          .eq("placement", "popup")
          .or(`end_date.is.null,end_date.gte.${new Date().toISOString().split('T')[0]}`)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data) {
          setAd(data);
          // Small delay before showing
          setTimeout(() => setIsOpen(true), 2000);
          sessionStorage.setItem("murshid_popup_shown", "true");
        }
      } catch (error) {
        console.error("Error fetching popup ad:", error);
      }
    };

    fetchPopupAd();
  }, []);

  if (!ad) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-card rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border border-white/10"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Ad Content */}
            <a 
              href={ad.target_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group block relative"
            >
              <div className="aspect-[4/5] md:aspect-square overflow-hidden">
                <img 
                  src={ad.banner_url} 
                  alt={ad.advertiser_name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span className="text-[10px] md:text-xs font-black text-white/70 uppercase tracking-widest">
                    {isAr ? "إعلان خاص" : "Featured Advertisement"}
                  </span>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-black text-white mb-4 tracking-tight">
                  {ad.advertiser_name}
                </h3>

                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-black text-sm transition-transform group-hover:scale-105 active:scale-95">
                  {isAr ? "اكتشف الآن" : "Explore Now"}
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>
            </a>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PopupAd;
