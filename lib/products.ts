export type ProductBadge = {
  label: string;
  icon: "flame" | "leaf" | "clock";
};

export type ProductSize = {
  label: string;
  price: number;
};

export type Product = {
  slug: string;
  name: string;
  fullName: string;
  origin: string;
  description: string;
  longDescription: string;
  price: number;
  compareAtPrice?: number;
  volume: string;
  sizes: ProductSize[];
  imageSrc: string;
  images: string[];
  heat: string;
  badges: ProductBadge[];
  inStock: boolean;
  stockCount: number;
  category: string;
  categorySlug: string;
  details: string;
  ingredients: string;
  shipping: string;
};

export const products: Product[] = [
  {
    slug: "ember-oak",
    name: "Ember & Oak",
    fullName: "Ember & Oak Smoked Cascabel",
    origin: "Oaxaca, Mexico",
    description:
      "A slow-fermented blend of smoked cascabel and árbol chillies, aged in oak barrels for 90 days.",
    longDescription:
      "A slow-fermented blend of smoked cascabel and árbol chillies, aged in oak barrels for 90 days. Each bottle captures the essence of traditional Oaxacan craftsmanship with a modern, refined finish.",
    price: 28,
    compareAtPrice: 35,
    volume: "150ml",
    sizes: [
      { label: "75ml", price: 18 },
      { label: "150ml", price: 28 },
      { label: "250ml", price: 42 },
    ],
    imageSrc: "/images/chilli-sauce.jpg",
    images: [
      "/images/chilli-sauce.jpg",
      "/images/chilli-sauce.jpg",
      "/images/chilli-sauce.jpg",
      "/images/chilli-sauce.jpg",
    ],
    heat: "Medium Heat",
    badges: [
      { label: "Medium Heat", icon: "flame" },
      { label: "Organic", icon: "leaf" },
      { label: "90 Days Aged", icon: "clock" },
    ],
    inStock: true,
    stockCount: 12,
    category: "Hot Sauces",
    categorySlug: "hot-sauces",
    details:
      "Our signature Ember & Oak sauce begins with hand-selected cascabel and árbol chillies, sourced directly from small family farms in Oaxaca. The chillies are slowly smoked over mesquite wood before being fermented with organic cane vinegar and aged in American oak barrels for a minimum of 90 days.",
    ingredients:
      "Organic cascabel chillies, organic árbol chillies, organic cane vinegar, sea salt, garlic, mesquite smoke. Contains no preservatives or artificial ingredients.",
    shipping:
      "Orders ship within 1-2 business days. Free standard shipping on orders over $50. Express shipping available at checkout. International shipping available to select countries.",
  },
  {
    slug: "ghost-whisper",
    name: "Ghost Whisper",
    fullName: "Ghost Whisper Bhut Jolokia",
    origin: "Assam, India",
    description:
      "Single-origin Bhut Jolokia with hints of tamarind and palm sugar. Not for the faint-hearted.",
    longDescription:
      "Single-origin Bhut Jolokia with hints of tamarind and palm sugar. A complex, searing heat balanced by subtle sweetness — reserved for those who respect the pepper.",
    price: 34,
    volume: "100ml",
    sizes: [
      { label: "50ml", price: 22 },
      { label: "100ml", price: 34 },
      { label: "150ml", price: 48 },
    ],
    imageSrc: "/images/chilli-sauce.jpg",
    images: ["/images/chilli-sauce.jpg", "/images/chilli-sauce.jpg"],
    heat: "Extreme Heat",
    badges: [
      { label: "Extreme Heat", icon: "flame" },
      { label: "Organic", icon: "leaf" },
    ],
    inStock: true,
    stockCount: 8,
    category: "Hot Sauces",
    categorySlug: "hot-sauces",
    details:
      "Bhut Jolokia peppers are harvested at peak ripeness and blended within 48 hours to preserve volatile aromatics. Slow-simmered with tamarind and palm sugar for depth.",
    ingredients:
      "Bhut Jolokia peppers, tamarind, palm sugar, white vinegar, sea salt, garlic.",
    shipping:
      "Orders ship within 1-2 business days. Free standard shipping on orders over $50.",
  },
  {
    slug: "chipotle-reserve",
    name: "Chipotle Reserve",
    fullName: "Chipotle Reserve Mesquite",
    origin: "Jalisco, Mexico",
    description:
      "Mesquite-smoked jalapeños slow-cooked with roasted garlic and aged tequila.",
    longDescription:
      "Mesquite-smoked jalapeños slow-cooked with roasted garlic and aged tequila. Smoky, savory, and endlessly versatile on grilled meats and eggs.",
    price: 26,
    volume: "150ml",
    sizes: [
      { label: "75ml", price: 16 },
      { label: "150ml", price: 26 },
      { label: "250ml", price: 38 },
    ],
    imageSrc: "/images/chilli-sauce.jpg",
    images: ["/images/chilli-sauce.jpg", "/images/chilli-sauce.jpg"],
    heat: "Mild Heat",
    badges: [
      { label: "Mild Heat", icon: "flame" },
      { label: "90 Days Aged", icon: "clock" },
    ],
    inStock: true,
    stockCount: 24,
    category: "Hot Sauces",
    categorySlug: "hot-sauces",
    details:
      "Jalapeños are smoked over mesquite for 12 hours before blending with roasted garlic and a splash of aged tequila from Jalisco.",
    ingredients:
      "Smoked jalapeños, roasted garlic, aged tequila, apple cider vinegar, sea salt.",
    shipping:
      "Orders ship within 1-2 business days. Free standard shipping on orders over $50.",
  },
  {
    slug: "carolina-gold",
    name: "Carolina Gold",
    fullName: "Carolina Gold Reaper Blend",
    origin: "South Carolina, USA",
    description:
      "Carolina Reaper meets mustard and peach for a sweet heat with southern charm.",
    longDescription:
      "Carolina Reaper meets mustard and peach for a sweet heat with southern charm. Bold fruit upfront, serious heat on the finish.",
    price: 32,
    volume: "120ml",
    sizes: [
      { label: "120ml", price: 32 },
      { label: "250ml", price: 52 },
    ],
    imageSrc: "/images/chilli-sauce.jpg",
    images: ["/images/chilli-sauce.jpg"],
    heat: "Hot",
    badges: [
      { label: "Hot", icon: "flame" },
      { label: "Organic", icon: "leaf" },
    ],
    inStock: true,
    stockCount: 15,
    category: "Hot Sauces",
    categorySlug: "hot-sauces",
    details:
      "Carolina Reaper peppers are balanced with stone-ground mustard and ripe peach purée for a uniquely Southern profile.",
    ingredients:
      "Carolina Reaper peppers, peach purée, mustard, vinegar, sea salt, spices.",
    shipping:
      "Orders ship within 1-2 business days. Free standard shipping on orders over $50.",
  },
  {
    slug: "habanero-sunrise",
    name: "Habanero Sunrise",
    fullName: "Habanero Sunrise Tropical",
    origin: "Yucatán, Mexico",
    description:
      "Bright habanero balanced with mango and lime. A tropical kick for seafood and tacos.",
    longDescription:
      "Bright habanero balanced with mango and lime. A tropical kick perfect for seafood, tacos, and ceviche.",
    price: 24,
    volume: "150ml",
    sizes: [
      { label: "75ml", price: 14 },
      { label: "150ml", price: 24 },
      { label: "250ml", price: 36 },
    ],
    imageSrc: "/images/chilli-sauce.jpg",
    images: ["/images/chilli-sauce.jpg"],
    heat: "Medium Heat",
    badges: [
      { label: "Medium Heat", icon: "flame" },
      { label: "Organic", icon: "leaf" },
    ],
    inStock: false,
    stockCount: 0,
    category: "Hot Sauces",
    categorySlug: "hot-sauces",
    details:
      "Sun-ripened habaneros from the Yucatán are blended fresh with mango and key lime for a bright, citrus-forward sauce.",
    ingredients:
      "Habanero peppers, mango, key lime, vinegar, sea salt, garlic.",
    shipping:
      "Orders ship within 1-2 business days. Free standard shipping on orders over $50.",
  },
  {
    slug: "scotch-bonnet-heritage",
    name: "Scotch Bonnet Heritage",
    fullName: "Scotch Bonnet Heritage Jerk",
    origin: "Kingston, Jamaica",
    description:
      "Traditional Jamaican recipe with allspice, thyme, and fiery scotch bonnets.",
    longDescription:
      "Traditional Jamaican recipe with allspice, thyme, and fiery scotch bonnets. The authentic companion to jerk chicken and plantains.",
    price: 29,
    volume: "150ml",
    sizes: [
      { label: "75ml", price: 18 },
      { label: "150ml", price: 29 },
      { label: "250ml", price: 44 },
    ],
    imageSrc: "/images/chilli-sauce.jpg",
    images: ["/images/chilli-sauce.jpg"],
    heat: "Hot",
    badges: [
      { label: "Hot", icon: "flame" },
      { label: "90 Days Aged", icon: "clock" },
    ],
    inStock: true,
    stockCount: 6,
    category: "Hot Sauces",
    categorySlug: "hot-sauces",
    details:
      "Scotch bonnets are fermented with pimento, thyme, and scallions following a family recipe passed down three generations in Kingston.",
    ingredients:
      "Scotch bonnet peppers, allspice, thyme, scallions, vinegar, sea salt.",
    shipping:
      "Orders ship within 1-2 business days. Free standard shipping on orders over $50.",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getAllProductSlugs(): string[] {
  return products.map((p) => p.slug);
}

export function getRelatedProducts(slug: string, limit = 3): Product[] {
  return products.filter((p) => p.slug !== slug).slice(0, limit);
}

export type ProductCardData = Pick<
  Product,
  "slug" | "name" | "origin" | "description" | "price" | "volume" | "imageSrc" | "heat"
>;

export function getProductCardData(): ProductCardData[] {
  return products.map(
    ({ slug, name, origin, description, price, volume, imageSrc, heat }) => ({
      slug,
      name,
      origin,
      description,
      price,
      volume,
      imageSrc,
      heat,
    })
  );
}
