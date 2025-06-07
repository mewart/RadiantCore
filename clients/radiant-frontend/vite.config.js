import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0', // Listen on all interfaces (required for Docker/Cloudflare)
    port: 5173,
    allowedHosts: [
      'radiant-core.com',
      'www.radiant-core.com', // Optional: if you want to use www as well
    ],
  },
});
