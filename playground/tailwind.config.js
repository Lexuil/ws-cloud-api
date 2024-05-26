/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,vue}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        background: 'var(--background)',
        accent: 'var(--accent)',
        error: 'var(--error)',
        disabled: 'var(--disabled)',
        'sub-background': 'var(--sub-background)',
        'box-text': 'var(--box-text)',
        'box-background': 'var(--box-background)'
      }
    }
  },
  darkMode: 'selector',
  plugins: []
}
