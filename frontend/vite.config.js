import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
  }
  ,preview: {
    allowedHosts: ['ui-porfolio-capsule-corp-production.up.railway.app']
  }
})