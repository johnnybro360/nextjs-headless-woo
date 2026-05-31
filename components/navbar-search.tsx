"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface NavbarSearchProps {
  className?: string;
}

export function NavbarSearch({ className }: NavbarSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const openSearch = () => {
    setQuery(searchParams.get("q") ?? "");
    setOpen(true);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }

    setOpen(false);
    router.push(`/shop?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Search products"
        onClick={openSearch}
        className={cn(
          "text-muted-foreground hover:bg-transparent hover:text-foreground",
          className,
        )}
      >
        <Search className="size-1.125rem" strokeWidth={1.25} />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="gap-0 overflow-hidden rounded-sm border-border/60 p-0 sm:max-w-md">
          <DialogHeader className="border-b border-border/50 px-6 py-5 text-left">
            <DialogTitle className="font-display text-xl tracking-[0.02em]">
              Search products
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="px-6 py-6">
            <label htmlFor="navbar-search" className="text-label mb-3 block">
              Search
            </label>
            <div className="flex gap-2">
              <Input
                id="navbar-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name or description..."
                autoFocus
                className="h-11 flex-1 rounded-sm border-border/70 bg-transparent px-3 text-sm"
              />
              <Button
                type="submit"
                disabled={!query.trim()}
                className="h-11 shrink-0 rounded-sm px-5 text-[12px] font-medium tracking-[0.12em] uppercase"
              >
                Search
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
