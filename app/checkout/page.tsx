import type { Metadata } from "next";
import { CheckoutPage } from "@/components/checkout/checkout-page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout | Ember & Oak",
  description: "Complete your artisan chilli sauce order.",
};

export default function CheckoutRoutePage() {
  return (
    <main className="min-h-screen px-5 sm:px-8 lg:px-10 py-12 md:py-16 lg:py-20">
      <CheckoutPage />
    </main>
  );
}
