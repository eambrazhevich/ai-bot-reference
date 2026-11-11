import { findProduct, type Product } from "./catalog.ts";

export interface CartLine {
  product: Product;
  quantity: number;
}

export interface Promo {
  code: string;
  percent: number; // discount on the subtotal, in percent
}

export const PROMOS: Promo[] = [
  { code: "SAVE10", percent: 10 },
  { code: "WELCOME20", percent: 20 },
];

/** Shipping is free from this subtotal on, inclusive. */
export const FREE_SHIPPING_FROM = 50;
export const SHIPPING_PRICE = 4.99;

export interface CartSummary {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

export class Cart {
  private lines = new Map<string, CartLine>();
  private promo: Promo | null = null;

  add(productId: string, quantity = 1): void {
    const product = findProduct(productId);
    if (!product) throw new Error(`unknown product ${productId}`);
    if (!Number.isInteger(quantity) || quantity < 1) throw new Error("quantity must be a positive integer");
    const line = this.lines.get(productId);
    if (line) line.quantity += quantity;
    else this.lines.set(productId, { product, quantity });
  }

  setQuantity(productId: string, quantity: number): void {
    const line = this.lines.get(productId);
    if (!line) throw new Error(`product ${productId} is not in the cart`);
    if (!Number.isInteger(quantity) || quantity < 0) throw new Error("quantity must be zero or more");
    line.quantity = quantity;
  }

  remove(productId: string): void {
    this.lines.delete(productId);
  }

  applyPromo(code: string): Promo {
    const promo = PROMOS.find((p) => p.code === code.trim().toUpperCase());
    if (!promo) throw new Error(`unknown promo code ${code}`);
    this.promo = promo;
    return promo;
  }

  promoCode(): string | null {
    return this.promo?.code ?? null;
  }

  clear(): void {
    this.lines.clear();
    this.promo = null;
  }

  items(): CartLine[] {
    return [...this.lines.values()];
  }

  /** Number of items in the cart: the sum of quantities. */
  count(): number {
    return this.items().reduce((n, l) => n + l.quantity, 0);
  }

  summary(): CartSummary {
    const subtotal = this.items().reduce((sum, l) => sum + l.product.price * l.quantity, 0);
    const discount = this.promo ? Math.min(this.promo.percent, subtotal) : 0;
    const shipping = subtotal === 0 || subtotal > FREE_SHIPPING_FROM ? 0 : SHIPPING_PRICE;
    return { subtotal, discount, shipping, total: subtotal - discount + shipping };
  }
}
