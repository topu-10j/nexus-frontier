// src/store/gameStore.js
import { create } from 'zustand';
import { TOWER_PARTS } from '../data/towerData';

export const useGameStore = create((set, get) => ({
  // ═══════════════════════════════════════════════════════
  // ============ CORE RESOURCES ============
  // ═══════════════════════════════════════════════════════
  oxygen: 100,
  power: 100,
  temperature: 50,
  radiation: 30,
  waterLevel: 100,
  budget: 5000,
  buildings: [],

  // ═══════════════════════════════════════════════════════
  // ============ MISSION / DAY SYSTEM ============
  // ═══════════════════════════════════════════════════════
  marsLoaded: false,
  robotHasMoved: false,
  missionDay: 1,
  missionTimer: 0,
  missionStatus: 'active',
  score: 0,
  deathReason: null,

  dayPopupVisible: false,
  dayPopupNumber: 1,

  achievements: [],
  activeDisaster: null,
  disasterTimer: 0,
  solarDisabled: false,
  oxygenLeak: null,
  hasRepairKit: false,

  alienArtifactFound: false,
  alienArtifactPosition: [
    (Math.random() - 0.5) * 200,
    (Math.random() - 0.5) * 200,
  ],

  iceCraters: [
    { id: 1, position: [30, 0, 30], mined: false },
    { id: 2, position: [-40, 0, 20], mined: false },
    { id: 3, position: [25, 0, -50], mined: false },
    { id: 4, position: [-60, 0, -35], mined: false },
    { id: 5, position: [70, 0, 40], mined: false },
  ],

  interestingObjects: [
    { id: 1,  type: 'crystal',   position: [-50, 0, -40],  found: false, reward: 500, icon: '💎', name: 'Mars Crystal' },
    { id: 2,  type: 'skull',     position: [60, 0, -30],   found: false, reward: 300, icon: '💀', name: 'Ancient Fossil' },
    { id: 3,  type: 'meteor',    position: [-70, 0, 50],   found: false, reward: 400, icon: '☄️', name: 'Meteorite' },
    { id: 4,  type: 'mushroom',  position: [80, 0, 60],    found: false, reward: 200, icon: '🍄', name: 'Alien Mushroom' },
    { id: 5,  type: 'statue',    position: [40, 0, -80],   found: false, reward: 700, icon: '🗿', name: 'Alien Statue' },
    { id: 6,  type: 'plant',     position: [-100, 0, 100], found: false, reward: 250, icon: '🌱', name: 'Alien Plant' },
    { id: 7,  type: 'debris',    position: [120, 0, -60],  found: false, reward: 350, icon: '🛰️', name: 'Crashed Satellite' },
    { id: 8,  type: 'volcano',   position: [-120, 0, -90], found: false, reward: 600, icon: '🌋', name: 'Dormant Volcano' },
    { id: 9,  type: 'footprint', position: [90, 0, 110],   found: false, reward: 150, icon: '🐾', name: 'Alien Footprints' },
    { id: 10, type: 'cave',      position: [-140, 0, -30], found: false, reward: 800, icon: '🕳️', name: 'Hidden Cave' },
  ],

  currentProblem: null,
  nexaTouched: false,
  welcomeShown: false,
  walkDirection: null,

  activeWarning: null,
  warningEscalation: 0,
  alertCooldowns: {},
  deathInfo: null,
  activeDeath: false,
  _lastDamage: null,

  quizActive: false,
  currentQuiz: null,
  askedQuestionIds: [],
  quizStreak: 0,
  quizSessionCount: 0,
  quizCooldown: false,

  towerInstalledParts: [],
  towerPartsCarried: [],
  towerDiscovered: false,
  towerCompleted: false,

  playerName: '',
  discoveries: 0,

  // ═══════════════════════════════════════════════════════
  // ============ MASTER GATE ACTIONS ============
  // ═══════════════════════════════════════════════════════
  setMarsLoaded: () => set({ marsLoaded: true }),

  markRobotMoved: () => {
    const s = get();
    if (!s.robotHasMoved) {
      set({ robotHasMoved: true });
    }
  },

  // ═══════════════════════════════════════════════════════
  // ============ MISSION ACTIONS ============
  // ═══════════════════════════════════════════════════════
  tickMissionTimer: () =>
    set((state) => {
      if (state.missionStatus !== 'active') return state;
      if (!state.marsLoaded) return state;
      if (!state.robotHasMoved) return state;
      return { missionTimer: state.missionTimer + 1 };
    }),

  advanceDay: (newDay) =>
    set({
      missionDay: newDay,
      dayPopupVisible: true,
      dayPopupNumber: newDay,
    }),

  hideDayPopup: () => set({ dayPopupVisible: false }),

  checkCritical: () =>
    set((state) => {
      if (state.missionStatus !== 'active') return state;
      let newStatus = state.missionStatus;
      let reason = null;

      if (state.oxygen <= 0) { newStatus = 'failed'; reason = '❌ OXYGEN DEPLETED'; }
      else if (state.power <= 0) { newStatus = 'failed'; reason = '❌ POWER LOST'; }
      else if (state.radiation >= 100) { newStatus = 'failed'; reason = '❌ RADIATION FATAL'; }
      else if (state.temperature <= 0) { newStatus = 'failed'; reason = '❌ HYPOTHERMIA'; }
      else if (state.waterLevel <= 0) { newStatus = 'failed'; reason = '❌ WATER DEPLETED'; }

      return { missionStatus: newStatus, deathReason: reason };
    }),

  // ═══════════════════════════════════════════════════════
  // ============ BUILDINGS ============
  // ═══════════════════════════════════════════════════════
  addBuilding: (building, position) =>
    set((state) => {
      if (state.budget < building.cost) {
        return { ...state, quizActive: true };
      }
      return {
        buildings: [
          ...state.buildings,
          {
            ...building,
            position,
            hp: 100,
            maxHp: 100,
            instanceId: `${building.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          },
        ],
        budget: state.budget - building.cost,
        oxygen: Math.min(100, state.oxygen + (building.oxygen || 0)),
        power: Math.max(0, Math.min(100, state.power + (building.power || 0))),
        temperature: Math.max(0, Math.min(100, state.temperature + (building.temp || 0))),
        radiation: Math.max(0, Math.min(100, state.radiation + (building.radiation || 0))),
        waterLevel: Math.min(100, state.waterLevel + (building.water || 0)),
        score: state.score + 50,
      };
    }),

  damageBuilding: (instanceId, amount = 34) =>
    set((state) => {
      let destroyed = false;
      let destroyedName = '';

      const newBuildings = state.buildings
        .map((b) => {
          if (b.instanceId !== instanceId) return b;
          const newHp = Math.max(0, (b.hp || 100) - amount);
          if (newHp === 0) {
            destroyed = true;
            destroyedName = b.name;
          }
          return { ...b, hp: newHp };
        })
        .filter((b) => (b.hp || 100) > 0);

      const budgetLoss = destroyed ? 500 : 0;
      const scoreLoss = destroyed ? 100 : 0;

      return {
        buildings: newBuildings,
        budget: Math.max(0, state.budget - budgetLoss),
        score: Math.max(0, state.score - scoreLoss),
        _lastDamage: {
          instanceId,
          destroyed,
          destroyedName,
          amount,
          timestamp: Date.now(),
        },
      };
    }),

  walkingDrain: () =>
    set((state) => {
      if (state.missionStatus !== 'active') return state;
      if (!state.marsLoaded) return state;
      if (!state.robotHasMoved) return state;

      const newOxygen = Math.max(0, state.oxygen - 0.3);
      const newPower = Math.max(0, state.power - 0.2);
      const newTemp = Math.max(0, state.temperature - 0.15);
      const newRad = Math.min(100, state.radiation + 0.15);
      const newWater = Math.max(0, state.waterLevel - 0.2);

      let newStatus = state.missionStatus;
      let reason = null;

      if (newOxygen <= 0) { newStatus = 'failed'; reason = '❌ OXYGEN DEPLETED'; }
      else if (newPower <= 0) { newStatus = 'failed'; reason = '❌ POWER LOST'; }
      else if (newRad >= 100) { newStatus = 'failed'; reason = '❌ RADIATION FATAL'; }
      else if (newTemp <= 0) { newStatus = 'failed'; reason = '❌ HYPOTHERMIA'; }
      else if (newWater <= 0) { newStatus = 'failed'; reason = '❌ WATER DEPLETED'; }

      return {
        oxygen: newOxygen,
        power: newPower,
        temperature: newTemp,
        radiation: newRad,
        waterLevel: newWater,
        missionStatus: newStatus,
        deathReason: reason,
      };
    }),

  setWalkDirection: (dir) => set({ walkDirection: dir }),
  clearWalkDirection: () => set({ walkDirection: null }),

  // ═══════════════════════════════════════════════════════
  // ============ DISASTER ============
  // ═══════════════════════════════════════════════════════
  triggerDisaster: (type) =>
    set((state) => {
      let effects = {};
      let solarDisabled = false;

      if (type === 'sandstorm') {
        effects = {
          power: Math.max(0, state.power - 25),
          temperature: Math.max(0, state.temperature - 10),
        };
        solarDisabled = true;
      } else if (type === 'solarFlare') {
        effects = {
          radiation: Math.min(100, state.radiation + 30),
          power: Math.max(0, state.power - 15),
        };
      } else if (type === 'meteor') {
        effects = {
          oxygen: Math.max(0, state.oxygen - 15),
          power: Math.max(0, state.power - 20),
        };
      }

      return {
        ...state,
        ...effects,
        activeDisaster: type,
        disasterTimer: 10,
        solarDisabled,
      };
    }),

  clearDisaster: () =>
    set({
      activeDisaster: null,
      disasterTimer: 0,
      solarDisabled: false,
    }),

  triggerOxygenLeak: () =>
    set({ oxygenLeak: { active: true, timeLeft: 60 } }),

  fixOxygenLeak: () =>
    set((state) => {
      if (!state.hasRepairKit) return state;
      return {
        oxygenLeak: null,
        hasRepairKit: false,
        score: state.score + 300,
      };
    }),

  buyRepairKit: () =>
    set((state) => {
      if (state.budget < 500) return { ...state, quizActive: true };
      return {
        budget: state.budget - 500,
        hasRepairKit: true,
      };
    }),

  // ═══════════════════════════════════════════════════════
  // ============ ARTIFACT / CRATERS / OBJECTS ============
  // ═══════════════════════════════════════════════════════
  findAlienArtifact: () =>
    set((state) => ({
      alienArtifactFound: true,
      budget: state.budget + 2000,
      score: state.score + 500,
      discoveries: state.discoveries + 1,
      achievements: [
        ...state.achievements,
        { id: 'artifact', name: 'Artifact Hunter', icon: '👽', unlockedAt: Date.now() },
      ],
    })),

  mineIceCrater: (craterId) =>
    set((state) => {
      if (state.budget < 1000) return { ...state, quizActive: true };
      return {
        budget: state.budget - 1000,
        waterLevel: 100,
        iceCraters: state.iceCraters.map((c) =>
          c.id === craterId ? { ...c, mined: true } : c
        ),
        score: state.score + 200,
      };
    }),

  findInterestingObject: (objectId) =>
    set((state) => {
      const obj = state.interestingObjects.find((o) => o.id === objectId);
      if (!obj || obj.found) return state;

      return {
        interestingObjects: state.interestingObjects.map((o) =>
          o.id === objectId ? { ...o, found: true } : o
        ),
        budget: state.budget + obj.reward,
        score: state.score + 100,
        discoveries: state.discoveries + 1,
      };
    }),

  // ═══════════════════════════════════════════════════════
  // ============ NEXA ============
  // ═══════════════════════════════════════════════════════
  setProblem: (problem) =>
    set({
      currentProblem: problem,
      nexaTouched: false,
    }),

  touchNEXA: () => set({ nexaTouched: true }),

  resolveProblem: () =>
    set({
      currentProblem: null,
      nexaTouched: false,
    }),

  setWelcomeShown: () => set({ welcomeShown: true }),

  // ═══════════════════════════════════════════════════════
  // ============ WARNING SYSTEM ============
  // ═══════════════════════════════════════════════════════
  startWarning: (config) =>
    set((state) => {
      if (state.activeWarning) return state;
      return {
        activeWarning: {
          type: config.type,
          icon: config.icon,
          color: config.color,
          title: config.title,
          message: config.message,
          timeLeft: config.timeLeft,
          maxTime: config.maxTime,
          solution: config.solution,
          escalation: config.escalation || 0,
        },
      };
    }),

  tickWarning: () =>
    set((state) => {
      if (!state.activeWarning) return state;
      return {
        activeWarning: {
          ...state.activeWarning,
          timeLeft: state.activeWarning.timeLeft - 1,
        },
      };
    }),

  clearWarning: (success = false) =>
    set((state) => {
      const newEscalation = success ? Math.max(0, state.warningEscalation - 1) : 0;
      const newCooldowns = { ...state.alertCooldowns };
      if (state.activeWarning) {
        newCooldowns[state.activeWarning.type] = Date.now() + 5000;
      }
      return {
        activeWarning: null,
        warningEscalation: newEscalation,
        alertCooldowns: newCooldowns,
      };
    }),

  punishPlayer: (info) =>
    set((state) => ({
      activeWarning: null,
      deathInfo: info,
      activeDeath: true,
      warningEscalation: state.warningEscalation + 1,
      missionStatus: 'failed',
      deathReason: info.message,
    })),

  endDeathAnimation: () =>
    set({
      activeDeath: false,
    }),

  // ═══════════════════════════════════════════════════════
  // ============ QUIZ SYSTEM ============
  // ═══════════════════════════════════════════════════════
  setQuizActive: (active) =>
    set((state) => {
      if (active) {
        return {
          quizActive: true,
          quizSessionCount: 0,
        };
      }
      return { quizActive: false };
    }),

  setCurrentQuiz: (quiz) =>
    set((state) => {
      const newAsked = quiz
        ? [...state.askedQuestionIds, quiz.id]
        : state.askedQuestionIds;
      return {
        currentQuiz: quiz,
        askedQuestionIds: newAsked,
      };
    }),

  quizCorrect: () =>
    set((state) => {
      const newStreak = state.quizStreak + 1;
      const newSessionCount = state.quizSessionCount + 1;

      if (newSessionCount >= 2) {
        return {
          budget: state.budget + 400,
          score: state.score + 100,
          quizActive: false,
          currentQuiz: null,
          quizStreak: newStreak,
          quizSessionCount: 0,
          quizCooldown: true,
        };
      }

      return {
        budget: state.budget + 400,
        score: state.score + 100,
        quizStreak: newStreak,
        quizSessionCount: newSessionCount,
        currentQuiz: null,
      };
    }),

  quizWrong: () =>
    set((state) => {
      const newSessionCount = state.quizSessionCount + 1;

      if (newSessionCount >= 2) {
        return {
          budget: Math.max(0, state.budget - 100),
          quizStreak: 0,
          quizActive: false,
          currentQuiz: null,
          quizSessionCount: 0,
          quizCooldown: true,
        };
      }

      return {
        budget: Math.max(0, state.budget - 100),
        quizStreak: 0,
        quizSessionCount: newSessionCount,
        currentQuiz: null,
      };
    }),

  resetQuizCooldown: () =>
    set({
      quizCooldown: false,
      askedQuestionIds: [],
    }),

  // ═══════════════════════════════════════════════════════
  // ============ TOWER SYSTEM ============
  // ═══════════════════════════════════════════════════════
  discoverTower: () =>
    set((state) => {
      if (state.towerDiscovered) return state;
      return { towerDiscovered: true };
    }),

  craftTowerPart: (partId) =>
    set((state) => {
      const part = TOWER_PARTS.find((p) => p.id === partId);
      if (!part) return state;
      if (state.budget < part.cost) return state;
      if (state.towerPartsCarried.includes(partId)) return state;
      if (state.towerInstalledParts.includes(partId)) return state;

      return {
        budget: state.budget - part.cost,
        towerPartsCarried: [...state.towerPartsCarried, partId],
        score: state.score + 50,
      };
    }),

  installTowerPart: (partId) =>
    set((state) => {
      if (!state.towerPartsCarried.includes(partId)) return state;
      if (state.towerInstalledParts.includes(partId)) return state;

      const newInstalled = [...state.towerInstalledParts, partId];
      const newCarried = state.towerPartsCarried.filter((id) => id !== partId);
      const complete = newInstalled.length === TOWER_PARTS.length;

      return {
        towerInstalledParts: newInstalled,
        towerPartsCarried: newCarried,
        score: state.score + 200,
        towerCompleted: complete,
        ...(complete
          ? {
              missionStatus: 'success',
              deathReason: '🏆 SIGNAL ESTABLISHED — You connected Mars to Earth!',
            }
          : {}),
      };
    }),

  completeTowerRepair: () =>
    set((state) => ({
      towerCompleted: true,
      missionStatus: 'success',
      deathReason: '🏆 SIGNAL ESTABLISHED — You connected Mars to Earth!',
    })),

  // ═══════════════════════════════════════════════════════
  // ============ ACHIEVEMENTS ============
  // ═══════════════════════════════════════════════════════
  unlockAchievement: (id, name, icon) =>
    set((state) => {
      if (state.achievements.find((a) => a.id === id)) return state;
      return {
        achievements: [
          ...state.achievements,
          { id, name, icon, unlockedAt: Date.now() },
        ],
        score: state.score + 100,
      };
    }),

  setPlayerName: (name) => set({ playerName: name }),

  // ═══════════════════════════════════════════════════════
  // ============ RESET GAME ============
  // ═══════════════════════════════════════════════════════
  resetGame: () =>
    set({
      oxygen: 100,
      power: 100,
      temperature: 50,
      radiation: 30,
      waterLevel: 100,
      budget: 5000,
      buildings: [],
      marsLoaded: false,
      robotHasMoved: false,
      missionDay: 1,
      missionTimer: 0,
      missionStatus: 'active',
      score: 0,
      deathReason: null,
      dayPopupVisible: false,
      dayPopupNumber: 1,
      achievements: [],
      activeDisaster: null,
      disasterTimer: 0,
      solarDisabled: false,
      oxygenLeak: null,
      hasRepairKit: false,
      alienArtifactFound: false,
      alienArtifactPosition: [
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200,
      ],
      iceCraters: [
        { id: 1, position: [30, 0, 30], mined: false },
        { id: 2, position: [-40, 0, 20], mined: false },
        { id: 3, position: [25, 0, -50], mined: false },
        { id: 4, position: [-60, 0, -35], mined: false },
        { id: 5, position: [70, 0, 40], mined: false },
      ],
      interestingObjects: [
        { id: 1,  type: 'crystal',   position: [-50, 0, -40],  found: false, reward: 500, icon: '💎', name: 'Mars Crystal' },
        { id: 2,  type: 'skull',     position: [60, 0, -30],   found: false, reward: 300, icon: '💀', name: 'Ancient Fossil' },
        { id: 3,  type: 'meteor',    position: [-70, 0, 50],   found: false, reward: 400, icon: '☄️', name: 'Meteorite' },
        { id: 4,  type: 'mushroom',  position: [80, 0, 60],    found: false, reward: 200, icon: '🍄', name: 'Alien Mushroom' },
        { id: 5,  type: 'statue',    position: [40, 0, -80],   found: false, reward: 700, icon: '🗿', name: 'Alien Statue' },
        { id: 6,  type: 'plant',     position: [-100, 0, 100], found: false, reward: 250, icon: '🌱', name: 'Alien Plant' },
        { id: 7,  type: 'debris',    position: [120, 0, -60],  found: false, reward: 350, icon: '🛰️', name: 'Crashed Satellite' },
        { id: 8,  type: 'volcano',   position: [-120, 0, -90], found: false, reward: 600, icon: '🌋', name: 'Dormant Volcano' },
        { id: 9,  type: 'footprint', position: [90, 0, 110],   found: false, reward: 150, icon: '🐾', name: 'Alien Footprints' },
        { id: 10, type: 'cave',      position: [-140, 0, -30], found: false, reward: 800, icon: '🕳️', name: 'Hidden Cave' },
      ],
      currentProblem: null,
      nexaTouched: false,
      welcomeShown: false,
      walkDirection: null,
      activeWarning: null,
      warningEscalation: 0,
      alertCooldowns: {},
      deathInfo: null,
      activeDeath: false,
      _lastDamage: null,
      quizActive: false,
      currentQuiz: null,
      askedQuestionIds: [],
      quizStreak: 0,
      quizSessionCount: 0,
      quizCooldown: false,
      towerInstalledParts: [],
      towerPartsCarried: [],
      towerDiscovered: false,
      towerCompleted: false,
      playerName: '',
      discoveries: 0,
    }),
}));