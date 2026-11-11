import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { categoryCounts, filterProducts, paginate, type Product } from "./catalog.ts";
import { Cart } from "./cart.ts";
import { formatPrice } from "./money.ts";

const PUBLIC = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public");
const PAGE_SIZE = 6;
const TYPES: Record<string, string> = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };

const cart = new Cart();
let nextOrder = 1042;

function json(res: http.ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
}

function productView(p: Product) {
  return { id: p.id, name: p.name, category: p.category, emoji: p.emoji, featured: Boolean(p.featured), price: formatPrice(p.price) };
}

function cartView() {
  const s = cart.summary();
  return {
    items: cart.items().map((l) => ({
      ...productView(l.product),
      quantity: l.quantity,
      lineTotal: formatPrice(l.product.price * l.quantity),
    })),
    count: cart.count(),
    promo: cart.promoCode(),
    subtotal: formatPrice(s.subtotal),
    discount: formatPrice(s.discount),
    shipping: s.shipping === 0 ? "Free" : formatPrice(s.shipping),
    total: formatPrice(s.total),
  };
}

function sortProducts(items: ReturnType<typeof productView>[], sort: string) {
  if (sort === "name") return items.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "price") return items.sort((a, b) => (a.price < b.price ? -1 : a.price > b.price ? 1 : 0));
  return items.sort((a, b) => Number(b.featured) - Number(a.featured));
}

async function readBody(req: http.IncomingMessage): Promise<Record<string, unknown>> {
  let data = "";
  for await (const chunk of req) data += chunk;
  return data ? JSON.parse(data) : {};
}

async function api(req: http.IncomingMessage, url: URL): Promise<unknown> {
  const route = `${req.method} ${url.pathname}`;
  if (route === "GET /api/categories") return categoryCounts();
  if (route === "GET /api/products") {
    const found = filterProducts({
      query: url.searchParams.get("q") ?? "",
      category: url.searchParams.get("category") ?? "",
    }).map(productView);
    const sorted = sortProducts(found, url.searchParams.get("sort") ?? "featured");
    return paginate(sorted, Number(url.searchParams.get("page") ?? 1), PAGE_SIZE);
  }
  if (route === "GET /api/cart") return cartView();
  if (req.method !== "POST") return undefined;
  const body = await readBody(req);
  switch (url.pathname) {
    case "/api/cart/add":
      cart.add(String(body.id), body.quantity === undefined ? 1 : Number(body.quantity));
      return cartView();
    case "/api/cart/quantity":
      cart.setQuantity(String(body.id), Number(body.quantity));
      return cartView();
    case "/api/cart/remove":
      cart.remove(String(body.id));
      return cartView();
    case "/api/cart/promo":
      cart.applyPromo(String(body.code ?? ""));
      return cartView();
    case "/api/checkout": {
      if (cart.count() === 0) throw new Error("the cart is empty");
      const order = { id: nextOrder++, total: cartView().total };
      cart.clear();
      return order;
    }
  }
  return undefined;
}

export const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  try {
    if (url.pathname.startsWith("/api/")) {
      const result = await api(req, url);
      return result === undefined ? json(res, 404, { error: "not found" }) : json(res, 200, result);
    }
    const file = path.join(PUBLIC, url.pathname === "/" ? "index.html" : url.pathname);
    if (!file.startsWith(PUBLIC) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      return json(res, 404, { error: "not found" });
    }
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] ?? "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  } catch (err) {
    json(res, 400, { error: (err as Error).message });
  }
});

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT ?? 3000);
  server.listen(port, () => console.log(`Tiny Shop on http://localhost:${port}`));
}
