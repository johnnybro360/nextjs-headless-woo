"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Search, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavbarSearch } from "@/components/navbar-search";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./mobile-menu";
import { useCartStore } from "@/stores/cart-store";

const navLinks = [{ href: "/shop", label: "Shop" }];

const navLinkClass =
  "relative text-[13px] tracking-[0.04em] text-muted-foreground transition-colors duration-300 hover:text-foreground after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full";

export function Navbar() {
  const itemCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-background/85 backdrop-blur-sm supports-backdrop-filter:bg-background/75">
      <div className="mx-auto flex h-20 max-w-7xl items-center px-5 sm:px-8 lg:px-10">
        <MobileMenu navLinks={navLinks} />

        <nav className="hidden items-center justify-center gap-12 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={navLinkClass}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-0.5 sm:gap-1">
          <Suspense
            fallback={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Search products"
                className="hidden text-muted-foreground sm:flex"
                disabled
              >
                <Search className="size-1.125rem" strokeWidth={1.25} />
              </Button>
            }
          >
            <NavbarSearch className="hidden sm:flex" />
          </Suspense>
          <Button
            variant="ghost"
            aria-label={`Cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
            asChild
            className={cn(
              "h-10 gap-2 px-2.5 sm:px-3",
              "text-muted-foreground hover:bg-transparent hover:text-foreground",
            )}
          >
            <Link href="/cart">
              <ShoppingBag className="size-1.125rem shrink-0" strokeWidth={1.25} />
              <span className="text-[13px] tabular-nums tracking-wide">{itemCount}</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
