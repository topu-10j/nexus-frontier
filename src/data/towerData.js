// src/data/towerData.js
// Deep Space Signal Decoder — the final mission goal
// 3 parts to craft, walk to tower, repair step by step

// ═══════════════════════════════════════════════════════
// TOWER LOCATION (hybrid — 1.5 min walk, meaningful journey)
// ═══════════════════════════════════════════════════════
export const TOWER_POSITION = [0, 0, -400]; // Straight north, obstacle-free path  
export const TOWER_REPAIR_DISTANCE = 3.5;
export const TOWER_BEACON_HEIGHT = 85; // vertical beacon visible from far

// ═══════════════════════════════════════════════════════
// 3 CRAFTABLE PARTS (total cost: $10,000)
// ═══════════════════════════════════════════════════════
export const TOWER_PARTS = [
  {
    id: 'antenna',
    name: 'Antenna Dish',
    icon: '📡',
    cost: 3000,
    progress: 33,
    color: '#4FC3F7',
    description: 'Broadcasts signal to Earth',
    order: 1,
  },
  {
    id: 'powerCore',
    name: 'Power Core',
    icon: '🔋',
    cost: 3500,
    progress: 33,
    color: '#FFD54F',
    description: 'Powers the tower electronics',
    order: 2,
  },
  {
    id: 'signalChip',
    name: 'Signal Chip',
    icon: '💠',
    cost: 3500,
    progress: 34,
    color: '#BA68C8',
    description: 'Encodes Mars-to-Earth message',
    order: 3,
  },
];

export const TOWER_TOTAL_COST = TOWER_PARTS.reduce((sum, p) => sum + p.cost, 0);
// = 10000

// ═══════════════════════════════════════════════════════
// REPAIR PROGRESS MILESTONES
// ═══════════════════════════════════════════════════════
export const REPAIR_MILESTONES = [
  { at: 0,   label: 'Broken',           color: '#EF4444' },
  { at: 33,  label: 'Antenna online',   color: '#FBBF24' },
  { at: 66,  label: 'Power restored',   color: '#FBBF24' },
  { at: 100, label: 'Signal locked!',   color: '#4ADE80' },
];

// ═══════════════════════════════════════════════════════
// NEXA MESSAGES
// ═══════════════════════════════════════════════════════
export const TOWER_MESSAGES = {
  discovered: {
    text: 'Captain! A broken communication tower! Repair it to contact Earth!',
    icon: '📡',
  },
  needsPart: {
    text: 'You need to craft a part at base first!',
    icon: '🔧',
  },
  wrongPart: {
    text: 'That part is already installed! Craft the next one.',
    icon: '⚠️',
  },
  installed: {
    antenna: 'Antenna Dish installed! 33% complete. 📡',
    powerCore: 'Power Core installed! 66% complete. 🔋',
    signalChip: 'Signal Chip installed! 100% complete! 💠',
  },
  complete: {
    text: 'SIGNAL LOCKED! Earth is receiving your message! 🎉',
    icon: '🛰️',
  },
};

// ═══════════════════════════════════════════════════════
// VICTORY MESSAGE
// ═══════════════════════════════════════════════════════
export const TOWER_VICTORY = {
  title: 'SIGNAL ESTABLISHED',
  subtitle: 'You connected Mars to Earth!',
  message:
    'Your courage and skill brought humanity one step closer to the stars. NASA Mission Control has received your signal.',
  badge: '📡 Signal Decoder',
};

// ═══════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════
export const getPartById = (id) => TOWER_PARTS.find((p) => p.id === id);

export const getNextPart = (installedParts = []) => {
  const nextOrder = installedParts.length + 1;
  return TOWER_PARTS.find((p) => p.order === nextOrder);
};

export const getRepairProgress = (installedParts = []) => {
  return TOWER_PARTS.filter((p) => installedParts.includes(p.id)).reduce(
    (sum, p) => sum + p.progress,
    0
  );
};

export const isTowerComplete = (installedParts = []) =>
  installedParts.length === TOWER_PARTS.length;