import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

export default function MissionBar() {
  const { missionDay, maxDays, score, missionStatus, nextDay } = useGameStore();

  useEffect(() => {
    if (missionStatus !== 'active') return;
    const timer = setInterval(() => nextDay(), 90000);
    return () => clearInterval(timer);
  }, [missionStatus, nextDay]);

  const progress = (missionDay / maxDays) * 100;

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
      <div className="bg-black/70 backdrop-blur-lg px-5 py-2.5 rounded-2xl border-2 border-cyan-500/40 shadow-2xl flex items-center gap-5">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          <div>
            <p className="text-cyan-300 text-[9px] font-bold tracking-wider">MISSION</p>
            <p className="text-white text-sm font-black">
              Day {Math.min(missionDay, maxDays)} / {maxDays}
            </p>
          </div>
        </div>

        <div className="w-28 h-2 bg-gray-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          <div>
            <p className="text-yellow-300 text-[9px] font-bold tracking-wider">SCORE</p>
            <p className="text-white text-sm font-black">{score}</p>
          </div>
        </div>

        {missionStatus === 'active' && (
          <span className="text-cyan-400 text-[10px] font-bold px-2 py-1 bg-cyan-500/20 rounded-full border border-cyan-400/40 animate-pulse">
            ● ACTIVE
          </span>
        )}
        {missionStatus === 'success' && (
          <span className="text-green-400 text-[10px] font-bold px-2 py-1 bg-green-500/20 rounded-full border border-green-400/40">
            ✅ SUCCESS
          </span>
        )}
        {missionStatus === 'failed' && (
          <span className="text-red-400 text-[10px] font-bold px-2 py-1 bg-red-500/20 rounded-full border border-red-400/40">
            ❌ FAILED
          </span>
        )}
      </div>
    </div>
  );
}