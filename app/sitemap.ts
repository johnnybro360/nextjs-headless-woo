import { getProducts } from "@/lib/products";
// import { getAllPosts } from "@/lib/blog";

export const revalidate = 3600;

export default async function sitemap() {
  const baseUrl = process.env.PROD_URL;

  const { products } = await getProducts({params: {options: {}}});

  const productUrls = products?.map((p) => ({
    url: `${baseUrl}/shop/${p.slug}`,
    lastModified: new Date(),
  }));

//   const blogUrls = posts.map((post) => ({
//     url: `${baseUrl}/blog/${post.slug}`,
//     lastModified: new Date(post.modified || post.date),
//   }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
    },
    // {
    //   url: `${baseUrl}/blog`,
    //   lastModified: new Date(),
    // },
    ...(productUrls || [] as { url: string; lastModified: Date }[]),
    // ...blogUrls,
  ];
}