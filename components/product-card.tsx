import Image from "next/image";
import Link from "next/link";
import { Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  slug?: string;
  name?: string;
  origin?: string;
  description?: string;
  price?: number;
  size?: string;
  imageSrc?: string;
  heat?: string;
}

function truncateWithEllipsis(text: string, maxChars: number) {
  if (text.length <= maxChars) {
    return text;
  }

  return `${text.slice(0, maxChars).trimEnd()}...`;
}

export function ProductCard({
  slug,
  name,
  origin,
  description,
  price,
  size,
  imageSrc,
  heat,
}: ProductCardProps) {
  const href = `/product/${slug}`;
  const descriptionPreview = truncateWithEllipsis(description ?? "", 110);

  return (
    <Card
      className={cn(
        "group flex h-full w-full flex-col overflow-hidden",
        "border-0 bg-transparent shadow-none ring-0 gap-0 p-0",
      )}
    >
      {/* Image — dominant, fixed ratio */}
      <Link href={href} className="block shrink-0" tabIndex={-1} aria-hidden>
        <div
          className={cn(
            "relative aspect-4/5 overflow-hidden rounded-sm",
            "bg-muted/30 ring-1 ring-border/70",
            "transition-[ring-color] duration-300 group-hover:ring-primary/25",
          )}
        >
          <Image
            src={imageSrc ?? ""}
            alt={name ?? ""}
            fill
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority
            // loading="eager"
            // unoptimized={true}
          />
          <Badge
            variant="outline"
            className="absolute left-3.5 top-3.5 gap-1.5 border-border/80 bg-background/90 text-foreground backdrop-blur-[2px]"
          >
            <Flame className="size-3 shrink-0 text-primary" strokeWidth={1.5} />
            {heat}
          </Badge>
        </div>
      </Link>

      {/* Content — fixed blocks + justify-between for even card rhythm */}
      <div className="flex flex-1 flex-col pt-6">
        <div className="flex min-h-44 flex-1 flex-col justify-between sm:min-h-48">
          <div className="min-h-21 shrink-0">
            <Link href={href} className="block">
              <h3
                className={cn(
                  "line-clamp-2 min-h-13 font-display text-xl leading-snug tracking-[0.02em] text-foreground",
                  "transition-colors duration-300 group-hover:text-primary",
                )}
              >
                {name}
              </h3>
            </Link>

            <p className="mt-2 line-clamp-1 min-h-5 text-label">
              {origin} · {size}
            </p>
          </div>

          <p className="line-clamp-2 min-h-14 shrink-0 text-sm leading-7 text-muted-foreground">
            {descriptionPreview}
          </p>
        </div>

        {/* Footer — price secondary, CTA aligned */}
        <div className="mt-6 shrink-0 border-t border-border/60 pt-5">
          <p className="text-sm tracking-wide text-muted-foreground">
            <span className="tabular-nums">${price}</span>
          </p>
          <Button
            asChild
            variant="outline"
            className={cn(
              "mt-4 h-11 w-full rounded-sm border-border/80",
              "text-[12px] font-medium tracking-[0.12em] uppercase",
              "transition-colors duration-300",
              "hover:border-foreground/20 hover:bg-muted/40",
            )}
          >
            <Link href={href}>View Product</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
