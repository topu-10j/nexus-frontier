import { useEffect, useRef } from 'react';
import { sounds } from '../audio/soundManager';

export default function BackgroundMusic({ started }) {
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!started) return;
    if (hasStarted.current) return;

    hasStarted.current = true;

    try {
      sounds.drone.volume(0.25);
      sounds.drone.play();
    } catch (e) {
      console.warn('Background music failed:', e);
    }

    return () => {
      try {
        sounds.drone.stop();
      } catch (e) {}
    };
  }, [started]);

  return null;
}