"use server";

import OAuth from "oauth-1.0a";
import crypto from "crypto";
import { mapWooProduct, mapWooVariation } from "@/lib/mappers/productMapper";
import { ProductViewModel, ProductVariationViewModel } from "@/types/productViewModel";

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

// 1. Generate the Basic Auth header for the Local WP Live Link tunnel
const LIVE_LINK_USER = process.env.LOCAL_LIVE_LINK_USER!;
const LIVE_LINK_PASS = process.env.LOCAL_LIVE_LINK_PASSWORD!;
const tunnelAuthHeader = `Basic ${Buffer.from(`${LIVE_LINK_USER}:${LIVE_LINK_PASS}`).toString("base64")}`;

// 2. Prepare WooCommerce credentials to append as query parameters
const wcAuthParams = new URLSearchParams({
  consumer_key: process.env.WC_KEY!,
  consumer_secret: process.env.WC_SECRET!,
});


interface ProductFilters {
  id?: number[];
  per_page?: number;
  featured?: boolean;
  category?: string;
  brand?: string;
  tag?: string;
  attribute?: string;
  attribute_term?: string;
  price?: string;
  sort?: string;
  order?: string;
};



interface ProductParams {
  options?: ProductFilters | undefined;
}

export async function getProducts({params}: {params: ProductParams}): Promise<ProductViewModel[] | undefined> {
  try {
    const url = `${process.env.WC_URL}/wp-json/wc/v3/products${params.options ? `?${new URLSearchParams(params.options as Record<string, string>).toString()}` : ''}`;

    const requestData = {
      url,
      method: "GET",
    };

    console.log('requestData', requestData);

    const authHeader = oauth.toHeader(
      oauth.authorize(requestData)
    )  as unknown as HeadersInit;
  
    const res = await fetch(url, {
      headers: authHeader,
    });

    console.log('res', res);

    // const filterParams = new URLSearchParams(params.options as Record<string, string>);
    // wcAuthParams.forEach((value, key) => filterParams.append(key, value));

    // const url = `${process.env.WC_URL}/wp-json/wc/v3/products?${filterParams.toString()}`;

    // const res = await fetch(url, {
    //   headers: {
    //     "Authorization": tunnelAuthHeader,
    //     "Content-Type": "application/json",
    //   },
    // });

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await res.json();

    console.log('data', data);

    return data.map(mapWooProduct);

  } catch (error) {
    console.error("API Route Error:", error);
    return []
  }
}

  export async function getProductBySlug(slug: string): Promise<ProductViewModel | undefined> {
    try {
      const url =
      `${process.env.WC_URL}/wp-json/wc/v3/products?slug=${slug}`;

      const requestData = {
        url,
        method: "GET",
      };

      const authHeader = oauth.toHeader(
        oauth.authorize(requestData)
      )  as unknown as HeadersInit;

      const res = await fetch(url, {
        headers: authHeader,
      });

      // const queryParams = new URLSearchParams(wcAuthParams);
      // queryParams.append("slug", slug);
  
      // const url = `${process.env.WC_URL}/wp-json/wc/v3/products?${queryParams.toString()}`;
  
      // const res = await fetch(url, {
      //   headers: {
      //     "Authorization": tunnelAuthHeader,
      //     "Content-Type": "application/json",
      //   },
      // });

      if (!res.ok) {
        throw new Error("Failed to fetch product");
      }

      const data = await res.json();

      return data.map(mapWooProduct)[0];

    } catch (error) {
      console.error("API Route Error:", error);
      return undefined;
    }
  }

  export async function getVariationsByProductId(productId: string): Promise<ProductVariationViewModel | undefined> {
    try {
      const url =
      `${process.env.WC_URL}/wp-json/wc/v3/products/${productId}/variations`;

      const requestData = {
        url,
        method: "GET",
      };

      const authHeader = oauth.toHeader(
        oauth.authorize(requestData)
      )  as unknown as HeadersInit;

      const res = await fetch(url, {
        headers: authHeader,
      });

      // const url = `${process.env.WC_URL}/wp-json/wc/v3/products/${productId}/variations?${wcAuthParams.toString()}`;

      // const res = await fetch(url, {
      //   headers: {
      //     "Authorization": tunnelAuthHeader,
      //     "Content-Type": "application/json",
      //   },
      // });

      if (!res.ok) {
        throw new Error("Failed to fetch product");
      }

      const data = await res.json();
      return data.map(mapWooVariation);

    } catch (error) {
      console.error("API Route Error:", error);
      return undefined;
    }
  }