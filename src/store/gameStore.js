import { create } from 'zustand';

export const useGameStore = create((set, get) => ({
  oxygen: 100,
  power: 100,
  temperature: 50,
  radiation: 30,
  budget: 5000,
  buildings: [],

  missionDay: 1,
  maxDays: 3,
  missionStatus: 'active',
  score: 0,
  deathReason: null,

  reachedSummit: false,
  flagPlanted: false,

  achievements: [],
  activeDisaster: null,
  disasterTimer: 0,

  addBuilding: (building, position) =>
    set((state) => {
      if (state.budget < building.cost) return state;
      return {
        buildings: [...state.buildings, { ...building, position }],
        budget: state.budget - building.cost,
        oxygen: Math.min(100, state.oxygen + (building.oxygen || 0)),
        power: Math.max(0, Math.min(100, state.power + (building.power || 0))),
        temperature: Math.max(0, Math.min(100, state.temperature + (building.temp || 0))),
        radiation: Math.max(0, Math.min(100, state.radiation + (building.radiation || 0))),
        score: state.score + 50,
      };
    }),

  walkingDrain: () =>
    set((state) => {
      if (state.missionStatus !== 'active') return state;

      const newOxygen = Math.max(0, state.oxygen - 0.5);
      const newPower = Math.max(0, state.power - 0.3);
      const newTemp = Math.max(0, state.temperature - 0.2);
      const newRad = Math.min(100, state.radiation + 0.2);

      let newStatus = state.missionStatus;
      let reason = null;

      if (newOxygen <= 0) {
        newStatus = 'failed';
        reason = '❌ OXYGEN DEPLETED — Shwas bondho hoye mritu';
      } else if (newPower <= 0) {
        newStatus = 'failed';
        reason = '❌ POWER LOST — System shutdown, frozen';
      } else if (newRad >= 100) {
        newStatus = 'failed';
        reason = '❌ RADIATION FATAL — Bikiron e mritu';
      } else if (newTemp <= 0) {
        newStatus = 'failed';
        reason = '❌ HYPOTHERMIA — Thanda y jome mritu';
      }

      return {
        oxygen: newOxygen,
        power: newPower,
        temperature: newTemp,
        radiation: newRad,
        missionStatus: newStatus,
        deathReason: reason,
      };
    }),

  reachSummit: () =>
    set((state) => {
      if (state.missionStatus !== 'active') return state;
      return { reachedSummit: true, score: state.score + 200 };
    }),

  plantFlag: () =>
    set((state) => {
      if (!state.reachedSummit) return state;
      return {
        flagPlanted: true,
        missionStatus: 'success',
        score: state.score + 1000,
      };
    }),

  triggerDisaster: (type) =>
    set((state) => {
      let effects = {};
      if (type === 'sandstorm') {
        effects = { power: Math.max(0, state.power - 20), temperature: Math.max(0, state.temperature - 8) };
      } else if (type === 'solarFlare') {
        effects = { radiation: Math.min(100, state.radiation + 25), power: Math.max(0, state.power - 12) };
      } else if (type === 'meteor') {
        effects = { oxygen: Math.max(0, state.oxygen - 12), power: Math.max(0, state.power - 15) };
      }
      return { ...state, ...effects, activeDisaster: type, disasterTimer: 8 };
    }),

  clearDisaster: () => set({ activeDisaster: null, disasterTimer: 0 }),

  unlockAchievement: (id, name, icon) =>
    set((state) => {
      if (state.achievements.find((a) => a.id === id)) return state;
      return {
        achievements: [...state.achievements, { id, name, icon, unlockedAt: Date.now() }],
        score: state.score + 100,
      };
    }),

  resetGame: () =>
    set({
      oxygen: 100,
      power: 100,
      temperature: 50,
      radiation: 30,
      budget: 5000,
      buildings: [],
      missionDay: 1,
      missionStatus: 'active',
      score: 0,
      deathReason: null,
      reachedSummit: false,
      flagPlanted: false,
      achievements: [],
      activeDisaster: null,
      disasterTimer: 0,
    }),
}));