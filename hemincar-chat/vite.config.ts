import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      // This is crucial: it replaces 'process.env.API_KEY' in the code with the actual key value during build
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
    build: {
      outDir: 'dist',
      rollupOptions: {
        output: {
          // This forces the output JavaScript file to be named "index.js"
          entryFileNames: 'assets/index.js',
          // This forces the output CSS file to be named "index.css"
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              return 'assets/index.css';
            }
            return 'assets/[name]-[hash][extname]';
          },
        },
      },
    },
  };
});
