// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      // ⬅️ force classic transform everywhere (no jsx/jsxs in output)
      jsxRuntime: 'classic'
    })
  ],
  resolve: { dedupe: ['react', 'react-dom'] },
  optimizeDeps: {
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
