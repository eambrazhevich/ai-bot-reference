import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["node_modules/", "dist/", ".yarn/"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { files: ["public/**/*.js"], languageOptions: { globals: globals.browser } },
  { files: ["src/**/*.ts", "test/**/*.ts", "*.js"], languageOptions: { globals: globals.node } },
);
