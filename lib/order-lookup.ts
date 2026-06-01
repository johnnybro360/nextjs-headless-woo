"use server";

import { orderLookupSchema } from "@/lib/order-lookup-schema";
import { wooFetch } from "@/lib/woo-fetch";
import type {
  GuestOrderLineItem,
  GuestOrderViewModel,
  LookupGuestOrderResult,
} from "@/types/order-lookup";

type WooOrderLineItem = {
  name: string;
  quantity: number;
  total: string;
  image?: { src?: string };
};

type WooOrderAddress = {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
};

type WooOrderDetail = {
  id: number;
  number: string;
  status: string;
  date_created: string;
  currency: string;
  total: string;
  subtotal: string;
  shipping_total: string;
  total_tax: string;
  payment_method_title: string;
  payment_url?: string;
  billing: WooOrderAddress;
  shipping: WooOrderAddress;
  line_items: WooOrderLineItem[];
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending payment",
  processing: "Processing",
  "on-hold": "On hold",
  completed: "Completed",
  cancelled: "Cancelled",
  refunded: "Refunded",
  failed: "Failed",
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizeOrderNumber(orderNumber: string): string {
  return orderNumber.trim().replace(/^#/, "");
}

function emailsMatch(orderEmail: string | undefined, inputEmail: string): boolean {
  if (!orderEmail) {
    return false;
  }

  return normalizeEmail(orderEmail) === normalizeEmail(inputEmail);
}

function formatAddress(address: WooOrderAddress): string {
  const parts = [
    address.address_1,
    address.address_2,
    address.city,
    address.state,
    address.postcode,
    address.country,
  ].filter(Boolean);

  return parts.join(", ");
}

function mapLineItems(items: WooOrderLineItem[]): GuestOrderLineItem[] {
  return items.map((item) => ({
    name: item.name,
    quantity: item.quantity,
    total: item.total,
    imageSrc: item.image?.src,
  }));
}

function mapOrder(order: WooOrderDetail): GuestOrderViewModel {
  return {
    id: order.id,
    number: order.number,
    status: order.status,
    statusLabel: STATUS_LABELS[order.status] ?? order.status,
    dateCreated: order.date_created,
    currency: order.currency,
    subtotal: order.subtotal,
    shippingTotal: order.shipping_total,
    taxTotal: order.total_tax,
    total: order.total,
    paymentMethodTitle: order.payment_method_title,
    paymentUrl: order.payment_url,
    billingName: `${order.billing.first_name} ${order.billing.last_name}`.trim(),
    shippingSummary: formatAddress(order.shipping),
    lineItems: mapLineItems(order.line_items ?? []),
  };
}

async function fetchOrderById(orderId: number): Promise<WooOrderDetail | null> {
  try {
    const { data } = await wooFetch<WooOrderDetail>(
      `/orders/${orderId}`,
      undefined,
      { noStore: true },
    );
    return data;
  } catch {
    return null;
  }
}

async function findOrderByNumber(
  orderNumber: string,
): Promise<WooOrderDetail | null> {
  try {
    const { data } = await wooFetch<WooOrderDetail[]>("/orders", {
      search: orderNumber,
      per_page: 20,
    }, { noStore: true });

    return (
      data.find((order) => String(order.number) === orderNumber) ?? null
    );
  } catch {
    return null;
  }
}

async function resolveGuestOrder(
  email: string,
  orderNumber: string,
): Promise<WooOrderDetail | null> {
  const bySearch = await findOrderByNumber(orderNumber);

  if (bySearch && emailsMatch(bySearch.billing.email, email)) {
    return bySearch;
  }

  if (/^\d+$/.test(orderNumber)) {
    const byId = await fetchOrderById(Number.parseInt(orderNumber, 10));

    if (byId && emailsMatch(byId.billing.email, email)) {
      return byId;
    }
  }

  return null;
}

export async function lookupGuestOrder(
  email: string,
  orderNumber: string,
): Promise<LookupGuestOrderResult> {
  if (!process.env.WC_URL || !process.env.WC_KEY || !process.env.WC_SECRET) {
    return {
      success: false,
      error: "Order lookup is not available right now.",
    };
  }

  const parsed = orderLookupSchema.safeParse({ email, orderNumber });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  const normalizedNumber = normalizeOrderNumber(parsed.data.orderNumber);

  try {
    const order = await resolveGuestOrder(
      parsed.data.email,
      normalizedNumber,
    );

    if (!order) {
      return {
        success: false,
        error:
          "We couldn't find an order with that email and order number. Check your confirmation email and try again.",
      };
    }

    return {
      success: true,
      order: mapOrder(order),
    };
  } catch {
    return {
      success: false,
      error: "Unable to look up your order. Please try again later.",
    };
  }
}
