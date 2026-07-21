const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");

const scoreEl = document.querySelector("#score");
const highScoreEl = document.querySelector("#highScore");
const waveEl = document.querySelector("#wave");
const livesEl = document.querySelector("#lives");
const comboEl = document.querySelector("#combo");
const powerEl = document.querySelector("#power");
const overlay = document.querySelector("#overlay");
const messageEl = document.querySelector("#message");
const startButton = document.querySelector("#startButton");
const pauseButton = document.querySelector("#pauseButton");
const settingsButton = document.querySelector("#settingsButton");
const settingsPanel = document.querySelector("#settingsPanel");
const volumeControl = document.querySelector("#volumeControl");
const musicVolumeControl = document.querySelector("#musicVolumeControl");
const difficultyControl = document.querySelector("#difficultyControl");
const fireKeyControl = document.querySelector("#fireKeyControl");
const reducedMotionControl = document.querySelector("#reducedMotionControl");
const highContrastControl = document.querySelector("#highContrastControl");
const upgradePanel = document.querySelector("#upgradePanel");
const upgradeButtons = [...document.querySelectorAll("[data-upgrade-index]")];
const statsSummary = document.querySelector("#statsSummary");
const achievementsList = document.querySelector("#achievementsList");
const gamepadStatus = document.querySelector("#gamepadStatus");
const touchLeft = document.querySelector("#touchLeft");
const touchRight = document.querySelector("#touchRight");
const touchFire = document.querySelector("#touchFire");
const touchBomb = document.querySelector("#touchBomb");

const WORLD = { width: 960, height: 720 };
const keys = new Set();
const playerBullets = [];
const enemyBullets = [];
const enemies = [];
const particles = [];
const stars = [];
const gridLines = [];
const powerUps = [];
const floatingTexts = [];
const shockwaves = [];

let lastTime = 0;
let fireCooldown = 0;
let diveTimer = 0;
let spawnTimer = 0;
let rafId = 0;
let pointerActive = false;
let pointerX = 0;
let state = "ready";
let waveStartedAt = 0;
let audioContext = null;
let masterGain = null;
let musicGain = null;
let musicTimer = 0;
let musicStep = 0;
let combo = 1;
let comboTimer = 0;
let waveBanner = "";
let waveBannerTimer = 0;
let laserTimer = 0;
let powerUpTimer = 0;
let activePower = "";
let slowTimeTimer = 0;
let homingTimer = 0;
let droneTimer = 0;
let doubleScoreTimer = 0;
let piercingTimer = 0;
let magnetTimer = 0;
let bombCharges = 1;
let respawnTimer = 0;
let demoMode = false;
let idleTimer = 0;
let demoTimer = 0;
let touchLeftHeld = false;
let touchRightHeld = false;
let touchFireHeld = false;
let gamepadWasStart = false;
let gamepadWasBomb = false;
let chosenUpgrades = [];
let settings = {
  volume: 0.7,
  musicVolume: 0.42,
  difficulty: "normal",
  fireKey: "Space",
  reducedMotion: false,
  highContrast: false,
};

try {
  settings = { ...settings, ...JSON.parse(localStorage.getItem("galactic-swarm-settings") || "{}") };
} catch (_error) {
  // Keep safe defaults if a browser has stale or malformed settings.
}

const defaultStats = { runs: 0, kills: 0, bosses: 0, interceptions: 0, bestWave: 1, bestCombo: 1 };
let stats = { ...defaultStats };
try {
  stats = { ...defaultStats, ...JSON.parse(localStorage.getItem("galactic-swarm-stats") || "{}") };
} catch (_error) {
  // Keep safe defaults if a browser has stale or malformed statistics.
}

const ACHIEVEMENTS = [
  { id: "first_kill", name: "First Contact", test: () => stats.kills >= 1 },
  { id: "ace", name: "Swarm Ace", test: () => stats.kills >= 100 },
  { id: "interceptor", name: "Interceptor", test: () => stats.interceptions >= 25 },
  { id: "boss_breaker", name: "Boss Breaker", test: () => stats.bosses >= 1 },
  { id: "wave_ten", name: "Deep Space", test: () => stats.bestWave >= 10 },
  { id: "combo_five", name: "Perfect Chain", test: () => stats.bestCombo >= 5 },
];

const runUpgrades = {
  fireRate: 0,
  damage: 0,
  speed: 0,
  spread: 0,
  shield: 0,
  duration: 0,
  pierce: 0,
};

const UPGRADE_DEFS = [
  { id: "fireRate", name: "Turbo Cannons", description: "Fire 12% faster." },
  { id: "damage", name: "Heavy Rounds", description: "Shots deal more damage." },
  { id: "speed", name: "Ion Thrusters", description: "Move 10% faster." },
  { id: "spread", name: "Wing Cannons", description: "Add wider supporting fire." },
  { id: "shield", name: "Shield Matrix", description: "Force fields last longer." },
  { id: "duration", name: "Power Core", description: "Power-ups last 20% longer." },
  { id: "pierce", name: "Phase Ammo", description: "Shots pierce another target." },
];

let score = 0;
let highScore = Number(localStorage.getItem("galactic-swarm-high") || 0);
let wave = 1;
let lives = 3;
let forceFieldRemaining = 0;
let nextForceFieldScore = 5000;
let nextExtraLifeScore = 200000;

const player = {
  x: WORLD.width / 2,
  y: WORLD.height - 74,
  width: 54,
  height: 42,
  speed: 455,
  invulnerable: 0,
  visible: true,
};

const POWER_UPS = {
  spread: { label: "Spread", color: "#f4c95d" },
  laser: { label: "Laser", color: "#ff5f8f" },
  rapid: { label: "Rapid", color: "#39d9ff" },
  slow: { label: "Slow", color: "#a979ff" },
  homing: { label: "Homing", color: "#ff9f43" },
  drone: { label: "Drones", color: "#68f5ad" },
  double: { label: "Double", color: "#f8fbff" },
  pierce: { label: "Pierce", color: "#5f8cff" },
  bomb: { label: "Bomb", color: "#ff476f" },
  magnet: { label: "Magnet", color: "#e58cff" },
};

function saveSettings() {
  localStorage.setItem("galactic-swarm-settings", JSON.stringify(settings));
}

function saveStats() {
  localStorage.setItem("galactic-swarm-stats", JSON.stringify(stats));
  renderStats();
}

function renderStats() {
  statsSummary.innerHTML = [
    ["Runs", stats.runs],
    ["Kills", stats.kills],
    ["Best Wave", stats.bestWave],
    ["Bosses", stats.bosses],
    ["Intercepts", stats.interceptions],
    ["Best Combo", `${stats.bestCombo.toFixed(1)}x`],
  ].map(([label, value]) => `<div class="stat-chip"><strong>${value}</strong>${label}</div>`).join("");
  achievementsList.innerHTML = ACHIEVEMENTS.map((achievement) => (
    `<div class="achievement ${achievement.test() ? "unlocked" : ""}">${achievement.test() ? "★" : "○"} ${achievement.name}</div>`
  )).join("");
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function random(min, max) {
  return min + Math.random() * (max - min);
}

function ensureAudio() {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    audioContext = new AudioContextClass();
    masterGain = audioContext.createGain();
    musicGain = audioContext.createGain();
    masterGain.gain.value = 0.18 * settings.volume;
    musicGain.gain.value = 0.085 * settings.musicVolume;
    masterGain.connect(audioContext.destination);
    musicGain.connect(audioContext.destination);
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
}

function syncVolume() {
  if (masterGain) {
    masterGain.gain.value = 0.18 * settings.volume;
  }
  if (musicGain) musicGain.gain.value = 0.085 * settings.musicVolume;
}

function playMusicTone(frequency, duration = 0.16) {
  if (!audioContext || !musicGain || settings.musicVolume <= 0) return;
  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = wave % 5 === 0 ? "sawtooth" : "triangle";
  oscillator.frequency.setValueAtTime(frequency, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.2, now + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  oscillator.connect(gain);
  gain.connect(musicGain);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.03);
}

function updateMusic(dt) {
  if (state !== "playing" && state !== "respawning") return;
  musicTimer -= dt;
  if (musicTimer > 0) return;
  const normal = [110, 165, 220, 165, 123.47, 185, 246.94, 185];
  const boss = [82.41, 82.41, 98, 110, 82.41, 123.47, 110, 98];
  const sequence = wave % 5 === 0 ? boss : normal;
  playMusicTone(sequence[musicStep % sequence.length], wave % 5 === 0 ? 0.23 : 0.15);
  musicStep += 1;
  musicTimer = wave % 5 === 0 ? 0.29 : 0.23;
}

function playTone({ frequency, endFrequency, duration, type = "square", volume = 0.35 }) {
  if (!audioContext || !masterGain) return;

  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  if (endFrequency) {
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, endFrequency), now + duration);
  }

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  oscillator.connect(gain);
  gain.connect(masterGain);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.03);
}

function playNoise({ duration, volume = 0.22, filterFrequency = 900 }) {
  if (!audioContext || !masterGain) return;

  const now = audioContext.currentTime;
  const buffer = audioContext.createBuffer(1, audioContext.sampleRate * duration, audioContext.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = random(-1, 1) * (1 - i / data.length);
  }

  const source = audioContext.createBufferSource();
  const filter = audioContext.createBiquadFilter();
  const gain = audioContext.createGain();
  source.buffer = buffer;
  filter.type = "bandpass";
  filter.frequency.value = filterFrequency;
  filter.Q.value = 1.8;
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  source.start(now);
}

function playSound(name) {
  if (!audioContext) return;

  if (name === "fire") {
    playTone({ frequency: 760, endFrequency: 1180, duration: 0.08, type: "square", volume: 0.16 });
    playTone({ frequency: 380, endFrequency: 540, duration: 0.06, type: "triangle", volume: 0.08 });
  } else if (name === "intercept") {
    playTone({ frequency: 980, endFrequency: 260, duration: 0.14, type: "sawtooth", volume: 0.18 });
    playNoise({ duration: 0.11, volume: 0.12, filterFrequency: 1800 });
  } else if (name === "destroy") {
    playTone({ frequency: 210, endFrequency: 72, duration: 0.26, type: "sawtooth", volume: 0.22 });
    playNoise({ duration: 0.22, volume: 0.2, filterFrequency: 520 });
  } else if (name === "playerHit") {
    playTone({ frequency: 180, endFrequency: 42, duration: 0.48, type: "sawtooth", volume: 0.28 });
    playTone({ frequency: 720, endFrequency: 110, duration: 0.32, type: "square", volume: 0.16 });
    playNoise({ duration: 0.42, volume: 0.28, filterFrequency: 420 });
  } else if (name === "shield") {
    playTone({ frequency: 260, endFrequency: 740, duration: 0.34, type: "triangle", volume: 0.18 });
    playTone({ frequency: 520, endFrequency: 1280, duration: 0.42, type: "sine", volume: 0.12 });
  } else if (name === "shieldBlock") {
    playTone({ frequency: 540, endFrequency: 920, duration: 0.1, type: "triangle", volume: 0.14 });
    playNoise({ duration: 0.08, volume: 0.09, filterFrequency: 2200 });
  } else if (name === "power") {
    playTone({ frequency: 340, endFrequency: 1140, duration: 0.24, type: "triangle", volume: 0.18 });
    playTone({ frequency: 680, endFrequency: 1560, duration: 0.18, type: "sine", volume: 0.1 });
  } else if (name === "boss") {
    playTone({ frequency: 92, endFrequency: 180, duration: 0.5, type: "sawtooth", volume: 0.18 });
    playNoise({ duration: 0.35, volume: 0.13, filterFrequency: 240 });
  }
}

function addScore(points) {
  const earned = Math.round(points * combo * (doubleScoreTimer > 0 ? 2 : 1));
  score += earned;
  combo = clamp(combo + 0.05, 1, 5);
  comboTimer = 2.4;
  if (!demoMode) stats.bestCombo = Math.max(stats.bestCombo, combo);
  if (score >= nextForceFieldScore) {
    activateForceField();
    nextForceFieldScore += 7500;
  }
  while (score >= nextExtraLifeScore) {
    awardExtraLife();
    nextExtraLifeScore += 200000;
  }
  return earned;
}

function awardExtraLife() {
  lives += 1;
  spawnFloatingText(player.x, player.y - 72, "Extra Life", "#68f5ad");
  spawnParticle(player.x, player.y, "#68f5ad", 36);
  playSound("power");
}

function activateForceField() {
  forceFieldRemaining = Math.max(forceFieldRemaining, 12 + runUpgrades.shield * 3);
  spawnParticle(player.x, player.y, "#39d9ff", 34);
  playSound("shield");
}

function hasForceField() {
  return forceFieldRemaining > 0;
}

function difficultyScale() {
  if (settings.difficulty === "training") return 0.78;
  if (settings.difficulty === "veteran") return 1.24;
  return 1;
}

function difficulty() {
  const level = wave - 1;
  const scale = difficultyScale();
  return {
    enemyBulletSpeed: Math.min(360, (150 + level * 17) * scale),
    enemyBulletLimit: Math.min(11, Math.max(1, Math.floor((1 + Math.floor((level + 1) / 2)) * scale))),
    diveDelayMin: Math.max(0.95, (5.4 - level * 0.28) / scale),
    diveDelayMax: Math.max(1.7, (7.8 - level * 0.3) / scale),
    diveSpeed: Math.min(1.38, (0.58 + level * 0.055) * scale),
    formationSpeed: Math.min(1.45, (0.62 + level * 0.055) * scale),
    shotDelayMin: Math.max(1.1, (5.2 - level * 0.22) / scale),
    shotDelayMax: Math.max(2.25, (8.8 - level * 0.25) / scale),
    firstWaveGrace: 14,
  };
}

function waveAge() {
  return (performance.now() - waveStartedAt) / 1000;
}

function resize() {
  const frame = canvas.parentElement.getBoundingClientRect();
  const targetRatio = WORLD.width / WORLD.height;
  let width = frame.width;
  let height = width / targetRatio;

  if (height > frame.height) {
    height = frame.height;
    width = height * targetRatio;
  }

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.style.margin = "0 auto";
}

function makeStars() {
  stars.length = 0;
  for (let i = 0; i < 180; i += 1) {
    stars.push({
      x: random(0, WORLD.width),
      y: random(0, WORLD.height),
      z: random(0.18, 1),
      radius: random(0.6, 2.4),
      speed: random(22, 110),
      alpha: random(0.35, 0.95),
    });
  }

  gridLines.length = 0;
  for (let i = 0; i < 18; i += 1) {
    gridLines.push({ y: i / 18 });
  }
}

function makeWave() {
  enemies.length = 0;
  playerBullets.length = 0;
  enemyBullets.length = 0;
  particles.length = 0;
  shockwaves.length = 0;
  powerUps.length = 0;
  const tuning = difficulty();
  diveTimer = random(tuning.diveDelayMin, tuning.diveDelayMax);
  waveStartedAt = performance.now();
  spawnTimer = 0;
  if (state === "playing") {
    waveBanner = wave % 5 === 0 ? `Boss Wave ${wave}` : `Wave ${wave}`;
    waveBannerTimer = 2.2;
    if (wave % 5 === 0) playSound("boss");
  } else {
    waveBanner = "";
    waveBannerTimer = 0;
  }

  if (wave % 5 === 0) {
    enemies.push({
      x: WORLD.width / 2,
      y: 130,
      homeX: WORLD.width / 2,
      homeY: 130,
      row: 0,
      col: 0,
      kind: "mothership",
      width: 150,
      height: 78,
      phase: random(0, Math.PI * 2),
      state: "formation",
      diveT: 0,
      diveDuration: random(4.8, 6.2),
      shotTimer: 1.5,
      hp: 16 + wave * 2,
      maxHp: 16 + wave * 2,
      bossPhase: 1,
      telegraph: 0,
      parts: { left: 5 + Math.floor(wave / 5), right: 5 + Math.floor(wave / 5) },
      maxPartHp: 5 + Math.floor(wave / 5),
      entryTimer: 1.2,
    });
  }

  const rows = 5;
  const cols = 10;
  const startX = 162;
  const startY = wave % 5 === 0 ? 205 : 106;
  const gapX = 70;
  const gapY = 55;
  const activeRows = wave % 5 === 0 ? 3 : rows;
  const activeCols = wave % 5 === 0 ? 8 : cols;
  const xOffset = wave % 5 === 0 ? 70 : 0;

  for (let row = 0; row < activeRows; row += 1) {
    for (let col = 0; col < activeCols; col += 1) {
      let kind = row < 1 ? "boss" : row < 3 ? "guard" : "scout";
      if (wave >= 2 && row === 1 && col % 3 === 0) kind = "armored";
      if (wave >= 3 && row === 2 && col % 4 === 0) kind = "shielder";
      if (wave >= 2 && row >= 3 && (row + col) % 3 === 0) kind = "kamikaze";
      const hp = kind === "boss" ? 2 : kind === "armored" ? 4 : kind === "shielder" ? 2 : 1;
      enemies.push({
        x: startX + xOffset + col * gapX,
        y: startY + row * gapY,
        homeX: startX + xOffset + col * gapX,
        homeY: startY + row * gapY,
        row,
        col,
        kind,
        width: kind === "boss" || kind === "armored" ? 48 : 42,
        height: kind === "boss" || kind === "armored" ? 38 : 34,
        phase: random(0, Math.PI * 2),
        state: "formation",
        diveT: 0,
        diveDuration: random(3.6, 4.8),
        shotTimer: random(tuning.shotDelayMin, tuning.shotDelayMax),
        hp,
        maxHp: hp,
        shielded: false,
        entryTimer: 0.35 + row * 0.14 + col * 0.035,
      });
    }
  }
}

function resetGame(asDemo = false) {
  ensureAudio();
  score = 0;
  wave = 1;
  lives = 3;
  combo = 1;
  comboTimer = 0;
  activePower = "";
  powerUpTimer = 0;
  laserTimer = 0;
  slowTimeTimer = 0;
  homingTimer = 0;
  droneTimer = 0;
  doubleScoreTimer = 0;
  piercingTimer = 0;
  magnetTimer = 0;
  bombCharges = 1;
  demoMode = asDemo;
  demoTimer = 0;
  respawnTimer = 0;
  chosenUpgrades = [];
  Object.keys(runUpgrades).forEach((key) => { runUpgrades[key] = 0; });
  forceFieldRemaining = 0;
  nextForceFieldScore = 5000;
  nextExtraLifeScore = 200000;
  player.x = WORLD.width / 2;
  player.y = WORLD.height - 74;
  player.invulnerable = 1.8;
  player.visible = true;
  state = "playing";
  stats.runs += asDemo ? 0 : 1;
  if (!asDemo) saveStats();
  overlay.classList.add("hidden");
  upgradePanel.hidden = true;
  makeWave();
  updateHud();
}

function updateHud() {
  scoreEl.textContent = score.toLocaleString();
  highScoreEl.textContent = highScore.toLocaleString();
  waveEl.textContent = String(wave);
  livesEl.textContent = String(lives);
  comboEl.textContent = `${combo.toFixed(combo >= 2 ? 1 : 0)}x`;
  if (hasForceField()) {
    powerEl.textContent = `Shield ${Math.ceil(forceFieldRemaining)}`;
  } else if (activePower) {
    powerEl.textContent = `${POWER_UPS[activePower].label} ${Math.ceil(powerUpTimer || laserTimer || slowTimeTimer || homingTimer || droneTimer || doubleScoreTimer || piercingTimer || magnetTimer)}`;
  } else if (bombCharges > 0) {
    powerEl.textContent = `Bomb ${bombCharges}`;
  } else {
    powerEl.textContent = "Ready";
  }
}

function setOverlay(title) {
  messageEl.textContent = title;
  overlay.classList.remove("hidden");
}

function pauseGame() {
  if (state === "playing" || state === "respawning") {
    const previousState = state;
    state = "paused";
    pauseButton.dataset.resumeState = previousState;
    setOverlay("Paused. Press Enter or tap Start to resume.");
  } else if (state === "paused") {
    state = pauseButton.dataset.resumeState || "playing";
    overlay.classList.add("hidden");
  }
}

function spawnParticle(x, y, color, count = 14) {
  count = settings.reducedMotion ? Math.ceil(count * 0.32) : count;
  for (let i = 0; i < count; i += 1) {
    particles.push({
      x,
      y,
      vx: random(-155, 155),
      vy: random(-180, 120),
      life: random(0.32, 0.72),
      maxLife: 0.72,
      radius: random(2, 5),
      color,
    });
  }
}

function spawnPlayerExplosion(x, y) {
  const colors = ["#f8fbff", "#64ff9b", "#39d9ff", "#f4c95d", "#ff476f"];
  const explosionCount = settings.reducedMotion ? 38 : 110;
  for (let i = 0; i < explosionCount; i += 1) {
    const angle = random(0, Math.PI * 2);
    const speed = random(110, 480);
    const life = random(0.5, 1.2);
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 35,
      life,
      maxLife: life,
      radius: random(3, 9),
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }

  shockwaves.push(
    { x, y, radius: 8, maxRadius: 165, life: 0.72, maxLife: 0.72, color: "#64ff9b", lineWidth: 10 },
    { x, y, radius: 4, maxRadius: 105, life: 0.48, maxLife: 0.48, color: "#f8fbff", lineWidth: 6 },
  );
}

function spawnFloatingText(x, y, text, color = "#f8fbff") {
  floatingTexts.push({
    x,
    y,
    text,
    color,
    life: 1,
    maxLife: 1,
    vy: -42,
  });
}

function maybeDropPowerUp(enemy) {
  const chance = enemy.kind === "mothership" ? 1 : enemy.kind === "boss" ? 0.22 : 0.1;
  if (Math.random() > chance) return;

  const types = Object.keys(POWER_UPS);
  const type = types[Math.floor(Math.random() * types.length)];
  powerUps.push({
    x: enemy.x,
    y: enemy.y,
    width: 28,
    height: 28,
    vy: 90,
    type,
    phase: random(0, Math.PI * 2),
  });
}

function activatePowerUp(type) {
  activePower = type;
  const durationBoost = 1 + runUpgrades.duration * 0.2;
  powerUpTimer = (type === "spread" || type === "rapid" ? 10 : 0) * durationBoost;
  if (type === "laser") {
    laserTimer = 5 * durationBoost;
  } else if (type === "slow") {
    slowTimeTimer = 8 * durationBoost;
  } else if (type === "homing") {
    homingTimer = 10 * durationBoost;
    powerUpTimer = homingTimer;
  } else if (type === "drone") {
    droneTimer = 12 * durationBoost;
    powerUpTimer = droneTimer;
  } else if (type === "double") {
    doubleScoreTimer = 12 * durationBoost;
    powerUpTimer = doubleScoreTimer;
  } else if (type === "pierce") {
    piercingTimer = 12 * durationBoost;
    powerUpTimer = piercingTimer;
  } else if (type === "magnet") {
    magnetTimer = 14 * durationBoost;
    powerUpTimer = magnetTimer;
  } else if (type === "bomb") {
    bombCharges = Math.min(3, bombCharges + 1);
    activePower = "";
    powerUpTimer = 0;
  }
  spawnFloatingText(player.x, player.y - 58, POWER_UPS[type].label, POWER_UPS[type].color);
  spawnParticle(player.x, player.y, POWER_UPS[type].color, 24);
  playSound("power");
}

function rectsOverlap(a, b) {
  return (
    a.x - a.width / 2 < b.x + b.width / 2 &&
    a.x + a.width / 2 > b.x - b.width / 2 &&
    a.y - a.height / 2 < b.y + b.height / 2 &&
    a.y + a.height / 2 > b.y - b.height / 2
  );
}

function projectileOverlap(a, b) {
  return rectsOverlap(
    { ...a, width: a.width + 10, height: a.height + 10 },
    { ...b, width: b.width + 10, height: b.height + 10 }
  );
}

function firePlayer() {
  if (fireCooldown > 0 || state !== "playing") return;
  ensureAudio();
  const shotSpeed = activePower === "rapid" ? -820 : -720;
  let shots = activePower === "spread"
    ? [
        { x: -18, vx: -115 },
        { x: 0, vx: 0 },
        { x: 18, vx: 115 },
      ]
    : [
        { x: -12, vx: 0 },
        { x: 12, vx: 0 },
      ];

  for (let i = 0; i < runUpgrades.spread; i += 1) {
    const offset = 26 + i * 9;
    shots = [...shots, { x: -offset, vx: -80 - i * 35 }, { x: offset, vx: 80 + i * 35 }];
  }

  for (const shot of shots) {
    playerBullets.push({
      x: player.x + shot.x,
      y: player.y - 26,
      width: 5,
      height: 18,
      vx: shot.vx,
      vy: shotSpeed,
      damage: 1 + runUpgrades.damage,
      pierce: runUpgrades.pierce + (piercingTimer > 0 ? 2 : 0),
      homing: homingTimer > 0,
    });
  }
  if (droneTimer > 0) {
    playerBullets.push(
      { x: player.x - 42, y: player.y - 6, width: 4, height: 14, vx: -40, vy: -680, damage: 1, pierce: 0, homing: false },
      { x: player.x + 42, y: player.y - 6, width: 4, height: 14, vx: 40, vy: -680, damage: 1, pierce: 0, homing: false },
    );
  }
  fireCooldown = (activePower === "rapid" ? 0.12 : 0.24) * Math.max(0.46, 1 - runUpgrades.fireRate * 0.12);
  playSound("fire");
}

function useBomb() {
  if (state !== "playing" || bombCharges <= 0) return;
  bombCharges -= 1;
  const cleared = enemyBullets.length;
  enemyBullets.length = 0;
  for (let i = enemies.length - 1; i >= 0; i -= 1) {
    const enemy = enemies[i];
    enemy.hp -= enemy.kind === "mothership" ? 5 : 3;
    if (enemy.hp <= 0) destroyEnemy(i, enemy, false);
  }
  shockwaves.push({ x: player.x, y: player.y, radius: 10, maxRadius: 760, life: 0.85, maxLife: 0.85, color: "#ff476f", lineWidth: 14 });
  spawnFloatingText(player.x, player.y - 70, `NOVA BOMB · ${cleared} SHOTS CLEARED`, "#ff8aa1");
  playSound("playerHit");
}

function fireEnemy(enemy) {
  const tuning = difficulty();
  if (enemyBullets.length >= tuning.enemyBulletLimit) return;

  const aim = clamp((wave - 1) / 5, 0, 1);
  const missOffset = random(-210, 210) * (1 - aim) + random(-55, 55) * aim;
  const dx = player.x + missOffset - enemy.x;
  const dy = player.y - enemy.y;
  const len = Math.hypot(dx, dy) || 1;
  const speed = tuning.enemyBulletSpeed;
  enemyBullets.push({
    x: enemy.x,
    y: enemy.y + 18,
    width: 7,
    height: 16,
    vx: (dx / len) * speed,
    vy: (dy / len) * speed,
  });
}

function fireBoss(enemy) {
  const tuning = difficulty();
  const slots = enemy.bossPhase >= 3 ? [-0.58, -0.29, 0, 0.29, 0.58] : enemy.bossPhase === 2 ? [-0.42, -0.18, 0.18, 0.42] : [-0.32, 0, 0.32];
  for (const angle of slots) {
    if (enemyBullets.length >= tuning.enemyBulletLimit + 3) return;
    enemyBullets.push({
      x: enemy.x,
      y: enemy.y + 42,
      width: 9,
      height: 18,
      vx: Math.sin(angle) * tuning.enemyBulletSpeed * 0.9,
      vy: Math.cos(angle) * tuning.enemyBulletSpeed * 0.9,
    });
  }
  if (enemy.parts?.left > 0) fireEnemy({ ...enemy, x: enemy.x - 48, y: enemy.y });
  if (enemy.parts?.right > 0) fireEnemy({ ...enemy, x: enemy.x + 48, y: enemy.y });
}

function chooseDiver() {
  const formation = enemies.filter((enemy) => enemy.state === "formation" && enemy.kind !== "mothership");
  if (!formation.length) return;
  const enemy = formation[Math.floor(Math.random() * formation.length)];
  enemy.state = "diving";
  enemy.diveT = 0;
  enemy.startX = enemy.x;
  enemy.startY = enemy.y;
  const aim = clamp((wave - 1) / 5, 0, 1);
  const looseTarget = WORLD.width / 2 + random(-280, 280);
  const playerTarget = player.x + random(-220, 220);
  enemy.controlX = clamp(looseTarget * (1 - aim) + playerTarget * aim, 110, WORLD.width - 110);
  enemy.controlY = random(330, 500);
  const looseEnd = WORLD.width / 2 + random(-330, 330);
  const playerEnd = player.x + random(-120, 120);
  enemy.endX = clamp(looseEnd * (1 - aim) + playerEnd * aim, 70, WORLD.width - 70);
  enemy.endY = WORLD.height + 70;
  enemy.diveDuration = random(4.4, 5.8) / difficulty().diveSpeed;
  if (enemy.kind === "kamikaze") {
    enemy.controlX = player.x;
    enemy.endX = player.x;
    enemy.diveDuration *= 0.58;
    enemy.telegraph = 0.55;
  }
}

function bezier(a, b, c, t) {
  const inv = 1 - t;
  return inv * inv * a + 2 * inv * t * b + t * t * c;
}

function activeGamepad() {
  if (!navigator.getGamepads) return null;
  return [...navigator.getGamepads()].find(Boolean) || null;
}

function updatePlayer(dt) {
  let dir = 0;
  if (keys.has("ArrowLeft") || keys.has("KeyA")) dir -= 1;
  if (keys.has("ArrowRight") || keys.has("KeyD")) dir += 1;
  if (touchLeftHeld) dir -= 1;
  if (touchRightHeld) dir += 1;

  const gamepad = activeGamepad();
  if (gamepad) {
    const axis = Math.abs(gamepad.axes[0] || 0) > 0.18 ? gamepad.axes[0] : 0;
    dir += axis;
    gamepadStatus.textContent = `Gamepad: ${gamepad.id.split("(")[0].trim()}`;
    if (gamepad.buttons[0]?.pressed) firePlayer();
    const bombPressed = Boolean(gamepad.buttons[1]?.pressed);
    if (bombPressed && !gamepadWasBomb) useBomb();
    gamepadWasBomb = bombPressed;
    const startPressed = Boolean(gamepad.buttons[9]?.pressed);
    if (startPressed && !gamepadWasStart) pauseGame();
    gamepadWasStart = startPressed;
  } else {
    gamepadStatus.textContent = "Gamepad: not connected";
  }

  if (demoMode) {
    const target = powerUps[0] || enemies.reduce((closest, enemy) => (
      !closest || enemy.y > closest.y ? enemy : closest
    ), null);
    if (target) dir = clamp((target.x - player.x) / 85, -1, 1);
    firePlayer();
  }

  if (pointerActive) {
    player.x += (pointerX - player.x) * Math.min(1, dt * 11);
  } else {
    player.x += dir * player.speed * (1 + runUpgrades.speed * 0.1) * dt;
  }

  player.x = clamp(player.x, 38, WORLD.width - 38);
  player.invulnerable = Math.max(0, player.invulnerable - dt);
  forceFieldRemaining = Math.max(0, forceFieldRemaining - dt);

  if (keys.has(settings.fireKey) || touchFireHeld) {
    firePlayer();
  }

  if (!settings.reducedMotion && Math.random() < dt * 30) {
    particles.push({
      x: player.x + random(-14, 14), y: player.y + 34, vx: random(-16, 16), vy: random(70, 150),
      life: 0.28, maxLife: 0.28, radius: random(2, 4), color: "#39d9ff",
    });
  }
}

function updatePowerUps(dt) {
  for (let i = powerUps.length - 1; i >= 0; i -= 1) {
    const powerUp = powerUps[i];
    if (magnetTimer > 0) {
      const dx = player.x - powerUp.x;
      const dy = player.y - powerUp.y;
      const distance = Math.hypot(dx, dy) || 1;
      if (distance < 280) {
        powerUp.x += (dx / distance) * 260 * dt;
        powerUp.y += (dy / distance) * 260 * dt;
      }
    }
    powerUp.y += powerUp.vy * dt;
    powerUp.phase += dt * 5;

    if (rectsOverlap(powerUp, player)) {
      activatePowerUp(powerUp.type);
      powerUps.splice(i, 1);
    } else if (powerUp.y > WORLD.height + 40) {
      powerUps.splice(i, 1);
    }
  }
}

function updateFloatingTexts(dt) {
  for (let i = floatingTexts.length - 1; i >= 0; i -= 1) {
    const text = floatingTexts[i];
    text.y += text.vy * dt;
    text.life -= dt;
    if (text.life <= 0) floatingTexts.splice(i, 1);
  }
}

function updatePowerTimers(dt) {
  if (comboTimer > 0) {
    comboTimer -= dt;
    if (comboTimer <= 0) combo = 1;
  }

  if (powerUpTimer > 0) {
    powerUpTimer -= dt;
    if (powerUpTimer <= 0 && activePower !== "laser" && activePower !== "slow") activePower = "";
  }

  if (laserTimer > 0) {
    laserTimer -= dt;
    if (laserTimer <= 0 && activePower === "laser") activePower = "";
  }

  if (slowTimeTimer > 0) {
    slowTimeTimer -= dt;
    if (slowTimeTimer <= 0 && activePower === "slow") activePower = "";
  }

  homingTimer = Math.max(0, homingTimer - dt);
  droneTimer = Math.max(0, droneTimer - dt);
  doubleScoreTimer = Math.max(0, doubleScoreTimer - dt);
  piercingTimer = Math.max(0, piercingTimer - dt);
  magnetTimer = Math.max(0, magnetTimer - dt);
  if (activePower && powerUpTimer <= 0 && laserTimer <= 0 && slowTimeTimer <= 0 && homingTimer <= 0 && droneTimer <= 0 && doubleScoreTimer <= 0 && piercingTimer <= 0 && magnetTimer <= 0) {
    activePower = "";
  }

  if (waveBannerTimer > 0) waveBannerTimer -= dt;
}

function updateEnemies(dt) {
  const tuning = difficulty();
  const slowScale = slowTimeTimer > 0 ? 0.48 : 1;
  const motionDt = dt * tuning.formationSpeed * slowScale;
  const formationDrift = Math.sin(performance.now() / 900) * (18 + Math.min(22, wave * 1.8));
  const formationDrop = Math.sin(performance.now() / 1600) * 5;
  diveTimer -= dt;
  spawnTimer += dt;

  if (diveTimer <= 0) {
    chooseDiver();
    diveTimer = random(tuning.diveDelayMin, tuning.diveDelayMax);
  }

  for (const enemy of enemies) {
    enemy.entryTimer = Math.max(0, (enemy.entryTimer || 0) - dt);
    enemy.telegraph = Math.max(0, (enemy.telegraph || 0) - dt);
    enemy.phase += motionDt * 1.55;
    enemy.shotTimer -= dt * slowScale;

    if (enemy.state === "formation") {
      enemy.x = enemy.homeX + formationDrift + Math.sin(enemy.phase) * 5;
      enemy.y = enemy.homeY + formationDrop + Math.cos(enemy.phase * 0.8) * 3;
    } else {
      enemy.diveT += motionDt / enemy.diveDuration;
      const t = enemy.diveT;
      enemy.x = bezier(enemy.startX, enemy.controlX, enemy.endX, t);
      enemy.y = bezier(enemy.startY, enemy.controlY, enemy.endY, t);

      if (t >= 1) {
        enemy.state = "formation";
        enemy.diveT = 0;
        enemy.x = enemy.homeX;
        enemy.y = enemy.homeY;
      }
    }

    if (enemy.kind === "shielder") {
      enemy.shielded = Math.sin(performance.now() / 620 + enemy.phase) > 0.42;
    }

    if (enemy.kind === "mothership") {
      const hpPct = enemy.hp / enemy.maxHp;
      const nextPhase = hpPct <= 0.34 ? 3 : hpPct <= 0.68 ? 2 : 1;
      if (nextPhase > enemy.bossPhase) {
        enemy.bossPhase = nextPhase;
        enemy.telegraph = 1.25;
        waveBanner = `Core Phase ${nextPhase}`;
        waveBannerTimer = 1.5;
        spawnParticle(enemy.x, enemy.y, "#ff476f", 38);
        playSound("boss");
      }
    }

    const canShoot = enemy.state === "diving" || enemy.row >= 3 || wave >= 4;
    if (canShoot && enemy.shotTimer <= 0 && enemy.y > 80 && enemy.y < WORLD.height - 120) {
      if (enemy.kind === "mothership") {
        if (enemy.pendingSalvo && enemy.telegraph <= 0) {
          fireBoss(enemy);
          enemy.pendingSalvo = false;
          enemy.shotTimer = random(1.2, 2.1) / enemy.bossPhase;
        } else if (!enemy.pendingSalvo) {
          enemy.pendingSalvo = true;
          enemy.telegraph = 0.7;
          enemy.shotTimer = 0.7;
        }
      } else {
        fireEnemy(enemy);
        enemy.shotTimer = random(tuning.shotDelayMin, tuning.shotDelayMax);
      }
    }
  }
}

function updateBullets(dt) {
  for (const bullet of playerBullets) {
    if (bullet.homing && enemies.length) {
      let target = enemies[0];
      let best = Infinity;
      for (const enemy of enemies) {
        const distance = Math.hypot(enemy.x - bullet.x, enemy.y - bullet.y);
        if (distance < best) {
          best = distance;
          target = enemy;
        }
      }
      bullet.vx += clamp((target.x - bullet.x) * 3.2 - bullet.vx, -520 * dt, 520 * dt);
    }
    bullet.x += (bullet.vx || 0) * dt;
    bullet.y += bullet.vy * dt;
  }

  for (const bullet of enemyBullets) {
    const slowScale = slowTimeTimer > 0 ? 0.48 : 1;
    bullet.x += (bullet.vx || 0) * dt * slowScale;
    bullet.y += bullet.vy * dt * slowScale;
  }

  removeOffscreen(playerBullets);
  removeOffscreen(enemyBullets);
}

function damageEnemy(enemy, damage, impactX) {
  if (enemy.kind === "shielder" && enemy.shielded) {
    enemy.shielded = false;
    spawnParticle(impactX, enemy.y, "#68f5ad", 12);
    playSound("shieldBlock");
    return false;
  }

  if (enemy.kind === "mothership" && enemy.parts) {
    const side = impactX < enemy.x ? "left" : "right";
    if (enemy.parts[side] > 0 && Math.abs(impactX - enemy.x) > 22) {
      enemy.parts[side] = Math.max(0, enemy.parts[side] - damage);
      spawnParticle(impactX, enemy.y, enemy.parts[side] > 0 ? "#f4c95d" : "#ff476f", enemy.parts[side] > 0 ? 8 : 28);
      if (enemy.parts[side] <= 0) {
        spawnFloatingText(impactX, enemy.y - 36, `${side.toUpperCase()} TURRET DESTROYED`, "#f4c95d");
        addScore(500);
      }
      return false;
    }
  }

  enemy.hp -= damage;
  return enemy.hp <= 0;
}

function removeOffscreen(list) {
  for (let i = list.length - 1; i >= 0; i -= 1) {
    const item = list[i];
    if (item.y < -50 || item.y > WORLD.height + 70 || item.x < -70 || item.x > WORLD.width + 70) {
      list.splice(i, 1);
    }
  }
}

function updateParticles(dt) {
  for (let i = particles.length - 1; i >= 0; i -= 1) {
    const p = particles[i];
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 260 * dt;
    p.life -= dt;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

function updateShockwaves(dt) {
  for (let i = shockwaves.length - 1; i >= 0; i -= 1) {
    const shockwave = shockwaves[i];
    shockwave.life -= dt;
    const progress = 1 - clamp(shockwave.life / shockwave.maxLife, 0, 1);
    shockwave.radius = shockwave.maxRadius * (1 - (1 - progress) ** 2);
    if (shockwave.life <= 0) shockwaves.splice(i, 1);
  }
}

function updateStars(dt) {
  for (const star of stars) {
    star.y += star.speed * star.z * dt;
    if (star.y > WORLD.height) {
      star.y = 0;
      star.x = random(0, WORLD.width);
      star.z = random(0.18, 1);
    }
  }

  for (const line of gridLines) {
    line.y += dt * 0.18;
    if (line.y > 1) line.y -= 1;
  }
}

function handleCollisions() {
  if (laserTimer > 0) {
    for (let j = enemies.length - 1; j >= 0; j -= 1) {
      const enemy = enemies[j];
      if (Math.abs(enemy.x - player.x) > enemy.width / 2 + 12) continue;
      enemy.hp -= 0.18;
      spawnParticle(enemy.x + random(-12, 12), enemy.y + random(-10, 10), "#ff5f8f", 1);
      if (enemy.hp <= 0) destroyEnemy(j, enemy, true);
    }
  }

  for (let i = playerBullets.length - 1; i >= 0; i -= 1) {
    const playerShot = playerBullets[i];
    for (let j = enemyBullets.length - 1; j >= 0; j -= 1) {
      const enemyShot = enemyBullets[j];
      if (!projectileOverlap(playerShot, enemyShot)) continue;

      const sparkX = (playerShot.x + enemyShot.x) / 2;
      const sparkY = (playerShot.y + enemyShot.y) / 2;
      playerBullets.splice(i, 1);
      enemyBullets.splice(j, 1);
      const earned = addScore(10);
      if (!demoMode) stats.interceptions += 1;
      spawnParticle(sparkX, sparkY, "#f4c95d", 10);
      spawnFloatingText(sparkX, sparkY, `+${earned}`, "#f4c95d");
      playSound("intercept");
      break;
    }
  }

  for (let i = playerBullets.length - 1; i >= 0; i -= 1) {
    const bullet = playerBullets[i];
    for (let j = enemies.length - 1; j >= 0; j -= 1) {
      const enemy = enemies[j];
      if (!rectsOverlap(bullet, enemy)) continue;

      if ((bullet.pierce || 0) > 0) bullet.pierce -= 1;
      else playerBullets.splice(i, 1);
      spawnParticle(bullet.x, bullet.y, "#ffd85a", 6);

      if (damageEnemy(enemy, bullet.damage || 1, bullet.x)) {
        destroyEnemy(j, enemy, enemy.state === "diving");
      }
      break;
    }
  }

  if (player.invulnerable > 0) return;

  for (let i = enemyBullets.length - 1; i >= 0; i -= 1) {
    if (rectsOverlap(enemyBullets[i], player)) {
      enemyBullets.splice(i, 1);
      if (hasForceField()) {
        spawnParticle(player.x, player.y - 18, "#39d9ff", 14);
        playSound("shieldBlock");
        return;
      }
      if (wave === 1 && waveAge() < difficulty().firstWaveGrace) {
        spawnParticle(player.x, player.y - 20, "#39d9ff", 8);
        return;
      }
      hitPlayer();
      return;
    }
  }

  for (const enemy of enemies) {
    if (!rectsOverlap(enemy, player)) continue;

    if (hasForceField()) {
      spawnParticle(enemy.x, enemy.y, "#39d9ff", 18);
      playSound("shieldBlock");
      enemy.state = "formation";
      enemy.diveT = 0;
      enemy.x = enemy.homeX;
      enemy.y = enemy.homeY;
      return;
    }

    hitPlayer();
    enemy.state = "formation";
    enemy.diveT = 0;
    enemy.x = enemy.homeX;
    enemy.y = enemy.homeY;
    return;
  }
}

function destroyEnemy(index, enemy, bonus) {
  const values = { mothership: 2200, boss: 300, armored: 260, shielder: 220, kamikaze: 190, guard: 160, scout: 90 };
  const baseValue = values[enemy.kind] || 90;
  const earned = addScore(bonus ? baseValue * 2 : baseValue);
  const color = enemy.kind === "mothership" || enemy.kind === "boss" ? "#ff4f67" : "#38e8ff";
  spawnParticle(enemy.x, enemy.y, color, enemy.kind === "mothership" ? 52 : 18);
  spawnFloatingText(enemy.x, enemy.y - 12, `+${earned}`, color);
  maybeDropPowerUp(enemy);
  playSound("destroy");
  if (!demoMode) {
    stats.kills += 1;
    if (enemy.kind === "mothership") stats.bosses += 1;
    saveStats();
  }
  enemies.splice(index, 1);
}

function hitPlayer() {
  lives -= 1;
  spawnPlayerExplosion(player.x, player.y);
  spawnFloatingText(player.x, player.y - 58, "SHIP LOST", "#ff8aa1");
  playSound("playerHit");
  player.visible = false;
  player.invulnerable = 0;
  enemyBullets.length = 0;
  playerBullets.length = 0;
  const tuning = difficulty();
  for (const enemy of enemies) {
    enemy.shotTimer = random(tuning.shotDelayMin, tuning.shotDelayMax);
    if (enemy.state === "diving") {
      enemy.state = "formation";
      enemy.diveT = 0;
      enemy.x = enemy.homeX;
      enemy.y = enemy.homeY;
    }
  }

  if (lives <= 0) {
    state = "gameover";
    if (!demoMode) {
      highScore = Math.max(highScore, score);
      localStorage.setItem("galactic-swarm-high", String(highScore));
    }
    updateHud();
    setOverlay(`Game over. Final score: ${score.toLocaleString()}. Press Enter to try again.`);
    if (demoMode) {
      demoMode = false;
      setOverlay("Press Enter or tap Start to launch.");
      state = "ready";
    }
  } else {
    state = "respawning";
    respawnTimer = 2.15;
  }
}

function updateRespawn(dt) {
  respawnTimer -= dt;
  if (respawnTimer > 0) return;
  player.x = WORLD.width / 2;
  player.visible = true;
  player.invulnerable = 2.6;
  state = "playing";
  shockwaves.push({ x: player.x, y: player.y, radius: 4, maxRadius: 92, life: 0.5, maxLife: 0.5, color: "#68f5ad", lineWidth: 7 });
  spawnFloatingText(player.x, player.y - 62, "WARP COMPLETE", "#68f5ad");
  playSound("shield");
}

function offerUpgrades() {
  const pool = [...UPGRADE_DEFS];
  chosenUpgrades = [];
  while (chosenUpgrades.length < 3 && pool.length) {
    chosenUpgrades.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  }
  upgradeButtons.forEach((button, index) => {
    const upgrade = chosenUpgrades[index];
    button.innerHTML = `<strong>${index + 1}. ${upgrade.name}</strong><span>${upgrade.description}<br>Current level: ${runUpgrades[upgrade.id]}</span>`;
  });
  state = "upgrade";
  upgradePanel.hidden = false;
  if (demoMode) setTimeout(() => chooseUpgrade(Math.floor(Math.random() * chosenUpgrades.length)), 700);
}

function chooseUpgrade(index) {
  if (state !== "upgrade" || !chosenUpgrades[index]) return;
  const upgrade = chosenUpgrades[index];
  runUpgrades[upgrade.id] += 1;
  upgradePanel.hidden = true;
  wave += 1;
  stats.bestWave = Math.max(stats.bestWave, wave);
  if (!demoMode) saveStats();
  addScore(1000 + wave * 250);
  player.invulnerable = 1.4;
  state = "playing";
  makeWave();
}

function completeWave() {
  if (state !== "playing") return;
  offerUpgrades();
}

function startDemo() {
  if (state !== "ready") return;
  resetGame(true);
  waveBanner = "Demo Pilot · Press Enter to Play";
  waveBannerTimer = 4;
}

function update(dt) {
  updateStars(dt);
  updateParticles(dt);
  updateShockwaves(dt);
  updateFloatingTexts(dt);
  updateMusic(dt);

  if (state === "ready") {
    idleTimer += dt;
    if (idleTimer >= 12) startDemo();
    return;
  }

  if (state === "respawning") {
    updatePowerTimers(dt);
    updateEnemies(dt * 0.45);
    updateBullets(dt * 0.45);
    updateRespawn(dt);
    updateHud();
    return;
  }

  if (state !== "playing") return;

  if (demoMode) {
    demoTimer += dt;
    if (demoTimer > 55) {
      demoMode = false;
      state = "ready";
      setOverlay("Press Enter or tap Start to launch.");
      idleTimer = 0;
      return;
    }
  }

  fireCooldown = Math.max(0, fireCooldown - dt);
  updatePowerTimers(dt);
  updatePlayer(dt);
  updateEnemies(dt);
  updateBullets(dt);
  updatePowerUps(dt);
  handleCollisions();

  if (!enemies.length) {
    completeWave();
  }

  if (!demoMode) {
    highScore = Math.max(highScore, score);
    localStorage.setItem("galactic-swarm-high", String(highScore));
  }
  updateHud();
}

function drawBackground() {
  const sky = ctx.createLinearGradient(0, 0, 0, WORLD.height);
  sky.addColorStop(0, "#03040b");
  sky.addColorStop(0.55, wave % 5 === 0 ? "#150817" : "#050914");
  sky.addColorStop(1, slowTimeTimer > 0 ? "#151136" : "#07151d");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, WORLD.width, WORLD.height);

  const nebula = ctx.createRadialGradient(WORLD.width * 0.18, WORLD.height * 0.14, 0, WORLD.width * 0.18, WORLD.height * 0.14, WORLD.width * 0.7);
  nebula.addColorStop(0, wave % 5 === 0 ? "rgba(255, 71, 111, 0.2)" : "rgba(57, 217, 255, 0.18)");
  nebula.addColorStop(0.38, slowTimeTimer > 0 ? "rgba(169, 121, 255, 0.2)" : "rgba(169, 121, 255, 0.08)");
  nebula.addColorStop(1, "rgba(57, 217, 255, 0)");
  ctx.fillStyle = nebula;
  ctx.fillRect(0, 0, WORLD.width, WORLD.height);

  for (const star of stars) {
    const depth = 0.45 + star.z * 1.35;
    ctx.globalAlpha = star.alpha * (0.45 + star.z * 0.55);
    ctx.fillStyle = star.radius > 1.5 ? "#f7fbff" : "#9cabca";
    ctx.fillRect(star.x, star.y, star.radius * depth, star.radius * depth * 1.9);
  }
  ctx.globalAlpha = 1;

  drawPerspectiveGrid();
}

function drawPerspectiveGrid() {
  const horizon = WORLD.height * 0.58;
  const centerX = WORLD.width / 2;
  const floorGradient = ctx.createLinearGradient(0, horizon, 0, WORLD.height);
  floorGradient.addColorStop(0, "rgba(57, 217, 255, 0)");
  floorGradient.addColorStop(1, "rgba(57, 217, 255, 0.13)");
  ctx.fillStyle = floorGradient;
  ctx.fillRect(0, horizon, WORLD.width, WORLD.height - horizon);

  ctx.save();
  ctx.lineWidth = 1;
  ctx.shadowBlur = 16;
  ctx.shadowColor = "rgba(57, 217, 255, 0.55)";

  for (let i = -8; i <= 8; i += 1) {
    const x = centerX + i * 78;
    ctx.strokeStyle = "rgba(57, 217, 255, 0.13)";
    ctx.beginPath();
    ctx.moveTo(centerX + i * 12, horizon);
    ctx.lineTo(x, WORLD.height);
    ctx.stroke();
  }

  for (const line of gridLines) {
    const t = line.y;
    const eased = t * t;
    const y = horizon + eased * (WORLD.height - horizon);
    const alpha = 0.04 + t * 0.18;
    ctx.strokeStyle = `rgba(57, 217, 255, ${alpha})`;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(WORLD.width, y);
    ctx.stroke();
  }

  ctx.restore();
}

function drawPlayer() {
  if (!player.visible) return;
  ctx.save();
  ctx.translate(player.x, player.y);
  if (player.invulnerable > 0 && Math.floor(player.invulnerable * 10) % 2 === 0) {
    ctx.globalAlpha = 0.46;
  }

  ctx.shadowBlur = 24;
  ctx.shadowColor = "rgba(69, 241, 178, 0.48)";

  const wing = ctx.createLinearGradient(0, -30, 0, 34);
  wing.addColorStop(0, "#c8fff1");
  wing.addColorStop(0.32, "#45f1b2");
  wing.addColorStop(1, "#0a5a5f");
  ctx.fillStyle = wing;
  ctx.beginPath();
  ctx.moveTo(0, -34);
  ctx.lineTo(14, -5);
  ctx.lineTo(38, 16);
  ctx.lineTo(17, 13);
  ctx.lineTo(10, 31);
  ctx.lineTo(0, 20);
  ctx.lineTo(-10, 31);
  ctx.lineTo(-17, 13);
  ctx.lineTo(-38, 16);
  ctx.lineTo(-14, -5);
  ctx.closePath();
  ctx.fill();

  ctx.shadowBlur = 0;
  const core = ctx.createLinearGradient(0, -34, 0, 25);
  core.addColorStop(0, "#efffff");
  core.addColorStop(0.36, "#9af8de");
  core.addColorStop(1, "#173845");
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.moveTo(0, -37);
  ctx.lineTo(10, -7);
  ctx.lineTo(7, 18);
  ctx.lineTo(0, 28);
  ctx.lineTo(-7, 18);
  ctx.lineTo(-10, -7);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(1, 6, 12, 0.58)";
  ctx.beginPath();
  ctx.moveTo(-38, 16);
  ctx.lineTo(-17, 13);
  ctx.lineTo(-10, 31);
  ctx.lineTo(-2, 22);
  ctx.lineTo(2, 22);
  ctx.lineTo(10, 31);
  ctx.lineTo(17, 13);
  ctx.lineTo(38, 16);
  ctx.lineTo(12, 36);
  ctx.lineTo(-12, 36);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(232, 255, 249, 0.42)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(0, -31);
  ctx.lineTo(0, 20);
  ctx.moveTo(-26, 13);
  ctx.lineTo(-9, 4);
  ctx.moveTo(26, 13);
  ctx.lineTo(9, 4);
  ctx.stroke();

  ctx.fillStyle = "#06111a";
  ctx.beginPath();
  ctx.roundRect(-5, -15, 10, 13, 3);
  ctx.fill();
  ctx.fillStyle = "#a9fff1";
  ctx.fillRect(-2, -12, 4, 6);

  ctx.shadowBlur = 18;
  ctx.shadowColor = "rgba(57, 217, 255, 0.9)";
  ctx.fillStyle = "#39d9ff";
  ctx.fillRect(-16, 27, 8, 9);
  ctx.fillRect(8, 27, 8, 9);
  ctx.fillStyle = "rgba(57, 217, 255, 0.26)";
  ctx.beginPath();
  ctx.moveTo(-15, 36);
  ctx.lineTo(-10, 58);
  ctx.lineTo(-5, 36);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(15, 36);
  ctx.lineTo(10, 58);
  ctx.lineTo(5, 36);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawDrones() {
  if (droneTimer <= 0 || !player.visible) return;
  for (const side of [-1, 1]) {
    const x = player.x + side * 42;
    const y = player.y + Math.sin(performance.now() / 180 + side) * 7;
    ctx.save();
    ctx.translate(x, y);
    ctx.shadowBlur = 18;
    ctx.shadowColor = "#68f5ad";
    ctx.fillStyle = "#68f5ad";
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(12, 7);
    ctx.lineTo(0, 4);
    ctx.lineTo(-12, 7);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

function drawForceField() {
  if (!hasForceField() || !player.visible) return;

  const warning = forceFieldRemaining <= 8;
  const urgency = warning ? 1 - clamp(forceFieldRemaining / 8, 0, 1) : 0;
  const blinkSpeed = 150 - urgency * 85;
  const blink = warning ? Math.sin(performance.now() / blinkSpeed) * 0.5 + 0.5 : 1;
  const visible = !warning || blink > 0.28;
  if (!visible) return;

  const pulse = Math.sin(performance.now() / (95 - urgency * 34)) * 0.5 + 0.5;
  const radiusX = 52 + pulse * 5;
  const radiusY = 46 + pulse * 4;
  const blueAlpha = 0.26 + pulse * 0.08;
  const warningAlpha = 0.12 + urgency * 0.32;

  ctx.save();
  ctx.translate(player.x, player.y - 2);
  ctx.shadowBlur = 28 + urgency * 12;
  ctx.shadowColor = warning ? "rgba(244, 201, 93, 0.9)" : "rgba(57, 217, 255, 0.82)";

  const shield = ctx.createRadialGradient(0, 0, 12, 0, 0, 62);
  shield.addColorStop(0, "rgba(57, 217, 255, 0)");
  shield.addColorStop(0.55, "rgba(57, 217, 255, 0.08)");
  shield.addColorStop(1, warning ? `rgba(244, 201, 93, ${warningAlpha})` : `rgba(57, 217, 255, ${blueAlpha})`);
  ctx.fillStyle = shield;
  ctx.beginPath();
  ctx.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.lineWidth = 2.4;
  ctx.strokeStyle = warning
    ? `rgba(244, 201, 93, ${0.52 + blink * 0.38})`
    : `rgba(182, 246, 255, ${0.48 + pulse * 0.28})`;
  ctx.beginPath();
  ctx.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = 1;
  ctx.strokeStyle = warning ? `rgba(255, 255, 255, ${0.22 + blink * 0.34})` : "rgba(255, 255, 255, 0.32)";
  ctx.beginPath();
  ctx.ellipse(0, 0, radiusX - 9, radiusY - 8, -0.35, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawEnemy(enemy) {
  ctx.save();
  ctx.translate(enemy.x, enemy.y);
  if (enemy.entryTimer > 0) {
    const entry = 1 - clamp(enemy.entryTimer / 1.2, 0, 1);
    ctx.globalAlpha = entry;
    ctx.translate(0, -160 * (1 - entry));
    ctx.scale(0.55 + entry * 0.45, 0.55 + entry * 0.45);
  }
  const diveScale = enemy.state === "diving" ? 1 + Math.sin(clamp(enemy.diveT, 0, 1) * Math.PI) * 0.42 : 1;
  ctx.scale(diveScale, diveScale);
  ctx.rotate(enemy.state === "diving" ? Math.sin(enemy.diveT * Math.PI * 2) * 0.18 : 0);
  const pulse = Math.sin(enemy.phase * 3) * 0.5 + 0.5;

  if (enemy.kind === "mothership") {
    ctx.shadowBlur = 34;
    ctx.shadowColor = "rgba(255, 71, 111, 0.62)";
    const ship = ctx.createLinearGradient(0, -54, 0, 48);
    ship.addColorStop(0, "#ff9aad");
    ship.addColorStop(0.42, "#ad183c");
    ship.addColorStop(1, "#1d0712");
    ctx.fillStyle = ship;
    ctx.beginPath();
    ctx.moveTo(0, -50);
    ctx.lineTo(30, -34);
    ctx.lineTo(76, -14);
    ctx.lineTo(52, 6);
    ctx.lineTo(66, 34);
    ctx.lineTo(22, 23);
    ctx.lineTo(0, 52);
    ctx.lineTo(-22, 23);
    ctx.lineTo(-66, 34);
    ctx.lineTo(-52, 6);
    ctx.lineTo(-76, -14);
    ctx.lineTo(-30, -34);
    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(4, 2, 10, 0.58)";
    ctx.fillRect(-48, -10, 28, 20);
    ctx.fillRect(20, -10, 28, 20);
    ctx.strokeStyle = enemy.parts.left > 0 ? "#f4c95d" : "rgba(255,255,255,0.12)";
    ctx.lineWidth = 3;
    ctx.strokeRect(-55, -16, 32, 29);
    ctx.strokeStyle = enemy.parts.right > 0 ? "#f4c95d" : "rgba(255,255,255,0.12)";
    ctx.strokeRect(23, -16, 32, 29);
    ctx.fillStyle = `rgba(244, 201, 93, ${0.5 + pulse * 0.35})`;
    ctx.beginPath();
    ctx.moveTo(0, -28);
    ctx.lineTo(15, -7);
    ctx.lineTo(0, 9);
    ctx.lineTo(-15, -7);
    ctx.closePath();
    ctx.fill();

    const hpPct = clamp(enemy.hp / enemy.maxHp, 0, 1);
    ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    ctx.fillRect(-74, 60, 148, 8);
    ctx.fillStyle = "#ff476f";
    ctx.fillRect(-74, 60, 148 * hpPct, 8);
  } else if (enemy.kind === "boss") {
    ctx.shadowBlur = 24;
    ctx.shadowColor = "rgba(255, 71, 111, 0.52)";
    const boss = ctx.createLinearGradient(0, -24, 0, 22);
    boss.addColorStop(0, enemy.hp > 1 ? "#ff8aa1" : "#ffe28a");
    boss.addColorStop(0.42, enemy.hp > 1 ? "#db214d" : "#d49b22");
    boss.addColorStop(1, "#2a0b19");
    ctx.fillStyle = boss;
    ctx.beginPath();
    ctx.moveTo(0, -24);
    ctx.lineTo(14, -15);
    ctx.lineTo(36, -4);
    ctx.lineTo(24, 8);
    ctx.lineTo(31, 21);
    ctx.lineTo(8, 15);
    ctx.lineTo(0, 24);
    ctx.lineTo(-8, 15);
    ctx.lineTo(-31, 21);
    ctx.lineTo(-24, 8);
    ctx.lineTo(-36, -4);
    ctx.lineTo(-14, -15);
    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(15, 2, 12, 0.58)";
    ctx.beginPath();
    ctx.moveTo(-26, -3);
    ctx.lineTo(-10, -9);
    ctx.lineTo(-5, 7);
    ctx.lineTo(-22, 10);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(26, -3);
    ctx.lineTo(10, -9);
    ctx.lineTo(5, 7);
    ctx.lineTo(22, 10);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = `rgba(255, 210, 112, ${0.42 + pulse * 0.32})`;
    ctx.beginPath();
    ctx.moveTo(0, -14);
    ctx.lineTo(8, -4);
    ctx.lineTo(0, 3);
    ctx.lineTo(-8, -4);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 220, 230, 0.28)";
    ctx.lineWidth = 1;
    ctx.stroke();
  } else if (enemy.kind === "armored" || enemy.kind === "shielder" || enemy.kind === "kamikaze") {
    const color = enemy.kind === "armored" ? "#f4c95d" : enemy.kind === "shielder" ? "#68f5ad" : "#ff476f";
    ctx.shadowBlur = 24;
    ctx.shadowColor = color;
    ctx.fillStyle = color;
    ctx.beginPath();
    if (enemy.kind === "kamikaze") {
      ctx.moveTo(0, -25); ctx.lineTo(22, 17); ctx.lineTo(0, 10); ctx.lineTo(-22, 17);
    } else {
      ctx.moveTo(0, -22); ctx.lineTo(29, -3); ctx.lineTo(20, 20); ctx.lineTo(0, 13); ctx.lineTo(-20, 20); ctx.lineTo(-29, -3);
    }
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(3, 7, 15, 0.72)";
    ctx.fillRect(-8, -7, 16, 13);
    if (enemy.kind === "armored") {
      ctx.strokeStyle = "#fff4bd";
      ctx.lineWidth = 3;
      ctx.strokeRect(-25, -14, 50, 29);
    } else if (enemy.kind === "shielder" && enemy.shielded) {
      ctx.strokeStyle = "rgba(104, 245, 173, 0.9)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 34, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (enemy.kind === "guard") {
    ctx.shadowBlur = 22;
    ctx.shadowColor = "rgba(57, 217, 255, 0.45)";
    const guard = ctx.createLinearGradient(0, -20, 0, 20);
    guard.addColorStop(0, "#d8fbff");
    guard.addColorStop(0.44, "#28bfe5");
    guard.addColorStop(1, "#082e46");
    ctx.fillStyle = guard;
    ctx.beginPath();
    ctx.moveTo(0, -21);
    ctx.lineTo(12, -7);
    ctx.lineTo(30, 2);
    ctx.lineTo(15, 12);
    ctx.lineTo(8, 22);
    ctx.lineTo(0, 11);
    ctx.lineTo(-8, 22);
    ctx.lineTo(-15, 12);
    ctx.lineTo(-30, 2);
    ctx.lineTo(-12, -7);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(3, 14, 25, 0.55)";
    ctx.beginPath();
    ctx.moveTo(-22, 2);
    ctx.lineTo(-8, -4);
    ctx.lineTo(-5, 7);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(22, 2);
    ctx.lineTo(8, -4);
    ctx.lineTo(5, 7);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = `rgba(244, 201, 93, ${0.7 + pulse * 0.25})`;
    ctx.fillRect(-4, -10, 8, 7);
  } else {
    ctx.shadowBlur = 18;
    ctx.shadowColor = "rgba(169, 121, 255, 0.46)";
    const scout = ctx.createLinearGradient(0, -18, 0, 18);
    scout.addColorStop(0, "#efe5ff");
    scout.addColorStop(0.44, "#8b55f0");
    scout.addColorStop(1, "#251248");
    ctx.fillStyle = scout;
    ctx.beginPath();
    ctx.moveTo(0, -19);
    ctx.lineTo(11, -2);
    ctx.lineTo(25, 9);
    ctx.lineTo(6, 17);
    ctx.lineTo(0, 24);
    ctx.lineTo(-6, 17);
    ctx.lineTo(-25, 9);
    ctx.lineTo(-11, -2);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(8, 4, 20, 0.5)";
    ctx.beginPath();
    ctx.moveTo(-16, 7);
    ctx.lineTo(-5, -2);
    ctx.lineTo(-3, 10);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(16, 7);
    ctx.lineTo(5, -2);
    ctx.lineTo(3, 10);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = `rgba(249, 246, 255, ${0.78 + pulse * 0.22})`;
    ctx.fillRect(-3, -7, 6, 6);
  }

  if (enemy.telegraph > 0) {
    ctx.globalAlpha = 0.55 + Math.sin(performance.now() / 55) * 0.35;
    ctx.strokeStyle = "#ff476f";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(enemy.width, enemy.height) * 0.76, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

function drawBullets() {
  for (const bullet of playerBullets) {
    const beam = ctx.createLinearGradient(bullet.x, bullet.y + 18, bullet.x, bullet.y - 18);
    beam.addColorStop(0, "rgba(244, 201, 93, 0)");
    beam.addColorStop(0.35, "#f4c95d");
    beam.addColorStop(1, "#f8fbff");
    ctx.shadowBlur = 16;
    ctx.shadowColor = "rgba(244, 201, 93, 0.75)";
    ctx.fillStyle = beam;
    ctx.fillRect(bullet.x - bullet.width / 2, bullet.y - bullet.height / 2, bullet.width, bullet.height);
  }

  for (const bullet of enemyBullets) {
    ctx.shadowBlur = 14;
    ctx.shadowColor = "rgba(255, 71, 111, 0.75)";
    ctx.fillStyle = "#ff476f";
    ctx.fillRect(bullet.x - bullet.width / 2, bullet.y - bullet.height / 2, bullet.width, bullet.height);
  }
  ctx.shadowBlur = 0;
}

function drawLaser() {
  if (laserTimer <= 0) return;
  const pulse = Math.sin(performance.now() / 45) * 0.5 + 0.5;
  ctx.save();
  ctx.shadowBlur = 26;
  ctx.shadowColor = "rgba(255, 95, 143, 0.8)";
  const beam = ctx.createLinearGradient(player.x, player.y, player.x, 0);
  beam.addColorStop(0, "rgba(255, 95, 143, 0.12)");
  beam.addColorStop(0.2, "rgba(255, 95, 143, 0.7)");
  beam.addColorStop(1, "rgba(255, 255, 255, 0.9)");
  ctx.fillStyle = beam;
  ctx.fillRect(player.x - 4 - pulse * 3, 0, 8 + pulse * 6, player.y - 24);
  ctx.fillStyle = "rgba(255, 255, 255, 0.72)";
  ctx.fillRect(player.x - 1.5, 0, 3, player.y - 24);
  ctx.restore();
}

function drawPowerUps() {
  for (const powerUp of powerUps) {
    const meta = POWER_UPS[powerUp.type];
    const bob = Math.sin(powerUp.phase) * 3;
    ctx.save();
    ctx.translate(powerUp.x, powerUp.y + bob);
    ctx.shadowBlur = 20;
    ctx.shadowColor = meta.color;
    ctx.fillStyle = meta.color;
    ctx.beginPath();
    ctx.moveTo(0, -17);
    ctx.lineTo(17, 0);
    ctx.lineTo(0, 17);
    ctx.lineTo(-17, 0);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(2, 4, 10, 0.72)";
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "700 11px ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(meta.label[0], 0, 1);
    ctx.restore();
  }
}

function drawFloatingTexts() {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "800 18px ui-monospace, monospace";
  for (const item of floatingTexts) {
    const alpha = clamp(item.life / item.maxLife, 0, 1);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = item.color;
    ctx.shadowBlur = 14;
    ctx.shadowColor = item.color;
    ctx.fillText(item.text, item.x, item.y);
  }
  ctx.restore();
  ctx.globalAlpha = 1;
}

function drawWaveBanner() {
  if (waveBannerTimer <= 0) return;
  const alpha = clamp(waveBannerTimer / 0.6, 0, 1);
  ctx.save();
  ctx.globalAlpha = Math.min(1, alpha);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "900 54px Inter, system-ui, sans-serif";
  ctx.fillStyle = wave % 5 === 0 ? "#ff8aa1" : "#f8fbff";
  ctx.shadowBlur = 30;
  ctx.shadowColor = wave % 5 === 0 ? "rgba(255, 71, 111, 0.7)" : "rgba(57, 217, 255, 0.7)";
  ctx.fillText(waveBanner, WORLD.width / 2, WORLD.height * 0.48);
  ctx.restore();
  ctx.globalAlpha = 1;
}

function drawStateBanner() {
  if (state !== "respawning" && !demoMode) return;
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (state === "respawning") {
    ctx.fillStyle = "#68f5ad";
    ctx.font = "900 38px Inter, system-ui, sans-serif";
    ctx.shadowBlur = 24;
    ctx.shadowColor = "#68f5ad";
    ctx.fillText(`REASSEMBLING SHIP · ${Math.max(1, Math.ceil(respawnTimer))}`, WORLD.width / 2, WORLD.height * 0.64);
    const progress = clamp(1 - respawnTimer / 2.15, 0, 1);
    ctx.strokeStyle = "rgba(104, 245, 173, 0.65)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(WORLD.width / 2 - 180, player.y);
    ctx.lineTo(WORLD.width / 2 - 180 + 360 * progress, player.y);
    ctx.stroke();
  }
  if (demoMode) {
    ctx.fillStyle = "rgba(248, 251, 255, 0.8)";
    ctx.font = "800 18px ui-monospace, monospace";
    ctx.fillText("DEMO PILOT · PRESS ENTER TO PLAY", WORLD.width / 2, WORLD.height - 24);
  }
  ctx.restore();
}

function drawParticles() {
  for (const p of particles) {
    ctx.globalAlpha = clamp(p.life / p.maxLife, 0, 1);
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - p.radius / 2, p.y - p.radius / 2, p.radius, p.radius);
  }
  ctx.globalAlpha = 1;
}

function drawShockwaves() {
  for (const shockwave of shockwaves) {
    const alpha = clamp(shockwave.life / shockwave.maxLife, 0, 1);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = shockwave.color;
    ctx.lineWidth = Math.max(1, shockwave.lineWidth * alpha);
    ctx.shadowBlur = 24;
    ctx.shadowColor = shockwave.color;
    ctx.beginPath();
    ctx.arc(shockwave.x, shockwave.y, shockwave.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

function draw() {
  ctx.save();
  drawBackground();
  drawLaser();
  drawBullets();
  drawPowerUps();
  for (const enemy of enemies) drawEnemy(enemy);
  drawPlayer();
  drawDrones();
  drawForceField();
  drawShockwaves();
  drawParticles();
  drawFloatingTexts();
  drawWaveBanner();
  drawStateBanner();
  ctx.restore();
}

function loop(now) {
  const dt = Math.min(0.033, (now - lastTime) / 1000 || 0);
  lastTime = now;
  update(dt);
  draw();
  rafId = requestAnimationFrame(loop);
}

function canvasPointerX(event) {
  const rect = canvas.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  return clamp(x * WORLD.width, 35, WORLD.width - 35);
}

window.addEventListener("resize", resize);

window.addEventListener("keydown", (event) => {
  idleTimer = 0;
  if (demoMode) {
    demoMode = false;
    if (event.code === "Enter") resetGame();
    return;
  }
  keys.add(event.code);
  if (event.code === "Space" || event.code === settings.fireKey) event.preventDefault();
  if (event.code === "Enter") {
    if (state === "ready" || state === "gameover") resetGame();
    else if (state === "paused") pauseGame();
  }
  if (event.code === "KeyP" || event.code === "Escape") pauseGame();
  if (event.code === "KeyB") useBomb();
  if (state === "upgrade" && ["Digit1", "Digit2", "Digit3"].includes(event.code)) {
    chooseUpgrade(Number(event.code.slice(-1)) - 1);
  }
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.code);
});

canvas.addEventListener("pointerdown", (event) => {
  idleTimer = 0;
  if (demoMode) {
    demoMode = false;
    resetGame();
    return;
  }
  pointerActive = true;
  pointerX = canvasPointerX(event);
  canvas.setPointerCapture(event.pointerId);
  if (state === "ready" || state === "gameover") resetGame();
  firePlayer();
});

canvas.addEventListener("pointermove", (event) => {
  if (!pointerActive) return;
  pointerX = canvasPointerX(event);
});

canvas.addEventListener("pointerup", (event) => {
  pointerActive = false;
  canvas.releasePointerCapture(event.pointerId);
});

canvas.addEventListener("pointercancel", () => {
  pointerActive = false;
});

startButton.addEventListener("click", () => {
  if (state === "ready" || state === "gameover") resetGame();
  else if (state === "paused") pauseGame();
});

pauseButton.addEventListener("click", pauseGame);

settingsButton.addEventListener("click", () => {
  settingsPanel.hidden = !settingsPanel.hidden;
});

volumeControl.addEventListener("input", () => {
  settings.volume = Number(volumeControl.value) / 100;
  syncVolume();
  saveSettings();
});

musicVolumeControl.addEventListener("input", () => {
  settings.musicVolume = Number(musicVolumeControl.value) / 100;
  ensureAudio();
  syncVolume();
  saveSettings();
});

difficultyControl.addEventListener("change", () => {
  settings.difficulty = difficultyControl.value;
  spawnFloatingText(WORLD.width / 2, WORLD.height * 0.58, `Difficulty: ${settings.difficulty}`, "#f4c95d");
  saveSettings();
});

fireKeyControl.addEventListener("change", () => {
  settings.fireKey = fireKeyControl.value;
  keys.clear();
  saveSettings();
});

reducedMotionControl.addEventListener("change", () => {
  settings.reducedMotion = reducedMotionControl.checked;
  saveSettings();
});

highContrastControl.addEventListener("change", () => {
  settings.highContrast = highContrastControl.checked;
  document.body.classList.toggle("high-contrast", settings.highContrast);
  saveSettings();
});

upgradeButtons.forEach((button, index) => button.addEventListener("click", () => chooseUpgrade(index)));

function bindHold(button, setter) {
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    idleTimer = 0;
    setter(true);
  });
  for (const eventName of ["pointerup", "pointercancel", "pointerleave"]) {
    button.addEventListener(eventName, () => setter(false));
  }
}

bindHold(touchLeft, (held) => { touchLeftHeld = held; });
bindHold(touchRight, (held) => { touchRightHeld = held; });
bindHold(touchFire, (held) => { touchFireHeld = held; });
touchBomb.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  useBomb();
});

window.addEventListener("gamepadconnected", () => { gamepadStatus.textContent = "Gamepad: connected"; });
window.addEventListener("gamepaddisconnected", () => { gamepadStatus.textContent = "Gamepad: not connected"; });

volumeControl.value = String(Math.round(settings.volume * 100));
musicVolumeControl.value = String(Math.round(settings.musicVolume * 100));
difficultyControl.value = settings.difficulty;
fireKeyControl.value = settings.fireKey;
reducedMotionControl.checked = settings.reducedMotion;
highContrastControl.checked = settings.highContrast;
document.body.classList.toggle("high-contrast", settings.highContrast);
renderStats();

makeStars();
makeWave();
updateHud();
resize();
draw();
rafId = requestAnimationFrame(loop);

window.addEventListener("beforeunload", () => cancelAnimationFrame(rafId));
