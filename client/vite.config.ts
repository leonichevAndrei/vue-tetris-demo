import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'url';
import dotenv from 'dotenv';

dotenv.config();

console.log('VITE_API_URL:', process.env.VITE_API_URL);
console.log('VITE_API_PORT:', process.env.VITE_API_PORT);

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: `${process.env.VITE_API_URL}:${process.env.VITE_API_PORT}`,
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
});
