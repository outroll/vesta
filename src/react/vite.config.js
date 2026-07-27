import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'build',
    assetsDir: 'static',
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:8083',
        secure: false,
        changeOrigin: true,
      },
      '/file_manager': {
        target: 'https://localhost:8083',
        secure: false,
        changeOrigin: true,
      },
    },
  },
});
