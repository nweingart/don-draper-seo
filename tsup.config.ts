import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: ['src/cli.ts'],
    format: ['esm'],
    target: 'node18',
    outDir: 'dist',
    clean: true,
    external: ['playwright', 'better-sqlite3'],
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
    external: ['playwright', 'better-sqlite3'],
  },
])
