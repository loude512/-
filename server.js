const http = require('node:http');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const root = __dirname;
const portArg = process.argv.slice(2).find(arg => arg.startsWith('--port='));
const port = Number(portArg ? portArg.slice(7) : process.env.PORT || 5173);
const host = process.env.HOST || '0.0.0.0';

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.md': 'text/plain; charset=utf-8'
};

function lanUrls() {
  const result = [];
  const ifaces = os.networkInterfaces();
  for (const list of Object.values(ifaces)) {
    if (!list) continue;
    for (const info of list) {
      if (info.family === 'IPv4' && !info.internal) result.push(`http://${info.address}:${port}`);
    }
  }
  return result;
}

const server = http.createServer((req, res) => {
  try {
    const url = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
    if (url === '/healthz') {
      res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: true, game: 'zombie-side-scroller', port }));
      return;
    }

    let file = path.join(root, url);
    if (url === '/' || !path.extname(file)) file = path.join(root, 'index.html');

    const safe = path.resolve(file).startsWith(root);
    if (!safe || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    res.writeHead(200, {
      'content-type': types[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'cache-control': 'no-cache',
      'x-content-type-options': 'nosniff'
    });
    fs.createReadStream(file).pipe(res);
  } catch (err) {
    res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('500 Server Error');
  }
});

server.on('error', err => {
  console.error(`服务器启动失败: ${err.message}`);
  if (err.code === 'EADDRINUSE') console.error(`端口 ${port} 已被占用，可改用: PORT=8080 node server.js`);
  process.exit(1);
});

server.listen(port, host, () => {
  console.log('末日横板已启动');
  console.log(`本机网址:   http://127.0.0.1:${port}`);
  for (const url of lanUrls()) console.log(`局域网网址: ${url}`);
  console.log('手机和电脑在同一局域网时，输入上面的局域网网址即可游玩。');
  console.log('按 Ctrl + C 可停止服务器。');
});
