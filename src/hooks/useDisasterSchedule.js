// src/hooks/useDisasterSchedule.js
import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import {
  getDisasterAtIndex,
  DISASTER_EFFECTS,
  DISASTER_DURATION,
  SCHEDULE_LENGTH,
} from '../data/disasterSchedule';

export const useDisasterSchedule = () => {
  const timeoutRef = useRef(null);
  const scheduleIndexRef = useRef(0);

  useEffect(() => {
    const scheduleNext = (delaySec) => {
      timeoutRef.current = setTimeout(() => {
        const s = useGameStore.getState();

        // 🛑 MASTER GATES — must ALL pass
        if (!s.marsLoaded) {
          scheduleNext(2);
          return;
        }

        // 🔑 CRITICAL: robot না নাড়লে কিছু trigger হবে না
        if (!s.robotHasMoved) {
          scheduleNext(2);
          return;
        }

        if (s.missionStatus !== 'active') {
          scheduleNext(5);
          return;
        }

        if (
          s.quizActive ||
          s.activeDisaster ||
          s.activeWarning ||
          s.oxygenLeak ||
          s.activeDeath
        ) {
          scheduleNext(5);
          return;
        }

        // ✅ All gates passed — fire disaster
        const disaster = getDisasterAtIndex(scheduleIndexRef.current);
        triggerScheduledDisaster(disaster);

        scheduleIndexRef.current =
          (scheduleIndexRef.current + 1) % SCHEDULE_LENGTH;

        const nextDisaster = getDisasterAtIndex(scheduleIndexRef.current);
        scheduleNext(nextDisaster.delay);
      }, delaySec * 1000);
    };

    scheduleNext(30);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);
};

const triggerScheduledDisaster = (disaster) => {
  const s = useGameStore.getState();
  const effects = DISASTER_EFFECTS[disaster.type];
  if (!effects) return;

  const deltas = effects.effects(disaster.damage);

  const newOxygen = Math.max(0, s.oxygen + (deltas.oxygen || 0));
  const newPower = Math.max(0, s.power + (deltas.power || 0));
  const newTemp = Math.max(0, s.temperature + (deltas.temperature || 0));
  const newRad = Math.min(100, s.radiation + (deltas.radiation || 0));
  const newWater = Math.max(0, s.waterLevel + (deltas.water || 0));

  let newStatus = s.missionStatus;
  let reason = null;
  let deathInfo = null;

  if (newOxygen <= 0) {
    newStatus = 'failed';
    reason = '❌ OXYGEN DEPLETED';
    deathInfo = { type: disaster.type, deathType: 'suffocate', message: reason };
  } else if (newPower <= 0) {
    newStatus = 'failed';
    reason = '❌ POWER LOST';
    deathInfo = { type: disaster.type, deathType: 'shutdown', message: reason };
  } else if (newRad >= 100) {
    newStatus = 'failed';
    reason = '❌ RADIATION FATAL';
    deathInfo = { type: disaster.type, deathType: 'dissolve', message: reason };
  } else if (newTemp <= 0) {
    newStatus = 'failed';
    reason = '❌ HYPOTHERMIA';
    deathInfo = { type: disaster.type, deathType: 'freeze', message: reason };
  } else if (newWater <= 0) {
    newStatus = 'failed';
    reason = '❌ WATER DEPLETED';
    deathInfo = { type: disaster.type, deathType: 'dehydrate', message: reason };
  }

  useGameStore.setState({
    oxygen: newOxygen,
    power: newPower,
    temperature: newTemp,
    radiation: newRad,
    waterLevel: newWater,
    activeDisaster: disaster.type,
    disasterTimer: DISASTER_DURATION,
    solarDisabled: disaster.type === 'sandstorm',
    ...(newStatus === 'failed'
      ? {
          missionStatus: 'failed',
          deathReason: reason,
          deathInfo,
          activeDeath: true,
        }
      : {}),
  });
};

export default useDisasterSchedule;