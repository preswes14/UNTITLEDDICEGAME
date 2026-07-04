import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

// The new app lives in src/ and builds to dist/.
// The legacy prototype (index.html + js/ at repo root) is untouched and still
// deploys as-is; at cutover, point GitHub Pages at dist/ instead (see
// docs/briefs/13-parity-cutover-and-bug-ledger.md).
export default defineConfig({
  root: 'src',
  base: './',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@engine': fileURLToPath(new URL('./src/engine', import.meta.url)),
      '@content': fileURLToPath(new URL('./src/content', import.meta.url)),
      '@net': fileURLToPath(new URL('./src/net', import.meta.url)),
      '@app': fileURLToPath(new URL('./src/app', import.meta.url)),
      '@ui': fileURLToPath(new URL('./src/ui', import.meta.url)),
    },
  },
  test: {
    include: ['**/*.test.ts'],
  },
});
