/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  ignorePatterns: ['dist/**'],
  overrides: [
    {
      files: ['*.spec.ts'],
      env: {
        mocha: true,
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  root: true,
};
