import { useState } from 'react';
import { buildings } from '../data/buildings';
import { useGameStore } from '../store/gameStore';
import { playSound } from '../audio/soundManager';

const buildingDesc = {
  oxygen: 'Generates breathable oxygen',
  power: 'Produces colony electricity',
  thermal: 'Controls temperature',
  shield: 'Protects from radiation',
  bio: 'Grows food supply',
  water: 'Extracts water from soil',
};

export default function BuildingPanel() {
  const { budget, addBuilding } = useGameStore();
  const [selected, setSelected] = useState(null);

  const handleSelect = (building) => {
    if (budget < building.cost) {
      playSound('hazard');
      alert(`❌ Not enough budget! Need $${building.cost}`);
      return;
    }
    playSound('click');
    setSelected(building);

    const position = [
      (Math.random() - 0.5) * 10,
      -0.4,
      (Math.random() - 0.5) * 10,
    ];

    addBuilding(building, position);
    setTimeout(() => setSelected(null), 500);
  };

  return (
    <div className="absolute bottom-4 right-4 z-20">
      <div className="bg-black/70 backdrop-blur-lg border-2 border-cyan-500/30 rounded-2xl p-3 w-64 shadow-2xl">
        <p className="text-cyan-300 text-xs font-bold tracking-wider text-center mb-3">
          🏗️ BUILD STRUCTURES
        </p>

        <div className="flex flex-col gap-2">
          {buildings.map((b) => {
            const canAfford = budget >= b.cost;
            return (
              <button
                key={b.id}
                onClick={() => handleSelect(b)}
                disabled={!canAfford}
                onMouseEnter={() => canAfford && playSound('hover')}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 transition-all text-left
                  ${
                    canAfford
                      ? 'bg-white/5 hover:bg-cyan-500/20 border-cyan-500/30 hover:border-cyan-400 cursor-pointer hover:scale-[1.02]'
                      : 'bg-gray-900/50 border-gray-800 opacity-40 cursor-not-allowed'
                  }
                  ${selected?.id === b.id ? 'ring-2 ring-cyan-400' : ''}
                `}
              >
                <span className="text-2xl">{b.icon}</span>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-white text-xs font-bold">{b.name}</span>
                  <span className="text-white/50 text-[9px] truncate">{buildingDesc[b.id]}</span>
                </div>
                <span className={`text-sm font-bold ${canAfford ? 'text-yellow-300' : 'text-red-400'}`}>
                  ${b.cost}
                </span>
              </button>
            );
          })}
        </div>

        <p className="text-white/40 text-[9px] text-center mt-3">
          Click to place building
        </p>
      </div>
    </div>
  );
}