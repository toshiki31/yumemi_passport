// eslint.config.js
export default {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'react'],
  rules: {},
  overrides: [
    {
      files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
      excludedFiles: ['node_modules/**'],
    },
  ],
  ignorePatterns: ['node_modules/', '.gitignore'],
  settings: {
    react: {
      version: 'detect',
    },
  },
}
