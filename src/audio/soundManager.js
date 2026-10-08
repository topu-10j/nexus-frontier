import { Howl } from 'howler';

// ============ SOUND LIBRARY ============
export const sounds = {
  // UI sounds
  hover: new Howl({
    src: ['/sounds/hover.mp3'],
    volume: 0.4,
    preload: true,
  }),

  click: new Howl({
    src: ['/sounds/click.mp3'],
    volume: 0.5,
    preload: true,
  }),

  // Rocket
  rocketLaunch: new Howl({
    src: ['/sounds/rocket-launch.mp3'],
    volume: 0.6,
    preload: true,
  }),

  // Warning / danger
  hazard: new Howl({
    src: ['/sounds/hazard.mp3'],
    volume: 0.5,
    preload: true,
  }),

  // Victory
  victory: new Howl({
    src: ['/sounds/victory.mp3'],
    volume: 0.7,
    preload: true,
  }),

  // Background music (looped)
  drone: new Howl({
    src: ['/sounds/drone.mp3'],
    volume: 0.25,
    loop: true,
    preload: true,
    html5: true, // Stream large file (7 MB)
  }),

  // NEXA AI voice
  nexa: new Howl({
    src: ['/sounds/nexa.mp3'],
    volume: 0.6,
    preload: true,
  }),
};

// ============ HELPER FUNCTIONS ============

/**
 * Play a sound by name
 * @param {string} name - sound key (hover, click, rocketLaunch, etc.)
 */
export const playSound = (name) => {
  try {
    if (sounds[name]) {
      sounds[name].play();
    } else {
      console.warn('Sound not found:', name);
    }
  } catch (e) {
    console.warn('Sound error:', e);
  }
};

/**
 * Play background music (drone)
 */
export const playBackgroundMusic = () => {
  try {
    if (!sounds.drone.playing()) {
      sounds.drone.play();
    }
  } catch (e) {
    console.warn('Background music error:', e);
  }
};

/**
 * Stop background music
 */
export const stopBackgroundMusic = () => {
  try {
    sounds.drone.stop();
  } catch (e) {
    console.warn('Stop music error:', e);
  }
};

/**
 * Lower music volume temporarily (for important sounds)
 */
export const duckMusic = (duckVolume = 0.1, duration = 1000) => {
  try {
    const originalVolume = sounds.drone.volume();
    sounds.drone.fade(originalVolume, duckVolume, 200);

    setTimeout(() => {
      sounds.drone.fade(duckVolume, originalVolume, 300);
    }, duration);
  } catch (e) {
    console.warn('Duck music error:', e);
  }
};