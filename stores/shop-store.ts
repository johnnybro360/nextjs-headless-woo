import { create } from "zustand";
import {
  defaultProductFilters,
  defaultProductSort,
  type ProductFilterState,
  type ProductSortOption,
} from "@/lib/product-filters";

export interface ShopState {
  filters: ProductFilterState;
  sort: ProductSortOption;
  searchQuery: string;
  page: number;
}

interface ShopStore extends ShopState {
  setFilters: (filters: ProductFilterState) => void;
  setSort: (sort: ProductSortOption) => void;
  setSearchQuery: (searchQuery: string) => void;
  setShopState: (state: Partial<ShopState>) => void;
  clearFilters: () => void;
  reset: () => void;
}

const initialState: ShopState = {
  filters: defaultProductFilters,
  sort: defaultProductSort,
  searchQuery: "",
  page: 1,
};

export const useShopStore = create<ShopStore>((set) => ({
  ...initialState,

  setFilters: (filters) => set({ filters }),

  setSort: (sort) => set({ sort }),

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  setShopState: (state) => set(state),

  clearFilters: () => set({ filters: defaultProductFilters }),

  reset: () => set(initialState),
}));

export function getShopStateKey(state: ShopState): string {
  const { filters, sort, searchQuery, page } = state;
  return [
    searchQuery,
    String(page),
    sort,
    filters.inStock,
    filters.outOfStock,
    filters.priceMin,
    filters.priceMax,
    filters.categories.join(","),
    filters.brands.join(","),
    filters.heatLevels.join(","),
  ].join("|");
}
