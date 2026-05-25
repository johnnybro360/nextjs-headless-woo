import OAuth from "oauth-1.0a";
import crypto from "crypto";
import { mapWooProduct } from "@/lib/mappers/productMapper";

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


export async function GET() {
  try {
    const url = `${process.env.WC_URL}/wp-json/wc/v3/products?per_page=12`;

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

    if (!res.ok) {
      const errorText = await res.text();
      console.error("WooCommerce error:", errorText);
      throw new Error("Failed to fetch products");
    }

    const data = await res.json();
    const mapped = data.map(mapWooProduct);

    return Response.json(mapped);
  } catch (error) {
    console.error("API Route Error:", error);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}