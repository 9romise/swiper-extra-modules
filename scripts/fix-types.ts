import fs from 'node:fs';
import path from 'node:path';

function fixTypes() {
  const __cwd = process.cwd();
  const srcDir = path.resolve(__cwd, 'src');
  const distDir = path.resolve(__cwd, 'dist');
  const typeDirName = 'types';

  fs.cpSync(
    path.resolve(srcDir, typeDirName),
    path.resolve(distDir, typeDirName),
    { recursive: true }
  );
}

fixTypes();
