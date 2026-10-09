// src/hooks/useAlertPunishment.js
import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { getAlertConfig } from '../data/alertData';
import { playSound } from '../audio/soundManager';

export const useAlertPunishment = () => {
  const lastProcessedRef = useRef('');

  useEffect(() => {
    const interval = setInterval(() => {
      const s = useGameStore.getState();

      // MASTER GATES
      if (!s.marsLoaded) return;
      if (!s.robotHasMoved) return;
      if (s.missionStatus !== 'active') return;
      if (s.quizActive) return;
      if (s.activeDeath) return;

      // ═══════════════════════════════════════════════════
      // WARNING ACTIVE — check if player fixed it
      // ═══════════════════════════════════════════════════
      if (s.activeWarning) {
        const type = s.activeWarning.type;
        let fixed = false;

        // 🛡️ MAGNETIC SHIELD protects from these
        const hasShield = s.buildings.some((b) => b.id === 'shield');

        if (type === 'SANDSTORM') {
          // Fixed if: no disaster active OR has shield
          if (!s.activeDisaster || hasShield) fixed = true;
        } else if (type === 'METEOR') {
          if (!s.activeDisaster || hasShield) fixed = true;
        } else if (type === 'SOLAR_FLARE') {
          // Fixed if radiation back to safe OR has shield
          if (s.radiation <= 60 || hasShield) fixed = true;
        } else if (type === 'OXYGEN_LOW') {
          if (s.oxygen >= 40) fixed = true;
        } else if (type === 'POWER_LOW') {
          if (s.power >= 40) fixed = true;
        } else if (type === 'TEMP_LOW') {
          if (s.temperature >= 40) fixed = true;
        } else if (type === 'RADIATION_HIGH') {
          if (s.radiation <= 60) fixed = true;
        } else if (type === 'WATER_LOW') {
          if (s.waterLevel >= 40) fixed = true;
        } else if (type === 'OXYGEN_LEAK') {
          if (!s.oxygenLeak) fixed = true;
        }

        if (fixed) {
          s.clearWarning(true);
          lastProcessedRef.current = '';
          playSound('victory');
          return;
        }

        // Countdown
        const newTime = s.activeWarning.timeLeft - 1;
        if (newTime <= 0) {
          const config = getAlertConfig(type);
          if (config) {
            playSound('hazard');
            s.punishPlayer({
              type,
              deathType: config.deathType,
              message: config.deathMessage,
            });
          }
          return;
        }
        s.tickWarning();
        return;
      }

      // ═══════════════════════════════════════════════════
      // NO WARNING — detect new critical
      // ═══════════════════════════════════════════════════
      const critical = detectCritical(s);

      if (critical && critical !== lastProcessedRef.current) {
        lastProcessedRef.current = critical;
        triggerWarning(critical);
      } else if (!critical) {
        lastProcessedRef.current = '';
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const detectCritical = (s) => {
    const hasShield = s.buildings.some((b) => b.id === 'shield');

    // If shield is built, sandstorm/meteor/solarFlare are NOT critical
    if (s.activeDisaster === 'meteor' && !hasShield) return 'METEOR';
    if (s.activeDisaster === 'sandstorm' && !hasShield) return 'SANDSTORM';
    if (s.activeDisaster === 'solarFlare' && !hasShield) return 'SOLAR_FLARE';

    // Oxygen leak always critical
    if (s.oxygenLeak && s.oxygenLeak.active) return 'OXYGEN_LEAK';

    // Resource critical
    if (s.oxygen < 30) return 'OXYGEN_LOW';
    if (s.power < 30) return 'POWER_LOW';
    if (s.temperature < 30) return 'TEMP_LOW';
    if (s.radiation > 70) return 'RADIATION_HIGH';
    if (s.waterLevel < 30) return 'WATER_LOW';

    return null;
  };

  const triggerWarning = (type) => {
    const config = getAlertConfig(type);
    if (!config) return;

    const s = useGameStore.getState();
    const escalationLevel = s.warningEscalation || 0;

    playSound('nexa');

    s.startWarning({
      type,
      icon: config.icon,
      color: config.color,
      title: config.title,
      message: config.nexaMessage,
      timeLeft: config.timer,
      maxTime: config.timer,
      solution: config.solution,
      escalation: escalationLevel,
    });
  };

  return null;
};

export default useAlertPunishment;