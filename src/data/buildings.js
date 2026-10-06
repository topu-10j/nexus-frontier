// src/data/buildings.js

/**
 * Project NEXUS-FRONTIER — বিল্ডিং ডেটা
 * ------------------------------------
 * মঙ্গলগ্রহে বেঁচে থাকার জন্য ৬টি কোর বিল্ডিং।
 * প্রতিটি বিল্ডিংয়ের একটি `effects` অবজেক্ট আছে যা
 * gameStore-এ addBuilding() কল করলে প্লেয়ারের
 * লাইফ-সাপোর্ট ভ্যারিয়েবলে প্রয়োগ হয়।
 *
 * নোট:
 *  - ধনাত্মক (+) মান = রিসোর্স বাড়ে
 *  - ঋণাত্মক (−) মান = রিসোর্স কমে (power খরচ)
 *  - food এবং water আপাতত সেকেন্ডারি রিসোর্স (HUD-এর ৪টি কোরের বাইরে)
 */

export const buildings = [
  {
    id: 'oxygen',
    name: 'Oxygen Generator',
    icon: '🫧',
    cost: 800,
    description: 'মঙ্গলের বাতাস থেকে অক্সিজেন তৈরি করে।',
    effects: {
      oxygen: +30,   // অক্সিজেন উৎপাদন
      power: -20,    // বিদ্যুৎ খরচ
    },
  },
  {
    id: 'power',
    name: 'Power Grid',
    icon: '🔋',
    cost: 600,
    description: 'সোলার প্যানেল ও ব্যাটারি স্টোরেজ — সব বিল্ডিংয়ের বিদ্যুৎ সরবরাহ।',
    effects: {
      power: +50,    // বিদ্যুৎ উৎপাদন
    },
  },
  {
    id: 'thermal',
    name: 'Thermal Regulator',
    icon: '🌡️',
    cost: 700,
    description: 'তাপমাত্রা নিয়ন্ত্রণ করে — মঙ্গলের হিমাঙ্ক থেকে রক্ষা।',
    effects: {
      temperature: +25, // তাপমাত্রা বাড়ায়
      power: -15,       // বিদ্যুৎ খরচ
    },
  },
  {
    id: 'shield',
    name: 'Magnetic Shield',
    icon: '🛡️',
    cost: 900,
    description: 'সৌর বিকিরণ (radiation) থেকে কলোনি রক্ষা করে।',
    effects: {
      radiation: -30,  // রেডিয়েশন কমায় (কম = ভালো)
      power: -25,      // বিদ্যুৎ খরচ
    },
  },
  {
    id: 'bio',
    name: 'Bio-Dome',
    icon: '🌱',
    cost: 1200,
    description: 'নিয়ন্ত্রিত পরিবেশে খাদ্য উৎপাদন — দীর্ঘমেয়াদি মিশনের জন্য জরুরি।',
    effects: {
      power: -15,    // বিদ্যুৎ খরচ
      food: +40,     // খাদ্য উৎপাদন
    },
  },
  {
    id: 'water',
    name: 'Water Extractor',
    icon: '💧',
    cost: 800,
    description: 'মঙ্গলের মাটির বরফ থেকে পানি আহরণ করে।',
    effects: {
      power: -20,   // বিদ্যুৎ খরচ
      water: +40,   // পানি উৎপাদন
    },
  },
];

/**
 * দ্রুত আইডি দিয়ে বিল্ডিং খুঁজে বের করার হেল্পার।
 * যেমন: getBuildingById('oxygen') → Oxygen Generator অবজেক্ট
 */
export const getBuildingById = (id) =>
  buildings.find((b) => b.id === id);

/**
 * UI-তে দ্রুত গ্রিড/কার্ড রেন্ডারের জন্য বিল্ডিং ক্যাটাগরি।
 * (ভবিষ্যতে ফিল্টার করার জন্য ব্যবহার করা যাবে)
 */
export const buildingCategories = {
  lifeSupport: ['oxygen', 'thermal', 'shield'],
  infrastructure: ['power'],
  resources: ['bio', 'water'],
};