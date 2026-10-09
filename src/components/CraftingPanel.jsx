// src/components/CraftingPanel.jsx
// Crafting panel — craft tower parts when near base
import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { playSound } from '../audio/soundManager';
import {
  TOWER_PARTS,
  getNextPart,
  getRepairProgress,
} from '../data/towerData';

export default function CraftingPanel({ robotPositionRef }) {
  const [nearBase, setNearBase] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const budget = useGameStore((s) => s.budget);
  const towerPartsCarried = useGameStore((s) => s.towerPartsCarried) || [];
  const towerInstalledParts = useGameStore((s) => s.towerInstalledParts) || [];
  const craftTowerPart = useGameStore((s) => s.craftTowerPart);
  const robotHasMoved = useGameStore((s) => s.robotHasMoved);
  const marsLoaded = useGameStore((s) => s.marsLoaded);
  const towerCompleted = useGameStore((s) => s.towerCompleted);

  // Check proximity to base (0,0,0)
  const checkBase = () => {
    if (!robotPositionRef?.current) return;
    const dx = robotPositionRef.current.x;
    const dz = robotPositionRef.current.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    setNearBase(dist < 15);
  };

  // Poll every 500ms
  useState(() => {
    const interval = setInterval(checkBase, 500);
    return () => clearInterval(interval);
  });

  // Hide conditions
  if (!marsLoaded || !robotHasMoved || towerCompleted) return null;
  if (!nearBase) return null;

  const nextPart = getNextPart(towerInstalledParts);
  const progress = getRepairProgress(towerInstalledParts);

  // All parts done?
  if (!nextPart) return null;

  const canAfford = budget >= nextPart.cost;
  const isCarrying = towerPartsCarried.includes(nextPart.id);
  const alreadyInstalled = towerInstalledParts.includes(nextPart.id);

  const handleCraft = () => {
    if (!canAfford || isCarrying || alreadyInstalled) return;
    playSound('click');
    craftTowerPart(nextPart.id);
  };

  return (
    <div className="absolute left-4 top-24 z-40 select-none">
      {/* ═══════════ HEADER (always visible near base) ═══════════ */}
      <button
        onClick={() => {
          playSound('click');
          setExpanded((e) => !e);
        }}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl 
                    bg-gradient-to-r from-cyan-500/90 to-blue-600/90 
                    backdrop-blur border-2 border-cyan-300/60 shadow-2xl
                    hover:scale-105 active:scale-95 transition-all cursor-pointer`}
      >
        <span className="text-2xl">🔧</span>
        <div className="flex flex-col items-start">
          <span className="text-white text-[10px] font-black tracking-widest">
            CRAFT PARTS
          </span>
          <span className="text-cyan-100 text-xs font-bold">
            {progress}% • {towerInstalledParts.length}/3
          </span>
        </div>
        <span className="text-white text-lg ml-1">
          {expanded ? '▾' : '▸'}
        </span>
      </button>

      {/* ═══════════ PANEL (expanded) ═══════════ */}
      {expanded && (
        <div className="mt-2 w-72 bg-black/85 backdrop-blur-lg rounded-2xl p-4 border-2 border-cyan-400/60 shadow-2xl">
          <p className="text-cyan-300 text-[10px] font-black tracking-widest mb-3 text-center">
            🚀 CRAFT TOWER PARTS
          </p>

          {/* Parts list */}
          <div className="flex flex-col gap-2">
            {TOWER_PARTS.map((part) => {
              const installed = towerInstalledParts.includes(part.id);
              const carried = towerPartsCarried.includes(part.id);
              const isNext = nextPart.id === part.id;
              const affordable = budget >= part.cost;

              return (
                <div
                  key={part.id}
                  className={`flex items-center gap-3 p-2 rounded-xl border-2 transition-all
                    ${
                      installed
                        ? 'bg-green-500/20 border-green-400/60'
                        : carried
                        ? 'bg-yellow-500/20 border-yellow-400/60'
                        : isNext
                        ? 'bg-cyan-500/20 border-cyan-400/60'
                        : 'bg-white/5 border-white/10 opacity-50'
                    }`}
                >
                  {/* Icon */}
                  <div className="text-2xl">{part.icon}</div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-bold">{part.name}</p>
                    <p className="text-[10px] text-white/60">${part.cost}</p>
                  </div>

                  {/* Status / button */}
                  {installed ? (
                    <span className="text-green-300 text-xs font-black">✓</span>
                  ) : carried ? (
                    <span className="text-yellow-300 text-[10px] font-black">🎒</span>
                  ) : isNext ? (
                    <button
                      onClick={handleCraft}
                      disabled={!affordable}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wider 
                                  transition-all shadow-lg
                                  ${
                                    affordable
                                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:scale-105 active:scale-95 cursor-pointer'
                                      : 'bg-gray-700 text-white/40 cursor-not-allowed'
                                  }`}
                    >
                      {affordable ? 'CRAFT' : 'NO $$$'}
                    </button>
                  ) : (
                    <span className="text-white/30 text-[9px]">🔒</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Hint */}
          <p className="text-cyan-300 text-[10px] text-center mt-3 italic">
            {towerPartsCarried.length > 0
              ? '🎒 Walk to tower to install'
              : '💰 Earn money via Quiz to craft'}
          </p>
        </div>
      )}
    </div>
  );
}