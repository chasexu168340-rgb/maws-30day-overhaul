import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer, get } from 'node:http';
import { extname, isAbsolute, relative, resolve } from 'node:path';
import { spawn } from 'node:child_process';

const ROOT = process.cwd();
const ENTRY = '/maws_30day_overhaul_v3.html';
const TITLE_MARKER = '了不起的武术模拟器';
const DEFAULT_PORT = 5174;

const MIME = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.webp': 'image/webp'
};

function argValue(name, fallback = '') {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] || fallback : fallback;
}

const port = Number(argValue('--port', DEFAULT_PORT));
const shouldOpen = process.argv.includes('--open');
const url = `http://127.0.0.1:${port}${ENTRY}`;

function safePath(urlPath = '/') {
  const decoded = decodeURIComponent(urlPath === '/' ? ENTRY : urlPath);
  const target = resolve(ROOT, `.${decoded}`);
  const rel = relative(ROOT, target);
  if (rel.startsWith('..') || isAbsolute(rel)) return null;
  return target;
}

function openUrl(targetUrl) {
  if (!shouldOpen) return;
  const command = process.platform === 'win32' ? 'cmd' : process.platform === 'darwin' ? 'open' : 'xdg-open';
  const args = process.platform === 'win32' ? ['/c', 'start', '', targetUrl] : [targetUrl];
  const child = spawn(command, args, { detached: true, stdio: 'ignore' });
  child.unref();
}

function existingServerIsMaws(targetUrl) {
  return new Promise((resolveCheck) => {
    const req = get(targetUrl, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        body += chunk;
        if (body.length > 4096) req.destroy();
      });
      res.on('end', () => resolveCheck(body.includes(TITLE_MARKER)));
    });
    req.setTimeout(1200, () => {
      req.destroy();
      resolveCheck(false);
    });
    req.on('error', () => resolveCheck(false));
  });
}

const server = createServer(async (req, res) => {
  const requested = new URL(req.url || '/', 'http://127.0.0.1');
  const target = safePath(requested.pathname);
  if (!target) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  try {
    const info = await stat(target);
    if (!info.isFile()) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    res.writeHead(200, {
      'cache-control': 'no-store',
      'content-type': MIME[extname(target).toLowerCase()] || 'application/octet-stream'
    });
    createReadStream(target).pipe(res);
  } catch {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.on('error', async (error) => {
  if (error.code !== 'EADDRINUSE') throw error;
  if (await existingServerIsMaws(url)) {
    console.log(`MAWS is already running: ${url}`);
    openUrl(url);
    process.exit(0);
  }
  console.error(`Port ${port} is already in use by another app. Stop that process or run with --port <free-port>.`);
  process.exit(1);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`MAWS server: ${url}`);
  openUrl(url);
});
