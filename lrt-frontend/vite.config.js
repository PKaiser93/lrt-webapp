import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import * as path from 'node:path';

export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.esm-bundler.js',
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    emptyOutDir: true,
  },
});
