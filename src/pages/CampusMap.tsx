import { useState, useMemo, useEffect, useRef, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Navigation, Building2, Search, X,
  ChevronDown, Layers, User2, Microscope, ArrowRight, ArrowLeft
} from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useAuth } from "@/contexts/AuthContext";
import PageHeader from "@/components/PageHeader";
import { cn, getOptimizedStorageUrl, advancedSearchMatch } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { isUserAdmin } from "@/lib/admin";

// FORCE UPDATE v2 - NEW COMPONENT NAME
export default function CampusMap() {
  const { lang, dir } = usePreferences();
  const { user } = useAuth();
  const ar = lang === "ar";
  const [searchQuery, setSearchQuery] = useState("");
  const [buildings, setBuildings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null);
  const [activeFloorIdx, setActiveFloorIdx] = useState(-1);

  const isAdmin = isUserAdmin(user?.email);

  useEffect(() => {
    async function fetchBuildings() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.from("buildings").select("*").order("id", { ascending: true });
        if (error) throw error;
        
        const mapped = (data || []).map(b => {
          let floorsArray = [];
          try {
            let raw = b.floors;
            if (typeof raw === 'string') raw = JSON.parse(raw);
            floorsArray = Array.isArray(raw) ? raw : (raw?.floors && Array.isArray(raw.floors)) ? raw.floors : [raw].filter(Boolean);
          } catch (e) { console.error(e); }
          
          return {
            ...b,
            nameAr: b.name_ar || b.nameAr || "",
            nameEn: b.name_en || b.nameEn || "",
            descAr: b.desc_ar || b.descAr || "",
            imageUrl: b.image_url || b.imageUrl || "",
            mapUrl: b.map_url || b.mapUrl || "",
            floors: floorsArray
          };
        });
        setBuildings(mapped);
      } catch (err) { console.error(err); } finally { setIsLoading(false); }
    }
    fetchBuildings();
  }, []);

  const selectedBuilding = buildings.find(b => b.id === selectedBuildingId);
  const filteredBuildings = useMemo(() => {
    if (!searchQuery.trim()) return buildings;
    return buildings.filter(b => 
      advancedSearchMatch(searchQuery, b.nameAr, b.nameEn, b.descAr)
    );
  }, [searchQuery, buildings]);

  if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-10 h-10 border-4 border-[#ff2d86] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-black text-white font-['Tajawal']" dir={dir}>
      <div className="hidden lg:flex h-screen pt-20 overflow-hidden">
        {/* SIDEBAR */}
        <div className="w-[450px] border-e border-white/5 flex flex-col bg-neutral-950 z-20">
          <div className="p-8 space-y-6">
            <PageHeader title={ar ? "خريطة الحرم الجامعي" : "Campus Map"} icon={<Building2 className="text-[#ff2d86]" />} />
            <div className="relative">
              <Search className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={ar ? "ابحث عن مبنى..." : "Search..."}
                className="w-full ltr:pl-11 rtl:pr-11 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#ff2d86] transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-20">
            {!selectedBuildingId ? (
              <div className="space-y-3">
                {filteredBuildings.map(b => (
                  <button key={b.id} onClick={() => setSelectedBuildingId(b.id)} className="w-full p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-[#ff2d86] flex items-center gap-5 transition-all text-right rtl:flex-row ltr:flex-row-reverse group">
                    <div className="flex-1">
                      <h4 className="text-base font-black">{ar ? b.nameAr : b.nameEn}</h4>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">{ar ? "عرض التفاصيل" : "View Details"}</p>
                    </div>
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10">
                      <img 
                        src={getOptimizedStorageUrl(b.imageUrl, 150, 150)} 
                        width={64}
                        height={64}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                        alt={ar ? b.nameAr : b.nameEn}
                      />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <button onClick={() => setSelectedBuildingId(null)} className="flex items-center gap-2 text-[#ff2d86] font-black text-sm">
                  {ar ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                  {ar ? "العودة للقائمة" : "Back to list"}
                </button>
                <h2 className="text-3xl font-black text-white px-2">{ar ? selectedBuilding?.nameAr : selectedBuilding?.nameEn}</h2>
                
                {/* FLOORS LIST */}
                <div className="space-y-4">
                  {selectedBuilding?.floors.map((floor: any, fIdx: number) => (
                    <div key={fIdx} className={cn("rounded-[2rem] border transition-all duration-300", activeFloorIdx === fIdx ? "bg-white/5 border-[#ff2d86]" : "bg-white/[0.02] border-white/5")}>
                      <button onClick={() => setActiveFloorIdx(activeFloorIdx === fIdx ? -1 : fIdx)} className="w-full p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", activeFloorIdx === fIdx ? "bg-[#ff2d86] text-white" : "bg-white/5 text-white/30")}>
                            <Layers className="w-5 h-5" />
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-black text-white block">
                              {(() => {
                                const names = ["الطابق الأرضي", "الطابق الأول", "الطابق الثاني", "الطابق الثالث", "الطابق الرابع", "الطابق الخامس"];
                                return floor.name || floor.level_ar || (ar ? names[fIdx] : `Floor ${fIdx}`);
                              })()}
                            </span>
                          </div>
                        </div>
                        <ChevronDown className={cn("w-5 h-5 transition-transform", activeFloorIdx === fIdx ? "rotate-180 text-[#ff2d86]" : "text-white/20")} />
                      </button>

                      {activeFloorIdx === fIdx && (
                        <div className="p-6 pt-0 space-y-6">
                          {[
                            { label: ar ? "الجهة اليمنى" : "Right Side", data: floor.right },
                            { label: ar ? "الجهة اليسرى" : "Left Side", data: floor.left }
                          ].filter(s => s.data).map((section, sIdx) => (
                            <div key={sIdx} className="space-y-3">
                              <h5 className="text-[10px] font-black text-[#ff2d86] uppercase tracking-widest flex items-center gap-2">
                                <div className="w-1 h-3 bg-[#ff2d86] rounded-full" />
                                {section.label}
                              </h5>
                              <div className="grid grid-cols-1 gap-2">
                                {section.data.toString().split('\n').filter(Boolean).map((room: string, rIdx: number) => (
                                  <div key={rIdx} className="p-4 rounded-2xl bg-white/5 border border-white/5 text-white/80 font-bold text-sm">
                                    {room}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MAP VIEW */}
        <div className="flex-1 relative bg-neutral-900">
          <img 
            src={getOptimizedStorageUrl(selectedBuilding?.imageUrl || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f", 1200, 800)} 
            width={1200}
            height={800}
            fetchPriority={selectedBuilding ? "high" : "auto"}
            className="w-full h-full object-cover opacity-40" 
            alt={selectedBuilding ? (ar ? selectedBuilding.nameAr : selectedBuilding.nameEn) : "Campus Map"}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black via-transparent to-transparent" />
          {selectedBuilding && (
            <div className="absolute bottom-12 ltr:right-12 rtl:left-12 w-[400px] p-10 rounded-[3rem] bg-black/80 backdrop-blur-3xl border border-white/10 z-20">
              <h3 className="text-4xl font-black text-white mb-4">{ar ? selectedBuilding.nameAr : selectedBuilding.nameEn}</h3>
              <Button onClick={() => window.open(selectedBuilding.mapUrl, '_blank')} className="w-full py-7 rounded-2xl bg-[#ff2d86] text-white font-black shadow-2xl">
                <Navigation className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                {ar ? "فتح في خرائط جوجل" : "Google Maps"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
