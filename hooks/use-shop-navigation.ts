"use client";

import { useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  buildShopSearchParams,
  defaultProductFilters,
  defaultProductSort,
  type ProductFilterState,
  type ProductSortOption,
} from "@/lib/product-filters";
import { useShopStore, type ShopState } from "@/stores/shop-store";

const SHOP_PATH = "/shop";

export function useShopNavigation() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const filters = useShopStore((state) => state.filters);
  const sort = useShopStore((state) => state.sort);
  const searchQuery = useShopStore((state) => state.searchQuery);
  const page = useShopStore((state) => state.page);
  const setShopState = useShopStore((state) => state.setShopState);
  const clearFilters = useShopStore((state) => state.clearFilters);

  const pushShopState = useCallback(
    (next: Partial<ShopState>) => {
      const merged: ShopState = {
        filters: next.filters ?? filters,
        sort: next.sort ?? sort,
        searchQuery: next.searchQuery ?? searchQuery,
        page: next.page ?? page,
      };

      setShopState(merged);

      const params = buildShopSearchParams(
        merged.filters,
        merged.sort,
        merged.searchQuery,
        merged.page,
      );
      const query = params.toString();
      const href = query ? `${SHOP_PATH}?${query}` : SHOP_PATH;

      startTransition(() => {
        router.push(href, { scroll: false });
      });
    },
    [filters, page, router, searchQuery, setShopState, sort],
  );

  const setFilters = useCallback(
    (nextFilters: ProductFilterState) => {
      pushShopState({ filters: nextFilters, page: 1 });
    },
    [pushShopState],
  );

  const setSort = useCallback(
    (nextSort: ProductSortOption) => {
      pushShopState({ sort: nextSort, page: 1 });
    },
    [pushShopState],
  );

  const setPage = useCallback(
    (nextPage: number) => {
      pushShopState({ page: nextPage });
    },
    [pushShopState],
  );

  const searchProducts = useCallback(
    (query: string) => {
      pushShopState({
        searchQuery: query,
        filters: defaultProductFilters,
        sort: defaultProductSort,
        page: 1,
      });
    },
    [pushShopState],
  );

  const clearAllFilters = useCallback(() => {
    clearFilters();
    pushShopState({ filters: defaultProductFilters, page: 1 });
  }, [clearFilters, pushShopState]);

  return {
    filters,
    sort,
    searchQuery,
    page,
    isPending,
    setFilters,
    setSort,
    setPage,
    searchProducts,
    clearAllFilters,
    pushShopState,
  };
}
