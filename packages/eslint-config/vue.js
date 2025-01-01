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
      'src/components/ui/**/*',
      'src/lib/utils.ts'
    ]
  },
  ...pluginVue.configs['flat/recommended'],
  ...baseConfig
]