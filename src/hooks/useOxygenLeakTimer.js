// src/hooks/useOxygenLeakTimer.js
// Handles oxygen leak countdown + auto-fail
import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

export const useOxygenLeakTimer = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      const s = useGameStore.getState();
      if (!s.oxygenLeak || !s.oxygenLeak.active) return;

      const newTime = s.oxygenLeak.timeLeft - 1;

      if (newTime <= 0) {
        useGameStore.setState({
          oxygenLeak: null,
          missionStatus: 'failed',
          deathReason: '❌ OXYGEN LEAK TIMEOUT',
        });
      } else {
        useGameStore.setState({
          oxygenLeak: { ...s.oxygenLeak, timeLeft: newTime },
          oxygen: Math.max(0, s.oxygen - 0.5),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);
};

export default useOxygenLeakTimer;