import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailSkeleton() {
  return (
    <article className="w-full max-w-7xl mx-auto">
      <div className="mb-10 flex flex-wrap items-center gap-2 md:mb-14">
        <Skeleton className="h-3.5 w-10" />
        <Skeleton className="h-3.5 w-2" />
        <Skeleton className="h-3.5 w-10" />
        <Skeleton className="h-3.5 w-2" />
        <Skeleton className="h-3.5 w-20" />
        <Skeleton className="h-3.5 w-2" />
        <Skeleton className="h-3.5 w-36" />
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.32fr_1fr] lg:gap-20 xl:gap-24">
        <div className="space-y-3 lg:space-y-4">
          <Skeleton className="aspect-4/5 min-h-24 w-full rounded-sm sm:min-h-28 lg:min-h-34 xl:min-h-38" />
          <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full rounded-sm" />
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:pt-2 lg:pl-2 xl:pl-6">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-4 h-12 w-full max-w-lg" />
          <Skeleton className="mt-4 h-12 w-5/6 max-w-md" />
          <div className="mt-6 flex gap-2">
            <Skeleton className="h-6 w-24 rounded-sm" />
            <Skeleton className="h-6 w-20 rounded-sm" />
          </div>

          <div className="mt-12 border-t border-border/50 pt-10">
            <Skeleton className="h-10 w-28" />
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
              <Skeleton className="h-4 w-14" />
            </div>
          </div>

          <div className="mt-12 border-t border-border/50 pt-10">
            <Skeleton className="h-3 w-16" />
            <div className="mt-4 flex flex-col gap-4 sm:flex-row">
              <Skeleton className="h-14 w-full rounded-sm sm:w-36" />
              <Skeleton className="h-14 flex-1 rounded-sm" />
            </div>
          </div>

          <div className="mt-12 border-t border-border/50 pt-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-10">
              <div className="flex items-center gap-3">
                <Skeleton className="size-4 rounded-full" />
                <Skeleton className="h-4 w-36" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="size-4 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 lg:mt-16">
          <div className="mx-auto w-full max-w-5xl">
            <Skeleton className="mb-8 h-3 w-36" />

            <div className="flex w-full flex-col gap-8 md:flex-row md:items-start md:gap-x-10 lg:gap-x-14">
              <div className="w-full shrink-0 space-y-2 md:w-44 lg:w-52">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>

              <div className="w-full border-t border-border/40 pt-8 md:border-t-0 md:border-l md:border-border/35 md:pl-10 lg:pl-14">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full max-w-prose" />
                  <Skeleton className="h-4 w-full max-w-prose" />
                  <Skeleton className="h-4 w-4/5 max-w-md" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
