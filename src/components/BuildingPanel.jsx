// src/components/BuildingPanel.jsx
// BuildingPanel — ৬টা বিল্ডিং drag-drop এর জন্য

import { buildings } from '../data/buildings';
import { useGameStore } from '../store/gameStore';
import { motion } from 'framer-motion';

export default function BuildingPanel() {
  const budget = useGameStore((s) => s.budget);
  const addBuilding = useGameStore((s) => s.addBuilding);

  // Drag শুরু হলে বিল্ডিং ডেটা পাঠাবো
  const handleDragStart = (e, building) => {
    e.dataTransfer.setData('building', JSON.stringify(building));
  };

  // Click করলে বিল্ডিং যোগ হবে (drag এর বিকল্প)
  const handleClick = (building) => {
    if (budget >= building.cost) {
      addBuilding({
        ...building,
        position: [
          Math.random() * 8 - 4,
          0,
          Math.random() * 8 - 4,
        ],
      });
    }
  };

  return (
    <div className="absolute right-3 top-24 bottom-3 w-56 z-50 overflow-y-auto
                    bg-black/70 backdrop-blur-md rounded-xl p-3
                    border border-cyan-500/30">
      <h3 className="text-cyan-400 font-bold mb-3 text-center text-sm">
        🏗️ BUILDINGS
      </h3>

      <div className="space-y-2">
        {buildings.map((building) => {
          const canAfford = budget >= building.cost;

          // effect থাকলে দেখাবো, না থাকলে খালি
          const effectEntries = building.effect
            ? Object.entries(building.effect)
            : [];

          return (
            <motion.div
              key={building.id}
              draggable={canAfford}
              onDragStart={(e) => handleDragStart(e, building)}
              onClick={() => canAfford && handleClick(building)}
              whileHover={{ scale: canAfford ? 1.03 : 1 }}
              className={`p-2 rounded-lg border cursor-pointer transition-all ${
                canAfford
                  ? 'bg-gray-800/80 border-cyan-500/40 hover:border-cyan-400'
                  : 'bg-gray-900/50 border-gray-700 opacity-40 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{building.icon}</span>
                <div className="flex-1">
                  <div className="text-white text-xs font-semibold">
                    {building.name}
                  </div>
                  <div className="text-yellow-400 text-xs">
                    ${building.cost}
                  </div>
                </div>
              </div>

              {/* Effect summary — safety check সহ */}
              {effectEntries.length > 0 && (
                <div className="text-[10px] text-gray-400 mt-1">
                  {effectEntries.map(([key, val]) => (
                    <span key={key} className="mr-2">
                      {key}: {val > 0 ? '+' : ''}{val}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <p className="text-[10px] text-gray-500 mt-3 text-center">
        Drag or click to place
      </p>
    </div>
  );
}