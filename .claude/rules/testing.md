# Testing rules

- Tests are vitest files in `test/`, one file per module (`test/cart.test.ts` for `src/cart.ts`).
- A bug fix comes with a test that fails before the fix. For code in `public/` (no unit tests) say in the PR how to check it in the browser.
- `yarn test`, `yarn lint` and `yarn check-types` must all pass; CI runs the same three.
