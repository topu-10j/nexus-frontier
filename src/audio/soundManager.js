import { Howl } from 'howler';

export const sounds = {
  hover: new Howl({ src: ['/sounds/hover.mp3'], volume: 0.4, preload: true }),
  click: new Howl({ src: ['/sounds/click.mp3'], volume: 0.5, preload: true }),
  rocketLaunch: new Howl({ src: ['/sounds/rocket-launch.mp3'], volume: 0.6, preload: true }),
  hazard: new Howl({ src: ['/sounds/hazard.mp3'], volume: 0.5, preload: true }),
  victory: new Howl({ src: ['/sounds/victory.mp3'], volume: 0.7, preload: true }),
  drone: new Howl({ src: ['/sounds/drone.mp3'], volume: 0.3, loop: true, preload: true }),
  nexa: new Howl({ src: ['/sounds/nexa.mp3'], volume: 0.6, preload: true }),
};

export const playSound = (name) => {
  try {
    if (sounds[name]) sounds[name].play();
  } catch (e) {
    console.warn('Sound not found:', name);
  }
};