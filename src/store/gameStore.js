// src/store/gameStore.js

import { create } from 'zustand';

/**
 * Project NEXUS-FRONTIER — গেমের সেন্ট্রাল স্টেট ম্যানেজার
 * ---------------------------------------------------------
 * এই store-এ চারটি কোর লাইফ-সাপোর্ট ভ্যারিয়েবল, বাজেট,
 * বিল্ডিং লিস্ট এবং গেমের স্ট্যাটাস ম্যানেজ করা হয়।
 *
 * Initial State (প্রাথমিক মান):
 *   oxygen       → 100  (বেঁচে থাকার জন্য অক্সিজেন)
 *   power        → 100  (বিদ্যুৎ সরবরাহ)
 *   temperature  → 50   (তাপমাত্রা — Mars-এ ঠান্ডা)
 *   radiation    → 30   (রেডিয়েশন লেভেল, কম ভালো)
 *   budget       → 5000 (মোট খরচের টাকা)
 *   buildings    → []   (ব্যবহারকারীর বসানো বিল্ডিংসমূহ)
 *   gameStatus   → 'playing' | 'won' | 'lost'
 */
export const useGameStore = create((set, get) => ({
  // ---------- Initial State ----------
  oxygen: 100,
  power: 100,
  temperature: 50,
  radiation: 30,
  budget: 5000,
  buildings: [],
  gameStatus: 'playing',

  // ---------- Actions ----------

  /**
   * নতুন বিল্ডিং যোগ করা।
   * ব্যবহারকারী যখন drag-drop করে বিল্ডিং বসায়, তখন এই ফাংশন কল হয়।
   *
   * @param {Object} building - { id, name, icon, cost, effects: {oxygen, power, ...} }
   */
  addBuilding: (building) => {
    const state = get();

    // বাজেট চেক — টাকা না থাকলে বিল্ডিং বসানো যাবে না
    if (state.budget < building.cost) {
      console.warn('⚠️ পর্যাপ্ত বাজেট নেই!');
      return;
    }

    // নতুন ইউনিক instance id তৈরি (একই বিল্ডিং একাধিকবার বসানো যেতে পারে)
    const instanceId = `${building.id}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // ইফেক্ট অ্যাপ্লাই করার জন্য হেল্পার
    const applyEffects = (current) => {
      const effects = building.effects || {};
      return {
        oxygen: clamp(current.oxygen + (effects.oxygen || 0), 0, 100),
        power: clamp(current.power + (effects.power || 0), 0, 100),
        temperature: clamp(current.temperature + (effects.temperature || 0), 0, 100),
        radiation: clamp(current.radiation + (effects.radiation || 0), 0, 100),
      };
    };

    set({
      buildings: [
        ...state.buildings,
        { ...building, instanceId, placedAt: Date.now() },
      ],
      budget: state.budget - building.cost,
      ...applyEffects(state),
    });
  },

  /**
   * বসানো বিল্ডিং মুছে ফেলা (undo-এর মতো)।
   * বাজেট ফেরত দেওয়া হয় এবং তার প্রভাব উল্টে দেওয়া হয়।
   *
   * @param {string} instanceId - কোন বিল্ডিং instance মুছবে
   */
  removeBuilding: (instanceId) => {
    const state = get();
    const target = state.buildings.find((b) => b.instanceId === instanceId);
    if (!target) return;

    // ইফেক্ট উল্টে দেওয়া
    const effects = target.effects || {};
    const revertEffects = (current) => ({
      oxygen: clamp(current.oxygen - (effects.oxygen || 0), 0, 100),
      power: clamp(current.power - (effects.power || 0), 0, 100),
      temperature: clamp(current.temperature - (effects.temperature || 0), 0, 100),
      radiation: clamp(current.radiation - (effects.radiation || 0), 0, 100),
    });

    set({
      buildings: state.buildings.filter((b) => b.instanceId !== instanceId),
      budget: state.budget + target.cost,
      ...revertEffects(state),
    });
  },

  /**
   * পুরো গেম রিসেট করে আবার নতুন করে শুরু করা।
   */
  resetGame: () => {
    set({
      oxygen: 100,
      power: 100,
      temperature: 50,
      radiation: 30,
      budget: 5000,
      buildings: [],
      gameStatus: 'playing',
    });
  },

  /**
   * সিমুলেশন চালানো — ব্যবহারকারীর সব বিল্ডিং বসানো শেষে।
   *
   * পাসিং ক্রাইটেরিয়া:
   *   oxygen       >= 50
   *   power        >= 50
   *   temperature  >= 30
   *   radiation    <= 50
   *
   * সফল হলে gameStatus = 'won', নাহলে 'lost'
   */
  runSimulation: () => {
    const { oxygen, power, temperature, radiation } = get();

    const passed =
      oxygen >= 50 &&
      power >= 50 &&
      temperature >= 30 &&
      radiation <= 50;

    set({ gameStatus: passed ? 'won' : 'lost' });

    return {
      passed,
      metrics: { oxygen, power, temperature, radiation },
      // কোন কোন প্যারামিটার ফেল করলো সেটা রিপোর্ট
      failures: {
        oxygen: oxygen < 50,
        power: power < 50,
        temperature: temperature < 30,
        radiation: radiation > 50,
      },
    };
  },
}));

/**
 * সংখ্যাকে min এবং max-এর মধ্যে বেঁধে রাখার হেল্পার।
 * যেমন: oxygen 100-এর বেশি হতে পারবে না, 0-এর কমও না।
 */
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}