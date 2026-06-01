"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { OrderTotalsBreakdown } from "@/components/cart/order-totals-breakdown";
import { formatAud } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CartTotalsBreakdown } from "@/types/cart-validation";
import type { CartItem } from "@/types/cartItem";

interface CheckoutOrderSummaryProps {
  items: CartItem[];
  totals: CartTotalsBreakdown | null;
  itemCount: number;
  isLoading?: boolean;
  isSubmitting?: boolean;
  checkoutDisabled?: boolean;
  className?: string;
}

export function CheckoutOrderSummary({
  items,
  totals,
  itemCount,
  isLoading = false,
  isSubmitting,
  checkoutDisabled = false,
  className,
}: CheckoutOrderSummaryProps) {
  return (
    <aside
      className={cn(
        "rounded-sm border border-border/60 bg-card/30 p-6 sm:p-8",
        "lg:sticky lg:top-24 lg:self-start",
        className,
      )}
    >
      <h2 className="text-label">Order summary</h2>

      <ul className="mt-6 space-y-5">
        {items.map((item) => (
          <li key={item.id} className="flex gap-4">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-sm bg-muted/20 ring-1 ring-border/60">
              <Image
                src={item.imageSrc}
                alt={item.name}
                fill
                className="object-cover object-center"
                sizes="64px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-base leading-snug tracking-[0.02em] text-foreground">
                {item.name}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {item.size} · Qty {item.quantity}
              </p>
              <p className="mt-1 text-sm tabular-nums text-foreground">
                {formatAud(item.price * item.quantity)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {isLoading || !totals ? (
        <p className="mt-6 border-t border-border/50 pt-6 text-sm text-muted-foreground">
          Validating cart with WooCommerce…
        </p>
      ) : (
        <OrderTotalsBreakdown
          totals={totals}
          itemCount={itemCount}
          className="mt-6 border-t border-border/50 pt-6"
        />
      )}

      <Button
        type="submit"
        form="checkout-form"
        size="lg"
        disabled={isSubmitting || isLoading || checkoutDisabled || !totals}
        className="mt-8 h-12 w-full tracking-[0.16em] uppercase shadow-none transition-all duration-300 hover:brightness-[1.04]"
      >
        {isSubmitting ? "Placing order…" : "Place order"}
      </Button>

      <Button
        asChild
        variant="ghost"
        className="mt-3 h-11 w-full text-[13px] tracking-[0.06em] text-muted-foreground hover:bg-transparent hover:text-foreground"
      >
        <Link href="/cart">Back to cart</Link>
      </Button>
    </aside>
  );
}
