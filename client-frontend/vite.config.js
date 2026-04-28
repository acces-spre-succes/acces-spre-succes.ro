import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // CRA allowed JSX in .js files; keep that working without renaming everything.
      include: '**/*.{jsx,js}',
    }),
  ],
  server: {
    port: 3000,
    host: true,
  },
  build: {
    // Match the existing Dockerfile/nginx setup which copies /app/build.
    outDir: 'build',
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[jt]sx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' },
    },
  },
});
