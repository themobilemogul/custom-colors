import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // ✅ for local development, Stripe success_url should use this port
  },
  publicDir: 'public', // ✅ ensures _redirects and other static assets are copied
  build: {
    outDir: 'dist', // default, but explicit is better
    emptyOutDir: true,
  },
});
