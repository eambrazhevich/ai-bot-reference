# Tiny Shop

A small web shop: a product grid with categories, search, sorting and pages, and a cart with promo codes
and free shipping from $50.

```sh
corepack enable
yarn install
yarn start          # http://localhost:3000
yarn test           # vitest
yarn lint           # eslint
yarn check-types    # tsc
```

## Layout

```
src/catalog.ts    products, categories, search, pages
src/cart.ts       cart in memory, promo codes, shipping
src/money.ts      price formatting
src/server.ts     HTTP server and JSON API
public/           the page (plain JS, no build)
migrations/       schema for a future database (not used yet)
test/             unit tests
```
