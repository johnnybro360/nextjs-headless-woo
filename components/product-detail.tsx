"use client";

import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cart-store";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Flame,
  Leaf,
  Clock,
  Truck,
  RotateCcw,
  Check,
  AlertCircle,
  Minus,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { ProductBadge, ProductViewModel } from "@/types/productViewModel";
import { cn } from "@/lib/utils";

const badgeIcons = {
  flame: Flame,
  leaf: Leaf,
  clock: Clock,
} as const;

const tabTriggerClass = cn(
  "group/tab relative flex !flex-none w-full items-center justify-start gap-3 rounded-none border-0 bg-transparent",
  "px-0 py-3.5 text-left",
  "border-l-2 border-transparent pl-4 -ml-px",
  "text-[15px] font-normal leading-snug sm:text-base",
  "text-foreground/28 transition-[color,background-color,border-color] duration-300 ease-out",
  "hover:border-foreground/12 hover:bg-muted/20 hover:text-foreground/62",
  "data-[state=active]:border-primary data-[state=active]:bg-primary/[0.04]",
  "data-[state=active]:font-medium data-[state=active]:text-foreground",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20",
);

const tabIndexClass =
  "text-[11px] font-medium tabular-nums tracking-[0.08em] text-foreground/22 transition-colors duration-300 group-data-[state=active]/tab:text-primary/65";

const tabsContentClass = cn(
  "w-full flex-none outline-none",
  "text-[15px] leading-[1.85] text-muted-foreground sm:text-base",
  "border-t border-border/40 pt-8",
  "md:border-t-0 md:border-l md:border-border/35 md:pt-0 md:pl-10 lg:pl-14",
);

const sectionGap = "mt-12 lg:mt-14";

function ProductBadgeItem({ badge }: { badge: ProductBadge }) {
  const Icon = badgeIcons[badge.icon];
  return (
    <Badge
      variant="outline"
      className="gap-1.5 border-border/80 bg-transparent px-2.5 py-1 text-foreground/80"
    >
      <Icon
        className={cn("size-3", badge.icon === "flame" && "text-primary")}
        strokeWidth={1.5}
      />
      {badge.label}
    </Badge>
  );
}

interface ProductDetailProps {
  product: ProductViewModel;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const addItem = useCartStore((state) => state.addItem);

  const router = useRouter();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      size: product.size,
      quantity: quantity,
      imageSrc: product.imageSrc,
    });

    router.push("/cart");
  };

  const [quantity, setQuantity] = useState(1);

  console.log(product);
  console.log("product.images", product.images);
  console.log("product.badges", product.badges);
  console.log("product.imgSrc", product.imageSrc);
  //   console.log('product.compareAtPrice',product.compareAtPrice);
  //   console.log('product.price',product.price);
  //   console.log('product.inStock',product.inStock);
  //   console.log('product.stockCount',product.stockCount);
  //   console.log('product.size',product.size);
  //   console.log('product.origin',product.origin);
  //   console.log('product.fullName',product.fullName);
  //   console.log('product.description',product.description);
  //   console.log('product.longDescription',product.longDescription);
  //   console.log('product.details',product.details);
  //   console.log('product.ingredients',product.ingredients);
  //   console.log('product.shipping',product.shipping);
  //   console.log('product.attributes',product.attributes);
  //   console.log('product.variations',product.variations);

  const discountPercent =
    product.compareAtPrice &&
    Math.round((1 - product.price / product.compareAtPrice) * 100);

  const displayPrice = product.price;

  return (
    <article className="w-full max-w-7xl mx-auto">
      <Breadcrumb className="mb-10 md:mb-14">
        <BreadcrumbList className="text-[13px] text-muted-foreground">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href="/"
                className="transition-colors duration-300 hover:text-foreground"
              >
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href="/shop"
                className="transition-colors duration-300 hover:text-foreground"
              >
                Shop
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href={`/shop/${product.category[0].slug}`}
                className="transition-colors duration-300 hover:text-foreground"
              >
                {product.category[0].name}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-foreground/55">
              {product.fullName}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 lg:grid-cols-[1.32fr_1fr] gap-12 lg:gap-20 xl:gap-24">
        {/* Image — focal point */}
        <div className="space-y-3 lg:space-y-4">
          <div
            className={cn(
              "relative aspect-4/5 overflow-hidden rounded-sm",
              "bg-muted/20 ring-1 ring-border/60",
              "min-h-24 sm:min-h-28 lg:min-h-34 xl:min-h-38",
            )}
          >
            <Image
              src={product.imageSrc}
              alt={product.fullName}
              fill
              className="object-cover object-center transition-opacity duration-500"
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
              loading="eager"
              unoptimized={true}
            />
          </div>

          {product.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
              {product.images?.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`View image ${i + 1}`}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-sm bg-muted/20 ring-1 transition-all duration-300",
                  )}
                >
                  <Image
                    src={img ?? ""}
                    alt={`${product.name} view ${i + 1}`}
                    fill
                    className="object-cover object-center"
                    sizes="80px"
                    priority
                    loading="eager"
                    unoptimized={true}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product information */}
        <div className="flex flex-col lg:pt-2 lg:pl-2 xl:pl-6">
          <header>
            <p className="text-label">{product.origin}</p>
            <h1
              className={cn(
                "mt-4 font-display text-2.35rem leading-1.06 tracking-0.025em text-balance",
                "sm:text-[2.75rem] lg:text-[3rem] xl:text-[3.25rem]",
              )}
            >
              {product.fullName}
            </h1>
            {product.badges?.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {product.badges?.map((badge) => (
                  <ProductBadgeItem key={badge.label} badge={badge} />
                ))}
              </div>
            )}
          </header>

          {/* Price — clear but subordinate to title */}
          <div
            className={cn(
              sectionGap,
              "border-t border-border/50 pt-10 lg:pt-12",
            )}
          >
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="font-display text-3xl tracking-[0.02em] text-foreground sm:text-4xl">
                ${displayPrice}
              </span>
              <span className="text-sm text-muted-foreground">
                {product.name}
              </span>
            </div>

            {product.compareAtPrice && (
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <span className="text-sm text-muted-foreground line-through">
                  ${product.compareAtPrice}
                </span>
                {discountPercent && (
                  <Badge
                    variant="outline"
                    className="border-primary/25 bg-transparent text-primary"
                  >
                    {discountPercent}% Off
                  </Badge>
                )}
              </div>
            )}

            <p className="mt-4 flex items-center gap-2 text-sm">
              {product.inStock ? (
                <>
                  <Check className="size-3.5 text-success" strokeWidth={1.5} />
                  <span className="text-success">In stock</span>
                  {product.stockCount > 0 && product.stockCount <= 10 && (
                    <span className="text-muted-foreground">
                      · {product.stockCount} remaining
                    </span>
                  )}
                </>
              ) : (
                <>
                  <AlertCircle
                    className="size-3.5 text-destructive"
                    strokeWidth={1.5}
                  />
                  <span className="text-destructive">Out of stock</span>
                </>
              )}
            </p>
          </div>

          {/* Description — light, readable */}
          <p
            className={cn(
              sectionGap,
              "max-w-md text-[15px] leading-[1.9] text-muted-foreground sm:text-base",
            )}
          >
            {product.description}
          </p>

          <div className={sectionGap}>
            <p className="text-label mb-4">Size</p>
            <div className="flex flex-wrap gap-2">
              <span className="block text-sm">{product.size}</span>
              {/* <span className="mt-0.5 block text-xs text-muted-foreground">
                ${product.price}
              </span> */}
            </div>
          </div>

          {/* Add to cart — dominant CTA */}
          <div
            className={cn(
              sectionGap,
              "border-t border-border/50 pt-10 lg:pt-12",
            )}
          >
            <p className="text-label mb-4">Quantity</p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
              <div className="inline-flex h-14 shrink-0 items-stretch rounded-sm border border-border/70">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={!product.inStock}
                  className="flex w-12 items-center justify-center text-muted-foreground transition-colors duration-300 hover:text-foreground disabled:opacity-35"
                  aria-label="Decrease quantity"
                >
                  <Minus className="size-4" strokeWidth={1.25} />
                </button>
                <span className="flex min-w-12 items-center justify-center border-x border-border/70 px-3 text-sm font-medium tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  disabled={!product.inStock}
                  className="flex w-12 items-center justify-center text-muted-foreground transition-colors duration-300 hover:text-foreground disabled:opacity-35"
                  aria-label="Increase quantity"
                >
                  <Plus className="size-4" strokeWidth={1.25} />
                </button>
              </div>

              <Button
                asChild
                size="lg"
                disabled={!product.inStock}
                className={cn(
                  "h-14 w-full flex-1 rounded-sm sm:min-w-0",
                  "text-[13px] font-medium tracking-[0.16em] uppercase",
                  "shadow-none transition-all duration-300",
                  product.inStock && "hover:brightness-[1.04]",
                )}
              >
                {/* <Link href="/cart">
                  {product.inStock ? "Add to Cart" : "Sold Out"}
                </Link> */}

                <button onClick={handleAddToCart} disabled={!product.inStock}>
                  {product.inStock ? "Add to Cart" : "Sold Out"}
                </button>
              </Button>
            </div>
          </div>

          {/* Trust */}
          <ul
            className={cn(
              sectionGap,
              "flex flex-col gap-4 border-t border-border/50 pt-10 text-sm text-muted-foreground sm:flex-row sm:gap-10",
            )}
          >
            <li className="flex items-center gap-3">
              <Truck
                className="size-4 shrink-0 text-foreground/40"
                strokeWidth={1.25}
              />
              Free shipping over $50
            </li>
            <li className="flex items-center gap-3">
              <RotateCcw
                className="size-4 shrink-0 text-foreground/40"
                strokeWidth={1.25}
              />
              30-day returns
            </li>
          </ul>

          {/* Editorial section switcher */}
          <div className={cn(sectionGap, "lg:mt-16")}>
            <p className="text-label mb-8">Product information</p>

            <Tabs
              defaultValue="details"
              orientation="vertical"
              className="flex w-full flex-col gap-8 md:flex-row md:items-start md:gap-x-12 lg:gap-x-16"
            >
              <TabsList
                variant="line"
                className="flex! h-auto w-full shrink-0 flex-col items-stretch gap-0.5 bg-transparent p-0 md:w-48 lg:w-52"
              >
                <TabsTrigger value="details" className={tabTriggerClass}>
                  <span className={tabIndexClass}>01</span>
                  <span>Details</span>
                </TabsTrigger>
                <TabsTrigger value="ingredients" className={tabTriggerClass}>
                  <span className={tabIndexClass}>02</span>
                  <span>Ingredients</span>
                </TabsTrigger>
                <TabsTrigger value="shipping" className={tabTriggerClass}>
                  <span className={tabIndexClass}>03</span>
                  <span>Shipping</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className={tabsContentClass}>
                <p className="max-w-prose">{product.details}</p>
              </TabsContent>
              <TabsContent value="ingredients" className={tabsContentClass}>
                <p className="max-w-prose">{product.ingredients}</p>
              </TabsContent>
              <TabsContent value="shipping" className={tabsContentClass}>
                <p className="max-w-prose">{product.shipping}</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </article>
  );
}
