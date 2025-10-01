// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],               // automatic JSX runtime
  resolve: {
    dedupe: ['react', 'react-dom'], // guarantee single React across chunks
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime'], // ensure correct prebundle
    force: true,                  // rebuild the dep bundle
  },
  build: {
    sourcemap: true,

    // TEMP: disable code-splitting to prove it's a chunk/caching issue
    rollupOptions: {
      output: {
        inlineDynamicImports: true, // packs lazy chunks into one file
      },
    },
  },
  server: {
    port: 3000,
    strictPort: true,
    proxy: { '/bay': { target: 'http://localhost:8080', changeOrigin: true, secure: false } },
  },
})
