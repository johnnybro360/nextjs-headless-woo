"use client";

import { useSyncExternalStore } from "react";
import { useCartStore } from "@/stores/cart-store";

/** Wait for Zustand persist to rehydrate from localStorage before rendering cart UI. */
export function useCartHydrated() {
  return useSyncExternalStore(
    useCartStore.persist.onFinishHydration,
    () => useCartStore.persist.hasHydrated(),
    () => false
  );
}
