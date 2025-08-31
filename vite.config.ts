import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default {
  server: {
    host: '::',
    port: 3000,
    https: false,
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react'],
        },
      },
    },
  },
}
