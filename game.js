(() => {
'use strict';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;

const laneTop = 262;
const laneBottom = 506;
const worldWidth = 6400;

const ui = {
  hud: document.getElementById('hud'),
  menu: document.getElementById('menu'),
  dead: document.getElementById('dead'),
  pause: document.getElementById('pause'),
  banner: document.getElementById('waveBanner'),
  bannerText: document.getElementById('waveBannerText'),
  hpFill: document.getElementById('hpFill'),
  ammoText: document.getElementById('ammoText'),
  weaponName: document.getElementById('weaponName'),
  waveText: document.getElementById('waveText'),
  scoreText: document.getElementById('scoreText'),
  killText: document.getElementById('killText'),
  bossHud: document.getElementById('bossHud'),
  bossFill: document.getElementById('bossFill'),
  finalScore: document.getElementById('finalScore'),
  finalWave: document.getElementById('finalWave'),
  finalKills: document.getElementById('finalKills'),
  stickBall: document.getElementById('stickBall'),
  fireBtn: document.getElementById('fireBtn'),
  swapBtn: document.getElementById('swapBtn'),
  touchPauseBtn: document.getElementById('touchPauseBtn'),
  touchMuteBtn: document.getElementById('touchMuteBtn'),
  touchMusicBtn: document.getElementById('touchMusicBtn')
};

const sprites = {
  player: { image: new Image(), ready: false, src: 'assets/player.png' }
};
sprites.player.image.addEventListener('load', () => { sprites.player.ready = true; });
sprites.player.image.src = sprites.player.src;

const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const dist2 = (ax, ay, bx, by) => { const dx = ax - bx, dy = ay - by; return dx * dx + dy * dy; };
function angleDiff(a, b) {
  let d = a - b;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return Math.abs(d);
}
function segmentCircle(x0, y0, x1, y1, cx, cy, r) {
  const dx = x1 - x0, dy = y1 - y0;
  const len2 = dx * dx + dy * dy || 1e-6;
  let t = ((cx - x0) * dx + (cy - y0) * dy) / len2;
  t = clamp(t, 0, 1);
  const px = x0 + dx * t, py = y0 + dy * t;
  return dist2(px, py, cx, cy) <= r * r;
}
function rr(c, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

function makeLayer(maxH, minW, maxW, yBase) {
  const out = [];
  let x = -240;
  while (x < worldWidth + 400) {
    const w = rand(minW, maxW);
    const h = rand(maxH * .42, maxH);
    out.push({ x, w, h, y: yBase - h, wins: Math.max(2, Math.floor(rand(2, 7))), tone: rand(0, 1) });
    x += w + rand(8, 44);
  }
  return out;
}
const farLayer = makeLayer(210, 90, 190, laneTop + 10);
const nearLayer = makeLayer(320, 140, 300, laneTop + 34);
const decals = [];
const streetItems = [];
for (let i = 0; i < 46; i++) {
  streetItems.push({ x: rand(0, worldWidth), y: rand(laneTop + 28, laneBottom - 10), r: rand(7, 20), kind: Math.random() < .7 ? 'rubble' : 'cone', tilt: rand(-.3, .3) });
}

const weapons = {
  melee: {
    name: '球棍', cooldown: .36, damage: 58, range: 106, arc: 1.32, knock: 360, infinite: true,
    desc: '近身横扫'
  },
  gun: {
    name: '手枪', cooldown: .16, damage: 32, bulletSpeed: 1150, spread: .045, knock: 150, ammoUse: 1,
    desc: '远程点射'
  }
};

let state = 'menu';
let cam = { x: 0, y: 0 };
let shake = 0;
let player, enemies, bullets, pickups, particles, texts;
let wave, score, kills, spawnQueue, spawnTimer, nextWaveTimer, waveBannerAt;
let bossRef;
let last = 0;
let globalTime = 0;
let muted = false;
let musicEnabled = true;
let actx = null;

const keys = Object.create(null);
const mouse = { x: W * .5, y: H * .45, active: false };
const input = { attack: false };
const stick = { active: false, id: -1, ox: 0, oy: 0, x: 0, y: 0 };
const touchFire = { active: false, id: -1 };

if (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(max-width: 820px)').matches) document.body.classList.add('touch');

function resetGame() {
  player = {
    x: worldWidth * .5, y: 392, r: 20, hp: 100, maxHp: 100, speed: 236,
    weapon: 'gun', ammo: 72, facing: 1, attackCd: 0, swing: 0, swingId: 0, swingHit: new Set(),
    invuln: .6, anim: 0, hurtFlash: 0, flash: 0, recoil: 0, step: 0, autoBackToGun: false
  };
  enemies = [];
  bullets = [];
  pickups = [];
  particles = [];
  texts = [];
  decals.length = 0;
  wave = 0;
  score = 0;
  kills = 0;
  spawnQueue = [];
  spawnTimer = 0;
  nextWaveTimer = 1.3;
  waveBannerAt = 0;
  bossRef = null;
  shake = 0;
  cam.x = clamp(player.x - W * .5, 0, worldWidth - W);
  cam.y = cameraYTarget();
  state = 'playing';
  ui.menu.classList.add('hidden');
  ui.dead.classList.add('hidden');
  ui.pause.classList.add('hidden');
  ui.bossHud.classList.add('hidden');
  ui.hud.classList.remove('hidden');
  updateHud();
  if (actx && musicEnabled) {
    music.setMode(currentMusicMode(), true);
    music.start();
  }
}

function currentMusicMode() {
  return wave > 0 && wave % 5 === 0 ? 'boss' : 'battle';
}

function cameraYTarget() {
  const t = (player.y - laneTop) / (laneBottom - laneTop);
  return lerp(-46, 24, clamp(t, 0, 1));
}

function startWave(n) {
  wave = n;
  ui.bannerText.textContent = (wave % 5 === 0) ? `第 ${wave} 波 · BOSS 来袭` : `第 ${wave} 波`;
  ui.banner.classList.remove('hidden');
  waveBannerAt = 1.8;
  spawnQueue = [];
  const isBoss = wave % 5 === 0;
  const total = clamp(4 + Math.floor(wave * 2.2), 5, 28);
  for (let i = 0; i < total; i++) {
    const r = Math.random();
    if (wave < 2) spawnQueue.push('walker');
    else if (r < .52) spawnQueue.push('walker');
    else if (r < .82) spawnQueue.push('runner');
    else spawnQueue.push('brute');
  }
  if (isBoss) {
    spawnQueue.push('boss');
    for (let i = 0; i < Math.min(6, 2 + Math.floor(wave / 5)); i++) spawnQueue.push(Math.random() < .6 ? 'runner' : 'walker');
  }
  for (let i = spawnQueue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [spawnQueue[i], spawnQueue[j]] = [spawnQueue[j], spawnQueue[i]];
  }
  spawnTimer = 1.0;
  audio.wave();
  music.setMode(isBoss ? 'boss' : 'battle', true);
  updateHud();
}

function spawnOne(type) {
  const side = Math.random();
  let x, y;
  if (side < .68) {
    x = cam.x + (Math.random() < .5 ? -70 : W + 70);
    y = rand(laneTop + 14, laneBottom - 14);
  } else if (side < .84) {
    x = cam.x + rand(60, W - 60);
    y = laneTop - 105;
  } else {
    x = cam.x + rand(60, W - 60);
    y = laneBottom + 92;
  }
  const base = {
    walker: { hp: 58, speed: 64, dmg: 10, r: 22, score: 10, scale: 1, color: '#6f9e63' },
    runner: { hp: 34, speed: 138, dmg: 7, r: 17, score: 15, scale: .82, color: '#94b95a' },
    brute: { hp: 230, speed: 46, dmg: 20, r: 33, score: 38, scale: 1.42, color: '#4c7d55' },
    boss: { hp: 820 + wave * 160, speed: 54, dmg: 28, r: 58, score: 260, scale: 2.35, color: '#386b4b' }
  }[type];
  const z = Object.assign({
    type, x, y, maxHp: base.hp, hp: base.hp, attackCd: rand(.4, 1.1),
    phase: rand(0, 10), kx: 0, ky: 0, hurt: 0, dead: false, climbT: type === 'boss' ? 0 : rand(.55, 1.2)
  }, base);
  if (type === 'boss') {
    x = player.x + (player.facing > 0 ? -360 : 360);
    x = clamp(x, 120, worldWidth - 120);
    z.x = x;
    z.y = laneTop - 120;
    bossRef = z;
    ui.bossHud.classList.remove('hidden');
    addShake(12);
  }
  enemies.push(z);
}

function tryAttack() {
  if (state !== 'playing' || player.attackCd > 0) return;
  const w = weapons[player.weapon];
  const aim = currentAim();
  player.facing = Math.cos(aim) >= 0 ? 1 : -1;
  if (player.weapon === 'melee') {
    player.attackCd = w.cooldown;
    player.swing = .24;
    player.swingId++;
    player.swingHit = new Set();
    const ox = player.x;
    const oy = player.y - 39;
    audio.swing();
    for (const z of enemies) {
      if (z.dead || player.swingHit.has(z)) continue;
      const dx = z.x - ox, dy = z.y - 34 - oy;
      const d = Math.hypot(dx, dy);
      const a = Math.atan2(dy, dx);
      if (d <= w.range + z.r && angleDiff(a, aim) <= w.arc * .5 + .13) {
        damageZombie(z, w.damage, aim, w.knock);
        player.swingHit.add(z);
      }
    }
    for (let i = 0; i < 10; i++) {
      const sp = rand(120, 320), a = aim + rand(-.6, .6);
      particles.push({ x: ox + Math.cos(aim) * 40, y: oy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 60, life: rand(.16, .34), max: .34, r: rand(2, 4), color: '#d8dde6', g: 260 });
    }
  } else {
    if (player.ammo < w.ammoUse) {
      player.attackCd = .22;
      audio.dry();
      player.weapon = 'melee';
      player.autoBackToGun = true;
      texts.push({ x: player.x, y: player.y - 96, vy: -58, life: 1.1, max: 1.1, text: '子弹耗尽 · 已切换球棍', color: '#ffd166' });
      updateHud();
      return;
    }
    player.autoBackToGun = false;
    player.attackCd = w.cooldown;
    player.ammo -= w.ammoUse;
    player.flash = .06;
    player.recoil = 1;
    addShake(2.4);
    audio.bang();
    const spread = rand(-w.spread, w.spread);
    const a = aim + spread;
    const mx = player.x + Math.cos(aim) * 24;
    const my = player.y - 62 + Math.sin(aim) * 24;
    bullets.push({ x: mx, y: my, px: mx, py: my, vx: Math.cos(a) * w.bulletSpeed, vy: Math.sin(a) * w.bulletSpeed, life: 1.0, dmg: w.damage, knock: w.knock });
    for (let i = 0; i < 7; i++) {
      const sp = rand(70, 220), aa = aim + rand(-.38, .38);
      particles.push({ x: mx, y: my, vx: Math.cos(aa) * sp, vy: Math.sin(aa) * sp, life: rand(.08, .18), max: .18, r: rand(1.5, 3), color: i ? '#ffcf72' : '#fff2b8', g: 40 });
    }
    particles.push({ x: player.x - player.facing * 16, y: player.y - 28, vx: -player.facing * rand(40, 90), vy: -rand(30, 90), life: .5, max: .5, r: 3.2, color: '#d8b25a', g: 500, casing: true });
    updateHud();
  }
}

function damageZombie(z, dmg, aim, knock) {
  z.hp -= dmg;
  z.hurt = .14;
  z.kx += Math.cos(aim) * knock * (z.type === 'boss' ? .22 : 1);
  z.ky += Math.sin(aim) * knock * (z.type === 'boss' ? .22 : 1);
  texts.push({ x: z.x + rand(-12, 12), y: z.y - z.r * 1.5, vy: -78, life: .72, max: .72, text: String(Math.round(dmg)), color: dmg >= 100 ? '#ffd166' : '#fff' });
  for (let i = 0; i < 9; i++) {
    const a = aim + rand(-.7, .7), sp = rand(90, 300);
    particles.push({ x: z.x, y: z.y - z.r * .75, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 90, life: rand(.2, .48), max: .48, r: rand(2, 4.5), color: Math.random() < .8 ? '#b92e2e' : '#7a1d1d', g: 430 });
  }
  if (z.hp <= 0 && !z.dead) killZombie(z, aim);
  else audio.hit();
}

function killZombie(z, aim) {
  z.dead = true;
  score += z.score;
  kills++;
  addShake(z.type === 'boss' ? 14 : 3);
  audio.hit();
  if (z.type === 'boss') {
    audio.bossDown();
    for (let i = 0; i < 80; i++) {
      const a = rand(0, Math.PI * 2), sp = rand(80, 520);
      particles.push({ x: z.x, y: z.y - z.r * .7, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 160, life: rand(.4, 1.0), max: 1.0, r: rand(2.5, 6), color: i % 3 ? '#b92e2e' : '#ffd166', g: 360 });
    }
    spawnPickup(z.x - 46, z.y, 'health');
    spawnPickup(z.x + 46, z.y, 'ammo');
    bossRef = null;
    ui.bossHud.classList.add('hidden');
  } else {
    const r = Math.random();
    if (r < .10) spawnPickup(z.x, z.y, 'health');
    else if (r < .25) spawnPickup(z.x, z.y, 'ammo');
  }
  decals.push({ x: z.x, y: z.y, r: clamp(z.r * 1.15, 12, 52), alpha: .55 });
  if (decals.length > 46) decals.shift();
  updateHud();
}

function spawnPickup(x, y, kind) {
  pickups.push({ kind, x: clamp(x, 60, worldWidth - 60), y: clamp(y, laneTop + 10, laneBottom - 8), bob: rand(0, 10), life: 16 });
}

function addShake(v) { shake = Math.min(24, shake + v); }

function currentAim() {
  if (mouse.active || touchFire.active) {
    const sx = player.x - cam.x;
    const sy = player.y - 62 - cam.y;
    return Math.atan2(mouse.y - sy, mouse.x - sx);
  }
  const vx = stick.active ? stick.x : (keys['ArrowRight'] || keys['KeyD'] ? 1 : 0) - (keys['ArrowLeft'] || keys['KeyA'] ? 1 : 0);
  const vy = stick.active ? stick.y : (keys['ArrowDown'] || keys['KeyS'] ? 1 : 0) - (keys['ArrowUp'] || keys['KeyW'] ? 1 : 0);
  if (vx !== 0 || vy !== 0) return Math.atan2(vy, vx);
  return player.facing > 0 ? 0 : Math.PI;
}

function update(dt) {
  globalTime += dt;
  shake = Math.max(0, shake - dt * 26);
  if (state !== 'playing') return;

  const moveX = (keys['ArrowRight'] || keys['KeyD'] ? 1 : 0) - (keys['ArrowLeft'] || keys['KeyA'] ? 1 : 0);
  const moveY = (keys['ArrowDown'] || keys['KeyS'] ? 1 : 0) - (keys['ArrowUp'] || keys['KeyW'] ? 1 : 0);
  let ix = moveX, iy = moveY;
  if (stick.active) { ix = stick.x; iy = stick.y; }
  if (input.attack || touchFire.active) tryAttack();

  const len = Math.hypot(ix, iy) || 1;
  const moving = len > .08;
  if (moving) {
    const nx = ix / len, ny = iy / len;
    player.x = clamp(player.x + nx * player.speed * dt, 80, worldWidth - 80);
    player.y = clamp(player.y + ny * player.speed * dt, laneTop, laneBottom);
    player.anim += dt * (Math.hypot(nx, ny) > .4 ? 11 : 6);
  }
  const aimNow = currentAim();
  if (mouse.active || touchFire.active || stick.active) {
    player.facing = Math.cos(aimNow) >= 0 ? 1 : -1;
  } else if (moving) {
    const nxFacing = ix / len;
    player.facing = nxFacing >= 0 ? 1 : -1;
  }
  player.attackCd = Math.max(0, player.attackCd - dt);
  player.swing = Math.max(0, player.swing - dt);
  player.invuln = Math.max(0, player.invuln - dt);
  player.hurtFlash = Math.max(0, player.hurtFlash - dt);
  player.flash = Math.max(0, player.flash - dt);
  player.recoil = Math.max(0, player.recoil - dt * 4);

  cam.x = lerp(cam.x, clamp(player.x - W * .5, 0, worldWidth - W), clamp(dt * 5, 0, 1));
  cam.y = lerp(cam.y, cameraYTarget(), clamp(dt * 4, 0, 1));

  if (nextWaveTimer > 0) {
    nextWaveTimer -= dt;
    if (nextWaveTimer <= 0) startWave(wave + 1);
  }
  if (waveBannerAt > 0) {
    waveBannerAt -= dt;
    if (waveBannerAt <= 0) ui.banner.classList.add('hidden');
  }
  if (spawnQueue.length) {
    spawnTimer -= dt;
    const cap = clamp(7 + wave * 2, 8, 18);
    if (spawnTimer <= 0 && enemies.length < cap) {
      spawnOne(spawnQueue.shift());
      spawnTimer = .42 + Math.random() * .5 - Math.min(.28, wave * .012);
    }
  } else if (!enemies.length && nextWaveTimer <= 0) {
    nextWaveTimer = 3.4;
    if (wave > 0) {
      score += 50 + wave * 20;
      texts.push({ x: player.x, y: player.y - 92, vy: -64, life: 1.2, max: 1.2, text: `波次奖励 +${50 + wave * 20}`, color: '#7ee081' });
      updateHud();
    }
  }

  updateBullets(dt);
  updateEnemies(dt);
  updatePickups(dt);
  updateParticles(dt, texts);
  if (player.hp <= 0) gameOver();
}

function updateBullets(dt) {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.px = b.x; b.py = b.y;
    b.x += b.vx * dt; b.y += b.vy * dt;
    b.life -= dt;
    let hit = false;
    for (const z of enemies) {
      if (z.dead) continue;
      const hitR = z.r + 10;
      if (segmentCircle(b.px, b.py, b.x, b.y, z.x, z.y - z.r * .55, hitR)) {
        damageZombie(z, b.dmg, Math.atan2(b.vy, b.vx), weapons.gun.knock);
        hit = true;
        break;
      }
    }
    if (hit || b.life <= 0 || b.x < cam.x - 120 || b.x > cam.x + W + 120 || b.y < -120 || b.y > H + 160) bullets.splice(i, 1);
  }
}

function updateEnemies(dt) {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const z = enemies[i];
    if (z.dead) { enemies.splice(i, 1); continue; }
    z.phase += dt * (3 + z.speed * .025);
    z.hurt = Math.max(0, z.hurt - dt);
    z.attackCd = Math.max(0, z.attackCd - dt);
    z.kx = lerp(z.kx, 0, clamp(dt * 6, 0, 1));
    z.ky = lerp(z.ky, 0, clamp(dt * 6, 0, 1));

    const dx = player.x - z.x;
    const dy = player.y - 4 - z.y;
    const d = Math.hypot(dx, dy) || 1;
    if (z.climbT > 0) {
      z.climbT -= dt;
      z.y += clamp((player.y - 8 - z.y) * 2.2 * dt, -260 * dt, 260 * dt);
      z.x += (dx / d) * z.speed * .35 * dt;
    } else {
      z.x += (dx / d) * z.speed * dt;
      z.y += (dy / d) * z.speed * dt;
    }
    z.x += z.kx * dt; z.y += z.ky * dt;
    z.y = clamp(z.y, laneTop - 108, laneBottom + 100);
    z.x = clamp(z.x, 40, worldWidth - 40);
    if (z.climbT <= 0) z.y = clamp(z.y, laneTop - 8, laneBottom + 4);
    z.x = clamp(z.x, cam.x - 260, cam.x + W + 260);

    const touch = d < z.r + player.r - 2;
    if (touch && z.attackCd <= 0 && player.invuln <= 0) {
      z.attackCd = .78;
      player.hp -= z.dmg;
      player.invuln = .72;
      player.hurtFlash = .28;
      addShake(7);
      player.knockX = -dx / d * 220;
      player.knockY = -dy / d * 180;
      audio.hurt();
      updateHud();
    }
    if (player.knockX || player.knockY) {
      player.x = clamp(player.x + player.knockX * dt, 80, worldWidth - 80);
      player.y = clamp(player.y + player.knockY * dt, laneTop, laneBottom);
      player.knockX = lerp(player.knockX, 0, clamp(dt * 8, 0, 1));
      player.knockY = lerp(player.knockY, 0, clamp(dt * 8, 0, 1));
      if (Math.abs(player.knockX) < 4 && Math.abs(player.knockY) < 4) { player.knockX = 0; player.knockY = 0; }
    }
    if (z.type === 'boss' && bossRef === z) ui.bossFill.style.width = `${clamp(z.hp / z.maxHp * 100, 0, 100)}%`;
  }
}

function updatePickups(dt) {
  for (let i = pickups.length - 1; i >= 0; i--) {
    const p = pickups[i];
    p.bob += dt * 5;
    p.life -= dt;
    const r = 28;
    if (p.life <= 0 || dist2(p.x, p.y - 18, player.x, player.y - 22) <= r * r) {
      if (p.life > 0) {
        if (p.kind === 'health') {
          player.hp = Math.min(player.maxHp, player.hp + 28);
          texts.push({ x: player.x, y: player.y - 88, vy: -64, life: .9, max: .9, text: '+28 HP', color: '#7ee081' });
        } else {
          player.ammo += 36;
          if (player.weapon === 'melee' && player.autoBackToGun) {
            player.weapon = 'gun';
            player.autoBackToGun = false;
            texts.push({ x: player.x, y: player.y - 112, vy: -58, life: 1.0, max: 1.0, text: '已恢复手枪', color: '#62a8ff' });
          }
          texts.push({ x: player.x, y: player.y - 88, vy: -64, life: .9, max: .9, text: '+36 子弹', color: '#ffd166' });
        }
        audio.pickup();
        updateHud();
      }
      pickups.splice(i, 1);
    }
  }
}

function updateParticles(dt) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life -= dt;
    if (p.life <= 0) { particles.splice(i, 1); continue; }
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += (p.g || 0) * dt;
    p.vx *= 1 - clamp(dt * 1.4, 0, 1);
  }
  for (let i = texts.length - 1; i >= 0; i--) {
    const t = texts[i];
    t.life -= dt;
    t.y += t.vy * dt;
    t.vy += 90 * dt;
    if (t.life <= 0) texts.splice(i, 1);
  }
}

function gameOver() {
  if (state === 'dead') return;
  state = 'dead';
  addShake(18);
  audio.gameover();
  music.setMode('dead');
  music.stop(1.4);
  for (let i = 0; i < 42; i++) {
    const a = rand(0, Math.PI * 2), sp = rand(90, 430);
    particles.push({ x: player.x, y: player.y - 38, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 160, life: rand(.3, .9), max: .9, r: rand(2, 5), color: i % 4 ? '#c73434' : '#ffd166', g: 420 });
  }
  ui.finalScore.textContent = score;
  ui.finalWave.textContent = Math.max(1, wave);
  ui.finalKills.textContent = kills;
  setTimeout(() => ui.dead.classList.remove('hidden'), 520);
}

function updateHud() {
  ui.hpFill.style.width = `${clamp(player ? player.hp / player.maxHp * 100 : 100, 0, 100)}%`;
  const w = player ? weapons[player.weapon] : null;
  ui.weaponName.textContent = w ? w.name : '球棍';
  ui.ammoText.textContent = player ? (player.weapon === 'gun' ? `子弹 ${player.ammo}` : '近战 · 无限耐久') : '子弹 ∞';
  ui.waveText.textContent = Math.max(0, wave);
  ui.scoreText.textContent = score;
  ui.killText.textContent = kills;
}

function render() {
  const shakeX = (Math.random() * 2 - 1) * shake;
  const shakeY = (Math.random() * 2 - 1) * shake;
  drawSky();
  ctx.save();
  ctx.translate(shakeX, shakeY);
  drawFarCity();
  drawNearCity();
  ctx.save();
  ctx.translate(-cam.x, -cam.y);
  drawGround();
  drawStreetItems();
  drawDecals();
  drawPickups();
  const sorted = enemies.slice().sort((a, b) => a.y - b.y);
  for (const z of sorted) drawZombie(z);
  drawBullets();
  if (player) drawPlayer();
  drawParticles();
  ctx.restore();
  ctx.restore();
  drawVignette();
  if (state === 'playing' && player) drawCrosshair();
}

function drawSky() {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#101726');
  g.addColorStop(.42, '#26253a');
  g.addColorStop(.72, '#5a3540');
  g.addColorStop(1, '#2c232c');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.save();
  ctx.globalAlpha = .8;
  ctx.fillStyle = '#f2dd9b';
  const moonX = W * .78 - cam.x * .02, moonY = H * .18;
  ctx.beginPath(); ctx.arc(moonX, moonY, 38, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = .16;
  ctx.beginPath(); ctx.arc(moonX + 12, moonY - 8, 54, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  for (let i = 0; i < 34; i++) {
    const x = ((i * 173 - cam.x * .06) % W + W) % W;
    const y = ((i * 91 + 34) % (laneTop - 50)) + 12;
    ctx.globalAlpha = .18 + ((i % 5) / 10);
    ctx.fillStyle = '#fff';
    ctx.fillRect(x, y, 2, 2);
  }
  ctx.globalAlpha = 1;
}

function drawFarCity() {
  ctx.save();
  ctx.translate(-cam.x * .28, cam.y * .35 + 8);
  for (const b of farLayer) {
    if (b.x + b.w < cam.x * .28 - 120 || b.x > cam.x * .28 + W + 120) continue;
    ctx.fillStyle = `rgba(${28 + Math.floor(b.tone * 18)},${31 + Math.floor(b.tone * 18)},${48},.72)`;
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.fillStyle = 'rgba(255,214,120,.15)';
    for (let i = 0; i < b.wins; i++) {
      const wx = b.x + 8 + ((i * 29) % Math.max(8, b.w - 20));
      const wy = b.y + 12 + ((i * 37) % Math.max(10, b.h - 30));
      ctx.fillRect(wx, wy, 6, 8);
    }
  }
  ctx.restore();
}

function drawNearCity() {
  ctx.save();
  ctx.translate(-cam.x * .58, cam.y * .78 - 18);
  for (const b of nearLayer) {
    if (b.x + b.w < cam.x * .58 - 160 || b.x > cam.x * .58 + W + 160) continue;
    ctx.fillStyle = '#151a25';
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.fillStyle = 'rgba(255,184,92,.16)';
    const rows = Math.floor(b.h / 34), cols = Math.max(2, Math.floor(b.w / 34));
    for (let i = 0; i < rows * cols; i++) {
      const wx = b.x + 12 + (i % cols) * 30;
      const wy = b.y + 14 + Math.floor(i / cols) * 30;
      if ((i * 7 + Math.floor(b.x)) % 5 < 2) ctx.fillRect(wx, wy, 12, 14);
    }
    ctx.fillStyle = 'rgba(0,0,0,.35)';
    ctx.fillRect(b.x, b.y + b.h - 8, b.w, 8);
  }
  ctx.restore();
}

function drawGround() {
  const x0 = cam.x - 120, w = W + 240;
  const g = ctx.createLinearGradient(0, laneTop - 60, 0, laneBottom + 90);
  g.addColorStop(0, '#161b26');
  g.addColorStop(.45, '#232433');
  g.addColorStop(1, '#141722');
  ctx.fillStyle = g;
  ctx.fillRect(x0, laneTop - 40, w, laneBottom - laneTop + 150);
  ctx.fillStyle = 'rgba(255,255,255,.05)';
  ctx.fillRect(x0, laneTop, w, 4);
  ctx.fillStyle = 'rgba(126,224,129,.16)';
  for (let x = Math.floor((cam.x - 120) / 180) * 180; x < cam.x + W + 120; x += 180) {
    rr(ctx, x + 14, laneTop + 6 + ((x / 180) % 2) * 150, 64, 14, 6);
    ctx.fill();
  }
  ctx.strokeStyle = 'rgba(255,255,255,.075)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x0, laneBottom + 5);
  ctx.lineTo(x0 + w, laneBottom + 5);
  ctx.stroke();
}

function drawStreetItems() {
  for (const s of streetItems) {
    if (s.x < cam.x - 80 || s.x > cam.x + W + 80) continue;
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.fillStyle = 'rgba(0,0,0,.28)';
    ctx.beginPath(); ctx.ellipse(0, 8, s.r * 1.15, s.r * .42, 0, 0, Math.PI * 2); ctx.fill();
    if (s.kind === 'rubble') {
      ctx.fillStyle = 'rgba(150,156,170,.55)';
      ctx.save(); ctx.rotate(s.tilt);
      rr(ctx, -s.r, -s.r * .5, s.r * 2, s.r, 4); ctx.fill();
      ctx.restore();
    } else {
      ctx.fillStyle = '#e4762c';
      ctx.beginPath(); ctx.moveTo(0, -s.r); ctx.lineTo(s.r * .72, s.r * .6); ctx.lineTo(-s.r * .72, s.r * .6); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.fillRect(-3, -s.r * .35, 6, s.r);
    }
    ctx.restore();
  }
}

function drawDecals() {
  for (const d of decals) {
    if (d.x < cam.x - 90 || d.x > cam.x + W + 90) continue;
    ctx.globalAlpha = d.alpha;
    ctx.fillStyle = '#5c1010';
    ctx.beginPath(); ctx.ellipse(d.x, d.y + 4, d.r, d.r * .38, 0, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = .18;
    ctx.fillStyle = '#ff7070';
    ctx.beginPath(); ctx.ellipse(d.x, d.y + 3, d.r * .62, d.r * .24, 0, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function drawPickups() {
  for (const p of pickups) {
    if (p.x < cam.x - 60 || p.x > cam.x + W + 60) continue;
    const y = p.y + Math.sin(p.bob) * 4;
    const blink = p.life < 4 && Math.floor(p.life * 8) % 2 === 0;
    ctx.save();
    ctx.translate(p.x, y);
    ctx.globalAlpha = blink ? .45 : 1;
    ctx.fillStyle = 'rgba(0,0,0,.3)';
    ctx.beginPath(); ctx.ellipse(0, 14, 21, 7, 0, 0, Math.PI * 2); ctx.fill();
    if (p.kind === 'health') {
      ctx.fillStyle = '#fff';
      rr(ctx, -14, -8, 28, 20, 6); ctx.fill();
      ctx.fillStyle = '#e63b3b';
      ctx.fillRect(-4, -3, 8, 10); ctx.fillRect(-8, 1, 16, 4);
    } else {
      ctx.fillStyle = '#252b36';
      rr(ctx, -16, -10, 34, 22, 5); ctx.fill();
      ctx.fillStyle = '#ffd166';
      rr(ctx, -11, -5, 14, 12, 2); ctx.fill();
      ctx.fillStyle = '#b98318';
      ctx.fillRect(5, -2, 10, 6);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
}

function drawZombie(z) {
  const x = z.x, y = z.y;
  const walk = Math.sin(z.phase) * (z.climbT > 0 ? .2 : 1);
  const arm = Math.sin(z.phase * 1.4) * 10;
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = 'rgba(0,0,0,.34)';
  ctx.beginPath(); ctx.ellipse(0, 2, z.r * 1.05, z.r * .36, 0, 0, Math.PI * 2); ctx.fill();
  ctx.scale(z.scale, z.scale);
  const bodyH = z.r * 1.5;
  ctx.translate(0, -bodyH * .5);
  const hurtColor = z.hurt > 0 ? '#ffd0cb' : z.color;
  ctx.strokeStyle = hurtColor;
  ctx.fillStyle = hurtColor;
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-7, bodyH * .48 + walk * 6);
  ctx.lineTo(-4, bodyH * .12);
  ctx.moveTo(7, bodyH * .48 - walk * 6);
  ctx.lineTo(4, bodyH * .12);
  ctx.stroke();
  rr(ctx, -13, -bodyH * .12, 26, bodyH * .62, 10);
  ctx.fill();
  ctx.save();
  ctx.translate(0, -bodyH * .12 - 5);
  ctx.strokeStyle = hurtColor;
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(-10, 2); ctx.lineTo(-20 - Math.abs(arm), -8 - arm);
  ctx.moveTo(10, 2); ctx.lineTo(20 + Math.abs(arm), -2 + arm);
  ctx.stroke();
  ctx.fillStyle = hurtColor;
  ctx.beginPath(); ctx.arc(0, -20, 13, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#151a12';
  ctx.beginPath(); ctx.arc(-4, -22, 2.3, 0, Math.PI * 2); ctx.arc(4, -22, 2.3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ff4d4d';
  ctx.beginPath(); ctx.arc(-4, -22, 1, 0, Math.PI * 2); ctx.arc(4, -22, 1, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#3a1010';
  rr(ctx, -5, -16, 10, 3, 1); ctx.fill();
  ctx.restore();
  if (z.type === 'boss') {
    ctx.fillStyle = '#2b4a38';
    rr(ctx, -22, -bodyH * .18, 44, bodyH * .72, 12); ctx.fill();
    ctx.fillStyle = '#1c3128';
    rr(ctx, -17, -bodyH * .2, 34, 8, 4); ctx.fill();
  }
  ctx.restore();
  const bw = Math.max(28, z.r * 1.35);
  const pct = clamp(z.hp / z.maxHp * 100, 0, 100);
  ctx.fillStyle = 'rgba(0,0,0,.55)';
  rr(ctx, x - bw / 2, y - z.r * 2.35, bw, 6, 3); ctx.fill();
  ctx.fillStyle = pct > 55 ? '#7ee081' : pct > 28 ? '#ffd166' : '#ff5a5a';
  rr(ctx, x - bw / 2 + 1.5, y - z.r * 2.35 + 1.5, (bw - 3) * pct / 100, 3, 1.5); ctx.fill();
}

function drawPlayer() {
  const x = player.x;
  const y = player.y;
  const aim = currentAim();
  const w = weapons[player.weapon];
  const bob = Math.sin(player.anim) * 2;
  const recoilX = -player.recoil * 5 * Math.cos(aim);
  const recoilY = -player.recoil * 5 * Math.sin(aim);
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = 'rgba(0,0,0,.38)';
  ctx.beginPath(); ctx.ellipse(0, 2, 25, 8, 0, 0, Math.PI * 2); ctx.fill();
  ctx.save();
  ctx.translate(recoilX - Math.abs(Math.sin(player.anim)) * .7, recoilY - Math.abs(Math.sin(player.anim)) * 1.4);
  const shoulderX = 2;
  const shoulderY = -62;
  const handX = shoulderX + Math.cos(aim) * 20;
  const handY = shoulderY + Math.sin(aim) * 20;
  ctx.save();
  ctx.scale(player.facing, 1);
  if (sprites.player.ready) {
    const sprite = sprites.player.image;
    const naturalW = Number(sprite.naturalWidth || sprite.width) || 128;
    const naturalH = Number(sprite.naturalHeight || sprite.height) || 128;
    const targetH = 112;
    const targetW = naturalW * targetH / naturalH;
    ctx.drawImage(sprite, -targetW / 2, -targetH, targetW, targetH);
  } else {
    ctx.strokeStyle = '#26313f';
    ctx.lineWidth = 11;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-8, -16 + bob * .4); ctx.lineTo(-6, -42);
    ctx.moveTo(8, -16 - bob * .4); ctx.lineTo(6, -42);
    ctx.stroke();
    ctx.fillStyle = player.hurtFlash > 0 && Math.floor(player.hurtFlash * 30) % 2 === 0 ? '#ffb3b3' : '#2878d1';
    rr(ctx, -15, -68 - bob * .4, 30, 38, 11); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.16)';
    rr(ctx, -13, -66 - bob * .4, 9, 34, 5); ctx.fill();
    ctx.fillStyle = '#f4c49b';
    ctx.beginPath(); ctx.arc(0, -84 - bob * .4, 12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#2b1d18';
    ctx.beginPath(); ctx.arc(0, -88 - bob * .4, 12, Math.PI * 1.08, Math.PI * 1.92); ctx.fill();
    ctx.fillStyle = '#15202b';
    rr(ctx, -3, -86 - bob * .4, 6, 5, 2); ctx.fill();
  }
  ctx.restore();
  ctx.strokeStyle = '#f4c49b';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(shoulderX, shoulderY); ctx.lineTo(handX, handY);
  ctx.stroke();
  ctx.save();
  ctx.translate(shoulderX, shoulderY);
  ctx.rotate(aim);
  if (player.weapon === 'gun') {
    ctx.fillStyle = '#20242d';
    rr(ctx, 2, -7, 38, 9, 3); ctx.fill();
    ctx.fillStyle = '#111419';
    rr(ctx, 5, 0, 12, 12, 3); ctx.fill();
    ctx.fillStyle = '#3a404b';
    rr(ctx, 31, -11, 10, 7, 2); ctx.fill();
    if (player.flash > 0) {
      ctx.fillStyle = '#fff0a8';
      ctx.beginPath();
      ctx.moveTo(42, -9); ctx.lineTo(63, -3); ctx.lineTo(42, 3); ctx.closePath(); ctx.fill();
    }
  } else {
    const sw = player.swing > 0 ? player.swing / .24 : 0;
    ctx.rotate(-((1 - sw) * .9));
    ctx.fillStyle = '#8b5a2b';
    rr(ctx, 4, -5, 34, 10, 5); ctx.fill();
    ctx.fillStyle = '#d9d9df';
    rr(ctx, 30, -8, 26, 16, 7); ctx.fill();
    ctx.fillStyle = '#a8a9ad';
    rr(ctx, 33, -5, 19, 10, 5); ctx.fill();
  }
  ctx.restore();
  if (player.swing > 0 && player.weapon === 'melee') {
    ctx.save();
    ctx.translate(shoulderX, shoulderY);
    ctx.rotate(aim);
    const alpha = player.swing / .24;
    ctx.globalAlpha = alpha * .85;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, 0, w.range, -w.arc * .5, w.arc * .5);
    ctx.stroke();
    ctx.globalAlpha = alpha * .18;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, w.range, -w.arc * .5, w.arc * .5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
  ctx.restore();
  if (player.invuln > 0 && Math.floor(player.invuln * 16) % 2 === 0) {
    ctx.globalAlpha = .28;
    ctx.fillStyle = '#ff5a5a';
    ctx.beginPath(); ctx.arc(x, y - 42, 31, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function drawBullets() {
  ctx.save();
  ctx.lineCap = 'round';
  for (const b of bullets) {
    ctx.strokeStyle = 'rgba(255,224,138,.22)';
    ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(b.px, b.py); ctx.lineTo(b.x, b.y); ctx.stroke();
    ctx.strokeStyle = '#fff6c8';
    ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(b.px, b.py); ctx.lineTo(b.x, b.y); ctx.stroke();
    ctx.fillStyle = '#fff1a6';
    ctx.beginPath(); ctx.arc(b.x, b.y, 3, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

function drawParticles() {
  for (const p of particles) {
    const a = clamp(p.life / p.max, 0, 1);
    ctx.globalAlpha = a;
    ctx.fillStyle = p.color;
    if (p.casing) {
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.life * 11);
      ctx.fillRect(-2.5, -1.2, 5, 2.4); ctx.restore();
    } else {
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * a + .8, 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
  ctx.textAlign = 'center';
  ctx.font = '800 18px system-ui, sans-serif';
  for (const t of texts) {
    ctx.globalAlpha = clamp(t.life / t.max, 0, 1);
    ctx.fillStyle = 'rgba(0,0,0,.7)';
    ctx.fillText(t.text, t.x + 2, t.y + 2);
    ctx.fillStyle = t.color;
    ctx.fillText(t.text, t.x, t.y);
  }
  ctx.globalAlpha = 1;
}

function drawCrosshair() {
  const x = mouse.x, y = mouse.y;
  if (!mouse.active && !touchFire.active) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = 'rgba(255,90,90,.85)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 12, 0, Math.PI * 2);
  ctx.moveTo(-18, 0); ctx.lineTo(-8, 0);
  ctx.moveTo(18, 0); ctx.lineTo(8, 0);
  ctx.moveTo(0, -18); ctx.lineTo(0, -8);
  ctx.moveTo(0, 18); ctx.lineTo(0, 8);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.9)';
  ctx.fillRect(-1.5, -1.5, 3, 3);
  ctx.restore();
}

function drawVignette() {
  const g = ctx.createRadialGradient(W / 2, H * .52, H * .34, W / 2, H * .52, H * .78);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, 'rgba(0,0,0,.42)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  if (player && player.hurtFlash > 0) {
    ctx.fillStyle = `rgba(255,40,40,${player.hurtFlash * .55})`;
    ctx.fillRect(0, 0, W, H);
  }
}

const audio = {
  ctx() {
    if (!actx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) actx = new AC();
    }
    if (actx && actx.state === 'suspended') actx.resume();
    return actx;
  },
  tone(freq, dur, type = 'sine', gain = .07, slideTo = null, delay = 0) {
    if (muted) return;
    const ac = this.ctx();
    if (!ac) return;
    const t = ac.currentTime + delay;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo !== null) o.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t + dur);
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g).connect(ac.destination);
    o.start(t); o.stop(t + dur + .02);
  },
  bang() { this.tone(175, .09, 'square', .10, 72); this.tone(520, .05, 'sawtooth', .05, 120); },
  swing() { this.tone(720, .07, 'sine', .05, 210); },
  hit() { this.tone(205, .10, 'triangle', .08, 92); this.tone(95, .10, 'sine', .06, 55); },
  hurt() { this.tone(150, .18, 'sawtooth', .10, 64); },
  dry() { this.tone(120, .06, 'square', .05, 90); },
  pickup() { this.tone(520, .08, 'sine', .06, 760); this.tone(760, .10, 'sine', .05, 980, .07); },
  wave() { this.tone(430, .12, 'triangle', .07, 540); this.tone(620, .13, 'triangle', .06, 720, .10); },
  bossDown() { this.tone(120, .45, 'sawtooth', .11, 54); this.tone(300, .35, 'square', .07, 90, .12); },
  gameover() { this.tone(340, .25, 'triangle', .09, 220); this.tone(240, .35, 'triangle', .08, 130, .18); this.tone(110, .55, 'sawtooth', .08, 60, .38); }
};

const music = (() => {
  let ac = null;
  let master = null;
  let compressor = null;
  let noiseBuffer = null;
  let timer = null;
  let playing = false;
  let ready = false;
  let step = 0;
  let nextTime = 0;
  let bpm = 126;
  let mode = 'menu';
  let arpPattern = [0, 2, 1, 2, 3, 2, 1, 2];

  const chords = [
    { root: 57, intervals: [0, 3, 7] },
    { root: 53, intervals: [0, 4, 7] },
    { root: 48, intervals: [0, 4, 7] },
    { root: 55, intervals: [0, 4, 7] }
  ];
  const modeConfig = {
    menu: { bpm: 102, filter: 1300, gain: .10 },
    battle: { bpm: 126, filter: 2300, gain: .17 },
    boss: { bpm: 144, filter: 3200, gain: .21 },
    dead: { bpm: 92, filter: 900, gain: .12 }
  };

  function midiToFreq(n) { return 440 * Math.pow(2, (n - 69) / 12); }
  function currentChord() { return chords[Math.floor(step / 16) % chords.length]; }
  function reloadArp() {
    const tones = [0, 1, 2, 3, 2, 0];
    arpPattern = [];
    const count = mode === 'boss' ? 16 : 8;
    for (let i = 0; i < count; i++) {
      arpPattern.push(Math.random() < .72 ? tones[Math.floor(Math.random() * tones.length)] : null);
    }
    if (!arpPattern.some(v => v !== null)) arpPattern[0] = 0;
  }

  function ensure() {
    if (ready) return true;
    ac = audio.ctx();
    if (!ac) return false;
    const sr = ac.sampleRate;
    noiseBuffer = ac.createBuffer(1, Math.floor(sr * .35), sr);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

    master = ac.createGain();
    master.gain.value = 0;
    compressor = ac.createDynamicsCompressor();
    compressor.threshold.value = -12;
    compressor.knee.value = 22;
    compressor.ratio.value = 4;
    compressor.attack.value = .004;
    compressor.release.value = .12;
    master.connect(compressor).connect(ac.destination);
    ready = true;
    return true;
  }

  function targetGain() {
    if (muted || !musicEnabled || !ready) return 0;
    return (modeConfig[mode] || modeConfig.battle).gain;
  }

  function apply(fade = .35) {
    if (!ready || !ac) return;
    const now = ac.currentTime;
    const g = master.gain;
    g.cancelScheduledValues(now);
    g.setValueAtTime(g.value, now);
    g.linearRampToValueAtTime(targetGain(), now + fade);
  }

  function voice(freq, time, dur, type, gain, filterFreq, detune = 0) {
    if (!ac || !master) return;
    const osc = ac.createOscillator();
    const env = ac.createGain();
    const filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.max(240, filterFreq), time);
    filter.frequency.exponentialRampToValueAtTime(Math.max(260, filterFreq * .48), time + dur);
    filter.Q.value = .7;
    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);
    osc.detune.value = detune;
    env.gain.setValueAtTime(0, time);
    env.gain.linearRampToValueAtTime(gain, time + Math.min(.05, dur * .25));
    env.gain.exponentialRampToValueAtTime(.0001, time + dur);
    osc.connect(filter).connect(env).connect(master);
    osc.start(time);
    osc.stop(time + dur + .04);
  }

  function noise(time, dur, gain, type, freq, q = .8) {
    if (!ac || !master || !noiseBuffer) return;
    const src = ac.createBufferSource();
    src.buffer = noiseBuffer;
    const filter = ac.createBiquadFilter();
    filter.type = type;
    filter.frequency.setValueAtTime(freq, time);
    filter.Q.value = q;
    const env = ac.createGain();
    env.gain.setValueAtTime(gain, time);
    env.gain.exponentialRampToValueAtTime(.0001, time + dur);
    src.connect(filter).connect(env).connect(master);
    src.start(time);
    src.stop(time + dur + .03);
  }

  function kick(time) {
    const osc = ac.createOscillator();
    const env = ac.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(132, time);
    osc.frequency.exponentialRampToValueAtTime(42, time + .12);
    env.gain.setValueAtTime(.52, time);
    env.gain.exponentialRampToValueAtTime(.0001, time + .18);
    osc.connect(env).connect(master);
    osc.start(time);
    osc.stop(time + .22);
  }

  function pad(time) {
    const chord = currentChord();
    const dur = 60 / bpm * 4;
    chord.intervals.forEach((interval, i) => {
      voice(midiToFreq(chord.root + 12 + interval), time, dur, i === 0 ? 'sawtooth' : 'triangle', .045, 950, i === 0 ? -6 : 6);
    });
    voice(midiToFreq(chord.root), time, dur, 'sine', .035, 500);
  }

  function bass(time, noteOffset = 0) {
    const chord = currentChord();
    const note = chord.root + (noteOffset === 0 ? 0 : 7);
    voice(midiToFreq(note), time, .28, 'sawtooth', .075, 620);
    voice(midiToFreq(note), time, .22, 'triangle', .038, 320);
  }

  function pluck(time, index) {
    const chord = currentChord();
    const tone = arpPattern[index % arpPattern.length];
    if (tone === null || tone === undefined) return;
    const interval = chord.intervals[tone % chord.intervals.length];
    const octave = mode === 'boss' ? 24 : 12;
    const freq = midiToFreq(chord.root + octave + interval + (index % 8 >= 4 ? 0 : 12));
    voice(freq, time, .22, 'square', .055, 2600);
    voice(freq * .5, time, .14, 'triangle', .018, 900);
  }

  function scheduleStep(time, s) {
    if (s === 0) {
      if ((Math.floor(step / 16) % 2) === 0) reloadArp();
      pad(time);
    }
    if (mode === 'menu') {
      if (s === 0 || s === 8) bass(time);
      return;
    }
    const kickSteps = mode === 'boss' ? [0, 3, 6, 8, 11, 14] : [0, 4, 8, 12];
    if (kickSteps.includes(s)) kick(time);
    if (s === 4 || s === 12) noise(time, .14, .22, 'bandpass', 1850);
    if (s === 2 || s === 6 || s === 10 || s === 14) noise(time, .055, mode === 'boss' ? .09 : .055, 'highpass', 7800);
    if (mode === 'boss' && s % 2 === 1) noise(time, .035, .045, 'highpass', 9200);
    const bassSteps = mode === 'boss' ? [0, 2, 5, 8, 10, 14] : [0, 3, 6, 8, 11, 14];
    if (bassSteps.includes(s)) bass(time, s >= 8 ? 7 : 0);
    if (mode === 'boss' || s % 2 === 0) pluck(time, s);
  }

  function tick() {
    if (!ready || !ac || !playing) return;
    if (nextTime < ac.currentTime - .2) nextTime = ac.currentTime + .05;
    while (nextTime < ac.currentTime + .12) {
      scheduleStep(nextTime, step % 16);
      nextTime += 60 / bpm / 4;
      step++;
    }
  }

  function start() {
    if (!musicEnabled || playing) return;
    if (!ensure()) return;
    const now = ac.currentTime;
    if (!nextTime || nextTime < now) nextTime = now + .08;
    playing = true;
    if (timer) clearInterval(timer);
    timer = setInterval(tick, 25);
    apply(.45);
  }

  function stop(fade = .45) {
    if (timer) clearInterval(timer);
    timer = null;
    playing = false;
    if (ready && ac) {
      const now = ac.currentTime;
      const g = master.gain;
      g.cancelScheduledValues(now);
      g.setValueAtTime(g.value, now);
      g.linearRampToValueAtTime(0, now + fade);
    }
  }

  function setMode(next, autoStart = false) {
    mode = next;
    const config = modeConfig[mode] || modeConfig.battle;
    bpm = config.bpm;
    if (autoStart && musicEnabled && !playing) start();
    else if (playing) apply(.5);
  }

  return { start, stop, setMode, apply };
})();

function frame(t) {
  requestAnimationFrame(frame);
  const dt = Math.min((t - last) / 1000 || 0, .045);
  last = t;
  update(dt);
  render();
}

function setMouseFromEvent(e) {
  const rect = canvas.getBoundingClientRect();
  mouse.x = (e.clientX - rect.left) * (canvas.width / rect.width);
  mouse.y = (e.clientY - rect.top) * (canvas.height / rect.height);
  mouse.active = true;
}

canvas.addEventListener('pointermove', e => {
  if (e.pointerType === 'touch') {
    if (stick.active && e.pointerId === stick.id) updateStick(e);
    else if (touchFire.active && e.pointerId === touchFire.id) setMouseFromEvent(e);
    return;
  }
  setMouseFromEvent(e);
});
canvas.addEventListener('pointerdown', e => {
  audio.ctx();
  if (e.pointerType === 'touch') {
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    if (px < rect.width * .52 && py > rect.height * .22) {
      stick.active = true; stick.id = e.pointerId; stick.ox = px; stick.oy = py; stick.x = 0; stick.y = 0;
      ui.stickBall.style.left = `${px - 56}px`;
      ui.stickBall.style.top = `${py - 56}px`;
      ui.stickBall.style.bottom = 'auto';
      ui.stickBall.style.setProperty('--sx', '0px');
      ui.stickBall.style.setProperty('--sy', '0px');
    } else {
      touchFire.active = true; touchFire.id = e.pointerId;
      setMouseFromEvent(e);
    }
    e.preventDefault();
    return;
  }
  setMouseFromEvent(e);
  input.attack = true;
});
canvas.addEventListener('pointerup', e => {
  if (e.pointerId === stick.id) { stick.active = false; stick.id = -1; stick.x = 0; stick.y = 0; }
  if (e.pointerId === touchFire.id) { touchFire.active = false; touchFire.id = -1; }
  if (e.pointerType !== 'touch') input.attack = false;
});
canvas.addEventListener('pointerleave', () => { input.attack = false; });
canvas.addEventListener('contextmenu', e => e.preventDefault());

function updateStick(e) {
  const rect = canvas.getBoundingClientRect();
  const px = e.clientX - rect.left;
  const py = e.clientY - rect.top;
  let dx = (px - stick.ox) / 48;
  let dy = (py - stick.oy) / 48;
  const len = Math.hypot(dx, dy) || 1;
  if (len > 1) { dx /= len; dy /= len; }
  stick.x = Math.abs(dx) < .18 ? 0 : dx;
  stick.y = Math.abs(dy) < .18 ? 0 : dy;
  ui.stickBall.style.setProperty('--sx', `${dx * 42}px`);
  ui.stickBall.style.setProperty('--sy', `${dy * 42}px`);
}

ui.fireBtn.addEventListener('pointerdown', e => {
  e.preventDefault();
  audio.ctx();
  if (state !== 'playing') return;
  touchFire.active = true;
  touchFire.id = -999;
  if (!mouse.active) aimTouchFire();
  if (e.pointerId !== undefined && typeof ui.fireBtn.setPointerCapture === 'function') {
    try { ui.fireBtn.setPointerCapture(e.pointerId); } catch (err) { /* old browser */ }
  }
});
ui.fireBtn.addEventListener('pointerup', () => { touchFire.active = false; });
ui.swapBtn.addEventListener('pointerdown', e => { e.preventDefault(); switchWeapon(); });
ui.touchPauseBtn.addEventListener('pointerdown', e => { e.preventDefault(); togglePause(); });
ui.touchMuteBtn.addEventListener('pointerdown', e => { e.preventDefault(); toggleMute(); });
ui.touchMusicBtn.addEventListener('pointerdown', e => { e.preventDefault(); toggleMusic(); });

function aimTouchFire() {
  if (!player) return;
  let best = null;
  let bestD = 760 * 760;
  for (const z of enemies || []) {
    if (z.dead) continue;
    const d = dist2(z.x, z.y - 34, player.x, player.y - 62);
    if (d < bestD) { bestD = d; best = z; }
  }
  const sx = best ? best.x : player.x + (player.facing > 0 ? 190 : -190);
  const sy = best ? best.y - 34 : player.y - 62;
  mouse.x = clamp(sx - cam.x, 30, W - 30);
  mouse.y = clamp(sy - cam.y, 30, H - 30);
  mouse.active = true;
}

addEventListener('keydown', e => {
  const handled = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'KeyW', 'KeyA', 'KeyS', 'KeyD'];
  if (handled.includes(e.code)) e.preventDefault();
  keys[e.code] = true;
  audio.ctx();
  if (e.code === 'Space' || e.code === 'KeyJ') input.attack = true;
  if (e.code === 'KeyQ') switchWeapon();
  if (e.code === 'Digit1') selectWeapon('melee');
  if (e.code === 'Digit2') selectWeapon('gun');
  if (e.code === 'KeyP') togglePause();
  if (e.code === 'KeyR' && state === 'dead') resetGame();
  if (e.code === 'KeyM') toggleMute();
  if (e.code === 'KeyB') toggleMusic();
  if (e.code === 'Escape' && state === 'playing') togglePause();
});
addEventListener('keyup', e => {
  keys[e.code] = false;
  if (e.code === 'Space' || e.code === 'KeyJ') input.attack = false;
});

document.getElementById('startBtn').addEventListener('click', () => { audio.ctx(); resetGame(); });
document.getElementById('restartBtn').addEventListener('click', resetGame);
document.getElementById('resumeBtn').addEventListener('click', togglePause);
document.getElementById('menuBtn').addEventListener('click', showMenu);
document.getElementById('switchBtn').addEventListener('click', switchWeapon);

function switchWeapon() {
  if (state !== 'playing') return;
  selectWeapon(player.weapon === 'gun' ? 'melee' : 'gun');
}

function selectWeapon(name) {
  if (state !== 'playing') return;
  if (!weapons[name]) return;
  player.weapon = name;
  if (name === 'gun') player.autoBackToGun = false;
  player.swing = 0;
  updateHud();
}

function togglePause() {
  if (state === 'playing') {
    state = 'paused';
    ui.pause.classList.remove('hidden');
    music.stop(.25);
  } else if (state === 'paused') {
    state = 'playing';
    ui.pause.classList.add('hidden');
    if (musicEnabled) music.setMode(currentMusicMode(), true);
  }
}

function toggleMute() {
  muted = !muted;
  document.title = muted ? '静音 · 末日横板' : '末日横板：枪械与棍棒打丧尸';
  if (ui.touchMuteBtn) ui.touchMuteBtn.textContent = muted ? '已静音' : '音效';
  if (muted) music.stop(.2);
  else if (state === 'playing' && musicEnabled) music.setMode(currentMusicMode(), true);
  else music.apply(.2);
}

function toggleMusic() {
  musicEnabled = !musicEnabled;
  if (ui.touchMusicBtn) ui.touchMusicBtn.textContent = musicEnabled ? '音乐' : '音乐关';
  if (!musicEnabled) music.stop(.25);
  else if (state === 'playing') music.setMode(currentMusicMode(), true);
  else if (actx) music.setMode('menu', true);
}

function showMenu() {
  state = 'menu';
  if (actx && musicEnabled) music.setMode('menu', true);
  else music.stop(.4);
  ui.menu.classList.remove('hidden');
  ui.pause.classList.add('hidden');
  ui.dead.classList.add('hidden');
  ui.hud.classList.add('hidden');
  ui.bossHud.classList.add('hidden');
}

resetGame();
showMenu();
requestAnimationFrame(frame);
})();
