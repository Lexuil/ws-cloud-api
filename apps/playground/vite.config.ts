import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite-plus'

export default defineConfig({
  define: { 'process.env': {} },
  plugins: [vue(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, './src/') } },
  run: {
    tasks: {
      build: { command: 'vp build' },
      dev: { command: 'vp dev' },
      typecheck: { command: 'vue-tsc --noEmit' }
    }
  }
})
