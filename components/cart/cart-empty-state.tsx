import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CartEmptyState() {
  return (
    <div className="flex flex-col items-center px-4 py-20 text-center sm:py-28 md:py-32">
      <div className="flex size-20 items-center justify-center rounded-full border border-border/60 bg-muted/20">
        <ShoppingBag className="size-8 text-foreground/25" strokeWidth={1.25} />
      </div>

      <h2 className="mt-10 font-display text-3xl tracking-[0.03em] text-foreground sm:text-4xl">
        Your cart is empty
      </h2>
      <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted-foreground sm:text-base">
        No sauces selected yet. Explore our small-batch collection and find your
        next favourite heat.
      </p>

      <Button asChild size="lg" className="mt-10 h-12 min-w-[12rem] tracking-[0.14em] uppercase">
        <Link href="/shop">Browse Collection</Link>
      </Button>
    </div>
  );
}
