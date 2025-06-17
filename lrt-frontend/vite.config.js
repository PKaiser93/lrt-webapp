import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import * as path from "node:path";

export default defineConfig({
    plugins: [
        vue(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            'vue': 'vue/dist/vue.esm-bundler.js',
            '@': path.resolve(__dirname, './src')
        }
    },
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:3000', // Hier läuft dein Express-Backend!
                changeOrigin: true
            }
        }
    }
})
