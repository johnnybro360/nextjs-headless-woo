import { getProducts } from "@/lib/products";

export async function GET() {
  const baseUrl = process.env.PROD_URL;
  const products = await getProducts({params: {options: undefined}});

  const urls = products?.map((p) => {
      const images = [p?.imageSrc, ...(p?.images || [])].filter(Boolean);

      return `
  <url>
    <loc>${baseUrl}/shop/${p.slug}</loc>
    ${images
      .map(
        (img) => `
    <image:image>
      <image:loc>${img}</image:loc>
    </image:image>`
      )
      .join("")}
  </url>`;
    })
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