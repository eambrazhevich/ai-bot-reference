export type CategoryId = "kitchen" | "office" | "home" | "travel";

export interface Category {
  id: CategoryId;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  emoji: string;
  price: number; // dollars
  featured?: boolean;
}

export const CATEGORIES: Category[] = [
  { id: "kitchen", name: "Kitchen" },
  { id: "office", name: "Office" },
  { id: "home", name: "Home" },
  { id: "travel", name: "Travel" },
];

export const PRODUCTS: Product[] = [
  { id: "p1", name: "Coffee Mug", category: "kitchen", emoji: "☕", price: 12.5, featured: true },
  { id: "p2", name: "Notebook", category: "office", emoji: "📓", price: 5.49 },
  { id: "p3", name: "Desk Lamp", category: "office", emoji: "💡", price: 19.99, featured: true },
  { id: "p4", name: "Pencil Set", category: "office", emoji: "✏️", price: 3.2 },
  { id: "p5", name: "Water Bottle", category: "travel", emoji: "🧴", price: 14.0 },
  { id: "p6", name: "Mouse Pad", category: "office", emoji: "🖱️", price: 7.75 },
  { id: "p7", name: "Sticky Notes", category: "office", emoji: "🗒️", price: 2.1 },
  { id: "p8", name: "Headphones", category: "travel", emoji: "🎧", price: 129.9, featured: true },
  { id: "p9", name: "Plant Pot", category: "home", emoji: "🪴", price: 9.3 },
  { id: "p10", name: "Phone Stand", category: "office", emoji: "📱", price: 11.4 },
  { id: "p11", name: "Tote Bag", category: "travel", emoji: "👜", price: 8.8 },
  { id: "p12", name: "Desk Organizer", category: "office", emoji: "🗂️", price: 25.0 },
  { id: "p13", name: "Teapot", category: "kitchen", emoji: "🫖", price: 32.0, featured: true },
  { id: "p14", name: "Scented Candle", category: "home", emoji: "🕯️", price: 16.25 },
  { id: "p15", name: "Wall Clock", category: "home", emoji: "🕰️", price: 44.0 },
  { id: "p16", name: "Travel Pillow", category: "travel", emoji: "🛌", price: 21.6 },
];

export function findProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export interface ProductFilter {
  query?: string;
  category?: string;
}

export function filterProducts(filter: ProductFilter, products: Product[] = PRODUCTS): Product[] {
  const q = (filter.query ?? "").trim().toLowerCase();
  return products.filter(
    (p) => (!q || p.name.toLowerCase().includes(q)) && (!filter.category || p.category === filter.category),
  );
}

export function categoryCounts(products: Product[] = PRODUCTS): Array<Category & { count: number }> {
  return CATEGORIES.map((c) => ({ ...c, count: products.filter((p) => p.category === c.id).length }));
}

export interface Page<T> {
  items: T[];
  page: number;
  pages: number;
  total: number;
}

/** Pages are 1-based. */
export function paginate<T>(items: T[], page: number, size: number): Page<T> {
  const pages = Math.max(1, Math.ceil(items.length / size));
  const current = Math.min(Math.max(1, page), pages);
  const start = (current - 1) * size;
  const end = start + size - 1;
  return { items: items.slice(start, end), page: current, pages, total: items.length };
}
