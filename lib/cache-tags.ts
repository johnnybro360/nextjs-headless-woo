/** Next.js fetch cache tags for WooCommerce data */

export const WC_CACHE_TAGS = {
  products: "wc-products",
  catalog: "wc-catalog",
  product: (slug: string) => `wc-product-${slug}`,
} as const;

export const PRODUCT_WEBHOOK_TOPICS = new Set([
  "product.created",
  "product.updated",
  "product.deleted",
  "product.restored",
]);
