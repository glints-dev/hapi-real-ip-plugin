/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  ignorePatterns: ["dist/**"],
  overrides: [
    {
      files: ["*.spec.ts"],
      env: {
        "jest/globals": true,
      },
      extends: ["plugin:jest/recommended"],
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "jest"],
  root: true,
};
