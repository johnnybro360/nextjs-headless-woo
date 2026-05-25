import { ProductGrid } from "@/components/product-grid";
import { Hero } from "@/components/hero";
import { getProducts } from "@/lib/products";

export default async function Home() {
  const products = await getProducts({params: {options: {featured: true}}});

  return (
    <>
      <main className="min-h-screen">
        <Hero />
        <section className="px-5 sm:px-8 lg:px-10 py-20 md:py-28">
          <ProductGrid products={products} />
        </section>
      </main> 
    </>
  );
}
