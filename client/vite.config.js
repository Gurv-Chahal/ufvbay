import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],                 // automatic JSX runtime
  resolve: {
    dedupe: ['react', 'react-dom'],   // guarantee single React across chunks
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime'],
    force: true,                      // rebuild the dep bundle
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      // TEMP: bundle everything together to rule out chunk/caching issues
      output: { inlineDynamicImports: true },
    },
  },
  server: {
    port: 3000,
    strictPort: true,
    proxy: { '/bay': { target: 'http://localhost:8080', changeOrigin: true, secure: false } },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
})
