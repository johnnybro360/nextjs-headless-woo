import { buildWooQueryString, type WooQueryValue } from "@/lib/woo-fetch";

export async function wpFetch<T>(
  path: string,
  query?: Record<string, WooQueryValue>,
): Promise<T> {
  const queryString = query ? buildWooQueryString(query) : "";
  const url = `${process.env.WC_URL}/wp-json/wp/v2${path}${
    queryString ? `?${queryString}` : ""
  }`;

  const res = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`WordPress request failed: ${path} (${res.status})`);
  }

  return res.json() as Promise<T>;
}
