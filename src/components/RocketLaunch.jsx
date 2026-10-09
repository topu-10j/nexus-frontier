import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { playSound } from '../audio/soundManager';

export default function RocketLaunch({ planet, onComplete }) {
  const [phase, setPhase] = useState('ready');
  const [countdown, setCountdown] = useState(3);
  const soundPlayedRef = useRef({ 3: false, 2: false, 1: false });

  // ============ COUNTDOWN ============
  useEffect(() => {
    if (phase !== 'countdown') return;

    if (countdown > 0) {
      if (!soundPlayedRef.current[countdown]) {
        playSound('click');
        soundPlayedRef.current[countdown] = true;
      }
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      playSound('rocketLaunch');
      const timer = setTimeout(() => setPhase(1), 500);
      return () => clearTimeout(timer);
    }
  }, [countdown, phase]);

  // ============ PHASE PROGRESSION ============
  useEffect(() => {
    if (typeof phase !== 'number') return;

    const timers = [];
    if (phase === 1) timers.push(setTimeout(() => setPhase(2), 2000));
    if (phase === 2) timers.push(setTimeout(() => setPhase(3), 1500));
    if (phase === 3) timers.push(setTimeout(() => setPhase(4), 2000));
    if (phase === 4) timers.push(setTimeout(() => setPhase(5), 1500));
    if (phase === 5) timers.push(setTimeout(() => onComplete(), 5000));

    return () => timers.forEach((t) => clearTimeout(t));
  }, [phase]);

  const handleStart = () => {
    playSound('click');
    soundPlayedRef.current = { 3: false, 2: false, 1: false };
    setPhase('countdown');
  };

  return (
    <div className="h-screen w-screen bg-black relative overflow-hidden">
      <AnimatePresence mode="wait">

        {/* ============ PHASE 'ready' ============ */}
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

            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
              style={{ rotate: '-45deg' }}
            >
              <span className="text-9xl inline-block">🚀</span>
            </motion.div>

            <motion.div
              animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-[60%] left-1/2 -translate-x-1/2 w-64 h-4 bg-orange-500/50 blur-xl rounded-full"
            />

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

            <div className="absolute top-32 left-1/2 -translate-x-1/2 text-center z-10 flex gap-8">
              <div>
                <p className="text-gray-500 text-xs">DISTANCE</p>
                <p className="text-white text-lg font-bold">
                  {planet?.data?.distance}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">TEMPERATURE</p>
                <p className="text-white text-lg font-bold">
                  {planet?.data?.temperature}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">GRAVITY</p>
                <p className="text-white text-lg font-bold">
                  {planet?.data?.gravity}
                </p>
              </div>
            </div>

            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20">
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => playSound('hover')}
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

        {/* ============ PHASE 'countdown' ============ */}
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
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-40"
              style={{ rotate: '-45deg' }}
            >
              <span className="text-9xl inline-block">🚀</span>
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

        {/* ============ PHASE 1: LIFT OFF ============ */}
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
              className="absolute -translate-x-1/2 z-20"
              style={{ rotate: '-45deg' }}
            >
              <span className="text-6xl inline-block">🚀</span>
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

        {/* ============ PHASE 2: SPACE ============ */}
        {phase === 2 && (
          <motion.div
            key="phase2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black"
          >
            <div className="absolute inset-0 stars-bg" />
            <motion.div
              initial={{ bottom: '-30%', scale: 1.5 }}
              animate={{ bottom: '-150%', scale: 0.3 }}
              transition={{ duration: 1.5 }}
              className="absolute left-1/2 -translate-x-1/2 w-96 h-96 rounded-full"
              style={{
                background:
                  'radial-gradient(circle at 30% 30%, #4A90D9, #1E3A8A, #0A1929)',
              }}
            />
            <motion.div
              initial={{ bottom: '20%', left: '50%' }}
              animate={{ bottom: '80%', left: '50%' }}
              transition={{ duration: 1.5 }}
              className="absolute -translate-x-1/2 z-20"
              style={{ rotate: '-45deg' }}
            >
              <span className="text-6xl inline-block">🚀</span>
            </motion.div>
            <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center z-10">
              <h2 className="text-4xl font-bold text-white tracking-wide">
                Entering Space
              </h2>
              <p className="text-gray-400 text-sm mt-2">
                Escaping Earth's gravity...
              </p>
            </div>
          </motion.div>
        )}

        {/* ============ PHASE 3: HORIZONTAL ============ */}
        {phase === 3 && (
          <motion.div
            key="phase3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black"
          >
            <div className="absolute inset-0 stars-bg" />
            <motion.div
              initial={{ right: '5%', top: '40%', scale: 0.3, opacity: 0.5 }}
              animate={{ right: '25%', top: '40%', scale: 1.2, opacity: 1 }}
              transition={{ duration: 2 }}
              className="absolute w-48 h-48 rounded-full"
              style={{
                background:
                  'radial-gradient(circle at 30% 30%, #D2691E, #8B3A1E, #5C2E16)',
              }}
            />
            <motion.div
              initial={{ left: '5%', top: '50%', rotate: 0 }}
              animate={{ left: '55%', top: '50%', rotate: 90 }}
              transition={{ duration: 2 }}
              className="absolute -translate-y-1/2 z-20"
              style={{ rotate: '-45deg' }}
            >
              <span className="text-6xl inline-block">🚀</span>
            </motion.div>
            <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center z-10">
              <h2 className="text-4xl font-bold text-white tracking-wide">
                Cruising to {planet?.name}
              </h2>
              <p className="text-gray-400 text-sm mt-2">
                Distance: {planet?.data?.distance}
              </p>
            </div>
          </motion.div>
        )}

        {/* ============ PHASE 4: APPROACHING ============ */}
        {phase === 4 && (
          <motion.div
            key="phase4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black"
          >
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
                  background:
                    'radial-gradient(circle at 40% 40%, #E8985E, #C1440E, #8B3A1E)',
                  boxShadow: '0 0 120px rgba(193, 68, 14, 0.8)',
                }}
              />
            </motion.div>
            <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center z-10">
              <h2 className="text-4xl font-bold text-white tracking-wide">
                Approaching Mars
              </h2>
              <p className="text-gray-400 text-sm mt-2">
                Preparing for landing...
              </p>
            </div>
          </motion.div>
        )}

        {/* ============ PHASE 5: LANDING SEQUENCE ============ */}
        {phase === 5 && (
          <motion.div
            key="phase5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black overflow-hidden"
          >
            {/* Mars surface rising from bottom */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: '40%' }}
              transition={{ duration: 3, ease: 'easeOut' }}
              className="absolute bottom-0 left-0 right-0 h-full"
              style={{
                background:
                  'linear-gradient(to bottom, #C1440E 0%, #8B3A1E 40%, #5C2E16 100%)',
              }}
            >
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-[#5C2E16]"
                  style={{
                    width: `${5 + Math.random() * 15}px`,
                    height: `${5 + Math.random() * 15}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${30 + Math.random() * 60}%`,
                    opacity: 0.4,
                  }}
                />
              ))}
            </motion.div>

            {/* Stars in upper area */}
            <div className="absolute inset-0 stars-bg opacity-60" />

            {/* Descending Rocket */}
            <motion.div
              initial={{ top: '10%', scale: 1.5 }}
              animate={{ top: '55%', scale: 1 }}
              transition={{ duration: 3, ease: 'easeInOut' }}
              className="absolute left-1/2 -translate-x-1/2 z-20"
              style={{ rotate: '-45deg' }}
            >
              <span className="text-7xl inline-block">🚀</span>
            </motion.div>

            {/* Engine fire trail */}
            <motion.div
              initial={{ top: '15%', opacity: 0.9 }}
              animate={{ top: '60%', opacity: 0.5 }}
              transition={{ duration: 3, ease: 'easeInOut' }}
              className="absolute left-1/2 -translate-x-1/2 z-10 text-6xl"
            >
              🔥
            </motion.div>

            {/* Heat shield glow */}
            <motion.div
              initial={{ top: '15%', scale: 1, opacity: 0.8 }}
              animate={{ top: '60%', scale: 1.5, opacity: 0 }}
              transition={{ duration: 3, ease: 'easeInOut' }}
              className="absolute left-1/2 -translate-x-1/2 w-32 h-32 rounded-full z-0"
              style={{
                background:
                  'radial-gradient(circle, #FF6B00, transparent 70%)',
                filter: 'blur(20px)',
              }}
            />

            {/* Landing dust cloud */}
            <motion.div
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: [0, 0.9, 0.6], scale: [0.3, 2, 3] }}
              transition={{ delay: 2.5, duration: 2 }}
              className="absolute left-1/2 -translate-x-1/2 z-30 pointer-events-none"
              style={{ top: '65%' }}
            >
              <span className="text-[200px] inline-block">💨</span>
            </motion.div>

            {/* Dust particles flying outward */}
            {[...Array(12)].map((_, i) => {
              const angle = (i / 12) * Math.PI * 2;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
                  animate={{
                    opacity: [0, 0.8, 0],
                    x: Math.cos(angle) * 200,
                    y: Math.sin(angle) * 100 + 50,
                    scale: 1.5,
                  }}
                  transition={{ delay: 2.5 + i * 0.05, duration: 1.5 }}
                  className="absolute left-1/2 z-25 pointer-events-none"
                  style={{ top: '65%' }}
                >
                  <div className="w-8 h-8 bg-[#B8860B] rounded-full opacity-60 blur-sm" />
                </motion.div>
              );
            })}

            {/* Screen shake on landing */}
            <motion.div
              animate={{
                x: [0, -8, 8, -6, 6, -3, 3, 0],
                y: [0, 6, -6, 4, -4, 2, -2, 0],
              }}
              transition={{ delay: 2.5, duration: 0.8 }}
              className="absolute inset-0"
            />

            {/* TOUCHDOWN title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: [0, 1, 1], y: [20, 0, 0] }}
              transition={{ delay: 3.5, duration: 1 }}
              className="absolute top-12 left-1/2 -translate-x-1/2 text-center z-40"
            >
              <h2 className="text-5xl font-bold text-white tracking-widest drop-shadow-[0_0_30px_rgba(255,120,0,0.9)]">
                🛬 TOUCHDOWN
              </h2>
              <p className="text-orange-200 text-sm mt-2">
                Welcome to Mars, Captain
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar */}
      {typeof phase === 'number' && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-80 z-30">
          <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${(phase / 5) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-cyan-400 to-orange-500"
            />
          </div>
          <p className="text-gray-400 text-xs text-center mt-2">
            Mission Progress — Phase {phase}/5
          </p>
        </div>
      )}
    </div>
  );
}