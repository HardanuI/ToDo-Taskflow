import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // Memaksa Vite hanya menggunakan satu versi React
    dedupe: ['react', 'react-dom']
  }
})