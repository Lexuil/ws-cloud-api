import { defineConfig } from 'vite-plus'

export default defineConfig({
  run: {
    tasks: {
      build: { command: 'vitepress build' },
      dev: { command: 'vitepress dev' },
      preview: { command: 'vitepress preview' }
    }
  }
})
