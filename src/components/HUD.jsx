import { useGameStore } from '../store/gameStore';

function Bar({ icon, label, value, color, warning }) {
  const percent = Math.max(0, Math.min(100, value));

  return (
    <div className={`bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-xl border-2 ${warning ? 'border-red-500 animate-pulse' : 'border-white/10'} min-w-[180px] shadow-xl`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-white text-xs font-bold tracking-wide">{label}</span>
            <span className={`text-sm font-black ${warning ? 'text-red-400' : 'text-white'}`}>
              {Math.round(percent)}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${color}`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HUD() {
  const { oxygen, power, temperature, radiation, budget } = useGameStore();

  return (
    <>
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
        <Bar icon="🫁" label="OXYGEN" value={oxygen} color="bg-gradient-to-r from-blue-500 to-cyan-400" warning={oxygen < 30} />
        <Bar icon="⚡" label="POWER" value={power} color="bg-gradient-to-r from-yellow-500 to-amber-400" warning={power < 30} />
        <Bar icon="🌡️" label="TEMPERATURE" value={temperature} color="bg-gradient-to-r from-red-500 to-orange-400" warning={temperature < 20} />
        <Bar icon="☢️" label="RADIATION" value={radiation} color="bg-gradient-to-r from-purple-500 to-pink-400" warning={radiation > 70} />
      </div>

      <div className="absolute top-4 right-4 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-md px-5 py-3 rounded-xl border-2 border-yellow-500/50 z-20 shadow-xl">
        <p className="text-yellow-300 text-[10px] font-bold tracking-wider mb-1">
          💰 BUDGET
        </p>
        <p className="text-white text-2xl font-black">${budget}</p>
      </div>
    </>
  );
}