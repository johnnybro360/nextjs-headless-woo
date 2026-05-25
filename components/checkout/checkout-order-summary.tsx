"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/cart-mock";
import type { CartItem } from "@/types/cartItem";

interface CheckoutOrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  isSubmitting?: boolean;
  className?: string;
}

export function CheckoutOrderSummary({
  items,
  subtotal,
  itemCount,
  isSubmitting,
  className,
}: CheckoutOrderSummaryProps) {
  const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

  return (
    <aside
      className={cn(
        "rounded-sm border border-border/60 bg-card/30 p-6 sm:p-8",
        "lg:sticky lg:top-24 lg:self-start",
        className
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
                unoptimized
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
                ${(item.price * item.quantity).toFixed(0)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <dl className="mt-6 space-y-4 border-t border-border/50 pt-6">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-sm text-muted-foreground">
            Subtotal
            <span className="ml-1 text-foreground/40">
              ({itemCount} {itemCount === 1 ? "item" : "items"})
            </span>
          </dt>
          <dd className="font-display text-xl tracking-[0.02em] text-foreground tabular-nums">
            ${subtotal.toFixed(0)}
          </dd>
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground/80">
          {qualifiesForFreeShipping
            ? "Standard shipping may be complimentary. Final shipping and tax are calculated by WooCommerce when your order is created."
            : "Shipping and tax are calculated by WooCommerce when your order is created — not from cart totals shown here."}
        </p>
      </dl>

      <Button
        type="submit"
        form="checkout-form"
        size="lg"
        disabled={isSubmitting}
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
