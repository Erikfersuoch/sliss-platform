import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

// Regole condivise: `_` è un placeholder intenzionale; i catch vuoti sono guardie volute (es. localStorage)
const sharedRules = {
  'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
  'no-empty': ['error', { allowEmptyCatch: true }],
}

export default defineConfig([
  globalIgnores(['dist']),

  // App React — gira nel browser
  {
    files: ['src/**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: sharedRules,
  },

  // Funzioni serverless Vercel — girano in Node
  {
    files: ['api/**/*.js'],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
    rules: sharedRules,
  },

  // Service worker — globali dedicati (self, clients, caches…)
  {
    files: ['public/sw.js'],
    extends: [js.configs.recommended],
    languageOptions: { globals: { ...globals.serviceworker, ...globals.browser } },
    rules: sharedRules,
  },
])
