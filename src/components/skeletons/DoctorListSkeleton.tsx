export default function DoctorListSkeleton() {
  return (
    <div role="status" aria-label="جارٍ تحميل المدرسين...">
      <div className="divide-y divide-white/10">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-4">
            {/* صورة المدرّس */}
            <div className="h-12 w-12 flex-shrink-0 animate-pulse rounded-full bg-white/10" />
            {/* بيانات المدرّس */}
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/3 animate-pulse rounded-full bg-white/10" />
              <div className="h-3 w-1/2 animate-pulse rounded-full bg-white/10" />
            </div>
            {/* زر */}
            <div className="h-8 w-20 animate-pulse rounded-lg bg-white/10" />
          </div>
        ))}
      </div>
      <span className="sr-only">جارٍ تحميل دليل المدرسين</span>
    </div>
  );
}
