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
        <Skeleton className="mt-6 h-3 w-24" />
      </div>

      <div className={productListingGridClassName}>
        {Array.from({ length: count }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
