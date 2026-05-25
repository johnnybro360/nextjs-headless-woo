import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/50">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_0%,oklch(0.94_0.02_35/0.35),transparent_55%),radial-gradient(ellipse_60%_50%_at_90%_80%,oklch(0.96_0.015_88/0.6),transparent_50%)]"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col items-stretch gap-12 py-16 sm:py-20 md:py-24 lg:flex-row lg:items-center lg:gap-16 lg:py-28 xl:py-32">
          <div className="flex-1 text-left">
            <p className="text-label">Est. 2019 · Oaxaca & Beyond</p>

            <h1
              className={cn(
                "mt-6 font-display text-[2.75rem] leading-[1.05] tracking-[0.03em] text-balance",
                "sm:text-5xl md:text-6xl lg:text-[4.25rem] xl:text-[4.75rem]"
              )}
            >
              Fire Meets
              <span className="mt-1 block text-primary">Flavour</span>
            </h1>

            <p className="mt-7 max-w-md text-base leading-[1.8] text-muted-foreground sm:text-lg sm:leading-relaxed">
              Artisan chilli sauces crafted from organic ingredients and aged in oak.
              Each bottle is a small batch, patiently made.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Button
                asChild
                size="lg"
                className={cn(
                  "h-12 w-full rounded-sm sm:h-14 sm:w-auto sm:min-w-12.5rem",
                  "text-[13px] tracking-[0.16em] uppercase shadow-none",
                  "transition-all duration-300 hover:brightness-[1.03]"
                )}
              >
                <Link href="/shop">
                  Shop Collection
                  <ArrowRight className="ml-2 size-4" strokeWidth={1.25} />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className={cn(
                  "h-12 w-full rounded-sm sm:h-14 sm:w-auto",
                  "text-[13px] tracking-0.1em uppercase text-muted-foreground",
                  "hover:bg-transparent hover:text-foreground"
                )}
              >
                Our Story
              </Button>
            </div>

            <ul className="mt-12 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-10 sm:gap-y-2">
              <li className="flex items-center gap-2.5">
                <span className="h-px w-6 bg-border" aria-hidden />
                100% Organic
              </li>
              <li className="flex items-center gap-2.5">
                <span className="h-px w-6 bg-border" aria-hidden />
                Oak Barrel Aged
              </li>
              <li className="flex items-center gap-2.5">
                <span className="h-px w-6 bg-border" aria-hidden />
                Free Shipping over $50
              </li>
            </ul>
          </div>

          <div className="flex-1 lg:max-w-34rem lg:justify-self-end">
            <div className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-none">
              <div className="relative aspect-4/5 overflow-hidden rounded-sm bg-muted/25 ring-1 ring-border/60 sm:aspect-square lg:aspect-[4/5]">
                <Image
                  src="/images/chilli-sauce.jpg"
                  alt="Artisan chilli sauce bottle"
                  fill
                  className="object-contain object-center p-6 sm:p-8"
                  priority
                  sizes="(max-width: 1024px) 90vw, 34rem"
                />
              </div>

              <div className="absolute bottom-5 right-4 rounded-sm border border-border/70 bg-background/90 px-4 py-3 backdrop-blur-[2px] sm:bottom-6 sm:right-6">
                <p className="text-label">Scoville</p>
                <p className="mt-1 font-display text-3xl leading-none tracking-[0.02em] text-primary">
                  15,000
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
