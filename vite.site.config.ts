// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: 'altered-deckfmt',
  build: {
    outDir: 'demo-site',
  },
});
