import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Navigation, Building2, ExternalLink, Search, X, 
  CheckCircle2, ChevronDown, ChevronUp, Layers, User2, FlaskConical, DoorOpen 
} from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";
import PageHeader from "@/components/PageHeader";
import { cn } from "@/lib/utils";

interface BuildingItem {
  nameAr: string;
  nameEn: string;
  type: "lab" | "office" | "room" | "dept" | "other";
}

interface BuildingSection {
  titleAr: string;
  titleEn: string;
  items: BuildingItem[];
}

interface BuildingFloor {
  levelAr: string;
  levelEn: string;
  sections: BuildingSection[];
}

interface Building {
  id: number;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  imageUrl: string;
  mapUrl: string;
  color: string;
  tag: string;
  tagEn: string;
  tags: string[];
  floors: BuildingFloor[];
}

/* ── Building data for all buildings with hierarchical structure ── */
const buildings: Building[] = [
  {
    id: 1,
    nameAr: "مبنى 1",
    nameEn: "Building 1",
    descAr: "الإدارة المركزية، القبول والتسجيل، شؤون الطلبة.",
    descEn: "Central Administration, Admissions & Registration, Student Affairs.",
    tags: ["مكتب القبول", "مكتب التسجيل", "عمادة شؤون الطلبة", "المالية"],
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800",
    mapUrl: "https://maps.google.com/?q=Al+Balqa+Applied+University,+Building+1",
    color: "from-emerald-700 to-teal-600",
    tag: "إدارة",
    tagEn: "Admin",
    floors: [
      {
        levelAr: "الطابق الأرضي",
        levelEn: "Ground Floor",
        sections: [
          {
            titleAr: "الخدمات المركزية",
            titleEn: "Central Services",
            items: [
              { nameAr: "مكتب القبول", nameEn: "Admissions", type: "dept" },
              { nameAr: "مكتب التسجيل", nameEn: "Registration", type: "dept" },
              { nameAr: "الدائرة المالية", nameEn: "Finance", type: "dept" }
            ]
          }
        ]
      },
      {
        levelAr: "الطابق الأول",
        levelEn: "First Floor",
        sections: [
          {
            titleAr: "العمادة",
            titleEn: "Deanship",
            items: [
              { nameAr: "عمادة شؤون الطلبة", nameEn: "Student Affairs", type: "dept" },
              { nameAr: "مكاتب الإدارة", nameEn: "Admin Offices", type: "office" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 10,
    nameAr: "مبنى 10",
    nameEn: "Building 10",
    descAr: "مختبرات الكيمياء والميكانيكا والحاسوب.",
    descEn: "Chemistry, Mechanics & Computer Labs.",
    tags: ["كيمياء", "حراريات", "ميكانيكا", "حاسوب", "طاقة متجددة", "1011", "1026"],
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
    mapUrl: "https://maps.app.goo.gl/NJGnVRn4WfE41zxV6",
    color: "from-green-700 to-emerald-600",
    tag: "مختبرات",
    tagEn: "Labs",
    floors: [
      {
        levelAr: "الطابق الأرضي",
        levelEn: "Ground Floor",
        sections: [
          {
            titleAr: "الجزء الأيسر (مختبرات)",
            titleEn: "Left Wing (Labs)",
            items: [
              { nameAr: "مختبر كيمياء 1", nameEn: "Chem Lab 1", type: "lab" },
              { nameAr: "مختبر كيمياء 2", nameEn: "Chem Lab 2", type: "lab" },
              { nameAr: "مختبر قياسات كهربائية", nameEn: "Electrical Measurements", type: "lab" },
              { nameAr: "مختبر حراريات", nameEn: "Thermal Eng Lab", type: "lab" },
              { nameAr: "مختبر ميكانيكا الموائع", nameEn: "Fluid Mechanics", type: "lab" }
            ]
          },
          {
            titleAr: "الجزء الأيمن (قاعات)",
            titleEn: "Right Wing (Rooms)",
            items: [
              { nameAr: "1011", nameEn: "1011", type: "room" },
              { nameAr: "1012", nameEn: "1012", type: "room" },
              { nameAr: "1013", nameEn: "1013", type: "room" },
              { nameAr: "1014", nameEn: "1014", type: "room" },
              { nameAr: "1015", nameEn: "1015", type: "room" }
            ]
          }
        ]
      },
      {
        levelAr: "الطابق الأول",
        levelEn: "First Floor",
        sections: [
          {
            titleAr: "الجزء الأيمن",
            titleEn: "Right Wing",
            items: [
              { nameAr: "1021", nameEn: "1021", type: "room" },
              { nameAr: "1022", nameEn: "1022", type: "room" },
              { nameAr: "1023", nameEn: "1023", type: "room" },
              { nameAr: "1024", nameEn: "1024", type: "room" },
              { nameAr: "1025", nameEn: "1025", type: "room" },
              { nameAr: "1026", nameEn: "1026", type: "room" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 17,
    nameAr: "مبنى 17",
    nameEn: "Building 17",
    descAr: "المجمع الهندسي والأقسام التكنولوجية.",
    descEn: "Engineering Complex & Tech Depts.",
    tags: ["أحمد أبو خضرة", "ياسين الشبول", "عبدالله الزيد", "زايد الحنيطي", "أوس القيسي", "ميكاترونكس", "شبكات", "سيبراني", "1711", "1724", "1734"],
    imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800",
    mapUrl: "https://maps.google.com/?q=Al+Balqa+Applied+University,+Building+17",
    color: "from-rose-800 to-pink-700",
    tag: "مجمع هندسي",
    tagEn: "Eng. Complex",
    floors: [
      {
        levelAr: "الطابق الأرضي",
        levelEn: "Ground Floor",
        sections: [
          {
            titleAr: "جهة اليسار",
            titleEn: "Left Wing",
            items: [
              { nameAr: "مختبر الدوائر الكهربائية", nameEn: "Circuits Lab", type: "lab" },
              { nameAr: "مختبر الاتصالات المتقدمة", nameEn: "Adv Comm Lab", type: "lab" },
              { nameAr: "مختبر الشبكات", nameEn: "Networks Lab", type: "lab" },
              { nameAr: "مختبر القوى والحماية", nameEn: "Power Lab", type: "lab" },
              { nameAr: "د.أحمد أبو خضرة", nameEn: "Dr. Ahmed Abu Khadra", type: "office" },
              { nameAr: "د.علي محمود علي", nameEn: "Dr. Ali Mahmoud", type: "office" }
            ]
          },
          {
            titleAr: "جهة اليمين",
            titleEn: "Right Wing",
            items: [
              { nameAr: "مختبر الكترونيات القدرة", nameEn: "Power Electronics", type: "lab" },
              { nameAr: "مختبر الآلات كهربائية", nameEn: "Elec Machines Lab", type: "lab" }
            ]
          }
        ]
      },
      {
        levelAr: "الطابق الأول",
        levelEn: "First Floor",
        sections: [
          {
            titleAr: "قسم هندسة الطاقة الكهربائية",
            titleEn: "Electrical Power Dept",
            items: [
              { nameAr: "مختبر الأمن السيبراني", nameEn: "Cyber Security Lab", type: "lab" },
              { nameAr: "د.عبدالله الزيد", nameEn: "Dr. Abdullah Zaid", type: "office" },
              { nameAr: "د.زايد الحنيطي", nameEn: "Dr. Zayed Huneiti", type: "office" }
            ]
          },
          {
            titleAr: "قسم هندسة تكنولوجيا الاتصالات",
            titleEn: "Comm Tech Dept",
            items: [
              { nameAr: "أ.د.يوسف الطوس", nameEn: "Prof. Yousef Tous", type: "office" },
              { nameAr: "1711", nameEn: "1711", type: "room" }
            ]
          }
        ]
      },
      {
        levelAr: "الطابق الثالث",
        levelEn: "Third Floor",
        sections: [
          {
            titleAr: "قسم الحاسوب والشبكات",
            titleEn: "Computer & Networks Dept",
            items: [
              { nameAr: "أ.د.عبدالرحمن الزبيدي", nameEn: "Prof. Abdulrahman", type: "office" },
              { nameAr: "مختبر A1", nameEn: "Lab A1", type: "lab" },
              { nameAr: "1731", nameEn: "1731", type: "room" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 18,
    nameAr: "مبنى 18",
    nameEn: "Building 18",
    descAr: "قسم الهندسة الكيميائية والتسجيل.",
    descEn: "Chemical Engineering & Registration.",
    tags: ["كيمياء", "تسجيل", "محاسبة", "أحمد السواقة", "زيد العنبر"],
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800",
    mapUrl: "https://maps.app.goo.gl/2KdDTzt37jn8vViS8",
    color: "from-blue-900 to-indigo-800",
    tag: "أكاديمية",
    tagEn: "Academy",
    floors: [
      {
        levelAr: "الطابق الأرضي",
        levelEn: "Ground Floor",
        sections: [
          {
            titleAr: "جهة اليسار",
            titleEn: "Left Wing",
            items: [
              { nameAr: "أ.د.احمد السواقة", nameEn: "Prof. Ahmed Sawaqa", type: "office" },
              { nameAr: "ا.د.زيد العنبر", nameEn: "Prof. Zaid Anbar", type: "office" }
            ]
          },
          {
            titleAr: "جهة اليمين",
            titleEn: "Right Wing",
            items: [
              { nameAr: "قسم التسجيل", nameEn: "Registration", type: "dept" },
              { nameAr: "قسم المحاسبة", nameEn: "Accounting", type: "dept" }
            ]
          }
        ]
      }
    ]
  }
];

export default function CampusMap() {
  const { lang, dir } = usePreferences();
  const ar = lang === "ar";
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBuildings = useMemo(() => {
    if (!searchQuery.trim()) return buildings;
    const query = searchQuery.toLowerCase();
    
    return buildings.filter(b => 
      b.nameAr.toLowerCase().includes(query) ||
      b.nameEn.toLowerCase().includes(query) ||
      b.descAr.toLowerCase().includes(query) ||
      b.descEn.toLowerCase().includes(query) ||
      b.tags.some(t => t.toLowerCase().includes(query)) ||
      b.id.toString() === query
    );
  }, [searchQuery]);

  return (
    <motion.div
      dir={dir}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen pb-20"
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 pt-28 pb-10">
        <PageHeader
        title={ar ? "مواقع المباني" : "Campus Map"}
        subtitle={ar
          ? "دليل شامل لمباني الحرم الجامعي — ابحث عن القاعات أو المكاتب أو الدكاترة."
          : "Complete guide to BAU campus buildings — search for rooms, offices, or doctors."}
        icon={<Building2 className="w-6 h-6 text-primary dark:text-accent" />}
      />

      <div className="max-w-3xl mx-auto mb-10 px-2">
        <div className="relative group">
          <div className="absolute inset-y-0 ltr:left-4 rtl:right-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={ar ? "ابحث عن قاعة، دكتور، قسم..." : "Search for a room, doctor, dept..."}
            className="w-full ltr:pl-12 rtl:pr-12 py-4 rounded-[1.5rem] bg-white dark:bg-white/[0.03] border border-neutral-200 dark:border-white/10 outline-none transition-all font-bold text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <AnimatePresence mode="popLayout">
          {filteredBuildings.map((b, i) => (
            <BuildingCard key={b.id} b={b} i={i} ar={ar} searchQuery={searchQuery} dir={dir} />
          ))}
        </AnimatePresence>
      </div>

      {filteredBuildings.length === 0 && (
        <div className="py-20 text-center">
          <h3 className="text-xl font-black">{ar ? "لم يتم العثور على نتائج" : "No results found"}</h3>
        </div>
      )}
      </div>
    </motion.div>
  );
}

function BuildingCard({ b, i, ar, searchQuery, dir }: { b: Building, i: number, ar: boolean, searchQuery: string, dir: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFloorIdx, setActiveFloorIdx] = useState(0);

  useMemo(() => {
    if (searchQuery && isOpen) {
      const q = searchQuery.toLowerCase();
      const floorIdx = b.floors.findIndex(f => 
        f.sections.some(s => 
          s.items.some(item => 
            item.nameAr.toLowerCase().includes(q) || 
            item.nameEn.toLowerCase().includes(q)
          )
        )
      );
      if (floorIdx !== -1) setActiveFloorIdx(floorIdx);
    }
  }, [searchQuery, isOpen, b.floors]);

  const getItemIcon = (type: BuildingItem["type"]) => {
    switch (type) {
      case "lab": return "🧪";
      case "office": return "👨‍🏫";
      case "room": return "🚪";
      case "dept": return "🏢";
      default: return "📍";
    }
  };

  return (
    <>
      <motion.article
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="group relative flex flex-col rounded-[2.5rem] overflow-hidden border bg-white dark:bg-white/[0.03] shadow-sm transition-all cursor-pointer"
      >
        <div className="relative h-48">
          <img src={b.imageUrl} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-4 inset-x-4">
             <h3 className="text-white font-black text-xl">{ar ? b.nameAr : b.nameEn}</h3>
          </div>
        </div>
        <div className="p-5 flex flex-col gap-3">
          <p className="text-xs text-neutral-500 font-bold line-clamp-2">{ar ? b.descAr : b.descEn}</p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-[10px] font-black text-primary uppercase">{ar ? "عرض التفاصيل" : "View Details"}</span>
            <ExternalLink className="w-3 h-3 text-primary" />
          </div>
        </div>
      </motion.article>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              layoutId={`card-${b.id}`}
              className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-neutral-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="relative h-48 shrink-0">
                <img src={b.imageUrl} className="w-full h-full object-cover" />
                <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center"><X /></button>
                <div className="absolute bottom-6 left-6">
                  <h2 className="text-white text-3xl font-black">{ar ? b.nameAr : b.nameEn}</h2>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 sm:p-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  <div className="md:col-span-4 space-y-2">
                    {b.floors.map((floor, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveFloorIdx(idx)}
                        className={cn(
                          "w-full text-right px-6 py-4 rounded-2xl font-black text-sm transition-all border",
                          activeFloorIdx === idx ? `bg-gradient-to-r ${b.color} text-white border-transparent` : "bg-neutral-50 dark:bg-white/5 border-neutral-100 dark:border-white/5"
                        )}
                      >
                        {ar ? floor.levelAr : floor.levelEn}
                      </button>
                    ))}
                    <a href={b.mapUrl} target="_blank" className="flex items-center justify-center gap-2 w-full mt-4 p-4 rounded-2xl bg-primary text-white font-black text-xs">
                      <Navigation className="w-4 h-4" /> {ar ? "الموقع" : "Location"}
                    </a>
                  </div>

                  <div className="md:col-span-8 space-y-6">
                    {b.floors[activeFloorIdx].sections.map((section, sIdx) => (
                      <div key={sIdx} className="space-y-3">
                        <h4 className="text-sm font-black text-primary border-b pb-1">{ar ? section.titleAr : section.titleEn}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {section.items.map((item, iIdx) => (
                            <div key={iIdx} className="flex items-center gap-2 p-3 rounded-xl bg-neutral-50 dark:bg-white/5 border border-neutral-100 dark:border-white/5">
                              <span className="text-lg">{getItemIcon(item.type)}</span>
                              <span className="text-xs font-bold">{ar ? item.nameAr : item.nameEn}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
