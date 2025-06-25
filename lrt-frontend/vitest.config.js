// lrt-frontend/vitest.config.js
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    test: {
        globals: true,
        environment: 'jsdom',
        coverage: {
            reporter: ['text', 'html', 'lcov'],
        },
        // Damit Vitest .vue-Dateien auflöst:
        transformMode: {
            web: [/\.[jt]sx?$/],      // bleibt default
            ssr: [/\.(vue)$/],        // zusätzlich .vue im SSR-Modus
        },
    },
});
