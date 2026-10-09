// src/components/QuizButton.jsx
// Floating round Quiz button — LEFT side of screen
import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { playSound } from '../audio/soundManager';

export default function QuizButton() {
  const setQuizActive = useGameStore((s) => s.setQuizActive);
  const quizActive = useGameStore((s) => s.quizActive);
  const activeDisaster = useGameStore((s) => s.activeDisaster);
  const activeWarning = useGameStore((s) => s.activeWarning);
  const missionStatus = useGameStore((s) => s.missionStatus);
  const activeDeath = useGameStore((s) => s.activeDeath);
  const budget = useGameStore((s) => s.budget);

  const [hovered, setHovered] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((p) => !p);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Hide during disruptions
  const hidden =
    quizActive || activeDisaster || activeWarning || activeDeath ||
    missionStatus !== 'active';

  if (hidden) return null;

  const handleClick = () => {
    playSound('click');
    setQuizActive(true);
  };

  const lowBudget = budget < 1000;

  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-40">
      <button
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`relative group flex flex-col items-center gap-2
          transition-all duration-300
          ${hovered ? 'scale-110' : 'scale-100'}
          cursor-pointer`}
      >
        {/* ROUND BUTTON */}
        <div
          className={`relative w-20 h-20 rounded-full flex items-center justify-center 
            border-4 shadow-2xl transition-all duration-300
            ${
              lowBudget
                ? 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 border-yellow-300'
                : 'bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 border-cyan-300'
            }
            ${hovered ? 'shadow-[0_0_40px_rgba(255,215,0,0.8)]' : ''}`}
        >
          <span className="text-4xl filter drop-shadow-lg">🧠</span>

          {/* Money badge */}
          <div
            className={`absolute -top-1 -right-1 px-2 py-0.5 rounded-full 
              text-[10px] font-black border-2 border-white shadow-lg
              ${lowBudget ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
          >
            +$400
          </div>

          {/* Pulse ring */}
          {pulse && lowBudget && (
            <span className="absolute inset-0 rounded-full border-4 border-yellow-400 animate-ping" />
          )}
        </div>

        {/* LABEL */}
        <span
          className="text-white text-[10px] font-black tracking-wider
            bg-black/70 backdrop-blur px-2 py-0.5 rounded-full border border-white/30"
        >
          {lowBudget ? '⚠️ EARN' : 'QUIZ'}
        </span>
      </button>
    </div>
  );
}