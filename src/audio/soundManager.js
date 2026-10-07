// src/audio/soundManager.js
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Project NEXUS-FRONTIER — Sound Manager
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { Howl, Howler } from 'howler';

// ─────────────────────────────────────────────────────────
// ১. Sound Definitions
// ─────────────────────────────────────────────────────────

// hover — UI-তে mouse hover করলে বাজবে
const hover = new Howl({
  src: ['/sounds/hover.mp3'],
  volume: 0.2,
  preload: true,
});

// click — বাটন ক্লিক করলে বাজবে
const click = new Howl({
  src: ['/sounds/click.mp3'],
  volume: 0.5,
  preload: true,
});

// rocketLaunch — রকেট লঞ্চের সময় বাজবে
const rocketLaunch = new Howl({
  src: ['/sounds/rocket-launch.mp3'],
  volume: 0.9,
  preload: true,
});

// nexa — NEXA AI popup আসার সময়
const nexa = new Howl({
  src: ['/sounds/nexa.mp3'],
  volume: 0.6,
  preload: true,
});

// victory — গেম জেতার সময়
const victory = new Howl({
  src: ['/sounds/victory.mp3'],
  volume: 0.8,
  preload: true,
});

// hazard — বিপদ signal
const hazard = new Howl({
  src: ['/sounds/hazard.mp3'],
  volume: 0.85,
  preload: true,
});

// drone — background ambient music (loop)
const drone = new Howl({
  src: ['/sounds/drone.mp3'],
  volume: 0.3,
  loop: true,
  preload: true,
  html5: true,
});

// ─────────────────────────────────────────────────────────
// ২. Grouped Export
// ─────────────────────────────────────────────────────────

export const sounds = {
  hover,
  click,
  rocketLaunch,
  nexa,
  victory,
  hazard,
  drone,
};

// ─────────────────────────────────────────────────────────
// ৩. stopAllSounds() — সব non-drone সাউন্ড বন্ধ করবে
// ─────────────────────────────────────────────────────────

export function stopAllSounds() {
  const nonDroneSounds = [
    hover,
    click,
    rocketLaunch,
    nexa,
    victory,
    hazard,
  ];

  nonDroneSounds.forEach((sound) => {
    if (sound.playing()) {
      sound.stop();
    }
  });
}

// ─────────────────────────────────────────────────────────
// ৪. Safe Play Wrappers
// প্রতিটা non-drone সাউন্ড বাজানোর আগে আগেরগুলো stop করবে
// ─────────────────────────────────────────────────────────

export function playHover() {
  stopAllSounds();
  hover.play();
}

export function playClick() {
  stopAllSounds();
  click.play();
}

export function playRocketLaunch() {
  stopAllSounds();
  rocketLaunch.play();
}

export function playNexa() {
  stopAllSounds();
  nexa.play();
}

export function playVictory() {
  stopAllSounds();
  victory.play();
}

// ─────────────────────────────────────────────────────────
// ৫. Helper Functions — Drone Control
// ─────────────────────────────────────────────────────────

export function startDrone() {
  if (!drone.playing()) {
    drone.volume(0.3);
    drone.play();
  }
}

export function stopDrone(fadeMs = 1500) {
  if (drone.playing()) {
    drone.fade(drone.volume(), 0, fadeMs);
    setTimeout(() => drone.stop(), fadeMs);
  }
}

export function setMasterVolume(vol) {
  Howler.volume(vol);
}

// ─────────────────────────────────────────────────────────
// ৬. playHazard() — special function
// Drone কে fade out করে hazard সাউন্ড বাজাবে,
// তারপর hazard শেষ হলে drone আবার fade in করবে
// ─────────────────────────────────────────────────────────

export function playHazard() {
  const FADE_MS = 800;

  if (drone.playing()) {
    drone.fade(drone.volume(), 0, FADE_MS);
  }

  setTimeout(() => {
    drone.pause();
    hazard.play();

    hazard.once('end', () => {
      drone.volume(0);
      drone.play();
      drone.fade(0, 0.3, FADE_MS);
    });
  }, FADE_MS);
}

// ─────────────────────────────────────────────────────────
// ৭. Cleanup helper
// ─────────────────────────────────────────────────────────

export function unloadAllSounds() {
  Object.values(sounds).forEach((s) => s.unload());
}