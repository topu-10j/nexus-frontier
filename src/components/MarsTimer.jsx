import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

export default function MarsTimer() {
  const missionTimer = useGameStore((s) => s.missionTimer);
  const missionDay = useGameStore((s) => s.missionDay);
  const missionStatus = useGameStore((s) => s.missionStatus);
  const tickMissionTimer = useGameStore((s) => s.tickMissionTimer);
  const checkCritical = useGameStore((s) => s.checkCritical);

  // Timer countdown every second
  useEffect(() => {
    if (missionStatus !== 'active') return;
    const interval = setInterval(() => {
      tickMissionTimer();
      checkCritical();
    }, 1000);
    return () => clearInterval(interval);
  }, [missionStatus, tickMissionTimer, checkCritical]);

  const minutes = Math.floor(missionTimer / 60);
  const seconds = missionTimer % 60;
  const progress = (missionTimer / 180) * 100;

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
      <div className="bg-black/70 backdrop-blur-lg px-6 py-2 rounded-2xl border-2 border-orange-500/60 shadow-2xl">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-orange-300 text-[8px] font-bold tracking-wider">MISSION TIMER</p>
            <p className="text-white text-xl font-black font-mono">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </p>
          </div>

          <div className="w-24 h-1.5 bg-gray-900 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                progress > 50
                  ? 'bg-gradient-to-r from-green-400 to-cyan-400'
                  : progress > 20
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-400'
                  : 'bg-gradient-to-r from-red-500 to-red-700'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="text-center">
            <p className="text-cyan-300 text-[8px] font-bold tracking-wider">DAY</p>
            <p className="text-white text-sm font-black">{missionDay}/3</p>
          </div>
        </div>
      </div>
    </div>
  );
}