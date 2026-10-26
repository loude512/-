(() => {
'use strict';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const stageEl = document.getElementById('stage');
const H = 540;                 // 虚拟高度固定，游戏纵向布局不变
let W = canvas.width;          // 虚拟宽度随屏幕宽高比自适应，避免手机端画面拉伸或黑边
const view = { dpr: 1 };

const laneTop = 262;
const laneBottom = 506;
const worldWidth = 6400;

const ui = {
  stage: stageEl,
  weaponBar: document.getElementById('weaponBar'),
  touchHint: document.getElementById('touchHint'),
  bestScore: document.getElementById('bestScore'),
  bestScoreValue: document.getElementById('bestScoreValue'),
  clearRewards: document.getElementById('clearRewards'),
  nextLevelBtn: document.getElementById('nextLevelBtn'),
  xpFill: document.getElementById('xpFill'),
  xpLevelText: document.getElementById('xpLevelText'),
  levelUp: document.getElementById('levelUp'),
  levelUpTitle: document.getElementById('levelUpTitle'),
  talentCards: document.getElementById('talentCards'),
  equipSlots: document.getElementById('equipSlots'),
  equipBag: document.getElementById('equipBag'),
  equipToast: document.getElementById('equipToast'),
  equipBagTitle: document.getElementById('equipBagTitle'),
  upEquipPage: document.getElementById('upEquipPage'),
  upSmeltPage: document.getElementById('upSmeltPage'),
  upBreakPage: document.getElementById('upBreakPage'),
  statHp: document.getElementById('statHp'),
  statAtk: document.getElementById('statAtk'),
  statAs: document.getElementById('statAs'),
  statCrit: document.getElementById('statCrit'),
  statCritDmg: document.getElementById('statCritDmg'),
  statMove: document.getElementById('statMove'),
  smeltList: document.getElementById('smeltList'),
  smeltWhiteBtn: document.getElementById('smeltWhiteBtn'),
  breakList: document.getElementById('breakList'),
  smeltMats: document.getElementById('smeltMats'),
  smeltGold: document.getElementById('smeltGold'),
  breakMats: document.getElementById('breakMats'),
  breakGold: document.getElementById('breakGold'),
  shopDiamonds: document.getElementById('shopDiamonds'),
  shopTickets: document.getElementById('shopTickets'),
  gacha1Btn: document.getElementById('gacha1Btn'),
  gacha10Btn: document.getElementById('gacha10Btn'),
  buyTicket1: document.getElementById('buyTicket1'),
  buyTicket10: document.getElementById('buyTicket10'),
  gachaHint: document.getElementById('gachaHint'),
  gachaResult: document.getElementById('gachaResult'),
  gachaResults: document.getElementById('gachaResults'),
  gachaAgainBtn: document.getElementById('gachaAgainBtn'),
  gachaOkBtn: document.getElementById('gachaOkBtn'),
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
  bossNameEl: document.getElementById('bossName'),
  bossFill: document.getElementById('bossFill'),
  finalScore: document.getElementById('finalScore'),
  finalWave: document.getElementById('finalWave'),
  finalKills: document.getElementById('finalKills'),
  stickKnob: document.getElementById('stickKnob'),
  swapBtn: document.getElementById('swapBtn'),
  touchPauseBtn: document.getElementById('touchPauseBtn'),
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
  shopBtn: document.getElementById('shopBtn'),
  upgradeBtn: document.getElementById('upgradeBtn'),
  inventoryBtn: document.getElementById('inventoryBtn'),
  extrasBtn: document.getElementById('extrasBtn'),
  levelListBtn: document.getElementById('levelListBtn'),
  levelView: document.getElementById('levelView'),
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
    const wins = Math.max(2, Math.floor(rand(2, 7)));
    out.push({
      x, w, h, y: yBase - h, wins, tone: rand(0, 1),
      roof: rand(0, 1) < .34, antenna: rand(0, 1) < .24,
      tank: rand(0, 1) < .22,
      led: rand(0, 1) < .16,
      ledColor: ['#62e8ff', '#ff8ad2', '#ffd166'][Math.floor(rand(0, 3))],
      damage: rand(0, .16)
    });
    x += w + rand(8, 44);
  }
  return out;
}
const farLayer = makeLayer(210, 90, 190, laneTop + 10);
const nearLayer = makeLayer(320, 140, 300, laneTop + 34);
const decals = [];
const streetItems = [];
for (let i = 0; i < 62; i++) {
  const itemR = Math.random();
  const kind = itemR < .36 ? 'rubble' : itemR < .52 ? 'cone' : itemR < .77 ? 'crack' : 'patch';
  streetItems.push({ x: rand(0, worldWidth), y: rand(laneTop + 28, laneBottom - 10), r: rand(7, 20), kind, tilt: rand(-.3, .3) });
}

// 地图静态道具：路灯沿街布置，废车/路障错落摆放，前景剪影带产生景深
const lamps = [];
for (let x = 300; x < worldWidth - 160; x += 372) lamps.push({ x: x + rand(-36, 36), side: Math.random() < .5 ? -1 : 1 });

const propTones = [
  { body: '#7d4441', dark: '#57302e', glass: '#1b2430' },
  { body: '#4f6377', dark: '#37475a', glass: '#141d29' },
  { body: '#8a8f96', dark: '#5f656d', glass: '#1a232e' },
  { body: '#5d6b4a', dark: '#414d34', glass: '#151f16' }
];
const props = [];
(function generateProps() {
  const kinds = ['car', 'car', 'van', 'bus', 'car', 'barricade', 'car'];
  for (let i = 0; i < kinds.length; i++) {
    props.push({
      x: 460 + i * (worldWidth - 920) / (kinds.length - 1) + rand(-120, 120),
      y: rand(laneTop + 52, laneBottom - 52),
      kind: kinds[i],
      flip: Math.random() < .5,
      tone: Math.floor(rand(0, propTones.length)),
      burnt: Math.random() < .22
    });
  }
  for (let i = 0; i < 11; i++) {
    props.push({ x: rand(220, worldWidth - 220), y: rand(laneTop + 42, laneBottom - 30), kind: Math.random() < .55 ? 'manhole' : 'grate' });
  }
})();

const crosswalks = [1180, 2960, 4740];

const fgItems = [];
(function generateForeground() {
  const span = (worldWidth + 1200) * 1.18;
  for (let x = -200; x < span; x += rand(80, 210)) {
    const kindR = Math.random();
    fgItems.push({
      x, w: rand(56, 150), h: kindR < .62 ? rand(16, 40) : rand(8, 18),
      kind: kindR < .62 ? 'bush' : 'debris',
      seed: rand(0, 10)
    });
  }
})();

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

// ===== 章节 × 关卡结构 =====
// 每章 10 关：1-4 纯小怪（波次 3/5/7/9），5 全精英群，6-9 大量小怪+精英混搭（11/13/15/17 波），10 四只高血量精英 + 章节 BOSS
// 每章引入一种特色小怪与对应新精英，第 2 章起的空中单位仅在夜间关卡出没
const CHAPTERS = [
  { scene: 'street', sceneName: '末日街区', featured: 'runner', eliteBase: 'brute', boss: 'tyrant', dayAt: [] },
  { scene: 'metro', sceneName: '地铁废墟', featured: 'spitter', eliteBase: 'spitter', boss: 'broodmother', dayAt: [6, 8] },
  { scene: 'rain', sceneName: '雨夜孤城', featured: 'pustule', eliteBase: 'pustule', boss: 'plague', dayAt: [3, 7] },
  { scene: 'port', sceneName: '白昼港口', featured: 'crawler', eliteBase: 'crawler', boss: 'crusher', dayAt: [] },
  { scene: 'mist', sceneName: '雾港晨曦', featured: 'hammer', eliteBase: 'hammer', boss: 'crimson', dayAt: [] },
  { scene: 'sewer', sceneName: '地下暗河', featured: 'wraith', eliteBase: 'wraith', boss: 'voidlord', dayAt: [] }
];
const SCENE_DEFS = {
  street: { theme: 'night', tint: null, weather: 'ash' },
  metro: { theme: 'night', tint: [198, 156, 122], weather: 'dust' },
  rain: { theme: 'night', tint: [132, 168, 226], weather: 'rain' },
  port: { theme: 'day', tint: null, weather: 'none' },
  mist: { theme: 'day', tint: [216, 228, 236], weather: 'mist' },
  sewer: { theme: 'night', tint: [118, 176, 136], weather: 'spores' }
};
function chapterOf(levelId) { return CHAPTERS[Math.min(CHAPTERS.length - 1, Math.floor((levelId - 1) / 10))]; }
function posOf(levelId) { return ((levelId - 1) % 10) + 1; }

const levels = [];
for (let lvl = 1; lvl <= 60; lvl++) {
  const ch = chapterOf(lvl);
  const pos = posOf(lvl);
  const sceneDef = SCENE_DEFS[ch.scene];
  let kind, totalWaves;
  if (pos <= 4) { kind = 'small'; totalWaves = 3 + (pos - 1) * 2; }
  else if (pos === 5) { kind = 'elite'; totalWaves = 3; }
  else if (pos <= 9) { kind = 'mixed'; totalWaves = 11 + (pos - 6) * 2; }
  else { kind = 'boss'; totalWaves = 2; }
  const isDay = ch.dayAt.includes(pos);
  const theme = isDay ? 'day' : sceneDef.theme;
  const kindText = kind === 'boss' ? 'BOSS 战' : kind === 'elite' ? '精英群袭' : kind === 'mixed' ? '混搭尸潮' : '清剿尸潮';
  const suffix = kind === 'boss' ? ' · BOSS' : kind === 'elite' ? ' · 精英群' : '';
  levels.push({
    id: lvl, name: `第${lvl}关 · ${ch.sceneName}${suffix}`, theme, scene: ch.scene, kind,
    totalWaves, air: true, crates: lvl >= 2,
    desc: `${totalWaves} 波 · ${kindText}`,
    spec: { kind, chapter: ch, smallPool: [], elitePool: [] }
  });
}
// 组装各关怪物池：小怪 = walker + 本章及之前所有特色小怪；精英 = brute + 本章及之前所有特色精英基底
levels.forEach(level => {
  const idx = CHAPTERS.indexOf(level.spec.chapter);
  const smallPool = ['walker'];
  const elitePool = ['brute'];
  for (let c = 0; c <= idx; c++) { smallPool.push(CHAPTERS[c].featured); elitePool.push(CHAPTERS[c].eliteBase); }
  level.spec.smallPool = smallPool;
  level.spec.elitePool = elitePool;
});

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

let bestScore = 0;
try { bestScore = Math.max(0, Number(localStorage.getItem('zombie-best')) || 0); } catch (err) { /* 忽略存储错误 */ }
function commitBest() {
  if (score > bestScore) {
    bestScore = score;
    try { localStorage.setItem('zombie-best', String(bestScore)); } catch (err) { /* 忽略存储错误 */ }
  }
  updateBestUI();
}
function updateBestUI() {
  if (!ui.bestScore || !ui.bestScoreValue) return;
  ui.bestScoreValue.textContent = bestScore;
  ui.bestScore.classList.toggle('hidden', !(bestScore > 0));
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
  const isImage = value.startsWith('data:');
  [ui.avatarImage, ui.avatarBtnImage].forEach(el => {
    if (!el) return;
    el.style.backgroundImage = isImage ? `url("${value}")` : 'none';
    el.style.backgroundColor = isImage ? '#151c28' : value;
    el.style.backgroundSize = 'cover';
    el.style.backgroundRepeat = 'no-repeat';
    el.style.backgroundPosition = 'center';
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

// ===== 装备养成系统 =====
// 七档品质：白→彩虹，绿色品质需通关第 10 关解锁，其后随通关进度相继解锁
const QUALITIES = [
  { id: 0, name: '白', color: '#cfd6e2', gate: 1, feed: 1, mult: 1 },
  { id: 1, name: '绿', color: '#6fd66f', gate: 10, feed: 2, mult: 1.18 },
  { id: 2, name: '蓝', color: '#5aa8ff', gate: 18, feed: 3, mult: 1.38 },
  { id: 3, name: '紫', color: '#b57bd6', gate: 26, feed: 4, mult: 1.62 },
  { id: 4, name: '金', color: '#ffd166', gate: 34, feed: 5, mult: 1.9 },
  { id: 5, name: '红', color: '#ff5a5a', gate: 42, feed: 7, mult: 2.25 },
  { id: 6, name: '彩虹', color: '#ff8ad2', gate: 50, feed: 9, mult: 2.75 }
];
// 六个装备槽位：帽子+胸甲→生命，近战+远程武器→攻击力，裤腿+鞋子→攻击速度
const EQUIP_SLOTS = [
  { id: 'hat', name: '帽子', attr: 'hp', per: 3 },
  { id: 'chest', name: '胸甲', attr: 'hp', per: 4 },
  { id: 'pants', name: '裤腿', attr: 'as', per: .7 },
  { id: 'shoes', name: '鞋子', attr: 'as', per: .9 },
  { id: 'melee', name: '近战武器', attr: 'atk', per: 1.2 },
  { id: 'ranged', name: '远程武器', attr: 'atk', per: 1.2 }
];
const EQUIP_MAX_LV = 70;
const GACHA_WEIGHTS = [500, 260, 140, 60, 28, 10, 2];
const GACHA_TICKET_PRICE = 25;
const GACHA_TICKET_PRICE10 = 225;

// 装备熔炼与突破：熔炼产出通用突破材料「强化结晶」，突破消耗结晶（白色品质）或结晶+金币
const SMELT_MATS = [1, 3, 6, 12, 24, 48, 100];
const SMELT_GOLD = [5, 15, 40, 100, 250, 600, 1500];
const BT_MAX = 5;
const BT_MATS = [20, 40, 80, 160, 320];
const BT_GOLD = [400, 800, 1600, 3200, 6400];

const equip = (() => {
  const data = { slots: null, items: [], tickets: 0, perfect: [], cleared: 0, mats: 0, bt: {} };
  try { Object.assign(data, JSON.parse(localStorage.getItem('zombie-equip') || '{}')); } catch (err) { /* 忽略存储错误 */ }
  if (!data.slots || typeof data.slots !== 'object') data.slots = {};
  for (const s of EQUIP_SLOTS) {
    const cur = data.slots[s.id];
    if (!cur || typeof cur.lv !== 'number') data.slots[s.id] = { lv: 1, q: 0 };
    else data.slots[s.id] = { lv: clamp(Math.round(cur.lv), 1, EQUIP_MAX_LV), q: clamp(cur.q | 0, 0, QUALITIES.length - 1) };
  }
  if (!Array.isArray(data.items)) data.items = [];
  data.items = data.items.filter(it => it && EQUIP_SLOTS.some(s => s.id === it.s) && (it.q | 0) >= 0 && (it.q | 0) < QUALITIES.length && (it.n | 0) > 0)
    .map(it => ({ s: it.s, q: it.q | 0, n: Math.min(999, it.n | 0) }));
  if (!Array.isArray(data.perfect)) data.perfect = [];
  if (!data.bt || typeof data.bt !== 'object') data.bt = {};
  for (const s of EQUIP_SLOTS) data.bt[s.id] = clamp(data.bt[s.id] | 0, 0, BT_MAX);
  data.tickets = Math.max(0, data.tickets | 0);
  data.cleared = Math.max(0, data.cleared | 0);
  data.mats = Math.max(0, data.mats | 0);
  return data;
})();
function saveEquip() {
  try { localStorage.setItem('zombie-equip', JSON.stringify(equip)); } catch (err) { /* 忽略存储错误 */ }
}
const slotName = id => { const s = EQUIP_SLOTS.find(x => x.id === id); return s ? s.name : id; };
function addEquipItem(slotId, q, n = 1) {
  const entry = equip.items.find(it => it.s === slotId && it.q === q);
  if (entry) entry.n += n;
  else equip.items.push({ s: slotId, q, n });
  saveEquip();
}
function absorbEquipItem(slotId, q) {
  const idx = equip.items.findIndex(it => it.s === slotId && it.q === q);
  if (idx < 0) return false;
  const entry = equip.items[idx];
  entry.n--;
  if (entry.n <= 0) equip.items.splice(idx, 1);
  const slot = equip.slots[slotId];
  const before = slot.lv;
  slot.lv = Math.min(EQUIP_MAX_LV, slot.lv + QUALITIES[q].feed);
  if (q > slot.q) slot.q = q;
  saveEquip();
  return slot.lv > before || slot.lv === EQUIP_MAX_LV;
}
function unlockedMaxQuality() {
  let max = 0;
  for (const q of QUALITIES) if (equip.cleared >= q.gate) max = Math.max(max, q.id);
  return max;
}
function nextQualityGate() {
  for (const q of QUALITIES) if (equip.cleared < q.gate) return q;
  return null;
}
function rollEquipQuality(levelId) {
  const maxQ = unlockedMaxQuality();
  let total = 0;
  for (let q = 0; q <= maxQ; q++) total += GACHA_WEIGHTS[q] * (1 + (levelId || 1) / 40 * q);
  let roll = Math.random() * total;
  let picked = 0;
  for (let q = 0; q <= maxQ; q++) {
    roll -= GACHA_WEIGHTS[q] * (1 + (levelId || 1) / 40 * q);
    if (roll <= 0) { picked = q; break; }
  }
  return Math.min(picked, maxQ);
}
function gachaRoll() {
  const q = rollEquipQuality(1);
  const slot = EQUIP_SLOTS[Math.floor(Math.random() * EQUIP_SLOTS.length)].id;
  addEquipItem(slot, q, 1);
  return { slot, q };
}
function equipStats() {
  const out = { hp: 0, atkPct: 100, asPct: 100 };
  for (const s of EQUIP_SLOTS) {
    const st = equip.slots[s.id];
    const bonus = (st.lv - 1) * s.per * QUALITIES[st.q].mult;
    if (s.attr === 'hp') out.hp += bonus;
    else if (s.attr === 'atk') out.atkPct += bonus;
    else out.asPct += bonus;
  }
  return out;
}

// 装备熔炼与突破逻辑（常量 SMELT_MATS / BT_MAX 等定义在 equip 初始化之前）
function btTiers(slotId) { return equip.bt[slotId] | 0; }
function totalBreakTiers() { return EQUIP_SLOTS.reduce((a, s) => a + btTiers(s.id), 0); }
function critStats() {
  const t = totalBreakTiers();
  return { rate: .05 + .005 * t, dmg: 1.5 + .05 * t, move: 1 + .005 * t };
}
function smeltItem(slotId, q, count = 1) {
  const entry = equip.items.find(it => it.s === slotId && it.q === q);
  if (!entry || entry.n < count) return false;
  entry.n -= count;
  if (entry.n <= 0) equip.items.splice(equip.items.indexOf(entry), 1);
  equip.mats += SMELT_MATS[q] * count;
  playerProfile.gold += SMELT_GOLD[q] * count;
  saveEquip();
  saveProfile();
  updateLobbyStats();
  return true;
}
function smeltAllWhite() {
  let mats = 0, gold = 0, count = 0;
  for (const it of equip.items) {
    if (it.q !== 0) continue;
    mats += SMELT_MATS[0] * it.n;
    gold += SMELT_GOLD[0] * it.n;
    count += it.n;
  }
  if (!count) return null;
  equip.items = equip.items.filter(it => it.q !== 0);
  equip.mats += mats;
  playerProfile.gold += gold;
  saveEquip();
  saveProfile();
  updateLobbyStats();
  return { count, mats, gold };
}
function doBreakthrough(slotId) {
  const tier = btTiers(slotId);
  if (tier >= BT_MAX) return 'max';
  const matsCost = BT_MATS[tier];
  const goldCost = equip.slots[slotId].q > 0 ? BT_GOLD[tier] : 0;
  if (equip.mats < matsCost) return 'mats';
  if (playerProfile.gold < goldCost) return 'gold';
  equip.mats -= matsCost;
  playerProfile.gold -= goldCost;
  equip.bt[slotId] = tier + 1;
  saveEquip();
  saveProfile();
  updateLobbyStats();
  return true;
}

// ===== 自设计部位图标（SVG，颜色跟随品质） =====
const SLOT_ICONS = {
  hat: '<path d="M12 3c-4.7 0-8.5 3.6-8.5 8.2V14h17v-2.8C20.5 6.6 16.7 3 12 3z"/><path d="M2.5 15.2h19c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5h-19c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5z"/>',
  chest: '<path d="M8.5 2h7L17 5l3.5 1.5-1.2 4.6-2.8-1V22h-9V10.1l-2.8 1L3.5 6.5 7 5z"/>',
  pants: '<path d="M6 2h12v7l-1.4 13h-3.8L12 13l-1.4 9H7.4L6 9z"/>',
  shoes: '<path d="M6.5 2h8v9.5c3.5.3 6.5 2 7.5 5.5v2H6.5z"/><path d="M5 20h17v2.5H5z" opacity=".5"/>',
  melee: '<path d="M4.2 19.8c-.9-.9-.9-2.3 0-3.2l2-2 3.2 3.2-2 2c-.9.9-2.3.9-3.2 0z"/><path d="M9.5 16.5L18.8 7.2c1.3-1.3 1.7-3.2 1-4.9-1.7-.7-3.6-.3-4.9 1L5.6 12.6z"/>',
  ranged: '<path d="M2.5 7h19v5.5h-4.2l-1.2 3.2c-.3.8-1 1.3-1.8 1.3h-3.6l1.4-4.5H7.5V16c0 .6-.4 1-1 1H4c-.6 0-1-.4-1-1v-3.5H2.5z"/>'
};
const MAT_ICON = '<path d="M12 1.5l7 7.2L12 22.5 5 8.7z"/><path d="M12 1.5l3.4 7.2L12 22.5 8.6 8.7z" opacity=".35"/>';
const COIN_ICON = '<circle cx="12" cy="12" r="9.5"/><circle cx="12" cy="12" r="5.5" opacity=".3"/>';
function svgIcon(paths, cls = '') {
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${paths}</svg>`;
}
const slotIcon = id => svgIcon(SLOT_ICONS[id] || SLOT_ICONS.hat);

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
const stick = { active: false, id: -1, ox: 0, oy: 0, x: 0, y: 0, radius: 48 };
const touchFire = { active: false, id: -1 };

if (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(max-width: 820px)').matches) document.body.classList.add('touch');

function resetGame(config = currentLevel || levels[0]) {
  levelConfig = levels.find(l => l.id === config.id) || levels[0];
  currentLevel = levelConfig;
  player = {
    x: worldWidth * .5, y: 392, r: 20, hp: 100, maxHp: 100, speed: 236,
    weapon: 'gun', inventory: defaultInventory.slice(), ammoByWeapon: { gun: 72 },
    facing: 1, attackCd: 0, swing: 0, swingId: 0, swingHit: new Set(),
    invuln: .6, anim: 0, hurtFlash: 0, flash: 0, recoil: 0, step: 0, autoBackToGun: false,
    level: 1, xp: 0, xpNext: xpCurve(1), pendingLevelUps: 0, talents: {},
    dmgMul: 1, speedMul: 1, cdMul: 1, magnetMul: 1, eliteDmgMul: 1, executeMul: 1, luckMul: 1,
    lifesteal: 0, thorns: 0, bloom: 0
  };
  // 装备养成加成：生命 / 攻击力 / 攻击速度 + 突破层数带来的暴击与移速
  const eqs = equipStats();
  player.maxHp += eqs.hp;
  player.hp = player.maxHp;
  player.dmgMul *= eqs.atkPct / 100;
  player.cdMul *= 100 / eqs.asPct;
  player.speed = Math.round(player.speed * critStats().move);
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
  sceneFx = SCENE_DEFS[levelConfig.scene] || SCENE_DEFS.street;
  spawnCrates(levelConfig.crates ? 8 : 0);
  if (ui.exitInfo) ui.exitInfo.classList.add('hidden');
  cam.x = clamp(player.x - W * .5, 0, worldWidth - W);
  cam.y = cameraYTarget();
  state = 'playing';
  setIngame(true);
  ui.menu.classList.add('hidden');
  ui.dead.classList.add('hidden');
  ui.pause.classList.add('hidden');
  ui.levelSelect.classList.add('hidden');
  ui.levelComplete.classList.add('hidden');
  ui.levelUp.classList.add('hidden');
  ui.bossHud.classList.add('hidden');
  ui.hud.classList.remove('hidden');
  updateHud();
  showTouchHintOnce();
  if (actx && musicEnabled) {
    music.setMode(currentMusicMode(), true);
    music.start();
  }
}

function setIngame(on) {
  document.body.classList.toggle('ingame', on);
  if (ui.weaponBar) ui.weaponBar.classList.toggle('hidden', !on);
}

let touchHintTimer = null;
function showTouchHintOnce() {
  if (!ui.touchHint || !document.body.classList.contains('touch')) return;
  let seen = false;
  try { seen = localStorage.getItem('zombie-hint-seen') === '1'; } catch (err) { /* 忽略存储错误 */ }
  if (seen) return;
  clearTimeout(touchHintTimer);
  touchHintTimer = setTimeout(() => {
    if (state !== 'playing') return;
    ui.touchHint.classList.remove('hidden');
    touchHintTimer = setTimeout(dismissTouchHint, 6000);
  }, 600);
}
function dismissTouchHint() {
  if (!ui.touchHint || ui.touchHint.classList.contains('hidden')) return;
  ui.touchHint.classList.add('hidden');
  clearTimeout(touchHintTimer);
  touchHintTimer = null;
  try { localStorage.setItem('zombie-hint-seen', '1'); } catch (err) { /* 忽略存储错误 */ }
}

// 局内天赋系统：升级时三选一，普通/稀有/史诗三档
const TALENTS = [
  { id: 'strength', icon: '💪', name: '强健体魄', rarity: 'common', max: 99, desc: '最大生命 +25，并立即恢复 25 点生命', apply: () => { player.maxHp += 25; player.hp = Math.min(player.maxHp, player.hp + 25); } },
  { id: 'rage', icon: '🔥', name: '战意狂潮', rarity: 'common', max: 99, desc: '所有武器伤害 +12%', apply: () => { player.dmgMul += .12; } },
  { id: 'swift', icon: '💨', name: '迅捷步伐', rarity: 'common', max: 5, desc: '移动速度 +8%', apply: () => { player.speedMul += .08; player.speed = Math.round(236 * player.speedMul * critStats().move); } },
  { id: 'magnet', icon: '🧲', name: '经验磁石', rarity: 'common', max: 4, desc: '经验拾取范围 +50%', apply: () => { player.magnetMul += .5; } },
  { id: 'lifesteal', icon: '🩸', name: '嗜血', rarity: 'common', max: 3, desc: '每次击杀恢复 2 点生命', apply: () => { player.lifesteal += 2; } },
  { id: 'precision', icon: '🎯', name: '精准瞄准', rarity: 'rare', max: 4, desc: '武器攻击间隔 -8%', apply: () => { player.cdMul = Math.max(.55, player.cdMul - .08); } },
  { id: 'thorns', icon: '🌵', name: '荆棘装甲', rarity: 'rare', max: 99, desc: '被近身击中时反伤 14 点', apply: () => { player.thorns += 14; } },
  { id: 'slayer', icon: '💀', name: '巨人杀手', rarity: 'rare', max: 99, desc: '对精英与 BOSS 伤害 +20%', apply: () => { player.eliteDmgMul += .2; } },
  { id: 'lucky', icon: '🍀', name: '幸运搜刮', rarity: 'rare', max: 3, desc: '补给掉落概率 +30%', apply: () => { player.luckMul += .3; } },
  { id: 'execute', icon: '🗡️', name: '猎杀本能', rarity: 'epic', max: 2, desc: '对生命低于 35% 的敌人伤害 +45%', apply: () => { player.executeMul += .45; } },
  { id: 'bloom', icon: '💥', name: '死亡绽放', rarity: 'epic', max: 4, desc: '击杀时 12% 概率引发爆炸（45 范围伤害）', apply: () => { player.bloom += 1; } }
];
const rarityNames = { common: '普通', rare: '稀有', epic: '史诗' };
let levelUpChoices = [];

function rollTalents() {
  const pool = TALENTS.filter(t => (player.talents[t.id] || 0) < t.max);
  const weightOf = t => t.rarity === 'common' ? 100 : t.rarity === 'rare' ? 52 : 22;
  const picks = [];
  while (picks.length < 3 && pool.length) {
    let total = 0;
    for (const t of pool) total += weightOf(t);
    let roll = Math.random() * total;
    let chosen = pool[pool.length - 1];
    for (const t of pool) {
      roll -= weightOf(t);
      if (roll <= 0) { chosen = t; break; }
    }
    picks.push(chosen);
    pool.splice(pool.indexOf(chosen), 1);
  }
  return picks;
}

function openLevelUp() {
  if (state !== 'playing' || !player) return;
  state = 'levelup';
  levelUpChoices = rollTalents();
  ui.levelUpTitle.textContent = `升级 · LV ${player.level}`;
  ui.talentCards.innerHTML = levelUpChoices.map((t, i) => {
    const stacks = player.talents[t.id] || 0;
    return `<button type="button" class="talent-card r-${t.rarity}" data-talent="${t.id}">`
      + `<span class="t-rarity">${rarityNames[t.rarity]}</span>`
      + `<em class="t-key">${i + 1}</em>`
      + `<span class="t-icon">${t.icon}</span>`
      + `<b class="t-name">${t.name}</b>`
      + `<span class="t-desc">${t.desc}</span>`
      + `<span class="t-stack${stacks ? '' : ' t-new'}">${stacks ? `已拥有 ×${stacks}` : '◆ 新天赋'}</span>`
      + `</button>`;
  }).join('');
  ui.levelUp.classList.remove('hidden');
  audio.levelup();
  vibrate(60);
}

function pickTalent(id) {
  const t = TALENTS.find(x => x.id === id);
  if (!t || state !== 'levelup') return;
  player.talents[id] = (player.talents[id] || 0) + 1;
  t.apply();
  audio.weaponPick();
  player.pendingLevelUps = Math.max(0, player.pendingLevelUps - 1);
  updateHud();
  if (player.pendingLevelUps > 0) {
    openLevelUp();
    return;
  }
  state = 'playing';
  player.invuln = Math.max(player.invuln, .8);
  ui.levelUp.classList.add('hidden');
}

function currentMusicMode() {
  if (bossRef) return 'boss';
  const spec = levelConfig && levelConfig.spec;
  if (spec && spec.kind === 'boss' && wave >= levelConfig.totalWaves) return 'boss';
  return theme === 'day' ? 'day' : 'battle';
}

function cameraYTarget() {
  const t = (player.y - laneTop) / (laneBottom - laneTop);
  return lerp(-46, 24, clamp(t, 0, 1));
}

function startWave(n) {
  wave = n;
  theme = levelConfig.theme;
  sceneFx = SCENE_DEFS[levelConfig.scene] || SCENE_DEFS.street;
  const spec = levelConfig.spec;
  const isLast = wave >= levelConfig.totalWaves;
  const isBossWave = spec.kind === 'boss' && isLast;
  const bossName = spec.chapter ? (ENEMY_DEFS[spec.chapter.boss] || {}).name : 'BOSS';
  const eliteBase = spec.chapter ? spec.chapter.eliteBase : 'brute';
  ui.bannerText.textContent = isBossWave ? `最终波 · ${bossName} 来袭`
    : isLast ? `最终波 · 第 ${wave} 波`
      : spec.kind === 'elite' ? `第 ${wave} 波 · 精英群袭`
        : theme === 'day' ? `第 ${wave} 波 · 白天` : `第 ${wave} 波`;
  ui.banner.classList.remove('hidden');
  waveBannerAt = 1.8;
  spawnQueue = [];
  if (spec.kind === 'boss') {
    // 章节 BOSS 关：第一波四只高血量精英，最终波只有 BOSS 本体
    if (wave === 1) {
      for (let i = 0; i < 4; i++) spawnQueue.push({ t: eliteBase, elite: true, hpMult: 1.6 });
    } else {
      spawnQueue.push({ t: spec.chapter.boss, boss: true });
    }
  } else {
    const eliteRatio = spec.kind === 'elite' ? 1 : spec.kind === 'mixed' ? .22 : 0;
    const total = clamp(3 + Math.floor(wave * 1.5), 4, 20);
    const smallPool = poolForLevel(levelConfig, spec.smallPool);
    const elitePool = poolForLevel(levelConfig, spec.elitePool);
    for (let i = 0; i < total; i++) {
      const isElite = Math.random() < eliteRatio;
      let t;
      if (isElite) t = Math.random() < .62 ? eliteBase : elitePool[Math.floor(Math.random() * elitePool.length)];
      else t = Math.random() < .45 ? smallPool[Math.floor(Math.random() * smallPool.length)] : spec.smallPool[Math.floor(Math.random() * spec.smallPool.length)];
      spawnQueue.push({ t, elite: isElite });
    }
  }
  for (let i = spawnQueue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [spawnQueue[i], spawnQueue[j]] = [spawnQueue[j], spawnQueue[i]];
  }
  spawnTimer = 1.0;
  if (levelConfig.crates) spawnCrates(Math.max(0, 7 + Math.floor(wave / 3) - crates.length), true);
  audio.wave();
  music.setMode(isBossWave || bossRef ? 'boss' : (theme === 'day' ? 'day' : 'battle'), true);
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
  
  renderLevelCarousel();
  commitBest();
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
  // 装备掉落：关卡越难掉率与品质越高；首次完美通关（3 星）送 1 张抽奖券
  let rewardText = `通关奖励  +${goldReward} 金币 · +${diamondReward} 钻石`;
  equip.cleared = Math.max(equip.cleared, currentLevel.id);
  const dropChance = Math.min(.62, .16 + currentLevel.id * .014);
  if (Math.random() < dropChance) {
    const dropQ = rollEquipQuality(currentLevel.id);
    const dropSlot = EQUIP_SLOTS[Math.floor(Math.random() * EQUIP_SLOTS.length)].id;
    addEquipItem(dropSlot, dropQ, 1);
    rewardText += ` · 🎁${QUALITIES[dropQ].name}·${slotName(dropSlot)}`;
  }
  if (isPerfect && !equip.perfect.includes(currentLevel.id)) {
    equip.perfect.push(currentLevel.id);
    equip.tickets += 1;
    rewardText += ' · 🎫抽奖券+1';
  }
  // 通关产出通用突破材料「强化结晶」
  const matsGain = 2 + Math.floor(currentLevel.id / 2);
  equip.mats += matsGain;
  rewardText += ` · ✦结晶+${matsGain}`;
  saveEquip();
  if (ui.clearRewards) ui.clearRewards.textContent = rewardText;
  const nextLevel = levels.find(l => l.id === currentLevel.id + 1);
  if (ui.nextLevelBtn) {
    ui.nextLevelBtn.classList.toggle('hidden', !nextLevel);
    if (nextLevel) ui.nextLevelBtn.textContent = `下一关 · ${nextLevel.name.split(' · ')[1] || nextLevel.name}`;
  }
  setTimeout(() => {
    ui.hud.classList.add('hidden');
    ui.levelComplete.classList.remove('hidden');
  }, 520);
}

function enterLobby() {
  if (startLoadingTimer) { clearInterval(startLoadingTimer); startLoadingTimer = null; }
  state = 'menu';
  setIngame(false);
  music.stop(.25);
  if (actx && musicEnabled) music.setMode('menu', true);
  updateLobbyStats();
  renderLevelCarousel();
  
  showLobbyView('levelView', true);
  ui.menu.classList.add('hidden');
  ui.dead.classList.add('hidden');
  ui.pause.classList.add('hidden');
  ui.levelComplete.classList.add('hidden');
  ui.bossHud.classList.add('hidden');
  ui.hud.classList.add('hidden');
  ui.levelSelect.classList.remove('hidden');
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
  ui.prevLevelCard.classList.remove('hidden');
  ui.currentLevelCard.classList.remove('hidden');
  ui.nextLevelCard.classList.remove('hidden');
  ui.prevLevelCard.style.visibility = prev ? 'visible' : 'hidden';
  ui.nextLevelCard.style.visibility = next ? 'visible' : 'hidden';
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
  card.dataset.theme = level.theme;
  const shortName = level.name.split(' · ')[1] || level.name;
  const kindBadge = level.kind === 'boss' ? '☠ BOSS'
    : level.kind === 'elite' ? '⚑ 精英群'
      : level.kind === 'mixed' ? '⚔ 混搭' : '';
  card.innerHTML = `<span class="lc-sky ${level.theme}"></span>`
    + `<span class="lc-head"><b class="lc-no">MISSION ${String(level.id).padStart(2, '0')}</b><i class="lc-theme ${level.theme}">${level.theme === 'day' ? '白昼' : '黑夜'}</i></span>`
    + `<b class="lc-name">${shortName}</b>`
    + `<span class="lc-desc">${level.desc}${kindBadge ? ` · <i class="lc-kind k-${level.kind}">${kindBadge}</i>` : ''}</span>`
    + `<span class="level-lock">${locked ? '🔒' : ''}</span>`;
}

function selectLevelBy(delta) {
  const unlocked = unlockedLevels();
  const nextIndex = clamp(selectedLevelIndex + delta, 0, unlocked.length - 1);
  if (nextIndex !== selectedLevelIndex) {
    selectedLevelIndex = nextIndex;
    renderLevelCarousel();
  }
}

const lobbyViewIds = ['levelView', 'profileView', 'shopView', 'upgradeView', 'inventoryView', 'extrasView'];
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
  if (name === 'levelListView') 
  if (name === 'profileView') syncSettingsUI();
  if (name === 'upgradeView') renderUpgradePanel();
  if (name === 'shopView') renderShop();
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

// 怪物一律从屏幕左右两侧走入战场，不再从天而降；精英怪由 startWave 随机标记
// ENEMY_DEFS：每种怪物的属性、绘制基底（base）、调色板（pal）与生成条件（nightOnly）
const ENEMY_DEFS = {
  walker:  { name: '行者', base: 'walker', hp: 58, speed: 64, dmg: 10, r: 22, score: 10, scale: 1, xp: 6, pal: { skin: '#8fae6b', dark: '#6d8a52', cloth: '#4a5140', pants: '#3a4148' } },
  runner:  { name: '疾跑者', base: 'runner', hp: 34, speed: 138, dmg: 7, r: 17, score: 15, scale: .84, xp: 8, pal: { skin: '#b9cf72', dark: '#93a851' } },
  brute:   { name: '重甲壮汉', base: 'brute', hp: 230, speed: 46, dmg: 20, r: 33, score: 38, scale: 1.42, xp: 22, pal: { skin: '#6f8f63', dark: '#557048', armor: '#39424d' } },
  spitter: { name: '喷酸飞行者', base: 'spitter', flying: true, nightOnly: true, hp: 48, speed: 82, dmg: 8, r: 18, score: 24, scale: .92, xp: 14, pal: { skin: '#9a86e0', dark: '#7361b8', sac: '#8fd45e' } },
  pustule: { name: '毒疱行者', base: 'walker', hp: 132, speed: 42, dmg: 14, r: 25, score: 20, scale: 1.12, xp: 16, pal: { skin: '#a3b066', dark: '#7d8a4c', cloth: '#4e5536', pants: '#3c402c' } },
  crawler: { name: '狂暴爬虫', base: 'runner', hp: 52, speed: 184, dmg: 9, r: 16, score: 22, scale: .86, xp: 14, pal: { skin: '#d09a5e', dark: '#a5733f' } },
  hammer:  { name: '重锤者', base: 'brute', hp: 345, speed: 40, dmg: 26, r: 34, score: 42, scale: 1.5, xp: 40, pal: { skin: '#7a6e94', dark: '#575070', armor: '#332f40' } },
  wraith:  { name: '幽魂飞行者', base: 'spitter', flying: true, nightOnly: true, hp: 76, speed: 108, dmg: 10, r: 19, score: 30, scale: .96, xp: 24, pal: { skin: '#5f5482', dark: '#43396b', sac: '#7fe0c4' } },
  // 章节 BOSS
  tyrant:      { name: '暴君丧尸', base: 'boss', boss: true, hp: 820, hpPerWave: 160, speed: 54, dmg: 28, r: 58, score: 260, scale: 2.35, xp: 160, pal: { skin: '#4c7d55', dark: '#386043', armor: '#232b33' } },
  broodmother: { name: '腐巢母体', base: 'spitter', boss: true, flying: true, hp: 1100, hpPerWave: 170, speed: 70, dmg: 12, r: 62, score: 320, scale: 3.1, xp: 220, split: 'spitter', splitCount: 3, pal: { skin: '#8a6fb8', dark: '#604a8f', sac: '#9ee05e' } },
  plague:      { name: '瘟疫巨兽', base: 'brute', boss: true, ranged: true, hp: 1500, hpPerWave: 200, speed: 44, dmg: 24, r: 60, score: 340, scale: 2.4, xp: 260, pal: { skin: '#6f8f45', dark: '#4f6b2e', armor: '#2f3a1f' } },
  crusher:     { name: '钢铁粉碎者', base: 'brute', boss: true, hp: 2400, hpPerWave: 260, speed: 34, dmg: 34, r: 66, score: 380, scale: 2.7, xp: 300, pal: { skin: '#8a7560', dark: '#65513f', armor: '#3a3128' } },
  crimson:     { name: '猩红暴君', base: 'boss', boss: true, hp: 1800, hpPerWave: 220, speed: 88, dmg: 30, r: 56, score: 400, scale: 2.2, xp: 340, pal: { skin: '#93393a', dark: '#6d282a', armor: '#2e1a1a' } },
  voidlord:    { name: '虚空之主', base: 'spitter', boss: true, flying: true, hp: 1500, hpPerWave: 200, speed: 92, dmg: 14, r: 60, score: 420, scale: 2.9, xp: 380, pal: { skin: '#453a6e', dark: '#2e2750', sac: '#b06fe0' } }
};

function spawnOne(entry) {
  const type = typeof entry === 'string' ? entry : entry.t;
  const def = ENEMY_DEFS[type] || ENEMY_DEFS.walker;
  const elite = !!(entry && typeof entry === 'object' && entry.elite);
  const hpMult = entry && typeof entry === 'object' ? (entry.hpMult || 1) : 1;
  const isBoss = !!def.boss;
  const fromLeft = Math.random() < .5;
  const dir = fromLeft ? 1 : -1;
  let x, y;
  if (def.flying) {
    x = cam.x + (fromLeft ? -90 : W + 90);
    y = laneTop - 126 + rand(-22, 24);
  } else if (isBoss) {
    x = clamp(cam.x + (fromLeft ? -150 : W + 150), 120, worldWidth - 120);
    y = player ? clamp(player.y, laneTop + 10, laneBottom - 10) : 392;
  } else {
    x = cam.x + (fromLeft ? -54 : W + 54);
    y = rand(laneTop + 16, laneBottom - 16);
  }
  const maxHp = Math.round(def.hp * hpMult * (1 + wave * (isBoss ? 0 : .05)));
  const z = Object.assign({
    type, base: def.base, name: def.name, pal: def.pal, boss: isBoss, flying: !!def.flying,
    ranged: !!def.ranged, x, y, maxHp, hp: maxHp, attackCd: rand(.4, 1.1),
    phase: rand(0, 10), kx: 0, ky: 0, hurt: 0, dead: false, climbT: 0,
    facing: dir, elite, score: def.score, scale: def.scale, r: def.r,
    speed: def.speed, dmg: def.dmg, shotTimer: rand(.7, 1.7)
  });
  if (isBoss) {
    z.maxHp = Math.round(def.hp + wave * def.hpPerWave);
    z.hp = z.maxHp;
    if (elite) { z.maxHp = Math.round(z.maxHp * 1.8); z.hp = z.maxHp; }
    bossRef = z;
    if (ui.bossNameEl) ui.bossNameEl.textContent = `BOSS · ${def.name}`;
    ui.bossHud.classList.remove('hidden');
    addShake(12);
    vibrate(90);
  }
  if (z.flying) z.shotTimer = rand(1, 2.2);
  enemies.push(z);
  return z;
}

function makeElite(z) {
  z.elite = true;
  z.maxHp = Math.round(z.maxHp * 3.2);
  z.hp = z.maxHp;
  z.dmg = Math.round(z.dmg * 1.5);
  z.speed = Math.round(z.speed * 1.08);
  z.scale = z.scale * 1.2;
  z.r = z.r * 1.15;
  z.score = z.score * 3;
  return z;
}

// 生成条件过滤：夜晚限定怪物仅在夜间关卡出没
function poolForLevel(level, pool) {
  const night = level.theme === 'night';
  const filtered = pool.filter(t => { const d = ENEMY_DEFS[t]; return d && (!d.nightOnly || night); });
  return filtered.length ? filtered : ['walker'];
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
  vibrate(24);
  audio.crateBreak();
  for (let i = 0; i < 26; i++) {
    const a = rand(0, Math.PI * 2), sp = rand(90, 360);
    particles.push({ x: c.x, y: c.y - c.h * .5, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 140, life: rand(.28, .62), max: .62, r: rand(2.5, 5), color: i % 4 ? '#b5793e' : '#ffd166', g: 420 });
  }
  const r = Math.random();
  let kind = 'ammo';
  if (r < Math.min(.42, .28 * Math.max(1, player.luckMul))) kind = 'health';
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
    player.attackCd = w.cooldown * player.cdMul;
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
        dealDamage(z, w.damage, aim, w.knock);
        player.swingHit.add(z);
      }
    }
    for (const c of crates) {
      const dx = c.x - ox, dy = c.y - c.h * .5 - oy;
      const d = Math.hypot(dx, dy);
      const a = Math.atan2(dy, dx);
      if (d <= w.range + c.w * .55 && angleDiff(a, aim) <= w.arc * .5 + .15) damageCrate(c, w.damage * player.dmgMul);
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
    player.attackCd = w.cooldown * player.cdMul;
    player.ammoByWeapon[player.weapon] = ammo - w.ammoUse;
    if (player.weapon === 'gun') player.ammo = player.ammoByWeapon.gun;
    player.flash = .06;
    player.recoil = 1;
    addShake(w.shake || 2.0);
    vibrate(Math.max(8, (w.shake || 2) * 5));
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

function damageZombie(z, dmg, aim, knock, crit = false) {
  z.hp -= dmg;
  z.hurt = .14;
  z.kx += Math.cos(aim) * knock * (z.type === 'boss' ? .22 : 1);
  z.ky += Math.sin(aim) * knock * (z.type === 'boss' ? .22 : 1);
  texts.push({
    x: z.x + rand(-12, 12), y: z.y - z.r * 1.5, vy: -78, life: .72, max: .72,
    text: crit ? `暴击 ${Math.round(dmg)}` : String(Math.round(dmg)),
    color: crit ? '#ffd166' : dmg >= 100 ? '#ffd166' : '#fff'
  });
  for (let i = 0; i < 9; i++) {
    const a = aim + rand(-.7, .7), sp = rand(90, 300);
    particles.push({ x: z.x, y: z.y - z.r * .75, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 90, life: rand(.2, .48), max: .48, r: rand(2, 4.5), color: Math.random() < .8 ? '#b92e2e' : '#7a1d1d', g: 430 });
  }
  if (z.hp <= 0 && !z.dead) killZombie(z, aim);
  else audio.hit();
}

// 统一伤害入口：叠加天赋加成（全局增伤 / 精英增伤 / 斩杀增伤）与突破暴击
function dealDamage(z, base, aim, knock) {
  if (!player || z.dead) return;
  let dmg = base * player.dmgMul;
  if ((z.elite || z.type === 'boss') && player.eliteDmgMul > 1) dmg *= player.eliteDmgMul;
  if (player.executeMul > 1 && z.hp / z.maxHp < .35) dmg *= player.executeMul;
  const cs = critStats();
  const crit = Math.random() < cs.rate;
  if (crit) dmg *= cs.dmg;
  damageZombie(z, dmg, aim, knock, crit);
}

function explodeAt(x, y, dmg) {
  addShake(5);
  audio.boom();
  for (let i = 0; i < 22; i++) {
    const a = rand(0, Math.PI * 2), sp = rand(90, 380);
    particles.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 60, life: rand(.25, .5), max: .5, r: rand(2.5, 5), color: i % 3 ? '#ff9a4a' : '#ffe08a', g: 300 });
  }
  texts.push({ x, y: y - 34, vy: -60, life: .6, max: .6, text: '💥', color: '#ffd166' });
  for (const e of enemies) {
    if (e.dead) continue;
    const d = Math.hypot(e.x - x, e.y - y);
    if (d < 120) {
      const power = e.type === 'boss' ? .5 : e.elite ? .7 : 1;
      dealDamage(e, dmg * power, Math.atan2(e.y - y, e.x - x), 260);
    }
  }
}

function spawnXP(x, y, val) {
  pickups.push({
    kind: 'xp', val,
    x: clamp(x, 50, worldWidth - 50), y: clamp(y, laneTop + 8, laneBottom - 6),
    vx: rand(-150, 150), vy: -rand(150, 330), scat: .5,
    bob: rand(0, 10), life: 24
  });
}

function xpCurve(level) { return Math.round(42 * Math.pow(1.3, level - 1)); }

function gainXP(amount) {
  if (!player) return;
  player.xp += amount;
  while (player.xp >= player.xpNext) {
    player.xp -= player.xpNext;
    player.level++;
    player.xpNext = xpCurve(player.level);
    player.pendingLevelUps++;
    texts.push({ x: player.x, y: player.y - 108, vy: -60, life: 1.2, max: 1.2, text: `LEVEL UP · LV ${player.level}`, color: '#ffd166' });
  }
  updateHud();
  if (player.pendingLevelUps > 0 && state === 'playing') openLevelUp();
}

function killZombie(z, aim, opts = {}) {
  z.dead = true;
  score += z.score;
  kills++;
  // 经验宝石：精英 3 倍，BOSS 大量掉落
  const def = ENEMY_DEFS[z.type] || ENEMY_DEFS.walker;
  const xpVal = (def.xp || 6) * (z.elite ? 3 : 1);
  const gemCount = z.boss ? 6 : (def.base === 'brute' ? 2 : 1) + (z.elite ? 2 : 0);
  for (let i = 0; i < gemCount; i++) {
    spawnXP(z.x + rand(-16, 16), z.y - z.r * .6, Math.max(1, Math.round(xpVal / gemCount)));
  }
  if (player.lifesteal > 0) {
    player.hp = Math.min(player.maxHp, player.hp + player.lifesteal);
  }
  if (!opts.noBloom && player.bloom > 0) {
    const chance = Math.min(.6, .12 * player.bloom);
    if (Math.random() < chance) explodeAt(z.x, z.y - z.r * .5, 45 + 12 * player.bloom);
  }
  addShake(z.boss ? 14 : 3);
  vibrate(z.boss ? 110 : 22);
  audio.hit();
  if (z.boss) {
    audio.bossDown();
    for (let i = 0; i < 80; i++) {
      const a = rand(0, Math.PI * 2), sp = rand(80, 520);
      particles.push({ x: z.x, y: z.y - z.r * .7, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 160, life: rand(.4, 1.0), max: 1.0, r: rand(2.5, 6), color: i % 3 ? '#b92e2e' : '#ffd166', g: 360 });
    }
    spawnPickup(z.x - 46, z.y, 'health');
    spawnPickup(z.x + 46, z.y, 'ammo');
    // 分裂型 BOSS：死亡时召唤小怪群
    if (def.split && ENEMY_DEFS[def.split]) {
      const count = def.splitCount || 3;
      for (let i = 0; i < count; i++) {
        const spawn = spawnOne({ t: def.split });
        spawn.x = clamp(z.x + (i - (count - 1) / 2) * 70, 100, worldWidth - 100);
      }
      texts.push({ x: z.x, y: z.y - z.r * 1.4, vy: -60, life: 1.2, max: 1.2, text: `${ENEMY_DEFS[def.split].name} ×${count} 蜂拥而出`, color: '#b57bd6' });
    }
    bossRef = null;
    ui.bossHud.classList.add('hidden');
  } else {
    const luck = Math.max(1, player.luckMul);
    const r = Math.random();
    if (r < .10 * luck) spawnPickup(z.x, z.y, 'health');
    else if (r < .25 * luck) spawnPickup(z.x, z.y, 'ammo');
  }
  if (z.elite && !z.boss) {
    spawnPickup(z.x + rand(-24, 24), z.y, Math.random() < .5 ? 'health' : 'ammo');
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
function vibrate(duration) {
  const intensity = clamp(settings.shake ?? 1, 0, 1);
  if (!intensity || !navigator || typeof navigator.vibrate !== 'function') return;
  const ms = Math.max(1, Math.round(duration * intensity));
  try { navigator.vibrate(ms); } catch (err) { /* 部分浏览器仅在用户交互后允许震动 */ }
}

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
    const cap = clamp(7 + wave * 2, 8, 20);
    if (spawnTimer <= 0 && (enemies.length < cap || spawnQueue[0].boss)) {
      const entry = spawnQueue.shift();
      const spawned = spawnOne(entry);
      if (entry && typeof entry === 'object' && entry.elite && ENEMY_DEFS[entry.t] && !ENEMY_DEFS[entry.t].boss) {
        makeElite(spawned);
        audio.elite();
        texts.push({
          x: clamp(spawned.x, cam.x + 90, cam.x + W - 90), y: laneTop + 62, vy: -34,
          life: 1.5, max: 1.5, text: '⚠ 精英丧尸出现', color: '#ff8a5a'
        });
      }
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
        vibrate(38);
        audio.hurt();
        updateHud();
        hit = true;
      }
    } else {
      for (const c of crates) {
        if (segmentRect(b.px, b.py, b.x, b.y, c.x - c.w / 2, c.y - c.h * .75, c.w, c.h)) {
          damageCrate(c, b.dmg * player.dmgMul);
          hit = true;
          break;
        }
      }
      if (!hit) for (const z of enemies) {
        if (z.dead) continue;
        const hitR = z.r + 10;
        if (segmentCircle(b.px, b.py, b.x, b.y, z.x, z.y - z.r * .55, hitR)) {
          dealDamage(z, b.dmg, Math.atan2(b.vy, b.vx), b.knock || weapons.gun.knock);
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
      z.facing = dx >= 0 ? 1 : -1;
      const hoverY = laneTop - 128 + Math.sin(z.phase) * 32;
      const dirX = Math.abs(dx) < 250 ? -Math.sign(dx) : Math.abs(dx) > 520 ? Math.sign(dx) : 0;
      z.x += dirX * z.speed * dt;
      z.y += (hoverY - z.y) * 3 * dt;
      z.x += z.kx * dt;
      z.y += z.ky * dt;
      z.x = clamp(z.x, cam.x - 260, cam.x + W + 260);
      z.y = clamp(z.y, laneTop - 186, laneTop - 54);
      z.shotTimer = Math.max(0, z.shotTimer - dt);
      if (z.shotTimer <= 0 && Math.abs(dx) < 660) {
        z.shotTimer = z.boss ? rand(1.3, 2.1) : rand(1.25, 2.25);
        const ax = z.x, ay = z.y - 20;
        const baseA = Math.atan2(player.y - 32 - ay, player.x - ax);
        const sp = z.boss ? 520 : 560;
        // 飞行 BOSS 三连酸弹，普通飞行者单发
        const shots = z.boss ? [-.22, 0, .22] : [0];
        for (const off of shots) {
          const a = baseA + off;
          bullets.push({ x: ax, y: ay, px: ax, py: ay, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1.9, dmg: z.dmg, knock: 120, enemy: true, color: '#9dff66' });
        }
        audio.spit();
      }
      continue;
    }
    if (z.boss && z.ranged) {
      // 远程地面 BOSS：间歇向玩家投掷毒弹
      z.shotTimer = Math.max(0, z.shotTimer - dt);
      if (z.shotTimer <= 0 && Math.abs(dx) < 720) {
        z.shotTimer = rand(1.7, 2.7);
        const ax = z.x, ay = z.y - z.r * .7;
        const a = Math.atan2(player.y - 32 - ay, player.x - ax);
        const sp = 460;
        for (const off of [-.14, .14]) {
          const aa = a + off;
          bullets.push({ x: ax, y: ay, px: ax, py: ay, vx: Math.cos(aa) * sp, vy: Math.sin(aa) * sp, life: 2.1, dmg: Math.round(z.dmg * .7), knock: 140, enemy: true, color: '#b6ff66' });
        }
        audio.spit();
      }
    }
    z.facing = dx >= 0 ? 1 : -1;
    z.x += (dx / d) * z.speed * dt;
    z.y += (dy / d) * z.speed * dt;
    z.x += z.kx * dt; z.y += z.ky * dt;
    z.y = clamp(z.y, laneTop - 8, laneBottom + 4);
    z.x = clamp(z.x, 40, worldWidth - 40);
    z.x = clamp(z.x, cam.x - 260, cam.x + W + 260);

    const touch = d < z.r + player.r - 2;
    if (touch && z.attackCd <= 0 && player.invuln <= 0) {
      z.attackCd = .78;
      player.hp -= z.dmg;
      player.invuln = .72;
      player.hurtFlash = .28;
      addShake(7);
      vibrate(55);
      player.knockX = -dx / d * 220;
      player.knockY = -dy / d * 180;
      audio.hurt();
      if (player.thorns > 0 && !z.dead) {
        dealDamage(z, player.thorns, Math.atan2(z.y - player.y, z.x - player.x), 200);
      }
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
    if (p.kind === 'xp' && p.scat > 0) {
      // 经验宝石落地弹跳
      p.scat -= dt;
      p.x = clamp(p.x + p.vx * dt, 50, worldWidth - 50);
      p.y = clamp(p.y + p.vy * dt, laneTop + 6, laneBottom - 6);
      p.vy += 620 * dt;
      p.vx *= 1 - clamp(dt * 2.2, 0, 1);
    } else if (p.kind === 'xp' && !player.dead) {
      // 磁吸：靠近玩家自动飞向玩家
      const magnetR = 120 * player.magnetMul;
      const dxp = player.x - p.x, dyp = player.y - 14 - p.y;
      const dp = Math.hypot(dxp, dyp) || 1;
      if (dp < magnetR) {
        const sp = clamp(780 - dp * 2.2, 240, 760);
        p.x += dxp / dp * sp * dt;
        p.y += dyp / dp * sp * dt;
      }
    }
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
        } else if (p.kind === 'xp') {
          gainXP(p.val);
          audio.xp();
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
  setIngame(false);
  dismissTouchHint();
  commitBest();
  addShake(18);
  vibrate(160);
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
  if (ui.xpFill && player) {
    ui.xpFill.style.width = `${clamp(player.xp / player.xpNext * 100, 0, 100)}%`;
    ui.xpLevelText.textContent = `LV ${player.level}`;
  }
  updateWeaponBar();
}

let weaponBarSig = '';
function updateWeaponBar() {
  if (!ui.weaponBar || !player) return;
  const sig = `${player.inventory.join(',')}|${player.weapon}`;
  if (sig !== weaponBarSig) {
    weaponBarSig = sig;
    const showKeys = !document.body.classList.contains('touch');
    ui.weaponBar.innerHTML = player.inventory.map((name, index) => {
      const w = weapons[name];
      if (!w) return '';
      return `<button type="button" class="wchip" data-w="${name}" style="--wc:${w.color}"><b>${w.short}</b><i></i>${showKeys ? `<em>${index + 1}</em>` : ''}</button>`;
    }).join('');
  }
  ui.weaponBar.querySelectorAll('.wchip').forEach(chip => {
    const name = chip.dataset.w;
    const w = weapons[name];
    if (!w) return;
    const ammo = w.kind === 'melee' ? (w.infinite ? '∞' : Math.max(0, Math.round(player.ammoByWeapon[name] || 0))) : Math.max(0, Math.round(weaponAmmo(name)));
    chip.querySelector('i').textContent = ammo;
    chip.classList.toggle('active', name === player.weapon);
    chip.classList.toggle('empty', w.kind !== 'melee' && ammo <= 0);
  });
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
  drawProps();
  drawLampsBack();
  drawCrates();
  drawDecals();
  drawPickups();
  const sorted = enemies.slice().sort((a, b) => a.y - b.y);
  for (const z of sorted) drawZombie(z);
  drawSpawnMarkers();
  drawBullets();
  if (player) drawPlayer();
  drawParticles();
  drawLampsGlow();
  drawEdgeFog();
  ctx.restore();
  ctx.restore();
  drawForeground();
  drawSceneTint();
  drawVignette();
  drawAmbient();
  if (state === 'playing' && player) drawCrosshair();
}

const gradCache = {};
function cachedGradient(key, build) {
  if (!gradCache[key]) gradCache[key] = build();
  return gradCache[key];
}
function clearGradientCache() {
  for (const key in gradCache) delete gradCache[key];
}

function drawSky() {
  const day = theme === 'day';
  const g = cachedGradient(`sky-${theme}`, () => {
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    if (day) {
      grad.addColorStop(0, '#2f8cff');
      grad.addColorStop(.28, '#62b9ff');
      grad.addColorStop(.6, '#a7dcff');
      grad.addColorStop(.82, '#e5f5ff');
      grad.addColorStop(1, '#d5e9d5');
    } else {
      grad.addColorStop(0, '#070b13');
      grad.addColorStop(.22, '#11182a');
      grad.addColorStop(.52, '#252640');
      grad.addColorStop(.76, '#483244');
      grad.addColorStop(1, '#241f2a');
    }
    return grad;
  });
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  const bossActive = state === 'playing' && bossRef;
  ctx.save();
  if (day) {
    const sunX = W * .74 - cam.x * .04, sunY = H * .18;
    const halo = cachedGradient('sun-halo', () => {
      const grad = ctx.createRadialGradient(0, 0, 18, 0, 0, 128);
      grad.addColorStop(0, 'rgba(255,248,190,.95)');
      grad.addColorStop(.35, 'rgba(255,229,142,.34)');
      grad.addColorStop(1, 'rgba(255,229,142,0)');
      return grad;
    });
    ctx.save();
    ctx.translate(sunX, sunY);
    ctx.fillStyle = halo;
    ctx.beginPath(); ctx.arc(0, 0, 128, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff6bd';
    ctx.beginPath(); ctx.arc(0, 0, 41, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.fillStyle = 'rgba(255,255,255,.72)';
    for (let i = 0; i < 6; i++) {
      const cx = ((i * 241 - cam.x * .06) % W + W) % W;
      const cy = 48 + (i % 3) * 44;
      ctx.beginPath(); ctx.ellipse(cx, cy, 88, 18, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(210,232,255,.55)';
      ctx.beginPath(); ctx.ellipse(cx + 20, cy + 8, 58, 11, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.72)';
    }
    ctx.strokeStyle = 'rgba(60,82,96,.18)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      const bx = ((i * 311 - cam.x * .08) % W + W) % W;
      const by = 108 + (i % 2) * 54;
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo(bx + 13, by - 5, bx + 26, by); ctx.stroke();
    }
  } else {
    const moonX = W * .78 - cam.x * .02, moonY = H * .18;
    const halo = cachedGradient(bossActive ? 'moon-halo-boss' : 'moon-halo', () => {
      const grad = ctx.createRadialGradient(0, 0, 12, 0, 0, 92);
      if (bossActive) {
        grad.addColorStop(0, 'rgba(255,120,90,.5)');
        grad.addColorStop(1, 'rgba(255,90,60,0)');
      } else {
        grad.addColorStop(0, 'rgba(255,236,170,.34)');
        grad.addColorStop(1, 'rgba(255,236,170,0)');
      }
      return grad;
    });
    ctx.save();
    ctx.translate(moonX + 8, moonY - 8);
    ctx.fillStyle = halo;
    ctx.beginPath(); ctx.arc(0, 0, 92, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.globalAlpha = .88;
    ctx.fillStyle = bossActive ? '#ff9d84' : '#f5e4a7';
    ctx.beginPath(); ctx.arc(moonX, moonY, 37, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = bossActive ? 'rgba(150,50,30,.4)' : 'rgba(178,156,103,.36)';
    ctx.beginPath(); ctx.arc(moonX - 9, moonY - 10, 7, 0, Math.PI * 2); ctx.arc(moonX + 10, moonY + 4, 5, 0, Math.PI * 2); ctx.arc(moonX - 2, moonY + 12, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(20,23,36,.28)';
    ctx.beginPath(); ctx.arc(moonX + 15, moonY - 7, 35, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(190,180,255,.2)';
    for (let i = 0; i < 4; i++) {
      const cx = ((i * 291 - cam.x * .12) % W + W) % W;
      const cy = 66 + (i % 3) * 48;
      ctx.beginPath(); ctx.ellipse(cx, cy, 112, 16, 0, 0, Math.PI * 2); ctx.fill();
    }
    // 远处城区的地平线光晕，衬托末日都市的纵深
    const glow = cachedGradient('city-glow', () => {
      const grad = ctx.createLinearGradient(0, laneTop - 150, 0, laneTop + 6);
      grad.addColorStop(0, 'rgba(255,150,80,0)');
      grad.addColorStop(.72, 'rgba(255,150,80,.05)');
      grad.addColorStop(1, 'rgba(255,170,90,.14)');
      return grad;
    });
    ctx.fillStyle = glow;
    ctx.fillRect(0, laneTop - 150, W, 156);
  }
  ctx.restore();
  if (!day) {
    for (let i = 0; i < 48; i++) {
      const x = ((i * 173 - cam.x * .06) % W + W) % W;
      const y = ((i * 91 + 34) % (laneTop - 50)) + 12;
      const seed = (i * 17) % 8;
      const twinkle = .38 + ((Math.sin(globalTime * 1.7 + seed) + 1) * .2) + (i % 5) / 12;
      ctx.globalAlpha = clamp(twinkle, .12, .85);
      ctx.fillStyle = i % 7 === 0 ? '#aee6ff' : '#fff';
      ctx.fillRect(x, y, i % 4 === 0 ? 3 : 2, i % 4 === 0 ? 3 : 2);
    }
    ctx.globalAlpha = 1;
  }
}

function buildingSideColor(b, day) {
  if (day) {
    const r = 126 + Math.floor(b.tone * 34);
    const g = 138 + Math.floor(b.tone * 28);
    const blue = 152 + Math.floor(b.tone * 22);
    return `rgb(${r},${g},${blue})`;
  }
  const tone = 22 + Math.floor(b.tone * 14);
  return `rgb(${tone},${tone + 3},${tone + 18})`;
}

function drawBuildingWindows(c, b, cols, rows, ww, wh, density) {
  const lit = theme === 'day' ? 'rgba(255,255,255,.6)' : 'rgba(255,203,118,.5)';
  const dark = theme === 'day' ? 'rgba(37,52,66,.42)' : 'rgba(7,9,14,.52)';
  const px = b.x + 8, py = b.y + 14;
  const usableW = Math.max(16, b.w - 20), usableH = Math.max(20, b.h - 34);
  const gapX = Math.max(6, (usableW - cols * ww) / Math.max(1, cols));
  const gapY = Math.max(6, (usableH - rows * wh) / Math.max(1, rows));
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const seed = (col * 31 + row * 17 + Math.floor(b.x)) % 100;
      if (seed / 100 > density) continue;
      const wx = px + col * (ww + gapX);
      const wy = py + row * (wh + gapY);
      if (wy + wh > b.y + b.h - 8) break;
      c.fillStyle = seed % 7 === 0 ? '#ffd166' : (seed % 11 === 0 ? lit : dark);
      c.fillRect(wx, wy, ww, wh);
      c.fillStyle = 'rgba(255,255,255,.16)';
      c.fillRect(wx, wy, ww, 1);
    }
  }
}

function paintFarBuilding(c, b, day) {
  c.fillStyle = buildingSideColor(b, day);
  rr(c, b.x, b.y, b.w, b.h, 3); c.fill();
  c.fillStyle = day ? 'rgba(255,255,255,.22)' : 'rgba(80,96,128,.16)';
  rr(c, b.x, b.y, 3, b.h, 2); c.fill();
  drawBuildingWindows(c, b, Math.max(2, Math.floor(b.w / 18)), Math.max(2, Math.floor(b.h / 24)), 5, 7, day ? .48 : .38);
  if (b.roof) {
    c.fillStyle = day ? 'rgba(72,86,100,.55)' : 'rgba(12,15,22,.8)';
    rr(c, b.x - 3, b.y - 6, b.w + 6, 8, 2); c.fill();
  }
  if (b.antenna) {
    c.strokeStyle = day ? 'rgba(76,90,104,.55)' : 'rgba(9,12,18,.75)';
    c.lineWidth = 2;
    c.beginPath(); c.moveTo(b.x + b.w * .5, b.y); c.lineTo(b.x + b.w * .5, b.y - 22); c.stroke();
    c.fillStyle = '#ff6a6a';
    c.beginPath(); c.arc(b.x + b.w * .5, b.y - 24, 2.2, 0, Math.PI * 2); c.fill();
  }
  if (b.tank) {
    c.fillStyle = day ? '#93a2ad' : '#151b27';
    rr(c, b.x + b.w * .62, b.y - 17, 18, 17, 4); c.fill();
    c.fillStyle = 'rgba(255,255,255,.15)';
    c.fillRect(b.x + b.w * .64, b.y - 14, 3, 8);
  }
  if (!day && b.led) {
    c.fillStyle = b.ledColor;
    c.globalAlpha = .64;
    rr(c, b.x + 4, b.y + 7, 10, 18, 2); c.fill();
    c.globalAlpha = 1;
  }
  if (b.damage > .08) {
    c.strokeStyle = day ? 'rgba(63,75,88,.32)' : 'rgba(0,0,0,.32)';
    c.lineWidth = 1.2;
    c.beginPath(); c.moveTo(b.x + b.w * .3, b.y + 9); c.lineTo(b.x + b.w * .42, b.y + b.h * .36); c.lineTo(b.x + b.w * .28, b.y + b.h * .68); c.stroke();
  }
}

function paintNearBuilding(c, b, day) {
  c.fillStyle = day ? '#9aa7b4' : '#141a25';
  rr(c, b.x, b.y, b.w, b.h, 4); c.fill();
  c.fillStyle = day ? 'rgba(255,255,255,.24)' : 'rgba(96,110,138,.13)';
  rr(c, b.x + 4, b.y + 4, 5, b.h - 12, 2); c.fill();
  c.fillStyle = day ? 'rgba(42,55,68,.32)' : 'rgba(5,7,11,.34)';
  rr(c, b.x + b.w - 8, b.y + 4, 6, b.h - 12, 2); c.fill();
  drawBuildingWindows(c, b, Math.max(2, Math.floor(b.w / 34)), Math.max(2, Math.floor(b.h / 36)), 12, 15, day ? .55 : .42);
  c.fillStyle = day ? 'rgba(62,76,88,.72)' : 'rgba(11,14,20,.86)';
  rr(c, b.x - 4, b.y - 10, b.w + 8, 12, 3); c.fill();
  c.strokeStyle = day ? 'rgba(255,255,255,.3)' : 'rgba(150,165,190,.16)';
  c.lineWidth = 2;
  c.beginPath();
  c.moveTo(b.x + 7, b.y - 5); c.lineTo(b.x + b.w - 7, b.y - 5);
  c.stroke();
  if (b.tank) {
    c.fillStyle = day ? '#7f8d98' : '#111722';
    rr(c, b.x + b.w * .68, b.y - 28, 30, 28, 5); c.fill();
    c.fillStyle = day ? '#aeb9c2' : '#202836';
    rr(c, b.x + b.w * .68 + 3, b.y - 30, 24, 5, 2); c.fill();
  }
  if (b.antenna) {
    c.strokeStyle = day ? 'rgba(54,66,78,.7)' : 'rgba(8,11,17,.85)';
    c.lineWidth = 4;
    c.beginPath(); c.moveTo(b.x + b.w * .5, b.y - 9); c.lineTo(b.x + b.w * .5, b.y - 48); c.stroke();
    c.lineWidth = 2;
    c.beginPath(); c.moveTo(b.x + b.w * .5 - 12, b.y - 22); c.lineTo(b.x + b.w * .5 + 12, b.y - 22); c.stroke();
    c.fillStyle = '#ff5a5a';
    c.beginPath(); c.arc(b.x + b.w * .5, b.y - 50, 3, 0, Math.PI * 2); c.fill();
  }
  if (!day && b.led) {
    c.fillStyle = b.ledColor;
    c.globalAlpha = .78;
    rr(c, b.x + 7, b.y + 8, 13, 27, 3); c.fill();
    c.globalAlpha = .22;
    c.beginPath(); c.arc(b.x + 13, b.y + 21, 20, 0, Math.PI * 2); c.fill();
    c.globalAlpha = 1;
  }
  if (b.damage > .09) {
    c.strokeStyle = 'rgba(0,0,0,.34)';
    c.lineWidth = 2;
    c.beginPath(); c.moveTo(b.x + b.w * .3, b.y + 12); c.lineTo(b.x + b.w * .44, b.y + b.h * .34); c.lineTo(b.x + b.w * .26, b.y + b.h * .72); c.stroke();
  }
  c.fillStyle = 'rgba(0,0,0,.38)';
  c.fillRect(b.x, b.y + b.h - 8, b.w, 8);
}

// 城市背景层预烘焙：按当前主题与视口宽度把整层建筑画进离屏画布，
// 运行时每层只需一次 drawImage，手机端帧率显著提升
const cityCache = { theme: null, w: 0, dpr: 0, far: null, near: null };
function buildCityLayer(layer, parallax, y0, y1, paint) {
  const x0 = -100;
  const x1 = (worldWidth - W) * parallax + W + 100;
  const bw = x1 - x0, bh = y1 - y0;
  let s = Math.min(view.dpr, 2);
  const budget = 6e6;
  const total = bw * bh * 2 * s * s;
  if (total > budget) s *= Math.sqrt(budget / total);
  const cv = document.createElement('canvas');
  cv.width = Math.max(1, Math.round(bw * s));
  cv.height = Math.max(1, Math.round(bh * s));
  const octx = cv.getContext('2d');
  octx.scale(s, s);
  octx.translate(-x0, -y0);
  const day = theme === 'day';
  for (const b of layer) paint(octx, b, day);
  return { cv, x0, y0, w: bw, h: bh };
}
function ensureCityCache() {
  if (cityCache.theme === theme && cityCache.w === W && cityCache.dpr === view.dpr) return;
  cityCache.theme = theme;
  cityCache.w = W;
  cityCache.dpr = view.dpr;
  cityCache.far = buildCityLayer(farLayer, .28, 0, laneTop + 40, paintFarBuilding);
  cityCache.near = buildCityLayer(nearLayer, .58, -96, laneTop + 40, paintNearBuilding);
}

function drawFarCity() {
  ensureCityCache();
  ctx.save();
  ctx.translate(-cam.x * .28, cam.y * .35 + 8);
  const L = cityCache.far;
  ctx.drawImage(L.cv, 0, 0, L.cv.width, L.cv.height, L.x0, L.y0, L.w, L.h);
  const haze = cachedGradient(`haze-${theme}`, () => {
    const grad = ctx.createLinearGradient(0, laneTop - 92, 0, laneTop + 20);
    grad.addColorStop(0, theme === 'day' ? 'rgba(213,233,255,0)' : 'rgba(24,24,42,0)');
    grad.addColorStop(1, theme === 'day' ? 'rgba(213,233,255,.38)' : 'rgba(24,24,42,.45)');
    return grad;
  });
  ctx.fillStyle = haze;
  ctx.fillRect(cam.x * .28 - 120, laneTop - 100, W + 240, 120);
  ctx.restore();
}

function drawNearCity() {
  ensureCityCache();
  ctx.save();
  ctx.translate(-cam.x * .58, cam.y * .78 - 18);
  const L = cityCache.near;
  ctx.drawImage(L.cv, 0, 0, L.cv.width, L.cv.height, L.x0, L.y0, L.w, L.h);
  ctx.restore();
}

function drawGround() {
  const x0 = cam.x - 120, w = W + 240;
  const g = cachedGradient(`ground-${theme}`, () => {
    const grad = ctx.createLinearGradient(0, laneTop - 60, 0, laneBottom + 90);
    if (theme === 'day') {
      grad.addColorStop(0, '#718a5a');
      grad.addColorStop(.22, '#a2b871');
      grad.addColorStop(.48, '#b2c67a');
      grad.addColorStop(.78, '#8ba268');
      grad.addColorStop(1, '#637a4d');
    } else {
      grad.addColorStop(0, '#0e1119');
      grad.addColorStop(.26, '#1c2030');
      grad.addColorStop(.52, '#262b3a');
      grad.addColorStop(.78, '#191d29');
      grad.addColorStop(1, '#10131b');
    }
    return grad;
  });
  ctx.fillStyle = g;
  ctx.fillRect(x0, laneTop - 40, w, laneBottom - laneTop + 150);

  // 人行道与路缘石：建筑和马路之间的过渡带
  const walkG = cachedGradient(`walk-${theme}`, () => {
    const grad = ctx.createLinearGradient(0, laneTop - 44, 0, laneTop + 2);
    if (theme === 'day') {
      grad.addColorStop(0, '#9aa38b');
      grad.addColorStop(1, '#7d8770');
    } else {
      grad.addColorStop(0, '#171b26');
      grad.addColorStop(1, '#20242f');
    }
    return grad;
  });
  ctx.fillStyle = walkG;
  ctx.fillRect(x0, laneTop - 44, w, 44);
  ctx.strokeStyle = theme === 'day' ? 'rgba(46,58,40,.28)' : 'rgba(0,0,0,.4)';
  ctx.lineWidth = 1.4;
  for (let x = Math.floor((cam.x - 120) / 92) * 92; x < cam.x + W + 120; x += 92) {
    ctx.beginPath(); ctx.moveTo(x, laneTop - 44); ctx.lineTo(x - 7, laneTop - 2); ctx.stroke();
  }
  ctx.fillStyle = theme === 'day' ? 'rgba(232,238,226,.5)' : 'rgba(150,160,180,.2)';
  ctx.fillRect(x0, laneTop - 5, w, 3);
  ctx.fillStyle = theme === 'day' ? 'rgba(58,70,48,.35)' : 'rgba(0,0,0,.45)';
  ctx.fillRect(x0, laneTop - 2, w, 4);

  ctx.fillStyle = theme === 'day' ? 'rgba(255,255,255,.28)' : 'rgba(126,224,129,.16)';
  ctx.fillRect(x0, laneTop, w, 3);
  ctx.fillStyle = 'rgba(0,0,0,.24)';
  ctx.fillRect(x0, laneTop + 3, w, 5);

  // 斑马线：给街区增加可辨识的地标
  ctx.save();
  for (const cxw of crosswalks) {
    if (cxw + 150 < cam.x - 120 || cxw - 150 > cam.x + W + 120) continue;
    ctx.fillStyle = theme === 'day' ? 'rgba(235,240,232,.4)' : 'rgba(196,204,220,.16)';
    for (let i = 0; i < 7; i++) {
      ctx.fillRect(cxw - 66 + i * 20, laneTop + 16, 12, laneBottom - laneTop - 34);
    }
  }
  ctx.restore();

  const patchColor = theme === 'day' ? 'rgba(92,114,71,.22)' : 'rgba(126,224,129,.08)';
  const patchColor2 = theme === 'day' ? 'rgba(255,255,255,.13)' : 'rgba(0,0,0,.15)';
  for (let x = Math.floor((cam.x - 120) / 220) * 220; x < cam.x + W + 120; x += 220) {
    ctx.fillStyle = patchColor;
    rr(ctx, x + 18, laneTop + 10 + ((x / 220) % 2) * 150, 92, 16, 7); ctx.fill();
    ctx.fillStyle = patchColor2;
    rr(ctx, x + 82, laneTop + 36 + ((x / 220) % 2) * 120, 54, 10, 5); ctx.fill();
  }

  ctx.strokeStyle = theme === 'day' ? 'rgba(61,78,48,.28)' : 'rgba(0,0,0,.3)';
  ctx.lineWidth = 2;
  for (let x = Math.floor((cam.x - 90) / 140) * 140; x < cam.x + W + 90; x += 140) {
    const y = laneTop + 45 + ((x / 140) % 3) * 82;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 20, y + 6, x + 45, y - 3); ctx.stroke();
  }
  ctx.fillStyle = theme === 'day' ? 'rgba(255,255,255,.18)' : 'rgba(255,255,255,.05)';
  for (let x = Math.floor((cam.x - 80) / 96) * 96; x < cam.x + W + 80; x += 96) {
    ctx.beginPath(); ctx.arc(x + 16, laneBottom - 12 - ((x / 96) % 2) * 20, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + 52, laneTop + 64 + ((x / 96) % 2) * 36, 1.7, 0, Math.PI * 2); ctx.fill();
  }
  ctx.strokeStyle = 'rgba(255,255,255,.075)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x0, laneBottom + 5);
  ctx.lineTo(x0 + w, laneBottom + 5);
  ctx.stroke();
  ctx.fillStyle = theme === 'day' ? 'rgba(46,62,36,.18)' : 'rgba(0,0,0,.25)';
  ctx.fillRect(x0, laneBottom + 8, w, 34);
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
      ctx.fillStyle = 'rgba(108,114,126,.48)';
      rr(ctx, -s.r * .6, -s.r * .32, s.r * .9, s.r * .45, 3); ctx.fill();
      ctx.restore();
    } else if (s.kind === 'crack') {
      ctx.strokeStyle = theme === 'day' ? 'rgba(66,80,54,.48)' : 'rgba(0,0,0,.5)';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(-s.r, -s.r * .2); ctx.lineTo(-3, s.r * .12); ctx.lineTo(s.r * .4, -s.r * .18); ctx.lineTo(s.r, s.r * .24); ctx.stroke();
      ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(-3, s.r * .12); ctx.lineTo(-8, -s.r * .42); ctx.stroke();
    } else if (s.kind === 'patch') {
      ctx.fillStyle = theme === 'day' ? 'rgba(125,143,95,.38)' : 'rgba(38,46,61,.55)';
      ctx.save(); ctx.rotate(s.tilt);
      rr(ctx, -s.r, -s.r * .35, s.r * 2, s.r * .7, 8); ctx.fill();
      ctx.fillStyle = theme === 'day' ? 'rgba(255,255,255,.13)' : 'rgba(255,255,255,.05)';
      rr(ctx, -s.r * .7, -s.r * .28, s.r * .8, 3, 2); ctx.fill();
      ctx.restore();
    } else {
      ctx.fillStyle = '#d96624';
      ctx.beginPath(); ctx.moveTo(0, -s.r); ctx.lineTo(s.r * .72, s.r * .6); ctx.lineTo(-s.r * .72, s.r * .6); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#e67a2e';
      ctx.beginPath(); ctx.moveTo(0, -s.r); ctx.lineTo(s.r * .38, -s.r * .12); ctx.lineTo(0, s.r * .6); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.fillRect(-3, -s.r * .35, 6, s.r);
      ctx.fillStyle = 'rgba(0,0,0,.18)';
      ctx.beginPath(); ctx.moveTo(0, s.r * .6); ctx.lineTo(s.r * .72, s.r * .6); ctx.lineTo(s.r * .3, -s.r * .1); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }
}

function drawProps() {
  const day = theme === 'day';
  for (const p of props) {
    if (p.x < cam.x - 200 || p.x > cam.x + W + 200) continue;
    ctx.save();
    ctx.translate(p.x, p.y);
    if (p.kind === 'manhole' || p.kind === 'grate') {
      ctx.fillStyle = 'rgba(0,0,0,.3)';
      if (p.kind === 'manhole') {
        ctx.beginPath(); ctx.ellipse(0, 0, 15, 6, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = day ? 'rgba(70,80,66,.5)' : 'rgba(90,98,116,.4)';
        ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.ellipse(0, 0, 15, 6, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.ellipse(0, 0, 9, 3.6, 0, 0, Math.PI * 2); ctx.stroke();
      } else {
        ctx.fillStyle = day ? 'rgba(60,70,58,.45)' : 'rgba(14,17,24,.6)';
        rr(ctx, -17, -6, 34, 12, 3); ctx.fill();
        ctx.strokeStyle = day ? 'rgba(30,38,28,.5)' : 'rgba(70,78,94,.45)';
        ctx.lineWidth = 1.6;
        for (let i = -12; i <= 12; i += 6) {
          ctx.beginPath(); ctx.moveTo(i, -5); ctx.lineTo(i, 5); ctx.stroke();
        }
      }
      ctx.restore();
      continue;
    }
    if (p.kind === 'barricade') {
      ctx.fillStyle = 'rgba(0,0,0,.28)';
      ctx.beginPath(); ctx.ellipse(0, 12, 44, 9, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = day ? '#6c6f68' : '#3a3f4a';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-34, 10); ctx.lineTo(-28, -14);
      ctx.moveTo(34, 10); ctx.lineTo(28, -14);
      ctx.stroke();
      ctx.save();
      ctx.beginPath();
      rr(ctx, -46, -30, 92, 18, 4);
      ctx.clip();
      ctx.fillStyle = p.burnt ? '#4a453d' : '#d96624';
      ctx.fillRect(-46, -30, 92, 18);
      ctx.fillStyle = p.burnt ? '#5a554c' : '#e8e4da';
      for (let i = -3; i < 4; i++) {
        ctx.save();
        ctx.translate(i * 24, 0);
        ctx.rotate(.5);
        ctx.fillRect(-6, -34, 12, 40);
        ctx.restore();
      }
      ctx.restore();
      ctx.strokeStyle = 'rgba(0,0,0,.35)';
      ctx.lineWidth = 1.6;
      rr(ctx, -46, -30, 92, 18, 4); ctx.stroke();
      ctx.restore();
      continue;
    }
    // 废弃车辆
    const tone = propTones[p.tone] || propTones[0];
    const body = p.burnt ? '#33302e' : tone.body;
    const dark = p.burnt ? '#211f1e' : tone.dark;
    const glass = p.burnt ? '#0c0f13' : tone.glass;
    const len = p.kind === 'bus' ? 168 : p.kind === 'van' ? 128 : 108;
    const hgt = p.kind === 'bus' ? 46 : p.kind === 'van' ? 42 : 32;
    ctx.fillStyle = 'rgba(0,0,0,.32)';
    ctx.beginPath(); ctx.ellipse(0, 10, len * .52, 10, 0, 0, Math.PI * 2); ctx.fill();
    ctx.scale(p.flip ? -1 : 1, 1);
    ctx.fillStyle = dark;
    rr(ctx, -len * .5, -hgt * .82, len, hgt * .78, 9); ctx.fill();
    ctx.fillStyle = body;
    rr(ctx, -len * .5, -hgt * .94, len, hgt * .74, 10); ctx.fill();
    if (p.kind === 'car') {
      ctx.fillStyle = body;
      rr(ctx, -len * .26, -hgt * 1.42, len * .52, hgt * .62, 8); ctx.fill();
      ctx.fillStyle = glass;
      rr(ctx, -len * .21, -hgt * 1.34, len * .42, hgt * .44, 5); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.14)';
      rr(ctx, -len * .21, -hgt * 1.34, len * .18, hgt * .44, 5); ctx.fill();
    } else {
      ctx.fillStyle = glass;
      const wins = p.kind === 'bus' ? 4 : 2;
      for (let i = 0; i < wins; i++) {
        rr(ctx, -len * .42 + i * (len * .46 / wins), -hgt * 1.32, len * .34 / wins + 8, hgt * .42, 4); ctx.fill();
      }
    }
    ctx.fillStyle = 'rgba(255,255,255,.1)';
    rr(ctx, -len * .46, -hgt * .9, len * .92, 5, 3); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,.28)';
    rr(ctx, -len * .5, -hgt * .3, len, hgt * .16, 6); ctx.fill();
    if (p.burnt) {
      ctx.fillStyle = 'rgba(20,16,14,.55)';
      rr(ctx, -len * .4, -hgt * .78, len * .3, hgt * .3, 6); ctx.fill();
      rr(ctx, len * .08, -hgt * .84, len * .24, hgt * .26, 6); ctx.fill();
    }
    ctx.fillStyle = '#15171c';
    for (const wx of [-len * .3, len * .3]) {
      ctx.beginPath(); ctx.arc(wx, -2, 11, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#2c2f36';
      ctx.beginPath(); ctx.arc(wx, -2, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#15171c';
    }
    ctx.restore();
  }
}

function drawLampsBack() {
  const day = theme === 'day';
  for (const l of lamps) {
    if (l.x < cam.x - 60 || l.x > cam.x + W + 60) continue;
    const dir = l.side;
    ctx.strokeStyle = day ? '#5b6670' : '#242c3a';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(l.x, laneTop - 2);
    ctx.lineTo(l.x, laneTop - 92);
    ctx.quadraticCurveTo(l.x, laneTop - 106, l.x + dir * 26, laneTop - 104);
    ctx.stroke();
    ctx.fillStyle = day ? '#8d99a4' : '#39445a';
    rr(ctx, l.x + dir * 26 - 9, laneTop - 108, 18, 8, 3); ctx.fill();
    ctx.fillStyle = day ? '#cfd8de' : '#ffd88a';
    rr(ctx, l.x + dir * 26 - 6, laneTop - 102, 12, 4, 2); ctx.fill();
  }
}

function drawLampsGlow() {
  if (theme === 'day') return;
  const glow = cachedGradient('lamp-glow', () => {
    const grad = ctx.createRadialGradient(0, 0, 4, 0, 0, 120);
    grad.addColorStop(0, 'rgba(255,214,140,.34)');
    grad.addColorStop(.45, 'rgba(255,200,120,.1)');
    grad.addColorStop(1, 'rgba(255,190,110,0)');
    return grad;
  });
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (const l of lamps) {
    if (l.x < cam.x - 160 || l.x > cam.x + W + 160) continue;
    const hx = l.x + l.side * 26, hy = laneTop - 100;
    ctx.save();
    ctx.translate(hx, hy);
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(0, 0, 120, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.fillStyle = 'rgba(255,208,130,.05)';
    ctx.beginPath();
    ctx.ellipse(hx + l.side * 8, laneTop + 22, 86, 22, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawEdgeFog() {
  const left = cachedGradient(`edge-l-${theme}`, () => {
    const grad = ctx.createLinearGradient(0, 0, 190, 0);
    if (theme === 'day') {
      grad.addColorStop(0, 'rgba(214,228,238,.66)');
      grad.addColorStop(1, 'rgba(214,228,238,0)');
    } else {
      grad.addColorStop(0, 'rgba(8,10,16,.85)');
      grad.addColorStop(1, 'rgba(8,10,16,0)');
    }
    return grad;
  });
  const right = cachedGradient(`edge-r-${theme}`, () => {
    const grad = ctx.createLinearGradient(worldWidth, 0, worldWidth - 190, 0);
    if (theme === 'day') {
      grad.addColorStop(0, 'rgba(214,228,238,.66)');
      grad.addColorStop(1, 'rgba(214,228,238,0)');
    } else {
      grad.addColorStop(0, 'rgba(8,10,16,.85)');
      grad.addColorStop(1, 'rgba(8,10,16,0)');
    }
    return grad;
  });
  ctx.fillStyle = left;
  ctx.fillRect(0, laneTop - 44, 190, laneBottom - laneTop + 110);
  ctx.fillStyle = right;
  ctx.fillRect(worldWidth - 190, laneTop - 44, 190, laneBottom - laneTop + 110);
}

function drawForeground() {
  const color = theme === 'day' ? 'rgba(20,30,16,.88)' : 'rgba(4,6,10,.92)';
  for (const f of fgItems) {
    const px = f.x - cam.x * 1.16;
    if (px < -180 || px > W + 180) continue;
    const baseY = H + 6;
    ctx.fillStyle = color;
    if (f.kind === 'bush') {
      ctx.beginPath();
      ctx.ellipse(px, baseY, f.w * .5, f.h, 0, 0, Math.PI * 2);
      ctx.ellipse(px + f.w * .42, baseY - f.h * .3, f.w * .34, f.h * .72, 0, 0, Math.PI * 2);
      ctx.ellipse(px - f.w * .4, baseY - f.h * .2, f.w * .3, f.h * .6, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.save();
      ctx.translate(px, baseY - f.h * .5);
      ctx.rotate(f.seed - 5);
      rr(ctx, -f.w * .3, -f.h * .5, f.w * .6, f.h, 3);
      ctx.fill();
      ctx.restore();
    }
  }
}

// 场景氛围：章节场景控制天气与色调（雨夜/废墟/雾港/暗河等）
let sceneFx = SCENE_DEFS.street;

function drawAmbient() {
  const weather = (sceneFx && sceneFx.weather) || (theme === 'day' ? 'none' : 'ash');
  if (weather === 'rain') {
    // 雨夜：斜雨线条 + 水洼反光
    ctx.strokeStyle = 'rgba(190,215,255,.28)';
    ctx.lineWidth = 1.4;
    for (let i = 0; i < 40; i++) {
      const rx = ((i * 211 - globalTime * 740 - cam.x * .3) % (W + 120) + W + 120) % (W + 120) - 60;
      const ry = ((globalTime * 900 + i * 137) % (H + 120)) - 40;
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx - 14, ry + 46);
      ctx.stroke();
    }
    return;
  }
  if (weather === 'spores') {
    // 地下暗河：绿色孢子漂浮
    for (let i = 0; i < 30; i++) {
      const ex = ((i * 167.3 - globalTime * (5 + (i % 4) * 2) - cam.x * .15) % (W + 80) + W + 80) % (W + 80) - 40;
      const ey = H - 20 - ((globalTime * (6 + (i % 5) * 3) + i * 97.7) % (H - 60));
      ctx.globalAlpha = .25 + .3 * Math.abs(Math.sin(globalTime * 1.8 + i));
      ctx.fillStyle = i % 3 === 0 ? '#9dffc4' : '#6fe0a0';
      ctx.beginPath(); ctx.arc(ex, ey, (i % 3) * .8 + 1.2, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    return;
  }
  if (weather === 'dust') {
    // 地铁废墟：棕色尘雾
    for (let i = 0; i < 26; i++) {
      const ex = ((i * 167.3 - globalTime * (7 + (i % 5) * 3) - cam.x * .18) % (W + 80) + W + 80) % (W + 80) - 40;
      const ey = H + 30 - ((globalTime * (9 + (i % 7) * 4) + i * 97.7) % (H + 80));
      ctx.globalAlpha = .12 + .12 * Math.abs(Math.sin(globalTime * 2.2 + i));
      ctx.fillStyle = '#c9a06e';
      ctx.fillRect(ex, ey, 2, 2);
    }
    ctx.globalAlpha = 1;
    return;
  }
  if (weather === 'mist') {
    // 雾港：白色雾带 + 飞鸟
    for (let i = 0; i < 4; i++) {
      const bx = ((i * 291 - globalTime * 12 - cam.x * .2) % (W + 220) + W + 220) % (W + 220) - 110;
      const by = 120 + i * 84;
      ctx.fillStyle = 'rgba(255,255,255,.13)';
      ctx.beginPath(); ctx.ellipse(bx, by, 150, 22, 0, 0, Math.PI * 2); ctx.fill();
    }
  }
  if (theme === 'day') {
    ctx.strokeStyle = 'rgba(40,52,60,.5)';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) {
      const bx = ((i * 431 - globalTime * (16 + i * 5) - cam.x * .1) % (W + 160) + W + 160) % (W + 160) - 80;
      const by = 54 + i * 36 + Math.sin(globalTime * 1.6 + i * 2) * 9;
      const flap = Math.sin(globalTime * 7 + i * 3) * 4;
      ctx.beginPath();
      ctx.moveTo(bx - 7, by - flap);
      ctx.quadraticCurveTo(bx, by + 3, bx + 7, by - flap);
      ctx.stroke();
    }
    return;
  }
  // 夜晚默认：飘散的火星与灰烬
  for (let i = 0; i < 26; i++) {
    const ex = ((i * 167.3 - globalTime * (7 + (i % 5) * 3) - cam.x * .18) % (W + 80) + W + 80) % (W + 80) - 40;
    const ey = H + 30 - ((globalTime * (9 + (i % 7) * 4) + i * 97.7) % (H + 80));
    const flicker = .3 + .5 * Math.abs(Math.sin(globalTime * 2.2 + i));
    ctx.globalAlpha = flicker * .6;
    ctx.fillStyle = i % 4 === 0 ? '#ff9a4a' : '#ffce8a';
    ctx.fillRect(ex, ey, i % 3 ? 2 : 2.6, i % 3 ? 2 : 2.6);
  }
  ctx.globalAlpha = 1;
}

// 场景色调叠层：用 multiply 混合让整个画面带上章节场景的颜色
function drawSceneTint() {
  const tint = sceneFx && sceneFx.tint;
  if (!tint) return;
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  ctx.globalAlpha = .32;
  ctx.fillStyle = `rgb(${tint[0]},${tint[1]},${tint[2]})`;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
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
    } else if (p.kind === 'xp') {
      const big = p.val >= 12;
      const col = big ? '#ffd166' : '#8dffb0';
      const glow = big ? 'rgba(255,209,102,.3)' : 'rgba(120,255,160,.26)';
      const s = big ? 7 : 5;
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(0, 0, s + 4 + Math.sin(p.bob * 2) * 1.2, 0, Math.PI * 2); ctx.fill();
      ctx.save();
      ctx.rotate(Math.sin(p.bob) * .3);
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.moveTo(0, -s); ctx.lineTo(s * .62, 0); ctx.lineTo(0, s); ctx.lineTo(-s * .62, 0);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.78)';
      ctx.beginPath();
      ctx.moveTo(0, -s * .55); ctx.lineTo(s * .28, 0); ctx.lineTo(0, s * .55); ctx.lineTo(-s * .28, 0);
      ctx.closePath(); ctx.fill();
      ctx.restore();
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

// ===== 怪物形象绘制（按类型定制的矢量形象，local 坐标 y=0 为脚底，+x 为朝向） =====
function paintWalker(z) {
  const hurt = z.hurt > 0;
  const skin = hurt ? '#ffd0cb' : '#8fae6b';
  const skinDark = hurt ? '#e8a79b' : '#6d8a52';
  const cloth = '#4a5140';
  const pants = '#3a4148';
  const t = z.phase;
  const stride = Math.sin(t) * 6;
  const bob = Math.abs(Math.cos(t)) * 1.8;
  ctx.strokeStyle = pants;
  ctx.lineWidth = 5.4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-3, -20 - bob); ctx.lineTo(-4 - stride * .7, -10); ctx.lineTo(-5 - stride, 0);
  ctx.moveTo(4, -20 - bob); ctx.lineTo(5 + stride * .7, -10); ctx.lineTo(6 + stride, 0);
  ctx.stroke();
  ctx.save();
  ctx.translate(0, -20 - bob);
  ctx.rotate(.16);
  ctx.fillStyle = cloth;
  rr(ctx, -9, -25, 18, 27, 7);
  ctx.fill();
  ctx.fillStyle = skinDark;
  rr(ctx, -7, 0, 13, 5, 2);
  ctx.fill();
  ctx.fillStyle = '#8f2f2f';
  rr(ctx, 1, -15, 5, 7, 2);
  ctx.fill();
  ctx.strokeStyle = skin;
  ctx.lineWidth = 4.4;
  const reach = Math.sin(t * 1.3) * 3;
  ctx.beginPath();
  ctx.moveTo(4, -20); ctx.lineTo(17, -14 + reach); ctx.lineTo(24, -12 + reach);
  ctx.moveTo(-2, -20); ctx.lineTo(12, -8 - reach); ctx.lineTo(20, -7 - reach);
  ctx.stroke();
  ctx.restore();
  ctx.save();
  ctx.translate(6, -47 - bob);
  ctx.rotate(.12);
  ctx.fillStyle = skin;
  ctx.beginPath(); ctx.arc(0, 0, 7.6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = skinDark;
  ctx.beginPath(); ctx.ellipse(4.5, 3.4, 4.4, 3, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#1c1210';
  ctx.beginPath(); ctx.ellipse(5.6, 3.2, 2.6, 1.6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#e8e2cf';
  ctx.fillRect(4.4, 2, 1.2, 1.6);
  ctx.fillRect(6.4, 2, 1.2, 1.6);
  ctx.fillStyle = '#ff4d4d';
  ctx.beginPath(); ctx.arc(4.6, -2.4, 1.7, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,80,80,.35)';
  ctx.beginPath(); ctx.arc(4.6, -2.4, 3.4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#2c3324';
  ctx.beginPath(); ctx.arc(-2.4, -3.4, 4.6, Math.PI * .95, Math.PI * 1.85); ctx.fill();
  ctx.restore();
}

function paintRunner(z) {
  const hurt = z.hurt > 0;
  const skin = hurt ? '#ffd0cb' : '#b9cf72';
  const dark = hurt ? '#e8a79b' : '#93a851';
  const t = z.phase * 1.5;
  const gallop = Math.sin(t);
  ctx.strokeStyle = 'rgba(185,207,114,.2)';
  ctx.lineWidth = 2.4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-14, -20); ctx.lineTo(-27, -18);
  ctx.moveTo(-12, -11); ctx.lineTo(-25, -10);
  ctx.stroke();
  ctx.strokeStyle = '#4a5138';
  ctx.lineWidth = 4.6;
  ctx.beginPath();
  ctx.moveTo(-2, -16); ctx.lineTo(-9, -8 + gallop * 3); ctx.lineTo(-3 - gallop * 6, 0);
  ctx.moveTo(3, -16); ctx.lineTo(10, -8 - gallop * 3); ctx.lineTo(4 + gallop * 6, 0);
  ctx.stroke();
  ctx.save();
  ctx.translate(0, -16);
  ctx.rotate(.5);
  ctx.fillStyle = skin;
  rr(ctx, -6, -19, 13, 23, 6);
  ctx.fill();
  ctx.fillStyle = dark;
  rr(ctx, -6, -3, 12, 6, 3);
  ctx.fill();
  ctx.fillStyle = '#e8e2cf';
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(-6, -15 + i * 5);
    ctx.lineTo(-10.4, -13.4 + i * 5);
    ctx.lineTo(-6, -12 + i * 5);
    ctx.closePath();
    ctx.fill();
  }
  ctx.strokeStyle = skin;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(3, -15); ctx.lineTo(14, -7 - gallop * 4); ctx.lineTo(21, -2 - gallop * 5);
  ctx.moveTo(-1, -14); ctx.lineTo(10, -5 + gallop * 4); ctx.lineTo(17, -1 + gallop * 5);
  ctx.stroke();
  ctx.restore();
  ctx.save();
  ctx.translate(13, -30 + gallop * 1.6);
  ctx.rotate(.3);
  ctx.fillStyle = skin;
  ctx.beginPath(); ctx.arc(0, 0, 6.4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = dark;
  ctx.beginPath(); ctx.ellipse(3.8, 3.2, 4, 2.8, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#1c1210';
  ctx.beginPath(); ctx.ellipse(4.8, 3, 2.4, 1.7, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ff4d4d';
  ctx.beginPath(); ctx.arc(3.8, -2.2, 1.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,80,80,.35)';
  ctx.beginPath(); ctx.arc(3.8, -2.2, 3, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function paintBrute(z) {
  const hurt = z.hurt > 0;
  const skin = hurt ? '#ffd0cb' : '#6f8f63';
  const dark = hurt ? '#e8a79b' : '#557048';
  const armor = '#39424d';
  const t = z.phase;
  const stride = Math.sin(t) * 4;
  const bob = Math.abs(Math.cos(t)) * 2;
  ctx.strokeStyle = dark;
  ctx.lineWidth = 9;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-6, -22 - bob); ctx.lineTo(-8 - stride, 0);
  ctx.moveTo(7, -22 - bob); ctx.lineTo(9 + stride, 0);
  ctx.stroke();
  ctx.fillStyle = armor;
  rr(ctx, -13 - stride, -10, 9, 10, 3); ctx.fill();
  rr(ctx, 5 + stride, -10, 9, 10, 3); ctx.fill();
  ctx.fillStyle = skin;
  rr(ctx, -17, -54 - bob, 36, 34, 11);
  ctx.fill();
  ctx.fillStyle = dark;
  rr(ctx, -17, -28 - bob, 36, 9, 4);
  ctx.fill();
  ctx.strokeStyle = '#4a3b30';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(2, -46 - bob); ctx.lineTo(2, -32 - bob);
  for (let i = 0; i < 4; i++) {
    ctx.moveTo(-1.4, -44 - bob + i * 4); ctx.lineTo(5.4, -44 - bob + i * 4);
  }
  ctx.stroke();
  ctx.fillStyle = dark;
  ctx.beginPath(); ctx.ellipse(-10, -54 - bob, 9, 7, -.3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = armor;
  rr(ctx, 6, -60 - bob, 17, 12, 4);
  ctx.fill();
  ctx.fillStyle = '#4c5763';
  rr(ctx, 6, -60 - bob, 17, 4, 2);
  ctx.fill();
  ctx.fillStyle = '#8b95a1';
  ctx.fillRect(9, -56 - bob, 2, 2);
  ctx.fillRect(14, -56 - bob, 2, 2);
  ctx.fillRect(19, -56 - bob, 2, 2);
  ctx.fillStyle = skin;
  ctx.beginPath(); ctx.arc(4, -60 - bob, 6.4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ff4d4d';
  ctx.beginPath(); ctx.arc(6.4, -61.4 - bob, 1.4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,80,80,.3)';
  ctx.beginPath(); ctx.arc(6.4, -61.4 - bob, 2.8, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = skin;
  ctx.lineWidth = 8;
  const swing = Math.sin(t * 1.2) * 3;
  ctx.beginPath();
  ctx.moveTo(-12, -48 - bob); ctx.lineTo(-20, -30 + swing); ctx.lineTo(-19, -14 + swing);
  ctx.moveTo(12, -50 - bob); ctx.lineTo(24, -36 - swing); ctx.lineTo(27, -22 - swing);
  ctx.stroke();
  ctx.fillStyle = skin;
  ctx.beginPath(); ctx.arc(-19, -12 + swing, 5.4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(28, -20 - swing, 6, 0, Math.PI * 2); ctx.fill();
}

function paintSpitter(z) {
  const hurt = z.hurt > 0;
  const skin = hurt ? '#ffd0cb' : '#9a86e0';
  const dark = hurt ? '#e8a79b' : '#7361b8';
  const sac = hurt ? '#ffb0a0' : '#8fd45e';
  const flap = Math.sin(z.phase * 3.2) * 13;
  for (const dir of [-1, 1]) {
    ctx.save();
    ctx.fillStyle = dark;
    ctx.strokeStyle = 'rgba(20,14,36,.45)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-2 * dir, -30);
    ctx.quadraticCurveTo(-16 * dir, -44 - flap, -27 * dir, -34 - flap * .7);
    ctx.quadraticCurveTo(-20 * dir, -28 - flap * .4, -26 * dir, -18 - flap * .35);
    ctx.quadraticCurveTo(-15 * dir, -20 - flap * .2, -2 * dir, -26);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = 'rgba(222,212,255,.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-3 * dir, -29); ctx.lineTo(-19 * dir, -34 - flap * .6);
    ctx.moveTo(-3 * dir, -28); ctx.lineTo(-21 * dir, -22 - flap * .3);
    ctx.stroke();
    ctx.restore();
  }
  const pulse = .72 + .28 * Math.sin(z.phase * 4);
  ctx.fillStyle = sac;
  ctx.beginPath(); ctx.ellipse(0, -14, 11, 13, 0, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = .26 * pulse;
  ctx.fillStyle = '#c8ff7a';
  ctx.beginPath(); ctx.ellipse(0, -14, 15, 17, 0, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;
  ctx.fillStyle = 'rgba(40,66,20,.5)';
  ctx.beginPath();
  ctx.arc(-3, -18, 2, 0, Math.PI * 2);
  ctx.arc(4, -12, 1.6, 0, Math.PI * 2);
  ctx.arc(-1, -8.4, 1.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = skin;
  rr(ctx, -7, -33, 14, 12, 5);
  ctx.fill();
  ctx.strokeStyle = skin;
  ctx.lineWidth = 3.4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(5, -29); ctx.lineTo(13, -25); ctx.lineTo(16, -30);
  ctx.moveTo(-5, -29); ctx.lineTo(-12, -24);
  ctx.stroke();
  ctx.fillStyle = skin;
  ctx.beginPath(); ctx.arc(3, -39, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = dark;
  ctx.beginPath(); ctx.ellipse(6.4, -36.4, 3.6, 2.6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#9dff66';
  ctx.beginPath(); ctx.arc(4.6, -40.4, 1.4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(157,255,102,.75)';
  ctx.beginPath(); ctx.ellipse(8.6, -32 + Math.sin(z.phase * 6) * 1.5, 1.6, 2.6, 0, 0, Math.PI * 2); ctx.fill();
}

function paintBoss(z) {
  const hurt = z.hurt > 0;
  const skin = hurt ? '#ffd0cb' : '#4c7d55';
  const dark = hurt ? '#e8a79b' : '#386043';
  const armor = '#232b33';
  const t = z.phase * .8;
  const stride = Math.sin(t) * 5;
  const bob = Math.abs(Math.cos(t)) * 2.4;
  const heartPulse = .6 + .4 * Math.sin(globalTime * 6);
  ctx.strokeStyle = dark;
  ctx.lineWidth = 12;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-9, -30 - bob); ctx.lineTo(-12 - stride, 0);
  ctx.moveTo(10, -30 - bob); ctx.lineTo(13 + stride, 0);
  ctx.stroke();
  ctx.fillStyle = armor;
  rr(ctx, -19 - stride, -14, 12, 14, 4);
  ctx.fill();
  rr(ctx, 7 + stride, -14, 12, 14, 4);
  ctx.fill();
  ctx.fillStyle = skin;
  rr(ctx, -22, -78 - bob, 45, 50, 14);
  ctx.fill();
  ctx.fillStyle = armor;
  rr(ctx, -22, -78 - bob, 45, 26, 12);
  ctx.fill();
  ctx.strokeStyle = '#d8d3c4';
  ctx.lineWidth = 2.4;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(2, -59 - bob + i * 6, 14 - i * 2, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  }
  ctx.fillStyle = '#a3271f';
  ctx.beginPath(); ctx.arc(2, -62 - bob, 8.4, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = .5 * heartPulse;
  ctx.fillStyle = '#ff5a4a';
  ctx.beginPath(); ctx.arc(2, -62 - bob, 11.4, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = skin;
  ctx.lineWidth = 15;
  ctx.beginPath();
  ctx.moveTo(14, -70 - bob); ctx.lineTo(30, -48 - bob); ctx.lineTo(36, -26 - bob);
  ctx.stroke();
  ctx.fillStyle = skin;
  ctx.beginPath(); ctx.arc(38, -20 - bob, 10, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#d8d3c4';
  for (const a of [-.5, 0, .5]) {
    ctx.save();
    ctx.translate(38, -20 - bob);
    ctx.rotate(a);
    ctx.beginPath();
    ctx.moveTo(-3, -9); ctx.lineTo(0, -17); ctx.lineTo(3, -9);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  ctx.strokeStyle = skin;
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.moveTo(-16, -70 - bob); ctx.lineTo(-26, -52 - bob); ctx.lineTo(-24, -34 - bob);
  ctx.stroke();
  ctx.fillStyle = skin;
  ctx.beginPath(); ctx.arc(-24, -30 - bob, 5.4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = skin;
  ctx.beginPath(); ctx.arc(6, -88 - bob, 11, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#d98a92';
  ctx.beginPath(); ctx.arc(6, -92 - bob, 9, Math.PI, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#a95b66';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(0, -94 - bob); ctx.quadraticCurveTo(6, -100 - bob, 12, -94 - bob);
  ctx.moveTo(1, -91 - bob); ctx.quadraticCurveTo(6, -96 - bob, 11, -91 - bob);
  ctx.stroke();
  ctx.fillStyle = '#ff4d4d';
  ctx.beginPath(); ctx.arc(9.4, -86 - bob, 2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,80,80,.4)';
  ctx.beginPath(); ctx.arc(9.4, -86 - bob, 4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#150d10';
  rr(ctx, 2, -82 - bob, 10, 3.4, 1.4);
  ctx.fill();
  ctx.fillStyle = armor;
  rr(ctx, -4.4, -98 - bob, 8, 13, 2);
  ctx.fill();
  ctx.fillStyle = '#8b95a1';
  ctx.fillRect(-2.6, -96 - bob, 2, 2);
  ctx.fillRect(-2.6, -91 - bob, 2, 2);
}

const zombieHeadTop = { walker: 58, runner: 46, brute: 76, spitter: 50, boss: 106 };

function drawZombie(z) {
  const x = z.x, y = z.y;
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = 'rgba(0,0,0,.36)';
  ctx.beginPath(); ctx.ellipse(0, 2, z.r * 1.05, z.r * .32, 0, 0, Math.PI * 2); ctx.fill();
  if (z.elite) {
    const pulse = .5 + .5 * Math.sin(globalTime * 5 + z.phase);
    ctx.globalAlpha = .14 + pulse * .12;
    ctx.fillStyle = '#ff5a3d';
    ctx.beginPath(); ctx.ellipse(0, 0, z.r * 1.55, z.r * .6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
  }
  ctx.save();
  ctx.scale((z.facing || 1) * z.scale, z.scale);
  // 绘制基底按 ENEMY_DEFS 的 base 分派，调色板来自 z.pal
  if (z.flying) paintSpitter(z);
  else if (z.base === 'runner') paintRunner(z);
  else if (z.base === 'brute') paintBrute(z);
  else if (z.base === 'boss') paintBoss(z);
  else paintWalker(z);
  ctx.restore();
  ctx.restore();
  const scale = Math.max(.55, z.scale || 1);
  const bw = clamp(z.r * 1.4 * scale, 30, 220);
  const barY = y - (zombieHeadTop[z.base] || 60) * scale - 12;
  const pct = clamp(z.hp / z.maxHp * 100, 0, 100);
  ctx.fillStyle = 'rgba(0,0,0,.55)';
  rr(ctx, x - bw / 2, barY, bw, 6, 3);
  ctx.fill();
  ctx.fillStyle = z.elite ? '#ff6a5a' : pct > 55 ? '#7ee081' : pct > 28 ? '#ffd166' : '#ff5a5a';
  rr(ctx, x - bw / 2 + 1.5, barY + 1.5, (bw - 3) * pct / 100, 3, 1.5);
  ctx.fill();
  if (z.elite) {
    ctx.font = '900 9px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ff8a5a';
    ctx.fillText('精英', x, barY - 4);
  }
}

// 屏外来袭指示：即将走入战场的怪物在屏幕边缘显示脉动箭头
function drawSpawnMarkers() {
  for (const z of enemies) {
    if (z.dead) continue;
    let ax = null, dir = 0;
    if (z.x < cam.x + 10) { ax = cam.x + 20; dir = -1; }
    else if (z.x > cam.x + W - 10) { ax = cam.x + W - 20; dir = 1; }
    if (ax === null) continue;
    const pulse = .45 + .35 * Math.sin(globalTime * 6 + z.phase);
    const s = z.type === 'boss' ? 16 : 10;
    ctx.save();
    ctx.translate(ax, clamp(z.y, laneTop + 8, laneBottom - 8));
    ctx.globalAlpha = pulse;
    ctx.fillStyle = z.elite ? '#ffb05a' : '#ff5a5a';
    ctx.beginPath();
    ctx.moveTo(dir * s, 0);
    ctx.lineTo(-dir * s * .7, -s * .8);
    ctx.lineTo(-dir * s * .7, s * .8);
    ctx.closePath();
    ctx.fill();
    if (z.type === 'boss') {
      ctx.globalAlpha = pulse * .4;
      ctx.beginPath(); ctx.arc(0, 0, s * 1.6, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
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
  const g = cachedGradient(`vig-${theme}-${W}`, () => {
    const grad = ctx.createRadialGradient(W / 2, H * .52, H * .34, W / 2, H * .52, H * .78);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, day ? 'rgba(20,30,40,.16)' : 'rgba(0,0,0,.42)');
    return grad;
  });
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  if (player && player.hurtFlash > 0) {
    ctx.fillStyle = `rgba(255,40,40,${player.hurtFlash * .55})`;
    ctx.fillRect(0, 0, W, H);
  } else if (state === 'playing' && bossRef) {
    // BOSS 存活时的红色压迫氛围
    ctx.fillStyle = 'rgba(120,20,18,.1)';
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
  xp() { this.tone(640 + Math.random() * 140, .05, 'sine', .035, 980); },
  levelup() { this.tone(392, .12, 'triangle', .08, 523); this.tone(523, .12, 'triangle', .07, 659, .1); this.tone(659, .2, 'triangle', .08, 784, .2); },
  elite() { this.tone(300, .2, 'sawtooth', .08, 130); this.tone(150, .28, 'square', .06, 70, .1); },
  boom() { this.tone(95, .3, 'square', .13, 38); this.tone(52, .42, 'sawtooth', .1, 28, .02); },
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
  mouse.x = (e.clientX - rect.left) * (W / Math.max(1, rect.width));
  mouse.y = (e.clientY - rect.top) * (H / Math.max(1, rect.height));
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
    const stickW = Math.max(128, rect.width * .28);
    const stickH = Math.max(120, rect.height * .34);
    const inStickZone = px < stickW && py > rect.height - stickH;
    if (!stick.active && inStickZone) {
      stick.active = true;
      stick.id = e.pointerId;
      // 摇杆中心直接取自 DOM 元素实际位置，避免不同机型下错位
      const baseRect = ui.stickBase.getBoundingClientRect();
      stick.ox = baseRect.left + baseRect.width / 2 - rect.left;
      stick.oy = baseRect.top + baseRect.height / 2 - rect.top;
      stick.radius = Math.max(44, baseRect.width * .4);
      stick.x = 0;
      stick.y = 0;
      ui.stickKnob.style.setProperty('--sx', '0px');
      ui.stickKnob.style.setProperty('--sy', '0px');
    } else if (!touchFire.active) {
      touchFire.active = true;
      touchFire.id = e.pointerId;
      setMouseFromEvent(e);
      dismissTouchHint();
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
  const radius = stick.radius || 48;
  let dx = (px - stick.ox) / radius;
  let dy = (py - stick.oy) / radius;
  const len = Math.hypot(dx, dy) || 1;
  if (len > 1) { dx /= len; dy /= len; }
  stick.x = Math.abs(dx) < .18 ? 0 : dx;
  stick.y = Math.abs(dy) < .18 ? 0 : dy;
  const knobMax = radius * .875;
  ui.stickKnob.style.setProperty('--sx', `${dx * knobMax}px`);
  ui.stickKnob.style.setProperty('--sy', `${dy * knobMax}px`);
}

// 自适应分辨率：虚拟高度恒为 540，虚拟宽度按屏幕宽高比伸展（600–1400），
// 同时按 devicePixelRatio 渲染，手机端不再有黑边、拉伸或锯齿模糊
function resizeCanvas() {
  const rect = stageEl && stageEl.getBoundingClientRect ? stageEl.getBoundingClientRect() : null;
  const cssW = Math.max(320, rect ? rect.width : window.innerWidth);
  const cssH = Math.max(240, rect ? rect.height : window.innerHeight);
  view.dpr = clamp(window.devicePixelRatio || 1, 1, 2);
  const nextW = clamp(Math.round(H * (cssW / cssH)), 600, 1400);
  const wChanged = nextW !== W;
  W = nextW;
  canvas.width = Math.round(W * view.dpr);
  canvas.height = Math.round(H * view.dpr);
  ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
  clearGradientCache();
  if (wChanged) cityCache.theme = null; // 触发城市层按新视口重建
  if (player) cam.x = clamp(cam.x, 0, Math.max(0, worldWidth - W));
}
let resizeScheduled = false;
function scheduleResize() {
  if (resizeScheduled) return;
  resizeScheduled = true;
  requestAnimationFrame(() => {
    resizeScheduled = false;
    resizeCanvas();
  });
}
addEventListener('resize', scheduleResize);
addEventListener('orientationchange', () => setTimeout(scheduleResize, 160));
if (window.visualViewport) window.visualViewport.addEventListener('resize', scheduleResize);

document.addEventListener('visibilitychange', () => {
  if (document.hidden && state === 'playing') togglePause();
});

ui.swapBtn.addEventListener('pointerdown', e => { e.preventDefault(); switchWeapon(); });
ui.touchPauseBtn.addEventListener('pointerdown', e => { e.preventDefault(); togglePause(); });

if (ui.weaponBar) {
  ui.weaponBar.addEventListener('pointerdown', e => {
    const chip = e.target && e.target.closest ? e.target.closest('.wchip') : null;
    if (!chip) return;
    e.preventDefault();
    e.stopPropagation();
    if (state === 'playing') selectWeapon(chip.dataset.w, true);
  });
  ui.weaponBar.addEventListener('click', e => e.preventDefault());
}

if (ui.talentCards) {
  ui.talentCards.addEventListener('pointerdown', e => {
    const card = e.target && e.target.closest ? e.target.closest('.talent-card') : null;
    if (!card) return;
    e.preventDefault();
    pickTalent(card.dataset.talent);
  });
  ui.talentCards.addEventListener('click', e => e.preventDefault());
}

// 升级面板：标签页 / 槽位筛选 / 背包吸收
document.querySelectorAll('.up-tab').forEach(btn => {
  btn.addEventListener('click', () => setUpTab(btn.dataset.uptab));
});
if (ui.equipSlots) {
  ui.equipSlots.addEventListener('click', e => {
    const slot = e.target && e.target.closest ? e.target.closest('.equip-slot') : null;
    if (!slot) return;
    bagFilter = bagFilter === slot.dataset.slot ? null : slot.dataset.slot;
    renderUpgradePanel();
  });
}
if (ui.equipBag) {
  ui.equipBag.addEventListener('click', e => {
    const item = e.target && e.target.closest ? e.target.closest('.bag-item') : null;
    if (!item) return;
    const slotId = item.dataset.s;
    const q = Number(item.dataset.q);
    if (!absorbEquipItem(slotId, q)) return;
    const slot = equip.slots[slotId];
    audio.weaponPick();
    showEquipToast(`${slotName(slotId)} +${QUALITIES[q].feed} 级 → Lv ${slot.lv}${slot.lv >= EQUIP_MAX_LV ? '（已满级）' : ''}`);
    renderUpgradePanel();
  });
}

// 熔炼与突破
if (ui.smeltList) {
  ui.smeltList.addEventListener('click', e => {
    const btn = e.target && e.target.closest ? e.target.closest('.smelt-btn') : null;
    if (!btn) return;
    const slotId = btn.dataset.s;
    const q = Number(btn.dataset.q);
    if (!smeltItem(slotId, q, 1)) return;
    audio.pickup();
    showEquipToast(`熔炼 ${QUALITIES[q].name}·${slotName(slotId)} → ${svgIcon(MAT_ICON)}+${SMELT_MATS[q]} 结晶 · +${SMELT_GOLD[q]} 金币`);
    renderUpgradePanel();
  });
}
if (ui.smeltWhiteBtn) {
  ui.smeltWhiteBtn.addEventListener('click', () => {
    const res = smeltAllWhite();
    if (!res) return;
    audio.crateBreak();
    showEquipToast(`一键熔炼白装 ×${res.count} → ${svgIcon(MAT_ICON)}+${res.mats} 结晶 · +${res.gold} 金币`);
    renderUpgradePanel();
  });
}
if (ui.breakList) {
  ui.breakList.addEventListener('click', e => {
    const btn = e.target && e.target.closest ? e.target.closest('.br-btn') : null;
    if (!btn || btn.disabled) return;
    const result = doBreakthrough(btn.dataset.slot);
    if (result === true) {
      const cs = critStats();
      audio.levelup();
      vibrate(50);
      showEquipToast(`${slotName(btn.dataset.slot)} 突破 ${btTiers(btn.dataset.slot)} 层！暴击率 ${fmtPct(cs.rate * 100)} · 暴伤 ${fmtPct(cs.dmg * 100)} · 移速 ${fmtPct(cs.move * 100)}`);
      renderUpgradePanel();
    } else if (result === 'mats') showEquipToast('强化结晶不足');
    else if (result === 'gold') showEquipToast('金币不足');
  });
}

// 商店抽奖
if (ui.gacha1Btn) ui.gacha1Btn.addEventListener('click', () => doGacha(1));
if (ui.gacha10Btn) ui.gacha10Btn.addEventListener('click', () => doGacha(10));
if (ui.buyTicket1) ui.buyTicket1.addEventListener('click', () => buyTickets(1));
if (ui.buyTicket10) ui.buyTicket10.addEventListener('click', () => buyTickets(10));
if (ui.gachaOkBtn) ui.gachaOkBtn.addEventListener('click', closeGachaResult);
if (ui.gachaAgainBtn) ui.gachaAgainBtn.addEventListener('click', () => {
  closeGachaResult();
  doGacha(lastGachaCount);
});

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
  if (state === 'levelup') {
    if (e.code === 'Digit1' || e.code === 'Numpad1') pickTalent(levelUpChoices[0] && levelUpChoices[0].id);
    else if (e.code === 'Digit2' || e.code === 'Numpad2') pickTalent(levelUpChoices[1] && levelUpChoices[1].id);
    else if (e.code === 'Digit3' || e.code === 'Numpad3') pickTalent(levelUpChoices[2] && levelUpChoices[2].id);
    return;
  }
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
  btn.addEventListener('click', () => {
    // 再次点击同一标签页返回关卡主页，避免停留在子页无法返回
    if (currentLobbyView === btn.dataset.lobbyView) showLobbyView('levelView');
    else showLobbyView(btn.dataset.lobbyView);
  });
});
ui.restartLevelBtn.addEventListener('click', () => resetGame(currentLevel));
ui.levelLobbyBtn.addEventListener('click', enterLobby);
ui.startLevelBtn.addEventListener('click', startSelectedLevel);
ui.currentLevelCard.addEventListener('click', startSelectedLevel);
if (ui.nextLevelBtn) {
  ui.nextLevelBtn.addEventListener('click', () => {
    const next = levels.find(l => l.id === currentLevel.id + 1);
    if (next && next.id <= unlockedLevel) startLevel(next);
    else enterLobby();
  });
}
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

function showComingSoon(message) {
  ui.comingSoon.textContent = message;
  ui.comingSoon.classList.remove('hidden');
  clearTimeout(showComingSoon.timer);
  showComingSoon.timer = setTimeout(() => ui.comingSoon.classList.add('hidden'), 1500);
}

// ===== 升级面板（装备养成）渲染 =====
let bagFilter = null;
let equipToastTimer = null;
let upTab = 'equip';
function fmtPct(v) {
  const r = Math.round(v * 10) / 10;
  return Number.isInteger(r) ? `${r}%` : `${r.toFixed(1)}%`;
}
function dotsHtml(lv) {
  const n = lv - 1;
  if (n <= 0) return '<span class="es-dots"></span>';
  let out = '';
  for (let i = 0; i < n; i++) out += '<i></i>';
  return `<span class="es-dots">${out}</span>`;
}
function pipsHtml(tier) {
  let out = '';
  for (let i = 0; i < BT_MAX; i++) out += `<i class="${i < tier ? 'on' : ''}"></i>`;
  return `<span class="es-pips">${out}</span>`;
}
function renderUpgradePanel() {
  if (!ui.equipSlots) return;
  // 六项属性芯片
  const eqs = equipStats();
  const cs = critStats();
  if (ui.statHp) ui.statHp.textContent = String(Math.round(100 + eqs.hp));
  if (ui.statAtk) ui.statAtk.textContent = fmtPct(eqs.atkPct);
  if (ui.statAs) ui.statAs.textContent = fmtPct(eqs.asPct);
  if (ui.statCrit) ui.statCrit.textContent = fmtPct(cs.rate * 100);
  if (ui.statCritDmg) ui.statCritDmg.textContent = fmtPct(cs.dmg * 100);
  if (ui.statMove) ui.statMove.textContent = fmtPct(cs.move * 100);
  // 六个装备槽位（图标 + 品质底色 + 点数 + 突破刻痕）
  ui.equipSlots.innerHTML = EQUIP_SLOTS.map(s => {
    const st = equip.slots[s.id];
    const q = QUALITIES[st.q];
    return `<button type="button" class="equip-slot q${st.q}${bagFilter === s.id ? ' filtered' : ''}" data-slot="${s.id}" data-name="${s.name}" style="--qc:${q.color};--qbg:${q.color}1f" title="${s.name}">`
      + `<span class="es-ico">${slotIcon(s.id)}</span>`
      + `<span class="es-mid">${dotsHtml(st.lv)}</span>`
      + `<span class="es-side"><span class="es-lv">Lv ${st.lv}${st.lv >= EQUIP_MAX_LV ? ' MAX' : ''}</span>${pipsHtml(btTiers(s.id))}</span>`
      + `</button>`;
  }).join('');
  // 装备背包
  const list = equip.items.filter(it => !bagFilter || it.s === bagFilter);
  const total = equip.items.reduce((a, it) => a + it.n, 0);
  const gate = nextQualityGate();
  const gateText = gate ? ` · 通关第${gate.gate}关解锁「${gate.name}」品质` : ' · 全品质已解锁';
  if (ui.equipBagTitle) ui.equipBagTitle.textContent = `装备背包 · 共 ${total} 件${gateText}`;
  if (!list.length) {
    ui.equipBag.innerHTML = `<p class="bag-empty">${bagFilter ? `暂无「${slotName(bagFilter)}」部位装备` : '暂无装备 · 通关关卡有概率掉落，或在商店抽卡获取'}</p>`;
  } else {
    ui.equipBag.innerHTML = list.map(it => {
      const q = QUALITIES[it.q];
      return `<button type="button" class="bag-item q${it.q}" data-s="${it.s}" data-q="${it.q}" style="--qc:${q.color}">`
        + `<b>${slotIcon(it.s)}${q.name}·${slotName(it.s)} <i>×${it.n}</i></b>`
        + `<span>使用 +${q.feed} 级${equip.slots[it.s].q < it.q ? ' · 提升品质' : ''}</span>`
        + `</button>`;
    }).join('');
  }
  renderSmeltPage();
  renderBreakPage();
}
function renderMatsBar() {
  if (ui.smeltMats) ui.smeltMats.textContent = equip.mats;
  if (ui.smeltGold) ui.smeltGold.textContent = playerProfile.gold;
  if (ui.breakMats) ui.breakMats.textContent = equip.mats;
  if (ui.breakGold) ui.breakGold.textContent = playerProfile.gold;
}
function renderSmeltPage() {
  if (!ui.smeltList) return;
  renderMatsBar();
  if (ui.smeltWhiteBtn) ui.smeltWhiteBtn.disabled = !equip.items.some(it => it.q === 0);
  if (!equip.items.length) {
    ui.smeltList.innerHTML = '<p class="bag-empty">暂无装备可熔炼 · 多余装备熔炼后转化为强化结晶与金币</p>';
    return;
  }
  ui.smeltList.innerHTML = equip.items.map(it => {
    const q = QUALITIES[it.q];
    return `<div class="smelt-row q${it.q}" style="--qc:${q.color}">`
      + `<span class="sr-ico">${slotIcon(it.s)}</span>`
      + `<span class="sr-name">${q.name}·${slotName(it.s)} <i>×${it.n}</i></span>`
      + `<span class="sr-gain">${svgIcon(MAT_ICON)}+${SMELT_MATS[it.q]} ${svgIcon(COIN_ICON)}+${SMELT_GOLD[it.q]}</span>`
      + `<button type="button" class="ghost small smelt-btn" data-s="${it.s}" data-q="${it.q}">熔炼</button>`
      + `</div>`;
  }).join('');
}
function renderBreakPage() {
  if (!ui.breakList) return;
  renderMatsBar();
  ui.breakList.innerHTML = EQUIP_SLOTS.map(s => {
    const st = equip.slots[s.id];
    const q = QUALITIES[st.q];
    const tier = btTiers(s.id);
    const maxed = tier >= BT_MAX;
    const matsCost = maxed ? 0 : BT_MATS[tier];
    const goldCost = maxed || st.q === 0 ? 0 : BT_GOLD[tier];
    const canAfford = !maxed && equip.mats >= matsCost && playerProfile.gold >= goldCost;
    return `<div class="break-row q${st.q}" style="--qc:${q.color}">`
      + `<span class="sr-ico">${slotIcon(s.id)}</span>`
      + `<span class="sr-info"><b>${s.name}</b>${pipsHtml(tier)}<span class="br-hint">${st.q === 0 ? '白色品质 · 仅需结晶' : '需结晶 + 金币'}</span></span>`
      + `<span class="br-cost">${maxed ? '<b class="br-max">已满突破</b>' : `${svgIcon(MAT_ICON)}×${matsCost}${goldCost ? ` ${svgIcon(COIN_ICON)}×${goldCost}` : ''}`}</span>`
      + `<button type="button" class="primary small br-btn" data-slot="${s.id}" ${maxed || !canAfford ? 'disabled' : ''}>${maxed ? 'MAX' : '突破'}</button>`
      + `</div>`;
  }).join('');
}
function showEquipToast(message) {
  if (!ui.equipToast) return;
  ui.equipToast.innerHTML = message;
  ui.equipToast.classList.remove('hidden');
  clearTimeout(equipToastTimer);
  equipToastTimer = setTimeout(() => ui.equipToast.classList.add('hidden'), 1800);
}
function setUpTab(tab) {
  upTab = tab;
  document.querySelectorAll('.up-tab').forEach(btn => btn.classList.toggle('active', btn.dataset.uptab === tab));
  if (ui.upEquipPage) ui.upEquipPage.classList.toggle('hidden', tab !== 'equip');
  if (ui.upSmeltPage) ui.upSmeltPage.classList.toggle('hidden', tab !== 'smelt');
  if (ui.upBreakPage) ui.upBreakPage.classList.toggle('hidden', tab !== 'break');
}

// ===== 商店抽奖 =====
let lastGachaCount = 1;
function renderShop() {
  if (!ui.shopTickets) return;
  ui.shopDiamonds.textContent = playerProfile.diamonds;
  ui.shopTickets.textContent = equip.tickets;
  const maxQ = unlockedMaxQuality();
  const gate = nextQualityGate();
  ui.gachaHint.textContent = gate
    ? `当前可抽最高品质：${QUALITIES[maxQ].name} · 通关第${gate.gate}关解锁「${gate.name}」品质`
    : `当前可抽最高品质：${QUALITIES[maxQ].name} · 全品质已解锁`;
  ui.gacha1Btn.disabled = equip.tickets < 1;
  ui.gacha10Btn.disabled = equip.tickets < 10;
  ui.buyTicket1.disabled = playerProfile.diamonds < GACHA_TICKET_PRICE;
  ui.buyTicket10.disabled = playerProfile.diamonds < GACHA_TICKET_PRICE10;
}
function doGacha(count) {
  if (equip.tickets < count) { showGachaHint('抽奖券不足，可用钻石购买'); return; }
  equip.tickets -= count;
  const results = [];
  for (let i = 0; i < count; i++) results.push(gachaRoll());
  saveEquip();
  renderShop();
  lastGachaCount = count;
  openGachaResult(results);
  audio.weaponPick();
}
function openGachaResult(results) {
  const best = Math.max(...results.map(r => r.q));
  ui.gachaResults.innerHTML = results.map(r => {
    const q = QUALITIES[r.q];
    return `<div class="gacha-card q${r.q}" style="--qc:${q.color}"><b>${q.name}·${slotName(r.slot)}</b><span>已放入装备背包</span></div>`;
  }).join('');
  ui.gachaResults.classList.toggle('single', results.length === 1);
  ui.gachaResults.dataset.best = String(best);
  ui.gachaResult.classList.remove('hidden');
  if (best >= 4) vibrate(80);
}
function closeGachaResult() {
  ui.gachaResult.classList.add('hidden');
}
function buyTickets(count) {
  const cost = count === 1 ? GACHA_TICKET_PRICE : GACHA_TICKET_PRICE10;
  if (playerProfile.diamonds < cost) { showGachaHint('钻石不足'); return; }
  playerProfile.diamonds -= cost;
  equip.tickets += count;
  saveProfile();
  saveEquip();
  updateLobbyStats();
  renderShop();
  showGachaHint(`购买成功 · 抽奖券 +${count}`);
}
function showGachaHint(message) {
  if (!ui.gachaHint) return;
  ui.gachaHint.textContent = message;
  clearTimeout(showGachaHint.timer);
  showGachaHint.timer = setTimeout(() => { if (currentLobbyView === 'shopView') renderShop(); }, 2200);
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
  if (muted) music.stop(.2);
  else if (state === 'playing' && musicEnabled) music.setMode(currentMusicMode(), true);
  else music.apply(.2);
  syncSettingsUI();
}

function toggleMusic() {
  musicEnabled = !musicEnabled;
  if (!musicEnabled) music.stop(.25);
  else if (state === 'playing') music.setMode(currentMusicMode(), true);
  else if (actx) music.setMode('menu', true);
  syncSettingsUI();
}

function showMenu() {
  state = 'menu';
  setIngame(false);
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

updateLobbyStats();
renderLevelCarousel();
showLobbyView('levelView', true);
syncSettingsUI();
updateBestUI();
resizeCanvas();
resetGame();
showMenu();
requestAnimationFrame(frame);

// 本地调试句柄（仅 127.0.0.1 / localhost 暴露，便于自动化测试与调参）
if (['127.0.0.1', 'localhost'].includes(location.hostname)) {
  window.__zombieDebug = {
    gainXP,
    openLevelUp,
    pickTalent,
    startLevel,
    resetGame,
    spawnElite(type = 'brute') { return makeElite(spawnOne(type)); },
    killFirst(dmg = 99999) {
      const z = enemies.find(e => !e.dead);
      if (!z) return null;
      dealDamage(z, dmg, 0, 0);
      return { type: z.type, elite: !!z.elite, x: z.x, y: z.y };
    },
    equipAdd(slot, q, n = 1) { addEquipItem(slot, q, n); renderUpgradePanel(); return equip.items.length; },
    equipInfo() { return JSON.parse(JSON.stringify(equip)); },
    giveTickets(n) { equip.tickets += n; saveEquip(); renderShop(); return equip.tickets; },
    giveDiamonds(n) { playerProfile.diamonds += n; saveProfile(); updateLobbyStats(); return playerProfile.diamonds; },
    forceComplete() { if (state === 'playing') completeLevel(); return state; },
    gotoLevel(id) { const l = levels.find(x => x.id === id); if (l) { startLevel(l); return { id: l.id, name: l.name, theme: l.theme }; } return null; },
    waveInfo() { return { wave, total: levelConfig.totalWaves, queue: spawnQueue.map(q => (typeof q === 'string' ? q : q.t + (q.elite ? '*' : ''))), kinds: enemies.map(e => e.type + (e.elite ? '*' : '')) }; },
    get state() { return state; },
    get player() { return player; },
    get enemies() { return enemies; },
    get pickups() { return pickups; }
  };
}
})();
