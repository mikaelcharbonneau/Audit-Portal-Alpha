import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom', 'grommet', 'grommet-theme-hpe'],
          'supabase': ['@supabase/supabase-js']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src',
    }
  },
  server: {
    host: true
  }
});