import { describe, expect, it } from "vitest";
import { formatPrice } from "../src/money.ts";

describe("formatPrice", () => {
  it("always shows two decimals", () => {
    expect(formatPrice(12.5)).toBe("$12.50");
    expect(formatPrice(32)).toBe("$32.00");
  });

  it("rounds float noise", () => {
    expect(formatPrice(37.980000000000004)).toBe("$37.98");
  });
});
