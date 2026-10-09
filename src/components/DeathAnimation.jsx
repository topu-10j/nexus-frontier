// src/components/DeathAnimation.jsx
// Dramatic robot death sequence — type-specific animations
import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { getDeathConfig } from '../data/alertData';
import { playSound } from '../audio/soundManager';

export default function DeathAnimation() {
  const activeDeath = useGameStore((s) => s.activeDeath);
  const deathInfo = useGameStore((s) => s.deathInfo);
  const endDeathAnimation = useGameStore((s) => s.endDeathAnimation);

  const [phase, setPhase] = useState('idle');
  const [shakeClass, setShakeClass] = useState('');

  useEffect(() => {
    if (!activeDeath || !deathInfo) return;

    // Play hazard sound
    playSound('hazard');

    // Phase 1: Alert flash (0-0.5s)
    setPhase('flash');

    // Phase 2: Main death animation (0.5s - 2.5s)
    const t1 = setTimeout(() => {
      setPhase('dying');
      setShakeClass('death-shake');
    }, 500);

    // Phase 3: Black fade + message (2.5s)
    const t2 = setTimeout(() => {
      setPhase('gameover');
      setShakeClass('');
    }, 2500);

    // Phase 4: Trigger end — MissionResult will show
    const t3 = setTimeout(() => {
      endDeathAnimation();
    }, 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [activeDeath, deathInfo, endDeathAnimation]);

  if (!activeDeath || !deathInfo) return null;

  const config = getDeathConfig(deathInfo.deathType);
  const deathColor = config.particleColor || '#FF4500';
  const deathEmoji = getDeathEmoji(deathInfo.deathType);
  const deathTitle = getDeathTitle(deathInfo.deathType);

  return (
    <>
      {/* ═══════════ FULL SCREEN OVERLAY ═══════════ */}
      <div
        className={`fixed inset-0 z-[100] pointer-events-none transition-all duration-1000
          ${phase === 'flash' ? 'bg-white/40' : ''}
          ${phase === 'dying' ? 'bg-red-900/40' : ''}
          ${phase === 'gameover' ? 'bg-black/95' : ''}
        `}
        style={{
          boxShadow: phase === 'dying'
            ? `inset 0 0 200px 60px ${deathColor}66`
            : 'none',
        }}
      />

      {/* ═══════════ PARTICLE EFFECTS ═══════════ */}
      {phase === 'dying' && (
        <div className="fixed inset-0 z-[101] pointer-events-none overflow-hidden">
          {/* Particles burst from center */}
          {[...Array(30)].map((_, i) => {
            const angle = (i / 30) * Math.PI * 2;
            const distance = 200 + Math.random() * 300;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            const size = 6 + Math.random() * 12;

            return (
              <div
                key={i}
                className="absolute rounded-full animate-death-particle"
                style={{
                  left: '50%',
                  top: '50%',
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: deathColor,
                  boxShadow: `0 0 20px 5px ${deathColor}`,
                  '--tx': `${x}px`,
                  '--ty': `${y}px`,
                  animationDelay: `${Math.random() * 0.3}s`,
                }}
              />
            );
          })}

          {/* Screen flash pulses */}
          {[...Array(3)].map((_, i) => (
            <div
              key={`flash-${i}`}
              className="absolute inset-0 animate-death-flash"
              style={{
                backgroundColor: deathColor,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* ═══════════ DEATH MESSAGE ═══════════ */}
      {(phase === 'dying' || phase === 'gameover') && (
        <div
          className={`fixed inset-0 z-[102] flex items-center justify-center pointer-events-none
            ${phase === 'gameover' ? 'animate-fade-in' : 'opacity-0 animate-death-title'}`}
        >
          <div
            className={`text-center px-6 max-w-2xl transition-all duration-700
              ${shakeClass}`}
          >
            {/* Big death emoji */}
            <div
              className="text-8xl md:text-9xl mb-4 animate-death-emoji"
              style={{ filter: `drop-shadow(0 0 40px ${deathColor})` }}
            >
              {deathEmoji}
            </div>

            {/* Title */}
            <h1
              className="text-3xl md:text-5xl font-black text-white mb-4 tracking-wider drop-shadow-lg"
              style={{ textShadow: `0 0 30px ${deathColor}` }}
            >
              {deathTitle}
            </h1>

            {/* Death message */}
            <p className="text-lg md:text-2xl text-white/90 font-bold mb-6 max-w-lg mx-auto">
              {deathInfo.message}
            </p>

            {/* Game over badge */}
            {phase === 'gameover' && (
              <div className="inline-block animate-pulse">
                <span className="inline-flex items-center gap-2 bg-red-600 text-white text-sm font-black px-5 py-2 rounded-full shadow-2xl border-2 border-red-400">
                  <span>💀</span>
                  <span>MISSION FAILED</span>
                </span>
              </div>
            )}

            {/* Small hint */}
            {phase === 'gameover' && (
              <p className="text-white/50 text-xs mt-6 animate-pulse">
                Loading mission report...
              </p>
            )}
          </div>
        </div>
      )}

      {/* ═══════════ INJECTED CSS ANIMATIONS ═══════════ */}
      <style>{`
        @keyframes death-particle {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0);
            opacity: 0;
          }
        }
        .animate-death-particle {
          animation: death-particle 1.8s ease-out forwards;
        }

        @keyframes death-flash {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.3; }
        }
        .animate-death-flash {
          animation: death-flash 0.6s ease-in-out;
        }

        @keyframes death-shake {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-8px, 4px); }
          20% { transform: translate(8px, -4px); }
          30% { transform: translate(-6px, -3px); }
          40% { transform: translate(6px, 3px); }
          50% { transform: translate(-4px, 2px); }
          60% { transform: translate(4px, -2px); }
          70% { transform: translate(-2px, 1px); }
          80% { transform: translate(2px, -1px); }
          90% { transform: translate(-1px, 0); }
        }
        .death-shake {
          animation: death-shake 0.5s ease-in-out 3;
        }

        @keyframes death-title {
          0% { opacity: 0; transform: scale(0.5); }
          60% { opacity: 0; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-death-title {
          animation: death-title 1.5s ease-out forwards;
        }

        @keyframes death-emoji {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.2) rotate(-5deg); }
          75% { transform: scale(1.2) rotate(5deg); }
        }
        .animate-death-emoji {
          animation: death-emoji 1s ease-in-out infinite;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-in;
        }
      `}</style>
    </>
  );
}

// ═══════════════════════════════════════════════════════
// HELPERS — Death type → emoji + title
// ═══════════════════════════════════════════════════════
function getDeathEmoji(deathType) {
  const map = {
    blownAway: '🌪️',
    explode: '☄️',
    melt: '☀️',
    suffocate: '🫧',
    freeze: '❄️',
    dissolve: '☢️',
    dehydrate: '💧',
    shutdown: '⚡',
  };
  return map[deathType] || '💀';
}

function getDeathTitle(deathType) {
  const map = {
    blownAway: 'BLOWN AWAY',
    explode: 'STRUCK BY METEOR',
    melt: 'VAPORIZED',
    suffocate: 'OUT OF OXYGEN',
    freeze: 'FROZEN SOLID',
    dissolve: 'RADIATION FATAL',
    dehydrate: 'DEHYDRATED',
    shutdown: 'SYSTEM SHUTDOWN',
  };
  return map[deathType] || 'MISSION FAILED';
}