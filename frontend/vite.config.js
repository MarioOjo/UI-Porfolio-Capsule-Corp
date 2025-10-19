import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    port: 3000,
    strictPort: true, // Fail if port 3000 is in use instead of trying another port
    proxy: {
      // Proxy /api requests to the backend during development to avoid CORS
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Separate React and React-dom into their own chunk
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) return 'vendor_react';
            if (id.includes('framer-motion')) return 'vendor_framer-motion';
            // Anything else from node_modules goes into a generic vendor chunk
            return 'vendor';
          }

          // Split large route pages into separate chunks
          if (id.includes('/src/pages/Admin')) return 'admin';
          if (id.includes('/src/pages/ProductDetail')) return 'product-detail';
        }
      }
    }
  }
})