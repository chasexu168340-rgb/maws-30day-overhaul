import { readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const toolDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(toolDir, '..', '..');
const sourceRoot = join(projectRoot, 'maws_src');
const avoidDirs = new Set(['node_modules', 'dist', 'build', '.git', '.vite']);

function collectJsFiles(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (avoidDirs.has(entry)) continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      collectJsFiles(full, out);
    } else if (/\.(mjs|js)$/i.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

function runNode(args, label) {
  const result = spawnSync(process.execPath, args, {
    cwd: projectRoot,
    stdio: 'inherit'
  });
  if (result.status !== 0) {
    throw new Error(`${label} failed with exit code ${result.status}`);
  }
}

const files = collectJsFiles(sourceRoot).sort();
console.log(`[build] checking ${files.length} JavaScript files`);
for (const file of files) {
  console.log(`[build] node --check ${relative(projectRoot, file)}`);
  runNode(['--check', file], `node --check ${relative(projectRoot, file)}`);
}

console.log('[build] verifying assets');
runNode([join(sourceRoot, 'tools', 'verify_assets.mjs')], 'asset verification');

console.log('[build] ok');
