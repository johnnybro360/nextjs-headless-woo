import Link from "next/link";
import { CategoryProductList } from "@/components/category-product-list";
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
  parseProductSearchParams,
  parseProductSearchQuery,
  parseProductSort,
  productFiltersToWooParams,
} from "@/lib/product-filters";
import { getProducts, getShopFilterOptions } from "@/lib/products";

interface CategoryPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function CategoryPage({ searchParams }: CategoryPageProps) {
  const params = await searchParams;
  const filters = parseProductSearchParams(params);
  const sort = parseProductSort(params);
  const searchQuery = parseProductSearchQuery(params);
  const filterOptions = await getShopFilterOptions();
  const wooParams = productFiltersToWooParams(
    filters,
    sort,
    filterOptions,
    searchQuery,
  );
  const { products: fetchedProducts, total: fetchedTotal } = await getProducts({
    params: { options: wooParams },
  });

  const products = filterOptions.heatFilterOnClient
    ? (applyClientHeatFilter(fetchedProducts, filters) as typeof fetchedProducts)
    : fetchedProducts;
  const total = filterOptions.heatFilterOnClient
    ? products.length
    : fetchedTotal;

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

      <CategoryProductList
        products={products}
        total={total}
        filterOptions={filterOptions}
        filters={filters}
        sort={sort}
        searchQuery={searchQuery}
      />
    </div>
  );
}
