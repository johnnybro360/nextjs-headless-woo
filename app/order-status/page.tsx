import type { Metadata } from "next";
import { OrderStatusPage } from "@/components/order-status/order-status-page";

export const metadata: Metadata = {
  title: "Track Order | Ember & Oak",
  description: "Look up your order status with your email and order number.",
};

export default function OrderStatusRoutePage() {
  return (
    <main className="min-h-screen px-5 sm:px-8 lg:px-10 py-12 md:py-16 lg:py-20">
      <OrderStatusPage />
    </main>
  );
}
