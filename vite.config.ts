import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // Ensure this matches your GitHub repo name exactly
    base: '/ai-project-web/', 
    plugins: [
      react(),
      tailwindcss(),
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        // Changing '@' to point to 'src' is standard practice, 
        // but '.' works if your components are in the root.
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      // Useful for certain CI/CD environments
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
