import { getAllPublishedProducts } from "@/lib/products";

export const revalidate = 3600;

export default async function sitemap() {
  const baseUrl = process.env.PROD_URL;

  if (!baseUrl) {
    return [];
  }

  const products = await getAllPublishedProducts();

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: product.dateCreated
      ? new Date(product.dateCreated)
      : new Date(),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/policy`,
      lastModified: new Date(),
    },
    ...productUrls,
  ];
}
