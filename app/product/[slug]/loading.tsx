import { ProductDetailSkeleton } from "@/components/product-detail-skeleton";

export default function ProductLoading() {
  return (
    <main className="min-h-screen px-5 sm:px-8 lg:px-10 py-12 md:py-16 lg:py-20">
      <ProductDetailSkeleton />
    </main>
  );
}
