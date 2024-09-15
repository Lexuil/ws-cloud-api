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
      { text: 'Docs', link: '/getting-started' },
      { text: 'Playground', link: 'https://lexuil.github.io/ws-cloud-api' }
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
          { text: 'Text', link: '/messaging/text' },
          { text: 'Image (URL)', link: '/messaging/image' },
          { text: 'Video (URL)', link: '/messaging/video' },
          { text: 'Document (URL)', link: '/messaging/document' },
          { text: 'Audio (URL)', link: '/messaging/audio' },
          { text: 'File (Blob)', link: '/messaging/file' },
          { text: 'CTA button', link: '/messaging/cta' },
          { text: 'Buttons', link: '/messaging/buttons' },
          { text: 'List', link: '/messaging/list' },
          { text: 'Flow', link: '/messaging/flow' }
        ]
      },
      {
        text: 'Templates',
        items: [
          { text: 'Text', link: '/templates/text' }
        ]
      },
      {
        text: 'Media',
        items: [
          { text: 'Upload', link: '/media/upload' },
          { text: 'Get URL', link: '/media/get-url' },
          { text: 'Get Blob', link: '/media/get-blob' }
        ]
      },
      {
        text: 'Webhook',
        items: [
          { text: 'Verification', link: '/webhook/verification' },
          { text: 'Messages', link: '/webhook/messages' }
        ]
      },
      {
        text: 'Limitations',
        items: [
          { text: 'Media', link: '/limitations/media' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Lexuil/ws-cloud-api' }
    ],

    logo: '/logo.svg'
  }
})
