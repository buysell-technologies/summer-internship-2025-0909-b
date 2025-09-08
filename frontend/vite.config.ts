import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ['defaults', 'not IE 11'],
      polyfills: true,
      renderLegacyChunks: true,
      modernPolyfills: true,
    }),
  ],
  build: {
    target: 'es2015',
    sourcemap: 'inline',
    cssCodeSplit: false,
    assetsInlineLimit: 100_000_000,
    minify: 'terser',
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        manualChunks: () => 'bundle',
      },
    },
  },
});
