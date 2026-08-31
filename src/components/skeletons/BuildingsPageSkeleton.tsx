import { Skeleton } from "@/components/ui/skeleton";

export default function BuildingsPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-[1600px] w-full" role="status" aria-label="جارٍ تحميل خريطة الحرم...">
      {/* Header */}
      <div className="space-y-2 mb-8">
        <div className="h-10 w-48 bg-white/15 rounded-xl animate-pulse" />
        <div className="h-5 w-96 bg-white/5 rounded-lg animate-pulse" />
      </div>

      {/* Main Layout: Split Screen Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Buildings Directory Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 bg-card/75 border border-border/60 rounded-[2rem] space-y-4">
            {/* Search Box */}
            <div className="h-11 bg-white/5 rounded-xl w-full animate-pulse" />
            {/* Categories filter */}
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-8 w-20 bg-white/10 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>

          {/* Buildings List */}
          <div className="space-y-4 max-h-[500px] overflow-hidden">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 bg-card/50 border border-border/30 rounded-2xl flex items-center gap-4 animate-pulse">
                <div className="h-16 w-16 bg-white/10 rounded-xl shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4.5 w-32 bg-white/15 rounded" />
                  <div className="h-3 w-48 bg-white/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Map Visual Panel */}
        <div className="lg:col-span-8 bg-card/75 border border-border/60 rounded-[2.5rem] p-6 h-[650px] flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <div className="h-6 w-40 bg-white/10 rounded animate-pulse" />
            <div className="flex gap-2">
              <div className="h-9 w-20 bg-white/5 rounded-xl animate-pulse" />
              <div className="h-9 w-20 bg-white/5 rounded-xl animate-pulse" />
            </div>
          </div>
          <div className="flex-1 bg-white/5 rounded-[2rem] m-2 animate-pulse flex items-center justify-center">
            <div className="h-20 w-20 rounded-full border-4 border-t-accent border-white/15 animate-spin" />
          </div>
        </div>
      </div>
    </div>
  );
}
