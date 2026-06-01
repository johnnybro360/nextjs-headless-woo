"use client";

import { CartEmptyState } from "@/components/cart/cart-empty-state";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { CartOrderSummary } from "@/components/cart/cart-order-summary";
import { CartValidationAlert } from "@/components/cart/cart-validation-alert";
import { useCartHydrated } from "@/hooks/use-cart-hydrated";
import { useValidatedCart } from "@/hooks/use-validated-cart";

export function CartPage() {
  const hasHydrated = useCartHydrated();
  const { items, state, isLoading, isEmpty } = useValidatedCart();

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (!hasHydrated) {
    return null;
  }

  if (isEmpty) {
    return <CartEmptyState />;
  }

  const totals = state.status === "ready" ? state.totals : null;
  const validationErrors = state.status === "error" ? state.errors : [];

  return (
    <div className="w-full max-w-7xl mx-auto">
      <header className="border-b border-border/50 pb-8 md:pb-10">
        <p className="text-label mb-3">Shopping bag</p>
        <h1 className="font-display text-4xl tracking-[0.03em] text-foreground sm:text-5xl">
          Your Cart
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {itemCount} {itemCount === 1 ? "item" : "items"} · Prices from
          WooCommerce
        </p>
      </header>

      <CartValidationAlert errors={validationErrors} />

      <div className="mt-10 grid grid-cols-1 gap-12 lg:mt-14 lg:grid-cols-[1fr_20rem] lg:gap-16 xl:grid-cols-[1fr_22rem]">
        <section aria-label="Cart items">
          <ul className="divide-y-0">
            {items.map((item) => (
              <li key={item.id}>
                <CartLineItem item={item} />
              </li>
            ))}
          </ul>
        </section>

        <CartOrderSummary
          totals={totals}
          itemCount={itemCount}
          isLoading={isLoading}
          checkoutDisabled={state.status === "error"}
        />
      </div>
    </div>
  );
}
