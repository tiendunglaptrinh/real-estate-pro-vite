import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';

// Lấy __dirname trong ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  // Load tất cả biến env từ .env (bao gồm VITE_*)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@api': path.resolve(__dirname, './src/api'),
        '@animations': path.resolve(__dirname, './src/assets/animations'),
        '@images': path.resolve(__dirname, './src/assets/images'),
        '@backgrounds': path.resolve(__dirname, './src/assets/backgrounds'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@layouts': path.resolve(__dirname, './src/layouts'),
        '@components': path.resolve(__dirname, './src/components'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@middlewares': path.resolve(__dirname, './src/middlewares'),
      },
    },
    server: {
      port: Number(env.VITE_HOST_PORT) || 5173, // Convert sang number + fallback
    },
  };
});
