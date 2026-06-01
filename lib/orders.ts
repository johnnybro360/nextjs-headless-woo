"use server";

import OAuth from "oauth-1.0a";
import crypto from "crypto";
import { AU_COUNTRY_CODE } from "@/lib/au-address";
import { validateCartItems } from "@/lib/cart-validation";
import { buildOrderShippingLines } from "@/lib/order-shipping";
import type { CartItem } from "@/types/cartItem";
import type {
  CheckoutFormData,
  CreateOrderResult,
  WooAddress,
  WooOrderResponse,
} from "@/types/checkout";
import type { WooOrderShippingLine } from "@/lib/order-shipping";

const PAYMENT_METHOD = process.env.WC_PAYMENT_METHOD ?? "stripe";
const PAYMENT_METHOD_TITLE =
  process.env.WC_PAYMENT_METHOD_TITLE ?? "Credit / Debit Card (Stripe)";

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
  includeContact: boolean,
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

function authorizeHeaders(
  url: string,
  method: string,
): HeadersInit {
  const requestData = { url, method };
  return oauth.toHeader(
    oauth.authorize(requestData),
  ) as unknown as HeadersInit;
}

async function recalculateOrderTotals(
  orderId: number,
  payload: {
    billing: WooAddress;
    shipping: WooAddress;
    line_items: { product_id: number; quantity: number }[];
    shipping_lines: WooOrderShippingLine[];
  },
): Promise<WooOrderResponse | null> {
  const url = `${process.env.WC_URL}/wp-json/wc/v3/orders/${orderId}`;

  try {
    const putRes = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...authorizeHeaders(url, "PUT"),
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!putRes.ok) {
      return null;
    }

    return (await putRes.json()) as WooOrderResponse;
  } catch {
    return null;
  }
}

export async function createOrder(
  items: CartItem[],
  customer: CheckoutFormData,
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

  if (customer.country !== AU_COUNTRY_CODE) {
    return {
      success: false,
      error: "We currently only ship within Australia.",
    };
  }

  const validation = await validateCartItems(
    items.map((item) => ({ id: item.id, quantity: item.quantity })),
  );

  if (!validation.success) {
    return {
      success: false,
      error: validation.errors.map((entry) => entry.message).join(" "),
    };
  }

  const shippingLines = await buildOrderShippingLines(validation.lines);

  const url = `${process.env.WC_URL}/wp-json/wc/v3/orders`;

  const billing = toWooAddress(customer, true);
  const shipping = toWooAddress(customer, false);

  const payload = {
    payment_method: PAYMENT_METHOD,
    payment_method_title: PAYMENT_METHOD_TITLE,
    set_paid: false,
    billing,
    shipping,
    meta_data: [
      {
        key: "_wc_order_attribution_source_type",
        value: "nextjs-headless",
      },
    ],
    line_items: validation.lines.map((line) => ({
      product_id: line.productId,
      quantity: line.quantity,
    })),
    shipping_lines: shippingLines,
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authorizeHeaders(url, "POST"),
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

    let order = data as WooOrderResponse;

    const expectedShipping = shippingLines[0]?.total ?? "0";
    const hasExpectedShipping =
      Number.parseFloat(expectedShipping) > 0 &&
      Number.parseFloat(order.shipping_total) === 0;

    if (hasExpectedShipping) {
      const recalculated = await recalculateOrderTotals(order.id, {
        billing,
        shipping,
        line_items: payload.line_items,
        shipping_lines: shippingLines,
      });
      if (recalculated) {
        order = recalculated;
      }
    }

    return {
      success: true,
      orderId: order.id,
      orderNumber: order.number,
      paymentUrl: order.payment_url,
      subtotal: order.subtotal,
      shippingTotal: order.shipping_total,
      taxTotal: order.total_tax,
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
