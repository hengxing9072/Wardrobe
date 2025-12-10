import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Replace process.env.API_KEY in the code with the actual value from environment
      'process.env.API_KEY': "AIzaSyDviM12dfnKxaI49Qi_JXUCagcnxc_eKlo",
      // Prevents "process is not defined" error in browser
      'process.env': {}
    },
    build: {
      outDir: 'dist',
      sourcemap: true
    }
  };
});
