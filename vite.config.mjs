import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use BASE_PATH to support GitHub Pages deployments at /<repo>/
const base = process.env.BASE_PATH || '/'

export default defineConfig({
  base,
  plugins: [react()],
})

