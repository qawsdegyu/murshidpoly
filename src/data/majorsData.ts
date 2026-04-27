export interface MajorInfo {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  longDescriptionAr: string;
  imageUrl: string;
  icon: string;
  color: string;
  accentColor: string;
  studyPlanUrl: string | null;
  // New fields
  hourPriceCompetitive: number;
  hourPriceParallel: number;
  expectedSalaryAr: string;
  careerFieldsAr: string[];
}

export const majorsData: MajorInfo[] = [
  {
    id: "common",
    name: "Common Subjects",
    nameAr: "المواد المشتركة",
    description: "University requirements and compulsory courses for all engineering majors.",
    descriptionAr: "تضم كافة المتطلبات الجامعية والمتطلبات الإجبارية لكافة تخصصات الهندسة.",
    longDescriptionAr: "المواد المشتركة هي الأساس الذي يبنى عليه كل مهندس في كلية الهندسة التكنولوجية. تشمل مواد الرياضيات كالتفاضل والتكامل والجبر الخطي، ومواد الفيزياء والكيمياء، إضافةً إلى البرمجة بـ C++ واللغات العربية والإنجليزية والمواد الثقافية. هذه المواد تُعدّ الطالب للتخصص الدقيق وتمنحه القاعدة العلمية المتينة للنجاح.",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1200",
    icon: "BookOpen",
    color: "from-slate-700 to-slate-600",
    accentColor: "#94a3b8",
    studyPlanUrl: "https://drive.google.com/uc?export=download&id=1684L7aTe6l3MH8HwNsmQZedyG6cQIcRJ",
    hourPriceCompetitive: 10, // Common subjects are usually cheaper or different, but using 10 for competitive base
    hourPriceParallel: 35,
    expectedSalaryAr: "يعتمد على التخصص المختار",
    careerFieldsAr: ["جميع قطاعات الهندسة", "الشركات الصناعية", "الجهات الحكومية", "مؤسسات التعليم العالي"],
  },
  {
    id: "network-security",
    name: "Network Security Engineering",
    nameAr: "أمن الشبكات",
    description: "Protecting systems, data, and networks from cyber threats.",
    descriptionAr: "التركيز على حماية الأنظمة والبيانات والشبكات من الاختراقات والتهديدات السيبرانية.",
    longDescriptionAr: "يُعدّ تخصص أمن الشبكات من أسرع التخصصات نمواً في سوق العمل العالمي. يتعلم الطالب كيفية تصميم وتأمين البنى التحتية الرقمية، واكتشاف الثغرات الأمنية، وبناء أنظمة الحماية المتقدمة. يغطي البرنامج التشفير، الاختراق الأخلاقي (Ethical Hacking)، الجنائيات الرقمية، إدارة الحوادث الأمنية، ومراكز العمليات الأمنية (SOC). يُخرّج البرنامج مهندسين قادرين على حماية المؤسسات من التهديدات السيبرانية المتزايدة.",
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
    icon: "Shield",
    color: "from-cyan-700 to-blue-700",
    accentColor: "#06b6d4",
    studyPlanUrl: "https://drive.google.com/uc?export=download&id=1AsQlQK3v2O0mvHJlf54DwldxY9llSVzi",
    hourPriceCompetitive: 30,
    hourPriceParallel: 60,
    expectedSalaryAr: "600 – 1,500 دينار (الأردن) | 3,500 – 10,000 دولار (الخليج)",
    careerFieldsAr: ["محلل أمن سيبراني", "مختبر اختراق (Pen Tester)", "مهندس SOC", "مستشار أمن المعلومات", "شركات Telecom والبنوك"],
  },
  {
    id: "mechanical",
    name: "General Mechanical Engineering",
    nameAr: "هندسة الميكانيك العام",
    description: "Study of thermal and mechanical systems, design, and manufacturing.",
    descriptionAr: "دراسة الأنظمة الحرارية والميكانيكية والتصميم والإنتاج.",
    longDescriptionAr: "هندسة الميكانيك العام هي التخصص الأشمل في عالم الهندسة، إذ تغطي كل ما يتحرك في محيطنا. يدرس الطالب ميكانيكا الموائع، الديناميكا الحرارية، تصميم الآلات، وأنظمة التصنيع. يُركّز البرنامج على التصميم بمساعدة الحاسوب (CAD/CAM)، أنظمة التكييف والتبريد (HVAC)، وصيانة المركبات الكهربائية والهجينة. يُعدّ خريج هذا التخصص لقيادة مشاريع البنية التحتية والطاقة.",
    imageUrl: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=1200",
    icon: "Cog",
    color: "from-stone-700 to-zinc-600",
    accentColor: "#78716c",
    studyPlanUrl: "https://drive.google.com/uc?export=download&id=1IhYchLAQOo-ctFjUawCLW8u6nS4zKsvX",
    hourPriceCompetitive: 30,
    hourPriceParallel: 60,
    expectedSalaryAr: "500 – 1,300 دينار (الأردن) | 2,200 – 7,000 دولار (الخليج)",
    careerFieldsAr: ["مهندس إنتاج وتصنيع", "مهندس تكييف وتبريد (HVAC)", "مهندس طاقة متجددة", "صيانة الطائرات", "شركات السيارات الكهربائية"],
  },
  {
    id: "autotronics",
    name: "Autotronics Engineering",
    nameAr: "هندسة الأوتوترونكس",
    description: "Merging mechanical engineering and electronics in modern vehicle systems.",
    descriptionAr: "دمج الهندسة الميكانيكية والإلكترونيات في أنظمة السيارات الحديثة.",
    longDescriptionAr: "الأوتوترونكس تخصص مستقبلي يجمع بين الهندسة الميكانيكية والإلكترونيات وأنظمة التحكم في السيارات. يتعلم الطالب تشخيص الأعطال الإلكترونية المعقدة في السيارات الحديثة، صيانة السيارات الكهربائية (EV) والهجينة، وبرمجة وحدات التحكم الإلكتروني (ECU). مع التحول العالمي نحو السيارات الكهربائية، يُصبح خريجو هذا التخصص في قمة سلم الطلب في سوق العمل.",
    imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=1200",
    icon: "Car",
    color: "from-blue-700 to-cyan-600",
    accentColor: "#3b82f6",
    studyPlanUrl: "https://drive.google.com/uc?export=download&id=1HJAUfv_h-PO90q_TCRop8zv3tvJybEFQ",
    hourPriceCompetitive: 30,
    hourPriceParallel: 60,
    expectedSalaryAr: "450 – 1,100 دينار (الأردن) | 2,000 – 6,000 دولار (الخليج)",
    careerFieldsAr: ["مهندس إلكترونيات سيارات", "اختصاصي سيارات كهربائية (EV)", "فني تشخيص أعطال متقدم", "مراكز صيانة السيارات الفاخرة", "شركات التصنيع الأوتوماتيكي"],
  },
  {
    id: "civil",
    name: "Roads & Bridges Engineering",
    nameAr: "هندسة الطرق والجسور",
    description: "Design, construction, and maintenance of roads, bridges, and transport systems.",
    descriptionAr: "تصميم وتنفيذ وصيانة البنية التحتية من طرق وجسور وأنظمة نقل.",
    longDescriptionAr: "هندسة الطرق والجسور هي العمود الفقري لأي مدينة حديثة. يدرس الطالب تصميم الجسور الإنشائية، شبكات الطرق السريعة، تخطيط النقل الحضري، وهندسة المرور. يُركّز البرنامج على نمذجة المباني والمعلومات (BIM)، الهندسة الجيوتقنية (التربة والأساسات)، وإدارة مشاريع البنية التحتية الضخمة. يعمل خريجو هذا التخصص في مشاريع الإعمار الكبرى في الأردن والخليج.",
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1200",
    icon: "Building2",
    color: "from-emerald-700 to-teal-600",
    accentColor: "#10b981",
    studyPlanUrl: "https://drive.google.com/uc?export=download&id=1EqRyk0m6DX9fk4OuaiDzOSp4i1GYg-Fb",
    hourPriceCompetitive: 30,
    hourPriceParallel: 60,
    expectedSalaryAr: "450 – 1,000 دينار (الأردن) | 1,800 – 6,000 دولار (الخليج)",
    careerFieldsAr: ["مدير موقع إنشائي", "مهندس تصميم إنشائي", "مساح طرق وكميات", "استشاري إدارة مشاريع PMP", "شركات المقاولات الكبرى"],
  },
  {
    id: "mechatronics",
    name: "Mechatronics Engineering",
    nameAr: "هندسة الميكاترونكس",
    description: "Combining mechanics, electronics, and smart control systems.",
    descriptionAr: "تخصص يجمع بين الميكانيك والإلكترونيات وأنظمة التحكم الذكية.",
    longDescriptionAr: "الميكاترونكس هو تخصص الثورة الصناعية الرابعة (Industry 4.0). يدمج هذا التخصص الهندسة الميكانيكية والكهربائية وعلوم الحاسوب لتصميم الروبوتات، المصانع الذكية، والسيارات ذاتية القيادة. يتعلم الطالب برمجة المتحكمات المنطقية (PLC)، تصميم أنظمة التحكم التلقائي، وتطوير الأنظمة الميكاترونية المتكاملة. الطلب على هذا التخصص في تصاعد مستمر مع توسع الأتمتة الصناعية عالمياً.",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200",
    icon: "Cpu",
    color: "from-indigo-600 to-blue-500",
    accentColor: "#6366f1",
    studyPlanUrl: "https://drive.google.com/uc?export=download&id=1Q822mseZERcWjQPcJ6OfeieJxYS3fmbb",
    hourPriceCompetitive: 30,
    hourPriceParallel: 60,
    expectedSalaryAr: "500 – 1,200 دينار (الأردن) | 2,500 – 7,500 دولار (الخليج)",
    careerFieldsAr: ["مهندس أتمتة وروبوتات", "مصمم أنظمة تحكم صناعية", "مهندس مصانع ذكية", "صيانة الأجهزة الطبية المتقدمة", "شركات التصنيع والبترول"],
  },
  {
    id: "computer",
    name: "Computer Engineering",
    nameAr: "هندسة الحاسوب",
    description: "Design and development of integrated computer systems and software.",
    descriptionAr: "تصميم وتطوير أنظمة الحاسوب والبرمجيات المتكاملة.",
    longDescriptionAr: "هندسة الحاسوب تجمع بين العتاد (Hardware) والبرمجيات (Software) في تخصص متكامل. يدرس الطالب تصميم المعالجات والدوائر الرقمية، أنظمة التشغيل، الأنظمة المدمجة (Embedded Systems)، وهندسة الشبكات. مع التحول الرقمي الشامل، يُصبح مهندس الحاسوب العقل المدبّر خلف كل البنية التقنية للشركات والحكومات، سواء في الحوسبة السحابية أو إنترنت الأشياء.",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200",
    icon: "Monitor",
    color: "from-violet-700 to-purple-600",
    accentColor: "#7c3aed",
    studyPlanUrl: "https://drive.google.com/uc?export=download&id=1TWhF4v_AhRAzE1zv9cnMFg7ZhcMYWEFB",
    hourPriceCompetitive: 30,
    hourPriceParallel: 60,
    expectedSalaryAr: "600 – 1,400 دينار (الأردن) | 3,000 – 8,500 دولار (الخليج)",
    careerFieldsAr: ["مطور أنظمة مدمجة", "مهندس سحابة Cloud", "مصمم شرائح VLSI", "مهندس IoT", "شركات التقنية والاتصالات"],
  },
  {
    id: "chemical",
    name: "Chemical Industries Engineering",
    nameAr: "هندسة الصناعات الكيميائية",
    description: "Transforming raw materials into useful products through chemical processes.",
    descriptionAr: "تحويل المواد الخام إلى منتجات مفيدة من خلال العمليات الكيميائية.",
    longDescriptionAr: "هندسة الصناعات الكيميائية تُحوّل المواد الخام إلى منتجات ذات قيمة عالية عبر عمليات كيميائية وفيزيائية دقيقة. يدرس الطالب عمليات الانتقال (نقل الحرارة والمادة)، تصميم المفاعلات الكيميائية، هندسة العمليات، والتحكم في الجودة. يعمل خريجو هذا التخصص في مصافي النفط، الصناعات الدوائية، صناعات الأغذية، ومعالجة المياه. يُركّز البرنامج حديثاً على الهندسة الخضراء والطاقة النظيفة.",
    imageUrl: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80&w=1200",
    icon: "FlaskConical",
    color: "from-rose-700 to-orange-600",
    accentColor: "#f43f5e",
    studyPlanUrl: "https://drive.google.com/uc?export=download&id=1levcmp9TvhT8UC4pSOr1Cj4JRT1MKRVb",
    hourPriceCompetitive: 30,
    hourPriceParallel: 60,
    expectedSalaryAr: "450 – 1,100 دينار (الأردن) | 2,000 – 6,500 دولار (الخليج)",
    careerFieldsAr: ["مهندس عمليات في مصافي النفط", "مهندس جودة في مصانع الأدوية", "مهندس معالجة مياه", "مهندس صناعات غذائية", "شركات البتروكيماويات"],
  },
  {
    id: "thermal",
    name: "Thermal & Hydraulic Machinery",
    nameAr: "الآلات الحرارية والهيدروليكية",
    description: "Specialising in energy systems, combustion, and fluid mechanics.",
    descriptionAr: "التخصص في أنظمة الطاقة والاحتراق والموائع.",
    longDescriptionAr: "تخصص الآلات الحرارية والهيدروليكية يُعمّق فهم الطالب لأنظمة تحويل الطاقة. يدرس الطالب التوربينات البخارية والغازية، المضخات الهيدروليكية، أنظمة الضغط العالي، وديناميكا الموائع التطبيقية. يُعدّ هذا التخصص الركيزة الأساسية لمحطات توليد الكهرباء والطاقة، مما يجعل خريجيه ضرورةً لا غنى عنها في قطاع الطاقة والبنية التحتية.",
    imageUrl: "https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&q=80&w=1200",
    icon: "Flame",
    color: "from-orange-700 to-red-600",
    accentColor: "#f97316",
    studyPlanUrl: "https://drive.google.com/uc?export=download&id=1pLsbPPffaT6KmmVXrpraLwHO8NI1KhYR",
    hourPriceCompetitive: 30,
    hourPriceParallel: 60,
    expectedSalaryAr: "500 – 1,200 دينار (الأردن) | 2,500 – 7,000 دولار (الخليج)",
    careerFieldsAr: ["مهندس محطات طاقة كهربائية", "متخصص توربينات وضواغط", "مصمم أنظمة هيدروليكية", "مهندس طاقة متجددة", "شركات النفط والغاز"],
  },
  {
    id: "telecom",
    name: "Telecommunications Engineering",
    nameAr: "هندسة الاتصالات",
    description: "Designing wireless and wired data transmission systems and global networks.",
    descriptionAr: "تصميم أنظمة نقل البيانات اللاسلكية والسلكية والشبكات العالمية.",
    longDescriptionAr: "هندسة الاتصالات هي النسيج الرقمي الذي يربط العالم. يدرس الطالب معالجة الإشارات الرقمية، تصميم الهوائيات، بروتوكولات الاتصالات اللاسلكية (4G/5G)، الألياف الضوئية، وأنظمة الأقمار الصناعية. مع التوسع الهائل في شبكات الجيل الخامس وإنترنت الأشياء، يُصبح مهندس الاتصالات في طليعة المهن الأكثر طلباً في العالم الرقمي.",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
    icon: "Radio",
    color: "from-sky-700 to-blue-600",
    accentColor: "#0ea5e9",
    studyPlanUrl: "https://drive.google.com/uc?export=download&id=1xuscuCeQXnRvlKl6hXrz8N_fNFH2do4l",
    hourPriceCompetitive: 30,
    hourPriceParallel: 60,
    expectedSalaryAr: "550 – 1,300 دينار (الأردن) | 2,800 – 8,000 دولار (الخليج)",
    careerFieldsAr: ["مهندس شبكات 5G", "متخصص اتصالات فضائية", "مهندس تردد راديوي RF", "مهندس ألياف ضوئية", "شركات الاتصالات الكبرى (Zain, Orange, Umniah)"],
  },
];

export interface SemesterCourses {
  semester: 1 | 2;
  labelAr: string;
  labelEn: string;
  courseIds: string[];
}

export interface YearCurriculum {
  year: number;
  labelAr: string;
  labelEn: string;
  semesters: SemesterCourses[];
}

const STANDARD_YEAR_1: SemesterCourses[] = [
  {
    semester: 1,
    labelAr: "الفصل الأول",
    labelEn: "Semester 1",
    courseIds: ["c6", "p101", "english101", "applied_arabic", "national_studies"],
  },
  {
    semester: 2,
    labelAr: "الفصل الثاني",
    labelEn: "Semester 2",
    courseIds: ["c2", "p102", "programming_cpp", "engineering_drawing", "english102"],
  },
];

export const majorCurriculum: Record<string, YearCurriculum[]> = {
  "common": [
    { year: 1, labelAr: "السنة الأولى", labelEn: "Year 1", semesters: STANDARD_YEAR_1 },
    {
      year: 2, labelAr: "السنة الثانية", labelEn: "Year 2",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["plab102", "stat101"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["islamic_culture", "diff_eq"] },
      ],
    },
  ],
  "network-security": [
    { year: 1, labelAr: "السنة الأولى", labelEn: "Year 1", semesters: STANDARD_YEAR_1 },
    {
      year: 2, labelAr: "السنة الثانية", labelEn: "Year 2",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["c1", "stat101"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["islamic_culture"] },
      ],
    },
  ],
  "mechanical": [
    { year: 1, labelAr: "السنة الأولى", labelEn: "Year 1", semesters: STANDARD_YEAR_1 },
    {
      year: 2, labelAr: "السنة الثانية", labelEn: "Year 2",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["c4", "c5"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["ee201"] },
      ],
    },
  ],
  "civil": [
    { year: 1, labelAr: "السنة الأولى", labelEn: "Year 1", semesters: STANDARD_YEAR_1 },
    {
      year: 2, labelAr: "السنة الثانية", labelEn: "Year 2",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["c4", "ce_surveying"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["ce_dynamics", "ce_strength"] },
      ],
    },
  ],
  "mechatronics": [
    { year: 1, labelAr: "السنة الأولى", labelEn: "Year 1", semesters: STANDARD_YEAR_1 },
    {
      year: 2, labelAr: "السنة الثانية", labelEn: "Year 2",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["c4", "c5"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["ee201"] },
      ],
    },
  ],
  "chemical": [
    { year: 1, labelAr: "السنة الأولى", labelEn: "Year 1", semesters: STANDARD_YEAR_1 },
    {
      year: 2, labelAr: "السنة الثانية", labelEn: "Year 2",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["c4", "c7"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["ee201"] },
      ],
    },
  ],
  "computer": [
    { year: 1, labelAr: "السنة الأولى", labelEn: "Year 1", semesters: STANDARD_YEAR_1 },
    {
      year: 2, labelAr: "السنة الثانية", labelEn: "Year 2",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["c1", "stat101"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["ee201"] },
      ],
    },
  ],
  "autotronics": [
    { year: 1, labelAr: "السنة الأولى", labelEn: "Year 1", semesters: STANDARD_YEAR_1 },
  ],
  "thermal": [
    { year: 1, labelAr: "السنة الأولى", labelEn: "Year 1", semesters: STANDARD_YEAR_1 },
  ],
  "telecom": [
    { year: 1, labelAr: "السنة الأولى", labelEn: "Year 1", semesters: STANDARD_YEAR_1 },
  ],
};

export function getMajorById(id: string): MajorInfo | undefined {
  return majorsData.find((m) => m.id === id);
}
