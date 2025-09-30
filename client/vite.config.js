import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,           // fail if 3000 is taken (helps avoid silent port changes)
    proxy: {
      // If your frontend calls `/api/...`, this forwards to Spring Boot :8080
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        // If your Spring endpoints DON'T include the /api prefix, uncomment rewrite:
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // (Optional) if you use Spring WebSocket/STOMP at /ws or similar:
      // '/ws': {
      //   target: 'http://localhost:8080',
      //   ws: true,
      //   changeOrigin: true,
      // },
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
  resolve: {
    alias: {
      global: 'globalThis',
    },
  },
})
