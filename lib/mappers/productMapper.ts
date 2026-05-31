import { ProductViewModel, ProductAttributeViewModel, ProductVariationViewModel } from "@/types/productViewModel";
import {
  WooProduct,
  ProductAttribute as WooProductAttribute,
} from "@/types/wooProduct";

import { WooProductVariation } from "@/types/wooProductVariation";
import he from 'he';    // html entity decoder


export enum HeatLevel {
    Mild = 1,
    Medium = 2,
    Hot = 3,
    Extreme = 4,
  }

export function mapWooProduct(product: WooProduct): ProductViewModel {
  return {
    id: product.id,

    sku: product.sku,
    slug: product.slug,
    dateCreated: product.date_created,

    type: product.type as "simple" | "variable",

    name: product.name,
    fullName: product.name,

    origin: getAttribute(product.attributes, "Origin") ?? "Unknown",

    description: he.decode(stripHtml(product.short_description || "")),
    longDescription: he.decode(stripHtml(product.description || "")),

    size: extractSize(product.name),
    onSale: product.on_sale,
    price: Number(product.price),
    salePrice: product.on_sale ? Number(product.sale_price) : undefined,
    compareAtPrice: product.on_sale ? Number(product.regular_price) : undefined,

    imageSrc: product.images?.[0]?.src ?? "",

    images:
      product.images?.map((img: { src: string }) => img.src) ?? [],

    heat: getAttribute(product.attributes, "Heat") ?? HeatLevel.Mild.toString(),

    badges: buildBadges(product),

    inStock: product.stock_status === "instock",

    stockCount: product.stock_quantity ?? 0,

    category: product.categories,

    brand: product.brands,

    tags: product.tags,

    details: he.decode(extractSection(product.description, "details")),

    ingredients: he.decode(extractSection(
      product.description,
      "ingredients"
    )),

    shipping: he.decode(extractSection(product.description, "shipping")),

    attributes:
      product.attributes?.map(
        (attribute: WooProductAttribute) => ({
          id: attribute.id,
          name: attribute.name,
          visible: attribute.visible,
          variation: attribute.variation,
          options: attribute.options,
        })
      ) ?? [],

    related_ids: product.related_ids ?? [],

    variations: product.variations ?? [],
  };
}

export function mapWooVariation(
  variation: WooProductVariation
): ProductVariationViewModel {
  return {
    id: variation.id,

    sku: variation.sku,

    price: Number(variation.price || 0),

    regularPrice: variation.regular_price
      ? Number(variation.regular_price)
      : undefined,

    salePrice: variation.sale_price
      ? Number(variation.sale_price)
      : undefined,

    onSale: variation.on_sale,

    stockStatus: variation.stock_status,

    stockQuantity: variation.stock_quantity ?? undefined,

    image: variation.image?.src,

    attributes:
      variation.attributes?.map((attribute) => ({
        id: attribute.id,
        name: attribute.name,
        option: attribute.option,
      })) ?? [],
  };
}


function getAttribute(
    attributes: ProductAttributeViewModel[],
    name: string
  ) {
    const attribute = attributes.find((a) => a.name.toLowerCase() === name.toLowerCase());
    if (!attribute) return undefined;
    return attribute.options[0];
  }

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").trim();
}

// function getMeta(
//   meta: { key: string; value: unknown }[],
//   key: string
// ) {
//   return meta?.find((m) => m.key === key)?.value;
// }

function extractSize(name?: string) {
  if (!name) return "";

  const match = name.match(/\d+\s?(g|kg|ml|l|oz)/i);

  return match ? match[0] : "";
}

function extractSection(
  html: string,
  keyword: string
) {
  if (!html) return "";

  const lower = html.toLowerCase();

  const index = lower.indexOf(
    keyword.toLowerCase()
  );

  if (index === -1) return "";

  const sliced = html.slice(index);

  return stripHtml(sliced);
}

function buildBadges(product: WooProduct) {
  const badges = [];

  if (product.on_sale) {
    badges.push({
      label: "Sale",
      icon: "flame" as const,
    });
  }

  if (product.stock_status === "instock") {
    badges.push({
      label: "In Stock",
      icon: "clock" as const,
    });
  }

  return badges;
}