export type GuestOrderLineItem = {
  name: string;
  quantity: number;
  total: string;
  imageSrc?: string;
};

export type GuestOrderViewModel = {
  id: number;
  number: string;
  status: string;
  statusLabel: string;
  dateCreated: string;
  currency: string;
  subtotal: string;
  shippingTotal: string;
  taxTotal: string;
  total: string;
  paymentMethodTitle: string;
  paymentUrl?: string;
  billingName: string;
  shippingSummary: string;
  lineItems: GuestOrderLineItem[];
};

export type LookupGuestOrderSuccess = {
  success: true;
  order: GuestOrderViewModel;
};

export type LookupGuestOrderFailure = {
  success: false;
  error: string;
};

export type LookupGuestOrderResult =
  | LookupGuestOrderSuccess
  | LookupGuestOrderFailure;
