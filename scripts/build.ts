import { execSync as exec } from 'node:child_process';
import process from 'node:process';
import consola from 'consola';

const watch = process.argv.includes('--watch');

async function build() {
  consola.info('Clean up');
  exec('rimraf dist');

  consola.info('Rollup');
  exec(`rollup --config=rollup.config.ts --configPlugin=rollup-plugin-esbuild ${watch ? '--watch' : ''}`, { stdio: 'inherit' });
}

build();
