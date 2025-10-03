import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],                         // ← auto runtime
  resolve: { dedupe: ['react', 'react-dom'] },
  build: {
    sourcemap: true,
    minify: 'esbuild',
  },
  // The key part ↓
  esbuild: {
    // prevent variable renaming that turns `React` into `_`
    minifyIdentifiers: false,
    keepNames: true,
  },
})
