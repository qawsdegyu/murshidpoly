export interface BuildingItem {
  nameAr: string;
  nameEn: string;
  type: "lab" | "office" | "room" | "dept" | "other";
}

export interface BuildingWing {
  titleAr: string;
  titleEn: string;
  items: BuildingItem[];
}

export interface BuildingFloor {
  levelAr: string;
  levelEn: string;
  wings: BuildingWing[];
}

export interface Building {
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

export const buildings: Building[] = [
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
