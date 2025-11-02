import { gzip } from 'compressing';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, '../../dist');

async function compressFolder(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await compressFolder(fullPath);
    } else {
      const compressedPath = fullPath + '.gz';
      await gzip.compressFile(fullPath, compressedPath);
    }
  }
}

console.log(`🔄 Compressing assets in: ${distPath}`);
await compressFolder(distPath);
console.log('✅ Compression complete.');
