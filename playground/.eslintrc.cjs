module.exports = {
  root: true,
  extends: [
    'standard-with-typescript',
    'plugin:vue/vue3-recommended'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
    extraFileExtensions: ['.vue'],
    parser: '@typescript-eslint/parser'
  },
  plugins: [
    '@typescript-eslint',
    'vue'
  ],
  rules: {
  }
}
