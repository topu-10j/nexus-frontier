// src/components/HUD.jsx
// HUD — ৪টা কোর লাইফ-সাপোর্ট ভ্যারিয়েবল দেখায়

import { useGameStore } from '../store/gameStore';
import { motion } from 'framer-motion';

export default function HUD() {
  const oxygen = useGameStore((s) => s.oxygen);
  const power = useGameStore((s) => s.power);
  const temperature = useGameStore((s) => s.temperature);
  const radiation = useGameStore((s) => s.radiation);
  const budget = useGameStore((s) => s.budget);

  // প্রতিটা বার-এর জন্য কম্পোনেন্ট
  const Bar = ({ icon, label, value, color, critical }) => (
    <div className="flex items-center gap-2">
      <span className="text-lg">{icon}</span>
      <div>
        <div className="flex justify-between text-xs text-gray-300 mb-0.5">
          <span>{label}</span>
          <span>{Math.round(value)}%</span>
        </div>
        <div className="w-24 h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${color}`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
      {critical && (
        <motion.span
          className="text-red-500 text-xs font-bold"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          ⚠
        </motion.span>
      )}
    </div>
  );

  return (
    <div className="absolute top-3 left-3 right-3 z-50 flex justify-between items-start gap-3">
      {/* বাম পাশে — ৪টা কোর */}
      <div className="bg-black/70 backdrop-blur-md rounded-xl p-3 flex flex-wrap gap-4 border border-cyan-500/30">
        <Bar
          icon="🫁"
          label="Oxygen"
          value={oxygen}
          color="bg-blue-500"
          critical={oxygen < 20}
        />
        <Bar
          icon="⚡"
          label="Power"
          value={power}
          color="bg-yellow-500"
          critical={power < 20}
        />
        <Bar
          icon="🌡️"
          label="Temp"
          value={temperature}
          color="bg-red-500"
          critical={temperature < 20}
        />
        <Bar
          icon="☢️"
          label="Radiation"
          value={radiation}
          color="bg-purple-500"
          critical={radiation > 70}
        />
      </div>

      {/* ডান পাশে — budget */}
      <div className="bg-black/70 backdrop-blur-md rounded-xl px-4 py-3 border border-yellow-500/30">
        <span className="text-yellow-400 font-bold text-lg">
          💰 ${budget}
        </span>
      </div>
    </div>
  );
}