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
  stickKnob: document.getElementById('stickKnob'),
  swapBtn: document.getElementById('swapBtn'),
  touchPauseBtn: document.getElementById('touchPauseBtn'),
  touchMuteBtn: document.getElementById('touchMuteBtn'),
  touchMusicBtn: document.getElementById('touchMusicBtn'),
  masterVolume: document.getElementById('masterVolume'),
  masterVolumeText: document.getElementById('masterVolumeText'),
  musicVolume: document.getElementById('musicVolume'),
  musicVolumeText: document.getElementById('musicVolumeText'),
  sfxVolume: document.getElementById('sfxVolume'),
  sfxVolumeText: document.getElementById('sfxVolumeText'),
  pauseMusicToggle: document.getElementById('pauseMusicToggle'),
  pauseSfxToggle: document.getElementById('pauseSfxToggle'),
  settingsBtn: document.getElementById('settingsBtn'),
  exitBtn: document.getElementById('exitBtn'),
  exitInfo: document.getElementById('exitInfo'),
  startLoading: document.getElementById('startLoading'),
  startLoadingFill: document.getElementById('startLoadingFill'),
  avatarImage: document.getElementById('avatarImage'),
  avatarUploadBtn: document.getElementById('avatarUploadBtn'),
  avatarPresets: document.getElementById('avatarPresets'),
  avatarFileInput: document.getElementById('avatarFileInput'),
  profileMasterVolume: document.getElementById('profileMasterVolume'),
  profileMasterVolumeText: document.getElementById('profileMasterVolumeText'),
  profileSfxVolume: document.getElementById('profileSfxVolume'),
  profileSfxVolumeText: document.getElementById('profileSfxVolumeText'),
  profileMusicVolume: document.getElementById('profileMusicVolume'),
  profileMusicVolumeText: document.getElementById('profileMusicVolumeText'),
  profileShakeVolume: document.getElementById('profileShakeVolume'),
  profileShakeVolumeText: document.getElementById('profileShakeVolumeText'),
  avatarBtn: document.getElementById('avatarBtn'),
  avatarBtnImage: document.getElementById('avatarBtnImage'),
  levelSelect: document.getElementById('levelSelect'),
  nightLevels: document.getElementById('nightLevels'),
  dayLevels: document.getElementById('dayLevels'),
  shopBtn: document.getElementById('shopBtn'),
  upgradeBtn: document.getElementById('upgradeBtn'),
  inventoryBtn: document.getElementById('inventoryBtn'),
  extrasBtn: document.getElementById('extrasBtn'),
  levelListBtn: document.getElementById('levelListBtn'),
  levelView: document.getElementById('levelView'),
  levelListView: document.getElementById('levelListView'),
  profileView: document.getElementById('profileView'),
  shopView: document.getElementById('shopView'),
  upgradeView: document.getElementById('upgradeView'),
  inventoryView: document.getElementById('inventoryView'),
  extrasView: document.getElementById('extrasView'),
  playerName: document.getElementById('playerName'),
  playerLevel: document.getElementById('playerLevel'),
  diamondCount: document.getElementById('diamondCount'),
  goldCount: document.getElementById('goldCount'),
  prevLevelArrow: document.getElementById('prevLevelArrow'),
  nextLevelArrow: document.getElementById('nextLevelArrow'),
  prevLevelCard: document.getElementById('prevLevelCard'),
  currentLevelCard: document.getElementById('currentLevelCard'),
  nextLevelCard: document.getElementById('nextLevelCard'),
  startLevelBtn: document.getElementById('startLevelBtn'),
  playerNameInput: document.getElementById('playerNameInput'),
  comingSoon: document.getElementById('comingSoon'),
  levelComplete: document.getElementById('levelComplete'),
  levelClearTitle: document.getElementById('levelClearTitle'),
  clearLevelName: document.getElementById('clearLevelName'),
  clearHpRing: document.getElementById('clearHpRing'),
  levelStars: document.getElementById('levelStars'),
  levelHp: document.getElementById('levelHp'),
  levelScore: document.getElementById('levelScore'),
  levelWaves: document.getElementById('levelWaves'),
  levelKills: document.getElementById('levelKills'),
  restartLevelBtn: document.getElementById('restartLevelBtn'),
  levelLobbyBtn: document.getElementById('levelLobbyBtn')
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

const defaultInventory = ['melee', 'gun'];
const weapons = {
  melee: {
    name: '球棍', kind: 'melee', short: '棍', color: '#d9d9df', cooldown: .36, damage: 58, range: 106, arc: 1.32, knock: 360, infinite: true, starter: true,
    desc: '近身横扫'
  },
  machete: {
    name: '开山刀', kind: 'melee', short: '刀', color: '#ffcf72', cooldown: .24, damage: 46, range: 124, arc: 1.02, knock: 300, disposable: true, pickupUses: 55,
    desc: '快速劈砍'
  },
  gun: {
    name: '手枪', kind: 'gun', short: '枪', color: '#9fb4d8', cooldown: .16, damage: 32, bulletSpeed: 1150, spread: .045, knock: 150, ammoUse: 1, starter: true, shake: 2.0,
    desc: '远程点射'
  },
  smg: {
    name: '冲锋枪', kind: 'gun', short: '冲', color: '#7ee081', cooldown: .075, damage: 17, bulletSpeed: 1350, spread: .085, knock: 72, ammoUse: 1, pellets: 1, pickupAmmo: 128, disposable: true, shake: .35,
    desc: '自动连射'
  },
  shotgun: {
    name: '霰弹枪', kind: 'gun', short: '散', color: '#ff9d5a', cooldown: .58, damage: 22, bulletSpeed: 980, spread: .24, knock: 260, ammoUse: 1, pellets: 6, pickupAmmo: 28, disposable: true, shake: 4.6,
    desc: '近距爆发'
  },
  rifle: {
    name: '步枪', kind: 'gun', short: '狙', color: '#62a8ff', cooldown: .94, damage: 112, bulletSpeed: 1750, spread: .015, knock: 430, ammoUse: 1, pellets: 1, pickupAmmo: 18, disposable: true, shake: 6.0,
    desc: '高伤单发'
  }
};

const settings = (() => {
  const base = { master: .9, music: .95, sfx: .9, shake: .8 };
  try {
    const saved = JSON.parse(localStorage.getItem('zombie-settings') || '{}');
    if (typeof saved.master === 'number') base.master = clamp(saved.master, 0, 1);
    if (typeof saved.music === 'number') base.music = clamp(saved.music, 0, 1);
    if (typeof saved.sfx === 'number') base.sfx = clamp(saved.sfx, 0, 1);
    if (typeof saved.shake === 'number') base.shake = clamp(saved.shake, 0, 1);
  } catch (err) { /* localStorage 不可用时使用默认值 */ }
  return base;
})();
function saveSettings() {
  try { localStorage.setItem('zombie-settings', JSON.stringify(settings)); } catch (err) { /* 忽略隐私模式错误 */ }
}

const levels = [
  { id: 1, name: '第一关 · 街口', theme: 'night', totalWaves: 3, air: false, crates: false, desc: '纯地面僵尸 · 默认武器' },
  { id: 2, name: '第二关 · 巷战', theme: 'night', totalWaves: 5, air: false, crates: true, desc: '解锁补给箱' },
  { id: 3, name: '第三关 · 夜空威胁', theme: 'night', totalWaves: 7, air: true, crates: true, desc: '出现空中单位' },
  { id: 4, name: '第四关 · 白昼', theme: 'day', totalWaves: 5, air: false, crates: true, desc: '白天地图' },
  { id: 5, name: '第五关 · 烈日补给', theme: 'day', totalWaves: 6, air: true, crates: true, desc: '白天 + 空中单位' },
  { id: 6, name: '第六关 · 白日尸潮', theme: 'day', totalWaves: 8, air: true, crates: true, desc: '高难白昼战' }
];

function loadUnlocked() {
  try {
    const value = Number(localStorage.getItem('zombie-unlocked'));
    if (Number.isFinite(value) && value >= 1) return clamp(value, 1, levels.length);
  } catch (err) { /* 忽略存储错误 */ }
  return 1;
}

let unlockedLevel = loadUnlocked();
let currentLevel = levels[0];
let levelConfig = levels[0];
let selectedLevelIndex = 0;

const playerProfile = (() => {
  const base = { name: '玩家', level: 1, diamonds: 0, gold: 0 };
  try {
    const saved = JSON.parse(localStorage.getItem('zombie-profile') || '{}');
    if (typeof saved.name === 'string') base.name = saved.name.slice(0, 10);
    if (typeof saved.level === 'number') base.level = Math.max(1, saved.level);
    if (typeof saved.diamonds === 'number') base.diamonds = Math.max(0, saved.diamonds);
    if (typeof saved.gold === 'number') base.gold = Math.max(0, saved.gold);
  } catch (err) { /* 忽略存储错误 */ }
  return base;
})();
function saveProfile() {
  try { localStorage.setItem('zombie-profile', JSON.stringify(playerProfile)); } catch (err) { /* 忽略隐私模式错误 */ }
}
function updateLobbyStats() {
  ui.playerName.textContent = playerProfile.name || '玩家';
  ui.playerLevel.textContent = `LV ${Math.max(1, playerProfile.level)}`;
  ui.diamondCount.textContent = playerProfile.diamonds;
  ui.goldCount.textContent = playerProfile.gold;
  ui.playerNameInput.value = playerProfile.name || '玩家';
}

const avatarPresets = ['#2878d1', '#ff8a3d', '#7ee081', '#b57bd6', '#ffd166', '#ff5a5a'];
let avatarValue = (() => {
  try { return localStorage.getItem('zombie-avatar') || avatarPresets[0]; } catch (err) { return avatarPresets[0]; }
})();

function applyAvatar() {
  const value = avatarValue;
  [ui.avatarImage, ui.avatarBtnImage].forEach(el => {
    if (!el) return;
    el.style.background = value.startsWith('data:') ? `url(${value}) center/cover no-repeat` : value;
  });
}
function saveAvatar() {
  try { localStorage.setItem('zombie-avatar', avatarValue); } catch (err) { /* 头像过大或私有模式时忽略 */ }
}
function renderAvatarPresets() {
  ui.avatarPresets.innerHTML = '';
  avatarPresets.forEach(color => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.style.background = color;
    btn.title = '选择内置头像';
    btn.addEventListener('click', () => { avatarValue = color; saveAvatar(); applyAvatar(); });
    ui.avatarPresets.appendChild(btn);
  });
}
function openProfile() {
  syncSettingsUI();
  showLobbyView('profileView');
}

let state = 'menu';
let startLoadingTimer = null;
let cam = { x: 0, y: 0 };
let shake = 0;
let player, enemies, bullets, pickups, particles, texts, crates;
let wave, score, kills, spawnQueue, spawnTimer, nextWaveTimer, waveBannerAt;
let bossRef;
let last = 0;
let globalTime = 0;
let muted = false;
let musicEnabled = true;
let actx = null;
let theme = 'night';

const keys = Object.create(null);
const mouse = { x: W * .5, y: H * .45, active: false };
const input = { attack: false };
const stick = { active: false, id: -1, ox: 0, oy: 0, x: 0, y: 0 };
const touchFire = { active: false, id: -1 };

if (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(max-width: 820px)').matches) document.body.classList.add('touch');

function resetGame(config = currentLevel || levels[0]) {
  levelConfig = levels.find(l => l.id === config.id) || levels[0];
  currentLevel = levelConfig;
  player = {
    x: worldWidth * .5, y: 392, r: 20, hp: 100, maxHp: 100, speed: 236,
    weapon: 'gun', inventory: defaultInventory.slice(), ammoByWeapon: { gun: 72 },
    facing: 1, attackCd: 0, swing: 0, swingId: 0, swingHit: new Set(),
    invuln: .6, anim: 0, hurtFlash: 0, flash: 0, recoil: 0, step: 0, autoBackToGun: false
  };
  enemies = [];
  bullets = [];
  pickups = [];
  particles = [];
  texts = [];
  crates = [];
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
  theme = levelConfig.theme;
  spawnCrates(levelConfig.crates ? 8 : 0);
  if (ui.exitInfo) ui.exitInfo.classList.add('hidden');
  cam.x = clamp(player.x - W * .5, 0, worldWidth - W);
  cam.y = cameraYTarget();
  state = 'playing';
  ui.menu.classList.add('hidden');
  ui.dead.classList.add('hidden');
  ui.pause.classList.add('hidden');
  ui.levelSelect.classList.add('hidden');
  ui.levelComplete.classList.add('hidden');
  ui.bossHud.classList.add('hidden');
  ui.hud.classList.remove('hidden');
  updateHud();
  if (actx && musicEnabled) {
    music.setMode(currentMusicMode(), true);
    music.start();
  }
}

function currentMusicMode() {
  if (wave > 0 && wave % 5 === 0) return 'boss';
  return theme === 'day' ? 'day' : 'battle';
}

function cameraYTarget() {
  const t = (player.y - laneTop) / (laneBottom - laneTop);
  return lerp(-46, 24, clamp(t, 0, 1));
}

function startWave(n) {
  wave = n;
  theme = levelConfig.theme;
  const isLast = wave >= levelConfig.totalWaves;
  ui.bannerText.textContent = isLast ? `最终波 · 第 ${wave} 波` : (wave % 5 === 0 ? `第 ${wave} 波 · BOSS 来袭` : (theme === 'day' ? `第 ${wave} 波 · 白天` : `第 ${wave} 波`));
  ui.banner.classList.remove('hidden');
  waveBannerAt = 1.8;
  spawnQueue = [];
  const isBoss = wave % 5 === 0 && wave < levelConfig.totalWaves;
  const total = clamp(3 + Math.floor(wave * 1.5), 4, 20);
  for (let i = 0; i < total; i++) {
    const r = Math.random();
    if (wave < 2) spawnQueue.push('walker');
    else if (r < .44) spawnQueue.push('walker');
    else if (r < .70) spawnQueue.push('runner');
    else if (r < .86 || !levelConfig.air) spawnQueue.push('brute');
    else spawnQueue.push('spitter');
  }
  if (isBoss) {
    spawnQueue.push('boss');
    for (let i = 0; i < Math.min(6, 2 + Math.floor(wave / 5)); i++) spawnQueue.push(Math.random() < .6 ? 'runner' : 'walker');
    if (wave >= 8 && levelConfig.air) spawnQueue.push('spitter');
  }
  for (let i = spawnQueue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [spawnQueue[i], spawnQueue[j]] = [spawnQueue[j], spawnQueue[i]];
  }
  spawnTimer = 1.0;
  spawnCrates(Math.max(0, 7 + Math.floor(wave / 3) - crates.length), true);
  audio.wave();
  music.setMode(isBoss ? 'boss' : (theme === 'day' ? 'day' : 'battle'), true);
  updateHud();
}

function completeLevel() {
  if (state === 'levelcomplete') return;
  state = 'levelcomplete';
  const next = levels.find(l => l.id === currentLevel.id + 1);
  unlockedLevel = Math.max(unlockedLevel, next ? next.id : levels.length);
  try { localStorage.setItem('zombie-unlocked', String(unlockedLevel)); } catch (err) { /* 忽略存储错误 */ }
  const goldReward = 60 + currentLevel.totalWaves * 25 + kills * 2;
  const diamondReward = currentLevel.id % 5 === 0 ? 10 : 3;
  playerProfile.gold += goldReward;
  playerProfile.diamonds += diamondReward;
  playerProfile.level = Math.max(playerProfile.level, currentLevel.id);
  saveProfile();
  updateLobbyStats();
  renderLevelList();
  renderLevelCarousel();
  audio.bossDown();
  music.setMode('menu');
  music.stop(.55);
  const hpPct = player && player.maxHp ? clamp(Math.round(player.hp / player.maxHp * 100), 0, 100) : 0;
  const starCount = hpPct >= 100 ? 3 : hpPct >= 65 ? 2 : 1;
  const isPerfect = starCount === 3;
  ui.clearHpRing.style.setProperty('--hp', String(hpPct));
  ui.levelHp.textContent = `${hpPct}%`;
  ui.clearLevelName.textContent = currentLevel.name;
  ui.levelClearTitle.textContent = isPerfect ? '完美通关' : '关卡完成';
  ui.levelComplete.classList.toggle('perfect', isPerfect);
  Array.from(ui.levelStars.children).forEach((star, index) => {
    star.classList.toggle('active', index < starCount);
    star.style.animationDelay = `${180 + index * 160}ms`;
  });
  ui.levelScore.textContent = score;
  ui.levelWaves.textContent = Math.max(1, wave);
  ui.levelKills.textContent = kills;
  setTimeout(() => {
    ui.hud.classList.add('hidden');
    ui.levelComplete.classList.remove('hidden');
  }, 520);
}

function enterLobby() {
  if (startLoadingTimer) { clearInterval(startLoadingTimer); startLoadingTimer = null; }
  state = 'menu';
  music.stop(.25);
  if (actx && musicEnabled) music.setMode('menu', true);
  updateLobbyStats();
  renderLevelCarousel();
  renderLevelList();
  showLobbyView('levelView', true);
  ui.menu.classList.add('hidden');
  ui.dead.classList.add('hidden');
  ui.pause.classList.add('hidden');
  ui.levelComplete.classList.add('hidden');
  ui.bossHud.classList.add('hidden');
  ui.hud.classList.add('hidden');
  ui.levelSelect.classList.remove('hidden');
}

function renderLevelList() {
  const groups = { night: ui.nightLevels, day: ui.dayLevels };
  groups.night.innerHTML = '';
  groups.day.innerHTML = '';
  levels.forEach(level => {
    const locked = level.id > unlockedLevel;
    const completed = level.id < unlockedLevel;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `level-card${locked ? ' locked' : ''}`;
    btn.disabled = locked;
    btn.innerHTML = `<span><b>${level.id}. ${level.name}</b><span>${level.desc}</span></span><span class="lock">${locked ? '🔒' : completed ? '已通关' : level === currentLevel ? '当前' : '可挑战'}</span>`;
    btn.addEventListener('click', () => startLevel(level));
    groups[level.theme].appendChild(btn);
  });
}

function unlockedLevels() { return levels.filter(l => l.id <= unlockedLevel); }
function renderLevelCarousel() {
  const unlocked = unlockedLevels();
  selectedLevelIndex = clamp(selectedLevelIndex, 0, unlocked.length - 1);
  const level = unlocked[selectedLevelIndex] || levels[0];
  currentLevel = level;
  const prev = unlocked[selectedLevelIndex - 1];
  const next = levels[level.id]; // 下一关卡对象
  const nextLocked = !!next && next.id > unlockedLevel;
  ui.prevLevelCard.classList.toggle('hidden', !prev);
  ui.currentLevelCard.classList.remove('hidden');
  ui.nextLevelCard.classList.toggle('hidden', !next);
  if (prev) fillCarouselCard(ui.prevLevelCard, prev, false, false);
  fillCarouselCard(ui.currentLevelCard, level, false, false);
  if (next) fillCarouselCard(ui.nextLevelCard, next, nextLocked, true);
  ui.prevLevelArrow.disabled = selectedLevelIndex <= 0;
  ui.nextLevelArrow.disabled = !next || nextLocked;
  ui.startLevelBtn.textContent = `开始作战 · ${level.name.split(' · ')[0]}`;
}

function fillCarouselCard(card, level, locked, isNext) {
  card.classList.toggle('locked', locked);
  card.disabled = locked;
  card.innerHTML = `<span><b>${level.id}. ${level.name}</b><span class="level-theme">${level.theme === 'day' ? '白天地图' : '黑夜地图'} · ${level.totalWaves} 波</span><span>${level.desc}</span></span><span class="level-lock">${locked ? '🔒' : ''}</span>`;
}

function selectLevelBy(delta) {
  const unlocked = unlockedLevels();
  const nextIndex = clamp(selectedLevelIndex + delta, 0, unlocked.length - 1);
  if (nextIndex !== selectedLevelIndex) {
    selectedLevelIndex = nextIndex;
    renderLevelCarousel();
  }
}

const lobbyViewIds = ['levelView', 'levelListView', 'profileView', 'shopView', 'upgradeView', 'inventoryView', 'extrasView'];
let currentLobbyView = 'levelView';
function showLobbyView(name, silent = false) {
  if (!lobbyViewIds.includes(name)) name = 'levelView';
  currentLobbyView = name;
  lobbyViewIds.forEach(viewId => {
    if (ui[viewId]) ui[viewId].classList.toggle('hidden', viewId !== name);
  });
  document.querySelectorAll('.lobby-actions [data-lobby-view]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lobbyView === name && btn.id !== 'extrasBtn');
  });
  if (name === 'levelListView') renderLevelList();
  if (name === 'profileView') syncSettingsUI();
  if (!silent && actx) audio.wave();
}
function startSelectedLevel() {
  const level = unlockedLevels()[selectedLevelIndex] || levels[0];
  if (!level || level.id > unlockedLevel) {
    showComingSoon('当前关卡尚未解锁');
    return;
  }
  startLevel(level);
}

function startLevel(level) {
  if (!level) return;
  if (state === 'playing' && level === currentLevel) return;
  if (level.id > unlockedLevel) {
    showComingSoon('该关卡尚未解锁');
    return;
  }
  currentLevel = level;
  selectedLevelIndex = Math.max(0, unlockedLevels().findIndex(l => l.id === level.id));
  resetGame(level);
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
    spitter: { hp: 48, speed: 82, dmg: 8, r: 18, score: 24, scale: .9, color: '#8b7bd6', flying: true, shotCd: 1.4 },
    boss: { hp: 820 + wave * 160, speed: 54, dmg: 28, r: 58, score: 260, scale: 2.35, color: '#386b4b' }
  }[type];
  const z = Object.assign({
    type, x, y, maxHp: base.hp, hp: base.hp, attackCd: rand(.4, 1.1),
    phase: rand(0, 10), kx: 0, ky: 0, hurt: 0, dead: false, climbT: type === 'boss' ? 0 : rand(.55, 1.2)
  }, base);
  if (type === 'spitter') {
    x = cam.x + (Math.random() < .5 ? -80 : W + 80);
    y = laneTop - 126 + rand(-22, 24);
    z.x = x;
    z.y = y;
    z.shotTimer = rand(.7, 1.7);
  }
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

function spawnCrates(count, allowNearPlayer = false) {
  for (let i = 0; i < count; i++) {
    let x = rand(180, worldWidth - 180);
    if (!allowNearPlayer && player && Math.abs(x - player.x) < 300) x = player.x + (x > player.x ? 300 : -300);
    crates.push({
      x: clamp(x, 150, worldWidth - 150),
      y: rand(laneTop + 34, laneBottom - 22),
      w: rand(48, 64),
      h: rand(42, 56),
      hp: 44,
      maxHp: 44,
      tilt: rand(-.16, .16),
      hit: 0
    });
  }
}

function damageCrate(c, dmg) {
  c.hp -= dmg;
  c.hit = .12;
  for (let i = 0; i < 6; i++) {
    const a = rand(0, Math.PI * 2), sp = rand(70, 220);
    particles.push({ x: c.x + rand(-18, 18), y: c.y - c.h * .5 + rand(-14, 14), vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 80, life: rand(.18, .36), max: .36, r: rand(2, 4), color: Math.random() < .7 ? '#b5793e' : '#6f4a28', g: 430 });
  }
  audio.crate();
  if (c.hp <= 0) breakCrate(c);
}

function breakCrate(c) {
  const idx = crates.indexOf(c);
  if (idx < 0) return;
  crates.splice(idx, 1);
  score += 15;
  addShake(3);
  audio.crateBreak();
  for (let i = 0; i < 26; i++) {
    const a = rand(0, Math.PI * 2), sp = rand(90, 360);
    particles.push({ x: c.x, y: c.y - c.h * .5, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 140, life: rand(.28, .62), max: .62, r: rand(2.5, 5), color: i % 4 ? '#b5793e' : '#ffd166', g: 420 });
  }
  const r = Math.random();
  let kind = 'ammo';
  if (r < .28) kind = 'health';
  else if (r < .72) kind = 'ammo';
  else {
    const weaponRoll = Math.random();
    kind = weaponRoll < .4 ? 'smg' : weaponRoll < .72 ? 'shotgun' : weaponRoll < .94 ? 'machete' : 'rifle';
  }
  spawnPickup(c.x, c.y - 6, kind);
  texts.push({ x: c.x, y: c.y - 66, vy: -70, life: .95, max: .95, text: '补给箱已破坏', color: '#ffd166' });
  updateHud();
}

function weaponAmmo(name = player ? player.weapon : 'gun') {
  if (!player) return weapons[name].kind === 'melee' ? Infinity : 0;
  const w = weapons[name];
  if (!w) return 0;
  if (w.kind === 'melee') return Infinity;
  return Number.isFinite(player.ammoByWeapon[name] ?? 0) ? player.ammoByWeapon[name] : 0;
}

function removeDisposableWeapon(name = player.weapon) {
  if (!player || !weapons[name] || !weapons[name].disposable) return false;
  const idx = player.inventory.indexOf(name);
  if (idx >= 0) player.inventory.splice(idx, 1);
  player.ammoByWeapon[name] = 0;
  return true;
}

function tryAttack() {
  if (state !== 'playing' || player.attackCd > 0) return;
  const w = weapons[player.weapon];
  const aim = currentAim();
  player.facing = Math.cos(aim) >= 0 ? 1 : -1;
  if (w.kind === 'melee') {
    player.attackCd = w.cooldown;
    player.swing = w.name === '开山刀' ? .17 : .24;
    player.swingId++;
    player.swingHit = new Set();
    const ox = player.x;
    const oy = player.y - 39;
    audio.swing(w.name === '开山刀' ? 860 : 720);
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
    for (const c of crates) {
      const dx = c.x - ox, dy = c.y - c.h * .5 - oy;
      const d = Math.hypot(dx, dy);
      const a = Math.atan2(dy, dx);
      if (d <= w.range + c.w * .55 && angleDiff(a, aim) <= w.arc * .5 + .15) damageCrate(c, w.damage);
    }
    for (let i = 0; i < 10; i++) {
      const sp = rand(120, 320), a = aim + rand(-.6, .6);
      particles.push({ x: ox + Math.cos(aim) * 40, y: oy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 60, life: rand(.16, .34), max: .34, r: rand(2, 4), color: '#d8dde6', g: 260 });
    }
    if (w.disposable) {
      const uses = Math.max(0, Number(player.ammoByWeapon[player.weapon] || 0) - 1);
      player.ammoByWeapon[player.weapon] = uses;
      if (uses <= 0) {
        texts.push({ x: player.x, y: player.y - 96, vy: -58, life: 1.1, max: 1.1, text: `${w.name} 已损坏`, color: '#ffd166' });
        removeDisposableWeapon(player.weapon);
        selectWeapon(player.ammoByWeapon.gun > 0 ? 'gun' : 'melee', false);
      }
    }
  } else {
    const ammo = weaponAmmo(player.weapon);
    if (ammo < w.ammoUse) {
      player.attackCd = .22;
      audio.dry();
      if (w.disposable) {
        texts.push({ x: player.x, y: player.y - 96, vy: -58, life: 1.1, max: 1.1, text: `${w.name} 子弹耗尽`, color: '#ffd166' });
        removeDisposableWeapon(player.weapon);
        selectWeapon(player.ammoByWeapon.gun > 0 ? 'gun' : 'melee', false);
      } else {
        player.weapon = 'melee';
        player.autoBackToGun = true;
        texts.push({ x: player.x, y: player.y - 96, vy: -58, life: 1.1, max: 1.1, text: '子弹耗尽 · 已切换球棍', color: '#ffd166' });
      }
      updateHud();
      return;
    }
    player.autoBackToGun = false;
    player.attackCd = w.cooldown;
    player.ammoByWeapon[player.weapon] = ammo - w.ammoUse;
    if (player.weapon === 'gun') player.ammo = player.ammoByWeapon.gun;
    player.flash = .06;
    player.recoil = 1;
    addShake(w.shake || 2.0);
    audio.bang(w.pellets > 1 ? 'shotgun' : w.name === '步枪' ? 'rifle' : 'gun');
    const shots = w.pellets || 1;
    const mx = player.x + Math.cos(aim) * 24;
    const my = player.y - 62 + Math.sin(aim) * 24;
    for (let s = 0; s < shots; s++) {
      const spread = rand(-w.spread, w.spread);
      const a = aim + spread;
      bullets.push({ x: mx, y: my, px: mx, py: my, vx: Math.cos(a) * w.bulletSpeed, vy: Math.sin(a) * w.bulletSpeed, life: w.name === '步枪' ? 1.35 : 1.0, dmg: w.damage, knock: w.knock, color: w.color, friendly: true });
    }
    for (let i = 0; i < 7; i++) {
      const sp = rand(70, 220), aa = aim + rand(-.38, .38);
      particles.push({ x: mx, y: my, vx: Math.cos(aa) * sp, vy: Math.sin(aa) * sp, life: rand(.08, .18), max: .18, r: rand(1.5, 3), color: i ? '#ffcf72' : '#fff2b8', g: 40 });
    }
    if (w.name !== '冲锋枪') particles.push({ x: player.x - player.facing * 16, y: player.y - 28, vx: -player.facing * rand(40, 90), vy: -rand(30, 90), life: .5, max: .5, r: 3.2, color: '#d8b25a', g: 500, casing: true });
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
  if (z.flying) {
    for (let i = 0; i < 28; i++) {
      const a = rand(-Math.PI * .9, Math.PI * .1), sp = rand(70, 300);
      particles.push({ x: z.x + rand(-10, 10), y: z.y - z.r * .65, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp + 80, life: rand(.3, .8), max: .8, r: rand(2.2, 4.6), color: Math.random() < .8 ? '#b92e2e' : '#7a1d1d', g: 720 });
    }
    decals.push({ x: clamp(z.x, 60, worldWidth - 60), y: laneBottom - rand(0, 24), r: clamp(z.r * .75, 10, 34), alpha: .55 });
  } else {
    decals.push({ x: z.x, y: z.y, r: clamp(z.r * 1.15, 12, 52), alpha: .55 });
  }
  if (decals.length > 46) decals.shift();
  updateHud();
}

function spawnPickup(x, y, kind) {
  pickups.push({ kind, x: clamp(x, 60, worldWidth - 60), y: clamp(y, laneTop + 10, laneBottom - 8), bob: rand(0, 10), life: 16 });
}

function addShake(v) { shake = Math.min(24, shake + v * clamp(settings.shake ?? 1, 0, 1)); }

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
    if (wave >= levelConfig.totalWaves) {
      completeLevel();
      return;
    }
    nextWaveTimer = wave > 0 ? 3.4 : 1.2;
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
    if (b.enemy) {
      const pr = player.r + 8;
      if (state === 'playing' && player.invuln <= 0 && segmentCircle(b.px, b.py, b.x, b.y, player.x, player.y - 30, pr)) {
        player.hp -= b.dmg;
        player.invuln = .62;
        player.hurtFlash = .26;
        player.knockX = Math.sign(b.vx) * Math.abs(b.knock || 90);
        player.knockY = -70;
        addShake(5);
        audio.hurt();
        updateHud();
        hit = true;
      }
    } else {
      for (const c of crates) {
        if (segmentRect(b.px, b.py, b.x, b.y, c.x - c.w / 2, c.y - c.h * .75, c.w, c.h)) {
          damageCrate(c, b.dmg);
          hit = true;
          break;
        }
      }
      if (!hit) for (const z of enemies) {
        if (z.dead) continue;
        const hitR = z.r + 10;
        if (segmentCircle(b.px, b.py, b.x, b.y, z.x, z.y - z.r * .55, hitR)) {
          damageZombie(z, b.dmg, Math.atan2(b.vy, b.vx), b.knock || weapons.gun.knock);
          hit = true;
          break;
        }
      }
    }
    if (hit || b.life <= 0 || b.x < cam.x - 120 || b.x > cam.x + W + 120 || b.y < -160 || b.y > H + 180) bullets.splice(i, 1);
  }
}

function segmentRect(x0, y0, x1, y1, rx, ry, rw, rh) {
  return segmentCircle(x0, y0, x1, y1, rx, ry, 0) ||
    segmentCircle(x0, y0, x1, y1, rx + rw, ry, 0) ||
    segmentCircle(x0, y0, x1, y1, rx, ry + rh, 0) ||
    segmentCircle(x0, y0, x1, y1, rx + rw, ry + rh, 0) ||
    segmentCircle(x0, y0, x1, y1, rx + rw * .5, ry + rh * .5, Math.min(rw, rh) * .5);
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
    if (z.flying) {
      const hoverY = laneTop - 128 + Math.sin(z.phase) * 32;
      const dirX = Math.abs(dx) < 250 ? -Math.sign(dx) : Math.abs(dx) > 520 ? Math.sign(dx) : 0;
      z.x += dirX * z.speed * dt;
      z.y += (hoverY - z.y) * 3 * dt;
      z.x += z.kx * dt;
      z.y += z.ky * dt;
      z.x = clamp(z.x, cam.x - 260, cam.x + W + 260);
      z.y = clamp(z.y, laneTop - 186, laneTop - 54);
      z.shotTimer = Math.max(0, z.shotTimer - dt);
      if (z.shotTimer <= 0 && Math.abs(dx) < 620) {
        z.shotTimer = rand(1.25, 2.25);
        const ax = z.x, ay = z.y - 20;
        const a = Math.atan2(player.y - 32 - ay, player.x - ax);
        const sp = 560;
        bullets.push({ x: ax, y: ay, px: ax, py: ay, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1.75, dmg: z.dmg, knock: 120, enemy: true, color: '#9dff66' });
        audio.spit();
      }
      continue;
    }
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
    const r = 30;
    if (p.life <= 0 || dist2(p.x, p.y - 18, player.x, player.y - 22) <= r * r) {
      if (p.life > 0) {
        if (p.kind === 'health') {
          player.hp = Math.min(player.maxHp, player.hp + 28);
          texts.push({ x: player.x, y: player.y - 88, vy: -64, life: .9, max: .9, text: '+28 HP', color: '#7ee081' });
        } else if (weapons[p.kind]) {
          const w = weapons[p.kind];
          const currentName = player.weapon;
          if (currentName !== p.kind && weapons[currentName] && weapons[currentName].disposable) removeDisposableWeapon(currentName);
          if (!player.inventory.includes(p.kind)) player.inventory.push(p.kind);
          player.ammoByWeapon[p.kind] = w.kind === 'melee' ? (w.pickupUses || 1) : (w.pickupAmmo || 1);
          player.weapon = p.kind;
          player.swing = 0;
          texts.push({ x: player.x, y: player.y - 88, vy: -64, life: .95, max: .95, text: w.disposable ? `获得 ${w.name}（补给）` : `获得 ${w.name}`, color: w.disposable ? '#ffd166' : '#62a8ff' });
          audio.weaponPick();
        } else if (p.kind === 'ammo') {
          player.ammoByWeapon.gun = (player.ammoByWeapon.gun || 0) + 36;
          player.ammo = player.ammoByWeapon.gun;
          if (player.weapon === 'melee' && player.autoBackToGun) {
            player.weapon = 'gun';
            player.autoBackToGun = false;
            texts.push({ x: player.x, y: player.y - 112, vy: -58, life: 1.0, max: 1.0, text: '已恢复手枪', color: '#62a8ff' });
          }
          texts.push({ x: player.x, y: player.y - 88, vy: -64, life: .9, max: .9, text: '+36 手枪子弹', color: '#ffd166' });
        }
        if (p.kind === 'health' || p.kind === 'ammo') audio.pickup();
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
  ui.weaponName.textContent = w ? `${w.name}${w.disposable ? ' · 补给' : ''}` : '球棍';
  if (!player || !w) ui.ammoText.textContent = '子弹 ∞';
  else if (w.kind === 'melee' && w.infinite) ui.ammoText.textContent = '近战 · 无限耐久';
  else if (w.kind === 'melee') ui.ammoText.textContent = `耐久 ${Math.max(0, Math.round(player.ammoByWeapon[player.weapon] || 0))}`;
  else {
    const ammo = Math.round(weaponAmmo(player.weapon));
    ui.ammoText.textContent = ammo === 0 && w.disposable ? '补给武器 · 已耗尽' : `子弹 ${ammo}`;
  }
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
  drawCrates();
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
  if (theme === 'day') {
    g.addColorStop(0, '#58a9ff');
    g.addColorStop(.36, '#8fd4ff');
    g.addColorStop(.72, '#d9f2ff');
    g.addColorStop(1, '#b6d8e8');
  } else {
    g.addColorStop(0, '#101726');
    g.addColorStop(.42, '#26253a');
    g.addColorStop(.72, '#5a3540');
    g.addColorStop(1, '#2c232c');
  }
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.save();
  if (theme === 'day') {
    const sunX = W * .74 - cam.x * .04, sunY = H * .18;
    ctx.globalAlpha = .9;
    ctx.fillStyle = '#fff3a8';
    ctx.beginPath(); ctx.arc(sunX, sunY, 46, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = .24;
    ctx.fillStyle = '#fff7c4';
    ctx.beginPath(); ctx.arc(sunX, sunY, 82, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.62)';
    for (let i = 0; i < 5; i++) {
      const cx = ((i * 241 - cam.x * .06) % W + W) % W;
      const cy = 48 + (i % 3) * 44;
      ctx.beginPath(); ctx.ellipse(cx, cy, 82, 19, 0, 0, Math.PI * 2); ctx.fill();
    }
  } else {
    ctx.globalAlpha = .8;
    ctx.fillStyle = '#f2dd9b';
    const moonX = W * .78 - cam.x * .02, moonY = H * .18;
    ctx.beginPath(); ctx.arc(moonX, moonY, 38, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = .16;
    ctx.beginPath(); ctx.arc(moonX + 12, moonY - 8, 54, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
  if (theme !== 'day') {
    for (let i = 0; i < 34; i++) {
      const x = ((i * 173 - cam.x * .06) % W + W) % W;
      const y = ((i * 91 + 34) % (laneTop - 50)) + 12;
      ctx.globalAlpha = .18 + ((i % 5) / 10);
      ctx.fillStyle = '#fff';
      ctx.fillRect(x, y, 2, 2);
    }
  }
  ctx.globalAlpha = 1;
}

function drawFarCity() {
  ctx.save();
  ctx.translate(-cam.x * .28, cam.y * .35 + 8);
  for (const b of farLayer) {
    if (b.x + b.w < cam.x * .28 - 120 || b.x > cam.x * .28 + W + 120) continue;
    ctx.fillStyle = theme === 'day'
      ? `rgba(${104 + Math.floor(b.tone * 26)},${122 + Math.floor(b.tone * 22)},${152},.82)`
      : `rgba(${28 + Math.floor(b.tone * 18)},${31 + Math.floor(b.tone * 18)},${48},.72)`;
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.fillStyle = theme === 'day' ? 'rgba(255,255,255,.36)' : 'rgba(255,214,120,.15)';
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
    ctx.fillStyle = theme === 'day' ? '#9eabb8' : '#151a25';
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.fillStyle = theme === 'day' ? 'rgba(255,255,255,.5)' : 'rgba(255,184,92,.16)';
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
  if (theme === 'day') {
    g.addColorStop(0, '#8aa06b');
    g.addColorStop(.45, '#a7b86d');
    g.addColorStop(1, '#7d9262');
  } else {
    g.addColorStop(0, '#161b26');
    g.addColorStop(.45, '#232433');
    g.addColorStop(1, '#141722');
  }
  ctx.fillStyle = g;
  ctx.fillRect(x0, laneTop - 40, w, laneBottom - laneTop + 150);
  ctx.fillStyle = 'rgba(255,255,255,.05)';
  ctx.fillRect(x0, laneTop, w, 4);
  ctx.fillStyle = theme === 'day' ? 'rgba(74,128,79,.24)' : 'rgba(126,224,129,.16)';
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

function drawCrates() {
  for (const c of crates) {
    if (c.x < cam.x - 90 || c.x > cam.x + W + 90) continue;
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(c.tilt * .12);
    ctx.fillStyle = 'rgba(0,0,0,.3)';
    ctx.beginPath(); ctx.ellipse(0, c.h * .5, c.w * .62, c.h * .26, 0, 0, Math.PI * 2); ctx.fill();
    ctx.translate(0, -c.h * .22);
    ctx.fillStyle = c.hit > 0 ? '#e4b574' : '#a86638';
    rr(ctx, -c.w / 2, -c.h / 2, c.w, c.h, 6); ctx.fill();
    ctx.strokeStyle = '#6b3f25';
    ctx.lineWidth = 4;
    ctx.strokeRect(-c.w / 2, -c.h / 2, c.w, c.h);
    ctx.beginPath(); ctx.moveTo(-c.w / 2, 0); ctx.lineTo(c.w / 2, 0); ctx.moveTo(0, -c.h / 2); ctx.lineTo(0, c.h / 2); ctx.stroke();
    ctx.fillStyle = 'rgba(255,209,102,.78)';
    rr(ctx, -c.w * .22, -c.h * .2, c.w * .44, c.h * .4, 4); ctx.fill();
    ctx.restore();
    if (c.hp < c.maxHp) {
      const bw = c.w * .72;
      ctx.fillStyle = 'rgba(0,0,0,.55)';
      rr(ctx, c.x - bw / 2, c.y - c.h * .72, bw, 5, 2); ctx.fill();
      ctx.fillStyle = c.hp / c.maxHp > .5 ? '#7ee081' : '#ffd166';
      rr(ctx, c.x - bw / 2 + 1, c.y - c.h * .72 + 1, (bw - 2) * clamp(c.hp / c.maxHp, 0, 1), 3, 1.5); ctx.fill();
    }
    c.hit = Math.max(0, c.hit - .016);
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
    } else if (weapons[p.kind]) {
      const w = weapons[p.kind];
      ctx.fillStyle = '#252b36';
      rr(ctx, -17, -11, 36, 24, 6); ctx.fill();
      ctx.strokeStyle = w.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(-14, -8, 30, 18);
      ctx.fillStyle = w.color;
      if (w.kind === 'melee') {
        ctx.save(); ctx.rotate(-.35);
        ctx.fillRect(-12, -3, 26, 7);
        ctx.restore();
      } else {
        ctx.save(); ctx.rotate(.12);
        ctx.fillRect(-10, -3, 24, 6);
        ctx.fillStyle = '#151a23';
        ctx.fillRect(10, -5, 5, 10);
        ctx.restore();
      }
      ctx.fillStyle = '#fff';
      ctx.font = '900 10px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(w.short, -2, -15);
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
  const type = z.type || 'walker';
  const bodyH = z.r * 1.5;
  const accent = { walker: '#476942', runner: '#6f8c3e', brute: '#2d564a', spitter: '#5548a1', boss: '#2a4d3a' }[type] || '#496a43';

  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = 'rgba(0,0,0,.36)';
  ctx.beginPath(); ctx.ellipse(0, 2, z.r * 1.05, z.r * .36, 0, 0, Math.PI * 2); ctx.fill();

  if (z.flying) {
    const flap = Math.sin(z.phase * 3.4) * 12;
    const wingColor = z.hurt > 0 ? '#ffd0cb' : accent;
    for (const dir of [-1, 1]) {
      ctx.save();
      ctx.scale(dir, 1);
      ctx.fillStyle = wingColor;
      ctx.strokeStyle = 'rgba(16,12,28,.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-2, -z.r * .85);
      ctx.quadraticCurveTo(-z.r * 1.2, -z.r * 1.54 - flap, -z.r * 1.85, -z.r * 1.12 - flap * .6);
      ctx.quadraticCurveTo(-z.r * 1.45, -z.r * .72 - flap * .5, -z.r * 1.72, -z.r * .22 - flap * .3);
      ctx.quadraticCurveTo(-z.r * 1.1, -z.r * .48, -2, -z.r * .85);
      ctx.fill(); ctx.stroke();
      ctx.strokeStyle = 'rgba(220,180,255,.28)';
      ctx.beginPath(); ctx.moveTo(-3, -z.r * .85); ctx.lineTo(-z.r * 1.5, -z.r * .55 - flap * .5); ctx.stroke();
      ctx.restore();
    }
    ctx.fillStyle = '#c7f28a';
    ctx.beginPath(); ctx.arc(0, -z.r * 1.3, 5, 0, Math.PI * 2); ctx.fill();
  }

  ctx.save();
  ctx.scale(z.scale, z.scale);
  ctx.translate(0, -bodyH * .5);
  const main = z.hurt > 0 ? '#ffd0cb' : z.color;
  const torsoW = type === 'brute' || type === 'boss' ? z.r * 1.05 : z.r * .78;
  ctx.lineCap = 'round';

  ctx.strokeStyle = main;
  ctx.lineWidth = type === 'brute' || type === 'boss' ? 12 : 9;
  ctx.beginPath();
  ctx.moveTo(-7, bodyH * .5 + walk * 6); ctx.lineTo(-4, bodyH * .12);
  ctx.moveTo(7, bodyH * .5 - walk * 6); ctx.lineTo(4, bodyH * .12);
  ctx.stroke();

  ctx.fillStyle = main;
  rr(ctx, -torsoW * .5, -bodyH * .12, torsoW, bodyH * .62, type === 'brute' || type === 'boss' ? 14 : 10);
  ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,.18)';
  rr(ctx, torsoW * .08, -bodyH * .12, torsoW * .42, bodyH * .62, 9);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.11)';
  rr(ctx, -torsoW * .42, -bodyH * .09, torsoW * .22, bodyH * .48, 7);
  ctx.fill();

  ctx.save();
  ctx.strokeStyle = 'rgba(24,34,28,.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-torsoW * .28, bodyH * .22); ctx.lineTo(torsoW * .24, bodyH * .28);
  ctx.moveTo(-torsoW * .2, bodyH * .34); ctx.lineTo(torsoW * .28, bodyH * .38);
  ctx.stroke();
  ctx.fillStyle = accent;
  rr(ctx, -torsoW * .42, -bodyH * .22, torsoW * .84, 9, 4); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.15)';
  rr(ctx, -torsoW * .36, -bodyH * .2, torsoW * .18, 5, 2); ctx.fill();

  const shoulderY = type === 'runner' ? bodyH * .05 : 2;
  ctx.strokeStyle = main;
  ctx.lineWidth = type === 'brute' || type === 'boss' ? 11 : 7;
  ctx.beginPath();
  ctx.moveTo(-9, shoulderY); ctx.lineTo(-18 - Math.abs(arm) * (type === 'runner' ? 1.4 : 1), -8 - arm);
  ctx.moveTo(9, shoulderY); ctx.lineTo(18 + Math.abs(arm) * (type === 'runner' ? 1.4 : 1), -2 + arm);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.translate(0, -bodyH * .12 - 5);
  if (type === 'runner') ctx.rotate(Math.sin(z.phase * 1.7) * .1);
  ctx.fillStyle = main;
  ctx.beginPath(); ctx.arc(0, -20, type === 'boss' ? 18 : 13, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,.26)';
  ctx.beginPath(); ctx.arc(4, -25, type === 'boss' ? 16 : 12, Math.PI * 1.04, Math.PI * 1.9); ctx.fill();
  ctx.fillStyle = z.hurt > 0 ? '#ff8e7a' : '#ff4d4d';
  ctx.beginPath(); ctx.arc(-4, -22, 2.6, 0, Math.PI * 2); ctx.arc(4, -22, 2.6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.72)';
  ctx.beginPath(); ctx.arc(-4.8, -22.8, .8, 0, Math.PI * 2); ctx.arc(3.2, -22.8, .8, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#160d10';
  rr(ctx, -6, -16, 12, 4, 1); ctx.fill();
  ctx.strokeStyle = 'rgba(255,245,240,.62)';
  ctx.lineWidth = 1;
  for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i * 2.2, -16); ctx.lineTo(i * 2.2, -12.4); ctx.stroke(); }
  ctx.strokeStyle = 'rgba(120,20,20,.36)';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-8, -13); ctx.lineTo(-13, -8); ctx.stroke();
  ctx.restore();

  if (type === 'boss') {
    ctx.fillStyle = accent;
    rr(ctx, -z.r * .58, -bodyH * .18, z.r * 1.16, bodyH * .72, 14); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.13)';
    rr(ctx, -z.r * .48, -bodyH * .16, z.r * .28, bodyH * .62, 7); ctx.fill();
    ctx.fillStyle = '#17261e';
    rr(ctx, -z.r * .42, -bodyH * .2, z.r * .84, 8, 4); ctx.fill();
    ctx.fillStyle = '#c7d3c2';
    for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.arc(i * 10, -bodyH * .2, 3, 0, Math.PI * 2); ctx.fill(); }
  } else if (type === 'brute') {
    ctx.fillStyle = accent;
    rr(ctx, -z.r * .62, -bodyH * .16, z.r * 1.24, 11, 5); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,.24)';
    rr(ctx, -z.r * .42, -bodyH * .13, z.r * .28, bodyH * .48, 5); ctx.fill();
  } else if (type === 'runner') {
    ctx.fillStyle = 'rgba(0,0,0,.2)';
    rr(ctx, -z.r * .52, -bodyH * .08, z.r * 1.04, 7, 4); ctx.fill();
  }
  ctx.restore();
  ctx.restore();

  const bw = Math.max(28, z.r * 1.35);
  const pct = clamp(z.hp / z.maxHp * 100, 0, 100);
  ctx.fillStyle = 'rgba(0,0,0,.55)';
  rr(ctx, x - bw / 2, y - z.r * 2.35, bw, 6, 3); ctx.fill();
  ctx.fillStyle = pct > 55 ? '#7ee081' : pct > 28 ? '#ffd166' : '#ff5a5a';
  rr(ctx, x - bw / 2 + 1.5, y - z.r * 2.35 + 1.5, (bw - 3) * pct / 100, 3, 1.5); ctx.fill();
}

function drawGunArt(name, flash) {
  const cfg = ({
    '手枪': { len: 44, h: 13, body: '#27313f', dark: '#11161f', accent: '#aabfdf', barrel: 14, grip: 15, mag: 0 },
    '冲锋枪': { len: 58, h: 14, body: '#233127', dark: '#101815', accent: '#7ee081', barrel: 20, grip: 18, mag: 17 },
    '霰弹枪': { len: 66, h: 16, body: '#3a2c26', dark: '#171210', accent: '#ff9d5a', barrel: 32, grip: 19, pump: true },
    '步枪': { len: 82, h: 15, body: '#1e2937', dark: '#0f141c', accent: '#62a8ff', barrel: 46, grip: 20, scope: true }
  })[name] || { len: 46, h: 13, body: '#28313f', dark: '#131821', accent: '#aabfdf', barrel: 15, grip: 15 };
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.fillStyle = 'rgba(0,0,0,.34)';
  rr(ctx, 2, -cfg.h * .32 + 4, cfg.len, cfg.h, 4); ctx.fill();
  ctx.fillStyle = cfg.dark;
  rr(ctx, 2, -cfg.h * .5, cfg.len * .72, cfg.h, 4); ctx.fill();
  ctx.fillStyle = cfg.body;
  rr(ctx, 0, -cfg.h * .5, cfg.len, cfg.h, 4); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.18)';
  rr(ctx, 3, -cfg.h * .42, cfg.len * .82, 3, 1.5); ctx.fill();
  ctx.fillStyle = cfg.dark;
  rr(ctx, cfg.len * .58, -3.5, cfg.barrel, 7, 3); ctx.fill();
  ctx.fillStyle = cfg.body;
  rr(ctx, cfg.len * .58, -2.5, cfg.barrel, 5, 2.5); ctx.fill();
  ctx.fillStyle = cfg.accent;
  rr(ctx, cfg.len * .85, -1.5, cfg.len * .12, 3, 1.5); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cfg.len * .12, cfg.h * .38); ctx.lineTo(cfg.len * .05, cfg.grip); ctx.lineTo(cfg.len * .3, cfg.grip + 2); ctx.lineTo(cfg.len * .3, cfg.h * .42); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = cfg.dark; ctx.lineWidth = 1.4;
  for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(cfg.len * (.11 + i * .06), cfg.h * .45 + i * 3.5); ctx.lineTo(cfg.len * (.27 + i * .03), cfg.h * .48 + i * 3.5); ctx.stroke(); }
  ctx.fillStyle = cfg.dark;
  rr(ctx, cfg.len * .34, 1, cfg.len * .14, 5, 2); ctx.fill();
  ctx.fillStyle = cfg.accent;
  rr(ctx, cfg.len * .42, -cfg.h * .7, 7, 3, 1.5); ctx.fill();
  if (cfg.mag) { ctx.fillStyle = cfg.dark; rr(ctx, cfg.len * .28, cfg.h * .42, 11, cfg.mag, 3); ctx.fill(); ctx.fillStyle = cfg.accent; ctx.fillRect(cfg.len * .3, cfg.h * .45, 2, cfg.mag - 5); }
  if (cfg.pump) { ctx.fillStyle = '#d99a58'; rr(ctx, cfg.len * .42, -9, 16, 8, 3); ctx.fill(); ctx.fillStyle = '#7d4a22'; rr(ctx, cfg.len * .42, -2.5, 16, 2, 1); ctx.fill(); }
  if (cfg.scope) { ctx.strokeStyle = '#0e131b'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(cfg.len * .18, -cfg.h * .62); ctx.lineTo(cfg.len * .64, -cfg.h * .62); ctx.stroke(); ctx.strokeStyle = cfg.accent; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cfg.len * .2, -cfg.h * .62); ctx.lineTo(cfg.len * .62, -cfg.h * .62); ctx.stroke(); ctx.fillStyle = '#0d121a'; ctx.beginPath(); ctx.arc(cfg.len * .68, -cfg.h * .62, 5, 0, Math.PI * 2); ctx.fill(); }
  if (flash > 0) {
    const fx = cfg.len + cfg.barrel * .7;
    ctx.fillStyle = 'rgba(255,214,120,.28)';
    ctx.beginPath(); ctx.arc(fx + 5, 0, 12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff0a8';
    ctx.beginPath();
    ctx.moveTo(fx, -8); ctx.lineTo(fx + 18, -2); ctx.lineTo(fx + 25, 0); ctx.lineTo(fx + 18, 3); ctx.lineTo(fx, 8); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.moveTo(fx, -3); ctx.lineTo(fx + 8, 0); ctx.lineTo(fx, 3); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}

function drawMeleeArt(name) {
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  if (name === '开山刀') {
    ctx.fillStyle = 'rgba(0,0,0,.32)';
    rr(ctx, 22, -6 + 4, 40, 14, 4); ctx.fill();
    ctx.fillStyle = '#161b22';
    rr(ctx, 2, -7, 23, 14, 4); ctx.fill();
    ctx.fillStyle = '#ffbf66';
    rr(ctx, 5, -5, 18, 10, 3); ctx.fill();
    ctx.fillStyle = '#d8dee7';
    ctx.beginPath();
    ctx.moveTo(24, -10); ctx.lineTo(64, -3); ctx.lineTo(60, 7); ctx.lineTo(24, 10); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.moveTo(31, -5); ctx.lineTo(57, -2); ctx.lineTo(31, -1); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#9aa6b8'; ctx.lineWidth = 1.2;
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(47 + i * 4, 5); ctx.lineTo(50 + i * 4, 2); ctx.stroke(); }
    ctx.fillStyle = '#c7d0dc';
    rr(ctx, 19, -10, 7, 20, 3); ctx.fill();
  } else {
    ctx.fillStyle = 'rgba(0,0,0,.32)';
    rr(ctx, 18, -6 + 4, 38, 12, 6); ctx.fill();
    ctx.fillStyle = '#171c24';
    rr(ctx, 0, -6, 19, 12, 6); ctx.fill();
    ctx.fillStyle = '#cf4848';
    rr(ctx, 2, -4, 15, 8, 4); ctx.fill();
    ctx.fillStyle = '#b53636';
    ctx.fillRect(2, -2, 15, 1);
    ctx.fillStyle = '#a9743c';
    rr(ctx, 19, -7, 29, 14, 7); ctx.fill();
    ctx.fillStyle = '#c98d4b';
    rr(ctx, 21, -6, 25, 5, 3); ctx.fill();
    ctx.fillStyle = '#714921';
    rr(ctx, 40, -5, 10, 10, 5); ctx.fill();
    ctx.fillStyle = '#ffd166';
    rr(ctx, 49, -3, 5, 6, 3); ctx.fill();
  }
  ctx.restore();
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
  if (w.kind === 'gun') {
    drawGunArt(w.name, player.flash);
  } else {
    const sw = player.swing > 0 ? player.swing / .24 : 0;
    ctx.rotate(-((1 - sw) * .9));
    drawMeleeArt(w.name);
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
    const col = b.color || (b.enemy ? '#9dff66' : '#fff6c8');
    const glow = b.enemy ? 'rgba(120,255,90,.22)' : 'rgba(255,224,138,.22)';
    ctx.strokeStyle = glow;
    ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(b.px, b.py); ctx.lineTo(b.x, b.y); ctx.stroke();
    ctx.strokeStyle = col;
    ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(b.px, b.py); ctx.lineTo(b.x, b.y); ctx.stroke();
    ctx.fillStyle = col;
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
  const day = theme === 'day';
  const g = ctx.createRadialGradient(W / 2, H * .52, H * .34, W / 2, H * .52, H * .78);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, day ? 'rgba(20,30,40,.16)' : 'rgba(0,0,0,.42)');
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
    const scaled = Math.max(.0001, gain * settings.sfx * settings.master);
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo !== null) o.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t + dur);
    g.gain.setValueAtTime(scaled, t);
    g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g).connect(ac.destination);
    o.start(t); o.stop(t + dur + .02);
  },
  bang(mode = 'gun') {
    if (mode === 'shotgun') { this.tone(115, .13, 'square', .13, 48); this.tone(430, .07, 'sawtooth', .07, 110); }
    else if (mode === 'rifle') { this.tone(155, .17, 'square', .13, 56); this.tone(680, .06, 'sawtooth', .06, 210); }
    else { this.tone(175, .09, 'square', .10, 72); this.tone(520, .05, 'sawtooth', .05, 120); }
  },
  swing(freq = 720) { this.tone(freq, .07, 'sine', .05, freq * .3); },
  hit() { this.tone(205, .10, 'triangle', .08, 92); this.tone(95, .10, 'sine', .06, 55); },
  hurt() { this.tone(150, .18, 'sawtooth', .10, 64); },
  dry() { this.tone(120, .06, 'square', .05, 90); },
  spit() { this.tone(520, .12, 'sawtooth', .05, 210); this.tone(210, .12, 'square', .035, 110, .04); },
  crate() { this.tone(180 + Math.random() * 80, .06, 'square', .05, 120); },
  crateBreak() { this.tone(95, .16, 'square', .09, 52); this.tone(180, .13, 'sawtooth', .05, 90, .04); },
  pickup() { this.tone(520, .08, 'sine', .06, 760); this.tone(760, .10, 'sine', .05, 980, .07); },
  weaponPick() { this.tone(560, .08, 'square', .05, 760); this.tone(840, .10, 'triangle', .05, 1120, .06); },
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
  const dayChords = [
    { root: 60, intervals: [0, 4, 7] },
    { root: 55, intervals: [0, 4, 7] },
    { root: 62, intervals: [0, 4, 7] },
    { root: 57, intervals: [0, 4, 7] }
  ];
  const modeConfig = {
    menu: { bpm: 104, filter: 1300, gain: .15 },
    battle: { bpm: 128, filter: 2400, gain: .24 },
    day: { bpm: 136, filter: 3100, gain: .28 },
    boss: { bpm: 148, filter: 3300, gain: .29 },
    dead: { bpm: 92, filter: 900, gain: .16 }
  };

  function midiToFreq(n) { return 440 * Math.pow(2, (n - 69) / 12); }
  function currentChord() {
    const set = mode === 'day' ? dayChords : chords;
    return set[Math.floor(step / 16) % set.length];
  }
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
    const base = (modeConfig[mode] || modeConfig.battle).gain;
    return clamp(base * settings.music * settings.master, 0, .55);
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
    const isLeftSide = px < rect.width * .52 && py > rect.height * .22;
    if (!stick.active && isLeftSide) {
      stick.active = true;
      stick.id = e.pointerId;
      stick.ox = 70;
      stick.oy = rect.height - 74;
      stick.x = 0;
      stick.y = 0;
      ui.stickKnob.style.setProperty('--sx', '0px');
      ui.stickKnob.style.setProperty('--sy', '0px');
    } else if (!touchFire.active) {
      touchFire.active = true;
      touchFire.id = e.pointerId;
      setMouseFromEvent(e);
    }
    e.preventDefault();
    return;
  }
  setMouseFromEvent(e);
  input.attack = true;
});
canvas.addEventListener('pointerup', e => {
  if (e.pointerId === stick.id) {
    stick.active = false;
    stick.id = -1;
    stick.x = 0;
    stick.y = 0;
    ui.stickKnob.style.setProperty('--sx', '0px');
    ui.stickKnob.style.setProperty('--sy', '0px');
  }
  if (e.pointerId === touchFire.id) { touchFire.active = false; touchFire.id = -1; }
  if (e.pointerType !== 'touch') input.attack = false;
});
canvas.addEventListener('pointercancel', e => {
  if (e.pointerId === stick.id) { stick.active = false; stick.id = -1; stick.x = 0; stick.y = 0; }
  if (e.pointerId === touchFire.id) { touchFire.active = false; touchFire.id = -1; }
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
  ui.stickKnob.style.setProperty('--sx', `${dx * 42}px`);
  ui.stickKnob.style.setProperty('--sy', `${dy * 42}px`);
}

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
  if (e.code.startsWith('Digit')) {
    const slot = Number(e.code.slice(5));
    const name = player && player.inventory[slot - 1];
    if (name) selectWeapon(name, true);
  }
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

document.getElementById('startBtn').addEventListener('click', beginStartGame);
document.getElementById('restartBtn').addEventListener('click', () => resetGame(currentLevel));
document.getElementById('resumeBtn').addEventListener('click', togglePause);
document.getElementById('menuBtn').addEventListener('click', enterLobby);
ui.settingsBtn.addEventListener('click', resetSettings);
ui.exitBtn.addEventListener('click', exitGame);
ui.masterVolume.addEventListener('input', () => applySettingChange('master', Number(ui.masterVolume.value)));
ui.musicVolume.addEventListener('input', () => applySettingChange('music', Number(ui.musicVolume.value)));
ui.sfxVolume.addEventListener('input', () => applySettingChange('sfx', Number(ui.sfxVolume.value)));
ui.pauseMusicToggle.addEventListener('change', () => { if (ui.pauseMusicToggle.checked !== musicEnabled) toggleMusic(); });
ui.pauseSfxToggle.addEventListener('change', () => { if (ui.pauseSfxToggle.checked !== !muted) toggleMute(); });
ui.profileMasterVolume.addEventListener('input', () => applySettingChange('master', Number(ui.profileMasterVolume.value)));
ui.profileSfxVolume.addEventListener('input', () => applySettingChange('sfx', Number(ui.profileSfxVolume.value)));
ui.profileMusicVolume.addEventListener('input', () => applySettingChange('music', Number(ui.profileMusicVolume.value)));
ui.profileShakeVolume.addEventListener('input', () => applySettingChange('shake', Number(ui.profileShakeVolume.value)));
ui.avatarBtn.addEventListener('click', openProfile);
ui.avatarImage.addEventListener('click', () => ui.avatarFileInput.click());
ui.avatarUploadBtn.addEventListener('click', () => ui.avatarFileInput.click());
ui.avatarFileInput.addEventListener('change', e => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    avatarValue = String(reader.result || '');
    saveAvatar();
    applyAvatar();
  });
  reader.readAsDataURL(file);
  e.target.value = '';
});
document.querySelectorAll('.lobby-actions [data-lobby-view]').forEach(btn => {
  btn.addEventListener('click', () => showLobbyView(btn.dataset.lobbyView));
});
ui.restartLevelBtn.addEventListener('click', () => resetGame(currentLevel));
ui.levelLobbyBtn.addEventListener('click', enterLobby);
ui.startLevelBtn.addEventListener('click', startSelectedLevel);
ui.currentLevelCard.addEventListener('click', startSelectedLevel);
ui.prevLevelCard.addEventListener('click', () => selectLevelBy(-1));
ui.prevLevelArrow.addEventListener('click', () => selectLevelBy(-1));
ui.nextLevelArrow.addEventListener('click', () => selectLevelBy(1));
ui.nextLevelCard.addEventListener('click', () => {
  const next = levels[currentLevel.id];
  if (next && next.id > unlockedLevel) showComingSoon('下一关尚未解锁');
  else selectLevelBy(1);
});
ui.playerNameInput.addEventListener('change', () => {
  playerProfile.name = String(ui.playerNameInput.value || '').trim().slice(0, 10) || '玩家';
  saveProfile();
  updateLobbyStats();
});

function beginStartGame() {
  if (startLoadingTimer) return;
  audio.ctx();
  ui.startLoading.classList.remove('hidden');
  ui.startLoadingFill.style.width = '0%';
  let progress = 0;
  startLoadingTimer = setInterval(() => {
    progress += 11 + Math.random() * 10;
    ui.startLoadingFill.style.width = `${clamp(progress, 0, 100)}%`;
    if (progress >= 100) {
      clearInterval(startLoadingTimer);
      startLoadingTimer = null;
      enterLobby();
    }
  }, 90);
}

function showComingSoon(name) {
  ui.comingSoon.textContent = `${name}即将开放`;
  ui.comingSoon.classList.remove('hidden');
  clearTimeout(showComingSoon.timer);
  showComingSoon.timer = setTimeout(() => ui.comingSoon.classList.add('hidden'), 1500);
}

function syncSettingsUI() {
  ui.masterVolume.value = Math.round(settings.master * 100);
  ui.masterVolumeText.textContent = `${Math.round(settings.master * 100)}%`;
  ui.musicVolume.value = Math.round(settings.music * 100);
  ui.musicVolumeText.textContent = `${Math.round(settings.music * 100)}%`;
  ui.sfxVolume.value = Math.round(settings.sfx * 100);
  ui.sfxVolumeText.textContent = `${Math.round(settings.sfx * 100)}%`;
  ui.profileMasterVolume.value = Math.round(settings.master * 100);
  ui.profileMasterVolumeText.textContent = `${Math.round(settings.master * 100)}%`;
  ui.profileSfxVolume.value = Math.round(settings.sfx * 100);
  ui.profileSfxVolumeText.textContent = `${Math.round(settings.sfx * 100)}%`;
  ui.profileMusicVolume.value = Math.round(settings.music * 100);
  ui.profileMusicVolumeText.textContent = `${Math.round(settings.music * 100)}%`;
  ui.profileShakeVolume.value = Math.round((settings.shake ?? 1) * 100);
  ui.profileShakeVolumeText.textContent = `${Math.round((settings.shake ?? 1) * 100)}%`;
  ui.pauseMusicToggle.checked = musicEnabled;
  ui.pauseSfxToggle.checked = !muted;
}

function applySettingChange(key, value) {
  settings[key] = clamp(value / 100, 0, 1);
  saveSettings();
  syncSettingsUI();
  music.apply(.12);
}

function resetSettings() {
  settings.master = .9;
  settings.music = .95;
  settings.sfx = .9;
  settings.shake = .8;
  saveSettings();
  syncSettingsUI();
  music.apply(.15);
  texts.push({ x: player ? player.x : W * .5, y: player ? player.y - 90 : H * .5, vy: -50, life: .9, max: .9, text: '音量设置已重置', color: '#9aa6b8' });
}

function exitGame() {
  if (ui.exitInfo) ui.exitInfo.classList.remove('hidden');
  showMenu();
  try {
    window.open('', '_self');
    window.close();
  } catch (err) { /* 浏览器禁止关闭时返回标题 */ }
}

function switchWeapon() {
  if (state !== 'playing') return;
  const inv = player.inventory.filter(name => weapons[name]);
  if (!inv.length) return;
  const idx = inv.indexOf(player.weapon);
  const next = inv[(idx + 1 + inv.length) % inv.length] || inv[0];
  if (next !== player.weapon) selectWeapon(next, true);
  else updateHud();
}

function selectWeapon(name, removeCurrentDisposable = true) {
  if (state !== 'playing') return;
  if (!weapons[name]) return;
  if (!player.inventory.includes(name)) return;
  if (removeCurrentDisposable && player.weapon !== name && weapons[player.weapon] && weapons[player.weapon].disposable) {
    const old = player.weapon;
    removeDisposableWeapon(old);
    texts.push({ x: player.x, y: player.y - 112, vy: -58, life: 1.0, max: 1.0, text: `${weapons[old].name} 已丢弃`, color: '#9aa6b8' });
  }
  player.weapon = name;
  player.swing = 0;
  if (name === 'gun') player.autoBackToGun = false;
  updateHud();
}

function togglePause() {
  if (state === 'playing') {
    state = 'paused';
    syncSettingsUI();
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
  syncSettingsUI();
}

function toggleMusic() {
  musicEnabled = !musicEnabled;
  if (ui.touchMusicBtn) ui.touchMusicBtn.textContent = musicEnabled ? '音乐' : '音乐关';
  if (!musicEnabled) music.stop(.25);
  else if (state === 'playing') music.setMode(currentMusicMode(), true);
  else if (actx) music.setMode('menu', true);
  syncSettingsUI();
}

function showMenu() {
  state = 'menu';
  if (actx && musicEnabled) music.setMode('menu', true);
  else music.stop(.4);
  ui.menu.classList.remove('hidden');
  ui.pause.classList.add('hidden');
  ui.dead.classList.add('hidden');
  ui.levelSelect.classList.add('hidden');
  ui.levelComplete.classList.add('hidden');
  ui.hud.classList.add('hidden');
  ui.bossHud.classList.add('hidden');
}

renderAvatarPresets();
applyAvatar();
renderLevelList();
updateLobbyStats();
renderLevelCarousel();
showLobbyView('levelView', true);
syncSettingsUI();
resetGame();
showMenu();
requestAnimationFrame(frame);
})();
