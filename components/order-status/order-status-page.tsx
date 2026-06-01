"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrderStatusResult } from "@/components/order-status/order-status-result";
import { lookupGuestOrder } from "@/lib/order-lookup";
import {
  orderLookupSchema,
  type OrderLookupSchemaValues,
} from "@/lib/order-lookup-schema";
import type { GuestOrderViewModel } from "@/types/order-lookup";
import { cn } from "@/lib/utils";

const inputClass = cn(
  "h-11 w-full rounded-sm border-border/70 bg-transparent px-3 text-sm",
  "placeholder:text-muted-foreground/60",
  "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
);

function OrderStatusForm() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<GuestOrderViewModel | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrderLookupSchemaValues>({
    resolver: zodResolver(orderLookupSchema),
    defaultValues: {
      email: searchParams.get("email") ?? "",
      orderNumber: searchParams.get("order_number") ?? "",
    },
  });

  const onSubmit = async (values: OrderLookupSchemaValues) => {
    setFormError(null);
    setOrder(null);

    const result = await lookupGuestOrder(values.email, values.orderNumber);

    if (!result.success) {
      setFormError(result.error);
      return;
    }

    setOrder(result.order);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <header className="border-b border-border/50 pb-8 text-center md:pb-10">
        <p className="text-label mb-3">Order status</p>
        <h1 className="font-display text-4xl tracking-[0.03em] text-foreground sm:text-5xl">
          Track your order
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Enter the email and order number from your confirmation email.
        </p>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-10 space-y-6"
        noValidate
      >
        <div className="space-y-2">
          <Label htmlFor="email" className="text-label">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            className={inputClass}
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-xs text-destructive" role="alert">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="orderNumber" className="text-label">
            Order number
          </Label>
          <Input
            id="orderNumber"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="e.g. 1234"
            className={inputClass}
            {...register("orderNumber")}
          />
          {errors.orderNumber ? (
            <p className="text-xs text-destructive" role="alert">
              {errors.orderNumber.message}
            </p>
          ) : null}
        </div>

        {formError ? (
          <div
            className="rounded-sm border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            role="alert"
          >
            {formError}
          </div>
        ) : null}

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="h-12 w-full tracking-[0.16em] uppercase shadow-none"
        >
          {isSubmitting ? "Looking up…" : "Find order"}
        </Button>
      </form>

      {order ? <OrderStatusResult order={order} /> : null}
    </div>
  );
}

export function OrderStatusPage() {
  return (
    <Suspense fallback={null}>
      <OrderStatusForm />
    </Suspense>
  );
}
