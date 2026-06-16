import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

function resolveAlias(target: string) {
  return resolve(fileURLToPath(new URL('.', import.meta.url)), target)
}

export default defineConfig({
  resolve: { alias: { '@': resolveAlias('src') } },
  test: {
    projects: [
      {
        resolve: { alias: { '@': resolveAlias('src') } },
        test: { environment: 'node', include: ['src/__tests__/unit/**/*.test.ts'], name: 'unit' }
      },
      {
        resolve: { alias: { '@': resolveAlias('src') } },
        test: {
          environment: 'node',
          include: ['src/__tests__/integration/**/*.test.ts'],
          name: 'integration',
          setupFiles: ['src/__tests__/integration/setup.ts']
        }
      }
    ]
  }
})
