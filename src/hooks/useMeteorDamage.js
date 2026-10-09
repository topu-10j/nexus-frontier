// src/hooks/useMeteorDamage.js
import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

export const useMeteorDamage = () => {
  const damageBuilding = useGameStore((s) => s.damageBuilding);

  useEffect(() => {
    const interval = setInterval(() => {
      const s = useGameStore.getState();

      // 🛑 MASTER GATES
      if (!s.marsLoaded) return;
      if (!s.robotHasMoved) return;
      if (s.missionStatus !== 'active') return;
      if (s.quizActive) return;
      if (s.activeDeath) return;
      if (s.activeDisaster !== 'meteor') return;

      const hasShield = s.buildings.some((b) => b.id === 'shield');
      if (hasShield) return;

      if (!s.buildings || s.buildings.length === 0) return;

      if (Math.random() < 0.3) {
        const target = s.buildings[Math.floor(Math.random() * s.buildings.length)];
        if (target?.instanceId) {
          damageBuilding(target.instanceId, 34);
        }
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [damageBuilding]);
};

export default useMeteorDamage;