import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { stringify } from 'querystring'
import nodePolyfills from 'rollup-plugin-node-polyfills';
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['buffer']
  },
  resolve: {
    alias: {
      '@abis': path.resolve(__dirname, '../artifacts/contracts/'),
      buffer: 'buffer'  
    },
    json: {
      stringify: true 
    }
  },
  build: {
    rollupOptions: {
      plugins: [nodePolyfills()]
    }
  }
})
