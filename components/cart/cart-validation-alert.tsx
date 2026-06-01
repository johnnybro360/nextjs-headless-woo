"use client";

import type { CartValidationError } from "@/types/cart-validation";

interface CartValidationAlertProps {
  errors: CartValidationError[];
}

export function CartValidationAlert({ errors }: CartValidationAlertProps) {
  if (errors.length === 0) {
    return null;
  }

  return (
    <div
      className="mb-8 rounded-sm border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
      role="alert"
    >
      <p className="font-medium">Please update your cart</p>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {errors.map((error) => (
          <li key={`${error.productId}-${error.message}`}>{error.message}</li>
        ))}
      </ul>
    </div>
  );
}
