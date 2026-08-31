import React, { useState, useMemo, useEffect, forwardRef } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Navigation, Building2, ExternalLink, Search, X,
  CheckCircle2, ChevronDown, ChevronUp, Layers, User2, FlaskConical, DoorOpen,
  Map as MapIcon, Info, Users, GraduationCap
} from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";
import PageHeader from "@/components/PageHeader";
import { cn } from "@/lib/utils";
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
            icon={<Building2 className="w-8 h-8 md:w-12 md:h-12 text-primary dark:text-accent" />}
            className="mb-10 md:mb-16"
          />

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="max-w-3xl mx-auto mb-10 px-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 rtl:left-auto rtl:right-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={ar ? "ابحث عن قاعة، دكتور، قسم..." : "Search for a room, doctor, dept..."}
                    className="w-full pl-12 rtl:pl-0 rtl:pr-12 py-4 rounded-2xl bg-white dark:bg-white/[0.03] border border-neutral-200 dark:border-white/10 outline-none transition-all font-bold text-sm shadow-sm focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="container mx-auto px-4 py-12 max-w-7xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {filteredBuildings.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                      >
                        <div className="w-20 h-20 bg-muted/10 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Search className="w-10 h-10 text-muted-foreground opacity-20" />
                        </div>
                        <h3 className="text-2xl font-black text-muted-foreground">
                          {ar ? "لا توجد نتائج مطابقة" : "No results found"}
                        </h3>
                        <p className="text-sm text-muted-foreground/60 mt-2 font-bold">
                          {ar ? "جرب البحث بكلمة أخرى أو رمز مبنى مختلف" : "Try searching for a different room or building code"}
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </>
          )}

        </div>
      </motion.div>

      {/* Building Detail Modal */}
      <AnimatePresence mode="wait">
        {selectedBuilding && (
          <BuildingDetailModal
            building={selectedBuilding}
            isOpen={!!selectedBuilding}
            onClose={() => setSelectedBuilding(null)}
            ar={ar}
            searchQuery={searchQuery}
          />
        )}
      </AnimatePresence>
    </>
  );
}

const BuildingCard = forwardRef<HTMLDivElement, { building: Building, idx: number, ar: boolean, onClick: () => void }>(
  ({ building, idx, ar, onClick }, ref) => {
    return (
      <motion.article
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ delay: idx * 0.05, duration: 0.4 }}
        onClick={onClick}
        className="group relative flex flex-col rounded-[2.5rem] overflow-hidden border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.03] shadow-lg hover:shadow-2xl transition-all cursor-pointer h-full"
      >
        {/* Top Color Accent Bar */}
        <div className={`h-2 w-full bg-gradient-to-r ${building.color || 'from-primary to-accent'} shrink-0`} />

        <div className="relative h-56 overflow-hidden shrink-0">
          <img
            src={building.imageUrl}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            alt={building.nameEn}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Floating ID Badge */}
          <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 h-10 w-10 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white font-black shadow-lg">
            {building.id}
          </div>
        </div>

        <div className="p-7 flex flex-col justify-between flex-1 gap-6 bg-white dark:bg-neutral-900/50 backdrop-blur-md">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className={cn("text-[10px] px-3 py-1 font-black uppercase tracking-widest bg-primary/10 text-primary border-primary/20 rounded-lg")}>
                {ar ? building.tag : building.tagEn}
              </Badge>
            </div>
            <h3 className="text-[#003366] dark:text-white font-black text-2xl md:text-3xl leading-tight font-['Cairo'] tracking-tight group-hover:text-primary transition-colors navy-pop">
              {ar ? (building.nameAr || "") : (building.nameEn || "")}
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground font-bold line-clamp-2 leading-relaxed opacity-80">
              {ar ? building.descAr : building.descEn}
            </p>
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-border/50">
            <span className="text-xs font-black text-primary uppercase tracking-widest">
              {ar ? "استكشاف المبنى" : "Explore Building"}
            </span>
            <div className="w-12 h-12 rounded-[1.2rem] bg-primary/10 flex items-center justify-center text-primary transition-all group-hover:bg-primary group-hover:text-white group-hover:shadow-xl group-hover:shadow-primary/20 group-hover:rotate-12">
              <ExternalLink className="w-5 h-5" />
            </div>
          </div>
        </div>
      </motion.article>
    );
  });


const BuildingDetailModal = forwardRef<HTMLDivElement, {
  building: Building,
  isOpen: boolean,
  onClose: () => void,
  ar: boolean,
  searchQuery: string
}>(({
  building,
  isOpen,
  onClose,
  ar,
  searchQuery
}, ref) => {
  const [activeFloor, setActiveFloor] = useState("0");
  const [openWing, setOpenWing] = useState<string | undefined>("wing-0");

  // Scroll Lock Implementation
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = 'hidden';

      return () => {
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.paddingRight = '';
        document.body.style.overflow = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      };
    }
  }, [isOpen]);

  if (typeof document === "undefined") return null;

  // Automatically switch to the floor and wing where the searched item is located
  useEffect(() => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      let foundFloor = -1;
      let foundWing = -1;

      building.floors.forEach((f, fIdx) => {
        const wings = (f as any).wings || (f as any).sections || [];
        wings.forEach((w: any, wIdx: number) => {
          if ((w.items || []).some((item: any) =>
            (item.nameAr || "").toLowerCase().includes(q) ||
            (item.nameEn || "").toLowerCase().includes(q)
          )) {
            foundFloor = fIdx;
            foundWing = wIdx;
          }
        });
      });

      if (foundFloor !== -1) {
        setActiveFloor(foundFloor.toString());
        setOpenWing(`wing-${foundWing}`);
      }
    }
  }, [searchQuery, building.floors]);

  const getItemIcon = (type: BuildingItem["type"]) => {
    switch (type) {
      case "lab": return "🧪";
      case "office": return "👨‍🏫";
      case "room": return "🚪";
      case "dept": return "🏢";
      default: return "📍";
    }
  };

  return createPortal(
    <div
      ref={ref}
      className="fixed inset-0 z-[100] flex items-center justify-center sm:p-6"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full h-full sm:h-auto sm:max-w-xl sm:max-h-[90dvh] bg-white dark:bg-neutral-950 sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col overscroll-contain"
      >
        {/* Sticky Modal Header/Image */}
        <div className="relative h-32 sm:h-48 shrink-0 sticky top-0 z-20">
          <img src={building.imageUrl} className="w-full h-full object-cover" alt={building.nameEn} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-xl text-white flex items-center justify-center transition-all border border-white/20 z-10 navy-pop"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-5 right-5 sm:bottom-6 sm:left-8 sm:right-8">
            <div className="flex items-center gap-3 mb-1">
              <Badge className={cn("bg-primary text-white border-none px-2.5 py-0.5 text-[10px] font-bold navy-pop")}>
                {ar ? building.tag : building.tagEn}
              </Badge>
            </div>
            <h2 className="text-white text-xl sm:text-3xl font-black navy-pop">{ar ? building.nameAr : building.nameEn}</h2>
            <p className="text-white/70 text-[10px] sm:text-xs font-medium mt-1 sm:mt-3 max-w-2xl line-clamp-2 navy-pop">
              {ar ? building.descAr : building.descEn}
            </p>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-hidden flex flex-col bg-neutral-50/50 dark:bg-neutral-900/50">
          <Tabs value={activeFloor} onValueChange={setActiveFloor} className="w-full h-full flex flex-col">
            <div className="px-6 pt-6 shrink-0 overflow-x-auto no-scrollbar flex items-center justify-between gap-4">
              <TabsList className="bg-neutral-200/50 dark:bg-white/5 p-1 rounded-2xl w-full sm:w-auto h-auto">
                {building.floors.map((floor, idx) => (
                  <TabsTrigger
                    key={idx}
                    value={idx.toString()}
                    className="rounded-xl px-4 py-2 font-black text-[11px] transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-sm"
                  >
                    {ar ? floor.levelAr : floor.levelEn}
                  </TabsTrigger>
                ))}
                <TabsTrigger
                  value="map"
                  className="rounded-xl px-4 py-2 font-black text-[11px] transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-sm flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  {ar ? "الموقع" : "Location"}
                </TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1 px-6 py-4 scroll-smooth overscroll-contain">
              {activeFloor === "map" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center py-10 text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <Navigation className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-black mb-2">{ar ? "موقع المبنى على الخريطة" : "Building Location"}</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mb-8">
                    {ar ? "يمكنك فتح الموقع مباشرة في تطبيق خرائط جوجل للحصول على الاتجاهات." : "You can open the location directly in Google Maps for turn-by-turn directions."}
                  </p>
                  <a
                    href={building.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-primary text-white font-black text-base shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                  >
                    <ExternalLink className="w-5 h-5" />
                    {ar ? "فتح في خرائط جوجل" : "Open in Google Maps"}
                  </a>
                </motion.div>
              ) : (
                <TabsContent value={activeFloor} className="mt-0 focus-visible:outline-none">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pb-8"
                  >
                    <Accordion
                      type="single"
                      collapsible
                      value={openWing}
                      onValueChange={setOpenWing}
                      className="space-y-4"
                    >
                      {((building.floors?.[parseInt(activeFloor)] as any)?.wings || (building.floors?.[parseInt(activeFloor)] as any)?.sections || []).map((wing: any, wIdx: number) => (
                        <AccordionItem
                          key={wIdx}
                          value={`wing-${wIdx}`}
                          className="border-none bg-white dark:bg-white/[0.03] rounded-2xl overflow-hidden shadow-sm"
                        >
                          <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-neutral-100 dark:hover:bg-white/5 transition-all">
                            <div className="flex items-center gap-3">
                              <div className="h-5 w-1 rounded-full bg-primary" />
                              <span className="text-sm font-black text-neutral-900 dark:text-white">
                                {ar ? wing.titleAr : wing.titleEn}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-5 pb-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                              {(wing.items || []).map((item: any, iIdx: number) => {
                                const isMatch = searchQuery && (
                                  (item.nameAr || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  (item.nameEn || "").toLowerCase().includes(searchQuery.toLowerCase())
                                );

                                return (
                                  <div
                                    key={iIdx}
                                    className={cn(
                                      "flex items-center gap-3 p-3 rounded-xl transition-all group border",
                                      isMatch
                                        ? "bg-primary/10 border-primary/40 shadow-[0_0_15px_hsl(var(--primary)/0.1)] scale-[1.02] z-10"
                                        : "bg-neutral-50 dark:bg-neutral-800/50 border-neutral-100 dark:border-white/5 hover:border-primary/30"
                                    )}
                                  >
                                    <div className={cn(
                                      "w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-colors",
                                      isMatch ? "bg-primary text-white" : "bg-white dark:bg-white/5 group-hover:bg-primary/10"
                                    )}>
                                      {getItemIcon(item.type)}
                                    </div>
                                    <div className="flex flex-col">
                                      <span className={cn(
                                        "text-[13px] font-bold leading-tight",
                                        isMatch ? "text-primary" : "text-neutral-800 dark:text-neutral-200"
                                      )}>
                                        {ar ? item.nameAr : item.nameEn}
                                      </span>
                                      <span className={cn(
                                        "text-[9px] font-black uppercase tracking-wider",
                                        isMatch ? "text-primary/70" : "text-neutral-500"
                                      )}>
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
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </motion.div>
                </TabsContent>
              )}
            </ScrollArea>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 shrink-0 bg-white dark:bg-neutral-950 border-t border-neutral-100 dark:border-white/5 flex flex-col items-center justify-center">
              <a
                href={building.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl bg-primary text-white font-black text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
              >
                <Navigation className="w-5 h-5" />
                {ar ? "فتح في الخريطة" : "Open in Maps"}
              </a>
            </div>
          </Tabs>
        </div>
      </motion.div>
    </div>,
    document.body
  );
});
