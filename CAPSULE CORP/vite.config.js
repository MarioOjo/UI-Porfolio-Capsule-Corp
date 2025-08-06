import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [  tailwindcss(),react()],
  server: {
    port: 3000, // You can change this to any available port, e.g., 5175
  },
})