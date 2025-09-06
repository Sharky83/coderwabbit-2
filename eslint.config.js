import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import reactPlugin from "eslint-plugin-react";
import nextPlugin from "@next/eslint-plugin-next";
import reactHooksPlugin from "eslint-plugin-react-hooks";

export default [
  {
    ignores: [
      "**/.next/**",
      "**/node_modules/**",
      "**/dist/**",
      "**/public/**",
      "**/repo-python-test/**"
    ]
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module"
      }
    },
    plugins: {
  "@typescript-eslint": tsPlugin,
  "import": importPlugin,
  "react": reactPlugin,
  "@next/next": nextPlugin
  , "react-hooks": reactHooksPlugin
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/strict-boolean-expressions": "warn"
  , "import/no-extraneous-dependencies": "error"
  , "react-hooks/rules-of-hooks": "error"
  , "react-hooks/exhaustive-deps": "warn"
  , "@next/next/no-html-link-for-pages": "off"
    }
  }
];
