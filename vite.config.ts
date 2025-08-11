import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy para la API Business
      '/api/business': {
        target: 'http://127.0.0.1:37447',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/business/, '/api/business')
      },
      // Proxy para la API de Auth
      '/api/auth': {
        target: 'http://127.0.0.1:3333',
        changeOrigin: true,
        secure: false,
      },
      // Proxy para auth endpoints sin /api
      '/auth': {
        target: 'http://127.0.0.1:3333',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
