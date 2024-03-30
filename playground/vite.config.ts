import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig(({ mode }) => ({
  resolve: {
    alias: {
      'swiper-extra-modules': path.resolve('../dist/'),
    },
  },
}));
