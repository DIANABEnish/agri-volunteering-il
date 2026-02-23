import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  server: {
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3003',
        changeOrigin: true,
        secure: false,
      },
      '^/image/': {
        target: process.env.VITE_API_URL || 'http://localhost:3003',
        changeOrigin: true,
        secure: false,
      }
    }
  },
});