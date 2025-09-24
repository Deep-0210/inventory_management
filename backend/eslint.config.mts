import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: [
      "node_modules/",
      "dist/",
      "**/*.min.js",
      "build/",
      "swagger-autogen.js",
      "swagger-autogen.ts",
      "swagger-output.json",
      "__test__/",
      "babel.config.js",
      "jest.config.js",
      "NestedMongoQuery.ts"
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js, "typescript-eslint": tseslint },
    extends: [
      "js/recommended",        // Base JavaScript rules
    ],
    languageOptions: {
      globals: {
        ...globals.node, // Use Node.js globals for a Node project
        ...globals.browser, // If you also need browser globals, keep this
      },
      parserOptions: {
        project: "./tsconfig.json", // If you have a tsconfig.json, point to it for type checking
      },
    },
  },
  tseslint.configs.recommended,  // TypeScript-specific ESLint config
]);
