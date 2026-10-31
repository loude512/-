/**
 * 联机房间中继核心（零依赖）—— 供 server.js 与 server/relay.js 共用
 * ------------------------------------------------------------------
 * 把一个最小 WebSocket 实现（RFC 6455 子集：文本帧 / ping / close）
 * 挂载到任意 http.Server 的 /ws 路径上：
 *   - create / join 房间（5 位房间码，每房最多 4 人）
 *   - 房间内业务消息转发（{t:'msg', from, data}）
 *   - 心跳兜底（30s 清掉半死连接）
 *
 * 用法：
 *   const { attachRelay } = require('./relay-core');
 *   const relay = attachRelay(httpServer); // 返回 { peers, rooms }
 */
'use strict';

const crypto = require('crypto');

const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
const MAX_PEERS = 4;

function encodeFrame(str) {
  const payload = Buffer.from(str, 'utf8');
  const len = payload.length;
  let head;
  if (len < 126) {
    head = Buffer.alloc(2);
    head[1] = len;
  } else if (len < 65536) {
    head = Buffer.alloc(4);
    head[1] = 126;
    head.writeUInt16BE(len, 2);
  } else {
    head = Buffer.alloc(10);
    head[1] = 127;
    head.writeUInt32BE(0, 2);
    head.writeUInt32BE(len, 6);
  }
  head[0] = 0x81; // FIN + text
  return Buffer.concat([head, payload]);
}

function encodePong(payload) {
  const len = payload.length;
  const head = Buffer.alloc(2);
  head[0] = 0x8a;
  head[1] = len;
  return Buffer.concat([head, payload]);
}

function attachRelay(server) {
  const peers = new Map();   // id -> peer
  const rooms = new Map();   // code -> { hostId, members:Set<id>, createdAt }

  let peerSeq = 0;
  const CODE_ALPHABET = 'ACDEFGHJKLMNPQRTUVWXY3479';

  function makeCode() {
    for (let attempt = 0; attempt < 400; attempt++) {
      let code = '';
      const bytes = crypto.randomBytes(5);
      for (let i = 0; i < 5; i++) code += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
      if (!rooms.has(code)) return code;
    }
    return 'R' + Date.now().toString(36).toUpperCase().slice(-4);
  }

  function send(peer, obj) {
    if (!peer || peer.closed) return;
    try {
      peer.socket.write(encodeFrame(JSON.stringify(obj)));
    } catch (err) {
      closePeer(peer, 'write-failed');
    }
  }

  function broadcastRoom(room, obj, exceptId) {
    for (const id of room.members) {
      if (id === exceptId) continue;
      send(peers.get(id), obj);
    }
  }

  function peerList(room) {
    return [...room.members].map(id => {
      const p = peers.get(id);
      return { id, name: p ? p.name : '', host: id === room.hostId };
    });
  }

  function closePeer(peer, reason) {
    if (!peer || peer.closed) return;
    peer.closed = true;
    peers.delete(peer.id);
    try { peer.socket.destroy(); } catch (e) { /* ignore */ }   // 让客户端立刻感知断开，避免半开连接
    const room = peer.room && rooms.get(peer.room);
    if (!room) return;
    room.members.delete(peer.id);
    broadcastRoom(room, { t: 'peer', ev: 'leave', id: peer.id, reason: reason || 'leave' });
    if (room.hostId === peer.id || room.members.size === 0) {
      // 房主离开 = 房间解散，通知所有人
      broadcastRoom(room, { t: 'closed', reason: 'host-left' });
      for (const id of room.members) {
        const p = peers.get(id);
        if (p) p.room = null;
      }
      rooms.delete(room.code);
    }
    console.log(`[room ${room.code}] -${peer.id} (${room.members.size} 人)`);
  }

  function handleMessage(peer, raw) {
    let msg;
    try { msg = JSON.parse(raw); } catch (err) { return; }
    if (peer.closed) return;   // 半开连接：已被 closePeer 清理，忽略残留消息

    if (msg.t === 'create') {
      if (peer.room) closePeer(peer, 'rejoin');
      peer.name = String(msg.name || '').slice(0, 12);
      const code = makeCode();
      const room = { code, hostId: peer.id, members: new Set([peer.id]), createdAt: Date.now() };
      rooms.set(code, room);
      peer.room = code;
      send(peer, { t: 'created', code, id: peer.id, peers: peerList(room) });
      console.log(`[room ${code}] 创建 by ${peer.id} (${peer.name})`);
      return;
    }

    if (msg.t === 'join') {
      const code = String(msg.code || '').toUpperCase().trim();
      const room = rooms.get(code);
      if (!room) { send(peer, { t: 'error', code: 'room-not-found' }); return; }
      if (room.members.size >= MAX_PEERS) { send(peer, { t: 'error', code: 'room-full' }); return; }
      peer.name = String(msg.name || '').slice(0, 12);
      peer.room = code;
      room.members.add(peer.id);
      send(peer, { t: 'joined', code, id: peer.id, peers: peerList(room) });
      broadcastRoom(room, { t: 'peer', ev: 'join', id: peer.id, name: peer.name }, peer.id);
      console.log(`[room ${code}] +${peer.id} (${peer.name}) → ${room.members.size} 人`);
      return;
    }

    if (msg.t === 'ping') { send(peer, { t: 'pong', ts: msg.ts }); return; }

    // 业务消息：转发给同房间其他人
    const room = peer.room && rooms.get(peer.room);
    if (!room) return;
    broadcastRoom(room, { t: 'msg', from: peer.id, data: msg.data !== undefined ? msg.data : msg }, peer.id);
  }

  server.on('upgrade', (req, socket) => {
    const url = (req.url || '').split('?')[0];
    if (url !== '/ws') { socket.destroy(); return; }
    const key = req.headers['sec-websocket-key'];
    if (!key) { socket.destroy(); return; }
    const accept = crypto.createHash('sha1').update(key + GUID).digest('base64');
    socket.write(
      'HTTP/1.1 101 Switching Protocols\r\n' +
      'Upgrade: websocket\r\n' +
      'Connection: Upgrade\r\n' +
      'Sec-WebSocket-Accept: ' + accept + '\r\n\r\n'
    );
    socket.setNoDelay(true);

    const peer = {
      id: 'p' + (++peerSeq).toString(36),
      socket,
      name: '',
      room: null,
      closed: false,
      alive: true
    };
    peers.set(peer.id, peer);
    send(peer, { t: 'welcome', id: peer.id, rooms: rooms.size });

    let buf = Buffer.alloc(0);
    socket.on('data', chunk => {
      peer.alive = true;
      buf = Buffer.concat([buf, chunk]);
      while (buf.length >= 2) {
        const b0 = buf[0];
        const b1 = buf[1];
        const opcode = b0 & 0x0f;
        const masked = (b1 & 0x80) !== 0;
        let len = b1 & 0x7f;
        let offset = 2;
        if (len === 126) {
          if (buf.length < 4) return;
          len = buf.readUInt16BE(2);
          offset = 4;
        } else if (len === 127) {
          if (buf.length < 10) return;
          len = Number(buf.readBigUInt64BE(2));
          offset = 10;
        }
        const maskLen = masked ? 4 : 0;
        if (buf.length < offset + maskLen + len) return;
        const mask = masked ? buf.slice(offset, offset + 4) : null;
        offset += maskLen;
        const payload = Buffer.from(buf.slice(offset, offset + len));
        if (mask) for (let i = 0; i < payload.length; i++) payload[i] ^= mask[i & 3];
        buf = buf.slice(offset + len);

        if (opcode === 0x8) { socket.end(); closePeer(peer, 'close'); return; }
        if (opcode === 0x9) { socket.write(encodePong(payload)); continue; }
        if (opcode === 0x1) handleMessage(peer, payload.toString('utf8'));
      }
    });
    socket.on('error', () => closePeer(peer, 'socket-error'));
    socket.on('close', () => closePeer(peer, 'socket-close'));
  });

  // 心跳兜底：清掉半死连接
  setInterval(() => {
    for (const peer of peers.values()) {
      if (!peer.alive) { closePeer(peer, 'timeout'); continue; }
      peer.alive = false;
      send(peer, { t: 'hb' });
    }
  }, 30000);

  return { peers, rooms };
}

module.exports = { attachRelay, MAX_PEERS };
