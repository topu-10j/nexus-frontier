// src/components/HUD.jsx
// In-game HUD — resources + day + parts inventory + tower progress
import { useGameStore } from '../store/gameStore';
import { TOWER_PARTS, getRepairProgress } from '../data/towerData';

function Bar({ icon, label, value, color, warning }) {
  const percent = Math.max(0, Math.min(100, value));

  return (
    <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur px-2.5 py-1.5 rounded-lg border border-white/10 min-w-[150px]">
      <span className="text-base">{icon}</span>
      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between">
          <span className="text-white text-[9px] font-bold tracking-wide opacity-90">
            {label}
          </span>
          <span className={`text-[9px] font-bold ${warning ? 'text-red-400 animate-pulse' : 'text-gray-300'}`}>
            {Math.round(percent)}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden mt-0.5">
          <div
            className={`h-full transition-all duration-300 ${color}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function HUD() {
  const {
    oxygen, power, temperature, radiation, waterLevel, budget,
    missionDay,
    towerInstalledParts,
    towerPartsCarried,
  } = useGameStore();

  // Tower progress
  const towerProgress = getRepairProgress(towerInstalledParts || []);
  const partsInstalled = towerInstalledParts?.length || 0;
  const partsTotal = TOWER_PARTS.length;

  return (
    <>
      {/* ═══════════ LEFT: 5 RESOURCE BARS ═══════════ */}
      <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
        <Bar icon="🫁" label="OXYGEN" value={oxygen} color="bg-blue-500" warning={oxygen < 30} />
        <Bar icon="⚡" label="POWER" value={power} color="bg-yellow-500" warning={power < 30} />
        <Bar icon="🌡️" label="TEMP" value={temperature} color="bg-red-500" warning={temperature < 30} />
        <Bar icon="☢️" label="RADIATION" value={radiation} color="bg-purple-500" warning={radiation > 70} />
        <Bar icon="💧" label="WATER" value={waterLevel} color="bg-cyan-500" warning={waterLevel < 30} />
      </div>

      {/* ═══════════ TOP RIGHT: DAY + BUDGET + TOWER ═══════════ */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 z-20 items-end">
        {/* DAY */}
        <div className="bg-black/50 backdrop-blur px-3 py-2 rounded-lg border border-orange-500/40">
          <p className="text-orange-300 text-[9px] font-bold tracking-wider flex items-center gap-1">
            🌅 MARS SOL
          </p>
          <p className="text-white text-lg font-black leading-tight">
            Day {missionDay}
          </p>
        </div>

        {/* BUDGET */}
        <div className="bg-black/50 backdrop-blur px-3 py-2 rounded-lg border border-yellow-500/30">
          <p className="text-yellow-300 text-[9px] font-bold tracking-wider">💰 BUDGET</p>
          <p className="text-white text-base font-bold">${budget}</p>
        </div>

        {/* 🆕 TOWER PROGRESS */}
        <div className="bg-black/50 backdrop-blur px-3 py-2 rounded-lg border border-cyan-500/40 min-w-[180px]">
          <div className="flex items-center justify-between mb-1">
            <p className="text-cyan-300 text-[9px] font-bold tracking-wider">
              📡 TOWER REPAIR
            </p>
            <p className="text-white text-xs font-black">{towerProgress}%</p>
          </div>
          <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                towerProgress === 100
                  ? 'bg-green-500'
                  : towerProgress >= 66
                  ? 'bg-yellow-500'
                  : towerProgress >= 33
                  ? 'bg-orange-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${towerProgress}%` }}
            />
          </div>
          <p className="text-white/60 text-[9px] mt-1 font-bold">
            Parts: {partsInstalled}/{partsTotal}
            {towerPartsCarried?.length > 0 && (
              <span className="text-yellow-300 ml-1">
                • Carrying: {towerPartsCarried.length}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* ═══════════ BOTTOM LEFT: PARTS INVENTORY ═══════════ */}
      {towerPartsCarried?.length > 0 && (
        <div className="absolute top-44 left-3 z-20">
          <div className="bg-black/60 backdrop-blur px-3 py-2 rounded-lg border-2 border-yellow-500/50">
            <p className="text-yellow-300 text-[9px] font-black tracking-wider mb-1">
              🎒 CARRYING
            </p>
            {towerPartsCarried.map((partId) => {
              const part = TOWER_PARTS.find((p) => p.id === partId);
              if (!part) return null;
              return (
                <div key={partId} className="flex items-center gap-2 py-0.5">
                  <span className="text-lg">{part.icon}</span>
                  <span className="text-white text-[10px] font-bold">
                    {part.name}
                  </span>
                </div>
              );
            })}
            <p className="text-cyan-300 text-[8px] mt-1 italic">
              Walk to tower to install
            </p>
          </div>
        </div>
      )}

      {/* ═══════════ INSTALLED PARTS INDICATOR ═══════════ */}
      {towerInstalledParts?.length > 0 && (
        <div className="absolute top-44 right-3 z-20 flex flex-col gap-1">
          {TOWER_PARTS.map((part) => {
            const installed = towerInstalledParts.includes(part.id);
            const carried = towerPartsCarried?.includes(part.id);
            return (
              <div
                key={part.id}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border backdrop-blur text-[9px] font-bold
                  ${
                    installed
                      ? 'bg-green-500/20 border-green-400/50 text-green-200'
                      : carried
                      ? 'bg-yellow-500/20 border-yellow-400/50 text-yellow-200'
                      : 'bg-black/40 border-white/10 text-white/40'
                  }`}
              >
                <span>{part.icon}</span>
                <span>{part.name}</span>
                {installed && <span className="text-green-300">✓</span>}
                {carried && !installed && <span className="text-yellow-300">🎒</span>}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}