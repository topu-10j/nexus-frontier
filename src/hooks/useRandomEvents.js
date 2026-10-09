// src/hooks/useRandomEvents.js
// Triggers random disasters at intervals to keep the game exciting
import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

const MIN_INTERVAL = 18;
const MAX_INTERVAL = 32;
const FIRST_DELAY = 12;

export const useRandomEvents = () => {
  const timeoutRef = useRef(null);

  useEffect(() => {
    const scheduleNext = (delaySec) => {
      timeoutRef.current = setTimeout(() => {
        const s = useGameStore.getState();

        if (s.missionStatus !== 'active') {
          scheduleNext(10);
          return;
        }

        if (s.activeDisaster || s.activeWarning || s.oxygenLeak) {
          scheduleNext(8);
          return;
        }

        const roll = Math.random();

        if (roll < 0.4) {
          s.triggerDisaster('sandstorm');
        } else if (roll < 0.65) {
          s.triggerDisaster('meteor');
        } else if (roll < 0.85) {
          s.triggerDisaster('solarFlare');
        } else {
          s.triggerOxygenLeak();
        }

        const nextDelay =
          MIN_INTERVAL + Math.random() * (MAX_INTERVAL - MIN_INTERVAL);
        scheduleNext(nextDelay);
      }, delaySec * 1000);
    };

    scheduleNext(FIRST_DELAY);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);
};

export default useRandomEvents;