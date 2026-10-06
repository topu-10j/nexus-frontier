import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function RocketLaunch({ planet, onComplete }) {
  const [phase, setPhase] = useState('ready'); // 'ready' | 'countdown' | 1 | 2 | 3 | 4
  const [countdown, setCountdown] = useState(3);

  // === COUNTDOWN PHASE ===
  useEffect(() => {
    if (phase !== 'countdown') return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Countdown শেষ → LIFT OFF (fast: 0.5s delay)
      const timer = setTimeout(() => setPhase(1), 500);
      return () => clearTimeout(timer);
    }
  }, [countdown, phase]);

  // === PHASE PROGRESSION (fast timing) ===
  useEffect(() => {
    if (typeof phase !== 'number') return;

    const timers = [];
    if (phase === 1) timers.push(setTimeout(() => setPhase(2), 2000)); // Lift off: 2s
    if (phase === 2) timers.push(setTimeout(() => setPhase(3), 1500)); // Space: 1.5s
    if (phase === 3) timers.push(setTimeout(() => setPhase(4), 2000)); // Horizontal: 2s
    if (phase === 4) timers.push(setTimeout(() => onComplete(), 1500)); // Approaching: 1.5s

    return () => timers.forEach((t) => clearTimeout(t));
  }, [phase]);

  const handleStart = () => {
    setPhase('countdown');
  };

  return (
    <div className="h-screen w-screen bg-black relative overflow-hidden">
      <AnimatePresence mode="wait">

        {/* ============ PHASE 'ready': Rocket waiting + START button ============ */}
        {phase === 'ready' && (
          <motion.div
            key="ready"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-black"
          >
            <div className="absolute inset-0 stars-bg" />

            {/* Rocket at launch pad */}
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl z-10"
            >
              🚀
            </motion.div>

            {/* Launch pad glow */}
            <motion.div
              animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-[60%] left-1/2 -translate-x-1/2 w-64 h-4 bg-orange-500/50 blur-xl rounded-full"
            />

            {/* Top info */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center z-10">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl font-bold text-white tracking-widest"
              >
                READY FOR LAUNCH
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-orange-300 text-lg mt-3"
              >
                Destination: {planet?.name?.toUpperCase()}
              </motion.p>
            </div>

            {/* Mission info */}
            <div className="absolute top-32 left-1/2 -translate-x-1/2 text-center z-10 flex gap-8">
              <div>
                <p className="text-gray-500 text-xs">DISTANCE</p>
                <p className="text-white text-lg font-bold">{planet?.data?.distance}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">TEMPERATURE</p>
                <p className="text-white text-lg font-bold">{planet?.data?.temperature}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">GRAVITY</p>
                <p className="text-white text-lg font-bold">{planet?.data?.gravity}</p>
              </div>
            </div>

            {/* START button */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20">
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStart}
                className="px-12 py-5 bg-gradient-to-r from-orange-500 to-red-600 
                           text-white font-bold rounded-full text-xl tracking-wider
                           shadow-[0_0_40px_rgba(255,100,0,0.6)] 
                           hover:shadow-[0_0_60px_rgba(255,100,0,0.9)]
                           transition-all animate-pulse"
              >
                🚀 START MISSION
              </motion.button>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-500 text-sm z-10">
              Press START to begin countdown sequence
            </div>
          </motion.div>
        )}

        {/* ============ PHASE 'countdown': 3-2-1 ============ */}
        {phase === 'countdown' && (
          <motion.div
            key="countdown"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black"
          >
            <div className="absolute inset-0 stars-bg" />

            <motion.div
              animate={{ y: [-3, 3, -3] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl opacity-40 z-0"
            >
              🚀
            </motion.div>

            <motion.div
              animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-4 border-orange-500 rounded-full z-10"
            />

            <motion.div
              key={countdown}
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 3, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                         text-[250px] font-bold text-white z-20 
                         drop-shadow-[0_0_60px_rgba(255,120,0,0.9)]"
            >
              {countdown > 0 ? countdown : '🚀'}
            </motion.div>

            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 text-center z-20">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-3xl font-bold text-white tracking-widest"
              >
                {countdown > 0 ? 'COUNTDOWN' : 'LIFT OFF!'}
              </motion.h2>
            </div>
          </motion.div>
        )}

        {/* ============ PHASE 1: LIFT OFF (fast: 2s) ============ */}
        {phase === 1 && (
          <motion.div
            key="phase1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB] via-[#FDB813] to-[#8B4513]" />
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#3D2817] to-[#5C4033]" />

            <div className="absolute bottom-1/3 left-0 right-0 h-32 flex items-end justify-around opacity-70">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="bg-[#1a1a1a]"
                  style={{
                    width: `${20 + Math.random() * 30}px`,
                    height: `${40 + Math.random() * 60}px`,
                  }}
                />
              ))}
            </div>

            {/* Massive smoke */}
            <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 z-10 pointer-events-none">
              <motion.div
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: [0.3, 1.5, 3], opacity: [0, 0.9, 0] }}
                transition={{ duration: 2, times: [0, 0.5, 1] }}
                className="absolute -translate-x-1/2 text-[200px]"
              >
                💨
              </motion.div>

              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, scale: 0.2, opacity: 0.9 }}
                  animate={{
                    x: (i % 2 === 0 ? -1 : 1) * (80 + i * 25),
                    y: -30 - i * 15,
                    scale: 1 + i * 0.25,
                    opacity: 0,
                  }}
                  transition={{ duration: 2 + i * 0.1 }}
                  className="absolute text-[100px]"
                >
                  ☁️
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ bottom: '20%', left: '50%' }}
              animate={{ bottom: '150%', left: '50%' }}
              transition={{ duration: 2, ease: 'easeIn' }}
              className="absolute -translate-x-1/2 z-20 text-6xl"
            >
              🚀
            </motion.div>

            <motion.div
              initial={{ bottom: '15%', left: '50%', opacity: 1 }}
              animate={{ bottom: '145%', left: '50%', opacity: 0 }}
              transition={{ duration: 2, ease: 'easeIn' }}
              className="absolute -translate-x-1/2 z-10 text-5xl"
            >
              🔥
            </motion.div>

            <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center z-10">
              <h2 className="text-5xl font-bold text-white drop-shadow-lg tracking-widest">
                🚀 LIFT OFF
              </h2>
              <p className="text-white/90 text-sm mt-3">Launching from Earth...</p>
            </div>
          </motion.div>
        )}

        {/* ============ PHASE 2: SPACE (fast: 1.5s) ============ */}
        {phase === 2 && (
          <motion.div key="phase2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black">
            <div className="absolute inset-0 stars-bg" />
            <motion.div
              initial={{ bottom: '-30%', scale: 1.5 }}
              animate={{ bottom: '-150%', scale: 0.3 }}
              transition={{ duration: 1.5 }}
              className="absolute left-1/2 -translate-x-1/2 w-96 h-96 rounded-full"
              style={{ background: 'radial-gradient(circle at 30% 30%, #4A90D9, #1E3A8A, #0A1929)' }}
            />
            <motion.div
              initial={{ bottom: '20%', left: '50%' }}
              animate={{ bottom: '80%', left: '50%' }}
              transition={{ duration: 1.5 }}
              className="absolute -translate-x-1/2 z-20 text-6xl"
            >
              🚀
            </motion.div>
            <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center z-10">
              <h2 className="text-4xl font-bold text-white tracking-wide">Entering Space</h2>
              <p className="text-gray-400 text-sm mt-2">Escaping Earth's gravity...</p>
            </div>
          </motion.div>
        )}

        {/* ============ PHASE 3: HORIZONTAL (fast: 2s) ============ */}
        {phase === 3 && (
          <motion.div key="phase3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black">
            <div className="absolute inset-0 stars-bg" />
            <motion.div
              initial={{ right: '5%', top: '40%', scale: 0.3, opacity: 0.5 }}
              animate={{ right: '25%', top: '40%', scale: 1.2, opacity: 1 }}
              transition={{ duration: 2 }}
              className="absolute w-48 h-48 rounded-full"
              style={{ background: 'radial-gradient(circle at 30% 30%, #D2691E, #8B3A1E, #5C2E16)' }}
            />
            <motion.div
              initial={{ left: '5%', top: '50%', rotate: 0 }}
              animate={{ left: '55%', top: '50%', rotate: 90 }}
              transition={{ duration: 2 }}
              className="absolute -translate-y-1/2 z-20 text-6xl"
            >
              🚀
            </motion.div>
            <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center z-10">
              <h2 className="text-4xl font-bold text-white tracking-wide">
                Cruising to {planet?.name}
              </h2>
              <p className="text-gray-400 text-sm mt-2">Distance: {planet?.data?.distance}</p>
            </div>
          </motion.div>
        )}

        {/* ============ PHASE 4: APPROACHING (fast: 1.5s) ============ */}
        {phase === 4 && (
          <motion.div key="phase4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black">
            <div className="absolute inset-0 stars-bg" />
            <motion.div
              initial={{ scale: 1.5, opacity: 0.6 }}
              animate={{ scale: 5, opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div
                className="w-64 h-64 rounded-full"
                style={{
                  background: 'radial-gradient(circle at 40% 40%, #E8985E, #C1440E, #8B3A1E)',
                  boxShadow: '0 0 120px rgba(193, 68, 14, 0.8)',
                }}
              />
            </motion.div>
            <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center z-10">
              <h2 className="text-4xl font-bold text-white tracking-wide">Approaching Mars</h2>
              <p className="text-gray-400 text-sm mt-2">Preparing for landing...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar */}
      {typeof phase === 'number' && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-80 z-30">
          <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${(phase / 4) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-cyan-400 to-orange-500"
            />
          </div>
          <p className="text-gray-400 text-xs text-center mt-2">
            Mission Progress — Phase {phase}/4
          </p>
        </div>
      )}
    </div>
  );
}