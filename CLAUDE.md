# Tiny Shop — rules for Claude

- TypeScript on Node 24, run with `tsx`; no build step. The page in `public/` is plain browser JS.
- Before finishing, run `yarn test`, `yarn lint` and `yarn check-types`; all three must pass.
- A bug fix comes with a test in `test/` that fails before the fix, when the code is testable without a browser.
- Prices are stored in dollars as numbers; show them with `formatPrice` from `src/money.ts`.
- Do not edit `migrations/`: schema changes are made by people.
- Keep changes small; no new dependencies.
