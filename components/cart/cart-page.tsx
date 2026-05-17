"use client";

import { useMemo, useState } from "react";
import { mockCartItems, type MockCartLineItem } from "@/lib/cart-mock";
import { CartEmptyState } from "@/components/cart/cart-empty-state";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { CartOrderSummary } from "@/components/cart/cart-order-summary";

export function CartPage() {
  const [items, setItems] = useState<MockCartLineItem[]>(mockCartItems);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const handleQuantityChange = (id: string, quantity: number) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemove = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  if (items.length === 0) {
    return <CartEmptyState />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <header className="border-b border-border/50 pb-8 md:pb-10">
        <p className="text-label mb-3">Shopping bag</p>
        <h1 className="font-display text-4xl tracking-[0.03em] text-foreground sm:text-5xl">
          Your Cart
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </p>
      </header>

      <div className="mt-10 grid grid-cols-1 gap-12 lg:mt-14 lg:grid-cols-[1fr_20rem] lg:gap-16 xl:grid-cols-[1fr_22rem]">
        <section aria-label="Cart items">
          <ul className="divide-y-0">
            {items.map((item) => (
              <li key={item.id}>
                <CartLineItem
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemove}
                />
              </li>
            ))}
          </ul>
        </section>

        <CartOrderSummary subtotal={subtotal} itemCount={itemCount} />
      </div>
    </div>
  );
}
