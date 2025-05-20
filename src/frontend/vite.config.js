import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { stringify } from 'querystring'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@abis': path.resolve(__dirname, '../artifacts/contracts/')
    },
    json: {
      stringify: true 
    }
  }
})
