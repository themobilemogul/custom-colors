import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  appType: 'spa',          // 👈 ensures SPA fallback in preview mode
  plugins: [react()],
  server: {
    port: 3000,
  },
  publicDir: 'public',     // copies _redirects to dist
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
