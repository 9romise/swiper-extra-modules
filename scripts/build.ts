import { execSync as exec } from 'node:child_process';
import process from 'node:process';
import consola from 'consola';

const watch = process.argv.includes('--watch');

async function build() {
  consola.info('Clean up');
  exec('rimraf dist');

  consola.info('Rollup');
  exec(`npm run rollup ${watch ? '-- --watch' : ''}`, { stdio: 'inherit' });
}

build();
