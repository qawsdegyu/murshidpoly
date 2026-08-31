import { Skeleton } from "@/components/ui/skeleton";

export default function SchedulePlannerSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-[1700px] w-full" role="status" aria-label="جارٍ تحميل مخطط الجدول...">
      {/* Header Skeleton */}
      <div className="space-y-2 mb-8">
        <div className="h-10 w-64 bg-white/15 rounded-xl animate-pulse" />
        <div className="h-5 w-[450px] bg-white/5 rounded-lg animate-pulse" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
        {/* Sidebar Controls Skeleton */}
        <div className="lg:col-span-3 xl:col-span-3 space-y-5">
          {/* Main Action Card Skeleton */}
          <div className="p-6 rounded-[2rem] bg-card/75 border border-border/60 space-y-5">
            <div className="h-14 bg-white/10 rounded-2xl w-full animate-pulse" />
            <div className="h-10 bg-white/5 rounded-xl w-full animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-28 bg-white/5 rounded animate-pulse" />
              <div className="h-12 bg-white/5 rounded-xl w-full animate-pulse" />
            </div>
            <div className="space-y-3 pt-3 border-t border-white/5">
              <div className="flex justify-between">
                <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
                <div className="h-4 w-10 bg-white/10 rounded animate-pulse" />
              </div>
              <div className="h-2 bg-white/5 rounded-full w-full animate-pulse" />
            </div>
          </div>

          {/* Available Courses list Skeleton */}
          <div className="p-6 rounded-[2rem] bg-card/75 border border-border/60 space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-6 w-32 bg-white/10 rounded animate-pulse" />
              <div className="h-6 w-10 bg-white/10 rounded-lg animate-pulse" />
            </div>
            <div className="h-10 bg-white/5 rounded-xl w-full animate-pulse" />
            <div className="space-y-2.5 h-[300px] overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="p-3 bg-white/5 border border-white/5 rounded-xl flex justify-between items-center">
                  <div className="h-4 w-4 bg-white/10 rounded-full animate-pulse" />
                  <div className="flex flex-col items-end space-y-1.5">
                    <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
                    <div className="h-3.5 w-20 bg-white/5 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Grid/Table Content Skeleton */}
        <div className="lg:col-span-9 xl:col-span-9 space-y-6">
          {/* Options Strip Skeleton */}
          <div className="flex justify-between items-center p-5 bg-card/75 border border-border/60 rounded-[2rem]">
            <div className="flex items-center gap-6">
              <div className="space-y-2">
                <div className="h-3 w-20 bg-white/5 rounded animate-pulse" />
                <div className="h-10 w-32 bg-white/10 rounded-xl animate-pulse" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-24 bg-white/5 rounded-xl animate-pulse" />
              <div className="h-12 w-12 bg-white/10 rounded-full animate-pulse" />
              <div className="h-12 w-32 bg-white/15 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Schedule Canvas Skeleton */}
          <div className="bg-card/75 border border-border/60 rounded-[2.5rem] p-6 h-[600px] flex flex-col justify-between">
            <div className="grid grid-cols-5 gap-4 h-12 border-b border-white/5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-center items-center">
                  <div className="h-4 w-12 bg-white/10 rounded animate-pulse" />
                </div>
              ))}
            </div>
            <div className="flex-1 grid grid-cols-5 gap-4 py-4">
              {[...Array(5)].map((_, col) => (
                <div key={col} className="space-y-4 relative">
                  {col === 1 && (
                    <div className="absolute top-10 left-0 right-0 h-28 bg-white/10 rounded-2xl border-l-4 border-l-accent/40 p-3 space-y-2 animate-pulse">
                      <div className="h-3 w-3/4 bg-white/10 rounded" />
                      <div className="h-3 w-1/2 bg-white/5 rounded" />
                    </div>
                  )}
                  {col === 3 && (
                    <div className="absolute top-36 left-0 right-0 h-28 bg-white/10 rounded-2xl border-l-4 border-l-accent/40 p-3 space-y-2 animate-pulse">
                      <div className="h-3 w-3/4 bg-white/10 rounded" />
                      <div className="h-3 w-1/2 bg-white/5 rounded" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
