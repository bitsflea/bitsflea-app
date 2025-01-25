import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    alias: {
      buffer: 'buffer',
    },
  },
  define: {
    global: 'globalThis',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://beta.api.nuls.io/jsonrpc/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // 移除 /api 前缀
      },
    },
  }
});
