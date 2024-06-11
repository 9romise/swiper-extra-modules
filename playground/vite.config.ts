import path from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig(() => ({
  resolve: {
    alias: {
      'swiper-extra-modules': path.resolve('../dist/'),
    },
  },
}))
