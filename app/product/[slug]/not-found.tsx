import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-semibold text-foreground">Product not found</h1>
      <p className="mt-3 text-muted-foreground max-w-md">
        We couldn&apos;t find that sauce. It may have sold out or the link is incorrect.
      </p>
      <Button asChild className="mt-8">
        <Link href="/shop">Back to Shop</Link>
      </Button>
    </main>
  );
}
