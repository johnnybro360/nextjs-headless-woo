"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatAud } from "@/lib/format";

interface CheckoutSuccessProps {
  orderId?: string;
  orderNumber?: string;
  subtotal?: string;
  shipping?: string;
  tax?: string;
  total?: string;
}

function formatWooAmount(value?: string): string | null {
  if (!value) {
    return null;
  }

  const amount = Number.parseFloat(value);
  return Number.isFinite(amount) ? formatAud(amount) : `$${value}`;
}

export function CheckoutSuccess({
  orderId,
  orderNumber,
  subtotal,
  shipping,
  tax,
  total,
}: CheckoutSuccessProps) {
  const formattedSubtotal = formatWooAmount(subtotal);
  const formattedShipping = formatWooAmount(shipping);
  const formattedTax = formatWooAmount(tax);
  const formattedTotal = formatWooAmount(total);

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

      {(orderId || formattedTotal) && (
        <dl className="mt-8 w-full rounded-sm border border-border/60 bg-card/30 p-6 text-left text-sm">
          {orderId ? (
            <div className="flex justify-between gap-4 py-2">
              <dt className="text-muted-foreground">Order ID</dt>
              <dd className="font-medium tabular-nums text-foreground">
                {orderId}
              </dd>
            </div>
          ) : null}
          {formattedSubtotal ? (
            <div className="flex justify-between gap-4 py-2">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="tabular-nums text-foreground">
                {formattedSubtotal}
              </dd>
            </div>
          ) : null}
          {formattedShipping ? (
            <div className="flex justify-between gap-4 py-2">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd className="tabular-nums text-foreground">
                {formattedShipping}
              </dd>
            </div>
          ) : null}
          {formattedTax ? (
            <div className="flex justify-between gap-4 py-2">
              <dt className="text-muted-foreground">GST</dt>
              <dd className="tabular-nums text-foreground">{formattedTax}</dd>
            </div>
          ) : null}
          {formattedTotal ? (
            <div className="flex justify-between gap-4 border-t border-border/50 pt-3">
              <dt className="text-muted-foreground">Total paid</dt>
              <dd className="font-display text-lg tabular-nums text-foreground">
                {formattedTotal}
              </dd>
            </div>
          ) : null}
        </dl>
      )}

      <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
        WooCommerce calculated the final total including GST and shipping. A
        confirmation email will be sent if your store mail is configured.
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
