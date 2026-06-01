"use server";

import { validateCartItems } from "@/lib/cart-validation";
import { estimateCartTotals } from "@/lib/cart-totals";
import { getShippingConfig, getTaxConfig } from "@/lib/store-config";
import type { CartLineInput } from "@/types/cart-validation";
import type { GetCartTotalsResult, ValidateCartResult } from "@/types/cart-validation";

export async function validateCart(
  items: CartLineInput[],
): Promise<ValidateCartResult> {
  return validateCartItems(items);
}

export async function getCartTotals(
  items: CartLineInput[],
): Promise<GetCartTotalsResult> {
  const validation = await validateCartItems(items);

  if (!validation.success) {
    return { success: false, errors: validation.errors };
  }

  const [shipping, tax] = await Promise.all([
    getShippingConfig(),
    getTaxConfig(),
  ]);

  const totals = estimateCartTotals(validation.lines, shipping, tax);

  return {
    success: true,
    lines: validation.lines,
    totals,
  };
}
