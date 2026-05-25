import { CategoryPageSkeleton } from "@/components/category-page-skeleton";

export default function ShopLoading() {
  return (
    <main className="min-h-screen px-5 sm:px-8 lg:px-10 py-12 md:py-20">
      <CategoryPageSkeleton count={6} />
    </main>
  );
}
