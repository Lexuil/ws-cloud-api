import animate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export const darkMode = ['class']
export const safelist = ['dark']
export const prefix = ''
export const content = [
  './pages/**/*.{ts,tsx,vue}',
  './components/**/*.{ts,tsx,vue}',
  './app/**/*.{ts,tsx,vue}',
  './src/**/*.{ts,tsx,vue}'
]
export const theme = {
  container: { center: true, padding: '2rem', screens: { '2xl': '1400px' } },
  extend: {
    animation: {
      'accordion-down': 'accordion-down 0.2s ease-out',
      'accordion-up': 'accordion-up 0.2s ease-out',
      'collapsible-down': 'collapsible-down 0.2s ease-in-out',
      'collapsible-up': 'collapsible-up 0.2s ease-in-out'
    },
    borderRadius: {
      lg: 'var(--radius)',
      md: 'calc(var(--radius) - 2px)',
      sm: 'calc(var(--radius) - 4px)',
      xl: 'calc(var(--radius) + 4px)'
    },
    colors: {
      accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
      background: 'hsl(var(--background))',
      border: 'hsl(var(--border))',
      'box-background': 'var(--box-background)',
      'box-text': 'var(--box-text)',
      card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
      destructive: {
        DEFAULT: 'hsl(var(--destructive))',
        foreground: 'hsl(var(--destructive-foreground))'
      },
      disabled: 'var(--disabled)',
      error: 'var(--error)',
      foreground: 'hsl(var(--foreground))',
      input: 'hsl(var(--input))',
      muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
      popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
      primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
      ring: 'hsl(var(--ring))',
      secondary: {
        DEFAULT: 'hsl(var(--secondary))',
        foreground: 'hsl(var(--secondary-foreground))'
      },
      'sub-background': 'var(--sub-background)',
      'ws-avatar': 'var(--ws-avatar)',
      'ws-avatar-bg': 'var(--ws-avatar-bg)',
      'ws-button-bg': 'var(--ws-button-bg)',
      'ws-file-input-bg': 'var(--ws-file-input-bg)',
      'ws-hover': 'var(--ws-hover)',
      'ws-icon': 'var(--ws-icon)',
      'ws-link': 'var(--ws-link)',
      'ws-list-bg': 'var(--ws-list-bg)',
      'ws-list-description': 'var(--ws-list-description)',
      'ws-list-header': 'var(--ws-list-header)',
      'ws-list-hover': 'var(--ws-list-hover)',
      'ws-list-title': 'var(--ws-list-title)',
      'ws-message-bg': 'var(--ws-message-bg)',
      'ws-mute': 'var(--ws-mute)',
      'ws-time': 'var(--ws-time)',
      'ws-ui-bg': 'var(--ws-ui-bg)',
      'ws-ui-text': 'var(--ws-ui-text)'
    },
    keyframes: {
      'accordion-down': {
        from: { height: 0 },
        to: { height: 'var(--radix-accordion-content-height)' }
      },
      'accordion-up': {
        from: { height: 'var(--radix-accordion-content-height)' },
        to: { height: 0 }
      },
      'collapsible-down': {
        from: { height: 0 },
        to: { height: 'var(--radix-collapsible-content-height)' }
      },
      'collapsible-up': {
        from: { height: 'var(--radix-collapsible-content-height)' },
        to: { height: 0 }
      }
    }
  }
}
export const plugins = [animate]
