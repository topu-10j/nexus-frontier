// src/hooks/useDisasterTimer.js
// Handles disaster countdown + auto-clear
import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

export const useDisasterTimer = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      const s = useGameStore.getState();
      if (!s.activeDisaster) return;

      const newTimer = s.disasterTimer - 1;

      if (newTimer <= 0) {
        useGameStore.setState({
          activeDisaster: null,
          disasterTimer: 0,
          solarDisabled: false,
        });
      } else {
        useGameStore.setState({ disasterTimer: newTimer });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);
};

export default useDisasterTimer;