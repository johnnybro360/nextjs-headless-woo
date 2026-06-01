"use client";

import { useEffect, useMemo, useState } from "react";
import { getCartTotals } from "@/lib/cart-actions";
import { validatedLinesToCartItems } from "@/lib/cart-validation";
import { useCartStore } from "@/stores/cart-store";
import type {
  CartTotalsBreakdown,
  CartValidationError,
  ValidatedCartLine,
} from "@/types/cart-validation";

type ValidatedCartState =
  | { status: "idle" | "loading" }
  | {
      status: "ready";
      lines: ValidatedCartLine[];
      totals: CartTotalsBreakdown;
    }
  | { status: "error"; errors: CartValidationError[] };

function cartSignature(items: { id: number; quantity: number }[]): string {
  return items.map((item) => `${item.id}:${item.quantity}`).join(",");
}

function itemsNeedPriceSync(
  current: { id: number; price: number; quantity: number }[],
  validated: ValidatedCartLine[],
): boolean {
  if (current.length !== validated.length) {
    return true;
  }

  return validated.some((line) => {
    const item = current.find((entry) => entry.id === line.productId);
    return !item || item.price !== line.price || item.quantity !== line.quantity;
  });
}

export function useValidatedCart() {
  const items = useCartStore((state) => state.items);
  const replaceItems = useCartStore((state) => state.replaceItems);
  const [state, setState] = useState<ValidatedCartState>({ status: "idle" });

  const signature = useMemo(
    () => cartSignature(items.map((item) => ({ id: item.id, quantity: item.quantity }))),
    [items],
  );

  useEffect(() => {
    const currentItems = useCartStore.getState().items;

    if (currentItems.length === 0) {
      setState({ status: "idle" });
      return;
    }

    let cancelled = false;
    setState({ status: "loading" });

    getCartTotals(
      currentItems.map((item) => ({ id: item.id, quantity: item.quantity })),
    )
      .then((result) => {
        if (cancelled) {
          return;
        }

        if (!result.success) {
          setState({ status: "error", errors: result.errors });
          return;
        }

        const latestItems = useCartStore.getState().items;

        if (
          itemsNeedPriceSync(
            latestItems.map((item) => ({
              id: item.id,
              price: item.price,
              quantity: item.quantity,
            })),
            result.lines,
          )
        ) {
          replaceItems(validatedLinesToCartItems(result.lines));
        }

        setState({
          status: "ready",
          lines: result.lines,
          totals: result.totals,
        });
      })
      .catch(() => {
        if (!cancelled) {
          setState({
            status: "error",
            errors: [
              {
                productId: 0,
                message: "Unable to load cart totals. Please refresh.",
              },
            ],
          });
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed by cart line ids/qty only
  }, [signature, replaceItems]);

  return {
    items,
    state,
    isLoading: state.status === "loading",
    isEmpty: items.length === 0,
  };
}
