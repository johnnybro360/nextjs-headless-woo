"use server";

import OAuth from "oauth-1.0a";
import crypto from "crypto";
import type { CartItem } from "@/types/cartItem";
import type {
  CheckoutFormData,
  CreateOrderResult,
  WooAddress,
  WooOrderResponse,
} from "@/types/checkout";

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


function toWooAddress(
  customer: CheckoutFormData,
  includeContact: boolean
): WooAddress {
  const address: WooAddress = {
    first_name: customer.firstName,
    last_name: customer.lastName,
    address_1: customer.address1,
    address_2: customer.address2 ?? "",
    city: customer.city,
    state: customer.state,
    postcode: customer.postcode,
    country: customer.country,
  };

  if (includeContact) {
    address.email = customer.email;
    address.phone = customer.phone;
  }

  return address;
}

export async function createOrder(
  items: CartItem[],
  customer: CheckoutFormData
): Promise<CreateOrderResult> {
  if (!process.env.WC_URL || !process.env.WC_KEY || !process.env.WC_SECRET) {
    return {
      success: false,
      error: "WooCommerce API is not configured.",
    };
  }

  if (items.length === 0) {
    return { success: false, error: "Your cart is empty." };
  }

  const url = `${process.env.WC_URL}/wp-json/wc/v3/orders`;

  const billing = toWooAddress(customer, true);
  const shipping = toWooAddress(customer, false);

  const payload = {
    payment_method: "bacs",
    payment_method_title: "Direct Bank Transfer",
    set_paid: false,
    billing,
    shipping,
    meta_data: [
      {
        key: "_wc_order_attribution_source_type",
        value: "nextjs-headless",
      },
    ],
    line_items: items.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
      // ...(item.variationId && { variation_id: item.variationId }),
    })),
  };

  const requestData = {
    url,
    method: "POST",
  };
  
  console.log('payload', payload);
  console.log('url', `${url}?${wcAuthParams.toString()}`);

  const authHeader = oauth.toHeader(
    oauth.authorize(requestData)
  ) as unknown as HeadersInit;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
      },
      body: JSON.stringify(payload),
    });

    // const res = await fetch(`${url}?${wcAuthParams.toString()}`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `${tunnelAuthHeader}`,
    //   },
    //   body: JSON.stringify(payload),
    // });

    const data = await res.json();

    console.log('data', data);
    console.log('res', res);

    if (!res.ok) {
      const message =
        typeof data?.message === "string"
          ? data.message
          : "Failed to create order. Please try again.";
      return { success: false, error: message };
    }

    const order = data as WooOrderResponse;

    return {
      success: true,
      orderId: order.id,
      orderNumber: order.number,
      paymentUrl: order.payment_url,
      total: order.total,
    };
  } catch (error) {
    console.error("Create order error:", error);
    return {
      success: false,
      error: "Unable to reach the store. Please try again.",
    };
  }
}
