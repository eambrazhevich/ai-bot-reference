import { describe, expect, it } from "vitest";
import { PRODUCTS, categoryCounts, filterProducts, paginate } from "../src/catalog.ts";

describe("filterProducts", () => {
  it("matches names ignoring case", () => {
    expect(filterProducts({ query: "mug" }).map((p) => p.id)).toEqual(["p1"]);
    expect(filterProducts({ query: "NOTE" }).map((p) => p.id)).toEqual(["p2", "p7"]);
  });

  it("filters by category", () => {
    expect(filterProducts({ category: "kitchen" }).map((p) => p.id)).toEqual(["p1", "p13"]);
    expect(filterProducts({ query: "desk", category: "office" }).map((p) => p.id)).toEqual(["p3", "p12"]);
  });

  it("returns everything for an empty filter", () => {
    expect(filterProducts({ query: "  " })).toHaveLength(PRODUCTS.length);
  });
});

describe("categoryCounts", () => {
  it("counts every product once", () => {
    expect(categoryCounts().reduce((n, c) => n + c.count, 0)).toBe(PRODUCTS.length);
  });
});

describe("paginate", () => {
  it("counts pages", () => {
    expect(paginate(PRODUCTS, 1, 6).pages).toBe(3);
    expect(paginate([], 1, 6).pages).toBe(1);
  });

  it("clamps the page number", () => {
    expect(paginate(PRODUCTS, 99, 6).page).toBe(3);
    expect(paginate(PRODUCTS, 0, 6).page).toBe(1);
  });
});
