/**
 * 丧尸围城 · 联机中继服务器（零依赖）
 * ------------------------------------------------------------------
 * 一个进程同时做两件事：
 *   1) 静态托管游戏文件（index.html / game.js / style.css / assets）
 *   2) 在 /ws 上提供 WebSocket 房间中继（房间码 + 消息转发）
 *
 * 启动：  node server/relay.js            # 默认端口 8787
 *         PORT=9000 node server/relay.js
 *
 * 手机联机：电脑和手机连同一个 Wi-Fi，手机浏览器打开启动日志里打印的
 *           http://192.168.x.x:8787 地址即可。
 * 公网联机：把整个项目丢到任意支持 Node 的服务器（Render / Railway /
 *           阿里云 / 腾讯云 …）执行上面这条命令，或用 Nginx 反代 /ws。
 */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = Number(process.env.PORT) || 8787;
const ROOT = path.join(__dirname, '..');
const MAX_PEERS = 4;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/plain; charset=utf-8'
};

/* ------------------------------------------------------------------ */
/* 静态文件                                                            */
/* ------------------------------------------------------------------ */
const server = http.createServer((req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  let file = path.join(ROOT, url === '/' ? 'index.html' : url);
  if (!file.startsWith(ROOT)) {
    res.writeHead(403).end('forbidden');
    return;
  }
  fs.stat(file, (err, st) => {
    if (err || st.isDirectory()) {
      if (url === '/health') {
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ ok: true, rooms: relay.rooms.size, peers: relay.peers.size }));
        return;
      }
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('404');
      return;
    }
    const type = MIME[path.extname(file).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, {
      'content-type': type,
      'cache-control': 'no-cache',
      'access-control-allow-origin': '*'
    });
    fs.createReadStream(file).pipe(res);
  });
});

/* ------------------------------------------------------------------ */
/* WebSocket 房间中继（共享实现，见 relay-core.js）                     */
/* ------------------------------------------------------------------ */
const { attachRelay } = require('./relay-core');
const relay = attachRelay(server);

function lanAddresses() {
  const out = [];
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === 'IPv4' && !net.internal) out.push(net.address);
    }
  }
  return out;
}

server.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('  丧尸围城 · 联机服务器已启动');
  console.log('  ------------------------------------------');
  console.log(`  本机：   http://localhost:${PORT}`);
  for (const ip of lanAddresses()) console.log(`  局域网： http://${ip}:${PORT}   ← 手机用这个`);
  console.log(`  WebSocket: ws://<地址>:${PORT}/ws`);
  console.log('  ------------------------------------------');
  console.log('  手机与电脑连同一个 Wi-Fi，打开局域网地址即可联机');
  console.log('');
});
