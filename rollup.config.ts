import type { RollupOptions } from 'rollup';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild, { type Options as ESBuildOptions } from 'rollup-plugin-esbuild';
import dts from 'rollup-plugin-dts';

const iifeName = 'SwiperExtraModules';
const input = ['src/index.ts'];

function esbuildMinifer(options: ESBuildOptions) {
  const { renderChunk } = esbuild(options);

  return {
    name: 'esbuild-minifer',
    renderChunk,
  };
}

export default [
  {
    input,
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
  },
  {
    input,
    output: [
      { file: 'dist/types/index.d.cts' },
      { file: 'dist/types/index.d.mts' },
      { file: 'dist/types/index.d.ts' },
    ],
    plugins: [dts()],
  },
] as RollupOptions;
