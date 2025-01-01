import baseConfig from './base.js'
import pluginVue from 'eslint-plugin-vue'

/**
 * A custom ESLint configuration for libraries that use Vue 3.
 *
 * @type {import("eslint").Linter.Config}
 * */
export default [
  ...baseConfig,
  ...pluginVue.configs['flat/recommended'],
  {
    ignores: [
      'src/components/ui/**/*',
      'src/lib/utils.ts'
    ],
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser'
      }
    }
  },
]