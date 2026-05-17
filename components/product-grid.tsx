import { ProductCard } from "@/components/product-card";
import { getProductCardData } from "@/lib/products";
import { cn } from "@/lib/utils";

/** Shared editorial grid rhythm for all product listings */
export const productListingGridClassName = cn(
  "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  "gap-x-6 sm:gap-x-8 lg:gap-x-10",
  "gap-y-14 sm:gap-y-16 lg:gap-y-20",
  "items-stretch"
);

interface ProductGridProps {
  className?: string;
}

export function ProductGrid({ className }: ProductGridProps) {
  const products = getProductCardData();

  return (
    <section className={cn("w-full max-w-7xl mx-auto", className)}>
      <header className="mb-14 border-b border-border/60 pb-10 md:mb-20 md:pb-12">
        <p className="text-label mb-4">Catalogue</p>
        <h2 className="font-display text-3xl tracking-[0.03em] text-balance md:text-4xl lg:text-[2.75rem]">
          Our Collection
        </h2>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
          Small-batch, handcrafted hot sauces from around the world
        </p>
      </header>

      <div className={productListingGridClassName}>
        {products.map((product) => (
          <ProductCard
            key={product.slug}
            slug={product.slug}
            name={product.name}
            origin={product.origin}
            description={product.description}
            price={product.price}
            volume={product.volume}
            imageSrc={product.imageSrc}
            heat={product.heat}
          />
        ))}
      </div>
    </section>
  );
}
