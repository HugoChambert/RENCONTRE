import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/RENCONTRE/', // Added for GitHub Pages deployment
  plugins: [react()],
})
