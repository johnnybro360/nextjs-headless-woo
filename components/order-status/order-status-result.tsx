import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatAud } from "@/lib/format";
import type { GuestOrderViewModel } from "@/types/order-lookup";
import { cn } from "@/lib/utils";

function formatWooAmount(value: string): string {
  const amount = Number.parseFloat(value);
  return Number.isFinite(amount) ? formatAud(amount) : `$${value}`;
}

function formatOrderDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const statusStyles: Record<string, string> = {
  completed: "text-success",
  processing: "text-foreground",
  pending: "text-muted-foreground",
  "on-hold": "text-muted-foreground",
  cancelled: "text-destructive",
  refunded: "text-muted-foreground",
  failed: "text-destructive",
};

interface OrderStatusResultProps {
  order: GuestOrderViewModel;
}

export function OrderStatusResult({ order }: OrderStatusResultProps) {
  const showPayLink =
    order.status === "pending" && Boolean(order.paymentUrl);

  return (
    <div className="mt-10 space-y-8">
      <div className="rounded-sm border border-border/60 bg-card/30 p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-label">Order</p>
            <p className="mt-1 font-display text-2xl tracking-[0.02em] text-foreground">
              #{order.number}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Placed {formatOrderDate(order.dateCreated)}
            </p>
          </div>
          <p
            className={cn(
              "text-sm font-medium capitalize",
              statusStyles[order.status] ?? "text-foreground",
            )}
          >
            {order.statusLabel}
          </p>
        </div>

        {showPayLink ? (
          <div className="mt-6 rounded-sm border border-primary/20 bg-primary/[0.04] p-4">
            <p className="text-sm text-muted-foreground">
              This order is awaiting payment.
            </p>
            <Button asChild size="sm" className="mt-3">
              <a href={order.paymentUrl}>Complete payment</a>
            </Button>
          </div>
        ) : null}
      </div>

      <section>
        <h2 className="text-label">Items</h2>
        <ul className="mt-4 divide-y divide-border/50">
          {order.lineItems.map((item) => (
            <li
              key={`${item.name}-${item.quantity}`}
              className="flex gap-4 py-5 first:pt-0"
            >
              {item.imageSrc ? (
                <div className="relative size-16 shrink-0 overflow-hidden rounded-sm bg-muted/20 ring-1 ring-border/60">
                  <Image
                    src={item.imageSrc}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              ) : null}
              <div className="min-w-0 flex-1">
                <p className="font-display text-base tracking-[0.02em] text-foreground">
                  {item.name}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Qty {item.quantity}
                </p>
              </div>
              <p className="shrink-0 text-sm tabular-nums text-foreground">
                {formatWooAmount(item.total)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <dl className="rounded-sm border border-border/60 bg-card/30 p-6 text-sm">
        <div className="flex justify-between gap-4 py-2">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd className="tabular-nums">{formatWooAmount(order.subtotal)}</dd>
        </div>
        <div className="flex justify-between gap-4 py-2">
          <dt className="text-muted-foreground">Shipping</dt>
          <dd className="tabular-nums">
            {Number.parseFloat(order.shippingTotal) === 0
              ? "Free"
              : formatWooAmount(order.shippingTotal)}
          </dd>
        </div>
        <div className="flex justify-between gap-4 py-2">
          <dt className="text-muted-foreground">GST</dt>
          <dd className="tabular-nums">{formatWooAmount(order.taxTotal)}</dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-border/50 pt-3">
          <dt className="text-muted-foreground">Total</dt>
          <dd className="font-display text-lg tabular-nums text-foreground">
            {formatWooAmount(order.total)}
          </dd>
        </div>
        <div className="mt-4 border-t border-border/50 pt-4">
          <dt className="text-muted-foreground">Payment</dt>
          <dd className="mt-1 text-foreground">{order.paymentMethodTitle}</dd>
        </div>
        <div className="mt-4">
          <dt className="text-muted-foreground">Ship to</dt>
          <dd className="mt-1 text-foreground">{order.billingName}</dd>
          <dd className="mt-1 text-muted-foreground">{order.shippingSummary}</dd>
        </div>
      </dl>

      <Button
        asChild
        variant="ghost"
        className="h-11 w-full text-[13px] tracking-[0.06em] text-muted-foreground"
      >
        <Link href="/shop">Continue shopping</Link>
      </Button>
    </div>
  );
}
