"use client";

import { formatAud } from "@/lib/format";
import type { CartTotalsBreakdown } from "@/types/cart-validation";
import { cn } from "@/lib/utils";

interface OrderTotalsBreakdownProps {
  totals: CartTotalsBreakdown;
  itemCount: number;
  className?: string;
}

export function OrderTotalsBreakdown({
  totals,
  itemCount,
  className,
}: OrderTotalsBreakdownProps) {
  const taxLabel = totals.pricesIncludeTax ? "GST (included)" : "GST (est.)";

  return (
    <dl className={cn("space-y-3", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <dt className="text-sm text-muted-foreground">
          Subtotal
          <span className="ml-1 text-foreground/40">
            ({itemCount} {itemCount === 1 ? "item" : "items"})
          </span>
        </dt>
        <dd className="text-sm tabular-nums text-foreground">
          {formatAud(totals.subtotal)}
        </dd>
      </div>

      <div className="flex items-baseline justify-between gap-4">
        <dt className="text-sm text-muted-foreground">Shipping</dt>
        <dd className="text-sm tabular-nums text-foreground">
          {totals.shippingTotal === 0
            ? "Free"
            : formatAud(totals.shippingTotal)}
        </dd>
      </div>

      <div className="flex items-baseline justify-between gap-4">
        <dt className="text-sm text-muted-foreground">{taxLabel}</dt>
        <dd className="text-sm tabular-nums text-foreground">
          {formatAud(totals.taxTotal)}
        </dd>
      </div>

      <div className="flex items-baseline justify-between gap-4 border-t border-border/50 pt-4">
        <dt className="font-display text-lg tracking-[0.02em] text-foreground">
          {totals.isEstimate ? "Estimated total" : "Total"}
        </dt>
        <dd className="font-display text-xl tracking-[0.02em] text-foreground tabular-nums">
          {formatAud(totals.total)}
        </dd>
      </div>

      {totals.isEstimate ? (
        <p className="text-xs leading-relaxed text-muted-foreground/80">
          Final shipping and tax are confirmed by WooCommerce when your order is
          created.
        </p>
      ) : null}

      {totals.freeShippingMin !== null && !totals.qualifiesForFreeShipping ? (
        <p className="text-sm leading-relaxed text-muted-foreground">
          Add {formatAud(totals.freeShippingMin - totals.subtotal)} more for
          complimentary standard shipping on orders over{" "}
          {formatAud(totals.freeShippingMin)}.
        </p>
      ) : null}

      {totals.qualifiesForFreeShipping ? (
        <p className="text-sm leading-relaxed text-muted-foreground">
          Standard shipping is complimentary on this order.
        </p>
      ) : null}
    </dl>
  );
}
