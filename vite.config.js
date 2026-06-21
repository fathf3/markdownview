import { defineConfig } from 'vite';

// base: './' -> built assets use relative paths so the same dist/ works
// both on a web server AND when loaded from file:// inside Electron.
export default defineConfig({
  base: './',
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
