import baseConfig from './base.js'
import pluginVue from 'eslint-plugin-vue'

/**
 * A custom ESLint configuration for libraries that use Vue 3.
 *
 * @type {import("eslint").Linter.Config}
 * */
export default [
  {
    ignores: [
      'dist/**/*',
      '*.config.{js,cjs,mjs}', // FIXME: Remove this line
      'src/components/ui/**/*', // FIXME: Remove this line
      'src/lib/utils.ts'
    ],
  },
  ...baseConfig,
  ...pluginVue.configs['flat/recommended'],
  {
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['vue']
      }
    }
  },
]