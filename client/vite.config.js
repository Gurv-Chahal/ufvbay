// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      'react/jsx-runtime': path.resolve(__dirname, 'src/jsx-runtime-fix.js'),
      'react/jsx-dev-runtime': path.resolve(__dirname, 'src/jsx-runtime-fix.js'),
    },
  },
  optimizeDeps: {
    // Do NOT prebundle the original react/jsx-runtime (we want the alias)
    include: ['react', 'react-dom'],
    force: true,
  },
  build: { sourcemap: true },
  server: {
    port: 3000,
    strictPort: true,
    proxy: { '/bay': { target: 'http://localhost:8080', changeOrigin: true, secure: false } },
  },
})
