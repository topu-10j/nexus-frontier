// src/components/VictoryScreen.jsx
// Tower repair victory — signal established with Earth
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { playSound } from '../audio/soundManager';
import { TOWER_VICTORY, TOWER_PARTS } from '../data/towerData';

export default function VictoryScreen({ onShowCertificate, onRestart }) {
  const {
    score,
    missionDay,
    playerName,
    discoveries,
    buildings,
    alienArtifactFound,
    interestingObjects,
    achievements,
    towerInstalledParts,
  } = useGameStore();

  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    playSound('victory');
    const t = setTimeout(() => setShowStats(true), 1400);
    return () => clearTimeout(t);
  }, []);

  const objectsFound = interestingObjects?.filter((o) => o.found).length || 0;
  const partsInstalled = towerInstalledParts?.length || 0;

  return (
    <div className="fixed inset-0 z-[80] overflow-hidden">
      {/* ═══════════ BACKGROUND ═══════════ */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900" />

      {/* ═══════════ STARS ═══════════ */}
      <div className="absolute inset-0 opacity-40">
        {[...Array(80)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              width: `${1 + (i % 3)}px`,
              height: `${1 + (i % 3)}px`,
              animationDelay: `${(i % 3) * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* ═══════════ SIGNAL WAVES (Earth connecting) ═══════════ */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border-4 border-cyan-400/40"
            style={{ width: 200, height: 200 }}
            animate={{
              scale: [1, 4, 6],
              opacity: [0.6, 0.3, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 1,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* ═══════════ CONFETTI ═══════════ */}
      {[...Array(60)].map((_, i) => (
        <div
          key={`confetti-${i}`}
          className="absolute animate-confetti-fall"
          style={{
            left: `${(i * 17) % 100}%`,
            top: '-10%',
            width: `${8 + (i % 3) * 4}px`,
            height: `${8 + (i % 3) * 4}px`,
            backgroundColor: [
              '#FFD700',
              '#FF6B6B',
              '#4ECDC4',
              '#FF1493',
              '#00FF88',
              '#FFA500',
            ][i % 6],
            borderRadius: i % 2 === 0 ? '50%' : '2px',
            animationDelay: `${(i % 5) * 0.4}s`,
            animationDuration: `${2.5 + (i % 3)}s`,
          }}
        />
      ))}

      {/* ═══════════ MAIN CONTENT ═══════════ */}
      <div className="relative h-full flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 120, delay: 0.2 }}
          className="text-center max-w-3xl w-full py-8"
        >
          {/* 🛰️ Signal icon */}
          <motion.div
            animate={{ rotate: [0, -8, 8, -8, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="text-8xl md:text-9xl mb-4 drop-shadow-2xl inline-block"
          >
            🛰️
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl md:text-6xl font-black text-white mb-3 tracking-wider"
            style={{ textShadow: '0 0 40px rgba(34,211,238,0.8)' }}
          >
            {TOWER_VICTORY.title}
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-cyan-300 text-lg md:text-2xl font-bold mb-2"
          >
            {TOWER_VICTORY.subtitle}
          </motion.p>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-white/80 text-sm md:text-base mb-8 max-w-xl mx-auto"
          >
            {TOWER_VICTORY.message}
          </motion.p>

          {/* Badge */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 
                       px-6 py-3 rounded-full border-2 border-cyan-300 shadow-2xl mb-8"
          >
            <span className="text-2xl">🏅</span>
            <span className="text-white font-black tracking-wider">
              {TOWER_VICTORY.badge}
            </span>
          </motion.div>

          {/* Stats */}
          {showStats && (
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 max-w-2xl mx-auto"
            >
              <StatCard icon="📅" label="Days" value={missionDay} color="#4ECDC4" />
              <StatCard icon="⭐" label="Score" value={score} color="#FFD700" />
              <StatCard icon="🔍" label="Discoveries" value={discoveries} color="#FF6B6B" />
              <StatCard icon="🏗️" label="Buildings" value={buildings.length} color="#A855F7" />
            </motion.div>
          )}

          {/* Tower Parts Installed */}
          {showStats && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-black/30 backdrop-blur rounded-2xl border border-cyan-400/30 p-4 mb-6 max-w-md mx-auto"
            >
              <p className="text-cyan-300 text-xs font-black tracking-widest mb-3">
                🏗️ TOWER PARTS INSTALLED: {partsInstalled}/3
              </p>
              <div className="flex justify-center gap-3">
                {TOWER_PARTS.map((part) => {
                  const installed = towerInstalledParts?.includes(part.id);
                  return (
                    <div
                      key={part.id}
                      className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl border-2 transition-all
                        ${
                          installed
                            ? 'bg-green-500/20 border-green-400'
                            : 'bg-white/5 border-white/20 opacity-40'
                        }`}
                    >
                      <span className="text-2xl">{part.icon}</span>
                      <span className="text-[9px] font-bold text-white">
                        {part.name}
                      </span>
                      {installed && <span className="text-green-300 text-xs">✓</span>}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Achievements */}
          {showStats && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-2 justify-center mb-8"
            >
              {alienArtifactFound && (
                <Badge icon="👽" text="Artifact Hunter" color="from-green-500 to-emerald-600" />
              )}
              {objectsFound === 10 && (
                <Badge icon="🔍" text="Master Explorer" color="from-cyan-500 to-blue-600" />
              )}
              {score >= 3000 && (
                <Badge icon="⭐" text="Star Captain" color="from-yellow-500 to-orange-600" />
              )}
              <Badge icon="📡" text="Signal Decoder" color="from-cyan-500 to-purple-600" />
            </motion.div>
          )}

          {/* Buttons */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <button
              onClick={() => {
                playSound('click');
                onShowCertificate();
              }}
              className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 
                         text-white font-black text-lg rounded-2xl 
                         hover:scale-105 active:scale-95 transition-all 
                         shadow-2xl border-4 border-yellow-300"
            >
              📜 GET CERTIFICATE
            </button>
            <button
              onClick={() => {
                playSound('click');
                onRestart();
              }}
              className="px-8 py-4 bg-white/10 backdrop-blur 
                         text-white font-black text-lg rounded-2xl 
                         hover:scale-105 active:scale-95 transition-all 
                         shadow-2xl border-4 border-white/30 hover:bg-white/20"
            >
              🔄 PLAY AGAIN
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* ═══════════ CSS ANIMATIONS ═══════════ */}
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti-fall {
          animation: confetti-fall linear forwards;
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// STAT CARD
// ═══════════════════════════════════════════════════════
function StatCard({ icon, label, value, color }) {
  return (
    <div
      className="bg-white/10 backdrop-blur rounded-2xl p-3 border-2"
      style={{ borderColor: `${color}66` }}
    >
      <div className="text-2xl md:text-3xl mb-1">{icon}</div>
      <div className="font-black text-xl md:text-2xl" style={{ color }}>
        {value}
      </div>
      <div className="text-white/60 text-[10px] font-bold tracking-wider uppercase">
        {label}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// BADGE
// ═══════════════════════════════════════════════════════
function Badge({ icon, text, color }) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${color} 
                  rounded-full shadow-lg border-2 border-white/40`}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-white text-xs font-black tracking-wide">{text}</span>
    </div>
  );
}