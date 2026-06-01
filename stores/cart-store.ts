// stores/cart-store.ts

import { create } from "zustand";

import { persist } from "zustand/middleware";

import { CartItem } from "@/types/cartItem";

interface CartStore {
  items: CartItem[];

  addItem: (item: CartItem) => void;

  removeItem: (id: number) => void;

  updateQuantity: (
    id: number,
    quantity: number
  ) => void;

  clearCart: () => void;

  replaceItems: (items: CartItem[]) => void;
}

export const useCartStore =
  create<CartStore>()(
    persist(
      (set) => ({
        items: [],

        addItem: (item) =>
          set((state) => {
            const existing =
              state.items.find(
                (i) =>
                  i.id === item.id
                //  &&
                //   i.variationId === item.variationId
              );

            if (existing) {
              return {
                items: state.items.map((i) =>
                  i.id === item.id
                    ? {
                        ...i,
                        quantity:
                          i.quantity + item.quantity,
                      }
                    : i
                ),
              };
            }

            return {
              items: [...state.items, item],
            };
          }),

        removeItem: (id) =>
          set((state) => ({
            items: state.items.filter(
              (item) => item.id !== id
            ),
          })),

        updateQuantity: (id, quantity) =>
          set((state) => ({
            items: state.items.map((item) =>
              item.id === id
                ? { ...item, quantity }
                : item
            ),
          })),

        clearCart: () =>
          set({
            items: [],
          }),

        replaceItems: (items) =>
          set({
            items,
          }),
      }),
      {
        name: "cart-storage",
      }
    )
  );