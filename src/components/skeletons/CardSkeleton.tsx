interface CardSkeletonProps {
  lines?: number;
  hasImage?: boolean;
  className?: string;
}

export default function CardSkeleton({
  lines = 3,
  hasImage = false,
  className = '',
}: CardSkeletonProps) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/5 p-4 ${className}`}
      role="status"
      aria-label="جارٍ التحميل..."
    >
      {hasImage && (
        <div className="mb-3 h-40 w-full animate-pulse rounded-xl bg-white/10" />
      )}
      <div className="space-y-2">
        {[...Array(lines)].map((_, i) => (
          <div
            key={i}
            className="h-3 animate-pulse rounded-full bg-white/10"
            style={{ width: i === lines - 1 ? '60%' : '100%' }}
          />
        ))}
      </div>
    </div>
  );
}
