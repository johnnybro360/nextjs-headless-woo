"use client";

import { useEffect, useRef, useState } from "react";
import { Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  defaultProductFilters,
  hasActiveFilters,
  toggleFilterValue,
  type ProductFilterState,
  type ShopFilterOptions,
} from "@/lib/product-filters";
import { cn } from "@/lib/utils";

interface CategoryFiltersProps {
  filterOptions: ShopFilterOptions;
  filters: ProductFilterState;
  onChange: (filters: ProductFilterState) => void;
  disabled?: boolean;
  className?: string;
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border/50 pt-6 first:border-t-0 first:pt-0">
      <h3 className="text-label mb-4">{title}</h3>
      {children}
    </section>
  );
}

function FilterCheckboxRow({
  id,
  label,
  count,
  checked,
  disabled,
  onCheckedChange,
  icon,
}: {
  id: string;
  label: string;
  count?: number;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (checked: boolean) => void;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <Checkbox
        id={id}
        checked={checked}
        disabled={disabled}
        onCheckedChange={(value) => onCheckedChange(value === true)}
        className="mt-0.5"
      />
      <Label
        htmlFor={id}
        className="flex flex-1 cursor-pointer items-center justify-between gap-3 text-sm font-normal leading-snug text-foreground/85"
      >
        <span className="flex items-center gap-2">
          {icon}
          {label}
        </span>
        {count !== undefined ? (
          <span className="text-xs tabular-nums text-muted-foreground">
            {count}
          </span>
        ) : null}
      </Label>
    </div>
  );
}

export function CategoryFilters({
  filterOptions,
  filters,
  onChange,
  disabled = false,
  className,
}: CategoryFiltersProps) {
  const active = hasActiveFilters(filters);
  const [priceMin, setPriceMin] = useState(filters.priceMin);
  const [priceMax, setPriceMax] = useState(filters.priceMax);
  const filtersRef = useRef(filters);

  filtersRef.current = filters;

  useEffect(() => {
    setPriceMin(filters.priceMin);
    setPriceMax(filters.priceMax);
  }, [filters.priceMin, filters.priceMax]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (
        priceMin === filtersRef.current.priceMin &&
        priceMax === filtersRef.current.priceMax
      ) {
        return;
      }

      onChange({
        ...filtersRef.current,
        priceMin,
        priceMax,
      });
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [priceMin, priceMax, onChange]);

  const updateFilters = (partial: Partial<ProductFilterState>) => {
    onChange({ ...filters, ...partial });
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between gap-4">
        <p className="text-label">Filters</p>
        {active ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            className="h-auto px-0 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => onChange(defaultProductFilters)}
          >
            Clear all
          </Button>
        ) : null}
      </div>

      <FilterSection title="Availability">
        <div className="space-y-3">
          <FilterCheckboxRow
            id="filter-in-stock"
            label="In stock"
            checked={filters.inStock}
            disabled={disabled}
            onCheckedChange={(checked) => updateFilters({ inStock: checked })}
          />
          <FilterCheckboxRow
            id="filter-out-of-stock"
            label="Out of stock"
            checked={filters.outOfStock}
            disabled={disabled}
            onCheckedChange={(checked) => updateFilters({ outOfStock: checked })}
          />
        </div>
      </FilterSection>

      <FilterSection title="Price">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="filter-price-min" className="text-xs text-muted-foreground">
              Min
            </Label>
            <Input
              id="filter-price-min"
              type="number"
              min={0}
              step="0.01"
              inputMode="decimal"
              disabled={disabled}
              placeholder={`$${filterOptions.priceRange.min}`}
              value={priceMin}
              onChange={(event) => setPriceMin(event.target.value)}
              className="h-10 rounded-sm border-border/70 bg-transparent px-3 text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="filter-price-max" className="text-xs text-muted-foreground">
              Max
            </Label>
            <Input
              id="filter-price-max"
              type="number"
              min={0}
              step="0.01"
              inputMode="decimal"
              disabled={disabled}
              placeholder={`$${filterOptions.priceRange.max}`}
              value={priceMax}
              onChange={(event) => setPriceMax(event.target.value)}
              className="h-10 rounded-sm border-border/70 bg-transparent px-3 text-sm"
            />
          </div>
        </div>
      </FilterSection>

      {filterOptions.categories.length > 0 ? (
        <FilterSection title="Category">
          <div className="space-y-3">
            {filterOptions.categories.map((category) => (
              <FilterCheckboxRow
                key={category.slug}
                id={`filter-category-${category.slug}`}
                label={category.name}
                count={category.count}
                checked={filters.categories.includes(category.slug)}
                disabled={disabled}
                onCheckedChange={() =>
                  updateFilters({
                    categories: toggleFilterValue(
                      filters.categories,
                      category.slug,
                    ),
                  })
                }
              />
            ))}
          </div>
        </FilterSection>
      ) : null}

      {filterOptions.brands.length > 0 ? (
        <FilterSection title="Brand">
          <div className="space-y-3">
            {filterOptions.brands.map((brand) => (
              <FilterCheckboxRow
                key={brand.slug}
                id={`filter-brand-${brand.slug}`}
                label={brand.name}
                count={brand.count}
                checked={filters.brands.includes(brand.slug)}
                disabled={disabled}
                onCheckedChange={() =>
                  updateFilters({
                    brands: toggleFilterValue(filters.brands, brand.slug),
                  })
                }
              />
            ))}
          </div>
        </FilterSection>
      ) : null}

      {filterOptions.heatLevels.length > 0 ? (
        <FilterSection title="Heat level">
          <div className="space-y-3">
            {filterOptions.heatLevels.map((heat) => (
              <FilterCheckboxRow
                key={heat.slug}
                id={`filter-heat-${heat.slug}`}
                label={heat.label}
                count={heat.count}
                checked={filters.heatLevels.includes(heat.slug)}
                disabled={disabled}
                onCheckedChange={() =>
                  updateFilters({
                    heatLevels: toggleFilterValue(filters.heatLevels, heat.slug),
                  })
                }
                icon={
                  <Flame
                    className="size-3 shrink-0 text-primary"
                    strokeWidth={1.5}
                  />
                }
              />
            ))}
          </div>
        </FilterSection>
      ) : null}
    </div>
  );
}
