// Mock data for Murshid Hub.
import { announcements, Announcement } from './announcements';
export { announcements };
export type { Announcement };

export interface Faculty {
  id: string;
  name: string;
  nameAr: string;
  title: string;
  titleAr: string;
  department: string;
  specialization: string;
  specializationAr: string;
  office: string;
  email: string;
  teamsLink: string;
  phone?: string;
}

export const departments = [
  "Civil Engineering",
  "Electrical Engineering",
  "Computer Engineering",
  "Mechanical Engineering",
  "Chemical Engineering",
  "Industrial Engineering",
];

export const faculty: Faculty[] = [
  { id: "1", name: "Dr. Ahmad Al-Khatib", nameAr: "د. أحمد الخطيب", title: "Associate Professor", titleAr: "أستاذ مشارك", department: "Computer Engineering", specialization: "Artificial Intelligence", specializationAr: "الذكاء الاصطناعي", office: "E-204", email: "ahmad.khatib@bau.edu.jo", teamsLink: "https://teams.microsoft.com/l/chat/0/0?users=ahmad.khatib@bau.edu.jo" },
  { id: "2", name: "Dr. Layla Mansour", nameAr: "د. ليلى منصور", title: "Professor", titleAr: "أستاذ", department: "Electrical Engineering", specialization: "Power Systems", specializationAr: "أنظمة القوى", office: "E-118", email: "layla.mansour@bau.edu.jo", teamsLink: "https://teams.microsoft.com/l/chat/0/0?users=layla.mansour@bau.edu.jo" },
  { id: "3", name: "Dr. Omar Haddad", nameAr: "د. عمر حداد", title: "Assistant Professor", titleAr: "أستاذ مساعد", department: "Civil Engineering", specialization: "Structural Analysis", specializationAr: "التحليل الإنشائي", office: "C-301", email: "omar.haddad@bau.edu.jo", teamsLink: "https://teams.microsoft.com/l/chat/0/0?users=omar.haddad@bau.edu.jo" },
  { id: "4", name: "Dr. Sara Nimri", nameAr: "د. سارة النمري", title: "Associate Professor", titleAr: "أستاذ مشارك", department: "Mechanical Engineering", specialization: "Thermodynamics", specializationAr: "الديناميكا الحرارية", office: "M-210", email: "sara.nimri@bau.edu.jo", teamsLink: "https://teams.microsoft.com/l/chat/0/0?users=sara.nimri@bau.edu.jo" },
  { id: "5", name: "Dr. Yousef Saleh", nameAr: "د. يوسف صالح", title: "Professor", titleAr: "أستاذ", department: "Chemical Engineering", specialization: "Process Design", specializationAr: "تصميم العمليات", office: "Ch-105", email: "yousef.saleh@bau.edu.jo", teamsLink: "https://teams.microsoft.com/l/chat/0/0?users=yousef.saleh@bau.edu.jo" },
  { id: "6", name: "Dr. Rana Awad", nameAr: "د. رنا عوض", title: "Assistant Professor", titleAr: "أستاذ مساعد", department: "Industrial Engineering", specialization: "Operations Research", specializationAr: "بحوث العمليات", office: "I-220", email: "rana.awad@bau.edu.jo", teamsLink: "https://teams.microsoft.com/l/chat/0/0?users=rana.awad@bau.edu.jo" },
  { id: "7", name: "Dr. Khalid Tarawneh", nameAr: "د. خالد الطراونة", title: "Associate Professor", titleAr: "أستاذ مشارك", department: "Computer Engineering", specialization: "Embedded Systems", specializationAr: "الأنظمة المدمجة", office: "E-208", email: "khalid.t@bau.edu.jo", teamsLink: "https://teams.microsoft.com/l/chat/0/0?users=khalid.t@bau.edu.jo" },
  { id: "8", name: "Dr. Hala Zoubi", nameAr: "د. هلا الزعبي", title: "Professor", titleAr: "أستاذ", department: "Civil Engineering", specialization: "Geotechnical Engineering", specializationAr: "هندسة جيوتقنية", office: "C-310", email: "hala.zoubi@bau.edu.jo", teamsLink: "https://teams.microsoft.com/l/chat/0/0?users=hala.zoubi@bau.edu.jo" },
];

export interface Major {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  longDescription: string;
  longDescriptionAr: string;
  degrees: string;
  degreesAr: string;
  fields: string;
  fieldsAr: string;
  salaries: string;
  salariesAr: string;
  salaryJordanAr: string;
  salaryGCCAr: string;
  salaryIntlAr: string;
  imageUrl: string;
  icon: string;
  color: string;
}

export const majors: Major[] = [
  {
    id: "chemical",
    name: "Chemical Engineering",
    nameAr: "الهندسة الكيميائية",
    description: "The science of transforming raw materials into high-value products.",
    descriptionAr: "علم تحويل المواد الخام إلى منتجات ذات قيمة عالية في قطاعات النفط والدواء والغذاء.",
    longDescription: "Chemical Engineering applies engineering sciences to solve manufacturing process problems and design chemical processes for safe and efficient production.",
    longDescriptionAr: "علم تحويل المواد الخام إلى منتجات ذات قيمة عالية. يشمل التخصص هندسة العمليات، البتروكيماويات، الصناعات الغذائية، والدوائية. يركز التخصص حديثاً على الهندسة الخضراء وإنتاج الطاقة النظيفة، مما يجعل خريجي البوليتكنك رواداً في استدامة الموارد وتطوير تقنيات الإنتاج الصناعي الآمنة والفعالة.",
    degrees: "BSc in Chemical Industries Engineering, Diploma in Chemical Industries Technology.",
    degreesAr: "بكالوريوس هندسة الصناعات الكيميائية، دبلوم تكنولوجيا الصناعات الكيميائية.",
    fields: "Oil refining, Pharmaceutical manufacturing, Water treatment, Food industry quality management.",
    fieldsAr: "هندسة تكرير النفط، التصنيع الدوائي، معالجة المياه والبيئة، إدارة الجودة في مصانع الأغذية.",
    salaries: "Jordan: 450-1,100 JOD, Gulf: 2,000-6,500 USD, International: 4,000-8,000 EUR.",
    salariesAr: "الأردن: 450 - 1,100 دينار، الخليج: 2,000 - 6,500 دولار، عالمياً: 4,000 - 8,000 يورو.",
    salaryJordanAr: "450 - 1,100 دينار أردني",
    salaryGCCAr: "2,000 - 6,500 دولار",
    salaryIntlAr: "4,000 - 8,000 يورو",
    imageUrl: "https://images.unsplash.com/photo-1518709779341-56cf4535e94a?auto=format&fit=crop&q=80&w=1200",
    icon: "FlaskConical",
    color: "from-rose-700 to-orange-600",
  },
  {
    id: "mechatronics",
    name: "Mechatronics Engineering",
    nameAr: "هندسة الميكاترونكس",
    description: "Integrating intelligence of programming with power of mechanics and precision of electronics.",
    descriptionAr: "التخصص الذي يجمع بين ذكاء البرمجة وقوة الميكانيك ودقة الإلكترونيات لصناعة المستقبل.",
    longDescription: "Mechatronics Engineering integrates mechanical, electrical, and computer systems to build the smart factories, autonomous vehicles, and robotic systems of tomorrow.",
    longDescriptionAr: "التخصص الذي يجمع بين ذكاء البرمجة وقوة الميكانيك ودقة الإلكترونيات. في عصر الأتمتة والروبوتات، يلعب مهندس الميكاترونكس الدور الرئيسي في تصميم المصانع الذكية، السيارات ذاتية القيادة، والأنظمة الروبوتية الطبية. البرنامج يركز على التطبيقات العملية لبرمجة الـ PLC والمتحكمات الدقيقة، مما يفتح آفاقاً لا حدود لها في الثورة الصناعية الرابعة.",
    degrees: "MSc and BSc in Mechatronics Engineering, Diploma in Industrial Control.",
    degreesAr: "ماجستير وبكالوريوس هندسة الميكاترونكس، دبلوم تكنولوجيا التحكم الصناعي.",
    fields: "Automation & Robotics, Control Systems Design, Automotive Engineering, Medical Device Maintenance.",
    fieldsAr: "مهندس أتمتة وروبوتات، مصمم أنظمة تحكم، هندسة السيارات الحديثة، صيانة الأجهزة الطبية المتقدمة.",
    salaries: "Jordan: 500-1,200 JOD, Gulf: 2,500-7,500 USD, International: 4,500-9,000 EUR.",
    salariesAr: "الأردن: 500 - 1,200 دينار، الخليج: 2,500 - 7,500 دولار، عالمياً: 4,500 - 9,000 يورو.",
    salaryJordanAr: "500 - 1,200 دينار أردني",
    salaryGCCAr: "2,500 - 7,500 دولار",
    salaryIntlAr: "4,500 - 9,000 يورو",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200",
    icon: "Cpu",
    color: "from-indigo-600 to-blue-500",
  },
  {
    id: "civil",
    name: "Civil Engineering",
    nameAr: "الهندسة المدنية",
    description: "The backbone of infrastructure and urban growth — from bridges to smart cities.",
    descriptionAr: "العمود الفقري للبنية التحتية والنمو العمراني — من الجسور والطرق إلى المدن الذكية.",
    longDescription: "Civil Engineering covers the design of bridges, roads, dams, and skyscrapers, with a focus on BIM technology and geotechnical challenges of modern construction.",
    longDescriptionAr: "العمود الفقري للبنية التحتية والنمو العمراني. يشمل تصميم الجسور، الطرق، السدود، وناطحات السحاب. يركز البرنامج على إدارة المشاريع الهندسية الضخمة واستخدام تكنولوجيا نمذجة معلومات المباني (BIM)، مع اهتمام خاص بالهندسة الجيوتقنية والإنشائية لمواجهة تحديات البناء الحديث في المدن الذكية.",
    degrees: "BSc in Civil Engineering, Roads and Bridges. Diplomas in Architecture, Building Tech, Quantity Surveying.",
    degreesAr: "بكالوريوس الهندسة المدنية، هندسة الطرق والجسور. دبلوم هندسة العمارة، تكنولوجيا المباني، مساحة الطرق وحساب الكميات.",
    fields: "Construction Site Manager, Structural Design Engineer, Road Surveyor, Project Management Consultant.",
    fieldsAr: "مدير موقع إنشائي، مهندس تصميم إنشائي، مساح طرق، استشاري إدارة مشاريع (PMP).",
    salaries: "Jordan: 450-1,000 JOD, Gulf: 1,800-6,000 USD, International: 3,500-7,500 EUR.",
    salariesAr: "الأردن: 450 - 1,000 دينار، الخليج: 1,800 - 6,000 دولار، عالمياً: 3,500 - 7,500 يورو.",
    salaryJordanAr: "450 - 1,000 دينار أردني",
    salaryGCCAr: "1,800 - 6,000 دولار",
    salaryIntlAr: "3,500 - 7,500 يورو",
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1200",
    icon: "Building2",
    color: "from-emerald-700 to-teal-600",
  },
  {
    id: "mechanical",
    name: "Mechanical Engineering",
    nameAr: "الهندسة الميكانيكية",
    description: "The broadest discipline — covering everything that moves in our world.",
    descriptionAr: "التخصص الأشمل الذي يغطي كل ما يتحرك — من المحركات الحرارية إلى مركبات الطاقة المتجددة.",
    longDescription: "Mechanical Engineering covers thermal engines, HVAC, aviation, and renewable energy systems. Students learn CAD/CAM design and electric vehicle maintenance.",
    longDescriptionAr: "التخصص الأشمل الذي يغطي كل ما يتحرك في عالمنا. من تصميم المحركات الحرارية وأنظمة التكييف إلى هندسة الطيران والطاقة المتجددة. يتعلم الطالب في البوليتكنك أحدث أساليب التصميم بمساعدة الحاسوب (CAD/CAM) وصيانة المركبات الكهربائية والهجينة، ليكون مستعداً لقيادة قطاع الطاقة والنقل في المستقبل.",
    degrees: "BSc in General Mechanical, Renewable Energy, Autotronics, HVAC.",
    degreesAr: "الهندسة الميكانيكية العامة، الطاقة المتجددة، الأوتوترونكس، التكييف والتبريد، صيانة المركبات الكهربائية والهجينة.",
    fields: "HVAC Engineering, Aircraft Maintenance, Solar & Wind Energy, Electric Vehicle Engineering.",
    fieldsAr: "هندسة التكييف والتبريد، صيانة الطائرات، قطاع الطاقة الشمسية والرياح، هندسة السيارات الكهربائية.",
    salaries: "Jordan: 500-1,300 JOD, Gulf: 2,200-7,000 USD, International: 4,000-8,500 EUR.",
    salariesAr: "الأردن: 500 - 1,300 دينار، الخليج: 2,200 - 7,000 دولار، عالمياً: 4,000 - 8,500 يورو.",
    salaryJordanAr: "500 - 1,300 دينار أردني",
    salaryGCCAr: "2,200 - 7,000 دولار",
    salaryIntlAr: "4,000 - 8,500 يورو",
    imageUrl: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=1200",
    icon: "Cog",
    color: "from-stone-700 to-zinc-600",
  },
  {
    id: "electrical_computer",
    name: "Electrical, Computer & Network Engineering",
    nameAr: "الهندسة الكهربائية وهندسة الحاسوب والشبكات",
    description: "The core engine of the digital world — cybersecurity, cloud computing, and IoT.",
    descriptionAr: "المحرك الأساسي للعالم الرقمي — أمن سيبراني، حوسبة سحابية، وإنترنت الأشياء.",
    longDescription: "This department leads in graduating engineers specialized in electrical power, computer networking, cybersecurity, and advanced communications.",
    longDescriptionAr: "يعتبر هذا القسم المحرك الأساسي للعالم الرقمي الحديث. يركز التخصص على دمج عتاد الحاسوب مع الأنظمة البرمجية المتقدمة، مع تركيز مكثف على أمن الشبكات، الحوسبة السحابية، وإنترنت الأشياء (IoT). يتعلم الطالب كيفية تصميم البنى التحتية للبيانات وحمايتها من التهديدات السيبرانية، مما يجعله المهندس الأكثر طلباً في سوق العمل التقني لعام 2026.",
    degrees: "BSc in Computer & Networks, Electrical Power, Communications.",
    degreesAr: "بكالوريوس هندسة الحاسوب والشبكات، هندسة الطاقة الكهربائية، هندسة الاتصالات. دبلوم شبكات الحاسوب، أمن المعلومات، الاتصالات.",
    fields: "Cybersecurity Engineer, Cloud Network Manager, Embedded Systems Developer, Solutions Architect.",
    fieldsAr: "مهندس أمن سيبراني، مدير شبكات سحابية، مطور أنظمة مدمجة، مهندس حلول تقنية (Solutions Architect).",
    salaries: "Jordan: 600-1,400 JOD, Gulf: 3,000-8,500 USD, International: 5,000-10,000 EUR.",
    salariesAr: "الأردن: 600 - 1,400 دينار، الخليج: 3,000 - 8,500 دولار، عالمياً: 5,000 - 10,000 يورو.",
    salaryJordanAr: "600 - 1,400 دينار أردني",
    salaryGCCAr: "3,000 - 8,500 دولار",
    salaryIntlAr: "5,000 - 10,000 يورو",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=1200",
    icon: "Zap",
    color: "from-amber-600 to-yellow-500",
  },

  {
    id: "autotronics",
    name: "Autotronics Engineering",
    nameAr: "هندسة الأوتوترونكس",
    description: "The intersection of electronics and automotive engineering.",
    descriptionAr: "نقطة التقاء الإلكترونيات وهندسة السيارات الحديثة.",
    longDescription: "Autotronics involves the electronics and control systems in modern vehicles, especially EVs and Hybrid systems.",
    longDescriptionAr: "يركز تخصص الأوتوترونكس على الأنظمة الإلكترونية وأنظمة التحكم في السيارات الحديثة، مع تركيز مكثف على السيارات الكهربائية (EV) والأنظمة الهجينة. يتعلم الطالب كيفية تشخيص وإصلاح الأعطال الإلكترونية المعقدة.",
    degrees: "BSc in Autotronics, Diploma in Hybrid Vehicle Maintenance.",
    degreesAr: "بكالوريوس الأوتوترونكس، دبلوم صيانة السيارات الهجينة والكهربائية.",
    fields: "Automotive Electronics Engineer, EV Specialist, Diagnostic Technician.",
    fieldsAr: "مهندس إلكترونيات سيارات، اختصاصي سيارات كهربائية، فني تشخيص أعطال متقدم.",
    salaries: "Jordan: 450-1,100 JOD, Gulf: 2,000-6,000 USD, International: 3,500-8,000 EUR.",
    salariesAr: "الأردن: 450 - 1,100 دينار، الخليج: 2,000 - 6,000 دولار، عالمياً: 3,500 - 8,000 يورو.",
    salaryJordanAr: "450 - 1,100 دينار أردني",
    salaryGCCAr: "2,000 - 6,000 دولار",
    salaryIntlAr: "3,500 - 8,000 يورو",
    imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=1200",
    icon: "Car",
    color: "from-blue-700 to-cyan-600",
  }
];


export interface Course {
  id: string;
  code: string;
  name: string;
  nameAr: string;
  hours: number;
  department: string;
  category?: string;
  instructors?: string[];
}

export const courses: Course[] = [
  // --- الرياضيات الهندسية المشتركة (math) ---
  { id: "c6", code: "MATH 101", name: "Calculus I", nameAr: "تفاضل وتكامل 1", hours: 3, department: "General", category: "math", instructors: ["د. كامل فليفل", "د. أحمد جروان"] },
  { id: "c2", code: "MATH 102", name: "Calculus II", nameAr: "تفاضل وتكامل 2", hours: 3, department: "General", category: "math", instructors: ["د. كامل فليفل", "م. أنس أبو زهرة"] },
  { id: "stat101", code: "STAT 101", name: "Probability & Statistics", nameAr: "الاحتمالات والإحصاء", hours: 3, department: "General", category: "math", instructors: ["د. محمد فؤاد", "م. محمود زيدان"] },
  { id: "numerical", code: "MATH 301", name: "Numerical Techniques", nameAr: "تقنيات عددية", hours: 3, department: "General", category: "math" },
  { id: "linear_algebra", code: "MATH 201", name: "Linear Algebra", nameAr: "جبر خطي", hours: 3, department: "General", category: "math" },
  { id: "diff_eq", code: "MATH 203", name: "Differential Equations I", nameAr: "معادلات تفاضلية 1", hours: 3, department: "General", category: "math" },

  // --- فيزياء وهندسة أساسية (physics) ---
  { id: "p101", code: "PHYS 101", name: "Physics I", nameAr: "فيزياء 1", hours: 3, department: "General", category: "physics", instructors: ["د. أنور الشيشاني", "د. أحمد عوض الله"] },
  { id: "plab101", code: "PHYS 111", name: "Physics Lab I", nameAr: "مختبر فيزياء 1", hours: 1, department: "General", category: "physics", instructors: ["د. أنور الشيشاني"] },
  { id: "electronics", code: "EE 331", name: "Electronics I", nameAr: "الإلكترونيات 1", hours: 3, department: "Electrical Engineering", category: "physics" },
  { id: "c4", code: "CE 211", name: "Statics", nameAr: "الاستاتيكا", hours: 3, department: "Civil Engineering", category: "physics" },
  { id: "p102", code: "PHYS 102", name: "Physics II", nameAr: "فيزياء 2", hours: 3, department: "General", category: "physics", instructors: ["د. أحمد عوض الله", "أ. وسيم الحوامدة"] },
  { id: "plab102", code: "PHYS 112", name: "Physics Lab 2", nameAr: "مختبر الفيزياء العامة 2", hours: 1, department: "General", category: "physics" },

  // --- مواد الكيمياء (chemistry) ---
  { id: "chem101", code: "CHEM 101", name: "General Chemistry", nameAr: "كيمياء عامة", hours: 3, department: "General", category: "chemistry" },
  { id: "chemlab101", code: "CHEM 111", name: "Chemistry Lab 1", nameAr: "مختبر الكيمياء العامة 1", hours: 1, department: "General", category: "chemistry" },

  // --- حاسوب وهندسة عملية (computing) ---
  { id: "cs99", code: "CS 99", name: "Remedial Computer", nameAr: "حاسوب استدراكي", hours: 0, department: "General", category: "computing" },
  { id: "cs101", code: "CS 101", name: "Computer Skills", nameAr: "مهارات الحاسوب", hours: 3, department: "General", category: "computing" },
  { id: "engineering_drawing", code: "ME 102", name: "Engineering Drawing", nameAr: "رسم هندسي", hours: 2, department: "Mechanical Engineering", category: "computing" },
  { id: "programming_cpp", code: "CPE 150", name: "Computer Programming for Engineers (C++)", nameAr: "البرمجة للمهندسين (C++)", hours: 3, department: "Computer Engineering", category: "computing", instructors: ["م. فتحي علان"] },

  // --- مواد مساندة هندسية (support) ---
  { id: "ee201", code: "EE 201", name: "Engineering Economy", nameAr: "الاقتصاد الهندسي", hours: 3, department: "Industrial Engineering", category: "support" },

  // --- ثقافة عامة (culture) ---
  { id: "national_studies", code: "NS 101", name: "National Studies", nameAr: "التربية الوطنية", hours: 3, department: "General", category: "culture" },
  { id: "islamic_culture", code: "IS 101", name: "Islamic Culture", nameAr: "الثقافة الإسلامية", hours: 3, department: "General", category: "culture" },
  { id: "caliphs", code: "IS 102", name: "Rightly Guided Caliphs", nameAr: "خلفاء راشدين", hours: 3, department: "General", category: "culture" },
  { id: "isl101", code: "ISL 101", name: "Islam and Life", nameAr: "إسلام وحياة", hours: 3, department: "General", category: "culture" },

  // --- اللغة العربية (arabic) ---
  { id: "ar99", code: "AR 99", name: "Remedial Arabic", nameAr: "عربي استدراكي", hours: 3, department: "General", category: "arabic" },
  { id: "applied_arabic", code: "AR 101", name: "Applied Arabic", nameAr: "اللغة العربية التطبيقية", hours: 3, department: "General", category: "arabic" },

  // --- المهارات والتطوير (skills) ---
  { id: "entrepreneurship", code: "ENT 101", name: "Innovation & Entrepreneurship", nameAr: "الابتكار والريادة", hours: 3, department: "General", category: "skills" },
  { id: "military_science", code: "MIL 101", name: "Military Science", nameAr: "العلوم العسكرية", hours: 3, department: "General", category: "skills" },

  // --- اللغة الإنجليزية (english) ---
  { id: "eng99", code: "ENG 99", name: "English 99", nameAr: "إنجليزي 99", hours: 3, department: "General", category: "english" },
  { id: "english101", code: "ENG 101", name: "English Communication Skills I", nameAr: "اللغة الإنجليزية 1", hours: 3, department: "General", category: "english" },
  { id: "english102", code: "ENG 102", name: "English Communication Skills II", nameAr: "اللغة الإنجليزية 2", hours: 3, department: "General", category: "english" },

  // --- Other Subjects ---
  { id: "circuit1", code: "EE 241", name: "Electric Circuits I", nameAr: "دوائر كهربائية 1", hours: 3, department: "Electrical Engineering", category: "physics" },
  { id: "c5", code: "ME 221", name: "Thermodynamics", nameAr: "الديناميكا الحرارية", hours: 3, department: "Mechanical Engineering", category: "physics" },
  { id: "c7", code: "CHE 201", name: "Mass & Energy Balances", nameAr: "موازين المادة والطاقة", hours: 3, department: "Chemical Engineering", category: "physics" },
  { id: "c8", code: "IE 301", name: "Operations Research", nameAr: "بحوث العمليات", hours: 3, department: "Industrial Engineering", category: "math" },
  { id: "technical_writing", code: "ENG 201", name: "Technical Writing & Prof. Ethics", nameAr: "الكتابة التقنية والأخلاقيات المهنية", hours: 3, department: "General", category: "english" },
  { id: "engineering_workshop", code: "ME 101", name: "Engineering Workshops", nameAr: "المشاغل الهندسية", hours: 1, department: "Mechanical Engineering", category: "computing" },
  { id: "ce_surveying", code: "CE 221", name: "Surveying", nameAr: "المساحة", hours: 3, department: "Civil Engineering", category: "physics" },
  { id: "ce_dynamics", code: "CE 212", name: "Dynamics", nameAr: "ديناميكا", hours: 3, department: "Civil Engineering", category: "physics" },
  { id: "ce_fluids", code: "CE 341", name: "Fluid Mechanics", nameAr: "ميكانيكا الموائع", hours: 3, department: "Civil Engineering", category: "physics" },
  { id: "ce_strength", code: "CE 213", name: "Strength of Materials", nameAr: "مقاومة المواد", hours: 3, department: "Civil Engineering", category: "physics" },
  { id: "ce_structural1", code: "CE 311", name: "Structural Analysis I", nameAr: "تحليل إنشائي 1", hours: 3, department: "Civil Engineering", category: "physics" },
  { id: "ce_roads", code: "CE 321", name: "Road Engineering", nameAr: "هندسة الطرق", hours: 3, department: "Civil Engineering", category: "physics" },
  { id: "ce_traffic", code: "CE 322", name: "Traffic Engineering", nameAr: "هندسة المرور", hours: 3, department: "Civil Engineering", category: "physics" },
  { id: "ce_geology", code: "CE 201", name: "Engineering Geology", nameAr: "الجيولوجيا الهندسية", hours: 3, department: "Civil Engineering", category: "physics" },
  { id: "ce_surveying_lab", code: "CE 222", name: "Surveying Lab", nameAr: "مختبر مساحة", hours: 1, department: "Civil Engineering", category: "physics" },
  { id: "ce_geology_lab", code: "CE 202", name: "Geology Lab", nameAr: "مختبر الجيولوجيا الهندسية", hours: 1, department: "Civil Engineering", category: "physics" },
  { id: "ce_concrete_props", code: "CE 313", name: "Concrete Properties", nameAr: "خواص الخرسانة", hours: 3, department: "Civil Engineering", category: "physics" },
  { id: "ce_geotechnical", code: "CE 331", name: "Geotechnical Engineering", nameAr: "الهندسة الجيوتقنية", hours: 3, department: "Civil Engineering", category: "physics" },
  { id: "ce_geotechnical_lab", code: "CE 332", name: "Geotechnical Lab", nameAr: "مختبر الهندسة الجيوتقنية", hours: 1, department: "Civil Engineering", category: "physics" },
  { id: "ce_concrete_lab", code: "CE 314", name: "Concrete Lab", nameAr: "مختبر خواص الخرسانة", hours: 1, department: "Civil Engineering", category: "physics" },
  { id: "eng_applied_math", code: "MATH 302", name: "Applied Mathematics for Engineers", nameAr: "الرياضيات التطبيقية للمهندسين", hours: 3, department: "General", category: "math" },
  { id: "ce_structural2", code: "CE 312", name: "Structural Analysis II", nameAr: "تحليل إنشائي 2", hours: 3, department: "Civil Engineering", category: "physics" },
  { id: "ce_hydraulics", code: "CE 342", name: "Hydraulics Engineering", nameAr: "هندسة مائيات", hours: 3, department: "Civil Engineering", category: "physics" },
  { id: "ce_water_treatment", code: "CE 351", name: "Water Treatment", nameAr: "معالجة مياه", hours: 3, department: "Civil Engineering", category: "physics" },
  { id: "ce_hydraulics_lab", code: "CE 343", name: "Hydraulics Lab", nameAr: "مختبر هندسة مائيات", hours: 1, department: "Civil Engineering", category: "physics" },
  { id: "ce_concrete1", code: "CE 411", name: "Reinforced Concrete I", nameAr: "تصميم الخرسانة المسلحة 1", hours: 3, department: "Civil Engineering", category: "physics" },
  { id: "ce_hydrology", code: "CE 441", name: "Engineering Hydrology", nameAr: "الهيدرولوجيا الهندسية", hours: 3, department: "Civil Engineering", category: "physics" },
  { id: "ce_environment", code: "CE 451", name: "Environmental Engineering", nameAr: "هندسة البيئة", hours: 3, department: "Civil Engineering", category: "physics" },
  { id: "ce_environment_lab", code: "CE 452", name: "Environmental Lab", nameAr: "مختبر هندسة البيئة", hours: 1, department: "Civil Engineering", category: "physics" },
  { id: "ce_concrete2", code: "CE 412", name: "Reinforced Concrete II", nameAr: "تصميم الخرسانة المسلحة 2", hours: 3, department: "Civil Engineering", category: "physics" },
  { id: "ce_specs", code: "CE 421", name: "Specifications, Contracts & Quantities", nameAr: "المواصفات والعقود وحساب الكميات", hours: 3, department: "Civil Engineering", category: "support" },
  { id: "ce_steel", code: "CE 413", name: "Steel Structures", nameAr: "منشآت فولاذية", hours: 3, department: "Civil Engineering", category: "physics" },
  { id: "ce_pavements", code: "CE 422", name: "Pavement Design", nameAr: "تصميم الرصفات", hours: 3, department: "Civil Engineering", category: "physics" },
  { id: "ce_civil_drawing", code: "CE 401", name: "Civil Drawing", nameAr: "الرسم المدني", hours: 1, department: "Civil Engineering", category: "computing" },
  { id: "ce_pavement_lab", code: "CE 423", name: "Pavement Lab", nameAr: "مختبر الرصفات", hours: 1, department: "Civil Engineering", category: "physics" },
  { id: "ce_construction_mgmt", code: "CE 521", name: "Construction Management", nameAr: "إدارة إنشاء", hours: 3, department: "Civil Engineering", category: "support" },
  { id: "ce_project_mgmt", code: "CE 522", name: "Project Management", nameAr: "إدارة مشاريع", hours: 3, department: "Civil Engineering", category: "support" },
  { id: "ce_foundations", code: "CE 531", name: "Foundation Engineering", nameAr: "هندسة الأساسيات", hours: 3, department: "Civil Engineering", category: "physics" },
  { id: "ce_project1", code: "CE 591", name: "Graduation Project I", nameAr: "مشروع 1", hours: 1, department: "Civil Engineering", category: "support" },
  { id: "ce_training", code: "CE 590", name: "Field Training", nameAr: "التدريب الميداني", hours: 3, department: "Civil Engineering", category: "support" },
  { id: "ce_comp_apps", code: "CE 501", name: "Computer Applications in Civil Engineering", nameAr: "تطبيقات حاسوب في الهندسة المدنية", hours: 3, department: "Civil Engineering", category: "computing" },
  { id: "ce_project2", code: "CE 592", name: "Graduation Project II", nameAr: "مشروع 2", hours: 3, department: "Civil Engineering", category: "support" },
  { id: "ce_elective_1", code: "CE ELEC", name: "Major Elective I", nameAr: "متطلب تخصص اختياري", hours: 3, department: "Civil Engineering", category: "physics" },
  { id: "ce_elective_2", code: "CE ELEC", name: "Major Elective II", nameAr: "متطلب تخصص اختياري", hours: 3, department: "Civil Engineering", category: "physics" },
  { id: "ce_elective_3", code: "CE ELEC", name: "Major Elective III", nameAr: "متطلب تخصص اختياري", hours: 3, department: "Civil Engineering", category: "physics" },
  { id: "ce_tunnels", code: "CE 532", name: "Tunnel Engineering", nameAr: "هندسة الأنفاق", hours: 3, department: "Civil Engineering", category: "physics" },
  { id: "ce_safety", code: "CE 523", name: "Occupational Safety", nameAr: "السلامة المهنية", hours: 2, department: "Civil Engineering", category: "support" },
  { id: "ce_airports_railways", code: "CE 524", name: "Airport & Railway Engineering", nameAr: "هندسة مطارات وسكك حديدية", hours: 3, department: "Civil Engineering", category: "physics" },
  { id: "ce_pavement_rehab", code: "CE 525", name: "Road & Pavement Rehabilitation", nameAr: "تأهيل الطرق والرصفات", hours: 3, department: "Civil Engineering", category: "physics" },
  { id: "ce_bridges", code: "CE 515", name: "Bridge Engineering", nameAr: "هندسة الجسور", hours: 3, department: "Civil Engineering", category: "physics" },
  { id: "ce_prestressed", code: "CE 516", name: "Prestressed Concrete", nameAr: "خرسانة مسبقة الإجهاد", hours: 3, department: "Civil Engineering", category: "physics" },
  { id: "ce_seismic", code: "CE 517", name: "Introduction to Earthquake Engineering", nameAr: "مقدمة في هندسة الزلازل", hours: 3, department: "Civil Engineering", category: "physics" },
  { id: "ce_rehab_concrete", code: "CE 518", name: "Rehabilitation of Concrete Structures", nameAr: "تأهيل منشآت خرسانية", hours: 3, department: "Civil Engineering", category: "physics" },
  { id: "ce_advanced_structural", code: "CE 519", name: "Advanced Structural Analysis", nameAr: "تحليل إنشائي متقدم", hours: 3, department: "Civil Engineering", category: "physics" },
  { id: "ce_its", code: "CE 526", name: "Intelligent Transportation Systems", nameAr: "أنظمة النقل الذكية", hours: 3, department: "Civil Engineering", category: "physics" },
  { id: "ce_building_construction", code: "CE 315", name: "Building Construction", nameAr: "إنشاء مباني", hours: 3, department: "Civil Engineering", category: "physics" },
  { id: "ce_urban_transit", code: "CE 527", name: "Urban Transportation", nameAr: "النقل الحضري", hours: 3, department: "Civil Engineering", category: "physics" },
  { id: "auto_materials_science", code: "ME 211", name: "Materials Science", nameAr: "علم المواد", hours: 3, department: "Mechanical Engineering", category: "physics" },
  { id: "auto_thermo_lab", code: "ME 222", name: "Thermodynamics Lab", nameAr: "مختبر ديناميكا حرارية", hours: 1, department: "Mechanical Engineering", category: "physics" },
  { id: "auto_mech_drawing", code: "ME 201", name: "Mechanical Drawing", nameAr: "رسم ميكانيكي", hours: 2, department: "Mechanical Engineering", category: "computing" },
  { id: "auto_machines_theory", code: "ME 311", name: "Theory of Machines", nameAr: "نظرية الآلات", hours: 3, department: "Mechanical Engineering", category: "physics" },
  { id: "auto_mech_design1", code: "ME 312", name: "Mechanical Design I", nameAr: "تصميم ميكانيكي 1", hours: 3, department: "Mechanical Engineering", category: "physics" },
  { id: "auto_circuits", code: "EE 301", name: "Electric & Electronic Circuits", nameAr: "دوائر كهربائية وإلكترونية", hours: 3, department: "Electrical Engineering", category: "physics" },
  { id: "auto_machines_lab", code: "ME 313", name: "Machines Lab", nameAr: "مختبر نظرية الآلات", hours: 1, department: "Mechanical Engineering", category: "physics" },
  { id: "auto_strength_lab", code: "ME 214", name: "Strength of Materials Lab", nameAr: "مختبر مقاومة المواد", hours: 1, department: "Mechanical Engineering", category: "physics" },
  { id: "auto_fluids_lab", code: "ME 342", name: "Fluid Mechanics Lab", nameAr: "مختبر ميكانيكا الموائع", hours: 1, department: "Mechanical Engineering", category: "physics" },
  { id: "auto_circuits_lab", code: "EE 302", name: "Circuits & Electronics Lab", nameAr: "مختبر دوائر كهربائية وإلكترونية", hours: 1, department: "Electrical Engineering", category: "physics" },
  { id: "auto_measurements", code: "ME 331", name: "Engineering Measurements", nameAr: "القياسات الهندسية", hours: 3, department: "Mechanical Engineering", category: "physics" },
  { id: "auto_heat_transfer", code: "ME 321", name: "Heat Transfer", nameAr: "انتقال الحرارة", hours: 3, department: "Mechanical Engineering", category: "physics" },
  { id: "auto_fundamentals", code: "AT 301", name: "Autotronics Fundamentals", nameAr: "أساسيات الأوتوترونكس", hours: 3, department: "Autotronics Engineering", category: "physics" },
  { id: "auto_vibrations", code: "ME 411", name: "Mechanical Vibrations", nameAr: "اهتزازات ميكانيكية", hours: 3, department: "Mechanical Engineering", category: "physics" },
  { id: "auto_control", code: "ME 431", name: "Automatic Control", nameAr: "التحكم الآلي", hours: 3, department: "Mechanical Engineering", category: "physics" },
  { id: "auto_engineering", code: "AT 411", name: "Automotive Engineering", nameAr: "هندسة السيارات", hours: 3, department: "Autotronics Engineering", category: "physics" },
  { id: "auto_ice", code: "ME 421", name: "Internal Combustion Engines", nameAr: "محركات احتراق داخلي", hours: 3, department: "Mechanical Engineering", category: "physics" },
  { id: "auto_heat_transfer_lab", code: "ME 322", name: "Heat Transfer Lab", nameAr: "مختبر انتقال الحرارة", hours: 1, department: "Mechanical Engineering", category: "physics" },
  { id: "auto_control_vib_lab", code: "ME 432", name: "Control & Vibrations Lab", nameAr: "مختبر التحكم والاهتزازات", hours: 1, department: "Mechanical Engineering", category: "physics" },
  { id: "auto_measurements_lab", code: "ME 332", name: "Measurements Lab", nameAr: "مختبر القياسات الهندسية", hours: 1, department: "Mechanical Engineering", category: "physics" },
  { id: "auto_eng_lab", code: "AT 412", name: "Automotive Engineering Lab", nameAr: "مختبر هندسة سيارات", hours: 1, department: "Autotronics Engineering", category: "physics" },
  { id: "auto_vehicle_design", code: "AT 421", name: "Vehicle Theory & Design", nameAr: "نظرية وتصميم سيارة", hours: 3, department: "Autotronics Engineering", category: "physics" },
  { id: "auto_electronics", code: "AT 431", name: "Automotive Electric & Electronics", nameAr: "كهرباء وإلكترونيات السيارات", hours: 3, department: "Autotronics Engineering", category: "physics" },
  { id: "auto_hybrid_ev", code: "AT 441", name: "Hybrid & Electric Vehicles", nameAr: "السيارات الهجينة والكهربائية", hours: 3, department: "Autotronics Engineering", category: "physics" },
  { id: "auto_ice_lab", code: "ME 422", name: "Internal Combustion Engines Lab", nameAr: "مختبر محركات احتراق داخلي", hours: 1, department: "Mechanical Engineering", category: "physics" },
  { id: "auto_fundamentals_lab", code: "AT 302", name: "Autotronics Fundamentals Lab", nameAr: "مختبر أساسيات الأوتوترونكس", hours: 1, department: "Autotronics Engineering", category: "physics" },
  { id: "auto_fem", code: "ME 511", name: "Finite Element Methods", nameAr: "طرائق العنصر المحدود", hours: 3, department: "Mechanical Engineering", category: "math" },
  { id: "auto_diagnosis", code: "AT 511", name: "Vehicle Diagnosis, Maintenance & Repair", nameAr: "تشخيص صيانة وإصلاح السيارة", hours: 3, department: "Autotronics Engineering", category: "physics" },
  { id: "auto_project1", code: "AT 591", name: "Graduation Project I", nameAr: "مشروع 1", hours: 1, department: "Autotronics Engineering", category: "support" },
  { id: "auto_electronics_lab", code: "AT 432", name: "Automotive Electronics Lab", nameAr: "مختبر كهرباء وإلكترونيات السيارة", hours: 1, department: "Autotronics Engineering", category: "physics" },
  { id: "auto_hybrid_ev_lab", code: "AT 442", name: "Hybrid & EV Lab", nameAr: "مختبر السيارات الهجينة والكهربائية", hours: 1, department: "Autotronics Engineering", category: "physics" },
  { id: "auto_project2", code: "AT 592", name: "Graduation Project II", nameAr: "مشروع 2", hours: 3, department: "Autotronics Engineering", category: "support" },
  { id: "auto_workshop_mgmt", code: "AT 521", name: "Workshop Management & Planning", nameAr: "إدارة وتخطيط ورش وصيانة السيارات", hours: 2, department: "Autotronics Engineering", category: "support" },
  { id: "auto_diagnosis_lab", code: "AT 512", name: "Diagnosis & Repair Lab", nameAr: "مختبر تشخيص صيانة وإصلاح السيارت", hours: 1, department: "Autotronics Engineering", category: "physics" },
  { id: "auto_elective_1", code: "AT ELEC", name: "Major Elective I", nameAr: "متطلب تخصص اختياري", hours: 3, department: "Autotronics Engineering", category: "physics" },
  { id: "auto_elective_2", code: "AT ELEC", name: "Major Elective II", nameAr: "متطلب تخصص اختياري", hours: 3, department: "Autotronics Engineering", category: "physics" },
  { id: "auto_elective_3", code: "AT ELEC", name: "Major Elective III", nameAr: "متطلب تخصص اختياري", hours: 3, department: "Autotronics Engineering", category: "physics" },
  { id: "auto_training", code: "AT 590", name: "Field Training", nameAr: "التدريب الميداني", hours: 3, department: "Autotronics Engineering", category: "support" },
  { id: "mech_design2", code: "ME 412", name: "Mechanical Design II", nameAr: "تصميم ميكانيكي 2", hours: 3, department: "Mechanical Engineering", category: "physics" },
  { id: "mech_composites", code: "ME 512", name: "Composite Materials & Applications", nameAr: "المواد المركبة وتطبيقاتها", hours: 3, department: "Mechanical Engineering", category: "physics" },
  { id: "mech_design_modeling", code: "ME 513", name: "Design & Modeling", nameAr: "التصميم والنمذجة", hours: 3, department: "Mechanical Engineering", category: "physics" },
  { id: "advanced_manufacturing", code: "ME 413", name: "Advanced Manufacturing Processes", nameAr: "عمليات التصنيع المتقدمة", hours: 3, department: "Mechanical Engineering", category: "physics" },
  { id: "manufacturing_lab", code: "ME 414", name: "Manufacturing Processes Lab", nameAr: "مختبر عمليات التصنيع", hours: 1, department: "Mechanical Engineering", category: "physics" },
  { id: "power_plants", code: "ME 423", name: "Power Plants Engineering", nameAr: "محطات توليد الطاقة", hours: 3, department: "Mechanical Engineering", category: "physics" },
  { id: "power_plants_lab", code: "ME 424", name: "Power Plants Lab", nameAr: "مختبر محطات توليد الطاقة", hours: 1, department: "Mechanical Engineering", category: "physics" },
  { id: "hvac_tech", code: "ME 425", name: "HVAC Technology", nameAr: "تكنولوجيا تكييف الهواء", hours: 3, department: "Mechanical Engineering", category: "physics" },
  { id: "plumbing_design", code: "ME 426", name: "Sanitary Plumbing Design", nameAr: "تصميم الأنظمة الصحية", hours: 2, department: "Mechanical Engineering", category: "physics" },
  { id: "hydraulic_machines", code: "ME 441", name: "Hydraulic Machines", nameAr: "الآلات الهيدروليكية", hours: 3, department: "Mechanical Engineering", category: "physics" },
  { id: "mech_special_topics", code: "ME 521", name: "Special Topics in Mechanical Engineering", nameAr: "مواضيع خاصة في الهندسة الميكانيكية", hours: 3, department: "Mechanical Engineering", category: "physics" },
  { id: "microcontroller_apps", code: "ME 433", name: "Microcontroller Applications", nameAr: "تطبيقات المتحكمات", hours: 3, department: "Mechanical Engineering", category: "physics" },
  { id: "engineering_applications_practical", code: "ME 514", name: "Practical Engineering Applications", nameAr: "تطبيقات هندسية عملي", hours: 3, department: "Mechanical Engineering", category: "physics" },
  { id: "agriculture_jordan", code: "AGRI 101", name: "Agriculture in Jordan", nameAr: "الزراعة في الأردن", hours: 3, department: "General", category: "culture" },
  { id: "mech_fluids", code: "ME 341", name: "Fluid Mechanics for Mechanical Engineers", nameAr: "ميكانيك الموائع للميكانيك", hours: 3, department: "Mechanical Engineering", category: "physics" },
  { id: "auto_engineering2", code: "AT 413", name: "Automotive Engineering II", nameAr: "هندسة السيارات 2", hours: 3, department: "Autotronics Engineering", category: "physics" },
  { id: "auto_aerodynamics", code: "AT 513", name: "Vehicle Aerodynamics", nameAr: "الدينايمكا الهوائية للمركبة", hours: 3, department: "Autotronics Engineering", category: "physics" },
  { id: "auto_lubricants_fuels", code: "AT 414", name: "Automotive Lubricants & Fuels", nameAr: "مواد تشغيل السيارة", hours: 3, department: "Autotronics Engineering", category: "physics" },
  { id: "auto_advanced_ice", code: "AT 523", name: "Advanced Internal Combustion Engines", nameAr: "محركات احتراق داخلي متقدمة", hours: 3, department: "Autotronics Engineering", category: "physics" },
  { id: "auto_pollution_control", code: "AT 524", name: "Automotive Emission Control Systems", nameAr: "أنظمة التحكم بالتلوث في السيارات", hours: 3, department: "Autotronics Engineering", category: "physics" },
  { id: "auto_software_engineering", code: "AT 525", name: "Automotive Software Engineering", nameAr: "هندسة برمجيات السيارة", hours: 3, department: "Autotronics Engineering", category: "physics" },
  { id: "auto_special_topics", code: "AT 526", name: "Special Topics in Autotronics Engineering", nameAr: "مواضيع خاصة في هندسة الأوتوترونكس", hours: 3, department: "Autotronics Engineering", category: "physics" },
  { id: "univ_elective_1", code: "UNIV ELEC", name: "University Elective I", nameAr: "متطلب جامعة اختياري", hours: 3, department: "General", category: "culture" },
  { id: "univ_elective_2", code: "UNIV ELEC", name: "University Elective II", nameAr: "متطلب جامعة اختياري", hours: 3, department: "General", category: "culture" },
  { id: "math_linear_algebra", code: "MATH 201", name: "Linear Algebra", nameAr: "جبر خطي", hours: 3, department: "Mathematics", category: "math" },
  { id: "comp_oop", code: "CS 201", name: "Object Oriented Programming", nameAr: "البرمجة بلغة الكينونة", hours: 3, department: "Computer Engineering", category: "computing" },
  { id: "circuit2", code: "EE 243", name: "Electric Circuits II", nameAr: "دوائر كهربائية 2", hours: 3, department: "Electrical Engineering", category: "physics" },
  { id: "comp_data_structures", code: "CS 211", name: "Data Structures & Algorithms", nameAr: "تراكيب البيانات والخوارزميات", hours: 3, department: "Computer Engineering", category: "computing" },
  { id: "comp_microprocessors", code: "CPE 211", name: "Microprocessor Systems", nameAr: "أنظمة المعالجات الدقيقة", hours: 3, department: "Computer Engineering", category: "computing" },
  { id: "e_circuits_lab", code: "EE 203", name: "Electric Circuits Lab", nameAr: "مختبر دوائر كهربائية", hours: 1, department: "Electrical Engineering", category: "physics" },
  { id: "comp_digital_lab", code: "CPE 202", name: "Digital Logic Lab", nameAr: "مختبر تصميم المنطق الرقمي", hours: 1, department: "Computer Engineering", category: "computing" },
  { id: "comp_data_struct_lab", code: "CS 212", name: "Data Structures Lab", nameAr: "مختبر تراكيب البيانات والخوارزميات", hours: 1, department: "Computer Engineering", category: "computing" },
  { id: "comp_architecture", code: "CPE 311", name: "Computer Architecture & Organization", nameAr: "معمارية الحاسوب وتنظيمه", hours: 3, department: "Computer Engineering", category: "computing" },
  { id: "e_signals", code: "EE 321", name: "Signals & Systems", nameAr: "أنظمة وإشارات", hours: 3, department: "Electrical Engineering", category: "physics" },
  { id: "e_machines1", code: "EE 351", name: "Electric Machines I", nameAr: "الآلات الكهربائية 1", hours: 3, department: "Electrical Engineering", category: "physics" },
  { id: "e_electronics_lab", code: "EE 312", name: "Electronics Lab", nameAr: "مختبر إلكترونيات 1", hours: 1, department: "Electrical Engineering", category: "physics" },
  { id: "comp_arch_lab", code: "CPE 312", name: "Computer Architecture Lab", nameAr: "مختبر معمارية الحاسوب", hours: 1, department: "Computer Engineering", category: "computing" },
  { id: "e_communications", code: "EE 341", name: "Communications & Data Transmission", nameAr: "الاتصالات وتراسل البيانات", hours: 3, department: "Electrical Engineering", category: "physics" },
  { id: "comp_os", code: "CS 331", name: "Operating Systems", nameAr: "نظم تشغيل", hours: 3, department: "Computer Engineering", category: "computing" },
  { id: "comp_db", code: "CS 341", name: "Database Systems", nameAr: "أنظمة قواعد البيانات", hours: 3, department: "Computer Engineering", category: "computing" },
  { id: "comp_micro_lab", code: "CPE 212", name: "Microprocessors Lab", nameAr: "مختبر أنظمة المعالجات", hours: 1, department: "Computer Engineering", category: "computing" },
  { id: "comp_ai", code: "CS 451", name: "AI & Machine Learning", nameAr: "الذكاء الاصطناعي وتعلم الآلة", hours: 3, department: "Computer Engineering", category: "computing" },
  { id: "ns_networks", code: "NS 401", name: "Computer Networks Fundamentals", nameAr: "أساسيات شبكات الحاسوب", hours: 3, department: "Network Security", category: "computing" },
  { id: "comp_cloud", code: "CS 461", name: "Cloud Computing", nameAr: "الحوسبة السحابية", hours: 3, department: "Computer Engineering", category: "computing" },
  { id: "comp_db_lab", code: "CS 342", name: "Database Lab", nameAr: "مختبر أنظمة قواعد البيانات", hours: 1, department: "Computer Engineering", category: "computing" },
  { id: "ns_networks_lab", code: "NS 402", name: "Computer Networks Lab", nameAr: "مختبر شبكات الحاسوب", hours: 1, department: "Network Security", category: "computing" },
  { id: "e_control_lab", code: "EE 332", name: "Control Systems Lab", nameAr: "مختبر أنظمة تحكم", hours: 1, department: "Electrical Engineering", category: "physics" },
  { id: "ns_wireless", code: "NS 411", name: "Wireless Networks", nameAr: "الشبكات اللاسلكية", hours: 3, department: "Network Security", category: "computing" },
  { id: "ns_protocols", code: "NS 421", name: "Network Protocols", nameAr: "بروتوكولات الشبكات", hours: 3, department: "Network Security", category: "computing" },
  { id: "ns_net_programming", code: "NS 431", name: "Network & Internet Programming", nameAr: "برمجة الشبكات والإنترنت", hours: 3, department: "Network Security", category: "computing" },
  { id: "ns_ethical_hacking", code: "NS 511", name: "Ethical Hacking", nameAr: "القرصنة الأخلاقية", hours: 2, department: "Network Security", category: "computing" },
  { id: "ns_crypto", code: "NS 501", name: "Cryptography & Network Security", nameAr: "التشفير وأمن أنظمة الشبكات", hours: 3, department: "Network Security", category: "computing" },
  { id: "ns_project1", code: "NS 591", name: "Graduation Project I", nameAr: "مشروع تخرج 1", hours: 1, department: "Network Security", category: "support" },
  { id: "ns_project2", code: "NS 592", name: "Graduation Project II", nameAr: "مشروع التخرج 2", hours: 3, department: "Network Security", category: "support" },
  { id: "ns_protocols_lab", code: "NS 422", name: "Network Protocols Lab", nameAr: "مختبر بروتوكولات الشبكات", hours: 1, department: "Network Security", category: "computing" },
  { id: "ns_wireless_lab", code: "NS 412", name: "Wireless Networks Lab", nameAr: "مختبر الشبكات اللاسلكية", hours: 1, department: "Network Security", category: "computing" },
  { id: "ns_security_lab", code: "NS 502", name: "Network Security Lab", nameAr: "مختبر أمن أنظمة الشبكات", hours: 1, department: "Network Security", category: "computing" },
  { id: "ns_forensics_lab", code: "NS 512", name: "Intrusion & Digital Forensics Lab", nameAr: "مختبر الاقتحام والتحقيقات الرقمية", hours: 1, department: "Network Security", category: "computing" },
  { id: "ns_training", code: "NS 590", name: "Field Training", nameAr: "تدريب ميداني", hours: 3, department: "Network Security", category: "support" },
  { id: "ns_elective_1", code: "NS ELEC", name: "Major Elective I", nameAr: "متطلب تخصص اختياري", hours: 3, department: "Network Security", category: "computing" },
  { id: "ns_elective_2", code: "NS ELEC", name: "Major Elective II", nameAr: "متطلب تخصص اختياري", hours: 3, department: "Network Security", category: "computing" },
  { id: "ns_elective_3", code: "NS ELEC", name: "Major Elective III", nameAr: "متطلب تخصص اختياري", hours: 3, department: "Network Security", category: "computing" },
  { id: "math_vector_analysis", code: "MATH 202", name: "Vector Analysis", nameAr: "تحليل وسيط", hours: 3, department: "Mathematics", category: "math" },
  { id: "e_em1", code: "EE 221", name: "Electromagnetics I", nameAr: "كهرومغناطيسية 1", hours: 3, department: "Electrical Engineering", category: "physics" },
  { id: "e_em2", code: "EE 322", name: "Electromagnetics II", nameAr: "كهرومغناطيسية 2", hours: 3, department: "Electrical Engineering", category: "physics" },
  { id: "e_electronics2", code: "EE 311", name: "Electronics II", nameAr: "إلكترونيات 2", hours: 3, department: "Electrical Engineering", category: "physics" },
  { id: "e_digital_electronics", code: "EE 313", name: "Digital Electronics", nameAr: "إلكترونيات رقمية", hours: 3, department: "Electrical Engineering", category: "physics" },
  { id: "tele_analog", code: "TE 341", name: "Analog Communications", nameAr: "اتصالات تشابهية", hours: 3, department: "Telecom Engineering", category: "physics" },
  { id: "comp_micro_ctrl_lab", code: "CPE 314", name: "Microprocessors & Controllers Lab", nameAr: "مختبر أنظمة المعالجات الدقيقة والحاكمات", hours: 1, department: "Computer Engineering", category: "computing" },
  { id: "e_electronics2_lab", code: "EE 314", name: "Electronics II Lab", nameAr: "مختبر إلكترونيات 2", hours: 1, department: "Electrical Engineering", category: "physics" },
  { id: "tele_digital", code: "TE 441", name: "Digital Communications", nameAr: "اتصالات رقمية", hours: 3, department: "Telecom Engineering", category: "physics" },
  { id: "tele_microwaves", code: "TE 421", name: "Microwave Communications", nameAr: "اتصالات الأمواج الدقيقة", hours: 3, department: "Telecom Engineering", category: "physics" },
  { id: "tele_dsp", code: "TE 431", name: "Digital Signal Processing", nameAr: "معالجة الإشارة الرقمية", hours: 3, department: "Telecom Engineering", category: "physics" },
  { id: "tele_analog_lab", code: "TE 342", name: "Analog Communications Lab", nameAr: "مختبر اتصالات تشابهية", hours: 1, department: "Telecom Engineering", category: "physics" },
  { id: "tele_digital_lab", code: "TE 442", name: "Digital Communications Lab", nameAr: "مختبر اتصالات رقمية", hours: 1, department: "Telecom Engineering", category: "physics" },
  { id: "tele_antennas", code: "TE 411", name: "Antennas & Wave Propagation", nameAr: "هوائيات وانتشار الأمواج", hours: 3, department: "Telecom Engineering", category: "physics" },
  { id: "tele_optical", code: "TE 451", name: "Optical Communications", nameAr: "اتصالات بصرية", hours: 3, department: "Telecom Engineering", category: "physics" },
  { id: "tele_ant_mw_lab", code: "TE 412", name: "Antennas & Microwaves Lab", nameAr: "مختبر هوائيات وأمواج دقيقة", hours: 1, department: "Telecom Engineering", category: "physics" },
  { id: "tele_dsp_lab", code: "TE 432", name: "DSP Lab", nameAr: "مختبر معالجة الإشارة الرقمية", hours: 1, department: "Telecom Engineering", category: "physics" },
  { id: "tele_circuits", code: "TE 511", name: "Communications Circuits", nameAr: "دوائر الاتصالات", hours: 3, department: "Telecom Engineering", category: "physics" },
  { id: "tele_mobile", code: "TE 541", name: "Mobile Wireless Communications", nameAr: "اتصالات لاسلكية متنقلة", hours: 3, department: "Telecom Engineering", category: "physics" },
  { id: "tele_project1", code: "TE 591", name: "Graduation Project I", nameAr: "مشروع التخرج 1", hours: 1, department: "Telecom Engineering", category: "support" },
  { id: "tele_project2", code: "TE 592", name: "Graduation Project II", nameAr: "مشروع التخرج 2", hours: 3, department: "Telecom Engineering", category: "support" },
  { id: "tele_training", code: "TE 590", name: "Field Training", nameAr: "التدريب الميداني", hours: 3, department: "Telecom Engineering", category: "support" },
  { id: "tele_optical_lab", code: "TE 452", name: "Optical Communications Lab", nameAr: "مختبر الاتصالات البصرية", hours: 1, department: "Telecom Engineering", category: "physics" },
  { id: "tele_elective_1", code: "TE ELEC", name: "Major Elective I", nameAr: "متطلب تخصص اختياري", hours: 3, department: "Telecom Engineering", category: "physics" },
  { id: "tele_elective_2", code: "TE ELEC", name: "Major Elective II", nameAr: "متطلب تخصص اختياري", hours: 3, department: "Telecom Engineering", category: "physics" },
  { id: "tele_elective_3", code: "TE ELEC", name: "Major Elective III", nameAr: "متطلب تخصص اختياري", hours: 3, department: "Telecom Engineering", category: "physics" },
  { id: "tele_ic", code: "EE 415", name: "Integrated Circuits", nameAr: "الدوائر المتكاملة", hours: 3, department: "Telecom Engineering", category: "physics" },
  { id: "tele_radar", code: "TE 413", name: "Radar Engineering", nameAr: "هندسة الرادار", hours: 3, department: "Telecom Engineering", category: "physics" },
  { id: "tele_crypto_info", code: "TE 512", name: "Cryptography & Info Theory", nameAr: "تشفير ونظرية المعلومات", hours: 3, department: "Telecom Engineering", category: "physics" },
  { id: "tele_satellite", code: "TE 513", name: "Satellite Communications", nameAr: "اتصالات الأقمار الصناعية", hours: 3, department: "Telecom Engineering", category: "physics" },
  { id: "tele_wireless_systems", code: "TE 514", name: "Wireless Communication Systems", nameAr: "أنظمة الاتصالات اللاسلكية", hours: 3, department: "Telecom Engineering", category: "physics" },
  { id: "tele_simulation", code: "TE 515", name: "Communication Systems Simulation", nameAr: "محاكاة أنظمة الاتصالات", hours: 3, department: "Telecom Engineering", category: "physics" },
  { id: "tele_special_topics", code: "TE 552", name: "Special Topics in Telecom", nameAr: "مواضيع خاصة", hours: 3, department: "Telecom Engineering", category: "physics" },
  { id: "tele_wireless_lab", code: "TE 542", name: "Wireless Communications Lab", nameAr: "مختبر اتصالات لاسلكية", hours: 1, department: "Telecom Engineering", category: "physics" },
  { id: "c1", code: "CE 211", name: "Statics", nameAr: "الاستاتيكا", hours: 3, department: "Civil Engineering", category: "physics" },
  { id: "e1", code: "EE 241", name: "Electric Circuits I", nameAr: "دوائر كهربائية 1", hours: 3, department: "Electrical Engineering", category: "physics" },
  { id: "e2", code: "EE 243", name: "Electric Circuits II", nameAr: "دوائر كهربائية 2", hours: 3, department: "Electrical Engineering", category: "physics" },
  { id: "e3", code: "EE 331", name: "Electronics I", nameAr: "الإلكترونيات 1", hours: 3, department: "Electrical Engineering", category: "physics" },
  { id: "mecha_sensors", code: "MTE 311", name: "Sensors & Actuators", nameAr: "المجسات والمشغلات", hours: 3, department: "Mechatronics Engineering", category: "physics" },
  { id: "mecha_power_elec", code: "MTE 321", name: "Power Electronics", nameAr: "إلكترونيات القدرة", hours: 3, department: "Mechatronics Engineering", category: "physics" },
  { id: "mecha_machine_comp", code: "ME 314", name: "Machine Components", nameAr: "مكونات الآلة", hours: 3, department: "Mechanical Engineering", category: "physics" },
  { id: "mecha_power_elec_lab", code: "MTE 322", name: "Power Electronics Lab", nameAr: "مختبر إلكترونيات القدرة", hours: 1, department: "Mechatronics Engineering", category: "physics" },
  { id: "mecha_sensors_lab", code: "MTE 312", name: "Sensors & Actuators Lab", nameAr: "مختبر المجسات والمشغلات", hours: 1, department: "Mechatronics Engineering", category: "physics" },
  { id: "mecha_drives", code: "MTE 421", name: "Electric Drives", nameAr: "قيادة كهربائية", hours: 3, department: "Mechatronics Engineering", category: "physics" },
  { id: "mecha_plc", code: "MTE 431", name: "Programmable Logic Controllers (PLC)", nameAr: "أجهزة الحاكمات المنطقية المبرمجة", hours: 3, department: "Mechatronics Engineering", category: "computing" },
  { id: "mecha_industrial_ctrl", code: "MTE 441", name: "Industrial Equipment & Control", nameAr: "التجهيزات الصناعية والتحكم", hours: 3, department: "Mechatronics Engineering", category: "physics" },
  { id: "mecha_robotic_drives", code: "MTE 451", name: "Robotic & Hydraulic Drives", nameAr: "القيادة الروبوتية والهيدروليكية", hours: 3, department: "Mechatronics Engineering", category: "physics" },
  { id: "mecha_drives_lab", code: "MTE 422", name: "Electric Drives Lab", nameAr: "مختبر القيادة الكهربائية", hours: 1, department: "Mechatronics Engineering", category: "physics" },
  { id: "mecha_plc_lab", code: "MTE 432", name: "PLC Lab", nameAr: "مختبر أجهزة الحاكمات المنطقية", hours: 1, department: "Mechatronics Engineering", category: "computing" },
  { id: "mecha_special_topics", code: "MTE 511", name: "Special Topics in Mechatronics", nameAr: "موضوعات خاصة في هندسة الميكاترونكس", hours: 3, department: "Mechatronics Engineering", category: "physics" },
  { id: "mecha_design", code: "MTE 521", name: "Mechatronics System Design", nameAr: "تصميم أنظمة الميكاترونكس", hours: 3, department: "Mechatronics Engineering", category: "physics" },
  { id: "mecha_robot_dynamics", code: "MTE 531", name: "Robot Dynamics & Analysis", nameAr: "ديناميكا الروبوتات وتحليلها", hours: 3, department: "Mechatronics Engineering", category: "physics" },
  { id: "mecha_robotic_lab", code: "MTE 452", name: "Robotic & Hydraulic Lab", nameAr: "مختبر القيادة الروبوتية والهيدروليكية", hours: 1, department: "Mechatronics Engineering", category: "physics" },
  { id: "mecha_industrial_lab", code: "MTE 442", name: "Industrial Equipment Lab", nameAr: "مختبر التجهيزات الصناعية", hours: 1, department: "Mechatronics Engineering", category: "physics" },
  { id: "mecha_applied_materials", code: "ME 514", name: "Applied Engineering Materials", nameAr: "المواد الهندسية التطبيقية", hours: 3, department: "Mechanical Engineering", category: "physics" },
  { id: "mecha_cnc", code: "MTE 541", name: "CNC Machines", nameAr: "ماكينات المحوسبة الرقمية", hours: 3, department: "Mechatronics Engineering", category: "computing" },
  { id: "mecha_mems", code: "MTE 551", name: "Micro-Electro-Mechanical Systems (MEMS)", nameAr: "الأنظمة الكهروميكانيكية الميكروية", hours: 3, department: "Mechatronics Engineering", category: "physics" },
  { id: "mecha_project1", code: "MTE 591", name: "Graduation Project I", nameAr: "مشروع 1", hours: 1, department: "Mechatronics Engineering", category: "support" },
  { id: "mecha_project2", code: "MTE 592", name: "Graduation Project II", nameAr: "مشروع 2", hours: 3, department: "Mechatronics Engineering", category: "support" },
  { id: "mecha_training", code: "MTE 590", name: "Field Training", nameAr: "التدريب الميداني", hours: 3, department: "Mechatronics Engineering", category: "support" },
  { id: "mecha_elective_1", code: "MTE ELEC", name: "Major Elective I", nameAr: "متطلب تخصص اختياري", hours: 3, department: "Mechatronics Engineering", category: "physics" },
  { id: "mecha_elective_2", code: "MTE ELEC", name: "Major Elective II", nameAr: "متطلب تخصص اختياري", hours: 3, department: "Mechatronics Engineering", category: "physics" },
  { id: "mecha_elective_3", code: "MTE ELEC", name: "Major Elective III", nameAr: "متطلب تخصص اختياري", hours: 3, department: "Mechatronics Engineering", category: "physics" },
  { id: "mech_manufacturing", code: "ME 441", name: "Manufacturing Processes", nameAr: "عمليات التصنيع", hours: 3, department: "Mechanical Engineering", category: "physics" },
  { id: "mech_design2", code: "ME 412", name: "Mechanical Design II", nameAr: "تصميم ميكانيكي 2", hours: 2, department: "Mechanical Engineering", category: "physics" },
  { id: "mech_apps_lab", code: "ME 401", name: "Engineering Applications Lab", nameAr: "مختبر تطبيقات هندسية", hours: 1, department: "Mechanical Engineering", category: "physics" },
  { id: "mech_hvac", code: "ME 422", name: "Air Conditioning Technology", nameAr: "تكنولوجيا تكييف الهواء", hours: 3, department: "Mechanical Engineering", category: "physics" },
  { id: "mech_power_plants", code: "ME 423", name: "Power Plants", nameAr: "محطات توليد الطاقة", hours: 3, department: "Mechanical Engineering", category: "physics" },
  { id: "mech_adv_manufacturing", code: "ME 442", name: "Advanced Manufacturing Processes", nameAr: "عمليات التصنيع المتقدمة", hours: 2, department: "Mechanical Engineering", category: "physics" },
  { id: "mech_manufacturing_lab", code: "ME 443", name: "Manufacturing Processes Lab", nameAr: "مختبر عمليات التصنيع", hours: 1, department: "Mechanical Engineering", category: "physics" },
  { id: "mech_renewable_energy", code: "ME 521", name: "Renewable Energy & Energy Technology", nameAr: "الطاقة المتجددة وتكنولوجيا الطاقة", hours: 3, department: "Mechanical Engineering", category: "physics" },
  { id: "mech_power_plants_lab", code: "ME 522", name: "Power Plants Lab", nameAr: "مختبر محطات الطاقة", hours: 1, department: "Mechanical Engineering", category: "physics" },
  { id: "mech_hydraulic_machinery", code: "ME 541", name: "Hydraulic Machinery", nameAr: "آلات هيدروليكية", hours: 3, department: "Mechanical Engineering", category: "physics" },
  { id: "mech_project1", code: "ME 591", name: "Graduation Project I", nameAr: "مشروع 1", hours: 1, department: "Mechanical Engineering", category: "support" },
  { id: "mech_project2", code: "ME 592", name: "Graduation Project II", nameAr: "مشروع 2", hours: 3, department: "Mechanical Engineering", category: "support" },
  { id: "mech_training", code: "ME 590", name: "Field Training", nameAr: "التدريب الميداني", hours: 3, department: "Mechanical Engineering", category: "support" },
  { id: "mech_elective_1", code: "ME ELEC", name: "Major Elective I", nameAr: "متطلب تخصص اختياري", hours: 3, department: "Mechanical Engineering", category: "physics" },
  { id: "therm_gas_dynamics", code: "ME 411", name: "Gas Dynamics", nameAr: "ديناميكا الغازات", hours: 3, department: "Mechanical Engineering", category: "physics" },
  { id: "therm_refrigeration", code: "ME 423", name: "Refrigeration Systems", nameAr: "أنظمة التبريد", hours: 3, department: "Mechanical Engineering", category: "physics" },
  { id: "therm_applied_heat", code: "ME 424", name: "Applied Heat Transfer", nameAr: "انتقال حرارة تطبيقية", hours: 3, department: "Mechanical Engineering", category: "physics" },
  { id: "therm_fluid_systems", code: "ME 521", name: "Fluid Systems Design", nameAr: "تصميم أنظمة الموائع", hours: 3, department: "Mechanical Engineering", category: "physics" },
  { id: "therm_boilers", code: "ME 512", name: "Boilers & Steam Generation", nameAr: "المراجل وتوليد البخار", hours: 3, department: "Mechanical Engineering", category: "physics" },
  { id: "therm_piping", code: "ME 513", name: "Piping Systems Design", nameAr: "تصميم أنظمة الأنابيب", hours: 3, department: "Mechanical Engineering", category: "physics" },
  { id: "therm_pneumatic", code: "ME 514", name: "Pneumatic Power Systems", nameAr: "أنظمة القدرة الهوائية", hours: 3, department: "Mechanical Engineering", category: "physics" },
  { id: "therm_special_hydraulic", code: "ME 591", name: "Special Topics in Hydraulic Machines", nameAr: "مواضيع خاصة في الآلات الهيدروليكية", hours: 3, department: "Mechanical Engineering", category: "physics" },
  { id: "therm_special_gas", code: "ME 592", name: "Special Topics in Gas Dynamics", nameAr: "مواضيع خاصة ديناميكا الغازات", hours: 3, department: "Mechanical Engineering", category: "physics" },
  { id: "mech_elective_2", code: "ME ELEC", name: "Major Elective II", nameAr: "متطلب تخصص اختياري", hours: 3, department: "Mechanical Engineering", category: "physics" },
  { id: "mech_elective_3", code: "ME ELEC", name: "Major Elective III", nameAr: "متطلب تخصص اختياري", hours: 3, department: "Mechanical Engineering", category: "physics" },
  { id: "comp_embedded", code: "CPE 411", name: "Embedded Systems", nameAr: "الأنظمة المضمنة", hours: 3, department: "Computer Engineering", category: "computing" },
  { id: "comp_adv_architecture", code: "CPE 412", name: "Advanced Computer Architecture", nameAr: "معمارية الحاسوب المتقدمة", hours: 3, department: "Computer Engineering", category: "computing" },
  { id: "comp_cyber_security", code: "NS 410", name: "Cyber Security Fundamentals", nameAr: "أساسيات الأمن السيبراني", hours: 3, department: "Network Security", category: "computing" },
  { id: "comp_parallel", code: "CS 452", name: "Parallel Processing Systems", nameAr: "أنظمة المعالجة المتوازية", hours: 3, department: "Computer Engineering", category: "computing" },
  { id: "comp_ai_lab", code: "CS 453", name: "AI Lab", nameAr: "مختبر الذكاء الاصطناعي", hours: 1, department: "Computer Engineering", category: "computing" },
  { id: "comp_embedded_lab", code: "CPE 413", name: "Embedded Systems Lab", nameAr: "مختبر الأنظمة المضمنة", hours: 1, department: "Computer Engineering", category: "computing" },
  { id: "comp_adv_programming", code: "CS 511", name: "Advanced Programming", nameAr: "البرمجة المتقدمة", hours: 3, department: "Computer Engineering", category: "computing" },
  { id: "comp_parallel_lab", code: "CS 454", name: "Parallel Processing Lab", nameAr: "مختبر أنظمة المعالجة المتوازية", hours: 1, department: "Computer Engineering", category: "computing" },
  { id: "comp_project1", code: "CPE 591", name: "Graduation Project I", nameAr: "مشروع 1", hours: 1, department: "Computer Engineering", category: "support" },
  { id: "comp_project2", code: "CPE 592", name: "Graduation Project II", nameAr: "مشروع 2", hours: 3, department: "Computer Engineering", category: "support" },
  { id: "comp_training", code: "CPE 590", name: "Field Training", nameAr: "التدريب الميداني", hours: 3, department: "Computer Engineering", category: "support" },
  { id: "comp_elective_1", code: "CPE ELEC", name: "Major Elective I", nameAr: "متطلبات تخصص اختياري", hours: 3, department: "Computer Engineering", category: "computing" },
  { id: "comp_elective_2", code: "CPE ELEC", name: "Major Elective II", nameAr: "متطلبات تخصص اختياري", hours: 3, department: "Computer Engineering", category: "computing" },
  { id: "comp_elective_3", code: "CPE ELEC", name: "Major Elective III", nameAr: "متطلبات تخصص اختياري", hours: 3, department: "Computer Engineering", category: "computing" },
  { id: "comp_elective_4", code: "CPE ELEC", name: "Major Elective IV", nameAr: "متطلبات تخصص اختياري", hours: 3, department: "Computer Engineering", category: "computing" },
  { id: "e_electromagnetics", code: "EE 341", name: "Electromagnetics", nameAr: "الكهرومغناطيسية", hours: 3, department: "Electrical Engineering", category: "physics" },
  { id: "sports_health", code: "SH 101", name: "Sports and Health", nameAr: "رياضة وصحة", hours: 3, department: "General", category: "culture" },
  // Chemical Engineering Specialization
  { id: "m_comp_skills", code: "CS 100", name: "Computer Skills", nameAr: "مهارات الحاسوب والتعلم الإلكتروني", hours: 3, department: "Chemical Engineering", category: "computing" },
  { id: "m_principles_che", code: "CHE 101", name: "Principles of Chemical Engineering", nameAr: "مبادئ الهندسة الكيميائية", hours: 3, department: "Chemical Engineering", category: "physics" },
  { id: "m_balances", code: "CHE 201", name: "Material and Energy Balances", nameAr: "موازنات المادة والطاقة", hours: 3, department: "Chemical Engineering", category: "physics" },
  { id: "chem_organic", code: "CHEM 201", name: "Organic Chemistry", nameAr: "كيمياء عضوية", hours: 3, department: "Chemical Engineering", category: "chemistry" },
  { id: "chem_analytical", code: "CHEM 202", name: "Analytical Chemistry", nameAr: "كيمياء تحليلية وتحليل آلي", hours: 3, department: "Chemical Engineering", category: "chemistry" },
  { id: "m_fluids_che", code: "CHE 211", name: "Fluid Mechanics for ChE", nameAr: "ميكانيكا الموائع للهندسة الكيميائية", hours: 3, department: "Chemical Engineering", category: "physics" },
  { id: "chem_phys_thermo", code: "CHEM 203", name: "Thermal Physical Chemistry", nameAr: "الكيمياء الفيزيائية الحرارية", hours: 3, department: "Chemical Engineering", category: "chemistry" },
  { id: "m_digital_culture", code: "CS 200", name: "Digital Culture and Ethics", nameAr: "الثقافة الرقمية والأخلاقيات المهنية", hours: 3, department: "Chemical Engineering", category: "computing" },
  { id: "m_organic_lab", code: "CHEM 201L", name: "Organic Chemistry Lab", nameAr: "مختبر كيمياء عضوية", hours: 1, department: "Chemical Engineering", category: "chemistry" },
  { id: "m_analytical_lab", code: "CHEM 202L", name: "Analytical Chemistry Lab", nameAr: "مختبر كيمياء تحليلية وتحليل آلي", hours: 1, department: "Chemical Engineering", category: "chemistry" },
  { id: "m_fluids_lab_che", code: "CHE 211L", name: "Fluid Mechanics Lab for ChE", nameAr: "مختبر ميكانيكا الموائع للهندسة الكيميائية", hours: 1, department: "Chemical Engineering", category: "physics" },
  { id: "m_heat_transfer", code: "CHE 311", name: "Heat Transfer", nameAr: "عمليات انتقال الحرارة", hours: 3, department: "Chemical Engineering", category: "physics" },
  { id: "m_thermo_che", code: "CHE 321", name: "Thermodynamics for ChE", nameAr: "ديناميكا الحرارة للهندسة الكيميائية", hours: 3, department: "Chemical Engineering", category: "physics" },
  { id: "m_reaction_eng1", code: "CHE 331", name: "Chemical Reaction Engineering (1)", nameAr: "هندسة تفاعلات كيميائية (1)", hours: 3, department: "Chemical Engineering", category: "physics" },
  { id: "m_heat_transfer_lab", code: "CHE 311L", name: "Heat Transfer Lab", nameAr: "مختبر عمليات انتقال الحرارة", hours: 1, department: "Chemical Engineering", category: "physics" },
  { id: "m_mass_transfer", code: "CHE 312", name: "Mass Transfer", nameAr: "انتقال المادة", hours: 3, department: "Chemical Engineering", category: "physics" },
  { id: "m_thermo_lab_che", code: "CHE 321L", name: "Thermodynamics Lab for ChE", nameAr: "مختبر الديناميكا الحرارية للهندسة الكيميائية", hours: 1, department: "Chemical Engineering", category: "physics" },
  { id: "m_reaction_eng2", code: "CHE 332", name: "Chemical Reaction Engineering (2)", nameAr: "هندسة تفاعلات كيميائية (2)", hours: 3, department: "Chemical Engineering", category: "physics" },
  { id: "m_unit_ops", code: "CHE 341", name: "Unit Operations", nameAr: "عمليات موحدة", hours: 3, department: "Chemical Engineering", category: "physics" },
  { id: "m_reaction_lab", code: "CHE 331L", name: "Reaction Engineering Lab", nameAr: "مختبر هندسة التفاعلات الكيميائية", hours: 1, department: "Chemical Engineering", category: "physics" },
  { id: "m_separation", code: "CHE 411", name: "Separation Processes", nameAr: "عمليات الفصل", hours: 3, department: "Chemical Engineering", category: "physics" },
  { id: "m_unit_ops_lab", code: "CHE 341L", name: "Unit Operations Lab", nameAr: "مختبر عمليات موحدة", hours: 1, department: "Chemical Engineering", category: "physics" },
  { id: "m_modeling", code: "CHE 401", name: "Modeling and Simulation", nameAr: "النمذجة والمحاكاة في الهندسة الكيميائية", hours: 3, department: "Chemical Engineering", category: "computing" },
  { id: "m_bioprocess", code: "CHE 451", name: "Bioprocess Engineering", nameAr: "هندسة العمليات الحيوية", hours: 3, department: "Chemical Engineering", category: "physics" },
  { id: "m_corrosion", code: "CHE 461", name: "Materials and Corrosion", nameAr: "هندسة المواد والتآكل", hours: 3, department: "Chemical Engineering", category: "physics" },
  { id: "m_separation_lab", code: "CHE 411L", name: "Separation Processes Lab", nameAr: "مختبر عمليات الفصل", hours: 1, department: "Chemical Engineering", category: "physics" },
  { id: "m_simulation_lab", code: "CHE 401L", name: "Simulation Lab", nameAr: "مختبر محاكاة العمليات", hours: 1, department: "Chemical Engineering", category: "computing" },
  { id: "m_plant_mgmt", code: "CHE 471", name: "Plant Management", nameAr: "إدارة المصانع", hours: 3, department: "Chemical Engineering", category: "support" },
  { id: "m_petroleum", code: "CHE 481", name: "Petroleum Refining", nameAr: "تكرير البترول", hours: 3, department: "Chemical Engineering", category: "physics" },
  { id: "m_chem_ind1", code: "CHE 491", name: "Chemical Industries Technology (1)", nameAr: "تكنولوجيا الصناعات الكيميائية (1)", hours: 3, department: "Chemical Engineering", category: "physics" },
  { id: "m_process_control", code: "CHE 511", name: "Process Dynamics and Control", nameAr: "ديناميكا العمليات والتحكم", hours: 3, department: "Chemical Engineering", category: "physics" },
  { id: "m_equip_design", code: "CHE 501", name: "Process Equipment Design", nameAr: "تصميم معدات العمليات", hours: 3, department: "Chemical Engineering", category: "physics" },
  { id: "m_chem_ind2", code: "CHE 492", name: "Chemical Industries Technology (2)", nameAr: "تكنولوجيا الصناعات الكيميائية (2)", hours: 3, department: "Chemical Engineering", category: "physics" },
  { id: "m_petroleum_lab", code: "CHE 481L", name: "Petroleum Refining Lab", nameAr: "مختبر تكرير البترول", hours: 1, department: "Chemical Engineering", category: "physics" },
  { id: "m_wastewater", code: "CHE 561", name: "Water and Wastewater Treatment", nameAr: "معالجة المياه والمياه العادمة", hours: 3, department: "Chemical Engineering", category: "physics" },
  { id: "m_control_lab", code: "CHE 511L", name: "Control Lab", nameAr: "مختبر ديناميكا العمليات والتحكم", hours: 1, department: "Chemical Engineering", category: "physics" },
  { id: "m_plant_design", code: "CHE 502", name: "Plant Design", nameAr: "تصميم المصانع", hours: 3, department: "Chemical Engineering", category: "physics" },
  { id: "m_process_safety", code: "CHE 571", name: "Process Safety", nameAr: "هندسة السلامة للعمليات الكيميائية", hours: 3, department: "Chemical Engineering", category: "physics" },
  { id: "m_tech_lab", code: "CHE 492L", name: "Technology and Industries Lab", nameAr: "مختبر العمليات وتكنولوجيا الصناعات", hours: 1, department: "Chemical Engineering", category: "physics" },
  { id: "chem_polymers", code: "CHE 561", name: "Polymer Technology", nameAr: "تكنولوجيا المبلمرات", hours: 3, department: "Chemical Engineering", category: "physics" },
  { id: "chem_membrane_sep", code: "CHE 562", name: "Membrane Separation Processes", nameAr: "عمليات الفصل بالأغشية المنفذة", hours: 3, department: "Chemical Engineering", category: "physics" },
  { id: "chem_electrochemical", code: "CHE 563", name: "Electrochemical Engineering", nameAr: "الهندسة الكهروكيميائية", hours: 3, department: "Chemical Engineering", category: "physics" },
  { id: "chem_pharmaceutical", code: "CHE 564", name: "Pharmaceutical Industries", nameAr: "الصناعات الصيدلانية", hours: 3, department: "Chemical Engineering", category: "physics" },
  { id: "chem_catalysis", code: "CHE 565", name: "Catalysis Engineering", nameAr: "هندسة المحفزات", hours: 3, department: "Chemical Engineering", category: "physics" },
  { id: "chem_food", code: "CHE 566", name: "Food Engineering", nameAr: "الهندسة الغذائية", hours: 3, department: "Chemical Engineering", category: "physics" },
  { id: "chem_oil_shale", code: "CHE 567", name: "Oil Shale Technology", nameAr: "تكنولوجيا الصخر الزيتي", hours: 3, department: "Chemical Engineering", category: "physics" },
  { id: "chem_fertilizers", code: "CHE 568", name: "Compound Fertilizers Technology", nameAr: "تكنولوجيا الأسمدة المركبة", hours: 3, department: "Chemical Engineering", category: "physics" },
  { id: "chem_nano", code: "CHE 569", name: "Nanotechnology in Chemical Engineering", nameAr: "التكنولوجيا النانوية في الهندسة الكيميائية", hours: 3, department: "Chemical Engineering", category: "physics" },
  { id: "chem_mineral_proc", code: "CHE 570", name: "Mineral Processing", nameAr: "معالجة الخامات المعدنية", hours: 3, department: "Chemical Engineering", category: "physics" },
  { id: "chem_petrochemicals", code: "CHE 571", name: "Petrochemical Technology", nameAr: "تكنولوجيا البتروكيماويات", hours: 3, department: "Chemical Engineering", category: "physics" },
  { id: "chem_special_topics", code: "CHE 592", name: "Special Topics in Chemical Engineering", nameAr: "مواضيع خاصة في الهندسة الكيميائية", hours: 3, department: "Chemical Engineering", category: "physics" },

  // --- Network Security Engineering Specialty Courses ---
  { id: "ns_forensics", code: "NS 513", name: "Intrusion & Digital Forensics", nameAr: "أنظمة التحقيقات والأدلة الرقمية", hours: 3, department: "Network Security", category: "computing" },
  { id: "ns_iot", code: "NS 451", name: "Internet of Things", nameAr: "إنترنت الأشياء", hours: 3, department: "Network Security", category: "computing" },
  { id: "ns_wireless_security", code: "NS 452", name: "Wireless Network Security", nameAr: "أمن الشبكات اللاسلكية", hours: 3, department: "Network Security", category: "computing" },
  { id: "ns_modeling_simulation", code: "NS 453", name: "Modeling & Simulation", nameAr: "نمذجة ومحاكاة", hours: 3, department: "Network Security", category: "computing" },
  { id: "ns_special_topics", code: "NS 551", name: "Special Topics in Network Security", nameAr: "موضوعات خاصة", hours: 3, department: "Network Security", category: "computing" },
  { id: "ns_sensor_networks", code: "NS 454", name: "Wireless Sensor Networks", nameAr: "شبكات الاستشعار اللاسلكية", hours: 3, department: "Network Security", category: "computing" },
  { id: "ns_linux", code: "NS 455", name: "Introduction to Linux", nameAr: "مقدمة إلى لينكس", hours: 3, department: "Network Security", category: "computing" },

  // --- Computer Engineering Specialty Courses ---
  { id: "logic_design", code: "CPE 201", name: "Digital Logic Design", nameAr: "تصميم المنطق الرقمي", hours: 3, department: "Computer Engineering", category: "computing" },

  // --- Mechatronics Engineering Specialty Courses ---
  { id: "advanced_control", code: "MTE 531", name: "Advanced Control Systems", nameAr: "أنظمة التحكم المتقدمة", hours: 3, department: "Mechatronics Engineering", category: "physics" },
  { id: "electrical_protection", code: "MTE 541", name: "Electrical Protection and Control Devices", nameAr: "أجهزة الحماية والتحكم الكهربائية", hours: 3, department: "Mechatronics Engineering", category: "physics" },
  { id: "scada", code: "MTE 532", name: "Supervisory Control and Data Acquisition (SCADA)", nameAr: "التحكم الإشرافي والتقاط البيانات", hours: 3, department: "Mechatronics Engineering", category: "physics" },
  { id: "machine_element_design", code: "MTE 411", name: "Machine Element Design & CAD", nameAr: "تصميم عناصر الآلة والتصميم بالحاسوب", hours: 3, department: "Mechatronics Engineering", category: "physics" },
  { id: "mecha_dynamics_vibrations", code: "MTE 312", name: "Dynamics & Vibrations", nameAr: "ديناميكا واهتزازات", hours: 3, department: "Mechatronics Engineering", category: "physics" },
  { id: "robotics_engineering", code: "MTE 551", name: "Robotics Engineering", nameAr: "هندسة الروبوتات", hours: 3, department: "Mechatronics Engineering", category: "physics" },
  { id: "robotics_lab", code: "MTE 553", name: "Robotics Dynamics & Analysis Lab", nameAr: "مختبر ديناميكا الروبوتات وتحليلها", hours: 1, department: "Mechatronics Engineering", category: "physics" },
  { id: "mecha_renewable_energy", code: "MTE 521", name: "Mechatronics Applications in Renewable Energy", nameAr: "تطبيقات الميكاترونكس في الطاقة المتجددة", hours: 3, department: "Mechatronics Engineering", category: "physics" },
];

export const allMaterials = courses;

export interface Resource {
  id: string;
  title: string;
  type: "summary" | "book" | "exam" | "video";
  uploader: string;
  size: string;
  url?: string; // Video URL or PDF URL
}

// Sample direct download links
const SAMPLE_PDF = "https://drive.google.com/uc?export=download&id=1SAMPLE_ID_1";
const SAMPLE_PDF_2 = "https://drive.google.com/uc?export=download&id=1SAMPLE_ID_2";

export const resourcesByCourse: Record<string, Resource[]> = {
  "ar99": [
    // --- دفاتر وملخصات (Summaries) ---
    { id: "ar99-s1", title: "ملخص مادة عربي 99", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/file/d/1UyIABN-iUlQPWh65p9BwA8pHuDtG8hXP/view" },
    { id: "ar99-s2", title: "ملخص عربي 99 (1)", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/file/d/1NL9sXK87ARClPgX_cXwPq49x1O84ZYWG/view" },
    { id: "ar99-s3", title: "دفتر عربي 99", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/file/d/1tAhFr5U4oIWDkqB4fmx2DQMmue6Bombp/view" },
    // --- الكتاب الجامعي (Textbook) ---
    { id: "ar99-b1", title: "كتاب عربي 99", type: "book", uploader: "Admin", size: "N/A", url: "https://drive.google.com/file/d/1mgvHBsozvFgj146jMNpWTaCrRKH-iwOD/view" },
  ],
  "CE101": [
    { id: "ce101-e1", title: "امتحان ميد أساسيات مدنية 2023", type: "exam", uploader: "Admin", size: "PDF", url: "#" },
    { id: "ce101-e2", title: "أسئلة سنوات مقترحة", type: "exam", uploader: "Admin", size: "PDF", url: "#" },
    { id: "ce101-s1", title: "ملخص مادة أساسيات الهندسة المدنية", type: "summary", uploader: "Admin", size: "PDF", url: "#" },
    { id: "ce101-b1", title: "كتاب المادة المعتمد", type: "book", uploader: "Admin", size: "PDF", url: "#" },
  ],
  "caliphs": [
    // --- دفاتر وملخصات (Summaries) ---
    { id: "cal-s1", title: "مادة خلفاء راشدين", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/file/d/1MMBsyHdts_l78T1tAqyaAL5pndNUenmm/view" },
    { id: "cal-s2", title: "ملخص د. مختار خلفاء", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/file/d/1MPBKSwZAT1uKiu9JT4n3eIS_rPEw0foC/view" },
    // --- أسئلة سنوات (Past Papers) ---
    { id: "cal-e1", title: "أسئلة سنوات ميد أونلاين", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/file/d/1cg4IyGc44ogBrxADCNtmrflLWuMm_2LF/view" },
    { id: "cal-e2", title: "بنك أسئلة خلفاء راشدين", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/file/d/1udag-V_90WV6KAzVlt1WnC01MTVeLu3l/view" },
    { id: "cal-e3", title: "تجميعة أسئلة خلفاء (2020)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/file/d/1l3Embb3Ub3Ubt__0fPSVqFwVGjhohUKz/view" },
    // --- الكتاب الجامعي (Textbook) ---
    { id: "cal-b1", title: "كتاب خلفاء", type: "book", uploader: "Admin", size: "N/A", url: "https://drive.google.com/file/d/1eM1bhS1cGg4EuXYXX6v18RlFAyp3LRq_/view" },
  ],
  "c2": [
    // --- الشروحات المرئية (Videos & Visuals) ---
    { id: "c2-v1", title: "شرح الدكتور كامل فليفل", type: "video", uploader: "د. كامل فليفل", size: "Playlist", url: "https://youtube.com/playlist?list=PLSr-OUj6vInu6gHD6q3LBd5jP-3LWuWtc" },
    { id: "c2-v2", title: "شرح المهندس أنس أبو زهرة", type: "video", uploader: "م. أنس أبو زهرة", size: "Playlist", url: "https://youtube.com/playlist?list=PLvuToPs04FnBwmv5vOWbN__6ZWHriciZP" },
    { id: "c2-v3", title: "شرح عباده الهباهبه (الجامعة الأردنية)", type: "video", uploader: "عباده الهباهبه", size: "Playlist", url: "https://youtube.com/playlist?list=PL0TpXNlUp4HYesKP8AJ21-kFG1Swxt_El" },

    // --- دفاتر وملخصات (Summaries) ---
    { id: "c2-s1", title: "دفتر د. كامل - فاينال", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1FDabYCfLB5dW5E3_YTZmRnNqxHvElheo" },
    { id: "c2-s2", title: "دفتر د. كامل - ميد", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1Zmr_Vv250vGMgTB9KdSrnbicMr8C07Is" },
    { id: "c2-s3", title: "دفتر د. عمار صدقي", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1zU53kVkveUbsgDBh0-LXQyUta0zLNQTj" },
    { id: "c2-s4", title: "ملخص الاتحاد الفاينل", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1pZwhKjS5PH-VkbwGEy60Zzr_8t40hnpF" },
    { id: "c2-s5", title: "كالكولاس 2 - مصطفى المحسيري", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1L2HXYp8l6d_AzMeytykEj_EFBMI7GnZx" },

    // --- الامتحانات والسنوات (Exams) ---
    { id: "c2-e1", title: "ميد كالكولاس 2 - 2021", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1JM2Sve0ULFdGZRbE8L1w3gwV0iPkdmEl" },
    { id: "c2-e2", title: "ميد كالكولاس 2 (نموذج 1)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1Wf29ht9u3kYj8l7HHExu3ldFkJO2n7GY" },
    { id: "c2-e3", title: "اسئلة ميد محلولة", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1kLJrClZaJKGqHHsev7dMWBT3Yk-J12NT" },
    { id: "c2-e4", title: "ميد سنوات (وسام ملحم وليث عمرو)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=10_hG_Ph33L71GNt3vSKK9nQUWWn5DtuI" },
    { id: "c2-e5", title: "سنوات فاينال محلول مدمج (SPU)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=19EgHnUfP2JUnbAI4OD5kOAAfkaxGdPm9" },
    { id: "c2-e6", title: "ميد ورقي 2024", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1mdFvYgrU0dryNbRbMnSO7JuINP7tSaAD" },
    { id: "c2-e7", title: "فاينل كالك 2 جديد", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1H6wepmXX7t7T2hZADBzLc0KfEnr-rJu7" },
    { id: "c2-e8", title: "ميد شاشات", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1tqmULt3sFrtDbCpneUairKOs3n_mqRAd" },
    { id: "c2-e9", title: "ميد 2023 فصل أول ورقي", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1v4P2RQ2q_AkyzASrly5RgjkXnZpWcxfG" },

    // --- مراجع وحلول (Books) ---
    { id: "c2-b1", title: "كتاب Calculus Early Transcendentals", type: "book", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1kZBYI2NYYSGpww5Iw-d5DR175S18aJuq" },
    { id: "c2-b2", title: "حلول الكتاب (Solution Manual)", type: "book", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1IE8ztu57jonH8rCDUkBOktFh0R-Ps5cm" }
  ],
  "circuit1": [
    { id: "c1-v1", title: "شرح محمود من CNE - دوائر كهربائية 1", type: "video", uploader: "م. محمود (CNE)", size: "Video", url: "https://youtu.be/e9Ss8qFsuhk?si=4AaCLlz-51aoh5h4" },
    { id: "c1-v2", title: "شرح المصري - دوائر كهربائية 1", type: "video", uploader: "المصري", size: "Video", url: "https://youtu.be/IBvXO-UU4l8?si=X2sQM6vm286afbIm" },
    { id: "c1-v3", title: "شرح رامي حسن - دوائر كهربائية 1", type: "video", uploader: "رامي حسن", size: "Video", url: "https://youtu.be/j2PE4JsyJ8c?si=mxf92Jcikc6NvUlK" }
  ],
  "circuit2": [
    { id: "c2-v1", title: "شرح أحمد خواجا - دوائر كهربائية 2", type: "video", uploader: "أحمد خواجا", size: "Video", url: "https://youtu.be/LXfplIyFEpI?si=0IFCcR_vLUznRWDi" }
  ],
  "comp_oop": [
    { id: "oop-v1", title: "شرح منى خالد (CNE) - البرمجة كينونية المنحى", type: "video", uploader: "منى خالد (CNE)", size: "Playlist", url: "https://youtu.be/5Zn0yPkXZ9E?si=8tGyOsoC1p8HjyOb" }
  ],
  "p101": [
    // --- الشروحات المرئية (Videos & Visuals) ---
    { id: "p1-v1", title: "شرح الدكتور أحمد عوض الله - منهاج Serway", type: "video", uploader: "د. أحمد عوض الله", size: "Playlist", url: "https://youtube.com/playlist?list=PLxRkgs4bYI6_CQSgywl7YKsjI6HT_8blD" },

    // --- امتحانات وسنوات (Exams) ---
    { id: "p1-e1", title: "فيزياء 1 - فيرست", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1pl0g-sovdJRJ5Y5smbrUC8VTKUsfxSiN" },
    { id: "p1-e2", title: "فيزياء 1 - سكند", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1cUw86WUdyoGUR3YNF9TIGSnfyvarautu" },
    { id: "p1-e3", title: "فيزياء 1 - فاينل", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=14Gf0QrZ3bRLdLbUGm8hfeod9SGAmOeMf" },
    { id: "p1-e4", title: "ميد فيزياء عامة 101", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1LsANRis_FMCb2pDmShj_nmAV7Ca-Dd8G" },
    { id: "p1-e5", title: "فاينال 101 (الجزء الأول)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1YTSJHY7ZvkMY4Wf__q-SVnq8geK0P1nX" },
    { id: "p1-e6", title: "فاينال 101 (الجزء الثاني)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=181urCbWSZUZi0DZYoFp-bTuHcgyNbVFv" },
    { id: "p1-e7", title: "فاينال 101 (الجزء الثالث)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1Yg5RZvpf5yUpGHH1PssWsx2e8oyoDobf" },
    { id: "p1-e8", title: "سنوات فيزياء 1 (Online)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1b_-j6-k_xmLmUqPXMTyxg-pz0wiBjUH_" },
    { id: "p1-e9", title: "Mid Exam 23-24 (نموذج B)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=11DcTQdkzmoVyCHPfbocwjVGNI8sfwRe-" },
    { id: "p1-e10", title: "Mid Exam 23-24 (نموذج A)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=18T3pV4ieHLRDYGKCCwnZsVjTINu3-o5l" },
    { id: "p1-e11", title: "Physics 101 Final Exam", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1NjraIPuYRvo89Rl66AupSO5tt8ytjM3C" },

    // --- شروحات وملخصات (Summaries) ---
    { id: "p1-s1", title: "ملخص فيزياء 1 (السنافر)", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1ldLtBR-EyTdnCdeZh56RAu7kwh-aa56A" },
    { id: "p1-s2", title: "ملخص قوانين فيزياء 1", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1fCghboId4yDmK6fP30Z6QEsaFH-2P5Uv" },
    { id: "p1-s3", title: "ملخص قوانين لاب فيزياء 1", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1GiQ3ZfGQOIGi3eq_zRJv2ErYa5VRlpq2" },

    // --- مسائل محلولة (Quiz) ---
    { id: "p1-q1", title: "أسئلة محلولة حول مادة الميد", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1KywumL9JnVfMfmCFM8VI6gMATiKgvnyD" },
    { id: "p1-q2", title: "مسائل محلولة (Chapter 7)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1Q_4pMOid_TRw2zJoNYwD2YY62ekGun5C" },
    { id: "p1-q3", title: "مسائل محلولة (Chapter 5)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1JkNI_FjkQq73uQ6GDrUSk2qDT8RrhON-" },
    { id: "p1-q4", title: "مسائل محلولة (Chapter 8)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1oDP7W6NABA294UiIR8fQAVPG31sdREiP" },
    { id: "p1-q5", title: "حلول لاب فيزياء 1 ميد", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1Yoe0b6hu6R8igTcUGwKbvNQpEd7mVZCu" }

  ],
  "p102": [
    // --- الشروحات المرئية (Videos & Visuals) ---
    { id: "p2-v1", title: "شرح الدكتور أحمد عوض الله - فيزياء 102 (الكهرباء والمغناطيسية)", type: "video", uploader: "د. أحمد عوض الله", size: "Playlist", url: "https://youtube.com/playlist?list=PLxRkgs4bYI6_pOSOfl-JPRTxgziqUnWtP" },
    { id: "p2-v2", title: "شرح الأستاذ وسيم الحوامدة - فيزياء 2", type: "video", uploader: "أ. وسيم الحوامدة", size: "Playlist", url: "https://youtube.com/playlist?list=PL6H-waMaCjslq5jI461s9JUfwJ5IIWZYd&si=S8rwqMbYtJqzfgOi" },

    // --- شروحات وملخصات (Summaries) ---
    { id: "p2-s1", title: "ملخص د. أحمد عوض - فيزياء 2", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1JYMAxasZ_O1zRD5NZEX3pY57bfYvzYTl" },
    { id: "p2-s2", title: "ملخص القوانين - سامر أبو يونس", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1pJAxiixrSTlpfxarmrSvE-lThOOsc8Ed" },
    { id: "p2-s3", title: "ملخص الطالب أوس (ملاحظات)", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1wyNt6ygC_yhTUcGXjFyoA6jnHZuh63r5" },
    { id: "p2-s4", title: "شروحات Ch 23 - Electric Fields", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1wTlMMDgo8ml3FtuZShji65t_EUs66APp" },
    { id: "p2-s5", title: "شروحات Ch 25 - Electric Potential", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1Bqq1lVFWD2JCCuSEHNwiA085DC8PqFVM" },
    { id: "p2-s6", title: "شروحات Ch 28 - DC Circuits", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=166eLFSyfERqmB4j5FDNXWnwnkxkoUkdj" },

    // --- امتحانات وسنوات (Exams) ---
    { id: "p2-e1", title: "ميد 2021 ورقي - سنافر البوليتكنك", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1Y97pxQ97oChYTfowr1kaCukR0Lkz1GP0" },
    { id: "p2-e2", title: "فاينال 2021 ورقي - سنافر البوليتكنك", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1NUAGer2MA43O4p815W0JwJd22fRNyXWt" },
    { id: "p2-e3", title: "امتحان الميد 2025 - جامعة البلقاء", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1pi4TqMwKrKSE_jT_fGDVlx29bh-ksUOG" },
    { id: "p2-e4", title: "سنوات فاينال (2) - 2021", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1BkdjxZFFxzyP56RCXP3MyCtYil46mo8R" },
    { id: "p2-e5", title: "سنوات ورقي فيزياء 2 ميد", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1BqukgO3-i3CuofOoEVnXUxDw2a1ffKjO" },

    // --- مسائل محلولة (Quiz/Solved Problems) ---
    { id: "p2-q1", title: "مسائل محلولة Ch 23", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1sD5kFwsqJqLvufkf8gqvyBMDRKeCNz_h" },
    { id: "p2-q2", title: "مسائل محلولة Ch 24", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1f2Ptcqbk2dAC8ESXK1mm1C9Mr0n8U2ru" },
    { id: "p2-q3", title: "مسائل محلولة Ch 25", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1AFfcDzecV_3Pcqmhnv0y8HAcQJa3f0VZ" },
    { id: "p2-q4", title: "مسائل محلولة Ch 26", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1kL3Wy8pMNKFqGptePAQmcKEtb-zMtxzA" },
    { id: "p2-q5", title: "مسائل محلولة Ch 27", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1O8vC43W1qJ-5vm2TK4TMTGGj_lrYyaGf" },
    { id: "p2-q6", title: "مسائل محلولة Ch 28", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1Z3usnAEceY4OxweUetWezWyvCqCoysH0" }

  ],
  "plab101": [
    // --- الشروحات المرئية (Videos & Visuals) ---
    { id: "pl1-v1", title: "شرح تجارب المختبر - الدكتور أنور الشيشاني", type: "video", uploader: "د. أنور الشيشاني", size: "Playlist", url: "https://youtube.com/playlist?list=PLwr-ZO8csiWuk78zaVCnLGFX_dOj2Kdx-" },
    // --- الشروحات والملخصات (Summaries) ---
    { id: "pl1-s1", title: "ملخص قوانين لاب فيزياء 1", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1yvmNZlp2xxNggQdin9nO5_b4FWq5CJ8Y" },
    { id: "pl1-s2", title: "شرح د. أنور الشيشاني (لاب فيزياء 1)", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1PUVrOi8Gx16pH8_dzAjX9PrwqLCdxS_a" },
    { id: "pl1-s3", title: "ملخص حسام زامل (لاب فيزياء 1)", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1TkTi1MD6yHPTFfTbxwYkoCnWUqoI2o5M" },
    { id: "pl1-s4", title: "شرح تجارب لاب فيزياء (Moh_ali)", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1mjQnzwNWJzTD2hmF0_OEmhM9U_PngO17" },
    { id: "pl1-s5", title: "ملخص قوانين لاب فيزياء 1 (إضافي)", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1GiQ3ZfGQOIGi3eq_zRJv2ErYa5VRlpq2" },

    // --- أسئلة السنوات والامتحانات (ميد) ---
    { id: "pl1-e1", title: "ميد لاب فيزياء 1 (شاشات - الجزء الثالث)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1KrmwTATuzTUxajGxP3KBduHa9KBjWxIW" },
    { id: "pl1-e2", title: "ميد لاب فيزياء 1 (شاشات - الجزء الثاني)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1uWc_rsiwhentHIEwVzfGaV27wrYws-qz" },
    { id: "pl1-e3", title: "ميد لاب فيزياء 1 (شاشات - الجزء الأول)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1HJ6_C8QZbCcEQJFPUu3OzLFLPw41Cit4" },
    { id: "pl1-e4", title: "ميد لاب فيزياء 1 (ورقي)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1kdQtpQwCHFGE4z4IpNrzR3DlVMQ2oERU" },
    { id: "pl1-e5", title: "حلول لاب فيزياء 1 ميد (جديدة)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1Yoe0b6hu6R8igTcUGwKbvNQpEd7mVZCu" },
    { id: "pl1-e6", title: "ميد لاب فيزياء 1 (نموذج C)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1z7tKc5rvKIb-ZY0En8U65rhbtcnO2tUB" },
  ],
  "stat101": [
    // --- الشروحات المرئية (Videos & Visuals) ---
    { id: "st-v1", title: "شرح الدكتور محمد فؤاد", type: "video", uploader: "د. محمد فؤاد", size: "Playlist", url: "https://youtube.com/playlist?list=PLFUszXtJ26-7Lox-o7iM7J-5SfSrsESsz&si=pG-Qf0TF2JuE8nB7" },
    { id: "st-v2", title: "شرح المهندس محمود زيدان (CNE)", type: "video", uploader: "م. محمود زيدان", size: "Playlist", url: "https://youtube.com/playlist?list=PLJwCQtAhsso_44oF-pStqPAr256cZQ_ig&si=hXFLj2CCp2-Up0DN" },

    // --- شروحات وملخصات (Summaries) ---
    { id: "st-s1", title: "دفتر د. شادي شواقفة", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1HAkeKjUX4_fhtjn8xMuYJRRf4AAglYp3" },
    { id: "st-s2", title: "دوسية احتمالات ميد", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1K9rG8rl68I3sYJ3DFhxtMu7-EpEgqSOO" },
    { id: "st-s3", title: "دفتر د. غالب ناصر", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1ySoPQMjuiedhYlfymtHNtIvN4wDBOtL0" },
    { id: "st-s4", title: "ملخص فاينل - اتحاد SPU", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1PBVrdY5Aj4_qIUa3wax2M0ieXmOS865u" },
    { id: "st-s5", title: "تلخيص احتمالات", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=17DokgBIv1N2fflEMgOgI1I6fivQewFxU" },
    { id: "st-s6", title: "ملخص قوانين الإحصاء", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1sc2pkAwFgZSt-IKjbBZTT7bOpoOFES0f" },
    { id: "st-s7", title: "مادة د. محمد ناصر كاملة", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1483Z5YaVfQeMPJ1jNK2vXS97SJp8EkZC" },

    // --- امتحانات وسنوات (Exams) ---
    { id: "st-e1", title: "ميد إحصاء - سنافر البوليتكنك", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1FNATpQC4R_BUWF59gRwlkVosfKMrxwHx" },
    { id: "st-e2", title: "ميد 2023 (نموذجين)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1siFW9q4TmX3UG-x-1gw1zhnC7mZ8-B_0" },
    { id: "st-e3", title: "سنوات فاينال إحصاء", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1Yb7ARt388Y9ind_Fo41_9_0b4u8AcnHx" },
    { id: "st-e4", title: "إحصاء ميد ورقي", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1cPsRlHGYvaN6g-rtuBumq3Xm-MPvYkFk" },
    { id: "st-e5", title: "ميد 2022 (فصل 1+2)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1Dg2mcvVNgg6-piW4Mz0in7UlIqyZZyZk" },
    { id: "st-e6", title: "شيت احتمالات", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1VP0gQqsv_WkqBzHQ4ABsVowNslneZa3G" },

    // --- ملفات تقوية وحلول (Quiz/Books) ---
    { id: "st-q1", title: "تقوية احتمالات فيرست", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=10lcbhzT9VTdofoKw7bfPS7-mEdsgpWOW" },
    { id: "st-q2", title: "تقوية احتمالات فاينل", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1objYu_lLkU5fSrsUfI_QQUybtq-LOs6V" },
    { id: "st-q3", title: "تقوية سكند", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=18a6B9cRJOnWFTmBvsI6SMA2aS9sIL_v_" },
    { id: "st-b1", title: "حلول كتاب الإحصاء", type: "book", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1_1bb3L46jWHbzHh7QivmPfEPokmaMpMa" }

  ],
  "numerical": [
    // --- الشروحات والكتب (Study Materials) ---
    { id: "num-v1", title: "شرح الدكتور كامل فليفل", type: "video", uploader: "د. كامل فليفل", size: "Playlist", url: "https://youtu.be/tnn5iY8WZKQ" },
    { id: "num-v2", title: "شرح طلاب (مراجعة شاملة)", type: "video", uploader: "مراجعة طلاب", size: "Playlist", url: "https://youtu.be/pfY0t8XADnA" },
    { id: "num-s1", title: "تقنيات عددية كامل (1)", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1mr-6x7aE1X19G5xlXhKRo-e3aMUXbJev" },
    { id: "num-s2", title: "دفتر د. أمجد", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1pugW31jec3pBJ82B0WFS4_liioW4wjZY" },
    { id: "num-b1", title: "كتاب تقنيات عددية", type: "book", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=19r_gBz3tZFAqpWvOX8f5u2_KTgDoFBjK" },
    { id: "num-s3", title: "ملخص الفيديوهات", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=12KKc9f3PlHnA8Eko773Cfgq8nIo3pbDs" },
    { id: "num-v3", title: "روابط فيديوهات المادة بالترتيب", type: "video", uploader: "Admin", size: "Playlist", url: "https://drive.google.com/open?id=13bidRRGk6IgQm_oOPL2b0Qqwr4g2dABb" },

    // --- امتحانات ومواد الميد (Midterm) ---
    { id: "num-e1", title: "شيت ميد تقنيات - أبو بكر", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=10u49f3GKwm-84l7Cued7c937oIwD9CFC" },
    { id: "num-e2", title: "ملخص وسنوات ميد - فاعل خير", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1Kyn6WVSpQC8Ck7wQ5kwDCPBiB4LYOagd" },
    { id: "num-e3", title: "ميد تقنيات 2024 ف1 محلول", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1vz8iYHT9Sr8ZrvkC9DYzrlUTl7CzskQp" },
    { id: "num-e4", title: "ميد تقنيات - صيفي 2025 محلول", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1OCbYl0go8gD41bWdm81-C2_LnWjpuUJV" },
    { id: "num-e5", title: "ميد تقنيات 2022", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1-wwx4Jc8wdznEgEXE345mxIW4rY0tAoZ" },
    { id: "num-e6", title: "ميد تقنيات 2023 الصيفي", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1bSrYHNS-QX_dMka0ZPjYxtiQ3iFahpO_" },
    { id: "num-e7", title: "ميد تقنيات الفصل الثاني 2023", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1FJGzzAqaOKjDcmD5fItDEjMxFTOzg47m" },
    { id: "num-e8", title: "تقنيات ميد ورقي", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1QLpEbhBu3Ok0gHSJw4pUtSdOAYEiAjGg" },
    { id: "num-e9", title: "تقنيات ميد ورقي 2", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1AaifX5od5UdJyNxCwoARkMCwFajWda1j" },
    { id: "num-e10", title: "numerical-mid2026", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=17lv71r6ZQ9qbHsNGsI1dHMayYrXUvsZ2" },
    { id: "num-e11", title: "Mid T1 2023", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=14wfllGk5CnBzNUUhNee1ofb9zZApL98_" },
    { id: "num-e12", title: "Mid T2 2023", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=19HKbVKzj5MGkNtlc1q92R0GF5WOR0LjE" },

    // --- امتحانات الفاينال (Final Exams) ---
    { id: "num-f1", title: "شاشات فاينال تقنيات", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=18zPdXkCH9XNtB10wqRml8rlEvAgeuUnM" },
    { id: "num-f2", title: "فاينال تقنيات 2025 (1)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1a7dNTRUyh7hgEBlOzjip-jBie2tyVbER" },
    { id: "num-f3", title: "فاينال تقنيات 2025 (2)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1vODuXYcUYijLKVvuY5JFP2wqi9QuLDFf" },
    { id: "num-f4", title: "فاينال تقنيات 2024 ف2", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1SkFrmmIjhAJbbonpkOdN4h4ac0VarwJ3" },
    { id: "num-f5", title: "فاينال تقنيات 2024 صيفي", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1PeAYEW3IV-Q9PDoy2DpyGhyaCvEyaQvp" },
    { id: "num-f6", title: "فاينال تقنيات 2023", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1_oP1_ADSAckAPsqfEDHTSjC3UPRMfsnc" },
    { id: "num-f7", title: "فاينال تقنيات ورقي", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=19xqtqLJWywCWE4pEYWTd75i0vsxqNqIz" },
    { id: "num-f8", title: "final exam p2 2024-06-04", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=11sLJyOeievxcHGUttZKvAC3fPTYzZ_es" },

    // --- ملفات إضافية وحلول امتحانات ---
    { id: "num-a1", title: "تقنيات 2024 محلول", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1wJP1y_Z0rfLj_FsPrXn_LujJ3_PXErWh" },
    { id: "num-a2", title: "تقنيات 2025 ف1", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1lbRxzyBRzfTQRDIoTEY4YUQlh3eS2R4E" },
    { id: "num-a3", title: "حل امتحان التقنيات ف1 (2024)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1DiFBkkzrqNtvUNPjpSQfDDU7ZWVsOCDh" },
  ],
  "isl101": [
    // --- مراجعات الوحدات والكتاب (Summaries & Books) ---
    { id: "isl-b1", title: "كتاب مادة إسلام وحياة", type: "book", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1hA5LR1pCA7T5dvhSngN8N-ZVM6Cq7ZdO" },
    { id: "isl-s1", title: "مراجعة الوحدة الأولى", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1Tf-5y-Vonp8jY4whpIKEopAfbJGENKEX" },
    { id: "isl-s2", title: "مراجعة الوحدة الثانية", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1yqFHuNZD1gAjQ7OvhvLS5POErrnICmPH" },
    { id: "isl-s3", title: "مراجعة الوحدة الثالثة", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1LaL-JKA1664PPvoZOPb29O3RV1ONfQBb" },
    { id: "isl-s4", title: "مراجعة الوحدة الرابعة", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1A2KMI0PFFTcOweIdqGIe4KAuPrJuwuuh" },
    { id: "isl-s5", title: "مراجعة الوحدة الخامسة", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=19f6Q2BzbbUwLRbFZZrsniHVRu7SBnKZb" },
    { id: "isl-s6", title: "مراجعة الوحدة السادسة", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=10n6pKys74BA_VfLv9PqDXIY5O4xLQ-8U" },
    { id: "isl-s7", title: "مراجعة الوحدة السابعة", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1wCb-jCAEaQhastP_yaDyxEunnd086Lpo" },
    { id: "isl-s8", title: "مراجعة الوحدة الثامنة", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1wgbDqfIQUG6pRTmH-_QtjvJQeAjC4mYU" },

    // --- الكويزات والامتحانات (Exams & Quizzes) ---
    { id: "isl-e1", title: "مراجعة د. مختار (ميد 2024)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1FmQTF52vz-0G31lmScYsxGmxMa8wyF2q" },
    { id: "isl-e2", title: "مراجعة د. مختار (فاينل 2024)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1ym94Q0PESXXkTCfBC3VLdUu_9z0c2VKQ" },
    { id: "isl-q1", title: "كويز إسلام وحياة (جديد 1 - 2024)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1C_GWAQuhSTaGetyTNjYXY4fDEUYE6lmZ" },
    { id: "isl-q2", title: "كويز إسلام وحياة (جديد 2 - 2024)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=10b8oaTqVvyFjCkpkuk0HNLk-Q_PpFkjn" },
    { id: "isl-q3", title: "كويز صيفي 2024 (محلول)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1mk1uOCY0dmke13YxbdBF-YSXOTfRs_rR" },
    { id: "isl-q4", title: "كويز جديد مع الحل 2024", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=15oGY8NjOsJjAMATOrExvkRtpr4HBPolF" }

  ],
  "eng99": [
    // --- القواعد والشروحات (Summaries) ---
    { id: "en99-s1", title: "قواعد مادة إنجليزي 99", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1P9rG8rl68I3sYJ3DFhxtMu7-EpEgqSOO" },
    { id: "en99-s2", title: "ملخص شامل للقواعد", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1sc2pkAwFgZSt-IKjbBZTT7bOpoOFES0f" },
    { id: "en99-s3", title: "شرح أزمنة الفعل (Verb Tenses)", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=17DokgBIv1N2fflEMgOgI1I6fivQewFxU" },

    // --- الامتحانات والسنوات (Exams) ---
    { id: "en99-e1", title: "ميد إنجليزي 99 (نموذج 2024)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1FNATpQC4R_BUWF59gRwlkVosfKMrxwHx" },
    { id: "en99-e2", title: "أسئلة سنوات فاينال", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1Yb7ARt388Y9ind_Fo41_9_0b4u8AcnHx" },
    { id: "en99-e3", title: "نموذج امتحان فاينال (تجريبي)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1objYu_lLkU5fSrsUfI_QQUybtq-LOs6V" },

    // --- الكويزات والتقوية (Quiz) ---
    { id: "en99-q1", title: "كويزات إنجليزي 99 محلولة", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1siFW9q4TmX3UG-x-1gw1zhnC7mZ8-B_0" },
    { id: "en99-q2", title: "تقوية لمادة الميد", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=10lcbhzT9VTdofoKw7bfPS7-mEdsgpWOW" },
    // --- الكلمات والقطع (Vocabulary & Reading) ---

    { id: "en99-v1", title: "كلمات المادة كاملة", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1483Z5YaVfQeMPJ1jNK2vXS97SJp8EkZC" },
    { id: "en99-r1", title: "تحليل قطع الريدينج", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1HAkeKjUX4_fhtjn8xMuYJRRf4AAglYp3" }
  ],
  "chem101": [
    // --- شروحات وسلايدات (Summaries & Books) ---
    { id: "ch-s1", title: "سلايدات الدكتورة هبة", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1adw9EV6ygD-iPxUMt1wnct4Ycb5Vq-J-" },
    { id: "ch-s2", title: "ملخص د. ريم", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1bqf2uTItGS2JsQBkYl4bCSnUhHMj-hz4" },
    { id: "ch-s3", title: "سلايدات د. علي", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1hZsHLIrZxMfys3syvKne1JUII7I35oxX" },
    { id: "ch-s4", title: "دفتر كيميا د. منصور", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1MPN3Slx-m73u0-zICYQx79uby05ponzw" },
    { id: "ch-s5", title: "ملخص قوانين الكيمياء (اتحاد SPU)", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1RpnzcXNoMhkWlgsez5vNfu0KS7UXa9Gt" },
    { id: "ch-s6", title: "ملخص قوانين مدمج", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1d3mVoc19iSLc4S5gwu7JvT6yLYlkj3LY" },

    // --- امتحانات وسنوات (Exams) ---
    { id: "ch-e1", title: "ميد كيمياء - سنافر البوليتكنك", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=10VYubRf0L8LHhtgNbaLNQeSwJHxYcIj-" },
    { id: "ch-e2", title: "فاينل كيمياء SPU", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1_rGlLBc08S55YghcAoz71GXgC6__gH3t" },
    { id: "ch-e3", title: "سكند كيمياء (2011-2014)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=18YpJSMb8Tdz9pGvoWxByQVv-RXDXrwzl" },
    { id: "ch-e4", title: "فاينل ورقي (2023)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1lSpdy78-KWPfxBSOkBJDcuAW39yIBQ5_" },
    { id: "ch-e5", title: "سنوات فاينال (الجزء الأول)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1043oaceJl7FoAkqz1lebMiyZirJ_plRi" },
    { id: "ch-e6", title: "فاينل كيمياء ورقي (1)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1Xm3BTZc6ZxX-amSYFhYlvhoRsaHB1FcD" },
    { id: "ch-e7", title: "فاينال كيمياء ورقي (3)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1cVwvoRmRI4yk0kub-ermEZQJl56D-L3r" },
    { id: "ch-e8", title: "ميد كيميا سنوات (معدل)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1PSn_bjvd4FE5Gq6rRhslcskUxEQAZTJm" },

    // --- حلول وشاشات (Quiz/Books) ---
    { id: "ch-q1", title: "شاشات ميد كيمياء محلولة", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1pW7Y-psz_zx9XX7TgX5g9pdgGsdGlYWH" },
    { id: "ch-b1", title: "حلول كتاب الكيمياء العامة", type: "book", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1pT1EcrDzmQvKOGkub1jPeoUxF-Bn3Mec" }

  ],
  "cs101": [
    // --- شروحات وسلايدات (Summaries) ---
    { id: "cs-s1", title: "ملخص مهارات الحاسوب - محمد أبو عليان", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1wS6ISuUwbJIV10i0Zr-ch2kzJwPmsky2" },
    { id: "cs-s2", title: "سلايدات المادة - رائد خليل", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=19gTNdBhCOG3icReIRZgyy-WPwLge5slB" },
    { id: "cs-s3", title: "سلايدات المادة مترجمة", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1_bv96aPjomrZTa3GozL9gMUBmcZ89flZ" },
    { id: "cs-s4", title: "تلخيص أول 3 شباتر", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1W7Vynea8aMioaPbeI4kDVQrfSd3_QrTs" },
    { id: "cs-s5", title: "ملخص شابتر 5 و 6", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=14b1_Otz_R8eF43u4095PUOI6ZyqKxeRa" },

    // --- امتحانات الميد (Midterm Exams) ---
    { id: "cs-m1", title: "ميد مهارات حاسوب (نموذج 1)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1JgoESFdl9QcVjFE_GFBRFWrPhMDExVf4" },
    { id: "cs-m2", title: "ميد مهارات حاسوب (نموذج 2)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=15B_GBGKq2mIYI3tYzXbLLB86K-pb6Dqb" },
    { id: "cs-m3", title: "سنوات ميد محلولة", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1wk5tO8oVPWpKGPkarVaqYyWQc0AhgCuM" },
    { id: "cs-m4", title: "أسئلة سنوات ميد (إسلام)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1tfYOmrJpXwL_dBgSX5VDbmY4ZL1HLqu7" },
    { id: "cs-m5", title: "أسئلة سنوات ميد (إسلام - إضافي)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=16BU-S0zpreBVxTf2atEHWoBCFOOAyOv9" },

    // --- امتحانات الفاينل (Final Exams) ---
    { id: "cs-f1", title: "فاينال حاسوب (الجزء الأول)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1iPJnX8VQ8JkixrpEMeJ9waLYZp6f74GP" },
    { id: "cs-f2", title: "فاينال حاسوب (الجزء الثاني)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1WFSwL_feSfC0YEbgNSN-gq_GWNgRHMQG" },
    { id: "cs-f3", title: "فاينال حاسوب (الجزء الثالث)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1WrVJiXoJZhztpFDHtpE2xbL18LYg7Ycz" },
    { id: "cs-f4", title: "فاينل مهارات حاسوب (نموذج 1)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1cvdfHVM3pVpU3gwd4_zArNYh2lw8uUNK" },
    { id: "cs-f5", title: "فاينل مهارات حاسوب (نموذج 2)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1YglYuaY4NO3PEGXsEypDiphZBuNcgOFx" },
    { id: "cs-f6", title: "فاينل مهارات حاسوب (نموذج 3)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1R4_MTx9798s1kTLmd5A9hUYk4GjXP0JJ" },
    { id: "cs-f7", title: "امتحان نهائي - مالك إبراهيم", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1o_QDLCvQGiEnIbvkW_n5GD5QNDbAPqg1" },

    // --- كويزات (Quiz) ---
    { id: "cs-q1", title: "كويزات مهارات الحاسوب", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1Y_1SpR2E2mLf-BTVMqj1LbHSTz3izX3U" },
    { id: "cs-q2", title: "كويز مهارات الحاسوب 2024", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1P1WrTEX0WlDijiet8hR4lmtDNN9iZxl5" },
    { id: "cs-q3", title: "كويز 2 - 2023", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1Zv4RHY1IZI0pnw7PCLvscKGHOlwlgR6i" },
    { id: "cs-q4", title: "كويز (نموذج إضافي)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1-EFRpzSSPJAlD302OtfVInGDwrLxWxEu" }

  ],
  "c6": [
    // --- الشروحات المرئية (Video Playlists) ---
    { id: "calc_v1", title: "شرح الدكتور كامل فليفل", type: "video", uploader: "د. كامل فليفل", size: "Playlist", url: "https://youtube.com/playlist?list=PLSr-OUj6vInvJL5SXMDPjhrg0YEg3ysng" },
    { id: "calc_v2", title: "شرح لجنة الهندسة الكيميائية", type: "video", uploader: "لجنة الهندسة الكيميائية", size: "Playlist", url: "https://youtube.com/playlist?list=PLSr-OUj6vInvJL5SXMDPjhrg0YEg3ysng" },
    { id: "calc_v3", title: "شرح المهندس أنس أبو زهرة", type: "video", uploader: "م. أنس أبو زهرة", size: "Playlist", url: "https://youtube.com/playlist?list=PLvuToPs04FnDqVhNAH5kQCVtWbTB1NymX" },
    { id: "calc_v4", title: "شرح عباده الهباهبه (الجامعة الأردنية)", type: "video", uploader: "عباده الهباهبه", size: "Playlist", url: "https://youtube.com/playlist?list=PL0TpXNlUp4HZiW9h906sApfVd0xs6MMxr" },

    // --- ملخصات ودوسيات (Summaries & Handouts) ---
    { id: "calc_new_s1", title: "مراجعة الوحدات (5-7)", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1D-cRbMT-WMskWN2UcxDIdh1uLsvA73GY" },
    { id: "calc_new_s2", title: "ملخص رياضيات 1", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1f9-Fa8ThGvAHn1wToQcGfoLlsn71XjEO" },
    { id: "calc_new_s3", title: "دوسية كالكولاس 1", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1nkvBNdg-E3nc7AX8dMyUMHIEPLMLQTIR" },

    // --- امتحانات سابقة (Past Papers) ---
    { id: "calc_new_e1", title: "بروبليم فاينال محلولة", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1mzp0Mh2Pde1fMQR7RlqrveFW9U4HsoIx" },
    { id: "calc_new_e2", title: "فاينل كالك 1 اونلاين", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1KZTucWEwc9ZXJc2jwnp-qv6iVuTP__6m" },
    { id: "calc_new_e3", title: "ميد كالك 1 اونلاين", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1WVNzoB3ZQe7vleRaf6uu9GrVuFI-FbGa" },
    { id: "calc_new_e4", title: "ميد كالكولاس 1 جديد", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1xciUhXPHfYAE6izrwE0ddFzmbTinykhU" },
    { id: "calc_new_e5", title: "امتحان فيرست", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1qG4dKYJtJ2xYKtR_-c0zxZBoo99geY0j" },
    { id: "calc_new_e6", title: "فاينال كالكولاس 1", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=11RC-XX61tW072fomxeJCT5D4_99bvWrz" },
    { id: "calc_new_e7", title: "كالك ورقي فاينال", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1WjzjiSMw0uFOMTDh9qQuIQu8Nsb8kk-l" },
    { id: "calc_new_e8", title: "امتحان سكند", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1UN4EP9mwWcjI6Gkrjb-9YKjIeyUOsmCh" },
    { id: "calc_new_e9", title: "كالكولاس 1 ميد", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1aj7b9ozPNPBxKxB2pXn3n2L262ptETt6" },
    { id: "calc_new_e10", title: "فاينال - جزء 1", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1x1lmvSp7Gk_j7nipFK9B88McQjO5ShcR" },
    { id: "calc_new_e11", title: "فاينال - جزء 2", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1DYPfubRCniRDNBq-SSDciS4JFk6Yu3mR" },
    { id: "calc_new_e12", title: "فاينال - جزء 3", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1tcPn3aKtrNnlKII0SXSp1-02Ak1w8hRx" },
    { id: "calc_new_e13", title: "فاينال (عام)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1qRbBgVAABfAEbhci2C-e0R7jGbwGtoV7" },
    { id: "calc_new_e14", title: "أسئلة ميد محلولة", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1ShZ0ZT2RecvjwOwhmOcL2KoKiEpdtldx" },
    { id: "calc_new_e15", title: "أسئلة ميد محلولة (نسخة 2)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1mdjmZ0JHxn4NwZ1jODLNlr-N7SFlwMjA" },
    { id: "calc_new_e16", title: "فاينال 2020", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1tAKTtlHjKT1hjZpLGIwwEaL--p5-PfJf" },
    { id: "calc_new_e17", title: "ميد (نسخة ورقية)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1kW1kJ1rL4YXm_UpO3nzFWUith7oXY5Q3" },
    { id: "calc_new_e18", title: "ميد 2019", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1LOtlduT3nd_7pBs2d7ZFd_lBIT9UIDBr" },
    { id: "calc_new_e19", title: "ميد كالكولس 1", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1TzIuacXj_R7DXt4Vp_c8V6pDkvePoxeT" },
    { id: "calc_new_e20", title: "فاينال جديد", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1sLn7YkAxTum3sGcDcmijXasl91HpONuN" },
    { id: "calc_new_e21", title: "فاينال ليث عمرو", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1SflASfrjrCnufY8fDryoOfO_nv8-joD9" },
    { id: "calc_new_e22", title: "بنك أسئلة 101", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1Y2rxL-5_WC92t8MPx_QcjwUG42bWuzSu" },
    { id: "calc_new_e23", title: "فاينال 2024", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1L84-T4hHMaClCnawQbuhdwuvPvb4Gmw6" },

    // --- كتب ومراجع (Books & References) ---
    { id: "calc_new_b1", title: "مرجع Calculus - Anton", type: "book", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1S4Te1nzBuI1DhMbUSZMmVqH68pSAIUA4" },
    { id: "calc_new_b2", title: "كتاب Calculus العام", type: "book", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1LrOGb7OLFTFWb6YnlykDyS1fcfuZyb9r" },
    { id: "calc_new_b3", title: "كتاب د. غالب ناصر", type: "book", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1CTQBoTDuYUMqunUHPrdPy0VdT7qB8QZy" }
  ],
  "ee201": [
    // --- شروحات وملخصات (Summaries & Books) ---
    { id: "ee-s1", title: "شروحات المادة (PDF)", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1UB2s6ThAfxZaPhrwGGWJkIzQjXEdQQpv" },
    { id: "ee-s2", title: "ملخص الاقتصاد الهندسي", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1sfARfoRN53fd8ipmcu0dTDqxSu8uKmEr" },
    { id: "ee-s3", title: "ملخص محمد سائد", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1zDaRXYRrsbsEOT2_RoXPbcXLiyQaTOFe" },
    { id: "ee-s4", title: "قوانين الاقتصاد - محمود عادل", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=19lkQ9ulok2Qk5jNqJmnk6iHE1rJPbgmo" },
    { id: "ee-s5", title: "ملخصات ج1 - صيفي 24", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1XV-M1Hi_BpIPLWeBYvBl0vi5Zsu18G3H" },
    { id: "ee-s6", title: "ملخصات ج2 - 24", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1cqeI4FbIwOfvL9B25_k0yAhoM5M4QB2n" },
    { id: "ee-s7", title: "ملخصات ج3 - 24", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1dtcx1kXJRIrOQ4kKfrwta6pUgeJLBG-0" },

    // --- جداول الاقتصاد (Tables) ---
    { id: "ee-t1", title: "جميع جداول الاقتصاد", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1Whv41Sc5Eg3pq7Q7xTNDnroUXavtGdNG" },
    { id: "ee-t2", title: "جداول الريع", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1wQWNwxRetV-e6vAk8ZjIInC4BX-c23Uc" },

    // --- امتحانات الميد (Midterm Exams) ---
    { id: "ee-m1", title: "ميد اقتصاد هندسي", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1McZEquC_zwZpWmp3kh1dANpWPhomer7F" },
    { id: "ee-m2", title: "ميد ورقي", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1DAW2-wnao4PngJS4TfuTpEkNn8swLTvn" },
    { id: "ee-m3", title: "ميد محلول - صيفي 22", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1RhYyiYfZh25G4C4D4k1MQjpmq679esrr" },
    { id: "ee-m4", title: "ميد - زيد اللحام وحرفوش", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=140EwHQ_Z_4BCfD1vpJurxzlGbVG4WfLE" },
    { id: "ee-m5", title: "أسئلة فيرست سابقة", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1B7h-6P1AbhUzsf5OU9Q6aO0IMvoVJxxe" },
    { id: "ee-m6", title: "ميد اقتصاد محلول (نموذج 5)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1T2VJ55C-xh5dvhKgZn1HncvL7pVrS_ge" },

    // --- امتحانات الفاينل والكويزات (Final Exams & Quizzes) ---
    { id: "ee-f1", title: "حل نموذج فاينل بالتفصيل", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1G1oiDK9DsCLZiytoDES1StxNS1g0QzLN" },
    { id: "ee-f2", title: "فاينل - زيد اللحام", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1MaQ-ecLIkVwjBVhyQQ8KRT2UzAX8CeGQ" },
    { id: "ee-f3", title: "فاينل أونلاين", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1v9Tv742P8fbLtAd_78PXXMiRfpZIAaPq" },
    { id: "ee-f4", title: "أسئلة فاينال سابقة", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1NpMdlzXIzdj9w1X5V6FsDtlANTbG6EH3" },
    { id: "ee-q1", title: "كويز 1", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1iSjUMPwiSobPKe2wwQ_o_IWGAtekWiIc" },
    { id: "ee-q2", title: "كويز 2", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1cOZ45HuBnlcg34AkD5mRwzjjCUxml4CT" }
  ],
  "national_studies": [
    // --- الكتاب المعتمد والملخصات الشاملة ---
    { id: "ns-book", title: "كتاب التربية الوطنية والسلوك الجامعي", type: "book", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=17armtREr2AtvzDfmVMGjiKm898gfFtdi" },
    { id: "ns-s-mustafa", title: "ملخص المادة الجديدة - مصطفى", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1AMVBIQuJUCoRzBAjZXCfOavoa29Ot4IJ" },

    // --- الوحدات الدراسية (Units) ---
    { id: "ns-u1", title: "الوحدة الأولى (PDF)", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1LIfIanSNLjef5SPfQjubaNhKfltkdq8i" },
    { id: "ns-u2", title: "الوحدة الثانية (PDF)", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1NliVsGgDT5ZcYWLraPK2UYBE8qjcog3k" },
    { id: "ns-s3", title: "ملخص شابتر 3", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1GQ9HlE9JH6VEpqYMTzNm445TGaHiJndt" },
    { id: "ns-s4", title: "ملخص شابتر 4", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1PGzX9BWZ5sFRgQp4oVJ0v-oY08yl3Igt" },
    { id: "ns-s5", title: "ملخص شابتر 5", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1Y7IjwstonKtdSqGQ1PCnImx1zPin0zEQ" },
    { id: "ns-s6", title: "ملخص شابتر 6", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1SAiUKceHS2kQjp6IAeOsLo73R3m2I2ML" },
    { id: "ns-rev-5-7", title: "مراجعة الوحدات (5-7)", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1D-cRbMT-WMskWN2UcxDIdh1uLsvA73GY" },

    // --- امتحانات الميد (Midterm Exams) ---
    { id: "ns-m25", title: "ميد 2025 (سنوات)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1OtWeYY0I68t_q33SpcIidIa7gCk6w3ei" },
    { id: "ns-m25-h1", title: "ميد 2025 - حمودة", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1En-5vw2UwyGp20_1bV2PewEFWhetoBXb" },
    { id: "ns-m25-h2", title: "ميد المادة الجديدة (صيفي) - حمودة", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1yJIi5DKmNDLRNtSnDH89rh9vYcLc938e" },
    { id: "ns-m-screens", title: "شاشات وطنية (ميد)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1NaVSXah0G2MttZQFpItn3f92NJXbJ0H2" },

    // --- امتحانات الفاينل والكويزات (Final & Quizzes) ---
    { id: "ns-f25", title: "فاينل 2025", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1VLvdn77wIdFlbuyspR6851ar9DY17MAB" },
    { id: "ns-q", title: "كويزات وطنية", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=158OQ5sVNlXTHNzOuR_IC_q2B--A8O12w" },
    { id: "ns-d-ahmad", title: "أسئلة الدكتور أحمد", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1CVX78FZGAcMqbAiCBt4AHsg5kBNm5dYm" }
  ],
  "islamic_culture": [
    { id: "is-m-slides", title: "سلايدات الميد - د. مختار", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1FSm3pLqPJPa0yGqNQuaboOUv0h88ytg2" },
    { id: "is-f-slides", title: "سلايدات الفاينل - د. مختار", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1A_IpnE1aSQNwfbfs0mMy4d5r4gyWwd1K" },
    { id: "is-u1", title: "تلخيص شامل - الوحدة الأولى", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1TzqDq2IqGG0i6jDbuvmE7aln6Jm8Qcmp" },
    { id: "is-u2", title: "تلخيص شامل - الوحدة الثانية", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1NN1Gy1obBCLmhUu9yhiCqQ2nnqup1Mli" },
    { id: "is-u6", title: "الوحدة السادسة (محددة من المراجعة)", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1GSNFgFHHCLoDgKJk_cyFILLOcU2SEIhe" },
    { id: "is-q-multi", title: "أسئلة اختيار من متعدد - الوحدة الثانية", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1Y5JNkBRkpLNseFX-r77e32AvTPezAaMB" },
    { id: "is-q-jarwan", title: "كويزات ثقافة - أحمد جروان", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1eivLSR-3K0avt7kgAFmj5SpPe-QCqHmv" },
    { id: "is-q-2025", title: "كويز المنهاج الجديد 2025 مع الحل", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1ut3pHDyWsa7uVT34E2QYlXzhUMc909Pn" }
  ],
  "technical_writing": [
    { id: "tw-pdf", title: "ملف PDF Printing (الشرح الأساسي)", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1K3Cz6MW0lB7dX5gWxme5B6uRuG_bLbrx" }
  ],
  "entrepreneurship": [
    // --- المادة الدراسية والسلايدات ---
    { id: "ent-slides", title: "سلايدات المادة الشاملة", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=17WH1VQ7v7Hl03o5KyMQ1Dz7r-DqaBBft" },
    { id: "ent-book-ch7", title: "الفصل السابع من الكتاب المعتمد", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1M0pLqqNHmm0_ZEO4E_gL3Xg-gWsrBwoQ" },
    { id: "ent-book-ch8", title: "الفصل الثامن من الكتاب المعتمد", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1q2vS5jQk3FrChh_wEPyT-sS0Rvvd2aYP" },
    { id: "ent-legal", title: "الطبيعة القانونية للمنظمات", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1TBtrY2YP8nahH7qiVhKIg_caBvvBo4Im" },
    { id: "ent-scamper", title: "تقنية سكامبر (SCAMPER)", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1mbZue4stuBaBpF2cXxA3pFGcHyeClwNs" },

    // --- نماذج خطة العمل والتقارير ---
    { id: "ent-bp-template", title: "نموذج خطة العمل (Word)", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1ZpT7A-SW5BKvMbS0QYYIX20Tm08go2Sa" },
    { id: "ent-bp-plan", title: "خطة العمل (نموذج 2)", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1SruqesFyN-8b7H7LbH1YwA1wrjR8bsHN" },
    { id: "ent-report", title: "تقرير (Assignment 1)", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1BAJO3pxnaC-VhQiEFf-9O8a9w5oOgDxT" },

    // --- حلول الواجبات والفصول ---
    { id: "ent-sol-ch1", title: "حل واجب الفصل الأول", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1fFmWQocKyuHzLPydgJM0XvI2xKXnf7PY" },
    { id: "ent-sol-ch3-4", title: "حل الفصل الثالث والرابع", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1Wbm3w4CAJwj8fFyLcDTWPxN79FQwOYps" },
    { id: "ent-sol-int", title: "حل واجب الريادة الدولية", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1RuY53Hdb_sta7WaX18vdWXQgfSuB4SGG" },

    // --- امتحانات الميد والسنوات ---
    { id: "ent-mid-rev", title: "مراجعة مادة الميد (أسئلة)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=15bMcQ6SRuh7T1Sg_l_9Q9xt9p15ikd1x" },
    { id: "ent-years-1", title: "أسئلة سنوات محلولة", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1PfrAaSUaewftF6P0rY--5sRJpUKzPK9e" },
    { id: "ent-salt-bank", title: "بنك السلط للريادة", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1zgeKtdoQU0HcjfcayDrpef5SHtHup_Dx" },

    // --- الكويزات والفاينل (2025) ---
    { id: "ent-q-2025", title: "كويز ريادة جديد 2025", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1yf5v2QcUR6LQ2Iq1r8x7oSVRStBlO8t3" },
    { id: "ent-q1", title: "كويز رقم 1", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1LBaRqghBdUjeZir76k00rSYRk4e8ibua" },
    { id: "ent-final-sol", title: "فاينل ابتكار محلول (SPU)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1ZoYJALq-zOv7ETxuDYX5s2fYSsOBMzS-" }
  ],
  "military_science": [
    // --- الكتاب الرسمي والمصادر الشاملة ---
    { id: "mil-book", title: "كتاب العلوم العسكرية (PDF)", type: "book", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=19qv4gWbM3FwgPDNYt-AcqW9CQHePSCbR" },
    { id: "mil-plan", title: "الخطة التنفيذية للمادة", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1zzFMWSQFYa5UE3TdlSFOrvCvTFSP5XPX" },
    { id: "mil-merged", title: "ملف مجمع (ilovepdf_merged)", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=15F_akpGL-mBSvBEAjjRQ75yiF7QS_TPc" },

    // --- شروحات ومراجعات ---
    { id: "mil-s1", title: "علوم عسكرية - مراجعة 1", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1HRCe4EAPeuKyciamM-cWWcFV-yr0gJ8L" },
    { id: "mil-s2", title: "تلخيص مادة العسكرية (Docx)", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1tuNYVaiG95TqHFKl-MXDLEFn9MrM7MZl" },

    // --- امتحانات الميد والشاشات (Midterm & Screens) ---
    { id: "mil-mid-p2", title: "ميد علوم عسكرية (الجزء الثاني)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1DDGoKsV6U9rfC_J8lNI8neLj6YxiltDq" },
    { id: "mil-screens-23", title: "شاشات عسكرية 2023", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=192sU5z9O5ptX6w5iZYTIBJpkp9huB6FA" },

    // --- امتحانات الفاينل (Final Exams) ---
    { id: "mil-final-sol", title: "عسكرية فاينل محلولة", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1NkO23QP0Idcfyc9SJu2_e58DqnaA4LNR" },
    { id: "mil-final-screens", title: "شاشات عسكرية فاينل (Modified)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1i6TSmnbs-LnxMkChFxr_yE98CchvciyF" },
    { id: "mil-f-p33", title: "أسئلة سنوات مجمعة (النموذج 33)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1KfTxXYy--6hzqngxZbT06FCtJTlJrspm" }
  ],
  "english101": [
    // --- الدوسية الرئيسية والخطة ---
    { id: "en-dossier", title: "دوسية م. عبدالله - انجليزي تطبيقي 1", type: "book", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1fBlTHBddOX3Iv4c3jPpqKHJYJlQ6yWwt" },
    { id: "en-plan", title: "خطة مساق انجليزي 1", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1rhIZ8FK_N_J8DDpFZYfeyt-LqPJDn5jl" },

    // --- الوحدات الدراسية وحلولها (Units & Solutions) ---
    { id: "en-u1", title: "الوحدة الأولى + الحل", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1C1tBt9umT26MPf4rhxH5xd5RVD8J9CUR" },
    { id: "en-u2", title: "الوحدة الثانية + الحل", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1jSyIukf3zjjTD9-r61XOSX-HqTu6byAl" },
    { id: "en-u3", title: "الوحدة الثالثة + الحل", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1o56Mk0X6_T7Jv1KaGKMshmGicgIrQJuG" },
    { id: "en-u4", title: "الوحدة الرابعة + الحل", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1V3Ci7wQBVL8_afSPLXAf9ZayX0sn37XI" },
    { id: "en-u5", title: "الوحدة الخامسة + الحل", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1e5446EU-wIb9IbMjR_5VWCNICi8cZQlY" },
    { id: "en-u6", title: "الوحدة السادسة + الحل", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1bPBbJHnGjIa2boVH5ZJVFg7i1a1EGcvG" },

    // --- الكويزات والأسئلة (Quizzes - 2024 New) ---
    { id: "en-q-summer", title: "كويز انجليزي 101 صيفي جديد", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1lfoRNElLKo4IKrx4tSkAZys6NGhG1Vbc" },
    { id: "en-q-2024", title: "كويز انجليزي 101 لعام 2024", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=133lW88SVCfApkGuhdPIhaDO24xp_JqtB" },
    { id: "en-q5-gram", title: "كويز قواعد الوحدة الخامسة (حل صحيح 2024)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1x0qq0pl6KEdlJQzjScO2_cm8Uw7HhZVL" },
    { id: "en-q5-voc", title: "كويز معاني الوحدة الخامسة (حل صحيح 2024)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1-isuBnyZcZNEk_bGBiH370sl03nt7uqW" },
    { id: "en-q4-gram", title: "كويز قواعد الوحدة الرابعة (2024)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1BN3LCu-ccc4Pl0UUCl9GhERtayUp_K3T" },
    { id: "en-new-cur", title: "أسئلة المنهاج الجديد الشاملة", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1UNBYHQZl3hJCTJpcbwye8hsUwMI-13bW" }
  ],
  "english102": [
    // --- الدوسيات الرئيسية والشروحات ---
    { id: "en2-dossier", title: "دوسية شاملة للمادة - م. عبدالله", type: "book", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1zGbMFuyYeJbkteXJCS52jiQyg5iwogIG" },
    { id: "en2-gram-full", title: "ملخص قواعد كامل المادة", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1f2y_z0xnCYTP6e6LnKaS0uj66kNdFzEs" },
    { id: "en2-gram-shireen", title: "شرح القواعد - د. شيرين", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=13zdB2lHLXwsehJLseLPCM8UFfzoMAwPd" },
    { id: "en2-voc", title: "مفردات المادة (Vocabulary)", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1sDXiIuk6F4YYkP7CTdPd5LbUudRONrKc" },

    // --- الوحدات الدراسية وحلولها (Units & Solutions) ---
    { id: "en2-u1", title: "الوحدة الأولى + الحل", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1ryJJBaooOV5gzDDnvoehGPUomqT3mk5s" },
    { id: "en2-u2", title: "الوحدة الثانية + الحل", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1frpBOEtu1c2hQ046UUQWXEwHWCfYW5eR" },
    { id: "en2-u3", title: "الوحدة الثالثة + الحل", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1OErshXkoCWnTj5jD9fOzctT5TES_tvtK" },
    { id: "en2-u4", title: "الوحدة الرابعة + الحل", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=14YHNCtAi2x3LrqkoNqc4QuC-t2lKRCeS" },
    { id: "en2-u5", title: "الوحدة الخامسة + الحل", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1lWobJ6gVPIkELNfsQJOL4dj3KgJEC-8e" },
    { id: "en2-u6", title: "الوحدة السادسة + الحل", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1DZtTHZZ8isOlIrXnwkAraX6Z0agZm0oO" },

    // --- امتحانات الميد والفاينل ---
    { id: "en2-mid-summary", title: "مراجعة الميد - شهد الكفاوين", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1ts3Xai9et6OfQ-JjLTFiMZVSH3u33Eqa" },
    { id: "en2-mid-exam", title: "نموذج امتحان ميد 102", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1TzRpBA53LwDrZA9985qMo1bZys9VWYVH" },
    { id: "en2-final-exam", title: "نموذج امتحان فاينل 102", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1Uw6pfqKEn2GUYAb7V06w7-KawkZ6PBv4" },
    { id: "en2-union-gram", title: "ملخص الاتحاد - قواعد الفاينل", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1Z4v1UTnL_E3QLAuXlt60BKWTzlqCsQgv" },

    // --- الكويزات (2024 New) ---
    { id: "en2-q-today-24", title: "كويز صيفي جديد 2024 مع الحل", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1xdWvqFKHJmldOOlZG-UG2XJKEQ98MgZZ" },
    { id: "en2-q1-sol", title: "كويز 1 محلول", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1bXjI70433jWaeQY8hzyWfKHORICPOtGP" },
    { id: "en2-q2-sol-24", title: "كويز 2 محلول 2024", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1NQ04F-2aojfCDeJEeaitxMl4NkpLFyqa" },
    { id: "en2-q3-sol-24", title: "كويز 3 محلول 2024", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1t3-HbtshcmpTy7BvChrgVTsKI8GEB_a9" }
  ],
  "applied_arabic": [
    // --- الوحدات الدراسية (Units) ---
    { id: "ar-u1", title: "اللغة العربية - الوحدة الأولى", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1TqPjmKo9RLy3DQx16TiiSpd3Iy0KJW0" },
    { id: "ar-u2", title: "اللغة العربية - الوحدة الثانية", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1OqPjmKo9RLy3DQx16TiiSpd3Iy0KJW0" },
    { id: "ar-u3", title: "اللغة العربية - الوحدة الثالثة", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1LqPjmKo9RLy3DQx16TiiSpd3Iy0KJW0" },
    { id: "ar-u4", title: "اللغة العربية - الوحدة الرابعة", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1PqPjmKo9RLy3DQx16TiiSpd3Iy0KJW0" },
    { id: "ar-u5", title: "اللغة العربية - الوحدة الخامسة", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1IqPjmKo9RLy3DQx16TiiSpd3Iy0KJW0" },
    { id: "ar-u6", title: "اللغة العربية - الوحدة السادسة", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1JqPjmKo9RLy3DQx16TiiSpd3Iy0KJW0" },

    // --- التلخيصات والمراجعات الشاملة ---
    { id: "ar-summary", title: "تلخيص مادة العربي الشامل", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1lqPjmKo9RLy3DQx16TiiSpd3Iy0KJW0" },
    { id: "ar-full-rev", title: "مراجعة شاملة للمادة", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1MqPjmKo9RLy3DQx16TiiSpd3Iy0KJW0" },

    // --- امتحانات الميد والسنوات ---
    { id: "ar-years", title: "أسئلة سنوات سابقة", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1SqPjmKo9RLy3DQx16TiiSpd3Iy0KJW0" },
    { id: "ar-mid-screens", title: "شاشات امتحان الميد", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1BqPjmKo9RLy3DQx16TiiSpd3Iy0KJW0" }
  ],
  "engineering_workshop": [
    // --- المشاغل النظرية (Theoretical Content) ---
    { id: "ew-carp-summary", title: "ملخص مشغل النجارة والديكور", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1H6CIvA8IS0RiL4Ce_srhaPehVgylxZvG" },
    { id: "ew-elec-summary", title: "ملخص مشغل الكهرباء", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1wa9AS62dWIkW7-P8_fHHwCZYmfBKWDvz" },
    { id: "ew-weld-summary", title: "ملخص مشغل اللحام (نظري)", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1P02q1XASpHYRwIFRO5XA2ZMZSxseW9mH" },
    { id: "ew-turn-summary", title: "ملخص مشغل الخراطة والتسوية", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=182GMmivAMzplz_ZTrM7ZWhCRRIRTj9wt" },

    // --- ملفات المشاغل الشاملة ---
    { id: "ew-carp-full", title: "مشغل النجارة - كتاب", type: "book", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1J7vR-9QA7ui8Hp1bVk3PJsXkLBn8cg1R" },
    { id: "ew-elec-full", title: "مشغل الكهرباء - كتاب", type: "book", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1kLNqNPgnZd39KB7z5UenlBF5PV5mfw2m" },
    { id: "ew-turn-full", title: "مشغل الخراطة - كتاب", type: "book", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1I26X-A46IXk0_dhlswEBKXtn5-WszeOQ" },
    { id: "ew-weld-full", title: "مشغل اللحام - كتاب", type: "book", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1OdcibULxEehMNREC0u69Y6nIpZkDxiES" },

    // --- بنك أسئلة السنوات (Exams Bank) ---
    { id: "ew-years-1", title: "سنوات مشاغل - نموذج 1", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1CCwgO1FlP8JIokJqcYG7sNtGbs2h5ooR" },
    { id: "ew-years-2", title: "سنوات مشاغل - نموذج 2", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1g8CP9pmeCFmeSesR9ZCBCcQbyA5ps5Ge" },
    { id: "ew-years-3", title: "سنوات مشاغل - نموذج 3", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1q3gLNV45NSMheD9Qv6F6zSJK66wNNJL2" },
    { id: "ew-years-4", title: "سنوات مشاغل - نموذج 4", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1vCvkvlPIYlKcvRlRrw3dPUpqlah90AAm" },
    { id: "ew-years-5", title: "سنوات مشاغل - نموذج 5", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1ibi6w6wWWJE3A6dUuVG6JD4zWb2FjZbM" },
    { id: "ew-years-6", title: "سنوات مشاغل - نموذج 6", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1Pb4_URKlxvp_UoJ4HbDdROB6VN1xm-jU" },
    { id: "ew-years-7", title: "سنوات مشاغل - نموذج 7", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1-biwr8sCO0L3iwm5sGi2mzdvAKW7zJZa" }
  ],
  "programming_cpp": [
    // --- الشروحات المرئية (Videos & Visuals) ---
    { id: "cpp-v1", title: "شرح المهندس فتحي علان (CNE) - لغة C++", type: "video", uploader: "م. فتحي علان", size: "Playlist", url: "https://youtube.com/playlist?list=PLJwCQtAhsso_YNp8gh6b6sMkNJ8XzK9AP" },

    // --- السلايدات والشروحات (Slides & Resources) ---
    { id: "cpp-slides-samah", title: "سلايدات م. سماح (كاملة مع الأمثلة)", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=133Dw6fKzDclrLZk1aj5Ls61kjnQXZ1Oz" },
    { id: "cpp-slides-allak", title: "سلايدات م. فتحي العلاك", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1bFhkDxusD3N944G0pMqDBpQZ-rbD8NHa" },
    { id: "cpp-encyclopedia", title: "موسوعة أمثلة C++ المحلولة", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1-uqKPyhZxQ5FUeOE5n715JpyC-PsZ7ge" },
    { id: "cpp-sources", title: "مصادر شرح المادة", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1bOHzJ6k6X82HUFhlbQFN9yQgb7dqkTPI" },

    // --- التلخيصات والمراجعات (Summaries) ---
    { id: "cpp-sum-sanabel", title: "ملخص البرمجة - سنابل", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1o1eOdJFKF9eQcqTSdTsStXQelXTleNnO" },
    { id: "cpp-rev-final", title: "مراجعة البرمجة للمهندسين الشاملة", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1NSiyXTTULf-n9aR6HS_h_fHJ6j7eyiqn" },

    // --- الكويزات (Quizzes 2024 New) ---
    { id: "cpp-q-nawal-24", title: "كويز م. نوال 2024 محلول", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1OuaBXqMOWnhLOLeB6CRXPrzmQKPGm5qe" },
    { id: "cpp-q-samah-24", title: "كويز م. سماح 2024 محلول", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1teUgy_N8qEvaM7R3H9_MtbWbL3-aq01g" },
    { id: "cpp-lab-q-mid", title: "كويز لاب د. أنور (ميد)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1rx6WP2TOzREyAetx8WAF9MwevO5iHMGq" },
    { id: "cpp-lab-q-final", title: "كويز لاب د. أنور (فاينل)", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1gTMklGmNOOfxf6LGk4PyaaSa_rPNZAT6" },

    // --- امتحانات الميد والفاينل (Exams) ---
    { id: "cpp-mid-bara", title: "امتحان ميد - براء", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1b6gWX8OtdyuoZS3hgm0mqWAcSB9_Sgoc" },
    { id: "cpp-mid-lab", title: "ميد لاب C++", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1KzshD8Azfh-Y3T7NLtQU3ujrPfwoDPJX" },
    { id: "cpp-final-main", title: "امتحان فاينل C++", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1MXmri5bAj5kwdKEZIFoLJxrnKOVfxUIq" },
    { id: "cpp-final-lab", title: "فاينل لاب البرمجة", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1SJD4-YUUsKj_1j0ZIsWXxucM7Y5YP5YZ" },
    { id: "cpp-years-ideas", title: "أفكار أسئلة سنوات مجمعة", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/uc?export=download&id=1CwuWUa91tJTQfDJ1I4RobbEPD1c3Azk0" }
  ],
  "c4": [
    // --- الشروحات المرئية (Videos) ---
    { id: "st-v1", title: "شرح المهندس إبراهيم عكة - الاستاتيكا", type: "video", uploader: "إبراهيم عكة", size: "Playlist", url: "https://youtu.be/ArvcNcomZps?si=jOwRg9-aBzY-QldB" },
    { id: "st-v2", title: "شرح الدكتور أحمد عوض الله - الاستاتيكا", type: "video", uploader: "د. أحمد عوض الله", size: "Playlist", url: "https://www.youtube.com/playlist?list=PLxRkgs4bYI6_g5uELRBTxCvF0VVRxVxRZ" },

    // --- ملخصات ودوسيات (Summaries) ---
    { id: "st-s1", title: "ملخص السيفيل تيم (استاتيكا)", type: "summary", uploader: "Civil Team", size: "PDF", url: "https://drive.google.com/open?id=1aN4x4Xv79WAwCRXx1NXeVWmeLUozJFVC" },
    { id: "st-s2", title: "ملخص محمد سلامة", type: "summary", uploader: "محمد سلامة", size: "PDF", url: "https://drive.google.com/open?id=1BMMgSWJJfb15ZQc4_Syl2AwSBKVT70Js" },
    { id: "st-s3", title: "Statics PDF الشامل", type: "summary", uploader: "Admin", size: "PDF", url: "https://drive.google.com/open?id=1pwrExHNG22KQCjuBjsUf3uhbKW0PPivZ" },

    // --- امتحانات وسنوات (Exams) ---
    { id: "st-e1", title: "ميد استاتيكا شاشات", type: "exam", uploader: "Admin", size: "PDF", url: "https://drive.google.com/open?id=1ZvGsDSY_ONfPdsf2ImI650D7geRYwb7D" },
    { id: "st-e2", title: "استاتيكا ميد ورقي", type: "exam", uploader: "Admin", size: "PDF", url: "https://drive.google.com/open?id=1e420bDgNzRwGiZEVmI7Y801BDNZo_s1V" },
    { id: "st-e3", title: "استاتيكا فاينل ورقي 1", type: "exam", uploader: "Admin", size: "PDF", url: "https://drive.google.com/open?id=1t1V48qfu7BwZqeRy0OR_lu4x0h24JYih" },
    { id: "st-e4", title: "استاتيكا ميد 2023", type: "exam", uploader: "Admin", size: "PDF", url: "https://drive.google.com/open?id=1XhAVjhyTPZF46sfuJ-LqPPKxtmOV6MXR" },
    { id: "st-e5", title: "الامتحان النهائي - الفصل الثاني 2020", type: "exam", uploader: "Admin", size: "PDF", url: "https://drive.google.com/open?id=1_YixxomwtK_wUf5YIHqxwiv4zrKUtxPO" },
    { id: "st-e6", title: "فاينال 2023", type: "exam", uploader: "Admin", size: "PDF", url: "https://drive.google.com/open?id=1ZrAwTaeMhAmerbQd3xmIj-O859441vcB" },
    { id: "st-e7", title: "الامتحان النصفي - الفصل الثاني 2020", type: "exam", uploader: "Admin", size: "PDF", url: "https://drive.google.com/open?id=1P0C0LIlk_JZRT8ztEhvdH87xV50Yamnc" },
    { id: "st-e8", title: "شاشات استاتيكا ميد (نسخة 2)", type: "exam", uploader: "Admin", size: "PDF", url: "https://drive.google.com/open?id=1NQuXfvfbYyFPHNDwyl_qmNHu7BMwwAa9" },
    { id: "st-e9", title: "استاتيكا فاينال 2025 صيفي", type: "exam", uploader: "Admin", size: "PDF", url: "https://drive.google.com/open?id=1EVx7K1RyeVvLnoCCYxmcUXmX8dSSKuq1" },
    { id: "st-e10", title: "استاتيكا ميد 2022", type: "exam", uploader: "Admin", size: "PDF", url: "https://drive.google.com/open?id=1o4w572tSB0fwEvhbDbJgYsczY_NZwpwg" }
  ],
  "ce_dynamics": [
    { id: "dyn-1", title: "002_7.jpg", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1FCQWxRanVYu63IcJlkAP25ME4u6SjmdK" },
    { id: "dyn-2", title: "اسئلة سابقة ديناميكا سكند.pdf", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1rOirQOBkDO3ltz6Yma4L4jEVLITwV28W" },
    { id: "dyn-3", title: "أسئلة مقترحة.jpg", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1u2SYhDPwQorfOts2dZee9wjB4xmyNdp-" },
    { id: "dyn-4", title: "8419919.jpg", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1IF_xeUr-qRkLgKKTCzjqWBsa3lRLFV0C" },
    { id: "dyn-5", title: "5284616.jpg", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1QrLz0w44S5oR7whAnBj8hamWSQg0Buum" },
    { id: "dyn-6", title: "Engineering Mechanics_ Dynamics 14th Edition.pdf", type: "book", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1dXR31jJG9t5uqQZbVo38cXsoPRQYRHH-" },
    { id: "dyn-7", title: "حلول شابتر 17 داينمك (1) (1).pdf", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1CVPFvs16HDKSgQC-t9J2zZeuHz7XHYsd" },
    { id: "dyn-8", title: "اسئلة سابقة ديناميكا فيرست.pdf", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1eOirQOBkDO3ltz6Yma4L4jEVLITwV28W" }
  ],
  "auto_mech_drawing": [
    { id: "mech-dr-1", title: "All about Manual drawing.pdf", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1Na5dU2P0sMHotlcJi9eRJ4lAfon9mc_4" },
    { id: "mech-dr-2", title: "تلخيص رسم يدوي.pdf", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1W7_K1O7l2oM_wOmBxMv-UxQIRnGTZW6S" },
    { id: "mech-dr-3", title: "تمارين رسم ميكانيكي.pdf", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1wejF6bd4Xkho919bJjtMqzli2ANcpBY9" }
  ],
  "engineering_drawing": [
    { id: "eng-dr-1", title: "تمارين أوتوكاد .pdf", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1JX1G4WL3ZVGwsB-s86aqsh8wZuQulwPW" },
    { id: "eng-dr-2", title: "1.02.pdf", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1F4jGz8ciT1hliIjknfTH0iPL1Bob-3Qy" },
    { id: "eng-dr-3", title: "تمارين الرسم الهندسي المعتمدة.pdf", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1-1kMdPdkMdkQZRKt8YaskYEcPVK6DxuO" },
    { id: "eng-dr-4", title: "Assignment 5.pdf", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1ZqAustIAmCG9SKJZMOVbw46akX8GQ6h-" },
    { id: "eng-dr-5", title: "Assignment 4.pdf", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1EfGG0MlObnyM4_88ORgDmQNxDCaDejiE" },
    { id: "eng-dr-6", title: "Assignment 3.pdf", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1SM49opVz5jIiC7atVfDJmYFxGYwh2_SP" },
    { id: "eng-dr-7", title: "Assignment 2 (1).pdf", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1NYAXgIBqXaoh0_X0zucuUaPnMA-I9Y-0" }
  ],
  "e_electromagnetics": [
    { id: "em-1", title: "شرح+دفتر كهرومغناطيسية.pdf", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1keGNZHQiHaL76VyImVyTah2VrlpQiD5v" },
    { id: "em-2", title: "كتاب كهرو (spu .. 1).pdf", type: "book", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=14qOlaR6vN82k9MppAERk8SK9CPfVp7Rv" },
    { id: "em-3", title: "اسئلة الكويز.pdf", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1-d1K3jIFXe-V7Pg6O3g3WbADr1CFqHiu" },
    { id: "em-4", title: "ميد كهرو صيفي (SPU).pdf", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=178X-5jpCCAZI3Oa4qY2Fl9C3119y06Gz" },
    { id: "em-5", title: "ميد كهرو 1 د.امجد 2024-2025.pdf", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1O9ynv5WR4GthyGMN8t6OU9E5IEjNaNqk" },
    { id: "em-6", title: "سنوات كهرو منوعة(ورقي).pdf", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=11yA3vJwVdKRGilp9AU8_KzLYAAa7UFO_" },
    { id: "em-7", title: "فاينل 1.pdf", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1CSySHLi96OySdCFLaH8yhhDXV0nbOdSW" },
    { id: "em-8", title: "اسئلة ميد.pdf", type: "exam", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1acOUxq3_aoPoI4gi5b2D9WabvY-3QmOY" }
  ],
  "ce_surveying": [
    { id: "sur-1", title: "ملخص مادة المساحة (ميد+فاينال)", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1SrLArF8gzHy62mgvVBLmbFwDotmNEwmf" },
    { id: "sur-2", title: "دفتر الطالبة فاطمة عودة مساحة.pdf", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1FSNG9NIVfKGjvQaE70NPRgzmariBw2dQ" }
  ],
  "ce_surveying_lab": [
    { id: "sur-l-1", title: "ملخص مادة مختبر المساحة (ميد+فاينال)", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1rP0a71_BNMH-cVG-2vYrIoUugvne-8V1" },
    { id: "sur-l-2", title: "تقارير مادة مختبر المساحة", type: "summary", uploader: "Admin", size: "N/A", url: "https://drive.google.com/open?id=1NPNtj-Tben-HFLZn_9jrPbiRnkXVHX_H" }
  ],
};

// Instructor IDs assigned per course (references faculty[].id)
export const instructorsByCourse: Record<string, string[]> = {
  c1: ["1", "7"],          // Data Structures — AI prof + Embedded prof
  c2: ["1", "7"],          // OS
  c4: ["3", "8"],          // Statics
  c5: ["4"],               // Thermodynamics
  c6: ["1"],               // Calculus (placeholder)
  c7: ["5"],               // Mass & Energy Balances
  c8: ["6"],               // Operations Research
  ee201: ["6"],            // Engineering Economy
};


export interface MarketItem {
  id: string;
  title: string;
  titleAr: string;
  condition: "new" | "used";
  price: number;
  seller: string;
  whatsapp: string;
  description: string;
}

export const marketItems: MarketItem[] = [
  { id: "m1", title: "Casio FX-991EX Calculator", titleAr: "آلة حاسبة كاسيو FX-991EX", condition: "used", price: 18, seller: "Ahmad", whatsapp: "962790000010", description: "Excellent condition, used one semester." },
  { id: "m2", title: "Engineering Drawing Set", titleAr: "طقم رسم هندسي", condition: "new", price: 25, seller: "Layla", whatsapp: "962790000011", description: "Brand new, sealed package." },
  { id: "m3", title: "Data Structures Textbook", titleAr: "كتاب هياكل البيانات", condition: "used", price: 12, seller: "Omar", whatsapp: "962790000012", description: "All chapters intact, minor highlighting." },
  { id: "m4", title: "Arduino Uno Starter Kit", titleAr: "طقم اردوينو أونو", condition: "used", price: 35, seller: "Sara", whatsapp: "962790000013", description: "Complete kit with all components and cables." },
  { id: "m5", title: "Lab Coat (Size M)", titleAr: "معطف مختبر (مقاس M)", condition: "new", price: 15, seller: "Yousef", whatsapp: "962790000014", description: "Never worn, white." },
  { id: "m6", title: "AutoCAD Reference Book", titleAr: "كتاب أوتوكاد المرجعي", condition: "used", price: 10, seller: "Rana", whatsapp: "962790000015", description: "2022 edition, great condition." },
];

export interface Building {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  departments: string[];
  departmentsAr: string[];
  imageUrl: string;
  mapUrl: string;
}

export const buildings: Building[] = [
  {
    id: "b1",
    name: "Engineering Building A",
    nameAr: "مبنى الهندسة أ",
    description: "Main building for Civil and Mechanical departments.",
    descriptionAr: "المبنى الرئيسي لأقسام المدني والميكانيك.",
    departments: ["Civil", "Mechanical"],
    departmentsAr: ["مدني", "ميكانيك"],
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1600&auto=format&fit=crop",
    mapUrl: "https://maps.google.com/?q=31.980,35.910"
  },
  {
    id: "b2",
    name: "Technology Hub",
    nameAr: "مركز التكنولوجيا",
    description: "Advanced labs for Computer and Electrical engineering.",
    descriptionAr: "مختبرات متقدمة لهندسة الحاسوب والكهرباء.",
    departments: ["Computer", "Electrical"],
    departmentsAr: ["حاسوب", "كهرباء"],
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop",
    mapUrl: "https://maps.google.com/?q=31.981,35.911"
  },
  {
    id: "b3",
    name: "Industrial Complex",
    nameAr: "المجمع الصناعي",
    description: "Workshops and chemical engineering labs.",
    descriptionAr: "مشاغل ومختبرات الهندسة الكيميائية.",
    departments: ["Industrial", "Chemical"],
    departmentsAr: ["صناعي", "كيميائي"],
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1600&auto=format&fit=crop",
    mapUrl: "https://maps.google.com/?q=31.982,35.912"
  }
];
