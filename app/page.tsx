import { ProductGrid } from "@/components/product-grid";
import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <>
      <main className="min-h-screen">
        <Hero />
        <section className="px-5 sm:px-8 lg:px-10 py-20 md:py-28">
          <ProductGrid />
        </section>
      </main> 
    </>
  );
}
