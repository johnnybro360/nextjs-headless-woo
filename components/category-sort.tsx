"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  productSortOptions,
  type ProductSortOption,
} from "@/lib/product-filters";
import { cn } from "@/lib/utils";

interface CategorySortProps {
  value: ProductSortOption;
  onChange: (value: ProductSortOption) => void;
  disabled?: boolean;
  className?: string;
}

export function CategorySort({
  value,
  onChange,
  disabled = false,
  className,
}: CategorySortProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Label htmlFor="category-sort" className="text-label shrink-0">
        Sort by
      </Label>
      <Select
        value={value}
        onValueChange={(nextValue) => onChange(nextValue as ProductSortOption)}
        disabled={disabled}
      >
        <SelectTrigger
          id="category-sort"
          className="h-10 min-w-52 rounded-sm border-border/70 bg-transparent px-3 text-sm"
        >
          <SelectValue placeholder="Sort products" />
        </SelectTrigger>
        <SelectContent align="end">
          {productSortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
