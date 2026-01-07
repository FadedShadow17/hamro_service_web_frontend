export function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-white/10 rounded-lg w-3/4"></div>
      <div className="h-4 bg-white/5 rounded-lg w-1/2"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-white/10 rounded-2xl"></div>
        ))}
      </div>
    </div>
  );
}

export function BookingCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl bg-[#1C3D5B] border border-white/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-white/10 rounded w-1/3"></div>
        <div className="h-6 bg-white/10 rounded w-20"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-white/10 rounded w-full"></div>
        <div className="h-4 bg-white/10 rounded w-2/3"></div>
        <div className="h-4 bg-white/10 rounded w-1/2"></div>
      </div>
    </div>
  );
}

