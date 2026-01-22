import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Tarea/',   // nombre EXACTO del repo en GitHub
  plugins: [react()],
});
