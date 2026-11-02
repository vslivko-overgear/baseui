import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: { include: ['tests/**/*.test.{js,jsx}', 'overgear/tests/**/*.test.{mjs,jsx}'], environment: 'jsdom', setupFiles: ['tests/setup.js'], testTimeout: 20000 },
  esbuild: { jsx: 'automatic' },
});
