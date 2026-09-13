export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse" dir="rtl">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-7 bg-neutral-200 rounded-lg w-48" />
          <div className="h-4 bg-neutral-100 rounded w-72" />
        </div>
        <div className="h-10 bg-neutral-200 rounded-xl w-32" />
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-neutral-200 space-y-3">
            <div className="flex justify-between">
              <div className="h-4 bg-neutral-100 rounded w-20" />
              <div className="w-8 h-8 bg-neutral-100 rounded-lg" />
            </div>
            <div className="h-8 bg-neutral-200 rounded w-28" />
            <div className="h-3 bg-neutral-100 rounded w-36" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="bg-white p-6 rounded-3xl border border-neutral-200 space-y-4">
        <div className="h-5 bg-neutral-200 rounded w-40" />
        <div className="space-y-3 pt-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-neutral-50 rounded-xl w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
