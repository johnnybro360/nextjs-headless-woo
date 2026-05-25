import type { CartItem } from "@/types/cartItem";

export type CheckoutFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
};

export type CreateOrderInput = {
  items: CartItem[];
  customer: CheckoutFormData;
};

export type CreateOrderSuccess = {
  success: true;
  orderId: number;
  orderNumber: string;
  paymentUrl?: string;
  total: string;
};

export type CreateOrderFailure = {
  success: false;
  error: string;
};

export type CreateOrderResult = CreateOrderSuccess | CreateOrderFailure;

export type WooAddress = {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
  phone?: string;
};

export type WooOrderResponse = {
  id: number;
  number: string;
  status: string;
  total: string;
  payment_url?: string;
  order_key: string;
};
