import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Exclude the api directory from being processed by Vite
  build: {
    rollupOptions: {
      external: [
        'api/GetInspections/index.ts',
        'api/GenerateReport/index.ts',
        'api/SubmitInspection/index.ts',
        '@azure/functions'
      ]
    }
  },
  // Prevent Vite from trying to resolve API imports during development
  optimizeDeps: {
    exclude: ['@azure/functions']
  }
})