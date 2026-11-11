import { describe, expect, it } from "vitest";
import { Cart, SHIPPING_PRICE } from "../src/cart.ts";

describe("Cart", () => {
  it("adds products and accumulates quantity", () => {
    const cart = new Cart();
    cart.add("p1");
    cart.add("p1", 2);
    expect(cart.items()).toHaveLength(1);
    expect(cart.items()[0].quantity).toBe(3);
    expect(cart.count()).toBe(3);
  });

  it("rejects unknown products and bad quantities", () => {
    const cart = new Cart();
    expect(() => cart.add("nope")).toThrow(/unknown product/);
    expect(() => cart.add("p1", 0)).toThrow(/positive integer/);
  });

  it("removes products", () => {
    const cart = new Cart();
    cart.add("p1");
    cart.add("p2");
    cart.remove("p1");
    expect(cart.items().map((l) => l.product.id)).toEqual(["p2"]);
  });

  it("changes quantity", () => {
    const cart = new Cart();
    cart.add("p5");
    cart.setQuantity("p5", 4);
    expect(cart.items()[0].quantity).toBe(4);
  });

  it("removes the line when quantity is set to 0", () => {
    const cart = new Cart();
    cart.add("p5");
    cart.add("p2");
    cart.setQuantity("p5", 0);
    expect(cart.items().map((l) => l.product.id)).toEqual(["p2"]);
  });

  it("charges shipping on small orders and not on large ones", () => {
    const cart = new Cart();
    expect(cart.summary().shipping).toBe(0);
    cart.add("p5", 2);
    expect(cart.summary()).toEqual({ subtotal: 28, discount: 0, shipping: SHIPPING_PRICE, total: 28 + SHIPPING_PRICE });
    cart.add("p8");
    expect(cart.summary().shipping).toBe(0);
  });

  it("accepts known promo codes in any case", () => {
    const cart = new Cart();
    expect(cart.applyPromo(" save10 ").code).toBe("SAVE10");
    expect(cart.promoCode()).toBe("SAVE10");
    expect(() => cart.applyPromo("FREE")).toThrow(/unknown promo/);
  });
});
