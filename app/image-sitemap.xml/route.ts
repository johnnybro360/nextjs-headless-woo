import { getAllPublishedProducts } from "@/lib/products";

export const revalidate = 3600;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const baseUrl = process.env.PROD_URL;

  if (!baseUrl) {
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
/>`,
      { headers: { "Content-Type": "application/xml" } },
    );
  }

  const products = await getAllPublishedProducts();

  const urls = products
    .map((product) => {
      const images = [
        product.imageSrc,
        ...product.images,
      ].filter(Boolean);
      const uniqueImages = [...new Set(images)];

      if (uniqueImages.length === 0) {
        return "";
      }

      return `
  <url>
    <loc>${escapeXml(`${baseUrl}/product/${product.slug}`)}</loc>
    ${uniqueImages
      .map(
        (image) => `
    <image:image>
      <image:loc>${escapeXml(image)}</image:loc>
    </image:image>`,
      )
      .join("")}
  </url>`;
    })
    .filter(Boolean)
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
