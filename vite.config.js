import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Use dynamic base path for GitHub Pages project sites
  // e.g., https://<owner>.github.io/<repo>/ -> base should be "/<repo>/"
  base: process.env.BASE_PATH || '/',
})
