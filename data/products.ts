export type Product = {
  id: string;
  name: string;
  tag: string;
  category: string;
  priceLabel: string;
  tone: string;
  image: string;
  description: string;
  sizes: string[];
  colors: string[];
};

export const products: Product[] = [
  {
    id: "01",
    name: "SNC / STRUCTURE HOODIE",
    tag: "OBJECT 001",
    category: "HEAVYWEIGHT HOODIE",
    priceLabel: "PRICE TBC",
    tone: "hoodie",
    image: "/products/hoodie.svg",
    description: "A considered everyday layer. Heavyweight proportions, restrained branding and a clean silhouette.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Washed Grey"],
  },
  {
    id: "02",
    name: "SNC / CORE TEE",
    tag: "OBJECT 002",
    category: "ESSENTIAL T-SHIRT",
    priceLabel: "PRICE TBC",
    tone: "tee",
    image: "/products/tee.svg",
    description: "The foundation piece. An understated cut designed to move between everyday settings.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Off-white"],
  },
  {
    id: "03",
    name: "SNC / AFTER HOURS CAP",
    tag: "OBJECT 003",
    category: "SIX-PANEL CAP",
    priceLabel: "PRICE TBC",
    tone: "cap",
    image: "/products/cap.svg",
    description: "A low-profile finishing piece with a minimal SNC identity.",
    sizes: ["ONE SIZE"],
    colors: ["Black", "Charcoal"],
  },
];