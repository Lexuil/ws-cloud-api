import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  esbuild: {
    platform: 'node',
    target: 'node20'
  },
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'MyLib',
      // the proper extensions will be added
      fileName: 'my-lib',
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    }
  }
})