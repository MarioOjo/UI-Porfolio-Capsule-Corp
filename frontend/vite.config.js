import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-query': ['@tanstack/react-query', '@tanstack/react-query-devtools'],
          'vendor-motion-icons': ['framer-motion', 'react-icons']
        }
      }
    }
  },
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
      },
      // Proxy /env.json to backend so it uses correct environment
      '/env.json': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})