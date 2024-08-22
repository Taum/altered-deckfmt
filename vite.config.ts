// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react({tsDecorators: true})],
  // esbuild: false,
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'AlteredDeckfmt',
      // the proper extensions will be added
      fileName: 'altered-deckfmt',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['react'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'React',
        },
      },
    },
  },
});
