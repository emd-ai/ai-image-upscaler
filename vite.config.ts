import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {}
  },
  server: {
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: true,
    },
  },
})