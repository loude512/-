/**
 * 丧尸围城 · 联机客户端（零依赖）
 * ------------------------------------------------------------------
 * 两种传输方式，UI 会自动选择：
 *   ws    —— 连中继服务器（server/relay.js），可跨设备、跨网络
 *   local —— BroadcastChannel，同浏览器多标签页，无需服务器（调试 / 同机双人）
 *
 * 对外接口：
 *   ZNet.connect(url)            连接（url 可省略，默认当前站点 /ws）
 *   ZNet.createRoom(name)        → Promise<code>
 *   ZNet.joinRoom(code, name)    → Promise<code>
 *   ZNet.send(obj)               发给房间内其他玩家
 *   ZNet.leave()
 *   ZNet.on(evt, fn) / ZNet.off(evt, fn)
 *   evt: status | peers | message | closed | error
 */
(function () {
  'use strict';

  const listeners = Object.create(null);
  const api = {
    mode: 'none',
    webState: 'idle',      // idle | connecting | open | ready | error
    role: null,            // host | guest
    code: '',
    peers: [],
    myId: '',
    serverUrl: '',
    error: ''
  };

  const emit = (evt, payload) => {
    (listeners[evt] || []).forEach(fn => { try { fn(payload); } catch (e) { console.error(e); } });
  };
  const setStatus = (text, tone) => emit('status', { text, tone: tone || 'info' });

  /* ---------------------------------------------------------------- */
  /* 传输层                                                            */
  /* ---------------------------------------------------------------- */
  let ws = null;
  let bc = null;
  let localSeq = 0;
  const localId = 'l' + Math.random().toString(36).slice(2, 8);

  function wsUrl(url) {
    if (url) {
      if (/^wss?:\/\//i.test(url)) return url;
      if (/^https?:\/\//i.test(url)) return url.replace(/^http/i, 'ws').replace(/\/$/, '') + '/ws';
      return 'ws://' + url.replace(/\/$/, '') + '/ws';
    }
    try {
      const saved = localStorage.getItem('zombie-net-url');
      if (saved) return wsUrl(saved);
    } catch (e) { /* ignore */ }
    if (location.protocol === 'http:' || location.protocol === 'https:') {
      return (location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + '/ws';
    }
    return '';
  }

  function openWs(url) {
    return new Promise((resolve, reject) => {
      let socket;
      try { socket = new WebSocket(url); } catch (e) { reject(e); return; }
      let settled = false;
      const timer = setTimeout(() => {
        if (settled) return;
        settled = true;
        try { socket.close(); } catch (e) { /* ignore */ }
        reject(new Error('连接超时'));
      }, 6000);
      socket.onopen = () => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        ws = socket;
        resolve(socket);
      };
      socket.onerror = () => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        reject(new Error('无法连接联机服务器'));
      };
      socket.onclose = () => {
        if (ws === socket) { ws = null; api.webState = 'idle'; }
        if (api.role) {
          api.role = null; api.code = ''; api.peers = [];
          emit('closed', { reason: 'socket-close' });
        }
      };
      socket.onmessage = ev => {
        let msg;
        try { msg = JSON.parse(String(ev.data)); } catch (e) { return; }
        handleServer(msg);
      };
    });
  }

  function handleServer(msg) {
    switch (msg.t) {
      case 'welcome':
        api.myId = msg.id;
        api.webState = 'open';
        break;
      case 'created':
        api.role = 'host';
        api.code = msg.code;
        api.peers = msg.peers || [];
        api.webState = 'ready';
        emit('peers', api.peers);
        break;
      case 'joined':
        api.role = 'guest';
        api.code = msg.code;
        api.peers = msg.peers || [];
        api.webState = 'ready';
        emit('peers', api.peers);
        break;
      case 'peer':
        api.peers = api.peers.filter(p => p.id !== msg.id);
        if (msg.ev === 'join') api.peers.push({ id: msg.id, name: msg.name || '', host: false });
        emit('peers', api.peers);
        emit('presence', msg);
        break;
      case 'closed':
        api.role = null; api.code = ''; api.peers = [];
        emit('closed', { reason: msg.reason });
        break;
      case 'msg':
        emit('message', msg.data);
        break;
      case 'error':
        api.error = msg.code;
        emit('error', { code: msg.code });
        break;
      case 'hb':
        try { ws && ws.send(JSON.stringify({ t: 'ping' })); } catch (e) { /* ignore */ }
        break;
      default:
        break;
    }
  }

  /* -------------------- 本机模式（BroadcastChannel） -------------------- */
  const LOCAL_ALPHABET = 'ACDEFGHJKLMNPQRTUVWXY3479';
  function localCode() {
    let out = '';
    for (let i = 0; i < 5; i++) out += LOCAL_ALPHABET[Math.floor(Math.random() * LOCAL_ALPHABET.length)];
    return out;
  }
  function localChannel(code) {
    return 'zombie-coop-' + String(code).toUpperCase().trim();
  }
  function openLocal(code) {
    bc = new BroadcastChannel(localChannel(code));
    bc.onmessage = ev => {
      const msg = ev.data || {};
      if (msg.t === '_join') {
        if (api.role !== 'host') return;
        api.peers = api.peers.filter(p => p.id !== msg.from);
        api.peers.push({ id: msg.from, name: msg.name || '队友', host: false });
        bc.postMessage({ t: '_welcome', from: api.myId, code: api.code, peers: api.peers });
        emit('peers', api.peers);
        emit('presence', { ev: 'join', id: msg.from, name: msg.name });
        setStatus(`队友「${msg.name || '队友'}」已加入`, 'ok');
      } else if (msg.t === '_welcome') {
        if (api.role !== 'guest') return;
        api.peers = msg.peers || [];
        emit('peers', api.peers);
        emit('ready', { code: api.code });
        setStatus('已加入房间，等待房主开始', 'ok');
      } else if (msg.t === '_msg') {
        emit('message', msg.data);
      } else if (msg.t === '_leave') {
        api.peers = api.peers.filter(p => p.id !== msg.from);
        emit('peers', api.peers);
        emit('presence', { ev: 'leave', id: msg.from });
        setStatus('队友离开了房间', 'warn');
      }
    };
  }

  /* ---------------------------------------------------------------- */
  /* 对外接口                                                          */
  /* ---------------------------------------------------------------- */
  api.on = (evt, fn) => { (listeners[evt] = listeners[evt] || []).push(fn); };
  api.off = (evt, fn) => {
    const arr = listeners[evt];
    if (!arr) return;
    const i = arr.indexOf(fn);
    if (i >= 0) arr.splice(i, 1);
  };

  api.connect = async function (url) {
    api.mode = 'ws';
    api.webState = 'connecting';
    api.serverUrl = wsUrl(url);
    if (!api.serverUrl) throw new Error('当前页面无法连接服务器');
    setStatus('正在连接联机服务器…', 'info');
    try {
      const socket = await openWs(api.serverUrl);
      api.webState = 'open';
      try { socket.send(JSON.stringify({ t: 'ping', ts: Date.now() })); } catch (e) { /* ignore */ }
      return true;
    } catch (e) {
      api.mode = 'none';
      api.webState = 'error';
      setStatus('联机服务器未响应：可用「同机联机」或填写服务器地址', 'warn');
      throw e;
    }
  };

  function waitFor(predicate, ms, timeoutMsg) {
    return new Promise((resolve, reject) => {
      const started = Date.now();
      const tick = () => {
        if (predicate()) { resolve(true); return; }
        if (Date.now() - started > ms) { reject(new Error(timeoutMsg)); return; }
        setTimeout(tick, 40);
      };
      tick();
    });
  }

  api.createRoom = async function (name) {
    name = name || '房主';
    if (api.mode === 'local') {
      api.role = 'host';
      api.code = localCode();
      api.myId = localId;
      api.peers = [{ id: api.myId, name, host: true }];
      openLocal(api.code);
      emit('peers', api.peers);
      setStatus('房间已创建（同机模式，仅同浏览器标签页可加入）', 'ok');
      return api.code;
    }
    if (!ws) await api.connect();
    api.role = 'host';
    api.code = '';
    ws.send(JSON.stringify({ t: 'create', name }));
    await waitFor(() => api.code, 6000, '创建房间超时');
    setStatus('房间已创建，把房间码发给队友', 'ok');
    return api.code;
  };

  api.joinRoom = async function (code, name) {
    code = String(code || '').toUpperCase().trim();
    if (!code) throw new Error('请输入房间码');
    name = name || '队友';
    if (api.mode === 'local') {
      api.role = 'guest';
      api.code = code;
      api.myId = localId;
      openLocal(code);
      bc.postMessage({ t: '_join', from: api.myId, name });
      await waitFor(() => api.peers.length > 0, 1500, '没有找到这个房间（同机模式需要同一浏览器）');
      return code;
    }
    if (!ws) await api.connect();
    api.role = 'guest';
    api.code = '';
    ws.send(JSON.stringify({ t: 'join', code, name }));
    await waitFor(() => api.code || api.error, 6000, '加入房间超时');
    if (api.error === 'room-not-found') throw new Error('房间不存在，检查房间码');
    if (api.error === 'room-full') throw new Error('房间人数已满');
    setStatus('已加入房间，等待房主开始', 'ok');
    return api.code;
  };

  api.useLocal = function () {
    api.mode = 'local';
    api.webState = 'open';
    return true;
  };

  api.send = function (data) {
    if (!api.role) return false;
    if (api.mode === 'local') {
      if (!bc) return false;
      bc.postMessage({ t: '_msg', from: api.myId, data });
      return true;
    }
    if (!ws || ws.readyState !== 1) return false;
    ws.send(JSON.stringify({ t: 'msg', data }));
    return true;
  };

  api.leave = function () {
    if (api.mode === 'local' && bc) {
      try { bc.postMessage({ t: '_leave', from: api.myId }); } catch (e) { /* ignore */ }
      try { bc.close(); } catch (e) { /* ignore */ }
      bc = null;
    }
    if (ws) {
      try { ws.close(); } catch (e) { /* ignore */ }
      ws = null;
    }
    api.role = null;
    api.code = '';
    api.peers = [];
    api.webState = api.mode === 'local' ? 'open' : 'idle';
    api.myId = '';
    api.error = '';
  };

  api.roomReady = () => !!api.role && (api.mode === 'local' ? api.peers.length >= 2 : api.peers.length >= 2);

  window.ZNet = api;
})();
