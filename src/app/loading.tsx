export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      {/* Navbar Skeleton */}
      <div className="h-20 bg-white border-b border-neutral-100 flex items-center px-8 justify-between animate-pulse">
        <div className="w-32 h-8 bg-neutral-200 rounded-lg" />
        <div className="w-72 h-8 bg-neutral-100 rounded-full hidden md:block" />
        <div className="w-24 h-8 bg-neutral-200 rounded-lg" />
      </div>

      {/* Hero Skeleton */}
      <div className="max-w-7xl w-full mx-auto px-4 py-16 space-y-8 animate-pulse">
        <div className="h-80 bg-neutral-200/70 rounded-3xl w-full" />

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-neutral-200 p-4 space-y-3">
              <div className="aspect-4/5 bg-neutral-100 rounded-xl" />
              <div className="h-4 bg-neutral-200 rounded w-3/4" />
              <div className="h-3 bg-neutral-100 rounded w-1/2" />
              <div className="h-5 bg-neutral-200 rounded w-1/3 pt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
