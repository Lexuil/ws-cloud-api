import { defineConfig } from 'vite-plus'

export default defineConfig({
  fmt: {
    objectWrap: 'collapse',
    semi: false,
    singleAttributePerLine: true,
    singleQuote: true,
    sortImports: {
      customGroups: [{ elementNamePattern: ['vue'], groupName: 'vue' }],
      groups: [
        'vue',
        'type-import',
        ['value-builtin', 'value-external'],
        'type-internal',
        'value-internal',
        ['type-parent', 'type-sibling', 'type-index'],
        ['value-parent', 'value-sibling', 'value-index'],
        'unknown'
      ]
    },
    trailingComma: 'none'
  },
  lint: {
    categories: { correctness: 'error', perf: 'error', style: 'error', suspicious: 'error' },
    env: { builtin: true },
    options: { typeAware: true, typeCheck: true },
    plugins: ['unicorn', 'typescript', 'oxc', 'import', 'promise', 'vue'],
    rules: {
      'eslint/func-style': ['warn', 'declaration'],
      'id-length': ['error', { checkGeneric: false }],
      'import/no-named-export': 'off',
      'import/no-nodejs-modules': 'off',
      'no-duplicate-imports': ['error', { allowSeparateTypeImports: true }],
      'no-magic-numbers': ['error', { ignoreArrayIndexes: true }],
      'no-ternary': 'off',
      'sort-imports': 'off',
      'unicorn/prefer-string-raw': 'off'
    }
  },
  staged: { '*': 'vp check --fix' }
})
