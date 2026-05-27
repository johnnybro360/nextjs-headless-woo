import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getProducts } from "@/lib/products";
import { productListingGridClassName } from "@/components/product-grid";
import { ProductViewModel } from "@/types/productViewModel";

export async function CategoryPage() {
  const products = await getProducts({params: {options: undefined}});

  return (
    <div className="w-full max-w-7xl mx-auto">
      <Breadcrumb className="mb-10">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Hot Sauces</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-12 md:mb-16 max-w-2xl">
        <h1 className="font-display text-4xl md:text-5xl tracking-[0.03em] text-balance">
          Hot Sauces
        </h1>
        <p className="mt-5 text-muted-foreground leading-relaxed">
          Explore our curated collection of small-batch, handcrafted hot sauces sourced from
          artisan producers around the world.
        </p>
        <p className="mt-6 text-label">{products?.length} products</p>
      </div>

      <div className={productListingGridClassName}>
        {products?.map((product: ProductViewModel) => (
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
    </div>
  );
}
