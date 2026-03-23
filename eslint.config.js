import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      ecmaVersion: 2022,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      sourceType: "module",
    },
    rules: {
      "no-unused-vars": "error",
      "no-console": "off",
      eqeqeq: "error",
      curly: "error",
      semi: ["error", "always"],
      quotes: ["error", "double"],
    },
  },
  {
    ignores: ["dist/", "legacy-a3/", "node_modules/", ".husky/"],
  },
];
