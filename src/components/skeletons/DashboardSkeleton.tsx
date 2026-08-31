import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="flex flex-col w-full min-h-screen" role="status" aria-label="جارٍ تحميل لوحة التحكم...">
      {/* Hero Banner Skeleton */}
      <div className="relative w-full min-h-[55vh] md:min-h-[70vh] flex items-center bg-card/20 border-b border-border/10 p-6 md:p-12 lg:p-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />
        <div className="relative z-20 max-w-5xl space-y-6 w-full">
          <div className="space-y-3">
            <div className="h-6 w-48 bg-white/10 rounded-lg animate-pulse" />
            <div className="h-14 md:h-20 w-[280px] md:w-[480px] bg-white/15 rounded-2xl animate-pulse" />
            <div className="h-14 md:h-20 w-[200px] md:w-[350px] bg-white/10 rounded-2xl animate-pulse" />
          </div>
          <div className="h-5 w-80 bg-white/5 rounded-lg animate-pulse" />
          <div className="flex gap-4">
            <div className="h-12 w-32 bg-white/10 rounded-xl animate-pulse" />
            <div className="h-12 w-12 bg-white/10 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 space-y-16 md:space-y-24 w-full">
        {/* Stats Section Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-surface/80 border border-border p-4 md:p-6 rounded-2xl md:rounded-[2rem] space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 bg-white/10 rounded-xl animate-pulse" />
                <div className="h-4 w-4 bg-white/5 rounded animate-pulse" />
              </div>
              <div className="h-8 w-20 bg-white/15 rounded-lg animate-pulse" />
              <div className="h-4 w-28 bg-white/5 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Quick Actions Skeleton */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-8 w-40 bg-white/15 rounded-lg animate-pulse" />
            <div className="h-[2px] flex-1 bg-white/5 rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:flex lg:justify-center lg:gap-16">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-3 w-28">
                <div className="h-16 w-16 bg-white/10 rounded-[1.5rem] animate-pulse" />
                <div className="h-4 w-20 bg-white/10 rounded-md animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Campus Guide Skeleton */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-8 w-36 bg-white/15 rounded-lg animate-pulse" />
            <div className="h-[2px] flex-1 mx-6 bg-white/5 rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card/80 border border-border rounded-[2rem] overflow-hidden flex flex-col space-y-4">
                <div className="h-32 md:h-40 bg-white/10 animate-pulse w-full" />
                <div className="p-4 md:p-6 space-y-3 flex-1 flex flex-col">
                  <div className="flex gap-3 items-center">
                    <div className="h-8 w-8 bg-white/10 rounded-lg animate-pulse" />
                    <div className="h-6 w-32 bg-white/15 rounded animate-pulse" />
                  </div>
                  <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-white/5 rounded animate-pulse" />
                  <div className="h-6 w-20 bg-white/10 rounded-lg animate-pulse mt-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <span className="sr-only">جارٍ تحميل لوحة التحكم...</span>
    </div>
  );
}
