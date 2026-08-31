export type Lang = "en" | "ar";


const en = {
  en: {
    appName: "Murshid",
    tagline: "Your Engineering Companion at BAU",
    nav: {
      dashboard: "Dashboard",
      majors: "Majors",
      vault: "Course Vault",
      faculty: "Instructors",
      rideshare: "Murshid Carpool",
      roommate: "Murshid Housing",
      gpa: "GPA Calculator",
      campusMap: "Campus Map",
      marketplace: "Marketplace",
      recreation: "Dining & Cafes",
      laws: "University Laws",
      schedule: "Schedule Planner",

      settings: "Settings",
      logout: "Logout",
      mySchedule: "My Schedule",
      services: "Student Services",
      map: "Map",
      profile: "Profile",
      admin: "Admin Panel",
      noNotifications: "No new notifications",
      notifyUpdate: "We'll notify you when there's an update",
    },
    dashboard: {
      welcome: "Welcome, Engineer",
      future: "Future",
      hubDesc: "The Integrated Engineering Hub for Al-Balqa Applied University Students",
      tipOfTheDay: "Tip of the Day",
      treePlan: "Study Plan",
      schedule: "Study Schedule",
    },
    planner: {
        title: "Smart Schedule Planner",
        subtitle: "Design your semester schedule in one click with AI based on your approved roadmap.",
        tabs: {
          plan: "Plan",
          manual: "Manual",
          suggested: "Suggested"
        }
      },
    recreation: {
      title: "Restaurants & Cafeterias",
      subtitle: "The best dining spots and cafes near the BAU campus.",
    },
    dashboard_old: {
      welcome: "Welcome back",
      subtitle: "Everything you need to ace your engineering journey at BAU.",
      stats: {
        cgpa: "Current CGPA",
        hours: "Completed Hours",
        courses: "Active Courses",
        resources: "Available Resources",
      },
      quickActions: "Quick Actions",
      recent: "Recent Activity",
      campusGuide: "Campus Guide",
    },
    gpa: {
      title: "Smart GPA Engine",
      subtitle: "BAU 4.0 scale — accurate cumulative & semester calculation.",
      previous: "Previous Record",
      prevGpa: "Previous Cumulative GPA",
      prevHours: "Completed Hours",
      current: "Current Semester",
      addCourse: "Add Course",
      courseName: "Course Name",
      hours: "Hours",
      grade: "Grade",
      results: "Results",
      semGpa: "Semester GPA",
      newCgpa: "New Cumulative GPA",
      reset: "Reset",
    },
    faculty: {
      title: "Instructors Directory",
      subtitle: "Connect with BAU engineering professors.",
      search: "Search by name or specialization...",
      all: "All Departments",
      office: "Office",
      copyEmail: "Copy email",
      copyPhone: "Copy phone",
      copied: "Copied to clipboard",
      chatTeams: "Message on Teams",
    },
    majors: {
      title: "Engineering Majors",
      subtitle: "Explore departments at BAU's Faculty of Engineering Technology.",
      explore: "Explore",
      roadmap: "Study Plan Roadmap",
      careers: "Career Paths",
      year: "Year",
      about: "About the Major",
      quickInfo: "Quick Info",
      years: "Years",
      creditHours: "Credit Hours",
      difficulty: "Difficulty",
      uploadHint: "Upload Image Here",
      uploadSub: "Add a hero image for this major in mockData.ts → imageUrl",
    },
    vault: {
      title: "Course Vault",
      subtitle: "Summaries, books, exams and quizzes — organized.",
      search: "Search courses...",
      tabs: {
        summaries: "Summaries & Handouts",
        books: "Books & References",
        exams: "Past Papers",
        videos: "Video Tutorials",
        instructors: "Instructors",
      },
      download: "Download",
      read: "Read",
      fullscreen: "Full Screen",
      exitFullscreen: "Exit Full Screen",
      close: "Close",
      empty: "No resources yet.",
      noInstructors: "No instructors assigned yet.",
      emailCopied: "Email Copied!",
      phoneCopied: "Phone Number Copied!",
    },
    market: {
      title: "Engineering Marketplace",
      subtitle: "Trade tools, books and equipment with fellow students.",
      condition: "Condition",
      new: "New",
      used: "Used",
      contact: "Contact on WhatsApp",
      price: "JOD",
    },
    settings: {
      title: "Settings",
      subtitle: "Manage your account and preferences.",
      tabs: { profile: "Profile", appearance: "Appearance", language: "Language" },
      fullName: "Full Name",
      email: "BAU Email",
      password: "Password",
      save: "Save Changes",
      saved: "Preferences saved",
      theme: "Theme",
      light: "White Theme",
      dark: "Black Theme",
      pink: "Pink Theme",
      lang: "Interface Language",
      english: "English",
      arabic: "العربية",
    },
    common: {
      back: "Back",
      loading: "Loading...",
    },
    footer: {
      sections: [
        {
          title: "Academic Services",
          items: [
            { name: "Course Vault", path: "/vault" },
            { name: "GPA Calculator", path: "/gpa" },
            { name: "Instructors Directory", path: "/instructors" },
            { name: "Course Newspaper", path: "/newspaper" }
          ]
        },
        {
          title: "University Life",
          items: [
            { name: "Campus Map", path: "/campus-map" },
            { name: "Dining & Cafes", path: "/recreation" },
            { name: "Marketplace", path: "/marketplace" }
          ]
        },
        {
          title: "Important Links",
          items: [
            { name: "Laws & Regulations", path: "/laws" },
            { name: "Student Portal", path: "https://s3.ebalqa.courses/fet/login/index.php?loginredirect=1" },
            { name: "BAU Official Website", path: "https://www.bau.edu.jo/" }
          ]
        },
        {
          title: "Support & Help",
          items: [
            { name: "Privacy Policy", path: "/privacy" },
            { name: "Contact Us", path: "/contact" },
            { name: "Copyrights", path: "/copyright" },
            { name: "FAQ", path: "/faq" }
          ]
        }
      ],
      bottom: {
        login: "Login",
        majors: "Majors",
        vault: "Vault",
        rights: "Murshid Platform. All Rights Reserved."
      }
    }
  },
  ar: {
    appName: "مُرشد",
    tagline: "مرشد.. رفيقك في رحلتك الهندسية بجامعة البلقاء",
    nav: {
      dashboard: "الرئيسية",
      majors: "التخصصات",
      vault: "خزانة المواد",
      faculty: "المدرسون",
      rideshare: "مرشد توصيل",
      roommate: "مرشد سكني",
      gpa: "حاسبة المعدل",
      campusMap: "مواقع المباني",
      marketplace: "السوق",
      recreation: "مطاعم و كفتيريات",
      laws: "قوانين الجامعة",
      schedule: "منسق الجداول",

      settings: "الإعدادات",
      logout: "تسجيل خروج",
      mySchedule: "جدولي",
      services: "الخدمات الطلابية",
      map: "الخريطة",
      profile: "حسابي",
      admin: "صفحة الأدمن",
      noNotifications: "لا يوجد إشعارات حالياً",
      notifyUpdate: "سنقوم بإعلامك فور توفر تحديثات جديدة",
    },
    dashboard: {
      welcome: "مرحباً بك يا مهندس",
      future: "المستقبل",
      hubDesc: "المركز الهندسي المتكامل لطلاب جامعة البلقاء التطبيقية (البوليتكنك)",
      tipOfTheDay: "نصيحة اليوم",
      treePlan: "الخطة الشجرية",
      schedule: "الجدول الدراسي",
    },
    planner: {
        title: "مخطط الجدولة الذكي",
        subtitle: "صمم جدولك الدراسي بنقرة واحدة باستخدام الذكاء الاصطناعي بناءً على الخطة المعتمدة.",
        tabs: {
          plan: "الخطة",
          manual: "يدوي",
          suggested: "مقترح"
        }
      },
    recreation: {
      title: "مطاعم و كفتيريات",
      subtitle: "أبرز المطاعم، الكافيهات، والخدمات القريبة من حرم البلقاء.",
    },
    dashboard_old: {
      welcome: "مرحباً بعودتك",
      subtitle: "كل ما تحتاجه لتتفوق في رحلتك الهندسية في البلقاء.",
      stats: {
        cgpa: "المعدل التراكمي",
        hours: "الساعات المنجزة",
        courses: "المواد الحالية",
        resources: "المصادر المتاحة",
      },
      quickActions: "إجراءات سريعة",
      recent: "النشاط الأخير",
      campusGuide: "دليل المباني",
    },
    gpa: {
      title: "حاسبة المعدل الذكية",
      subtitle: "نظام البلقاء 4.0 — حساب دقيق للمعدل الفصلي والتراكمي.",
      previous: "السجل السابق",
      prevGpa: "المعدل التراكمي السابق",
      prevHours: "الساعات المنجزة",
      current: "الفصل الحالي",
      addCourse: "إضافة مادة",
      courseName: "اسم المادة",
      hours: "الساعات",
      grade: "العلامة",
      results: "النتائج",
      semGpa: "معدل الفصل",
      newCgpa: "المعدل التراكمي الجديد",
      reset: "إعادة تعيين",
    },
    faculty: {
      title: "دليل المدرسين",
      subtitle: "تواصل مع مدرسي هندسة البلقاء.",
      search: "ابحث بالاسم أو التخصص...",
      all: "كل الأقسام",
      office: "المكتب",
      copyEmail: "نسخ البريد",
      copyPhone: "نسخ الرقم",
      copied: "تم النسخ",
      chatTeams: "تواصل عبر تيمز",
    },
    majors: {
      title: "التخصصات الهندسية",
      subtitle: "استكشف أقسام كلية الهندسة التكنولوجية في البلقاء.",
      explore: "استكشاف",
      roadmap: "الخطة الدراسية",
      careers: "المسارات المهنية",
      year: "السنة",
      about: "عن التخصص",
      quickInfo: "معلومات سريعة",
      years: "سنوات الدراسة",
      creditHours: "الساعات المعتمدة",
      difficulty: "مستوى الصعوبة",
      uploadHint: "أضف صورة هنا",
      uploadSub: "حدّث حقل imageUrl في ملف mockData.ts لإضافة صورة هذا التخصص",
    },
    vault: {
      title: "خزانة المواد",
      subtitle: "ملخصات، كتب، امتحانات وكويزات — منظمة.",
      search: "ابحث عن مادة...",
      tabs: {
        summaries: "ملخصات ودوسيات",
        books: "كتب ومراجع",
        exams: "امتحانات سابقة",
        videos: "شروحات مرئية",
        instructors: "مدرسو المادة",
      },
      download: "تحميل",
      read: "قراءة",
      fullscreen: "ملء الشاشة",
      exitFullscreen: "إنهاء ملء الشاشة",
      close: "إغلاق",
      empty: "لا توجد مصادر بعد.",
      noInstructors: "لم يتم تعيين مدرسين بعد.",
      emailCopied: "تم نسخ البريد!",
      phoneCopied: "تم نسخ رقم الهاتف!",
    },
    market: {
      title: "السوق الهندسي",
      subtitle: "تبادل الأدوات والكتب والمعدات مع زملائك.",
      condition: "الحالة",
      new: "جديد",
      used: "مستعمل",
      contact: "تواصل عبر واتساب",
      price: "د.أ",
    },
    settings: {
      title: "الإعدادات",
      subtitle: "إدارة حسابك وتفضيلاتك.",
      tabs: { profile: "الملف الشخصي", appearance: "المظهر", language: "اللغة" },
      fullName: "الاسم الكامل",
      email: "البريد الجامعي",
      password: "كلمة المرور",
      save: "حفظ التغييرات",
      saved: "تم حفظ التفضيلات",
      theme: "السمة",
      light: "السمة البيضاء (أبيض)",
      dark: "السمة السوداء (أسود)",
      pink: "السمة الزهرية (زهري)",
      lang: "لغة الواجهة",
      english: "English",
      arabic: "العربية",
    },
    common: {
      back: "رجوع",
      loading: "جارٍ التحميل...",
    },
    footer: {
      sections: [
        {
          title: "خدمات أكاديمية",
          items: [
            { name: "خزانة المواد", path: "/vault" },
            { name: "حاسبة المعدل", path: "/gpa" },
            { name: "دليل المدرسين", path: "/instructors" },
            { name: "جريدة المواد", path: "/newspaper" }
          ]
        },
        {
          title: "الحياة الجامعية",
          items: [
            { name: "مواقع المباني", path: "/campus-map" },
            { name: "الكافتيريات والاستراحة", path: "/recreation" },
            { name: "السوق الطلابي", path: "/marketplace" }
          ]
        },
        {
          title: "روابط هامة",
          items: [
            { name: "القوانين والأنظمة", path: "/laws" },
            { name: "بوابة الطالب (التسجيل)", path: "https://s3.ebalqa.courses/fet/login/index.php?loginredirect=1" },
            { name: "موقع الجامعة الرسمي", path: "https://www.bau.edu.jo/" }
          ]
        },
        {
          title: "الدعم والمساعدة",
          items: [
            { name: "سياسة الخصوصية", path: "/privacy" },
            { name: "تواصل معنا", path: "/contact" },
            { name: "حقوق النشر والملكية", path: "/copyright" },
            { name: "الأسئلة الشائعة", path: "/faq" }
          ]
        }
      ],
      bottom: {
        login: "تسجيل الدخول",
        majors: "التخصصات",
        vault: "الخزانة",
        rights: "لمنصة مرشد. جميع الحقوق محفوظة"
      }
    }
  },
} as const;

export type Translation = typeof en.en;
export function getTranslations(lang: Lang): Translation {
  return (en[lang] || en.ar) as Translation;
}





