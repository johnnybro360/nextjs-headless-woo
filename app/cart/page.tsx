import type { Metadata } from "next";
import { CartPage } from "@/components/cart/cart-page";

export const metadata: Metadata = {
  title: "Your Cart | Ember & Oak",
  description: "Review your artisan chilli sauce selection before checkout.",
};

export default function CartRoutePage() {
  return (
    <main className="min-h-screen px-5 sm:px-8 lg:px-10 py-12 md:py-16 lg:py-20">
      <CartPage />
    </main>
  );
}
