export type WooProductVariation = {
    id: number;
  
    date_created: string;
    date_created_gmt: string;
  
    date_modified: string;
    date_modified_gmt: string;
  
    description: string;
  
    permalink: string;
  
    sku: string;
  
    global_unique_id: string;
  
    price: string;
  
    regular_price: string;
    sale_price: string;
  
    date_on_sale_from: string | null;
    date_on_sale_from_gmt: string | null;
  
    date_on_sale_to: string | null;
    date_on_sale_to_gmt: string | null;
  
    on_sale: boolean;
  
    status: "draft" | "pending" | "private" | "publish";
  
    purchasable: boolean;
  
    virtual: boolean;
  
    downloadable: boolean;
  
    downloads: VariationDownload[];
  
    download_limit: number;
    download_expiry: number;
  
    tax_status: "taxable" | "shipping" | "none";
  
    tax_class: string;
  
    manage_stock: boolean | "parent";
  
    stock_quantity: number | null;
  
    stock_status: "instock" | "outofstock" | "onbackorder";
  
    backorders: "no" | "notify" | "yes";
  
    backorders_allowed: boolean;
  
    backordered: boolean;
  
    weight: string;
  
    dimensions: VariationDimensions;
  
    shipping_class: string;
  
    shipping_class_id: string;
  
    image: VariationImage | null;
  
    attributes: VariationAttribute[];
  
    menu_order: number;
  
    meta_data: VariationMetaData[];
  };
  
  export type VariationDownload = {
    id: string;
    name: string;
    file: string;
  };
  
  export type VariationDimensions = {
    length: string;
    width: string;
    height: string;
  };
  
  export type VariationImage = {
    id: number;
  
    date_created: string;
    date_created_gmt: string;
  
    date_modified: string;
    date_modified_gmt: string;
  
    src: string;
  
    name: string;
  
    alt: string;
  };
  
  export type VariationAttribute = {
    id: number;
    name: string;
    option: string;
  };
  
  export type VariationMetaData = {
    id: number;
    key: string;
    value: string;
  };