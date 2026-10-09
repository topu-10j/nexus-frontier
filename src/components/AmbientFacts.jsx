// src/components/AmbientFacts.jsx
// Educational watermark — rotates facts during calm moments
import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import {
  getRandomFact,
  FACT_ROTATION_INTERVAL,
} from '../data/ambientFacts';

export default function AmbientFacts() {
  const [currentFact, setCurrentFact] = useState('');
  const [fadeIn, setFadeIn] = useState(false);

  const activeDisaster = useGameStore((s) => s.activeDisaster);
  const activeWarning = useGameStore((s) => s.activeWarning);
  const quizActive = useGameStore((s) => s.quizActive);
  const missionStatus = useGameStore((s) => s.missionStatus);
  const activeDeath = useGameStore((s) => s.activeDeath);

  // Pause if any disruptive event is happening
  const paused =
    activeDisaster || activeWarning || quizActive || activeDeath ||
    missionStatus !== 'active';

  // ═══════════════════════════════════════════════════════
  // ROTATION LOGIC
  // ═══════════════════════════════════════════════════════
  useEffect(() => {
    // Don't rotate while paused
    if (paused) return;

    // Initial fact
    if (!currentFact) {
      setCurrentFact(getRandomFact());
      setTimeout(() => setFadeIn(true), 100);
      return;
    }

    const interval = setInterval(() => {
      // Fade out
      setFadeIn(false);

      // After fade, swap fact
      setTimeout(() => {
        setCurrentFact(getRandomFact(currentFact));
        setFadeIn(true);
      }, 500);
    }, FACT_ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, [currentFact, paused]);

  // ═══════════════════════════════════════════════════════
  // HIDDEN while paused
  // ═══════════════════════════════════════════════════════
  if (paused || !currentFact) return null;

  return (
    <div
      className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
      style={{ maxWidth: '520px' }}
    >
      <div
        className={`text-center transition-all duration-500
          ${fadeIn ? 'opacity-40 scale-100' : 'opacity-0 scale-95'}`}
      >
        <p
          className="text-white text-xs md:text-sm font-medium tracking-wide italic"
          style={{
            textShadow: '0 0 10px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.9)',
            letterSpacing: '0.02em',
          }}
        >
          <span className="text-cyan-300 font-bold mr-1.5">💡</span>
          {currentFact}
        </p>
      </div>
    </div>
  );
}