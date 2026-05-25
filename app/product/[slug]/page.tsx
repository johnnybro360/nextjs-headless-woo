import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductDetail } from "@/components/product-detail";
import { RelatedProducts } from "@/components/related-products";
import { getProductBySlug } from "@/lib/products";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found | Ember & Oak" };
  }

  return {
    title: `${product.fullName} | Ember & Oak`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  const relatedProductIds = product?.related_ids ?? [];
  
  console.log('product',product);
  
  if (!product) {
    notFound();
  }


  return (
    <main className="min-h-screen px-5 sm:px-8 lg:px-10 py-12 md:py-16 lg:py-20">
      <ProductDetail product={product} />
      { relatedProductIds.length > 0 && <RelatedProducts relatedProductIds={relatedProductIds} className="mt-16 md:mt-24 pb-16 md:pb-20" />}
    </main>
  );
}
