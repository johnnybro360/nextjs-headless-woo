"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CartValidationAlert } from "@/components/cart/cart-validation-alert";
import { CheckoutOrderSummary } from "@/components/checkout/checkout-order-summary";
import { validateCart } from "@/lib/cart-actions";
import { AU_COUNTRY_CODE, AU_STATES } from "@/lib/au-address";
import { createOrder } from "@/lib/orders";
import {
  checkoutSchema,
  type CheckoutSchemaValues,
} from "@/lib/checkout-schema";
import { useCartHydrated } from "@/hooks/use-cart-hydrated";
import { useValidatedCart } from "@/hooks/use-validated-cart";
import { useCartStore } from "@/stores/cart-store";
import { cn } from "@/lib/utils";

const inputClass = cn(
  "h-11 w-full rounded-sm border-border/70 bg-transparent px-3 text-sm",
  "placeholder:text-muted-foreground/60",
  "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
);

function FormField({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-label">
        {label}
      </Label>
      {children}
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function CheckoutPage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const hasHydrated = useCartHydrated();
  const clearCart = useCartStore((state) => state.clearCart);
  const { items, state, isLoading } = useValidatedCart();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutSchemaValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address1: "",
      address2: "",
      city: "",
      state: undefined,
      postcode: "",
      country: AU_COUNTRY_CODE,
    },
  });

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const totals = state.status === "ready" ? state.totals : null;
  const validationErrors = state.status === "error" ? state.errors : [];

  useEffect(() => {
    if (hasHydrated && items.length === 0) {
      router.replace("/cart");
    }
  }, [hasHydrated, items.length, router]);

  const onSubmit = async (values: CheckoutSchemaValues) => {
    setSubmitError(null);

    const freshValidation = await validateCart(
      items.map((item) => ({ id: item.id, quantity: item.quantity })),
    );

    if (!freshValidation.success) {
      setSubmitError(
        freshValidation.errors.map((entry) => entry.message).join(" "),
      );
      return;
    }

    const result = await createOrder(items, {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      address1: values.address1,
      address2: values.address2,
      city: values.city,
      state: values.state,
      postcode: values.postcode,
      country: values.country,
    });

    if (!result.success) {
      setSubmitError(result.error);
      return;
    }

    clearCart();

    if (result.paymentUrl) {
      window.location.assign(result.paymentUrl);
      return;
    }

    const params = new URLSearchParams({
      order_id: String(result.orderId),
      order_number: result.orderNumber,
      subtotal: result.subtotal,
      shipping: result.shippingTotal,
      tax: result.taxTotal,
      total: result.total,
    });

    router.push(`/checkout/success?${params.toString()}`);
  };

  if (!hasHydrated) {
    return null;
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <header className="border-b border-border/50 pb-8 md:pb-10">
        <p className="text-label mb-3">Checkout</p>
        <h1 className="font-display text-4xl tracking-[0.03em] text-foreground sm:text-5xl">
          Delivery details
        </h1>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
          Australian delivery only. Prices, stock, and totals are validated
          against WooCommerce before your order is created.
        </p>
      </header>

      <CartValidationAlert errors={validationErrors} />

      <div className="mt-10 grid grid-cols-1 gap-12 lg:mt-14 lg:grid-cols-[1fr_20rem] lg:gap-16 xl:grid-cols-[1fr_22rem]">
        <form
          id="checkout-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-10"
          noValidate
        >
          <section className="space-y-6">
            <h2 className="font-display text-2xl tracking-[0.02em] text-foreground">
              Contact
            </h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField id="email" label="Email" error={errors.email?.message}>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={inputClass}
                  {...register("email")}
                />
              </FormField>
              <FormField id="phone" label="Phone" error={errors.phone?.message}>
                <Input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="04xx xxx xxx"
                  className={inputClass}
                  {...register("phone")}
                />
              </FormField>
            </div>
          </section>

          <section className="space-y-6 border-t border-border/50 pt-10">
            <h2 className="font-display text-2xl tracking-[0.02em] text-foreground">
              Shipping (Australia)
            </h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                id="firstName"
                label="First name"
                error={errors.firstName?.message}
              >
                <Input
                  id="firstName"
                  autoComplete="given-name"
                  className={inputClass}
                  {...register("firstName")}
                />
              </FormField>
              <FormField
                id="lastName"
                label="Last name"
                error={errors.lastName?.message}
              >
                <Input
                  id="lastName"
                  autoComplete="family-name"
                  className={inputClass}
                  {...register("lastName")}
                />
              </FormField>
            </div>

            <FormField
              id="address1"
              label="Street address"
              error={errors.address1?.message}
            >
              <Input
                id="address1"
                autoComplete="address-line1"
                className={inputClass}
                {...register("address1")}
              />
            </FormField>

            <FormField id="address2" label="Apartment, suite, etc. (optional)">
              <Input
                id="address2"
                autoComplete="address-line2"
                className={inputClass}
                {...register("address2")}
              />
            </FormField>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField id="city" label="Suburb / city" error={errors.city?.message}>
                <Input
                  id="city"
                  autoComplete="address-level2"
                  className={inputClass}
                  {...register("city")}
                />
              </FormField>
              <FormField id="state" label="State" error={errors.state?.message}>
                <Controller
                  control={control}
                  name="state"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id="state"
                        className={cn(inputClass, "w-full")}
                      >
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {AU_STATES.map((state) => (
                          <SelectItem key={state.code} value={state.code}>
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                id="postcode"
                label="Postcode"
                error={errors.postcode?.message}
              >
                <Input
                  id="postcode"
                  autoComplete="postal-code"
                  inputMode="numeric"
                  maxLength={4}
                  className={inputClass}
                  {...register("postcode")}
                />
              </FormField>
              <FormField id="country-display" label="Country">
                <Input
                  id="country-display"
                  value="Australia"
                  readOnly
                  disabled
                  className={cn(inputClass, "opacity-70")}
                />
              </FormField>
            </div>
          </section>

          <section className="rounded-sm border border-border/60 bg-muted/15 p-5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              You will be redirected to{" "}
              <span className="text-foreground">Stripe</span> to complete payment
              securely after placing your order.
            </p>
          </section>

          {submitError ? (
            <div
              className="rounded-sm border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
              role="alert"
            >
              {submitError}
            </div>
          ) : null}

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting || isLoading || state.status === "error"}
            className="h-12 w-full tracking-[0.16em] uppercase shadow-none lg:hidden"
          >
            {isSubmitting ? "Placing order…" : "Place order"}
          </Button>
        </form>

        <CheckoutOrderSummary
          items={items}
          totals={totals}
          itemCount={itemCount}
          isLoading={isLoading}
          isSubmitting={isSubmitting}
          checkoutDisabled={state.status === "error"}
        />
      </div>
    </div>
  );
}
