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
const difficultyControl = document.querySelector("#difficultyControl");
const fireKeyControl = document.querySelector("#fireKeyControl");

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
let combo = 1;
let comboTimer = 0;
let waveBanner = "";
let waveBannerTimer = 0;
let laserTimer = 0;
let powerUpTimer = 0;
let activePower = "";
let slowTimeTimer = 0;
let settings = {
  volume: 0.7,
  difficulty: "normal",
  fireKey: "Space",
};

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
};

const POWER_UPS = {
  spread: { label: "Spread", color: "#f4c95d" },
  laser: { label: "Laser", color: "#ff5f8f" },
  rapid: { label: "Rapid", color: "#39d9ff" },
  slow: { label: "Slow", color: "#a979ff" },
};

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
    masterGain.gain.value = 0.18 * settings.volume;
    masterGain.connect(audioContext.destination);
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
}

function syncVolume() {
  if (masterGain) {
    masterGain.gain.value = 0.18 * settings.volume;
  }
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
  const earned = Math.round(points * combo);
  score += earned;
  combo = clamp(combo + 0.05, 1, 5);
  comboTimer = 2.4;
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
  forceFieldRemaining = Math.max(forceFieldRemaining, 12);
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
    collisionWave: 3,
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
      const kind = row < 1 ? "boss" : row < 3 ? "guard" : "scout";
      enemies.push({
        x: startX + xOffset + col * gapX,
        y: startY + row * gapY,
        homeX: startX + xOffset + col * gapX,
        homeY: startY + row * gapY,
        row,
        col,
        kind,
        width: kind === "boss" ? 48 : 42,
        height: kind === "boss" ? 38 : 34,
        phase: random(0, Math.PI * 2),
        state: "formation",
        diveT: 0,
        diveDuration: random(3.6, 4.8),
        shotTimer: random(tuning.shotDelayMin, tuning.shotDelayMax),
        hp: kind === "boss" ? 2 : 1,
      });
    }
  }
}

function resetGame() {
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
  forceFieldRemaining = 0;
  nextForceFieldScore = 5000;
  nextExtraLifeScore = 200000;
  player.x = WORLD.width / 2;
  player.y = WORLD.height - 74;
  player.invulnerable = 1.8;
  state = "playing";
  overlay.classList.add("hidden");
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
    powerEl.textContent = `${POWER_UPS[activePower].label} ${Math.ceil(powerUpTimer || laserTimer || slowTimeTimer)}`;
  } else {
    powerEl.textContent = "Ready";
  }
}

function setOverlay(title) {
  messageEl.textContent = title;
  overlay.classList.remove("hidden");
}

function pauseGame() {
  if (state === "playing") {
    state = "paused";
    setOverlay("Paused. Press Enter or tap Start to resume.");
  } else if (state === "paused") {
    state = "playing";
    overlay.classList.add("hidden");
  }
}

function spawnParticle(x, y, color, count = 14) {
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
  powerUpTimer = type === "spread" || type === "rapid" ? 10 : 0;
  if (type === "laser") {
    laserTimer = 5;
  } else if (type === "slow") {
    slowTimeTimer = 8;
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
  const shots = activePower === "spread"
    ? [
        { x: -18, vx: -115 },
        { x: 0, vx: 0 },
        { x: 18, vx: 115 },
      ]
    : [
        { x: -12, vx: 0 },
        { x: 12, vx: 0 },
      ];

  for (const shot of shots) {
    playerBullets.push({
      x: player.x + shot.x,
      y: player.y - 26,
      width: 5,
      height: 18,
      vx: shot.vx,
      vy: shotSpeed,
    });
  }
  fireCooldown = activePower === "rapid" ? 0.12 : 0.24;
  playSound("fire");
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
  const slots = [-0.32, 0, 0.32];
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
}

function bezier(a, b, c, t) {
  const inv = 1 - t;
  return inv * inv * a + 2 * inv * t * b + t * t * c;
}

function updatePlayer(dt) {
  let dir = 0;
  if (keys.has("ArrowLeft") || keys.has("KeyA")) dir -= 1;
  if (keys.has("ArrowRight") || keys.has("KeyD")) dir += 1;

  if (pointerActive) {
    player.x += (pointerX - player.x) * Math.min(1, dt * 11);
  } else {
    player.x += dir * player.speed * dt;
  }

  player.x = clamp(player.x, 38, WORLD.width - 38);
  player.invulnerable = Math.max(0, player.invulnerable - dt);
  forceFieldRemaining = Math.max(0, forceFieldRemaining - dt);

  if (keys.has(settings.fireKey)) {
    firePlayer();
  }
}

function updatePowerUps(dt) {
  for (let i = powerUps.length - 1; i >= 0; i -= 1) {
    const powerUp = powerUps[i];
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

    const canShoot = enemy.state === "diving" || enemy.row >= 3 || wave >= 4;
    if (canShoot && enemy.shotTimer <= 0 && enemy.y > 80 && enemy.y < WORLD.height - 120) {
      if (enemy.kind === "mothership") {
        fireBoss(enemy);
        enemy.shotTimer = random(1.2, 2.1);
      } else {
        fireEnemy(enemy);
        enemy.shotTimer = random(tuning.shotDelayMin, tuning.shotDelayMax);
      }
    }
  }
}

function updateBullets(dt) {
  for (const bullet of playerBullets) {
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

      playerBullets.splice(i, 1);
      enemy.hp -= 1;
      spawnParticle(bullet.x, bullet.y, "#ffd85a", 6);

      if (enemy.hp <= 0) {
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
    if (wave >= difficulty().collisionWave && enemy.state === "diving" && rectsOverlap(enemy, player)) {
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
      return;
    }
  }
}

function destroyEnemy(index, enemy, bonus) {
  const baseValue = enemy.kind === "mothership" ? 2200 : enemy.kind === "boss" ? 300 : enemy.kind === "guard" ? 160 : 90;
  const earned = addScore(bonus ? baseValue * 2 : baseValue);
  const color = enemy.kind === "mothership" || enemy.kind === "boss" ? "#ff4f67" : "#38e8ff";
  spawnParticle(enemy.x, enemy.y, color, enemy.kind === "mothership" ? 52 : 18);
  spawnFloatingText(enemy.x, enemy.y - 12, `+${earned}`, color);
  maybeDropPowerUp(enemy);
  playSound("destroy");
  enemies.splice(index, 1);
}

function hitPlayer() {
  lives -= 1;
  spawnParticle(player.x, player.y, "#64ff9b", 26);
  player.x = WORLD.width / 2;
  player.invulnerable = 3.2;
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
    highScore = Math.max(highScore, score);
    localStorage.setItem("galactic-swarm-high", String(highScore));
    updateHud();
    setOverlay(`Game over. Final score: ${score.toLocaleString()}. Press Enter to try again.`);
  }
}

function update(dt) {
  updateStars(dt);
  updateParticles(dt);
  updateFloatingTexts(dt);

  if (state !== "playing") return;

  fireCooldown = Math.max(0, fireCooldown - dt);
  updatePowerTimers(dt);
  updatePlayer(dt);
  updateEnemies(dt);
  updateBullets(dt);
  updatePowerUps(dt);
  handleCollisions();

  if (!enemies.length) {
    wave += 1;
    addScore(1000 + wave * 250);
    player.invulnerable = 1.4;
    makeWave();
  }

  highScore = Math.max(highScore, score);
  localStorage.setItem("galactic-swarm-high", String(highScore));
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

function drawForceField() {
  if (!hasForceField()) return;

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

function drawParticles() {
  for (const p of particles) {
    ctx.globalAlpha = clamp(p.life / p.maxLife, 0, 1);
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - p.radius / 2, p.y - p.radius / 2, p.radius, p.radius);
  }
  ctx.globalAlpha = 1;
}

function draw() {
  ctx.save();
  drawBackground();
  drawLaser();
  drawBullets();
  drawPowerUps();
  for (const enemy of enemies) drawEnemy(enemy);
  drawPlayer();
  drawForceField();
  drawParticles();
  drawFloatingTexts();
  drawWaveBanner();
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
  keys.add(event.code);
  if (event.code === "Space" || event.code === settings.fireKey) event.preventDefault();
  if (event.code === "Enter") {
    if (state === "ready" || state === "gameover") resetGame();
    else if (state === "paused") pauseGame();
  }
  if (event.code === "KeyP" || event.code === "Escape") pauseGame();
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.code);
});

canvas.addEventListener("pointerdown", (event) => {
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
});

difficultyControl.addEventListener("change", () => {
  settings.difficulty = difficultyControl.value;
  spawnFloatingText(WORLD.width / 2, WORLD.height * 0.58, `Difficulty: ${settings.difficulty}`, "#f4c95d");
});

fireKeyControl.addEventListener("change", () => {
  settings.fireKey = fireKeyControl.value;
  keys.clear();
});

makeStars();
makeWave();
updateHud();
resize();
draw();
rafId = requestAnimationFrame(loop);

window.addEventListener("beforeunload", () => cancelAnimationFrame(rafId));
