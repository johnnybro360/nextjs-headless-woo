import type { CartItem } from "@/types/cartItem";

export type CartLineInput = Pick<CartItem, "id" | "quantity">;

export type CartValidationError = {
  productId: number;
  message: string;
};

export type ValidatedCartLine = {
  productId: number;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  imageSrc: string;
  size: string;
  maxQuantity: number | null;
};

export type ValidateCartSuccess = {
  success: true;
  lines: ValidatedCartLine[];
  subtotal: number;
  currency: string;
};

export type ValidateCartFailure = {
  success: false;
  errors: CartValidationError[];
};

export type ValidateCartResult = ValidateCartSuccess | ValidateCartFailure;

export type CartTotalsBreakdown = {
  subtotal: number;
  shippingTotal: number;
  taxTotal: number;
  total: number;
  currency: string;
  pricesIncludeTax: boolean;
  freeShippingMin: number | null;
  qualifiesForFreeShipping: boolean;
  isEstimate: boolean;
};

export type GetCartTotalsSuccess = {
  success: true;
  lines: ValidatedCartLine[];
  totals: CartTotalsBreakdown;
};

export type GetCartTotalsFailure = {
  success: false;
  errors: CartValidationError[];
};

export type GetCartTotalsResult = GetCartTotalsSuccess | GetCartTotalsFailure;
