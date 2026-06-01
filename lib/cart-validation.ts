import { mapWooProduct } from "@/lib/mappers/productMapper";
import { wooFetch } from "@/lib/woo-fetch";
import type { CartLineInput } from "@/types/cart-validation";
import type {
  ValidateCartFailure,
  ValidateCartResult,
  ValidatedCartLine,
} from "@/types/cart-validation";
import type { WooProduct } from "@/types/wooProduct";

function getMaxPurchasableQuantity(product: WooProduct): number | null {
  if (!product.manage_stock) {
    return null;
  }

  if (product.stock_quantity === null || product.stock_quantity < 0) {
    return null;
  }

  return product.stock_quantity;
}

export async function validateCartItems(
  items: CartLineInput[],
): Promise<ValidateCartResult> {
  if (items.length === 0) {
    return {
      success: false,
      errors: [{ productId: 0, message: "Your cart is empty." }],
    };
  }

  const ids = items.map((item) => item.id);

  try {
    const { data } = await wooFetch<WooProduct[]>("/products", {
      include: ids,
      status: "publish",
      per_page: ids.length,
    });

    const productsById = new Map(data.map((product) => [product.id, product]));
    const lines: ValidatedCartLine[] = [];
    const errors: ValidateCartFailure["errors"] = [];

    for (const item of items) {
      const product = productsById.get(item.id);

      if (!product) {
        errors.push({
          productId: item.id,
          message: "A product in your cart is no longer available.",
        });
        continue;
      }

      const mapped = mapWooProduct(product);

      if (!product.purchasable || product.status !== "publish") {
        errors.push({
          productId: item.id,
          message: `${mapped.name} cannot be purchased.`,
        });
        continue;
      }

      if (!mapped.inStock || product.stock_status === "outofstock") {
        errors.push({
          productId: item.id,
          message: `${mapped.name} is out of stock.`,
        });
        continue;
      }

      const maxQuantity = getMaxPurchasableQuantity(product);

      if (maxQuantity !== null && item.quantity > maxQuantity) {
        errors.push({
          productId: item.id,
          message:
            maxQuantity === 0
              ? `${mapped.name} is out of stock.`
              : `Only ${maxQuantity} of ${mapped.name} available.`,
        });
        continue;
      }

      if (item.quantity < 1) {
        errors.push({
          productId: item.id,
          message: `Invalid quantity for ${mapped.name}.`,
        });
        continue;
      }

      lines.push({
        productId: mapped.id,
        slug: mapped.slug,
        name: mapped.name,
        price: mapped.price,
        quantity: item.quantity,
        imageSrc: mapped.imageSrc,
        size: mapped.size,
        maxQuantity,
      });
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }

    const subtotal = lines.reduce(
      (sum, line) => sum + line.price * line.quantity,
      0,
    );

    return {
      success: true,
      lines,
      subtotal,
      currency: "AUD",
    };
  } catch {
    return {
      success: false,
      errors: [
        {
          productId: 0,
          message: "Unable to validate your cart. Please try again.",
        },
      ],
    };
  }
}

export function validatedLinesToCartItems(
  lines: ValidatedCartLine[],
): import("@/types/cartItem").CartItem[] {
  return lines.map((line) => ({
    id: line.productId,
    slug: line.slug,
    name: line.name,
    price: line.price,
    quantity: line.quantity,
    imageSrc: line.imageSrc,
    size: line.size,
  }));
}
