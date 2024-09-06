import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Ws Cloud API",
  description: "WhatsApp Cloud API for NodeJS",
  srcDir: './src',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/getting-started' }
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'What is ws-cloud-api?', link: '/what-is' },
          { text: 'Getting Stated', link: '/getting-started' },
          { text: 'Configuration', link: '/config' }
        ]
      },
      {
        text: 'Messaging',
        items: [
          { text: 'Text', link: '/' },
          { text: 'Image (URL)', link: '/' },
          { text: 'Video (URL)', link: '/' },
          { text: 'Document (URL)', link: '/' },
          { text: 'Audio (URL)', link: '/' },
          { text: 'File (Blob)', link: '/' },
          { text: 'CTA button', link: '/' },
          { text: 'Buttons', link: '/' },
          { text: 'List', link: '/' },
          { text: 'Flow', link: '/' }
        ]
      },
      {
        text: 'Templates',
        items: [
          { text: 'Text', link: '/' }
        ]
      },
      {
        text: 'Media',
        items: [
          { text: 'Upload', link: '/' },
          { text: 'Get URL', link: '/' },
          { text: 'Get Blob', link: '/' }
        ]
      },
      {
        text: 'Webhook',
        items: [
          { text: 'Text', link: '/' },
          { text: 'Voice audio', link: '/' },
          { text: 'Flow', link: '/' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Lexuil/ws-cloud-api' }
    ],

    logo: '/logo.svg'
  }
})
