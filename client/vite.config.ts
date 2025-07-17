import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
   server: {
    port: 3000, // ✅ match your Stripe success_url
  },
});

