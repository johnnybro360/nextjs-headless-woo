"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/types/cartItem";
import { useCartStore } from "@/stores/cart-store";

interface CartLineItemProps {
  item: CartItem;
}

export function CartLineItem({
  item,
  }: CartLineItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const removeItem = useCartStore((state) => state.removeItem);

  const lineTotal = item.price * item.quantity;

  return (
    <article className="grid grid-cols-[5.5rem_1fr] gap-5 border-b border-border/50 py-8 sm:grid-cols-[6.5rem_1fr] sm:gap-8">
      <Link
        href={`/product/${item.slug}`}
        className="relative aspect-4/5 overflow-hidden rounded-sm bg-muted/20 ring-1 ring-border/60 transition-[ring-color] duration-300 hover:ring-primary/25"
      >
        <Image
          src={item.imageSrc}
          alt={item.name}
          fill
          className="object-cover object-center"
          sizes="104px"
          // unoptimized={true}
        />
      </Link>

      <div className="flex min-w-0 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link href={`/product/${item.slug}`}>
              <h3 className="font-display text-lg leading-snug tracking-[0.02em] text-foreground transition-colors duration-300 hover:text-primary sm:text-xl">
                {item.name}
              </h3>
            </Link>
            <p className="mt-1.5 text-label">{item.size}</p>
          </div>

          <p className="shrink-0 font-display text-lg tracking-[0.02em] text-foreground tabular-nums sm:text-xl">
            ${lineTotal}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex h-10 items-stretch rounded-sm border border-border/70">
            <button
              type="button"
              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
              className="flex items-center px-3 text-muted-foreground transition-colors duration-300 hover:text-foreground"
              aria-label="Decrease quantity"
            >
              <Minus className="size-3.5" strokeWidth={1.25} />
            </button>
            <span className="flex min-w-10 items-center justify-center border-x border-border/70 px-3 text-sm font-medium tabular-nums">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="flex items-center px-3 text-muted-foreground transition-colors duration-300 hover:text-foreground"
              aria-label="Increase quantity"
            >
              <Plus className="size-3.5" strokeWidth={1.25} />
            </button>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeItem(item.id)}
            className="h-auto px-0 text-[13px] tracking-[0.04em] text-muted-foreground hover:bg-transparent hover:text-foreground"
          >
            <X className="mr-1.5 size-3.5" strokeWidth={1.25} />
            Remove
          </Button>
        </div>

        {item.quantity > 1 && (
          <p className="mt-2 text-xs text-muted-foreground tabular-nums">
            ${item.price} each
          </p>
        )}
      </div>
    </article>
  );
}
