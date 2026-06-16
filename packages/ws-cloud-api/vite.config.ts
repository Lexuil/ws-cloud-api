import { defineConfig } from 'vite-plus'
import { defineConfig as definePackConfig } from 'vite-plus/pack'

export default defineConfig({
  pack: definePackConfig({
    dts: { tsgo: true },
    entry: ['src/index.ts'],
    exports: true,
    format: ['cjs', 'esm'],
    ignoreWatch: ['src/__tests__/**']
  }),
  run: {
    tasks: {
      dev: { command: 'vp pack --watch' },
      lint: { command: 'vp lint' },
      pack: { command: 'vp pack' },
      test: { command: 'vp test' },
      typecheck: { command: 'tsgo --noEmit' }
    }
  }
})
