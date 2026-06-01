import Link from "next/link";
import { CategoryProductList } from "@/components/category-product-list";
import { ShopStoreSync } from "@/components/shop-store-sync";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  applyClientHeatFilter,
  DEFAULT_PRODUCTS_PER_PAGE,
  parseProductPage,
  parseProductSearchParams,
  parseProductSearchQuery,
  parseProductSort,
  productFiltersToWooParams,
} from "@/lib/product-filters";
import { getProducts, getShopFilterOptions } from "@/lib/products";
import type { ProductViewModel } from "@/types/productViewModel";
import type { ProductFilterState, ProductSortOption, ShopFilterOptions } from "@/lib/product-filters";

interface CategoryPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function CategoryPage({ searchParams }: CategoryPageProps) {
  const params = await searchParams;
  const filters = parseProductSearchParams(params);
  const sort = parseProductSort(params);
  const searchQuery = parseProductSearchQuery(params);
  const page = parseProductPage(params);
  const filterOptions = await getShopFilterOptions();

  const needsClientHeatPagination =
    filterOptions.heatFilterOnClient && filters.heatLevels.length > 0;

  if (needsClientHeatPagination) {
    const wooParams = productFiltersToWooParams(
      filters,
      sort,
      filterOptions,
      searchQuery,
      1,
      100,
    );
    const { products: fetchedProducts } = await getProducts({
      params: { options: wooParams },
    });
    const filtered = applyClientHeatFilter(fetchedProducts, filters);
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / DEFAULT_PRODUCTS_PER_PAGE));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * DEFAULT_PRODUCTS_PER_PAGE;
    const products = filtered.slice(start, start + DEFAULT_PRODUCTS_PER_PAGE);

    return (
      <CategoryPageLayout
        searchQuery={searchQuery}
        filters={filters}
        sort={sort}
        page={safePage}
        products={products}
        total={total}
        totalPages={totalPages}
        filterOptions={filterOptions}
      />
    );
  }

  const wooParams = productFiltersToWooParams(
    filters,
    sort,
    filterOptions,
    searchQuery,
    page,
    DEFAULT_PRODUCTS_PER_PAGE,
  );
  const result = await getProducts({ params: { options: wooParams } });
  const safePage = Math.min(page, result.totalPages);

  return (
    <CategoryPageLayout
      searchQuery={searchQuery}
      filters={filters}
      sort={sort}
      page={safePage}
      products={result.products}
      total={result.total}
      totalPages={result.totalPages}
      filterOptions={filterOptions}
    />
  );
}

function CategoryPageLayout({
  searchQuery,
  filters,
  sort,
  page,
  products,
  total,
  totalPages,
  filterOptions,
}: {
  searchQuery: string;
  filters: ProductFilterState;
  sort: ProductSortOption;
  page: number;
  products: ProductViewModel[];
  total: number;
  totalPages: number;
  filterOptions: ShopFilterOptions;
}) {
  return (
    <div className="w-full max-w-7xl mx-auto">
      <Breadcrumb className="mb-10">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/shop">Shop</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{searchQuery ? "Search" : "Hot Sauces"}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-12 md:mb-16 max-w-2xl">
        <h1 className="font-display text-4xl md:text-5xl tracking-[0.03em] text-balance">
          {searchQuery ? `Results for “${searchQuery}”` : "Hot Sauces"}
        </h1>
        <p className="mt-5 text-muted-foreground leading-relaxed">
          {searchQuery
            ? "Products matching your search across our catalogue."
            : "Explore our curated collection of small-batch, handcrafted hot sauces sourced from artisan producers around the world."}
        </p>
      </div>

      <ShopStoreSync
        filters={filters}
        sort={sort}
        searchQuery={searchQuery}
        page={page}
      >
        <CategoryProductList
          products={products}
          total={total}
          totalPages={totalPages}
          currentPage={page}
          filterOptions={filterOptions}
        />
      </ShopStoreSync>
    </div>
  );
}
