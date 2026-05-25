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
    line_items: items.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
      ...(item.variationId && { variation_id: item.variationId }),
    })),
  };

  const requestData = {
    url,
    method: "POST",
  };

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

    const data = await res.json();

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
