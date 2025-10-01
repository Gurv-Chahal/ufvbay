import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

export default defineConfig({
  plugins: [react({
    jsxRuntime: 'classic' // ⬅️ add this
  })],
  server: {
    port: 3000,
    strictPort: true, // keep
    proxy: {
      // Your frontend calls `/bay/...` → forward to Spring Boot :8080
      '/bay': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        // IMPORTANT: no rewrite here, because your backend expects `/bay/...`
        // If you later REMOVE `/bay` from your Spring mappings, then:
        // rewrite: (path) => path.replace(/^\/bay/, ''),
      },

      // (Optional) WebSocket example if you use it later:
      // '/ws': {
      //   target: 'http://localhost:8080',
      //   ws: true,
      //   changeOrigin: true,
      // },
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: { global: 'globalThis' },
      plugins: [
        NodeGlobalsPolyfillPlugin({ buffer: true }),
      ],
    },
  },
  resolve: {
    alias: { global: 'globalThis' },
  },
})
