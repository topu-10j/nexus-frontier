// src/components/TowerTracker.jsx
// On-screen tower direction indicator — distance bar
// 3D arrow is in a separate file: TowerArrow.jsx
import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { TOWER_POSITION } from '../data/towerData';

export default function TowerTracker({ robotPositionRef }) {
  const [distance, setDistance] = useState(0);
  const [angle, setAngle] = useState(0);
  const [visible, setVisible] = useState(false);

  const towerCompleted = useGameStore((s) => s.towerCompleted);
  const missionStatus = useGameStore((s) => s.missionStatus);
  const marsLoaded = useGameStore((s) => s.marsLoaded);
  const robotHasMoved = useGameStore((s) => s.robotHasMoved);

  useEffect(() => {
    if (!marsLoaded || !robotHasMoved || towerCompleted || missionStatus !== 'active') {
      setVisible(false);
      return;
    }

    let raf;

    const tick = () => {
      if (!robotPositionRef?.current) {
        raf = requestAnimationFrame(tick);
        return;
      }

      const rx = robotPositionRef.current.x;
      const rz = robotPositionRef.current.z;

      const dx = TOWER_POSITION[0] - rx;
      const dz = TOWER_POSITION[2] - rz;
      const dist = Math.sqrt(dx * dx + dz * dz);

      setDistance(Math.round(dist));
      setVisible(dist > 15);

      const worldAngle = Math.atan2(dx, -dz);
      setAngle((worldAngle * 180) / Math.PI);

      raf = requestAnimationFrame(tick);
    };

    tick();
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [robotPositionRef, towerCompleted, missionStatus, marsLoaded, robotHasMoved]);

  if (!visible) return null;

  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
      <div className="bg-black/70 backdrop-blur-md rounded-2xl px-5 py-2 border-2 border-cyan-400/60 flex items-center gap-3 shadow-2xl">
        <div className="text-2xl animate-pulse">📡</div>
        <div className="flex flex-col">
          <span className="text-cyan-300 text-[9px] font-black tracking-widest">
            TOWER SIGNAL
          </span>
          <span className="text-white text-sm font-bold">
            {distance}m away
          </span>
        </div>
        <div
          className="text-2xl filter drop-shadow-lg transition-transform"
          style={{ transform: `rotate(${angle}deg)` }}
        >
          ⬆️
        </div>
      </div>
    </div>
  );
}