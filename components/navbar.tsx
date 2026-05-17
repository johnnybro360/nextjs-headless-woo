import Link from "next/link";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About" },
  { href: "/journal", label: "Journal" },
];

const navLinkClass =
  "relative text-[13px] tracking-[0.04em] text-muted-foreground transition-colors duration-300 hover:text-foreground after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/85 backdrop-blur-sm supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-20 max-w-7xl items-center px-5 sm:px-8 lg:px-10">
        {/* Left: mobile menu + logo */}
        <div className="flex flex-1 items-center gap-5 sm:gap-8">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open menu"
                  className="text-muted-foreground hover:bg-transparent hover:text-foreground"
                >
                  <Menu className="size-5" strokeWidth={1.25} />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="flex w-[min(100vw-2rem,20rem)] flex-col border-border/60 bg-background p-0"
              >
                <SheetHeader className="border-b border-border/60 px-6 py-7 text-left">
                  <SheetTitle className="font-display text-2xl font-normal tracking-[0.05em]">
                    Ember & Oak
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col px-4 py-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="border-b border-border/40 px-2 py-4 text-[15px] tracking-[0.02em] text-foreground/90 transition-colors duration-300 last:border-b-0 hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto border-t border-border/60 px-6 py-6">
                  <Link
                    href="/account"
                    className="inline-flex items-center gap-3 text-sm tracking-[0.02em] text-muted-foreground transition-colors duration-300 hover:text-foreground"
                  >
                    <User className="size-[1.125rem]" strokeWidth={1.25} />
                    Account
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Link
            href="/"
            className="font-display text-[1.35rem] tracking-[0.07em] text-foreground sm:text-[1.5rem]"
          >
            Ember & Oak
          </Link>
        </div>

        {/* Center: desktop nav */}
        <nav className="hidden items-center justify-center gap-12 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={navLinkClass}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: actions */}
        <div className="flex flex-1 items-center justify-end gap-0.5 sm:gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search"
            className="hidden text-muted-foreground hover:bg-transparent hover:text-foreground sm:flex"
          >
            <Search className="size-[1.125rem]" strokeWidth={1.25} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Account"
            className="hidden text-muted-foreground hover:bg-transparent hover:text-foreground md:flex"
          >
            <User className="size-[1.125rem]" strokeWidth={1.25} />
          </Button>
          <Button
            variant="ghost"
            aria-label="Cart, 3 items"
            asChild
            className={cn(
              "h-10 gap-2 px-2.5 sm:px-3",
              "text-muted-foreground hover:bg-transparent hover:text-foreground"
            )}
          >
            <Link href="/cart">
              <ShoppingBag className="size-[1.125rem] shrink-0" strokeWidth={1.25} />
              <span className="text-[13px] tabular-nums tracking-wide">3</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
