import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="mb-10 flex flex-wrap items-center gap-2 md:mb-14">
        <Skeleton className="h-3.5 w-10" />
        <Skeleton className="h-3.5 w-2" />
        <Skeleton className="h-3.5 w-10" />
        <Skeleton className="h-3.5 w-2" />
        <Skeleton className="h-3.5 w-20" />
        <Skeleton className="h-3.5 w-2" />
        <Skeleton className="h-3.5 w-36" />
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.32fr_1fr] lg:gap-20">
        <div className="space-y-3">
          <Skeleton className="aspect-4/5 min-h-24 w-full rounded-sm lg:min-h-34" />
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full rounded-sm" />
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-4 h-12 w-full max-w-md" />
          <Skeleton className="mt-4 h-12 w-4/5 max-w-sm" />
          <div className="mt-6 flex gap-2">
            <Skeleton className="h-6 w-24 rounded-sm" />
            <Skeleton className="h-6 w-20 rounded-sm" />
          </div>

          <div className="mt-12 border-t border-border/50 pt-10">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="mt-4 h-4 w-32" />
          </div>

          <div className="mt-12 space-y-2">
            <Skeleton className="h-4 w-full max-w-md" />
            <Skeleton className="h-4 w-full max-w-md" />
            <Skeleton className="h-4 w-3/4 max-w-sm" />
          </div>

          <div className="mt-12">
            <Skeleton className="h-3 w-12" />
            <div className="mt-4 flex gap-2">
              <Skeleton className="h-14 w-20 rounded-sm" />
              <Skeleton className="h-14 w-20 rounded-sm" />
              <Skeleton className="h-14 w-20 rounded-sm" />
            </div>
          </div>

          <div className="mt-12 border-t border-border/50 pt-10">
            <Skeleton className="h-3 w-16" />
            <div className="mt-4 flex flex-col gap-4 sm:flex-row">
              <Skeleton className="h-14 w-full max-w-10 rounded-sm" />
              <Skeleton className="h-14 flex-1 rounded-sm" />
            </div>
          </div>

          <div className="mt-12 border-t border-border/50 pt-10">
            <div className="flex gap-6 border-b border-border/50 pb-4">
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="mt-8 space-y-2">
              <Skeleton className="h-4 w-full max-w-prose" />
              <Skeleton className="h-4 w-full max-w-prose" />
              <Skeleton className="h-4 w-4/5 max-w-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
