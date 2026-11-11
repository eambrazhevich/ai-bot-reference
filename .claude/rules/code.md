# Code rules

- Server code lives in `src/` (TypeScript, run with `tsx`, no build step). The page in `public/` is plain browser JS.
- Money: prices are numbers in dollars inside the server; every price shown to a user goes through `formatPrice` in `src/money.ts`.
- The JSON API in `src/server.ts` returns display strings for prices; the page shows them as they are.
- Keep functions small and pure where possible (`src/catalog.ts`, `src/cart.ts` have no I/O); the server only wires them to HTTP.
- No new dependencies. Do not edit `migrations/`, `package.json` or `yarn.lock`.
