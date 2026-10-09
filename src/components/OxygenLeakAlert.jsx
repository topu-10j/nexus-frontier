import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { playSound } from '../audio/soundManager';

export default function OxygenLeakAlert() {
  const oxygenLeak = useGameStore((s) => s.oxygenLeak);
  const hasRepairKit = useGameStore((s) => s.hasRepairKit);
  const buyRepairKit = useGameStore((s) => s.buyRepairKit);
  const fixOxygenLeak = useGameStore((s) => s.fixOxygenLeak);
  const tickOxygenLeak = useGameStore((s) => s.tickOxygenLeak);

  // Random oxygen leak every 45-60 seconds
  useEffect(() => {
    if (oxygenLeak) return;
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        useGameStore.getState().triggerOxygenLeak();
        playSound('hazard');
      }
    }, 45000);
    return () => clearInterval(interval);
  }, [oxygenLeak]);

  // Countdown
  useEffect(() => {
    if (!oxygenLeak) return;
    const timer = setInterval(() => tickOxygenLeak(), 1000);
    return () => clearInterval(timer);
  }, [oxygenLeak, tickOxygenLeak]);

  if (!oxygenLeak) return null;

  return (
    <div className="absolute top-44 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
      <div className="bg-gradient-to-r from-red-600 to-orange-600 px-6 py-4 rounded-2xl border-4 border-red-400 shadow-2xl max-w-md animate-pulse">
        <div className="flex items-center gap-3">
          <span className="text-4xl">💨</span>
          <div className="flex-1">
            <h3 className="text-white text-sm font-black tracking-wider">
              OXYGEN LEAK DETECTED!
            </h3>
            <p className="text-white/90 text-xs mt-0.5">
              Buy Repair Kit ({hasRepairKit ? 'Owned' : '$500'}) & Fix leak!
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-white font-mono text-lg font-black">
                ⏱️ {oxygenLeak.timeLeft}s
              </span>
              <div className="flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white"
                  style={{ width: `${(oxygenLeak.timeLeft / 60) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons — these need pointer-events-auto */}
        <div className="mt-3 flex gap-2 pointer-events-auto">
          {!hasRepairKit && (
            <button
              onClick={() => { playSound('click'); buyRepairKit(); }}
              className="flex-1 py-2 bg-white text-red-700 font-black rounded-xl text-xs hover:scale-105 transition-all"
            >
              🛠️ BUY REPAIR KIT ($500)
            </button>
          )}
          {hasRepairKit && (
            <button
              onClick={() => { playSound('victory'); fixOxygenLeak(); }}
              className="flex-1 py-2 bg-green-500 text-white font-black rounded-xl text-xs hover:scale-105 transition-all"
            >
              🔧 FIX LEAK NOW
            </button>
          )}
        </div>
      </div>
    </div>
  );
}