"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { CategoryFilters } from "@/components/category-filters";
import { CategorySort } from "@/components/category-sort";
import { ShopPagination } from "@/components/shop-pagination";
import { ProductCardSkeleton } from "@/components/product-grid-skeleton";
import { productListingGridClassName } from "@/components/product-grid";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useShopNavigation } from "@/hooks/use-shop-navigation";
import {
  DEFAULT_PRODUCTS_PER_PAGE,
  getActiveFilterCount,
  getProductPageRange,
  hasActiveFilters,
  type ShopFilterOptions,
} from "@/lib/product-filters";
import type { ProductViewModel } from "@/types/productViewModel";
import { cn } from "@/lib/utils";

interface CategoryProductListProps {
  products: ProductViewModel[];
  total: number;
  totalPages: number;
  currentPage: number;
  filterOptions: ShopFilterOptions;
}

export function CategoryProductList({
  products,
  total,
  totalPages,
  currentPage,
  filterOptions,
}: CategoryProductListProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const {
    filters,
    sort,
    searchQuery,
    isPending,
    setFilters,
    setSort,
    setPage,
    clearAllFilters,
  } = useShopNavigation();

  const activeFilterCount = useMemo(
    () => getActiveFilterCount(filters),
    [filters],
  );

  const { from, to } = getProductPageRange(
    currentPage,
    DEFAULT_PRODUCTS_PER_PAGE,
    total,
  );

  const productCountLabel = (() => {
    if (total === 0) {
      return searchQuery ? `No results for “${searchQuery}”` : "No products";
    }

    const rangeLabel =
      totalPages > 1 ? `Showing ${from}–${to} of ${total}` : `${total}`;

    if (searchQuery) {
      return `${rangeLabel} result${total === 1 ? "" : "s"} for “${searchQuery}”`;
    }

    if (hasActiveFilters(filters)) {
      return `${rangeLabel} products`;
    }

    return totalPages > 1
      ? `${rangeLabel} products`
      : `${total} product${total === 1 ? "" : "s"}`;
  })();

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-14 xl:gap-16">
      <aside className="hidden w-56 shrink-0 lg:block xl:w-60">
        <div className="sticky top-28 rounded-sm border border-border/50 p-6">
          <CategoryFilters
            filterOptions={filterOptions}
            filters={filters}
            onChange={setFilters}
            disabled={isPending}
          />
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-6">
          <p className="text-label">{productCountLabel}</p>

          <div className="flex flex-wrap items-center gap-4">
            <CategorySort
              value={sort}
              onChange={setSort}
              disabled={isPending}
            />

            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 rounded-sm border-border/70 px-4 text-[12px] font-medium tracking-[0.12em] uppercase lg:hidden"
                >
                  <SlidersHorizontal className="size-4" strokeWidth={1.5} />
                  Filters
                  {activeFilterCount > 0 ? (
                    <span className="ml-1 tabular-nums text-primary">
                      ({activeFilterCount})
                    </span>
                  ) : null}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full overflow-y-auto sm:max-w-sm">
                <SheetHeader className="border-b border-border/50 pb-4">
                  <SheetTitle className="font-display text-xl tracking-[0.02em]">
                    Filters
                  </SheetTitle>
                </SheetHeader>
                <div className="px-6 pb-8 pt-2">
                  <CategoryFilters
                    filterOptions={filterOptions}
                    filters={filters}
                    onChange={setFilters}
                    disabled={isPending}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {isPending ? (
          <div className={productListingGridClassName}>
            {Array.from({ length: DEFAULT_PRODUCTS_PER_PAGE }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className={productListingGridClassName}>
              {products.map((product) => (
                <ProductCard
                  key={product.slug}
                  slug={product.slug}
                  name={product.name}
                  origin={product.origin}
                  description={product.description}
                  price={product.price}
                  size={product.size}
                  imageSrc={product.imageSrc}
                  heat={product.heat}
                />
              ))}
            </div>

            <ShopPagination
              className="mt-14 md:mt-16"
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
              disabled={isPending}
            />
          </>
        ) : (
          <div
            className={cn(
              "rounded-sm border border-dashed border-border/60 px-6 py-16 text-center",
            )}
          >
            <p className="font-display text-2xl tracking-[0.02em]">
              No products match your filters
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Try adjusting availability, price, or heat level to see more results.
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-6 h-11 rounded-sm border-border/70"
              onClick={clearAllFilters}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
