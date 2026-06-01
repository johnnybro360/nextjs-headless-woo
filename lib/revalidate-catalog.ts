import { revalidatePath, revalidateTag } from "next/cache";
import { WC_CACHE_TAGS } from "@/lib/cache-tags";

export type RevalidateCatalogResult = {
  tags: string[];
  paths: string[];
  slug?: string;
};

/** Invalidate product fetch cache and rendered shop/PDP/sitemap routes. */
export function revalidateProductCatalog(slug?: string): RevalidateCatalogResult {
  const tags = [WC_CACHE_TAGS.products, WC_CACHE_TAGS.catalog];
  const paths = ["/", "/shop", "/sitemap.xml", "/image-sitemap.xml"];

  revalidateTag(WC_CACHE_TAGS.products);
  revalidateTag(WC_CACHE_TAGS.catalog);

  for (const path of paths) {
    revalidatePath(path);
  }

  if (slug) {
    const productTag = WC_CACHE_TAGS.product(slug);
    tags.push(productTag);
    paths.push(`/product/${slug}`);
    revalidateTag(productTag);
    revalidatePath(`/product/${slug}`);
  }

  return { tags, paths, slug };
}
