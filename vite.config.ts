import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // loadEnv loads from .env files
  const env = loadEnv(mode, '.', '');
  
  // Prioritize env file, then system env (Vercel), then empty string
  const apiKey = env.API_KEY || process.env.API_KEY;

  return {
    plugins: [react()],
    define: {
      // Expose the API_KEY to the client-side code securely
      'process.env.API_KEY': JSON.stringify(apiKey)
    }
  };
});