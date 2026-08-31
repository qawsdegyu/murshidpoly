export const engineeringTips = [
  "المهندس الناجح يدرك هذه الحقيقة: اقرأ في مجالات خارج تخصصك، فالثقافة الواسعة تفتح لك آفاقاً جديدة في التفكير.",
  "لا تحفظ القوانين الهندسية بل افهم من أين جاءت وكيف تم استنتاجها، فالفهم يرسخ في العقل بينما الحفظ يتلاشى.",
  "تنظيم وقتك بين المحاضرات والمشاريع هو أول مهارة هندسية يجب أن تتقنها في الجامعة.",
  "العمل الجماعي (Teamwork) في مشاريع التخرج والمساقات يعكس بيئة العمل الحقيقية، فتعلم كيف تستمع لزملائك وتشارك أفكارك.",
  "استخدم الورقة والقلم لرسم المخططات المبدئية لأي فكرة قبل البدء بتنفيذها على البرامج الهندسية.",
  "لا تتردد في سؤال الدكاترة والمهندسين عن أي فكرة غير واضحة، فالسؤال هو مفتاح المعرفة.",
  "احرص على تعلم برامج التصميم والمحاكاة الخاصة بتخصصك (مثل AutoCAD, MATLAB, SolidWorks) في وقت مبكر.",
  "احتفظ بملخصاتك وملاحظاتك الخاصة، ستكون المرجع الأول لك في الامتحانات وحتى بعد التخرج.",
  "الرياضيات والفيزياء هما لغة الهندسة الأساسية، إتقانك لهما يسهل عليك فهم أعمق المواد تعقيداً.",
  "المهندس المتميز هو الذي يبحث عن المشاكل ليجد لها حلولاً مبتكرة، وليس من يكتفي بتطبيق الحلول الجاهزة.",
  "خصص وقتاً أسبوعياً لتعلم مهارة جديدة خارج خطتك الدراسية، مثل البرمجة أو اللغات أو مهارات العرض.",
  "الفشل في تجربة أو مشروع جامعي ليس نهاية المطاف، بل هو خطوة أولى نحو فهم أعمق ونجاح أكبر.",
  "تابع التطورات التكنولوجية والأبحاث الحديثة في مجالك الهندسي لتبقى دائماً في المقدمة.",
  "ابنِ شبكة علاقات طيبة مع زملائك وأساتذتك، فهذه العلاقات ستكون كنزاً ثميناً لك في حياتك المهنية.",
  "لا تكتفِ بالجانب النظري، بل ابحث عن فرص التدريب العملي والتطوع في المشاريع الهندسية لصقل مهاراتك."
];

const engineeringTipsEn = [
  "A successful engineer knows: read outside your major, broad knowledge opens new ways of thinking.",
  "Don't just memorize formulas, understand where they came from. Understanding stays while memorization fades.",
  "Organizing your time between lectures and projects is the first engineering skill you must master.",
  "Teamwork in graduation projects reflects real work environments. Learn to listen and share ideas.",
  "Use pen and paper to sketch initial ideas before jumping into engineering software.",
  "Never hesitate to ask professors and engineers. Questions are the keys to knowledge.",
  "Learn design and simulation software (like AutoCAD, MATLAB, SolidWorks) early on.",
  "Keep your own summaries and notes; they will be your best reference for exams and beyond.",
  "Math and Physics are the core languages of engineering. Mastering them makes complex subjects easier.",
  "An outstanding engineer looks for problems to find innovative solutions, not just applying ready-made ones.",
  "Dedicate weekly time to learn a skill outside your study plan, like coding, languages, or presentation skills.",
  "Failure in a university project is not the end; it's the first step towards deeper understanding and success.",
  "Keep up with technological advancements and recent research in your field to always stay ahead.",
  "Build a good network with your colleagues and professors; these connections are a treasure for your career.",
  "Don't settle for theoretical knowledge; seek internships and volunteering in engineering projects to hone your skills."
];

// Returns a tip based on the day of the year and language
export function getTipOfTheDay(lang: string = "ar"): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  const tips = lang === "en" ? engineeringTipsEn : engineeringTips;
  return tips[dayOfYear % tips.length];
}
