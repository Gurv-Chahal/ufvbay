// vite.config.js / vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

export default defineConfig({
  plugins: [react()],               // ← no jsxRuntime override
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      '/bay': { target: 'http://localhost:8080', changeOrigin: true, secure: false },
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: { global: 'globalThis' },
      plugins: [NodeGlobalsPolyfillPlugin({ buffer: true })],
    },
  },
  resolve: {
    alias: { global: 'globalThis' },
    // prevent duplicate React copies sneaking in
    dedupe: ['react', 'react-dom'],
  },
  build: { sourcemap: true },       // optional: nicer prod stacktraces
})
