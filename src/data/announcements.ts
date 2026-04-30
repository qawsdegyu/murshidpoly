// Mock announcements for the Murshid dashboard.

export interface Founder {
  name: string;
  nameAr: string;
  role: string;
  roleAr: string;
  bio: string;
  bioAr: string;
  image: string;
}

export interface Announcement {
  id: string;
  created_at?: string;
  title: string;
  titleAr: string;
  shortDescription: string;
  shortDescriptionAr: string;
  fullDescription: string;
  fullDescriptionAr: string;
  imageUrl: string;        // empty = use placeholder
  ctaLabel: string;
  ctaLabelAr: string;
  ctaLink: string;
  badge: string;
  badgeAr: string;
  target_major?: string;
  is_global?: boolean;
  founders?: Founder[];
}

export const announcements: Announcement[] = [
  {
    id: "official-launch-v1",
    title: "Official Launch of Murshid v1.0",
    titleAr: "الإطلاق الرسمي لـ مرشد v1.0",
    shortDescription:
      "Created by a team of 2nd-year Engineering Students from BAU (Class of 2028). Meet the founders.",
    shortDescriptionAr:
      "تم إنشاؤه بواسطة فريق من طلاب الهندسة في السنة الثانية من جامعة البلقاء (دفعة 2028). تعرف على المؤسسين.",
    fullDescription:
      "We are proud to announce the official launch of Murshid v1.0, the ultimate engineering hub for BAU students. This project was conceptualized and built by a dedicated team of 2nd-year engineering students who saw a gap in student resources and decided to bridge it.\n\nOur mission is to empower every engineering student at BAU with the tools they need to succeed.",
    fullDescriptionAr:
      "نفخر بالإعلان عن الإطلاق الرسمي لـ مرشد v1.0، المركز الهندسي المتكامل لطلاب جامعة البلقاء التطبيقية. تم تصور هذا المشروع وبناؤه بواسطة فريق متخصص من طلاب الهندسة في السنة الثانية الذين رأوا فجوة في المصادر الطلابية وقرروا جسرها.\n\nمهمتنا هي تمكين كل طالب هندسة في جامعة البلقاء بالأدوات التي يحتاجها للنجاح.",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000",
    ctaLabel: "View Founder Story",
    ctaLabelAr: "عرض قصة المؤسسين",
    ctaLink: "#",
    badge: "v1.0 Launch",
    badgeAr: "إطلاق v1.0",
    is_global: true,
    founders: [
      {
        name: "Abdelrahman Al-Salhout",
        nameAr: "عبد الرحمن السلحوت",
        role: "Founder & CTO",
        roleAr: "المؤسس والمدير التقني (CTO)",
        bio: "The technical architect who brought the vision to life.",
        bioAr: "المهندس التقني الذي حول الرؤية إلى واقع.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abdulrahman"
      },
      {
        name: "Mohammed Saqr",
        nameAr: "محمد صقر",
        role: "Head of Relations & Data",
        roleAr: "رئيس العلاقات والبيانات",
        bio: "The engine behind gathering academic data and ensuring accuracy.",
        bioAr: "المحرك خلف جمع البيانات الأكاديمية وضمان دقتها.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohammad"
      },
      {
        name: "Abdullah Tahat",
        nameAr: "عبد الله طاهات",
        role: "Visual Identity & Social Media",
        roleAr: "الهوية البصرية والتواصل الاجتماعي",
        bio: "The creative force who crafted Murshid's stunning brand.",
        bioAr: "القوة المبدعة التي صممت علامة مرشد التجارية المذهلة.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abdullah"
      }
    ]
  },
  {
    id: "career-day-2026",
    title: "Engineering Career Day 2026",
    titleAr: "يوم المهن الهندسية 2026",
    shortDescription:
      "Meet 30+ top employers, attend workshops, and explore internships exclusively for BAU engineering students.",
    shortDescriptionAr:
      "قابل أكثر من 30 شركة رائدة، واحضر ورش العمل، واستكشف فرص التدريب حصرياً لطلاب هندسة البلقاء.",
    fullDescription:
      "Join the largest engineering recruitment event of the year on the BAU campus. Career Day 2026 brings together leading firms in civil, electrical, computer, mechanical, chemical, and industrial engineering — all under one roof. Attend live technical workshops, polish your CV at our resume clinic, and interview on-the-spot for internships and full-time roles. Whether you are graduating this year or just exploring your future path, this is your gateway to the Jordanian and regional engineering market.",
    fullDescriptionAr:
      "انضم إلى أكبر فعالية توظيف هندسية للعام في حرم جامعة البلقاء التطبيقية. يجمع يوم المهن 2026 الشركات الرائدة في الهندسة المدنية والكهربائية والحاسوب والميكانيكية والكيميائية والصناعية تحت سقف واحد. احضر ورش عمل تقنية مباشرة، حسّن سيرتك الذاتية في عيادة السير الذاتية، واجتز مقابلات فورية للحصول على فرص تدريب ووظائف. سواء كنت متخرجاً هذا العام أو تستكشف مستقبلك المهني، فهذه بوابتك إلى السوق الهندسي الأردني والإقليمي.",
    imageUrl: "",
    ctaLabel: "Apply Now",
    ctaLabelAr: "سجّل الآن",
    ctaLink: "https://bau.edu.jo",
    badge: "Announcement",
    badgeAr: "إعلان",
  },
  {
    id: "ai-workshop",
    title: "Free AI for Engineers Bootcamp",
    titleAr: "بوتكامب الذكاء الاصطناعي للمهندسين — مجاناً",
    shortDescription:
      "A 3-day intensive bootcamp on practical AI tools every modern engineer should master.",
    shortDescriptionAr:
      "بوتكامب مكثف لمدة 3 أيام حول أدوات الذكاء الاصطناعي العملية التي يجب أن يتقنها كل مهندس حديث.",
    fullDescription:
      "Step into the future of engineering. This free 3-day bootcamp covers prompt engineering, building automation pipelines with Python, working with vector databases, and deploying small AI agents for real engineering tasks — from CAD assistance to data analysis. Open to all BAU engineering students; certificates of completion will be awarded. Limited seats — early registration is strongly recommended.",
    fullDescriptionAr:
      "ادخل إلى مستقبل الهندسة. يغطي هذا البوتكامب المجاني لمدة 3 أيام هندسة الأوامر، وبناء أنظمة الأتمتة باستخدام بايثون، والعمل مع قواعد البيانات المتجهة، ونشر وكلاء ذكاء اصطناعي صغار لمهام هندسية حقيقية — من مساعدة التصميم إلى تحليل البيانات. مفتوح لجميع طلاب هندسة البلقاء؛ ستُمنح شهادات إتمام. المقاعد محدودة — يُنصح بالتسجيل المبكر.",
    imageUrl: "",
    ctaLabel: "Reserve Your Seat",
    ctaLabelAr: "احجز مقعدك",
    ctaLink: "https://murshid.app",
    badge: "Workshop",
    badgeAr: "ورشة",
  },
];
