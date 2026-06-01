import { PRODUCT_WEBHOOK_TOPICS } from "@/lib/cache-tags";
import { revalidateProductCatalog } from "@/lib/revalidate-catalog";
import { verifyWooCommerceWebhookSignature } from "@/lib/webhook-verify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type WooProductWebhookPayload = {
  id?: number;
  slug?: string;
};

function parsePayload(rawBody: string): WooProductWebhookPayload | null {
  try {
    return JSON.parse(rawBody) as WooProductWebhookPayload;
  } catch {
    return null;
  }
}

export async function GET() {
  return Response.json({
    ok: true,
    message: "WooCommerce webhook endpoint. Configure POST delivery in WP Admin.",
  });
}

export async function POST(request: Request) {
  const secret = process.env.WC_WEBHOOK_SECRET;
  const skipVerify = process.env.WC_WEBHOOK_SKIP_VERIFY === "true";

  if (!secret && !skipVerify) {
    return Response.json(
      { error: "WC_WEBHOOK_SECRET is not configured." },
      { status: 503 },
    );
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-wc-webhook-signature");
  const topic = request.headers.get("x-wc-webhook-topic") ?? "";
  const deliveryId = request.headers.get("x-wc-webhook-delivery-id");

  if (!skipVerify && secret && !verifyWooCommerceWebhookSignature(rawBody, signature, secret)) {
    return Response.json({ error: "Invalid webhook signature." }, { status: 401 });
  }

  if (!PRODUCT_WEBHOOK_TOPICS.has(topic)) {
    return Response.json({
      ok: true,
      skipped: true,
      topic,
      message: "Topic ignored; only product.* events revalidate cache.",
    });
  }

  const payload = parsePayload(rawBody);
  const slug = typeof payload?.slug === "string" ? payload.slug : undefined;
  const revalidated = revalidateProductCatalog(slug);

  return Response.json({
    ok: true,
    topic,
    deliveryId,
    productId: payload?.id,
    slug,
    revalidated,
  });
}
