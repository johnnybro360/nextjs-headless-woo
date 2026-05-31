import { CategoryPage } from "@/components/category-page";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <>
      <main className="min-h-screen px-5 sm:px-8 lg:px-10 py-12 md:py-20">
        <CategoryPage searchParams={searchParams} />
      </main>
    </>
  );
}
