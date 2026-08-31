import React, { useState, useMemo, useEffect, forwardRef } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Navigation, Building2, ExternalLink, Search, X,
  CheckCircle2, ChevronDown, ChevronUp, Layers, User2, FlaskConical, DoorOpen,
  Map as MapIcon, Users, GraduationCap
, ChevronRight } from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";
import PageHeader from "@/components/PageHeader";
import { cn, getOptimizedStorageUrl } from "@/lib/utils";
import BrandedLoader from "@/components/BrandedLoader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


import { Dialog, DialogContent } from "@/components/ui/dialog";

import { type Building, type BuildingFloor, type BuildingWing, type BuildingItem } from "@/data/buildings";

export default function BuildingsPage() {
  const { lang, dir } = usePreferences();
  const [searchParams] = useSearchParams();
  const ar = lang === "ar";
  const [searchQuery, setSearchQuery] = useState("");
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

  useEffect(() => {
    async function fetchBuildings() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("buildings")
          .select("*")
          .order("id", { ascending: true });

        if (error) throw error;

        if (!data || data.length === 0) {
          const { buildings: localData } = await import("@/data/buildings");
          setBuildings(localData);
        } else {
          // Map snake_case to camelCase
          const mapped = data.map(b => ({
            ...b,
            nameAr: b.name_ar || b.nameAr || "",
            nameEn: b.name_en || b.nameEn || "",
            descAr: b.desc_ar || b.descAr || "",
            descEn: b.desc_en || b.descEn || "",
            imageUrl: b.image_url || b.imageUrl || "",
            mapUrl: b.map_url || b.mapUrl || "",
            tag: b.tag_ar || b.tag || "",
            tagEn: b.tag_en || b.tagEn || "",
            tags: b.tags || [],
            floors: b.floors || []
          }));
          setBuildings(mapped);
        }
      } catch (err) {
        console.error("Error fetching buildings:", err);
        // Fallback
        try {
          const { buildings: localData } = await import("@/data/buildings");
          setBuildings(localData);
        } catch (e) { }
      } finally {
        setIsLoading(false);
      }
    }
    fetchBuildings();
  }, []);

  useEffect(() => {
    const buildingId = searchParams.get("id");
    if (buildingId && buildings.length > 0) {
      const b = buildings.find(b => b.id.toString() === buildingId);
      if (b) setSelectedBuilding(b);
    }
  }, [searchParams, buildings]);

const filteredBuildings = useMemo(() => {
    // Sort buildings list in ascending order based on their numbers/IDs
    const sortedBuildings = [...buildings].sort((a, b) => (a.id || 0) - (b.id || 0));

    if (!searchQuery.trim()) return sortedBuildings;
    const query = searchQuery.toLowerCase();

    return sortedBuildings.filter(b =>
      (b.nameAr || "").toLowerCase().includes(query) ||
      (b.nameEn || "").toLowerCase().includes(query) ||
      (b.descAr || "").toLowerCase().includes(query) ||
      (b.descEn || "").toLowerCase().includes(query) ||
      (b.tags || []).some(t => (t || "").toLowerCase().includes(query)) ||
      (b.id || "").toString() === query ||
      (b.floors || []).some(f =>
        ((f as any).wings || (f as any).sections || []).some((w: any) =>
          (w.items || []).some((item: any) =>
            (item.nameAr || "").toLowerCase().includes(query) ||
            (item.nameEn || "").toLowerCase().includes(query)
          )
        )
      )
    );
  }, [searchQuery, buildings]);

  if (isLoading) {
    return <BrandedLoader />;
  }

  return (
    <>
      <motion.div
        dir={dir}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="min-h-screen pb-24 pointer-events-none"
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-0 pointer-events-auto transition-all duration-700">

          <PageHeader
            title={ar ? "مواقع المباني" : "Campus Map"}
            subtitle={ar
              ? "دليل شامل لمباني الحرم الجامعي — ابحث عن القاعات أو المكاتب أو الدكاترة."
              : "Complete guide to BAU campus buildings — search for rooms, offices, or doctors."}
            icon={<Building2 className="w-6 h-6 md:w-12 md:h-12 text-primary dark:text-accent" />}
            className="mb-6 md:mb-16"
          />

                    <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-10"
          >
            <div className="max-w-3xl mx-auto px-4">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-4 rtl:left-auto rtl:right-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={ar ? "ابحث عن قاعة، دكتور، قسم..." : "Search for a room, doctor, dept..."}
                        className="w-full pl-12 rtl:pl-0 rtl:pr-12 py-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-neutral-200 dark:border-white/10 outline-none transition-all font-bold text-sm shadow-sm focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div className="container mx-auto px-4 max-w-7xl">
                    {filteredBuildings.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {filteredBuildings.map((building, idx) => (
                          <BuildingCard
                            key={building.id}
                            building={building}
                            idx={idx}
                            ar={ar}
                            onClick={() => setSelectedBuilding(building)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-20">
                        <div className="w-20 h-20 bg-muted/10 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Search className="w-10 h-10 text-muted-foreground opacity-20" />
                        </div>
                        <h3 className="text-2xl font-black text-muted-foreground">
                          {ar ? "لا توجد نتائج مطابقة" : "No results found"}
                        </h3>
                        <p className="text-sm text-muted-foreground/60 mt-2 font-bold">
                          {ar ? "جرب البحث بكلمة أخرى أو رمز مبنى مختلف" : "Try searching for a different room or building code"}
                        </p>
                      </div>
                    )}
                  </div>
                
          </motion.div>

          <Dialog open={!!selectedBuilding} onOpenChange={(open) => !open && setSelectedBuilding(null)}>
            <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] overflow-y-auto custom-scrollbar p-3 md:p-10 border border-border bg-background rounded-3xl md:rounded-[3rem] shadow-2xl">
              {selectedBuilding && (
                <div className="space-y-4 md:space-y-8" dir={dir}>
                  {/* The custom close button was removed as Radix provides one by default */}

                  {/* Building Hero and Content */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left/Main Column: Image and Map */}
                    <div className="lg:col-span-5 space-y-4 md:space-y-6">
                      <div className="relative aspect-[4/3] rounded-3xl md:rounded-[2.5rem] overflow-hidden border border-border shadow-xl group">
                        <img 
                          src={getOptimizedUrl(selectedBuilding.imageUrl)} 
                          width={600}
                          height={450}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                          alt={selectedBuilding.nameEn} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        {/* Floating ID Badge Inside Image */}
                        <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 h-12 w-12 rounded-xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white font-black shadow-lg z-10 text-xl">
                          {selectedBuilding.id}
                        </div>
                      </div>
                      
                      

                    </div>

                    {/* Right/Detail Column: Floors and Wings */}
                    <div className="lg:col-span-7 space-y-4 md:space-y-6">
                      <div className="p-4 md:p-8 rounded-3xl md:rounded-[2.5rem] bg-surface/50 border border-border backdrop-blur-xl shadow-elegant">
                        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-8">
                          <Layers className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                          <h3 className="text-xl md:text-2xl font-black text-foreground tracking-tight">{ar ? "مرافق المبنى" : "Building Facilities"}</h3>
                        </div>

                        <Accordion type="single" collapsible className="space-y-2 md:space-y-4">
                          {[...selectedBuilding.floors].reverse().map((floor, revIdx) => {
                            const fIdx = selectedBuilding.floors.length - 1 - revIdx;
                            return (
                            <AccordionItem 
                              key={fIdx} 
                              value={`floor-${fIdx}`}
                              className="border-none bg-background/40 rounded-2xl overflow-hidden shadow-sm border border-border/50"
                            >
                              <AccordionTrigger className="px-4 py-3 md:px-6 md:py-5 hover:no-underline hover:bg-surface/50 transition-all">
                                <div className="flex items-center gap-3 md:gap-4">
                                  <div className="w-8 h-8 md:w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-[10px] md:text-xs">
                                    {fIdx}
                                  </div>
                                  <span className="text-base md:text-lg font-black text-foreground">
                                    {(() => {
                                      const f = floor as any;
                                      // Priority 1: Admin CMS saves name in 'name' field
                                      if (f.name) return f.name;
                                      // Priority 2: Legacy local data format
                                      if (ar && f.levelAr) return f.levelAr;
                                      if (!ar && f.levelEn) return f.levelEn;
                                      // Priority 3: Smart Arabic fallback based on index
                                      const arNames = ["الطابق الأرضي", "الطابق الأول", "الطابق الثاني", "الطابق الثالث", "الطابق الرابع", "الطابق الخامس"];
                                      return ar ? (arNames[fIdx] || `الطابق رقم ${fIdx}`) : `Floor ${fIdx}`;
                                    })()}
                                  </span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="px-6 pb-6">
                                <div className="space-y-6 pt-4">
                                  {/* Render Wings/Sections */}
                                  {(() => {
                                    const f = floor as any;
                                    const dynamicWings = [];
                                    if (f.right) dynamicWings.push({ titleAr: "الجهة اليمنى", titleEn: "Right Wing", content: f.right, side: 'right' });
                                    if (f.left) dynamicWings.push({ titleAr: "الجهة اليسرى", titleEn: "Left Wing", content: f.left, side: 'left' });
                                    
                                    const legacyWings = f.wings || f.sections || [];

                                    if (dynamicWings.length > 0) {
                                      return dynamicWings.map((wing, wIdx) => (
                                        <div key={wIdx} className="space-y-3">
                                          <div className="flex items-center gap-2">
                                            <div className={cn("h-4 w-1 rounded-full", wing.side === 'right' ? "bg-emerald-500" : "bg-blue-500")} />
                                            <span className="text-sm font-black text-foreground/80">{ar ? wing.titleAr : wing.titleEn}</span>
                                          </div>
                                          <div className="p-4 rounded-xl bg-surface/30 border border-border/50 text-sm font-bold text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                            {wing.content}
                                          </div>
                                        </div>
                                      ));
                                    }

                                    return legacyWings.map((wing: any, wIdx: number) => (
                                      <div key={wIdx} className="space-y-4">
                                        <div className="flex items-center gap-2">
                                          <div className="h-4 w-1 rounded-full bg-primary/60" />
                                          <span className="text-sm font-black text-foreground/80">{ar ? wing.titleAr : wing.titleEn}</span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                          {(wing.items || []).map((item: any, iIdx: number) => {
                                            const isMatch = searchQuery && (
                                              (item.nameAr || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                                              (item.nameEn || "").toLowerCase().includes(searchQuery.toLowerCase())
                                            );
                                            return (
                                              <div
                                                key={iIdx}
                                                className={cn(
                                                  "flex items-center gap-3 p-4 rounded-xl border transition-all",
                                                  isMatch
                                                    ? "bg-primary/10 border-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)] scale-[1.02]"
                                                    : "bg-surface/30 border-border/50 hover:border-primary/30"
                                                )}
                                              >
                                                <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-lg border border-border/50">
                                                  {getItemIcon(item.type)}
                                                </div>
                                                <div className="flex flex-col">
                                                  <span className={cn("text-sm font-black leading-tight", isMatch ? "text-primary" : "text-foreground")}>
                                                    {ar ? item.nameAr : item.nameEn}
                                                  </span>
                                                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                                                    {item.type === 'lab' ? (ar ? 'مختبر' : 'Laboratory') :
                                                     item.type === 'office' ? (ar ? 'مكتب' : 'Office') :
                                                     item.type === 'room' ? (ar ? 'قاعة' : 'Classroom') :
                                                     item.type === 'dept' ? (ar ? 'قسم' : 'Department') : ''}
                                                  </span>
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    ));
                                  })()}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          );
                          })}
                        </Accordion>
                      </div>

                      
                    </div>
                  </div>
                
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>
    </>
  );
}

const getOptimizedUrl = (url: string) => {
  return getOptimizedStorageUrl(url, 600, 450);
};

const getItemIcon = (type: BuildingItem["type"]) => {
  switch (type) {
    case "lab": return "🧪";
    case "office": return "👨‍🏫";
    case "room": return "🚪";
    case "dept": return "🏢";
    default: return "📍";
  }
};

const BuildingCard = forwardRef<HTMLDivElement, { building: Building, idx: number, ar: boolean, onClick: () => void }>(
  ({ building, idx, ar, onClick }, ref) => {
    const [imgSrc, setImgSrc] = useState(() => getOptimizedUrl(building.imageUrl));

    useEffect(() => {
      setImgSrc(getOptimizedUrl(building.imageUrl));
    }, [building.imageUrl]);

    const fallbackImage = "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=600";

    return (
      <motion.article
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ delay: idx * 0.05, duration: 0.4 }}
        onClick={onClick}
        className="group relative flex flex-col rounded-[1rem] sm:rounded-[1.5rem] overflow-hidden border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.03] shadow-lg hover:shadow-2xl transition-all cursor-pointer h-full"
      >

        <div className="relative h-[140px] sm:h-[180px] overflow-hidden shrink-0">
          <img
            src={imgSrc || fallbackImage}
            width={600}
            height={400}
            loading={idx < 2 ? "eager" : "lazy"}
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            alt={building.nameEn}
            onError={() => {
              setImgSrc(fallbackImage);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Floating ID Badge */}
          <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 h-8 w-8 rounded-lg bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white font-black text-sm sm:top-4 sm:right-4 sm:rtl:right-auto sm:rtl:left-4 sm:h-10 sm:w-10 sm:rounded-xl sm:text-base shadow-lg">
            {building.id}
          </div>
        </div>

        <div className="p-3 sm:p-4 flex flex-col justify-between flex-1 gap-2 sm:gap-3 bg-white dark:bg-neutral-900/50 backdrop-blur-md">
          <div className="space-y-2 sm:space-y-4">
            
            <h3 className="text-[#003366] dark:text-white font-black text-base sm:text-lg md:text-xl leading-tight font-['Cairo'] tracking-tight group-hover:text-primary transition-colors navy-pop">
              {ar ? (building.nameAr || "") : (building.nameEn || "")}
            </h3>
            <p className="text-[10px] sm:text-xs text-muted-foreground font-bold line-clamp-2 leading-relaxed opacity-80">
              {ar ? building.descAr : building.descEn}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 md:pt-4 border-t border-border/50 mt-auto">
            <div className="flex items-center gap-1.5 md:gap-4 group/explore">
              <span className={cn(
                "text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#14B8A6] transition-colors"
              )}>
                {ar ? "استكشف المبنى" : "Explore Building"}
              </span>
              <ChevronRight className={cn(
                "w-3 h-3 md:w-5 md:h-5 transition-all text-[#14B8A6] group-active:translate-x-1 group-hover:translate-x-1",
                document.documentElement.dir === "rtl" ? "rotate-180 group-active:-translate-x-1 group-hover:-translate-x-1" : ""
              )} />
            </div>
          </div>
        </div>
      </motion.article>
    );
  }
);
