export default function CourseNewspaperSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-[1500px] w-full" role="status" aria-label="جرٍ تحميل جريدة المواد...">
      {/* Header */}
      <div className="space-y-2 mb-8">
        <div className="h-10 w-60 bg-white/15 rounded-xl animate-pulse" />
        <div className="h-5 w-80 bg-white/5 rounded-lg animate-pulse" />
      </div>

      <div className="p-6 bg-card/75 border border-border/60 rounded-[2rem] space-y-6 mb-8">
        {/* Search & Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-12 bg-white/5 rounded-xl w-full animate-pulse" />
          <div className="h-12 bg-white/5 rounded-xl w-full animate-pulse" />
          <div className="h-12 bg-white/5 rounded-xl w-full animate-pulse" />
        </div>
      </div>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-card/75 border border-border/60 rounded-[2rem] p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <div className="h-5 w-40 bg-white/15 rounded animate-pulse" />
                <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
              </div>
              <div className="h-6 w-16 bg-white/10 rounded-full animate-pulse" />
            </div>
            <div className="h-px bg-white/5 w-full" />
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-white/10 rounded-full animate-pulse" />
                <div className="h-4 w-32 bg-white/5 rounded animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-white/10 rounded-full animate-pulse" />
                <div className="h-4 w-20 bg-white/5 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
