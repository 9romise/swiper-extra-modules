import { defineConfig } from 'tsup';

const name = 'SwiperExtraModules';
/// keep-sorted
export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/index.ts'],
  format: ['cjs', 'esm', 'iife'],
  globalName: name,
  name,
  platform: 'browser',
});
