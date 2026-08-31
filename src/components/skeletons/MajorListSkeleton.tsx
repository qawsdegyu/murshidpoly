import CardSkeleton from './CardSkeleton';

export default function MajorListSkeleton() {
  return (
    <div role="status" aria-label="جارٍ تحميل التخصصات...">
      {/* شريط البحث */}
      <div className="mb-6 h-11 w-full animate-pulse rounded-xl bg-white/10" />

      {/* شبكة البطاقات */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <CardSkeleton key={i} lines={3} hasImage={false} />
        ))}
      </div>

      {/* نص مخفي لقارئات الشاشة */}
      <span className="sr-only">جارٍ تحميل دليل التخصصات</span>
    </div>
  );
}
