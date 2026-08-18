export function FeedSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-card rounded-2xl border border-border/50 overflow-hidden">
          <div className="flex items-center gap-3 p-4">
            <div className="w-10 h-10 rounded-full animate-shimmer" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-32 rounded animate-shimmer" />
              <div className="h-2 w-24 rounded animate-shimmer" />
            </div>
          </div>
          <div className="px-4 pb-3 space-y-2">
            <div className="h-3 w-full rounded animate-shimmer" />
            <div className="h-3 w-3/4 rounded animate-shimmer" />
          </div>
          {i % 2 === 0 && <div className="mx-4 mb-3 h-48 rounded-xl animate-shimmer" />}
          <div className="px-4 py-3 border-t border-border/40 flex gap-4">
            <div className="h-8 w-20 rounded-full animate-shimmer" />
            <div className="h-8 w-12 rounded-full animate-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}
