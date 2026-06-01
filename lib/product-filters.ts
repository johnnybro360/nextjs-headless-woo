import type { WooProductQueryParams } from "@/lib/woo-fetch";

export type ProductFilterState = {
  inStock: boolean;
  outOfStock: boolean;
  priceMin: string;
  priceMax: string;
  categories: string[];
  brands: string[];
  heatLevels: string[];
};

export type ShopFilterOptions = {
  categories: { id: number; name: string; slug: string; count: number }[];
  brands: { id: number; name: string; slug: string; count: number }[];
  heatLevels: { id: number; slug: string; label: string; count: number }[];
  heatAttributeSlug?: string;
  /** When true, heat is applied after fetch (custom product attribute, not global terms). */
  heatFilterOnClient?: boolean;
  priceRange: { min: number; max: number };
};

const HEAT_LABELS: Record<string, string> = {
  "1": "Mild",
  "2": "Medium",
  "3": "Hot",
  "4": "Extreme",
  Mild: "Mild",
  Medium: "Medium",
  Hot: "Hot",
  Extreme: "Extreme",
};

export function getHeatLabel(heat: string): string {
  return HEAT_LABELS[heat] ?? heat;
}

export const defaultProductFilters: ProductFilterState = {
  inStock: false,
  outOfStock: false,
  priceMin: "",
  priceMax: "",
  categories: [],
  brands: [],
  heatLevels: [],
};

export type ProductSortOption =
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "date-desc"
  | "date-asc";

export const defaultProductSort: ProductSortOption = "date-desc";

export const DEFAULT_PRODUCTS_PER_PAGE = 10;

export const productSortOptions: {
  value: ProductSortOption;
  label: string;
}[] = [
  { value: "name-asc", label: "Alphabetically (A–Z)" },
  { value: "name-desc", label: "Alphabetically (Z–A)" },
  { value: "price-asc", label: "Price: Low to high" },
  { value: "price-desc", label: "Price: High to low" },
  { value: "date-desc", label: "Newest first" },
  { value: "date-asc", label: "Oldest first" },
];

export function hasActiveFilters(filters: ProductFilterState): boolean {
  return (
    filters.inStock ||
    filters.outOfStock ||
    filters.priceMin !== "" ||
    filters.priceMax !== "" ||
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.heatLevels.length > 0
  );
}

export function parseProductSearchQuery(
  searchParams: Record<string, string | string[] | undefined>,
): string {
  return parseStringParam(searchParams.q).trim();
}

export function toggleFilterValue(values: string[], value: string): string[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

function parseListParam(value: string | string[] | undefined): string[] {
  if (!value) {
    return [];
  }

  const raw = Array.isArray(value) ? value.join(",") : value;
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseBooleanParam(value: string | string[] | undefined): boolean {
  if (!value) {
    return false;
  }

  const raw = Array.isArray(value) ? value[0] : value;
  return raw === "1" || raw === "true";
}

function parseStringParam(value: string | string[] | undefined): string {
  if (!value) {
    return "";
  }

  return Array.isArray(value) ? (value[0] ?? "") : value;
}

export function parseProductSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): ProductFilterState {
  return {
    inStock: parseBooleanParam(searchParams.in_stock),
    outOfStock: parseBooleanParam(searchParams.out_of_stock),
    priceMin: parseStringParam(searchParams.min_price),
    priceMax: parseStringParam(searchParams.max_price),
    categories: parseListParam(searchParams.category),
    brands: parseListParam(searchParams.brand),
    heatLevels: parseListParam(searchParams.heat),
  };
}

export function parseProductPage(
  searchParams: Record<string, string | string[] | undefined>,
): number {
  const raw = parseStringParam(searchParams.page);
  const page = Number.parseInt(raw, 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

export function parseProductSort(
  searchParams: Record<string, string | string[] | undefined>,
): ProductSortOption {
  const sort = parseStringParam(searchParams.sort);
  const validSorts = productSortOptions.map((option) => option.value);

  if (validSorts.includes(sort as ProductSortOption)) {
    return sort as ProductSortOption;
  }

  return defaultProductSort;
}

export function buildShopSearchParams(
  filters: ProductFilterState,
  sort: ProductSortOption,
  searchQuery = "",
  page = 1,
): URLSearchParams {
  const params = new URLSearchParams();

  if (searchQuery) {
    params.set("q", searchQuery);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  if (sort !== defaultProductSort) {
    params.set("sort", sort);
  }

  if (filters.inStock) {
    params.set("in_stock", "1");
  }

  if (filters.outOfStock) {
    params.set("out_of_stock", "1");
  }

  if (filters.priceMin) {
    params.set("min_price", filters.priceMin);
  }

  if (filters.priceMax) {
    params.set("max_price", filters.priceMax);
  }

  if (filters.categories.length > 0) {
    params.set("category", filters.categories.join(","));
  }

  if (filters.brands.length > 0) {
    params.set("brand", filters.brands.join(","));
  }

  if (filters.heatLevels.length > 0) {
    params.set("heat", filters.heatLevels.join(","));
  }

  return params;
}

export function  buildShopCategoryHref(categorySlug: string): string {
  const params = new URLSearchParams();
  params.set("category", categorySlug);
  return `/shop?${params.toString()}`;
}

function mapSlugsToIds(
  slugs: string[],
  items: { id: number; slug: string }[],
): string[] {
  return slugs
    .map((slug) => items.find((item) => item.slug === slug)?.id)
    .filter((id): id is number => id !== undefined)
    .map(String);
}

export function getProductPageRange(
  page: number,
  perPage: number,
  total: number,
): { from: number; to: number } {
  if (total === 0) {
    return { from: 0, to: 0 };
  }

  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);
  return { from, to };
}

export function productFiltersToWooParams(
  filters: ProductFilterState,
  sort: ProductSortOption,
  options: ShopFilterOptions,
  searchQuery = "",
  page = 1,
  perPage = DEFAULT_PRODUCTS_PER_PAGE,
): WooProductQueryParams {
  const params: WooProductQueryParams = {
    per_page: perPage,
    page,
    status: "publish",
  };

  if (searchQuery) {
    params.search = searchQuery;
  }

  switch (sort) {
    case "name-asc":
      params.orderby = "title";
      params.order = "asc";
      break;
    case "name-desc":
      params.orderby = "title";
      params.order = "desc";
      break;
    case "price-asc":
      params.orderby = "price";
      params.order = "asc";
      break;
    case "price-desc":
      params.orderby = "price";
      params.order = "desc";
      break;
    case "date-desc":
      params.orderby = "date";
      params.order = "desc";
      break;
    case "date-asc":
      params.orderby = "date";
      params.order = "asc";
      break;
  }

  if (filters.inStock && !filters.outOfStock) {
    params.stock_status = "instock";
  } else if (filters.outOfStock && !filters.inStock) {
    params.stock_status = "outofstock";
  }

  if (filters.priceMin) {
    params.min_price = filters.priceMin;
  }

  if (filters.priceMax) {
    params.max_price = filters.priceMax;
  }

  if (filters.categories.length > 0) {
    const categoryIds = mapSlugsToIds(filters.categories, options.categories);
    if (categoryIds.length > 0) {
      params.category = categoryIds.join(",");
    }
  }

  if (filters.brands.length > 0) {
    const brandIds = mapSlugsToIds(filters.brands, options.brands);
    if (brandIds.length > 0) {
      params.brand = brandIds.join(",");
    }
  }

  if (
    filters.heatLevels.length > 0 &&
    options.heatAttributeSlug &&
    !options.heatFilterOnClient
  ) {
    const heatTermIds = mapSlugsToIds(filters.heatLevels, options.heatLevels);
    if (heatTermIds.length > 0) {
      params.attribute = options.heatAttributeSlug;
      params.attribute_term = heatTermIds.join(",");
    }
  }

  return params;
}

export function applyClientHeatFilter<T extends { heat: string }>(
  products: T[],
  filters: ProductFilterState,
): T[] {
  if (filters.heatLevels.length === 0) {
    return products;
  }

  return products.filter((product) => filters.heatLevels.includes(product.heat));
}

export function getActiveFilterCount(filters: ProductFilterState): number {
  let count = 0;
  if (filters.inStock) count += 1;
  if (filters.outOfStock) count += 1;
  if (filters.priceMin !== "") count += 1;
  if (filters.priceMax !== "") count += 1;
  count += filters.categories.length;
  count += filters.brands.length;
  count += filters.heatLevels.length;
  return count;
}
