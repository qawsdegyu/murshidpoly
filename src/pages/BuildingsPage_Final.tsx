import { useState, useMemo, useEffect, forwardRef } from "react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


import { buildings, type Building, type BuildingFloor, type BuildingWing, type BuildingItem } from "@/data/buildings";

export default function BuildingsPage() {
  const { lang, dir } = usePreferences();
  const [searchParams] = useSearchParams();
  const ar = lang === "ar";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

  useEffect(() => {
    const buildingId = searchParams.get("id");
    if (buildingId) {
      const b = buildings.find(b => b.id.toString() === buildingId);
      if (b) setSelectedBuilding(b);
    }
  }, [searchParams]);

  const filteredBuildings = useMemo(() => {
    // Sort buildings list in ascending order based on their numbers/IDs
    const sortedBuildings = [...buildings].sort((a, b) => a.id - b.id);
    
    if (!searchQuery.trim()) return sortedBuildings;
    const query = searchQuery.toLowerCase();
    
    return sortedBuildings.filter(b => 
      b.nameAr.toLowerCase().includes(query) ||
      b.nameEn.toLowerCase().includes(query) ||
      b.descAr.toLowerCase().includes(query) ||
      b.descEn.toLowerCase().includes(query) ||
      b.tags.some(t => t.toLowerCase().includes(query)) ||
      b.id.toString() === query ||
      b.floors.some(f => 
        f.wings.some(w => 
          w.items.some(item => 
            item.nameAr.toLowerCase().includes(query) || 
            item.nameEn.toLowerCase().includes(query)
          )
        )
      )
    );
  }, [searchQuery]);

  return (
    <>
    <motion.div
      dir={dir}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen pb-24 pointer-events-none"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-32 md:pt-44 pointer-events-auto transition-all duration-700">

        <PageHeader
          title={ar ? "مواقع المباني" : "Campus Map"}
          subtitle={ar
            ? "دليل شامل لمباني الحرم الجامعي — ابحث عن القاعات أو المكاتب أو الدكاترة."
            : "Complete guide to BAU campus buildings — search for rooms, offices, or doctors."}
          icon={<Building2 className="w-8 h-8 md:w-12 md:h-12 text-primary dark:text-accent" />}
          className="mb-10 md:mb-16"
        />

      <div className="max-w-3xl mx-auto mb-10 px-4">
        <div className="relative group">
          <div className="absolute inset-y-0 ltr:left-4 rtl:right-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={ar ? "ابحث عن قاعة، دكتور، قسم..." : "Search for a room, doctor, dept..."}
            className="w-full ltr:pl-12 rtl:pr-12 py-4 rounded-2xl bg-white dark:bg-white/[0.03] border border-neutral-200 dark:border-white/10 outline-none transition-all font-bold text-sm shadow-sm focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="container px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredBuildings.map((b, i) => (
              <BuildingCard 
                key={b.id} 
                b={b} 
                i={i} 
                ar={ar} 
                onClick={() => setSelectedBuilding(b)} 
              />
            ))}
          </AnimatePresence>
        </div>

        {filteredBuildings.length === 0 && (
          <div className="py-20 text-center">
            <div className="bg-neutral-100 dark:bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-xl font-black">{ar ? "لم يتم العثور على نتائج" : "No results found"}</h3>
            <p className="text-neutral-500 text-sm mt-2">{ar ? "جرب البحث بكلمات مختلفة" : "Try searching with different keywords"}</p>
          </div>
        )}
      </div>

      </div>
    </motion.div>

      {/* Building Detail Modal */}
      <AnimatePresence>
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

const BuildingCard = forwardRef<HTMLDivElement, { b: Building, i: number, ar: boolean, onClick: () => void }>(
  ({ b, i, ar, onClick }, ref) => {
    return (
      <motion.article
        ref={ref}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ delay: i * 0.05 }}
        onClick={onClick}
        className="group relative flex flex-col rounded-[2.5rem] overflow-hidden border border-neutral-100 dark:border-white/5 bg-white dark:bg-white/[0.03] shadow-sm hover:shadow-xl transition-all cursor-pointer h-full"
      >
      <div className="relative h-44 overflow-hidden">
        <img 
          src={b.imageUrl} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          alt={b.nameEn}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>
      
      <div className="p-6 flex flex-col justify-between flex-1 gap-4 bg-white/50 dark:bg-neutral-900/30 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Badge className={cn("text-[9px] px-2.5 py-0.5 font-black uppercase tracking-widest bg-accent/10 text-accent border-accent/20")}>
              {ar ? b.tag : b.tagEn}
            </Badge>
          </div>
          <h3 className="text-slate-900 dark:text-white font-black text-xl md:text-2xl leading-tight mb-4 font-['Cairo'] tracking-tight group-hover:text-accent transition-colors">
            {ar ? b.nameAr : b.nameEn}
          </h3>
          <p className="text-[11px] md:text-xs text-muted-foreground font-bold line-clamp-2 leading-relaxed opacity-80">
            {ar ? b.descAr : b.descEn}
          </p>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-border/50">
          <span className="text-[10px] font-black text-accent uppercase tracking-widest">
            {ar ? "عرض التفاصيل" : "Explore Building"}
          </span>
          <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center text-accent transition-all group-hover:bg-accent group-hover:text-white group-hover:shadow-lg group-hover:shadow-accent/20">
            <ExternalLink className="w-4 h-4" />
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
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (typeof document === "undefined") return null;

  // Automatically switch to the floor and wing where the searched item is located
  useEffect(() => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      let foundFloor = -1;
      let foundWing = -1;

      building.floors.forEach((f, fIdx) => {
        f.wings.forEach((w, wIdx) => {
          if (w.items.some(item => item.nameAr.toLowerCase().includes(q) || item.nameEn.toLowerCase().includes(q))) {
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
    <div ref={ref} className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose} 
        className="absolute inset-0 bg-black/80 backdrop-blur-md" 
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-xl max-h-[85dvh] bg-white dark:bg-neutral-950 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
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
            <div className="px-6 pt-6 shrink-0 overflow-x-auto no-scrollbar">
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
              </TabsList>
            </div>

            <ScrollArea className="flex-1 px-6 py-4 scroll-smooth">
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
                    {building.floors[parseInt(activeFloor)].wings.map((wing, wIdx) => (
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
                            {wing.items.map((item, iIdx) => (
                              <div 
                                key={iIdx}
                                className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-white/5 transition-all group hover:border-primary/30"
                              >
                                <div className="w-9 h-9 rounded-lg bg-white dark:bg-white/5 flex items-center justify-center text-lg group-hover:bg-primary/10 transition-colors">
                                  {getItemIcon(item.type)}
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[13px] font-bold text-neutral-800 dark:text-neutral-200 leading-tight">
                                    {ar ? item.nameAr : item.nameEn}
                                  </span>
                                  <span className="text-[9px] text-neutral-500 font-black uppercase tracking-wider">
                                    {item.type === 'lab' ? (ar ? 'مختبر' : 'Laboratory') : 
                                     item.type === 'office' ? (ar ? 'مكتب' : 'Office') : 
                                     item.type === 'room' ? (ar ? 'قاعة' : 'Classroom') : 
                                     item.type === 'dept' ? (ar ? 'قسم' : 'Department') : ''}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              </TabsContent>
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
