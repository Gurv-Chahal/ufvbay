// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],                 // automatic JSX runtime
  resolve: { dedupe: ['react', 'react-dom'] },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime'],
    force: true,
  },
  build: { sourcemap: true },
  server: {
    port: 3000,
    strictPort: true,
    proxy: { '/bay': { target: 'http://localhost:8080', changeOrigin: true, secure: false } },
  },
})
