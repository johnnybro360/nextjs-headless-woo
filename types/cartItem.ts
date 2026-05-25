export interface CartItem {
    id: number;
    slug: string;
  
    name: string;
  
    price: number;
  
    quantity: number;

    size: string;
  
    imageSrc: string;
  
    variationId?: number;
  
    attributes?: {
      name: string;
      option: string;
    }[];
  }