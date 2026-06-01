"use client";

import { Suspense } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { NavbarSearch } from "@/components/navbar-search";

interface NavLink {
    href: string;
    label: string;
}

export function MobileMenu({ navLinks }: { navLinks: NavLink[] }) {
    return (
        <>
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
                        <SheetTitle className="font-display text-2xl font-normal tracking-0.05em">
                          Ember & Oak
                        </SheetTitle>
                      </SheetHeader>
                      <div className="border-b border-border/40 px-6 py-4">
                        <Suspense fallback={null}>
                          <NavbarSearch className="flex sm:hidden" />
                        </Suspense>
                      </div>
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
              </>
    )
}