import { ProductCardSkeleton } from "@/components/product-grid-skeleton";
import { productListingGridClassName } from "@/components/product-grid";
import { Skeleton } from "@/components/ui/skeleton";

export function CategoryPageSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="w-full max-w-7xl mx-auto">
      <nav aria-hidden className="mb-10 flex flex-wrap items-center gap-2">
        <Skeleton className="h-3.5 w-10" />
        <Skeleton className="h-3.5 w-2" />
        <Skeleton className="h-3.5 w-20" />
      </nav>

      <div className="mb-12 md:mb-16 max-w-2xl">
        <Skeleton className="h-10 w-48 md:h-12 md:w-56" />
        <div className="mt-5 space-y-2">
          <Skeleton className="h-4 w-full max-w-xl" />
          <Skeleton className="h-4 w-full max-w-lg" />
          <Skeleton className="h-4 w-4/5 max-w-md" />
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-14 xl:gap-16">
        <aside className="hidden w-56 shrink-0 lg:block xl:w-60" aria-hidden>
          <div className="rounded-sm border border-border/50 p-6">
            <Skeleton className="h-3 w-16" />
            <div className="mt-6 space-y-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-3 border-t border-border/50 pt-6 first:border-t-0 first:pt-0">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-3/5" />
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-8 border-b border-border/50 pb-6">
            <Skeleton className="h-3 w-24" />
          </div>

          <div className={productListingGridClassName}>
            {Array.from({ length: count }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
