"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { useEffect } from "react";

interface CheckoutSuccessProps {
  orderId?: string;
  orderNumber?: string;
  total?: string;
}

export function CheckoutSuccess({
  orderId,
  orderNumber,
  total,
}: CheckoutSuccessProps) {
  const clearCart = useCartStore(
    (state) => state.clearCart
  );

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-20 text-center sm:py-28">
      <div className="flex size-20 items-center justify-center rounded-full border border-border/60 bg-primary/[0.06]">
        <Check className="size-9 text-primary" strokeWidth={1.25} />
      </div>

      <h1 className="mt-10 font-display text-3xl tracking-[0.03em] text-foreground sm:text-4xl">
        Thank you for your order
      </h1>

      <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
        {orderNumber ? (
          <>
            Order <span className="text-foreground">#{orderNumber}</span> has been
            created in WooCommerce.
          </>
        ) : (
          <>Your order has been created in WooCommerce.</>
        )}
      </p>

      {(orderId || total) && (
        <dl className="mt-8 w-full rounded-sm border border-border/60 bg-card/30 p-6 text-left text-sm">
          {orderId ? (
            <div className="flex justify-between gap-4 py-2">
              <dt className="text-muted-foreground">Order ID</dt>
              <dd className="font-medium tabular-nums text-foreground">
                {orderId}
              </dd>
            </div>
          ) : null}
          {total ? (
            <div className="flex justify-between gap-4 border-t border-border/50 py-2">
              <dt className="text-muted-foreground">Total (Woo)</dt>
              <dd className="font-display text-lg tabular-nums text-foreground">
                ${total}
              </dd>
            </div>
          ) : null}
        </dl>
      )}

      <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
        Bank transfer instructions will be sent to your email if configured in
        WooCommerce. Cart totals on the storefront are for display only — Woo
        calculated the final order total.
      </p>

      <Button
        asChild
        size="lg"
        className="mt-10 h-12 min-w-[12rem] tracking-[0.14em] uppercase"
      >
        <Link href="/shop">Continue shopping</Link>
      </Button>
    </div>
  );
}
