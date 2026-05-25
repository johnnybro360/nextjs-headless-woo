"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/cart-mock";
import { useRouter } from "next/navigation";

interface CartOrderSummaryProps {
  subtotal: number;
  itemCount: number;
  className?: string;
}

export function CartOrderSummary({
  subtotal,
  itemCount,
  className,
}: CartOrderSummaryProps) {
  const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const router = useRouter();

  return (
    <aside
      className={cn(
        "rounded-sm border border-border/60 bg-card/30 p-6 sm:p-8",
        "lg:sticky lg:top-24 lg:self-start",
        className
      )}
    >
      <h2 className="text-label">Order summary</h2>

      <dl className="mt-6 space-y-4">
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

        <div className="border-t border-border/50 pt-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {qualifiesForFreeShipping ? (
              <>Standard shipping is complimentary on this order.</>
            ) : (
              <>
                Add ${amountToFreeShipping.toFixed(0)} more for complimentary
                standard shipping on orders over ${FREE_SHIPPING_THRESHOLD}.
              </>
            )}
          </p>
          <p className="mt-2 text-xs text-muted-foreground/80">
            Shipping & taxes calculated at checkout.
          </p>
        </div>
      </dl>

      <Button
        size="lg"
        className="mt-8 h-12 w-full tracking-[0.16em] uppercase shadow-none transition-all duration-300 hover:brightness-[1.04]"
        onClick={() => router.push("/checkout")}
      >
        Proceed to Checkout
      </Button>

      <Button
        asChild
        variant="ghost"
        className="mt-3 h-11 w-full text-[13px] tracking-[0.06em] text-muted-foreground hover:bg-transparent hover:text-foreground"
      >
        <Link href="/shop">Continue shopping</Link>
      </Button>
    </aside>
  );
}
