import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/vite-react-deploy/', // Upewnij się, że jest to ścieżka do twojego repozytorium
})
