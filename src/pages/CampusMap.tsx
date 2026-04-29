import { motion } from "framer-motion";
import { MapPin, Navigation, Building2, ExternalLink } from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";
import PageHeader from "@/components/PageHeader";

/* ── Building data for all 17 buildings ── */
const buildings = [
  {
    id: 1,
    nameAr: "مبنى 1",
    nameEn: "Building 1",
    descAr: "الإدارة المركزية، القبول والتسجيل، شؤون الطلبة.",
    descEn: "Central Administration, Admissions & Registration, Student Affairs.",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800",
    mapUrl: "https://maps.google.com/?q=Al+Balqa+Applied+University,+Salt,+Jordan",
    color: "from-emerald-700 to-teal-600",
    tag: "إدارة",
    tagEn: "Admin",
  },
  {
    id: 2,
    nameAr: "مبنى 2",
    nameEn: "Building 2",
    descAr: "قاعات المحاضرات والفصول الدراسية الرئيسية.",
    descEn: "Main lecture halls and primary classrooms.",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800",
    mapUrl: "https://maps.google.com/?q=Al+Balqa+Applied+University,+Salt,+Jordan",
    color: "from-blue-700 to-indigo-600",
    tag: "تدريس",
    tagEn: "Teaching",
  },
  {
    id: 3,
    nameAr: "مبنى 3",
    nameEn: "Building 3",
    descAr: "مكتبة الجامعة ومركز المعلومات والوثائق.",
    descEn: "University Library, Information & Documentation Center.",
    imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=800",
    mapUrl: "https://maps.google.com/?q=Al+Balqa+Applied+University,+Salt,+Jordan",
    color: "from-violet-700 to-purple-600",
    tag: "مكتبة",
    tagEn: "Library",
  },
  {
    id: 4,
    nameAr: "مبنى 4",
    nameEn: "Building 4",
    descAr: "قسم الهندسة الكهربائية، مختبرات الشبكات والاتصالات.",
    descEn: "Electrical Engineering Dept., Networks & Communications Labs.",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800",
    mapUrl: "https://maps.google.com/?q=Al+Balqa+Applied+University,+Salt,+Jordan",
    color: "from-amber-600 to-yellow-500",
    tag: "هندسة كهربائية",
    tagEn: "Electrical Eng.",
  },
  {
    id: 5,
    nameAr: "مبنى 5",
    nameEn: "Building 5",
    descAr: "قسم الهندسة المدنية ومختبرات المواد والإنشاء.",
    descEn: "Civil Engineering Dept. & Construction Materials Labs.",
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800",
    mapUrl: "https://maps.google.com/?q=Al+Balqa+Applied+University,+Salt,+Jordan",
    color: "from-stone-700 to-zinc-600",
    tag: "هندسة مدنية",
    tagEn: "Civil Eng.",
  },
  {
    id: 6,
    nameAr: "مبنى 6",
    nameEn: "Building 6",
    descAr: "مركز التعلم الإلكتروني وخدمات تقنية المعلومات.",
    descEn: "E-Learning Center & IT Services.",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
    mapUrl: "https://maps.google.com/?q=Al+Balqa+Applied+University,+Salt,+Jordan",
    color: "from-cyan-700 to-blue-600",
    tag: "تقنية",
    tagEn: "IT",
  },
  {
    id: 7,
    nameAr: "مبنى 7",
    nameEn: "Building 7",
    descAr: "عمادة كلية الهندسة التكنولوجية والشؤون الأكاديمية.",
    descEn: "Deanship of Engineering Technology & Academic Affairs.",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
    mapUrl: "https://maps.google.com/?q=Al+Balqa+Applied+University,+Salt,+Jordan",
    color: "from-rose-700 to-orange-600",
    tag: "عمادة",
    tagEn: "Deanship",
  },
  {
    id: 8,
    nameAr: "مبنى 8",
    nameEn: "Building 8",
    descAr: "مختبرات الهندسة الكيميائية ومشاغل معالجة المواد.",
    descEn: "Chemical Engineering Labs & Materials Processing Workshops.",
    imageUrl: "https://images.unsplash.com/photo-1518709779341-56cf4535e94a?auto=format&fit=crop&q=80&w=800",
    mapUrl: "https://maps.google.com/?q=Al+Balqa+Applied+University,+Salt,+Jordan",
    color: "from-orange-700 to-red-600",
    tag: "كيميائي",
    tagEn: "Chemical",
  },
  {
    id: 9,
    nameAr: "مبنى 9",
    nameEn: "Building 9",
    descAr: "المختبرات العلمية الأساسية (فيزياء، كيمياء).",
    descEn: "Core Science Labs (Physics & Chemistry).",
    imageUrl: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=800",
    mapUrl: "https://maps.google.com/?q=Al+Balqa+Applied+University,+Salt,+Jordan",
    color: "from-blue-800 to-cyan-600",
    tag: "مختبرات علمية",
    tagEn: "Science Labs",
  },
  {
    id: 10,
    nameAr: "مبنى 10",
    nameEn: "Building 10",
    descAr: "مركز الطلبة والأنشطة اللاصفية والخدمات الطلابية.",
    descEn: "Student Center, Extracurricular Activities & Student Services.",
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
    mapUrl: "https://maps.google.com/?q=Al+Balqa+Applied+University,+Salt,+Jordan",
    color: "from-green-700 to-emerald-600",
    tag: "طلابي",
    tagEn: "Student",
  },
  {
    id: 11,
    nameAr: "مبنى 11",
    nameEn: "Building 11",
    descAr: "قسم الهندسة الميكانيكية والمشاغل الهندسية.",
    descEn: "Mechanical Engineering Dept. & Engineering Workshops.",
    imageUrl: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=800",
    mapUrl: "https://maps.google.com/?q=Al+Balqa+Applied+University,+Salt,+Jordan",
    color: "from-slate-700 to-gray-600",
    tag: "هندسة ميكانيكية",
    tagEn: "Mechanical Eng.",
  },
  {
    id: 12,
    nameAr: "مبنى 12",
    nameEn: "Building 12",
    descAr: "قسم الهندسة الصناعية وبحوث العمليات.",
    descEn: "Industrial Engineering Dept. & Operations Research.",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
    mapUrl: "https://maps.google.com/?q=Al+Balqa+Applied+University,+Salt,+Jordan",
    color: "from-indigo-700 to-blue-600",
    tag: "صناعي",
    tagEn: "Industrial",
  },
  {
    id: 13,
    nameAr: "مبنى 13",
    nameEn: "Building 13",
    descAr: "مركز الأبحاث والتطوير والابتكار الهندسي.",
    descEn: "Research, Development & Engineering Innovation Center.",
    imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=800",
    mapUrl: "https://maps.google.com/?q=Al+Balqa+Applied+University,+Salt,+Jordan",
    color: "from-fuchsia-700 to-pink-600",
    tag: "بحث وتطوير",
    tagEn: "R&D",
  },
  {
    id: 14,
    nameAr: "مبنى 14",
    nameEn: "Building 14",
    descAr: "المبنى الرياضي: قاعات رياضية، ملاعب وأنشطة بدنية.",
    descEn: "Sports Complex: Gyms, Courts & Physical Activities.",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800",
    mapUrl: "https://maps.google.com/?q=Al+Balqa+Applied+University,+Salt,+Jordan",
    color: "from-lime-700 to-green-600",
    tag: "رياضة",
    tagEn: "Sports",
  },
  {
    id: 15,
    nameAr: "مبنى 15",
    nameEn: "Building 15",
    descAr: "قسم هندسة الحاسوب والمختبرات التقنية الحديثة.",
    descEn: "Computer Engineering Dept. & Advanced Tech Labs.",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
    mapUrl: "https://maps.google.com/?q=Al+Balqa+Applied+University,+Salt,+Jordan",
    color: "from-sky-700 to-blue-500",
    tag: "هندسة حاسوب",
    tagEn: "Computer Eng.",
  },
  {
    id: 16,
    nameAr: "مبنى 16",
    nameEn: "Building 16",
    descAr: "المطاعم والكافيتريات وخدمات الإطعام الطلابية.",
    descEn: "Restaurants, Cafeterias & Student Food Services.",
    imageUrl: "https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&q=80&w=800",
    mapUrl: "https://maps.google.com/?q=Al+Balqa+Applied+University,+Salt,+Jordan",
    color: "from-orange-600 to-amber-500",
    tag: "خدمات",
    tagEn: "Services",
  },
  {
    id: 17,
    nameAr: "مبنى 17",
    nameEn: "Building 17",
    descAr: "المجمع المدرجي والقاعات الدراسية الكبرى.",
    descEn: "Auditorium Complex & Large Lecture Halls.",
    imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800",
    mapUrl: "https://maps.google.com/?q=Al+Balqa+Applied+University,+Salt,+Jordan",
    color: "from-rose-800 to-pink-700",
    tag: "مدرجات",
    tagEn: "Auditoriums",
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: "easeOut" as const, delay },
});

export default function CampusMap() {
  const { lang, dir } = usePreferences();
  const ar = lang === "ar";

  return (
    <motion.div
      dir={dir}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="min-h-screen pb-20"
    >

      {/* ── Page Header ── */}
      <PageHeader
        title={ar ? "مواقع المباني" : "Campus Map"}
        subtitle={ar
          ? "دليل شامل لمباني الحرم الجامعي في جامعة البلقاء التطبيقية — اضغط على أي مبنى للانتقال إليه."
          : "Complete guide to BAU campus buildings — click any card to navigate."}
        icon={<Building2 className="w-6 h-6 text-primary dark:text-accent" strokeWidth={1.8} />}
        actions={
          <div className="flex flex-wrap items-center gap-3">
            {[
              { label: ar ? "إجمالي المباني" : "Total Buildings", value: "17", icon: "🏛️" },
              { label: ar ? "أقسام هندسية" : "Engineering Depts.", value: "6", icon: "⚙️" },
            ].map((s) => (
              <motion.div
                key={s.label}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-100 dark:bg-white/[0.05] border border-neutral-200 dark:border-white/10"
              >
                <span className="text-lg">{s.icon}</span>
                <span className="text-xs font-black text-neutral-900 dark:text-white">{s.value}</span>
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </motion.div>
            ))}
          </div>
        }
      />

      {/* ── Buildings Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {buildings.map((b, i) => (
          <motion.article
            key={b.id}
            {...fadeUp(0.04 + i * 0.03)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex flex-col rounded-[2rem] overflow-hidden border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.03] shadow-sm transition-all duration-300"
          >
            {/* Image */}
            <div className="relative h-44 overflow-hidden">
              <img
                src={b.imageUrl}
                alt={ar ? b.nameAr : b.nameEn}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800";
                }}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              {/* Building number badge */}
              <div className={`absolute top-3 ${dir === "rtl" ? "right-3" : "left-3"} w-9 h-9 rounded-full bg-gradient-to-br ${b.color} grid place-items-center shadow-lg`}>
                <span className="text-white font-black text-xs">{b.id}</span>
              </div>
              {/* Tag badge */}
              <div className={`absolute top-3 ${dir === "rtl" ? "left-3" : "right-3"}`}>
                <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wide">
                  {ar ? b.tag : b.tagEn}
                </span>
              </div>
              {/* Name overlay at bottom of image */}
              <div className="absolute bottom-0 inset-x-0 px-4 pb-3">
                <h2 className="text-white font-black text-xl md:text-2xl leading-none drop-shadow-lg" style={{ backgroundImage: "none", WebkitBackgroundClip: "unset", backgroundClip: "unset", color: "white" }}>
                  {ar ? b.nameAr : b.nameEn}
                </h2>
              </div>
            </div>

            {/* Card body */}
            <div className="flex flex-col flex-1 p-5 gap-4">
              {/* Description */}
              <p className="text-base text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed flex-1">
                {ar ? b.descAr : b.descEn}
              </p>

              {/* Color accent bar */}
              <div className={`h-1 rounded-full bg-gradient-to-r ${b.color} opacity-70`} />

              {/* Action button */}
              <motion.a
                href={b.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-gradient-to-r ${b.color} text-white text-sm font-bold shadow-md transition-all`}
              >
                <Navigation className="w-4 h-4 shrink-0" />
                <span>{ar ? "الانتقال عبر الخريطة" : "Open in Maps"}</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-70" />
              </motion.a>
            </div>

            {/* Hover glow border */}
            <div className={`pointer-events-none absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ring-1 ring-inset ring-white/20 dark:ring-white/10`} />
          </motion.article>
        ))}
      </div>

      {/* ── Footer note ── */}
      <motion.p
        {...fadeUp(0.6)}
        className="text-center text-xs text-muted-foreground mt-10 flex items-center justify-center gap-2"
      >
        <MapPin className="w-3.5 h-3.5" />
        {ar
          ? "جامعة البلقاء التطبيقية — البلقاء، السلط، الأردن"
          : "Al-Balqa Applied University — Al-Balqa, Salt, Jordan"}
      </motion.p>
    </motion.div>
  );
}
