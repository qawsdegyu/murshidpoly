import CardSkeleton from './CardSkeleton';

export default function VaultSkeleton() {
  return (
    <div role="status" aria-label="جارٍ تحميل المواد...">
      {/* فلاتر */}
      <div className="mb-6 flex gap-2">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-9 w-20 animate-pulse rounded-full bg-white/10"
          />
        ))}
      </div>

      {/* شبكة المواد */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[...Array(9)].map((_, i) => (
          <CardSkeleton key={i} lines={4} hasImage={false} />
        ))}
      </div>

      <span className="sr-only">جارٍ تحميل خزانة المواد</span>
    </div>
  );
}
