import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/grade3/',
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  plugins: [
    react()
  ],
})
