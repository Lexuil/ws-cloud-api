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
        'box-background': 'var(--box-background)',
        'ws-ui-bg': 'var(--ws-ui-bg)',
        'ws-ui-text': 'var(--ws-ui-text)',
        'ws-mute': 'var(--ws-mute)',
        'ws-avatar': 'var(--ws-avatar)',
        'ws-avatar-bg': 'var(--ws-avatar-bg)',
        'ws-icon': 'var(--ws-icon)',
        'ws-file-input-bg': 'var(--ws-file-input-bg)',
        'ws-hover': 'var(--ws-hover)',
        'ws-time': 'var(--ws-time)',
        'ws-link': 'var(--ws-link)',
        'ws-message-bg': 'var(--ws-message-bg)',
        'ws-list-bg': 'var(--ws-list-bg)',
        'ws-list-header': 'var(--ws-list-header)',
        'ws-list-hover': 'var(--ws-list-hover)',
        'ws-list-title': 'var(--ws-list-title)',
        'ws-list-description': 'var(--ws-list-description)'
      }
    }
  },
  darkMode: 'selector',
  plugins: []
}
