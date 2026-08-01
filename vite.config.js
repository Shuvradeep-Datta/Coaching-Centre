import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Relative paths so the build works on GitHub Pages under any repo name
  // (https://<user>.github.io/<repo>/) without hardcoding the repo name.
  base: './',
  plugins: [react(), tailwindcss()],
})
