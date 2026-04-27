// Mock announcements for the Murshid dashboard.

export interface Announcement {
  id: string;
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
}

export const announcements: Announcement[] = [
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
