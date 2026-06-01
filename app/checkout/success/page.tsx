import type { Metadata } from "next";
import { CheckoutSuccess } from "@/components/checkout/checkout-success";

export const metadata: Metadata = {
  title: "Order Confirmed | Ember & Oak",
  description: "Your order has been placed successfully.",
};

type PageProps = {
  searchParams: Promise<{
    order_id?: string;
    order_number?: string;
    subtotal?: string;
    shipping?: string;
    tax?: string;
    total?: string;
  }>;
};

export default async function CheckoutSuccessRoutePage({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  return (
    <main className="min-h-screen px-5 sm:px-8 lg:px-10 py-12 md:py-16 lg:py-20">
      <CheckoutSuccess
        orderId={params.order_id}
        orderNumber={params.order_number}
        subtotal={params.subtotal}
        shipping={params.shipping}
        tax={params.tax}
        total={params.total}
      />
    </main>
  );
}
