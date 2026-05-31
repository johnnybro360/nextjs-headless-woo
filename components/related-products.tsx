import { ProductCard } from "@/components/product-card";
import { productListingGridClassName } from "@/components/product-grid";
import { cn } from "@/lib/utils";
import { getProducts } from "@/lib/products";

interface RelatedProductsProps {
  relatedProductIds: number[];
  className?: string;
}

export async function RelatedProducts({ relatedProductIds, className }: RelatedProductsProps) {
  if (relatedProductIds.length === 0) return null;

  const { products } = await getProducts({
    params: { options: { include: relatedProductIds } },
  });

  return (
    <section
      className={cn(
        "w-full max-w-7xl mx-auto border-t border-border/50",
        className
      )}
    >
      <header className="mb-14 border-b border-border/60 pb-10 pt-16 md:mb-20 md:pb-12 md:pt-20">
        <p className="text-label mb-4">Continue Exploring</p>
        <h2 className="font-display text-3xl tracking-[0.03em] text-balance md:text-4xl lg:text-[2.75rem]">
          You May Also Like
        </h2>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
          More small-batch sauces from our collection
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
            size={product.size}
            imageSrc={product.imageSrc}
            heat={product.heat}
          />
        ))}
      </div>
    </section>
  );
}
