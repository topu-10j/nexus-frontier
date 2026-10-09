import { useGameStore } from '../store/gameStore';
import { playSound } from '../audio/soundManager';

export default function MissionResult({ onRestart }) {
  const {
    missionStatus,
    score,
    buildings,
    achievements,
    deathReason,
    flagPlanted,
  } = useGameStore();

  if (missionStatus === 'active') return null;

  const isSuccess = missionStatus === 'success';

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
      <div
        className={`max-w-lg w-full mx-4 rounded-3xl p-8 border-4 
                   ${
                     isSuccess
                       ? 'bg-gradient-to-br from-green-600 via-emerald-600 to-green-800 border-green-400'
                       : 'bg-gradient-to-br from-red-700 via-rose-800 to-black border-red-500'
                   }
                   shadow-2xl text-center`}
        style={{ animation: 'slideUp 0.6s ease-out' }}
      >
        {/* Icon */}
        <div className="text-8xl mb-4 animate-bounce">
          {isSuccess ? '🏆' : '💀'}
        </div>

        {/* Title */}
        <h1 className="text-4xl font-black text-white mb-3 tracking-wider">
          {isSuccess ? 'MISSION SUCCESS!' : 'YOU ARE TERMINATED'}
        </h1>

        {/* Subtitle */}
        {isSuccess ? (
          <p className="text-white/90 text-base mb-6">
            🎉 You planted your flag on Mars! 🇧🇩
          </p>
        ) : (
          <div className="mb-6">
            <p className="text-white/90 text-base mb-2">
              ❌ Mission failed — you did not survive.
            </p>
            {deathReason && (
              <p className="text-red-300 text-sm font-bold bg-black/40 px-4 py-2 rounded-lg inline-block">
                {deathReason}
              </p>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="bg-black/40 rounded-2xl p-5 mb-6 space-y-3">
          <Stat
            label="Score"
            value={score}
            icon="⭐"
            highlight
          />
          <Stat
            label="Buildings Built"
            value={buildings.length}
            icon="🏗️"
          />
          <Stat
            label="Achievements"
            value={achievements.length}
            icon="🏅"
          />
          <Stat
            label={isSuccess ? 'Flag Planted' : 'Summit Reached'}
            value={
              isSuccess
                ? 'YES 🇧🇩'
                : flagPlanted
                ? 'Not planted'
                : 'Not reached'
            }
            icon="🚩"
          />
        </div>

        {/* Try Again Button */}
        <button
          onClick={() => { playSound('click'); onRestart(); }}
          className={`w-full py-4 font-black rounded-2xl text-lg 
                     hover:scale-105 active:scale-95 transition-all
                     shadow-2xl ${
                       isSuccess
                         ? 'bg-white text-green-700 hover:bg-gray-100'
                         : 'bg-white text-red-700 hover:bg-gray-100'
                     }`}
        >
          🔄 TRY AGAIN
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value, icon, highlight }) {
  return (
    <div className="flex items-center justify-between px-3">
      <span className="text-white/80 text-sm flex items-center gap-2">
        <span className="text-base">{icon}</span>
        {label}
      </span>
      <span
        className={`font-black ${
          highlight ? 'text-yellow-300 text-2xl' : 'text-white text-lg'
        }`}
      >
        {value}
      </span>
    </div>
  );
}