// src/components/DayPopup.jsx
// Day transition popup — shows when new Mars sol starts
import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

export default function DayPopup() {
  const visible = useGameStore((s) => s.dayPopupVisible);
  const dayNum = useGameStore((s) => s.dayPopupNumber);
  const hideDayPopup = useGameStore((s) => s.hideDayPopup);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      hideDayPopup();
    }, 4000);
    return () => clearTimeout(timer);
  }, [visible, hideDayPopup]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center pointer-events-none">
      <div className="animate-day-popup bg-gradient-to-br from-cyan-500/95 via-blue-600/95 to-purple-700/95 
                      backdrop-blur-lg rounded-3xl px-12 py-8 shadow-2xl border-4 border-cyan-300
                      text-center">
        <div className="text-6xl mb-3 animate-bounce">🌅</div>
        <p className="text-white text-xs font-black tracking-[0.3em] mb-2 opacity-80">
          MARS SOL
        </p>
        <h1 className="text-5xl font-black text-white mb-2 tracking-wider drop-shadow-lg">
          DAY {dayNum}
        </h1>
        <p className="text-cyan-100 text-sm font-bold">
          ☀️ Sunrise on Mars • Keep going, Captain!
        </p>
      </div>

      <style>{`
        @keyframes day-popup {
          0% {
            opacity: 0;
            transform: scale(0.5) translateY(-40px);
          }
          60% {
            opacity: 1;
            transform: scale(1.05) translateY(0);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-day-popup {
          animation: day-popup 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
}