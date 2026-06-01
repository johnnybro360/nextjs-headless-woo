"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { OrderTotalsBreakdown } from "@/components/cart/order-totals-breakdown";
import { cn } from "@/lib/utils";
import type { CartTotalsBreakdown } from "@/types/cart-validation";
import { useRouter } from "next/navigation";

interface CartOrderSummaryProps {
  totals: CartTotalsBreakdown | null;
  itemCount: number;
  isLoading?: boolean;
  checkoutDisabled?: boolean;
  className?: string;
}

export function CartOrderSummary({
  totals,
  itemCount,
  isLoading = false,
  checkoutDisabled = false,
  className,
}: CartOrderSummaryProps) {
  const router = useRouter();

  return (
    <aside
      className={cn(
        "rounded-sm border border-border/60 bg-card/30 p-6 sm:p-8",
        "lg:sticky lg:top-24 lg:self-start",
        className,
      )}
    >
      <h2 className="text-label">Order summary</h2>

      {isLoading || !totals ? (
        <p className="mt-6 text-sm text-muted-foreground">
          Checking prices and availability…
        </p>
      ) : (
        <OrderTotalsBreakdown
          totals={totals}
          itemCount={itemCount}
          className="mt-6"
        />
      )}

      <Button
        size="lg"
        className="mt-8 h-12 w-full tracking-[0.16em] uppercase shadow-none transition-all duration-300 hover:brightness-[1.04]"
        disabled={isLoading || checkoutDisabled || !totals}
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
