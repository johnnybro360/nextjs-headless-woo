"use client";

import { useEffect } from "react";
import { getShopStateKey, useShopStore, type ShopState } from "@/stores/shop-store";

interface ShopStoreSyncProps {
  filters: ShopState["filters"];
  sort: ShopState["sort"];
  searchQuery: ShopState["searchQuery"];
  page: ShopState["page"];
  children: React.ReactNode;
}

/** Keeps Zustand shop state aligned with URL-driven server props. */
export function ShopStoreSync({
  filters,
  sort,
  searchQuery,
  page,
  children,
}: ShopStoreSyncProps) {
  const syncKey = getShopStateKey({ filters, sort, searchQuery, page });

  useEffect(() => {
    useShopStore.setState({ filters, sort, searchQuery, page });
  }, [syncKey, filters, sort, searchQuery, page]);

  return children;
}
