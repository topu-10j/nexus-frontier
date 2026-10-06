// src/components/ResultScreen.jsx
// ResultScreen — Win/Lose স্ক্রিন

import { useGameStore } from '../store/gameStore';
import { motion } from 'framer-motion';
import Certificate from './Certificate';

export default function ResultScreen() {
  const gameStatus = useGameStore((s) => s.gameStatus);
  const resetGame = useGameStore((s) => s.resetGame);
  const oxygen = useGameStore((s) => s.oxygen);
  const power = useGameStore((s) => s.power);
  const temperature = useGameStore((s) => s.temperature);
  const radiation = useGameStore((s) => s.radiation);
  const buildings = useGameStore((s) => s.buildings);
  const budget = useGameStore((s) => s.budget);

  const isWin = gameStatus === 'won';

  // Fail হলে কারণ বের করবো
  const getFailReasons = () => {
    const reasons = [];
    if (oxygen < 50) reasons.push('Oxygen insufficient');
    if (power < 50) reasons.push('Power insufficient');
    if (temperature < 30) reasons.push('Temperature too low');
    if (radiation > 50) reasons.push('Radiation too high');
    return reasons;
  };

  if (isWin) {
    return <Certificate />;
  }

  // Lose Screen
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-50 bg-red-950/95 backdrop-blur-md
                 flex items-center justify-center"
    >
      <motion.div
        animate={{ x: [0, -10, 10, -10, 10, 0] }}
        transition={{ duration: 0.5 }}
        className="text-center p-8 max-w-md"
      >
        <h1 className="text-5xl font-bold text-red-500 mb-4">
          MISSION FAILED
        </h1>
        <p className="text-gray-300 mb-6">
          Colony on Mars could not survive.
        </p>

        <div className="bg-black/50 rounded-lg p-4 mb-6 text-left">
          <h3 className="text-red-400 font-bold mb-2">Reasons:</h3>
          <ul className="text-gray-300 text-sm space-y-1">
            {getFailReasons().map((reason, i) => (
              <li key={i}>❌ {reason}</li>
            ))}
          </ul>
        </div>

        <div className="text-gray-400 text-sm mb-6">
          Buildings: {buildings.length} | Budget left: ${budget}
        </div>

        <button
          onClick={resetGame}
          className="px-8 py-3 bg-red-600 hover:bg-red-500
                     text-white font-bold rounded-full
                     transition-all"
        >
          🔄 RETRY MISSION
        </button>
      </motion.div>
    </motion.div>
  );
}