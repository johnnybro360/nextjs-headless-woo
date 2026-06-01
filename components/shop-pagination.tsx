"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ShopPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  className?: string;
}

function getVisiblePages(currentPage: number, totalPages: number): number[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set<number>([
    1,
    totalPages,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ]);

  return [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
}

export function ShopPagination({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
  className,
}: ShopPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <nav
      aria-label="Product pagination"
      className={cn("flex flex-wrap items-center justify-center gap-2", className)}
    >
      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={disabled || currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
        className="size-10 rounded-sm border-border/70"
      >
        <ChevronLeft className="size-4" strokeWidth={1.25} />
      </Button>

      <div className="flex items-center gap-1">
        {visiblePages.map((pageNumber, index) => {
          const prevPage = visiblePages[index - 1];
          const showEllipsis = prevPage !== undefined && pageNumber - prevPage > 1;

          return (
            <span key={pageNumber} className="flex items-center gap-1">
              {showEllipsis ? (
                <span className="px-1 text-sm text-muted-foreground">…</span>
              ) : null}
              <Button
                type="button"
                variant={pageNumber === currentPage ? "default" : "outline"}
                disabled={disabled}
                onClick={() => onPageChange(pageNumber)}
                aria-label={`Page ${pageNumber}`}
                aria-current={pageNumber === currentPage ? "page" : undefined}
                className={cn(
                  "min-w-10 rounded-sm border-border/70 text-sm tabular-nums",
                  pageNumber === currentPage && "pointer-events-none",
                )}
              >
                {pageNumber}
              </Button>
            </span>
          );
        })}
      </div>

      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={disabled || currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
        className="size-10 rounded-sm border-border/70"
      >
        <ChevronRight className="size-4" strokeWidth={1.25} />
      </Button>
    </nav>
  );
}
