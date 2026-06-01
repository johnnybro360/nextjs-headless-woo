import OAuth from "oauth-1.0a";
import crypto from "crypto";
import { WC_CACHE_TAGS } from "@/lib/cache-tags";

const oauth = new OAuth({
  consumer: {
    key: process.env.WC_KEY!,
    secret: process.env.WC_SECRET!,
  },
  signature_method: "HMAC-SHA1",
  hash_function(base_string: string, key: string) {
    return crypto
      .createHmac("sha1", key)
      .update(base_string)
      .digest("base64");
  },
});

export type WooQueryValue =
  | string
  | number
  | boolean
  | string[]
  | number[]
  | undefined;

export interface WooProductQueryParams {
  per_page?: number;
  page?: number;
  search?: string;
  include?: string | number[];
  orderby?: "date" | "id" | "title" | "slug" | "price" | "popularity" | "rating" | "menu_order";
  order?: "asc" | "desc";
  category?: string;
  tag?: string;
  brand?: string;
  attribute?: string;
  attribute_term?: string;
  min_price?: string;
  max_price?: string;
  stock_status?: "instock" | "outofstock" | "onbackorder";
  status?: "publish" | "draft" | "pending" | "private";
  featured?: boolean;
  hide_empty?: boolean;
}

export function buildWooQueryString(
  params: Record<string, WooQueryValue>,
): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        continue;
      }
      searchParams.set(key, value.join(","));
      continue;
    }

    searchParams.set(key, String(value));
  }

  return searchParams.toString();
}

function getCacheTagsForPath(path: string): string[] {
  if (path.startsWith("/products")) {
    return [WC_CACHE_TAGS.products, WC_CACHE_TAGS.catalog];
  }

  if (
    path.startsWith("/shipping") ||
    path.startsWith("/taxes") ||
    path.startsWith("/settings")
  ) {
    return [];
  }

  return [];
}

export async function wooFetch<T>(
  path: string,
  query?: Record<string, WooQueryValue>,
  options?: { noStore?: boolean },
): Promise<{ data: T; headers: Headers }> {
  const queryString = query ? buildWooQueryString(query) : "";
  const url = `${process.env.WC_URL}/wp-json/wc/v3${path}${
    queryString ? `?${queryString}` : ""
  }`;

  const requestData = {
    url,
    method: "GET",
  };

  const authHeader = oauth.toHeader(
    oauth.authorize(requestData),
  ) as unknown as HeadersInit;

  const tags = getCacheTagsForPath(path);

  const res = await fetch(url, {
    headers: authHeader,
    ...(options?.noStore
      ? { cache: "no-store" }
      : {
          next: {
            revalidate: 3600,
            ...(tags.length > 0 ? { tags } : {}),
          },
        }),
  });

  if (!res.ok) {
    throw new Error(`WooCommerce request failed: ${path} (${res.status})`);
  }

  const data = (await res.json()) as T;
  return { data, headers: res.headers };
}
