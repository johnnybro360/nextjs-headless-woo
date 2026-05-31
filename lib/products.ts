"use server";

import { mapWooProduct, mapWooVariation } from "@/lib/mappers/productMapper";
import { wooFetch, type WooProductQueryParams } from "@/lib/woo-fetch";
import {
  getHeatLabel,
  type ShopFilterOptions,
} from "@/lib/product-filters";
import type { WooProduct } from "@/types/wooProduct";
import type { WooProductVariation } from "@/types/wooProductVariation";
import {
  ProductViewModel,
  ProductVariationViewModel,
} from "@/types/productViewModel";

export interface ProductsResult {
  products: ProductViewModel[];
  total: number;
}

interface ProductParams {
  options?: WooProductQueryParams;
}

type WooCategory = {
  id: number;
  name: string;
  slug: string;
  count: number;
};

type WooBrand = {
  id: number;
  name: string;
  slug: string;
  count: number;
};

type WooAttribute = {
  id: number;
  name: string;
  slug: string;
};

type WooAttributeTerm = {
  id: number;
  name: string;
  slug: string;
  count: number;
};

export async function getProducts({
  params,
}: {
  params: ProductParams;
}): Promise<ProductsResult> {
  try {
    const { data, headers } = await wooFetch<WooProduct[]>("/products", {
      per_page: 100,
      status: "publish",
      ...params.options,
    });

    const total = Number(headers.get("X-WP-Total") ?? data.length);

    return {
      products: data.map(mapWooProduct),
      total,
    };
  } catch (error) {
    console.error("API Route Error:", error);
    return { products: [], total: 0 };
  }
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductViewModel | undefined> {
  try {
    const { data } = await wooFetch<WooProduct[]>("/products", {
      slug,
      status: "publish",
    });

    return data.map(mapWooProduct)[0];
  } catch (error) {
    console.error("API Route Error:", error);
    return undefined;
  }
}

export async function getVariationsByProductId(
  productId: string,
): Promise<ProductVariationViewModel[] | undefined> {
  try {
    const { data } = await wooFetch<WooProductVariation[]>(
      `/products/${productId}/variations`,
    );

    return data.map(mapWooVariation);
  } catch (error) {
    console.error("API Route Error:", error);
    return undefined;
  }
}

async function getCategories(): Promise<WooCategory[]> {
  try {
    const { data } = await wooFetch<WooCategory[]>("/products/categories", {
      per_page: 100,
      hide_empty: true,
      orderby: "name",
      order: "asc",
    });

    return data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

async function getBrands(): Promise<WooBrand[]> {
  try {
    const { data } = await wooFetch<WooBrand[]>("/products/brands", {
      per_page: 100,
      hide_empty: true,
      orderby: "name",
      order: "asc",
    });

    return data;
  } catch (error) {
    console.error("Failed to fetch brands:", error);
    return [];
  }
}

async function fetchAttributeTerms(
  attributeId: number,
): Promise<WooAttributeTerm[]> {
  const path = `/products/attributes/${attributeId}/terms`;

  try {
    const { data } = await wooFetch<WooAttributeTerm[]>(path, {
      per_page: 100,
      orderby: "name",
      order: "asc",
    });
    return data;
  } catch {
    const { data } = await wooFetch<WooAttributeTerm[]>(path, {
      per_page: 100,
    });
    return data;
  }
}

async function getHeatAttributeTerms(): Promise<{
  attributeSlug?: string;
  terms: WooAttributeTerm[];
}> {
  try {
    const { data: attributes } = await wooFetch<WooAttribute[]>(
      "/products/attributes",
      {
        per_page: 100,
      },
    );

    const heatAttribute = attributes.find(
      (attribute) =>
        attribute.name.toLowerCase() === "heat" ||
        attribute.slug === "pa_heat" ||
        attribute.slug === "heat",
    );

    if (!heatAttribute) {
      return { terms: [] };
    }

    const terms = await fetchAttributeTerms(heatAttribute.id);

    return {
      attributeSlug: heatAttribute.slug,
      terms,
    };
  } catch (error) {
    console.error("Failed to fetch heat attribute terms:", error);
    return { terms: [] };
  }
}

function buildHeatLevelsFromProducts(
  products: ProductViewModel[],
): ShopFilterOptions["heatLevels"] {
  const counts = new Map<string, number>();

  for (const product of products) {
    if (!product.heat) {
      continue;
    }
    counts.set(product.heat, (counts.get(product.heat) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort(([a], [b]) => getHeatLabel(a).localeCompare(getHeatLabel(b)))
    .map(([slug, count], index) => ({
      id: index + 1,
      slug,
      label: getHeatLabel(slug),
      count,
    }));
}

export async function getShopFilterOptions(): Promise<ShopFilterOptions> {
  const [categories, brands, heatAttribute, priceBounds] = await Promise.all([
    getCategories(),
    getBrands(),
    getHeatAttributeTerms(),
    getProducts({
      params: { options: { per_page: 100, orderby: "price", order: "asc" } },
    }),
  ]);

  const prices = priceBounds.products.map((product) => product.price);
  const heatFromTerms = heatAttribute.terms.map((term) => ({
    id: term.id,
    slug: term.slug,
    label: term.name,
    count: term.count,
  }));
  const heatFromProducts = buildHeatLevelsFromProducts(priceBounds.products);
  const useClientHeatFilter =
    heatFromTerms.length === 0 && heatFromProducts.length > 0;

  return {
    categories: categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      count: category.count,
    })),
    brands: brands.map((brand) => ({
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      count: brand.count,
    })),
    heatLevels: useClientHeatFilter ? heatFromProducts : heatFromTerms,
    heatAttributeSlug: heatAttribute.attributeSlug,
    heatFilterOnClient: useClientHeatFilter,
    priceRange: {
      min: prices.length > 0 ? Math.min(...prices) : 0,
      max: prices.length > 0 ? Math.max(...prices) : 0,
    },
  };
}
