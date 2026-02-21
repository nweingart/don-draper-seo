import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: ['src/cli.ts'],
    format: ['esm'],
    target: 'node18',
    outDir: 'dist',
    clean: true,
    external: ['better-sqlite3', 'don-draper-seo'],
    banner: {
      js: '#!/usr/bin/env node',
    },
  },
  {
    entry: ['src/server/index.ts'],
    format: ['esm'],
    target: 'node18',
    outDir: 'dist/server',
    clean: false,
    external: ['better-sqlite3', 'don-draper-seo'],
  },
])
