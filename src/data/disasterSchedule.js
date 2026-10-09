// src/data/disasterSchedule.js
// Fixed disaster timeline — loops forever with escalating difficulty
// Schedule designed for kids: gentle start, then progressive challenge

export const DISASTER_SCHEDULE = [
  // ═══════════════════════════════════════════════════════
  // EARLY GAME (Grace period → easy disasters)
  // ═══════════════════════════════════════════════════════
  { delay: 30, type: 'sandstorm',  damage: 20, label: 'Sandstorm' },
  { delay: 30, type: 'solarFlare', damage: 20, label: 'Solar Flare' },
  { delay: 35, type: 'sandstorm',  damage: 25, label: 'Strong Sandstorm' },
  { delay: 35, type: 'meteor',     damage: 30, label: 'Meteor Shower' },

  // ═══════════════════════════════════════════════════════
  // MID GAME (Harder — big damage)
  // ═══════════════════════════════════════════════════════
  { delay: 40, type: 'sandstorm',  damage: 50, label: 'MASSIVE DUST STORM' },
  { delay: 30, type: 'solarFlare', damage: 25, label: 'Solar Flare' },
  { delay: 35, type: 'meteor',     damage: 30, label: 'Meteor Shower' },
  { delay: 40, type: 'sandstorm',  damage: 50, label: 'MASSIVE DUST STORM' },

  // ═══════════════════════════════════════════════════════
  // LATE GAME (Hardest)
  // ═══════════════════════════════════════════════════════
  { delay: 30, type: 'solarFlare', damage: 20, label: 'Solar Flare' },
  { delay: 40, type: 'meteor',     damage: 50, label: 'MEGA METEOR STRIKE' },
];

// ═══════════════════════════════════════════════════════
// Damage effects per disaster type
// ═══════════════════════════════════════════════════════
export const DISASTER_EFFECTS = {
  sandstorm: {
    name: 'Sandstorm',
    icon: '🌪️',
    color: '#A0724A',
    effects: (damage) => ({
      power: -damage,          // Solar panels blocked
      temperature: -damage * 0.5,
    }),
  },
  solarFlare: {
    name: 'Solar Flare',
    icon: '☀️',
    color: '#FFC107',
    effects: (damage) => ({
      radiation: +damage,       // Radiation spikes
      power: -damage * 0.7,
    }),
  },
  meteor: {
    name: 'Meteor Shower',
    icon: '☄️',
    color: '#FF4500',
    effects: (damage) => ({
      oxygen: -damage * 0.6,
      power: -damage * 0.8,
      temperature: -damage * 0.4,
    }),
  },
};

// ═══════════════════════════════════════════════════════
// Duration of active disaster (visual effect)
// ═══════════════════════════════════════════════════════
export const DISASTER_DURATION = 10; // seconds

// ═══════════════════════════════════════════════════════
// Helper — get next disaster in loop
// ═══════════════════════════════════════════════════════
export const getDisasterAtIndex = (index) => {
  const safeIndex = index % DISASTER_SCHEDULE.length;
  return DISASTER_SCHEDULE[safeIndex];
};

export const SCHEDULE_LENGTH = DISASTER_SCHEDULE.length;