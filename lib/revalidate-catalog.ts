import { revalidatePath, revalidateTag } from "next/cache";
import { WC_CACHE_TAGS } from "@/lib/cache-tags";

/** Must match the cache profile used with tagged `fetch` calls in Next.js 16+ */
const CACHE_PROFILE = "max";

export type RevalidateCatalogResult = {
  tags: string[];
  paths: string[];
  slug?: string;
};

function revalidateWcTag(tag: string): void {
  revalidateTag(tag, CACHE_PROFILE);
}

/** Invalidate product fetch cache and rendered shop/PDP/sitemap routes. */
export function revalidateProductCatalog(slug?: string): RevalidateCatalogResult {
  const tags: string[] = [WC_CACHE_TAGS.products, WC_CACHE_TAGS.catalog];
  const paths = ["/", "/shop", "/sitemap.xml", "/image-sitemap.xml"];

  revalidateWcTag(WC_CACHE_TAGS.products);
  revalidateWcTag(WC_CACHE_TAGS.catalog);

  for (const path of paths) {
    revalidatePath(path);
  }

  if (slug) {
    const productTag = WC_CACHE_TAGS.product(slug);
    tags.push(productTag);
    paths.push(`/product/${slug}`);
    revalidateWcTag(productTag);
    revalidatePath(`/product/${slug}`);
  }

  return { tags, paths, slug };
}
