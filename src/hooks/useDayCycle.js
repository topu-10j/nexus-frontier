// src/hooks/useDayCycle.js
import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { playSound } from '../audio/soundManager';

const DAY_DURATION = 7 * 60;

export const useDayCycle = () => {
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const s = useGameStore.getState();

      // 🛑 MASTER GATES — must ALL pass
      if (!s.marsLoaded) return;
      if (!s.robotHasMoved) return;       // ⬅️ THIS IS THE KEY GATE
      if (s.missionStatus !== 'active') return;
      if (s.quizActive) return;
      if (s.activeDeath) return;

      const newTimer = s.missionTimer + 1;
      const currentDay = Math.floor(newTimer / DAY_DURATION) + 1;

      if (currentDay > s.missionDay) {
        playSound('victory');
        useGameStore.setState({
          missionTimer: newTimer,
          missionDay: currentDay,
          dayPopupVisible: true,
          dayPopupNumber: currentDay,
        });
        setTimeout(() => {
          useGameStore.setState({ dayPopupVisible: false });
        }, 4000);
      } else {
        useGameStore.setState({ missionTimer: newTimer });
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return null;
};

export const DAY_DURATION_SECONDS = DAY_DURATION;
export const DAY_DURATION_MINUTES = 7;

export default useDayCycle;