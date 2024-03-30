import type { RollupOptions } from 'rollup';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild, { type Options as ESBuildOptions } from 'rollup-plugin-esbuild';

const iifeName = 'SwiperExtraModules';

function esbuildMinifer(options: ESBuildOptions) {
  const { renderChunk } = esbuild(options);

  return {
    name: 'esbuild-minifer',
    renderChunk,
  };
}

export default {
  input: ['src/index.ts'],
  output: [
    {
      file: `dist/index.mjs`,
      format: 'es',
    },
    {
      file: `dist/index.cjs`,
      format: 'cjs',
    },
    {
      file: `dist/index.iife.js`,
      format: 'iife',
      name: iifeName,
      extend: true,
    },
    {
      file: `dist/index.iife.min.js`,
      format: 'iife',
      name: iifeName,
      extend: true,
      plugins: [
        esbuildMinifer({
          minify: true,
        }),
      ],
    },
  ],
  plugins: [nodeResolve(), commonjs(), esbuild({ target: 'es2018' })],
} as RollupOptions;
