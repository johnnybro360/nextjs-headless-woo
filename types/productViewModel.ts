export type ProductBadge = {
  label: string;
  icon: "flame" | "leaf" | "clock";
};

export type ProductAttributeViewModel = {
  id: number;
  name: string;
  visible: boolean;
  variation: boolean;
  options: string[];
};

  
export type ProductCategory = {
  id: number;
  name: string;
  slug: string;
};

export type ProductTag = {
  id: number;
  name: string;
  slug: string;
};

export type ProductBrand = {
  id: number;
  name: string;
  slug: string;
};

export type ProductVariationAttributeViewModel = {
  id: number;
  name: string;
  option: string;
};

export type ProductVariationViewModel = {
  id: number;

  sku: string;

  price: number;
  regularPrice?: number;
  salePrice?: number;

  onSale: boolean;

  stockStatus: "instock" | "outofstock" | "onbackorder";
  stockQuantity?: number;

  image?: string;

  attributes: ProductVariationAttributeViewModel[];
};

export type ProductViewModel = {
  id: number;

  sku: string;
  slug: string;
  dateCreated: string;

  type: "simple" | "variable";

  name: string;
  fullName: string;
  size: string;

  origin: string;

  description: string;
  longDescription: string;

  price: number;
  compareAtPrice?: number;
  salePrice?: number;
  onSale: boolean;

  imageSrc: string;
  images: string[];

  heat: string;

  badges: ProductBadge[];

  inStock: boolean;
  stockCount: number;

  tags: ProductTag[];

  category: ProductCategory[];

  brand: ProductBrand[];

  details: string;
  ingredients: string;
  shipping: string;

  attributes: ProductAttributeViewModel[];

  related_ids: number[];

  variations: number[];
};
