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


interface BuildingItem {
  nameAr: string;
  nameEn: string;
  type: "lab" | "office" | "room" | "dept" | "other";
}

interface BuildingWing {
  titleAr: string;
  titleEn: string;
  items: BuildingItem[];
}

interface BuildingFloor {
  levelAr: string;
  levelEn: string;
  wings: BuildingWing[];
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

/* ── Refined Building data with hierarchical structure ── */
const buildings: Building[] = [
  {
    id: 4,
    nameAr: "مبنى 4 (الفارابي)",
    nameEn: "Building 4 (Al-Farabi)",
    descAr: "مختبرات الهندسة المدنية والميكانيكية والمواد.",
    descEn: "Civil, Mechanical, & Materials Engineering Labs.",
    tags: ["جيولوجيا", "تربة", "مواد", "الفارابي"],
    imageUrl: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800",
    mapUrl: "https://maps.app.goo.gl/CePZ2cThb1yFrbZc9?g_st=ac",
    color: "from-stone-700 to-zinc-600",
    tag: "مختبرات",
    tagEn: "Labs",
    floors: [
      {
        levelAr: "الطابق الأرضي",
        levelEn: "Ground Floor",
        wings: [
          {
            titleAr: "المختبرات الهندسية",
            titleEn: "Engineering Labs",
            items: [
              { nameAr: "مختبر جيولوجيا", nameEn: "Geology Lab", type: "lab" },
              { nameAr: "رصفة طرق", nameEn: "Road Paving Lab", type: "lab" },
              { nameAr: "ميكانيكا تربة", nameEn: "Soil Mechanics", type: "lab" },
              { nameAr: "مقاومة مواد", nameEn: "Strength of Materials", type: "lab" },
              { nameAr: "ميثالورجيا", nameEn: "Metallurgy Lab", type: "lab" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 5,
    nameAr: "مبنى 5",
    nameEn: "Building 5",
    descAr: "قاعات تدريسية ومختبرات عامة.",
    descEn: "Lecture Halls and General Labs.",
    tags: ["513", "514", "515", "516", "521", "522", "قاعات"],
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800",
    mapUrl: "https://maps.app.goo.gl/bm9UfrcoC7divf7dA?g_st=ac",
    color: "from-cyan-700 to-blue-600",
    tag: "قاعات",
    tagEn: "Lecture Halls",
    floors: [
      {
        levelAr: "الطابق الأرضي",
        levelEn: "Ground Floor",
        wings: [
          {
            titleAr: "القاعات الدراسية",
            titleEn: "Lecture Halls",
            items: [
              { nameAr: "513", nameEn: "513", type: "room" },
              { nameAr: "514", nameEn: "514", type: "room" },
              { nameAr: "515", nameEn: "515", type: "room" },
              { nameAr: "516", nameEn: "516", type: "room" }
            ]
          }
        ]
      },
      {
        levelAr: "الطابق الأول",
        levelEn: "First Floor",
        wings: [
          {
            titleAr: "القاعات الدراسية",
            titleEn: "Lecture Halls",
            items: [
              { nameAr: "521", nameEn: "521", type: "room" },
              { nameAr: "522", nameEn: "522", type: "room" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 6,
    nameAr: "مبنى 6",
    nameEn: "Building 6",
    descAr: "مختبرات تخصصية وشعبة الأمن الجامعي.",
    descEn: "Specialized Labs and Campus Security Dept.",
    tags: ["اتصالات", "منطق رقمي", "أمن", "security", "digital logic", "comm lab"],
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
    mapUrl: "https://maps.app.goo.gl/uM3aL4Eok9HCvAjm7?g_st=ac",
    color: "from-blue-600 to-indigo-500",
    tag: "مختبرات/أمن",
    tagEn: "Labs/Security",
    floors: [
      {
        levelAr: "الطابق الأرضي",
        levelEn: "Ground Floor",
        wings: [
          {
            titleAr: "المختبرات والأقسام",
            titleEn: "Labs & Departments",
            items: [
              { nameAr: "مختبر الاتصالات", nameEn: "Communications Lab", type: "lab" },
              { nameAr: "مختبر تصميم منطق رقمي", nameEn: "Digital Logic Design Lab", type: "lab" },
              { nameAr: "شعبة الأمن", nameEn: "Security Department", type: "dept" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 9,
    nameAr: "مبنى 9 (البيروني)",
    nameEn: "Building 9 (Al-Biruni)",
    descAr: "قاعات تدريسية ومختبر إلكترونيات.",
    descEn: "Lecture Halls & Electronics Lab.",
    tags: ["903", "إلكترونيات", "البيروني"],
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800",
    mapUrl: "https://maps.app.goo.gl/BhxxT9pR2ZTSCRPC7?g_st=ac",
    color: "from-amber-600 to-yellow-500",
    tag: "أكاديمي",
    tagEn: "Academic",
    floors: [
      {
        levelAr: "الطابق الأرضي",
        levelEn: "Ground Floor",
        wings: [
          {
            titleAr: "القاعات والمختبرات",
            titleEn: "Rooms & Labs",
            items: [
              { nameAr: "903", nameEn: "903", type: "room" },
              { nameAr: "904", nameEn: "904", type: "room" },
              { nameAr: "907", nameEn: "907", type: "room" },
              { nameAr: "مختبر إلكترونيات", nameEn: "Electronics Lab", type: "lab" }
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
    descAr: "مختبرات الكيمياء والميكانيكا والحاسوب والطاقة المتجددة.",
    descEn: "Chemistry, Mechanics, Computer & Renewable Energy Labs.",
    tags: ["كيمياء", "ميكانيكا", "حاسوب", "طاقة", "1011", "1021", "مختبر"],
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
    mapUrl: "https://maps.app.goo.gl/NJGnVRn4WfE41zxV6?g_st=ac",
    color: "from-green-700 to-emerald-600",
    tag: "مختبرات",
    tagEn: "Labs",
    floors: [
      {
        levelAr: "الطابق الأرضي",
        levelEn: "Ground Floor",
        wings: [
          {
            titleAr: "الجزء الأيسر (مختبرات)",
            titleEn: "Left Wing (Labs)",
            items: [
              { nameAr: "مختبر كيمياء 1", nameEn: "Chem Lab 1", type: "lab" },
              { nameAr: "مختبر كيمياء 2", nameEn: "Chem Lab 2", type: "lab" },
              { nameAr: "مختبر قياسات كهربائية", nameEn: "Elec Measurements", type: "lab" },
              { nameAr: "مختبرات الحراريات", nameEn: "Thermal Labs", type: "lab" },
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
        wings: [
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
      },
      {
        levelAr: "الطابق الثاني",
        levelEn: "Second Floor",
        wings: [
          {
            titleAr: "الجزء الأيسر",
            titleEn: "Left Wing",
            items: [
              { nameAr: "مختبرات حاسوب تطبيقات هندسية (1-5)", nameEn: "Eng Apps Labs (1-5)", type: "lab" },
              { nameAr: "مختبر الطاقة المتجددة", nameEn: "Renewable Energy Lab", type: "lab" },
              { nameAr: "مختبر كيمياء 3", nameEn: "Chem Lab 3", type: "lab" },
              { nameAr: "مختبر نظرية الآلات", nameEn: "Theory of Machines", type: "lab" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 11,
    nameAr: "مبنى 11",
    nameEn: "Building 11",
    descAr: "مختبرات الهندسة الكهربائية والقيادة الكهربائية.",
    descEn: "Electrical Engineering and Electric Drive Labs.",
    tags: ["كهربائية", "قيادة كهربائية", "electric drive", "electrical engineering"],
    imageUrl: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800",
    mapUrl: "https://maps.app.goo.gl/BhxxT9pR2ZTSCRPC7?g_st=ac",
    color: "from-blue-800 to-indigo-900",
    tag: "مختبرات كهرباء",
    tagEn: "Electrical Labs",
    floors: [
      {
        levelAr: "الطابق الأرضي",
        levelEn: "Ground Floor",
        wings: [
          {
            titleAr: "المختبرات الهندسية",
            titleEn: "Engineering Labs",
            items: [
              { nameAr: "مختبر القيادة الكهربائية", nameEn: "Electric Drive Lab", type: "lab" },
              { nameAr: "مختبر الهندسة الكهربائية", nameEn: "Electrical Engineering Lab", type: "lab" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 12,
    nameAr: "مبنى 12",
    nameEn: "Building 12",
    descAr: "قاعات تدريسية ومكتب العلوم العسكرية.",
    descEn: "Lecture Halls & Military Science Office.",
    tags: ["عسكرية", "قاعات", "1225", "1230"],
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800",
    mapUrl: "https://maps.app.goo.gl/LYKS1QhPUnt8Dwke9?g_st=ac",
    color: "from-emerald-700 to-teal-600",
    tag: "قاعات",
    tagEn: "Lecture Halls",
    floors: [
      {
        levelAr: "الطابق الأرضي",
        levelEn: "Ground Floor",
        wings: [
          {
            titleAr: "جهة اليمين",
            titleEn: "Right Wing",
            items: [
              { nameAr: "1225", nameEn: "1225", type: "room" },
              { nameAr: "1226", nameEn: "1226", type: "room" },
              { nameAr: "1231", nameEn: "1231", type: "room" },
              { nameAr: "مكتب العلوم العسكرية", nameEn: "Military Science Office", type: "office" }
            ]
          },
          {
            titleAr: "جهة اليسار",
            titleEn: "Left Wing",
            items: [
              { nameAr: "1227", nameEn: "1227", type: "room" },
              { nameAr: "1228", nameEn: "1228", type: "room" },
              { nameAr: "1229", nameEn: "1229", type: "room" },
              { nameAr: "1230", nameEn: "1230", type: "room" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 16,
    nameAr: "مبنى 16 (الهندسة المدنية)",
    nameEn: "Building 16 (Civil Engineering)",
    descAr: "قسم الهندسة المدنية ومكاتب أعضاء الهيئة التدريسية للمهندسين والدكاترة.",
    descEn: "Civil Engineering Department & Faculty Offices for Engineers and Doctors.",
    tags: [
      "مدني", "civil", "أحمد العلوان", "علي المحاميد", "أماني الطعامسة", "سلام الكساسبة", "إسلام الخرابشة", "هدى القبلان",
      "جمال العدوان", "يزن الزعبي", "عيد السحاونة", "نعمان أبو حماد", "رائد الشراعية", "دانا أبو دية", "زياد أبو حمطة",
      "أحمد ملكاوي", "نافع عبدالهادي", "نارت ناغوج", "فاروق مرقة", "محمد عوض", "محمد الرجوب", "جمال صبيحات", "أمجد ياسين", "هاني قدان"
    ],
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
    mapUrl: "https://maps.app.goo.gl/CePZ2cThb1yFrbZc9?g_st=ac",
    color: "from-blue-700 to-cyan-600",
    tag: "هندسة مدنية",
    tagEn: "Civil Eng.",
    floors: [
      {
        levelAr: "الطابق الأول",
        levelEn: "First Floor",
        wings: [
          {
            titleAr: "مكاتب المهندسين",
            titleEn: "Engineers Offices",
            items: [
              { nameAr: "م. أحمد العلوان", nameEn: "M. Ahmad Al-Alwan", type: "office" },
              { nameAr: "م. علي المحاميد", nameEn: "M. Ali Al-Mahameed", type: "office" },
              { nameAr: "م. أماني الطعامسة", nameEn: "M. Amani Al-Ta'amseh", type: "office" },
              { nameAr: "م. سلام الكساسبة", nameEn: "M. Salam Al-Kasasbeh", type: "office" },
              { nameAr: "م. إسلام الخرابشة", nameEn: "M. Islam Al-Kharabsheh", type: "office" },
              { nameAr: "م. هدى القبلان", nameEn: "M. Huda Al-Qablan", type: "office" }
            ]
          }
        ]
      },
      {
        levelAr: "الطابق الثاني",
        levelEn: "Second Floor",
        wings: [
          {
            titleAr: "مكاتب أعضاء الهيئة التدريسية",
            titleEn: "Faculty Offices",
            items: [
              { nameAr: "د. جمال العدوان", nameEn: "Dr. Jamal Al-Adwan", type: "office" },
              { nameAr: "د. يزن الزعبي", nameEn: "Dr. Yazan Al-Zoubi", type: "office" },
              { nameAr: "د. عيد السحاونة", nameEn: "Dr. Eid Al-Sahawneh", type: "office" },
              { nameAr: "د. نعمان أبو حماد", nameEn: "Dr. Numan Abu Hammad", type: "office" },
              { nameAr: "أ.د. رائد الشراعية", nameEn: "Prof. Raed Al-Shara", type: "office" },
              { nameAr: "م. دانا أبو دية", nameEn: "M. Dana Abu Diyeh", type: "office" },
              { nameAr: "أ.د. زياد أبو حمطة", nameEn: "Prof. Ziad Abu Hamteh", type: "office" },
              { nameAr: "د. أحمد ملكاوي", nameEn: "Dr. Ahmad Malkawi", type: "office" },
              { nameAr: "أ.د. نافع عبدالهادي", nameEn: "Prof. Nafez Abdel Hadi", type: "office" },
              { nameAr: "د. نارت ناغوج", nameEn: "Dr. Nart Naghouj", type: "office" },
              { nameAr: "د. فاروق مرقة", nameEn: "Dr. Farouq Marqa", type: "office" },
              { nameAr: "أ.د. محمد عوض", nameEn: "Prof. Mohammad Awad", type: "office" },
              { nameAr: "د. محمد الرجوب", nameEn: "Dr. Mohammad Al-Rjoub", type: "office" },
              { nameAr: "د. جمال صبيحات", nameEn: "Dr. Jamal Sbeihat", type: "office" },
              { nameAr: "أ.د. أمجد ياسين", nameEn: "Prof. Amjad Yassin", type: "office" },
              { nameAr: "د. هاني قدان", nameEn: "Dr. Hani Qadan", type: "office" },
              { nameAr: "رئيس قسم الهندسة المدنية", nameEn: "Civil Engineering Head Office", type: "dept" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 17,
    nameAr: "مبنى 17 (الهندسة)",
    nameEn: "Building 17 (Engineering)",
    descAr: "المجمع الهندسي والأقسام التكنولوجية — هندسة الطاقة، الاتصالات، الميكاترونكس، الحاسوب والشبكات.",
    descEn: "Engineering Complex & Tech Depts — Power, Comm, Mechatronics, Computer & Networks.",
    tags: ["هندسة", "طاقة", "اتصالات", "ميكاترونكس", "حاسوب", "شبكات", "1711", "1721", "1731"],
    imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800",
    mapUrl: "https://maps.app.goo.gl/8mfaRUBfmb42aexPA?g_st=ac",
    color: "from-rose-800 to-pink-700",
    tag: "مجمع هندسي",
    tagEn: "Eng. Complex",
    floors: [
      {
        levelAr: "الطابق الأرضي",
        levelEn: "Ground Floor",
        wings: [
          {
            titleAr: "جهة اليسار",
            titleEn: "Left Wing",
            items: [
              { nameAr: "مختبر الدوائر الكهربائية", nameEn: "Circuits Lab", type: "lab" },
              { nameAr: "مختبر الاتصالات المتقدمة", nameEn: "Adv Comm Lab", type: "lab" },
              { nameAr: "مختبر الشبكات", nameEn: "Networks Lab", type: "lab" },
              { nameAr: "مختبر القوى والحماية", nameEn: "Power Lab", type: "lab" },
              { nameAr: "مختبر التحكم", nameEn: "Control Lab", type: "lab" },
              { nameAr: "د. أحمد أبو خضرة", nameEn: "Dr. Ahmed Abu Khadra", type: "office" },
              { nameAr: "د. علي علي", nameEn: "Dr. Ali Ali", type: "office" },
              { nameAr: "د. محمد العتوم", nameEn: "Dr. Mohammad Al-Otoom", type: "office" },
              { nameAr: "م. خولة عمر", nameEn: "Eng. Khawla Omar", type: "office" },
              { nameAr: "م. الفيرا الدويري", nameEn: "Eng. Elvira", type: "office" }
            ]
          },
          {
            titleAr: "جهة اليمين",
            titleEn: "Right Wing",
            items: [
              { nameAr: "مختبر الكترونيات القدرة", nameEn: "Power Electronics", type: "lab" },
              { nameAr: "مختبر النواقل", nameEn: "Conductors Lab", type: "lab" },
              { nameAr: "مختبر التحكم بالعمليات", nameEn: "Process Control", type: "lab" },
              { nameAr: "مختبر الآلات كهربائية", nameEn: "Elec Machines Lab", type: "lab" }
            ]
          }
        ]
      },
      {
        levelAr: "الطابق الأول",
        levelEn: "First Floor",
        wings: [
          {
            titleAr: "قسم هندسة الطاقة",
            titleEn: "Energy Engineering Dept",
            items: [
              { nameAr: "مختبر أمن سيبراني", nameEn: "Cyber Security Lab", type: "lab" },
              { nameAr: "مختبر أنظمة رقمية", nameEn: "Digital Systems Lab", type: "lab" },
              { nameAr: "مختبر معالجات", nameEn: "Processors Lab", type: "lab" },
              { nameAr: "1711", nameEn: "1711", type: "room" },
              { nameAr: "1712", nameEn: "1712", type: "room" },
              { nameAr: "1713", nameEn: "1713", type: "room" },
              { nameAr: "1714", nameEn: "1714", type: "room" },
              { nameAr: "م. ياسين الشبول", nameEn: "Eng. Yasin Shiboul", type: "office" },
              { nameAr: "د. زايد الحنيطي", nameEn: "Dr. Zayed Huneiti", type: "office" },
              { nameAr: "د. عبدالله الزيد", nameEn: "Dr. Abdullah Zaid", type: "office" },
              { nameAr: "د. أحمد الشرادقة", nameEn: "Dr. Ahmed Sharadqah", type: "office" },
              { nameAr: "د. خلف الزيود", nameEn: "Dr. Khalaf Zyoud", type: "office" },
              { nameAr: "د. طارق علاونة", nameEn: "Dr. Tareq Alawneh", type: "office" }
            ]
          },
          {
            titleAr: "قسم تكنولوجيا الاتصالات",
            titleEn: "Comm Tech Dept",
            items: [
              { nameAr: "د. فايق الربيع", nameEn: "Dr. Faeik Al-Rabee", type: "office" },
              { nameAr: "د. فاروق الطويل", nameEn: "Dr. Farouq Al-Taweel", type: "office" },
              { nameAr: "د. أمجد الهندي", nameEn: "Dr. Amjad Al-Hindi", type: "office" },
              { nameAr: "د. يوسف الطوس", nameEn: "Dr. Yousef Tous", type: "office" },
              { nameAr: "د. عماد النوافعة", nameEn: "Dr. Emad Al-Nawafa", type: "office" },
              { nameAr: "د. جودت الكساسبة", nameEn: "Dr. Jawdat Al-Kasasbeh", type: "office" },
              { nameAr: "د. أوس القيسي", nameEn: "Dr. Aws Al-Qaisi", type: "office" },
              { nameAr: "د. ماجد الدويري", nameEn: "Dr. Majed Dwairi", type: "office" },
              { nameAr: "د. لؤي السباتين", nameEn: "Dr. Loiy Al-Sbatin", type: "office" }
            ]
          }
        ]
      },
      {
        levelAr: "الطابق الثاني (الميكاترونكس)",
        levelEn: "Second Floor (Mechatronics)",
        wings: [
          {
            titleAr: "الأقسام والمكاتب",
            titleEn: "Depts & Offices",
            items: [
              { nameAr: "1721", nameEn: "1721", type: "room" },
              { nameAr: "1722", nameEn: "1722", type: "room" },
              { nameAr: "1723", nameEn: "1723", type: "room" },
              { nameAr: "1724", nameEn: "1724", type: "room" },
              { nameAr: "1725", nameEn: "1725", type: "room" },
              { nameAr: "1726", nameEn: "1726", type: "room" },
              { nameAr: "د. طارق يونس", nameEn: "Dr. Tariq Younes", type: "office" },
              { nameAr: "د. مهدي نصيرات", nameEn: "Dr. Mahdi Nisirat", type: "office" },
              { nameAr: "د. مهدي الشماسين", nameEn: "Dr. Mahdi Al-Shamasin", type: "office" },
              { nameAr: "م. أنور الفليح", nameEn: "Eng. Anwar Al-Fulaih", type: "office" },
              { nameAr: "د. علي خريوش", nameEn: "Dr. Ali Dalabeeh", type: "office" },
              { nameAr: "د. غازي القريوتي", nameEn: "Dr. Ghazi", type: "office" },
              { nameAr: "م. منذر كنعان", nameEn: "Eng. Monther Kanan", type: "office" },
              { nameAr: "د. محمد الخوالدة", nameEn: "Dr. Mohammad Al-Khawaldah", type: "office" },
              { nameAr: "د. عماد عوادة", nameEn: "Dr. Emad Awada", type: "office" },
              { nameAr: "د. محمد خريسات", nameEn: "Dr. Mohammad Khrisat", type: "office" },
              { nameAr: "م. صفاء المقبل", nameEn: "Eng. Safaa Moqbel", type: "office" }
            ]
          }
        ]
      },
      {
        levelAr: "الطابق الثالث (الحاسوب والشبكات)",
        levelEn: "Third Floor (Comp & Networks)",
        wings: [
          {
            titleAr: "المختبرات والمكاتب",
            titleEn: "Labs & Offices",
            items: [
              { nameAr: "مختبر A1", nameEn: "Lab A1", type: "lab" },
              { nameAr: "مختبر A2", nameEn: "Lab A2", type: "lab" },
              { nameAr: "1731", nameEn: "1731", type: "room" },
              { nameAr: "1732", nameEn: "1732", type: "room" },
              { nameAr: "1733", nameEn: "1733", type: "room" },
              { nameAr: "1734", nameEn: "1734", type: "room" },
              { nameAr: "م. عبدالله الزعبي", nameEn: "Eng. Abdullah Al-Zubi", type: "office" },
              { nameAr: "م. مازن أبو زاهر", nameEn: "Eng. Mazen Abu Zaher", type: "office" },
              { nameAr: "د. عبدالرحمن الزبيدي", nameEn: "Dr. Abdulrahman", type: "office" },
              { nameAr: "د. رشاد رصرص", nameEn: "Dr. Rashad Rasras", type: "office" },
              { nameAr: "د. جميل العزة", nameEn: "Dr. Jamil Azzeh", type: "office" },
              { nameAr: "د. جهاد نادر", nameEn: "Dr. Jihad Nader", type: "office" },
              { nameAr: "م. بسام صبيح", nameEn: "Eng. Bassam Sabieh", type: "office" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 18,
    nameAr: "مبنى 18 (أكاديمية حسين الصباغ)",
    nameEn: "Building 18 (Hussein Al-Sabbagh)",
    descAr: "أقسام التسجيل، المحاسبة، الكيمياء، ومكاتب أعضاء الهيئة التدريسية.",
    descEn: "Registration, Accounting, Chemistry, & Faculty Offices.",
    tags: ["تسجيل", "محاسبة", "كيمياء", "فيزياء", "أحمد السواقة", "زيد العنبر"],
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
    mapUrl: "https://maps.app.goo.gl/2KdDTzt37jn8vViS8",
    color: "from-blue-900 to-indigo-800",
    tag: "أكاديمية/إدارة",
    tagEn: "Academy/Admin",
    floors: [
      {
        levelAr: "الطابق الأرضي",
        levelEn: "Ground Floor",
        wings: [
          {
            titleAr: "جهة اليمين",
            titleEn: "Right Wing",
            items: [
              { nameAr: "قسم التسجيل", nameEn: "Registration Dept", type: "dept" },
              { nameAr: "مكرمة المعلمين", nameEn: "Teachers' Grant", type: "dept" },
              { nameAr: "المحاسبة", nameEn: "Accounting", type: "dept" },
              { nameAr: "الدبلوم", nameEn: "Diploma Office", type: "dept" },
              { nameAr: "مكاتب الثقافة العسكرية", nameEn: "Military Culture Offices", type: "office" },
              { nameAr: "1801", nameEn: "1801", type: "room" },
              { nameAr: "1802", nameEn: "1802", type: "room" },
              { nameAr: "1803", nameEn: "1803", type: "room" },
              { nameAr: "1804", nameEn: "1804", type: "room" },
              { nameAr: "1805", nameEn: "1805", type: "room" }
            ]
          },
          {
            titleAr: "جهة اليسار",
            titleEn: "Left Wing",
            items: [
              { nameAr: "د. أحمد السواقة", nameEn: "Dr. Ahmed Sawaqa", type: "office" },
              { nameAr: "د. زيد العنبر", nameEn: "Dr. Zaid Al-Anber", type: "office" },
              { nameAr: "د. بنان هديب", nameEn: "Dr. Banan Hudaib", type: "office" },
              { nameAr: "د. مازن أبو خضر", nameEn: "Dr. Mazen Abu Khader", type: "office" },
              { nameAr: "د. عمر العايد", nameEn: "Dr. Omar Al-Ayed", type: "office" },
              { nameAr: "د. وعيد عمر", nameEn: "Dr. Waid Omar", type: "office" },
              { nameAr: "د. محمد أبو دية", nameEn: "Dr. Mohammad Abu Dayyeh", type: "office" },
              { nameAr: "د. زكريا القضاة", nameEn: "Dr. Zakaria Al-Qudah", type: "office" }
            ]
          },
          {
            titleAr: "مرافق عامة",
            titleEn: "Public Facilities",
            items: [
              { nameAr: "المرسم 2", nameEn: "Art Studio 2", type: "other" },
              { nameAr: "مختبرات فيزياء", nameEn: "Physics Labs", type: "lab" },
              { nameAr: "مختبر كيمياء 1", nameEn: "Chem Lab 1", type: "lab" },
              { nameAr: "مختبر كيمياء 2", nameEn: "Chem Lab 2", type: "lab" },
              { nameAr: "مختبر كيمياء 3", nameEn: "Chem Lab 3", type: "lab" },
              { nameAr: "مختبر كيمياء 4", nameEn: "Chem Lab 4", type: "lab" },
              { nameAr: "د. إبراهيم سليمان", nameEn: "Dr. Ibrahim Suleiman", type: "office" },
              { nameAr: "د. مها الرجبي", nameEn: "Dr. Maha Al-Rajabi", type: "office" },
              { nameAr: "د. انشراح دعنا", nameEn: "Dr. Ensherah Dana", type: "office" }
            ]
          }
        ]
      }
    ]
  }
];

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
