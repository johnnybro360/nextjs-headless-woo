import type { ShippingConfig, TaxConfig } from "@/lib/store-config";
import type {
  CartTotalsBreakdown,
  ValidatedCartLine,
} from "@/types/cart-validation";

function roundMoney(amount: number): number {
  return Math.round(amount * 100) / 100;
}

export function estimateCartTotals(
  lines: ValidatedCartLine[],
  shipping: ShippingConfig,
  tax: TaxConfig,
): CartTotalsBreakdown {
  const subtotal = roundMoney(
    lines.reduce((sum, line) => sum + line.price * line.quantity, 0),
  );

  const freeShippingMin = shipping.freeShippingMin;
  const qualifiesForFreeShipping =
    freeShippingMin !== null && subtotal >= freeShippingMin;

  const shippingTotal = qualifiesForFreeShipping
    ? 0
    : roundMoney(shipping.flatRateCost ?? 0);

  let taxTotal = 0;
  let total = subtotal + shippingTotal;

  if (tax.pricesIncludeTax) {
    const taxableBase = subtotal + shippingTotal;
    taxTotal = roundMoney(taxableBase - taxableBase / (1 + tax.gstRate));
  } else {
    taxTotal = roundMoney((subtotal + shippingTotal) * tax.gstRate);
    total = roundMoney(subtotal + shippingTotal + taxTotal);
  }

  return {
    subtotal,
    shippingTotal,
    taxTotal,
    total: roundMoney(total),
    currency: "AUD",
    pricesIncludeTax: tax.pricesIncludeTax,
    freeShippingMin,
    qualifiesForFreeShipping,
    isEstimate: true,
  };
}
