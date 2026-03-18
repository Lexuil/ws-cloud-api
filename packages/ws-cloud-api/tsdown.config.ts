import { defineConfig } from 'vite-plus/pack'

export default defineConfig({ dts: { tsgo: true }, entry: 'src/index.ts', exports: true })
