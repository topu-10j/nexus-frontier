// src/data/alertData.js
// Alert configuration — all warnings = 20s (uniform, kid-friendly)

export const ALERT_TYPES = {
  // ═══════════════════════════════════════════════════════
  // RESOURCE CRITICAL (20s to respond)
  // ═══════════════════════════════════════════════════════
  OXYGEN_LOW: {
    id: 'OXYGEN_LOW',
    icon: '🫧',
    color: '#4FC3F7',
    title: 'OXYGEN CRITICAL',
    nexaMessage: 'Captain! Oxygen is running out. Build an Oxygen Generator NOW!',
    timer: 20,
    deathType: 'suffocate',
    deathMessage: '🫧 You ran out of oxygen...',
    solution: 'Build Oxygen Generator ($800) or Bio-Dome ($1200)',
  },
  POWER_LOW: {
    id: 'POWER_LOW',
    icon: '⚡',
    color: '#FFD54F',
    title: 'POWER CRITICAL',
    nexaMessage: 'Captain! Power is failing. Build a Power Grid immediately!',
    timer: 20,
    deathType: 'shutdown',
    deathMessage: '⚡ Systems shut down — no power...',
    solution: 'Build Power Grid ($600)',
  },
  TEMP_LOW: {
    id: 'TEMP_LOW',
    icon: '🌡️',
    color: '#FF7043',
    title: 'FREEZING TEMPERATURE',
    nexaMessage: 'Captain! Temperature dropping fast. Build a Thermal Regulator!',
    timer: 20,
    deathType: 'freeze',
    deathMessage: '❄️ You froze to death...',
    solution: 'Build Thermal Regulator ($700)',
  },
  RADIATION_HIGH: {
    id: 'RADIATION_HIGH',
    icon: '☢️',
    color: '#BA68C8',
    title: 'RADIATION CRITICAL',
    nexaMessage: 'Captain! Radiation is rising fast. Build a Magnetic Shield!',
    timer: 20,
    deathType: 'dissolve',
    deathMessage: '☢️ Radiation dissolved your suit...',
    solution: 'Build Magnetic Shield ($900)',
  },
  WATER_LOW: {
    id: 'WATER_LOW',
    icon: '💧',
    color: '#4DD0E1',
    title: 'WATER CRITICAL',
    nexaMessage: 'Captain! Water supply is critical. Mine an Ice Crater!',
    timer: 20,
    deathType: 'dehydrate',
    deathMessage: '💧 You dehydrated...',
    solution: 'Click an Ice Crater to mine ($1000)',
  },

  // ═══════════════════════════════════════════════════════
  // DISASTERS (20s to respond)
  // ═══════════════════════════════════════════════════════
  SANDSTORM: {
    id: 'SANDSTORM',
    icon: '🌪️',
    color: '#A0724A',
    title: 'DUST STORM INCOMING',
    nexaMessage: 'Captain! Massive dust storm! Take shelter — build a shield!',
    timer: 20,
    deathType: 'blownAway',
    deathMessage: '🌪️ Blown away by the sandstorm!',
    solution: 'Build Magnetic Shield Generator',
  },
  METEOR: {
    id: 'METEOR',
    icon: '☄️',
    color: '#FF4500',
    title: 'METEOR SHOWER',
    nexaMessage: 'Captain! Meteors incoming! Defend NOW!',
    timer: 20,
    deathType: 'explode',
    deathMessage: '☄️ Struck by a meteor!',
    solution: 'Build Magnetic Shield Generator',
  },
  SOLAR_FLARE: {
    id: 'SOLAR_FLARE',
    icon: '☀️',
    color: '#FFC107',
    title: 'SOLAR FLARE',
    nexaMessage: 'Captain! Solar flare! Radiation spike incoming!',
    timer: 20,
    deathType: 'melt',
    deathMessage: '☀️ Vaporized by solar radiation!',
    solution: 'Build Magnetic Shield ($900)',
  },
  OXYGEN_LEAK: {
    id: 'OXYGEN_LEAK',
    icon: '🫧',
    color: '#EF5350',
    title: 'OXYGEN LEAK',
    nexaMessage: 'Captain! Oxygen leak detected! Use the Repair Kit!',
    timer: 20,
    deathType: 'suffocate',
    deathMessage: '🫧 Lost all oxygen through the leak...',
    solution: 'Use Repair Kit or buy one ($500)',
  },
};

// ═══════════════════════════════════════════════════════
// DEATH ANIMATION CONFIG
// ═══════════════════════════════════════════════════════
export const DEATH_ANIMATIONS = {
  blownAway: {
    duration: 2.5,
    effects: ['spin', 'flyUp', 'fadeOut'],
    screenShake: 0.3,
    cameraZoom: 'out',
    particleColor: '#A0724A',
  },
  explode: {
    duration: 2.0,
    effects: ['explode', 'fireParticles', 'disappear'],
    screenShake: 0.8,
    cameraZoom: 'out',
    particleColor: '#FF4500',
  },
  melt: {
    duration: 2.5,
    effects: ['glowGreen', 'shrink', 'fadeOut'],
    screenShake: 0.2,
    cameraZoom: 'slow',
    particleColor: '#00FF00',
  },
  suffocate: {
    duration: 2.5,
    effects: ['wobble', 'fallDown', 'fadeBlue'],
    screenShake: 0.15,
    cameraZoom: 'slow',
    particleColor: '#4FC3F7',
  },
  freeze: {
    duration: 2.0,
    effects: ['iceGlow', 'solidify', 'shatter'],
    screenShake: 0.4,
    cameraZoom: 'in',
    particleColor: '#B0E8FF',
  },
  dissolve: {
    duration: 2.5,
    effects: ['glowPurple', 'pixelate', 'fadeOut'],
    screenShake: 0.2,
    cameraZoom: 'slow',
    particleColor: '#BA68C8',
  },
  dehydrate: {
    duration: 2.5,
    effects: ['shrink', 'wobble', 'fadeOut'],
    screenShake: 0.1,
    cameraZoom: 'slow',
    particleColor: '#A0522D',
  },
  shutdown: {
    duration: 2.0,
    effects: ['flicker', 'powerOff', 'fadeBlack'],
    screenShake: 0.1,
    cameraZoom: 'slow',
    particleColor: '#333333',
  },
};

// ═══════════════════════════════════════════════════════
// NEXA ESCALATION MESSAGES
// ═══════════════════════════════════════════════════════
export const NEXA_ESCALATION = [
  {
    message: '⚠️ Captain, please respond!',
    color: '#FFD54F',
    mood: 'concerned',
  },
  {
    message: '😠 I WARNED YOU! Act now!',
    color: '#FF9800',
    mood: 'angry',
  },
  {
    message: '💀 I TOLD YOU! Game over.',
    color: '#F44336',
    mood: 'furious',
  },
];

// ═══════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════
export const getAlertConfig = (type) => ALERT_TYPES[type] || null;

export const getDeathConfig = (deathType) =>
  DEATH_ANIMATIONS[deathType] || DEATH_ANIMATIONS.suffocate;

export const getNexaEscalation = (ignoredCount) => {
  const idx = Math.min(ignoredCount, NEXA_ESCALATION.length - 1);
  return NEXA_ESCALATION[idx];
};