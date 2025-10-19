import { defineConfig } from 'vitest/config'

// Use jsdom so DOM APIs like `document` are available during tests
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{js,jsx,ts,tsx}', 'src/**/__tests__/**/*.test.{js,jsx,ts,tsx}', 'src/**/__tests__/**/*.spec.{js,jsx,ts,tsx}'],
  },
})
