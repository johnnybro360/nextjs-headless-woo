/** Static cart data for storefront UI — no backend integration */

export type MockCartLineItem = {
  id: string;
  slug: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  imageSrc: string;
};

export const mockCartItems: MockCartLineItem[] = [
  {
    id: "1",
    slug: "ember-oak",
    name: "Ember & Oak Smoked Cascabel",
    size: "150ml",
    price: 28,
    quantity: 1,
    imageSrc: "/images/chilli-sauce.jpg",
  },
  {
    id: "2",
    slug: "ghost-whisper",
    name: "Ghost Whisper Bhut Jolokia",
    size: "100ml",
    price: 34,
    quantity: 1,
    imageSrc: "/images/chilli-sauce.jpg",
  },
  {
    id: "3",
    slug: "chipotle-reserve",
    name: "Chipotle Reserve Mesquite",
    size: "150ml",
    price: 26,
    quantity: 2,
    imageSrc: "/images/chilli-sauce.jpg",
  },
];

export const FREE_SHIPPING_THRESHOLD = 50;
