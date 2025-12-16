import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const apiKey = env.API_KEY || process.env.API_KEY;

  return {
    plugins: [react()],
    define: {
      // Expose the API_KEY to the client-side code securely.
      // Default to empty string to ensure the code compiles to "const apiKey = '';" rather than relying on global process.
      'process.env.API_KEY': JSON.stringify(apiKey || '')
    }
  };
});