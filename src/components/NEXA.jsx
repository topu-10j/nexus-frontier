// src/components/NEXA.jsx
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Project NEXUS-FRONTIER — NEXA Robot Mascot Component
// Screen-এর bottom-right কোণায় fixed থাকবে,
// gameState বদলালে DeepSeek থেকে ছোট টিপ এনে দেখাবে
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { askNEXA } from '../services/nexaAI';
import { sounds } from '../audio/soundManager';

// ─────────────────────────────────────────────────────────
// ১. Constants
// ─────────────────────────────────────────────────────────

const DEBOUNCE_MS = 1500;   // gameState বদলানোর পর 1.5s অপেক্ষা
const AUTO_HIDE_MS = 9000;  // popup 9s পর নিজে থেকে বন্ধ হবে

// ─────────────────────────────────────────────────────────
// ২. NEXA Component
// ─────────────────────────────────────────────────────────

export default function NEXA({ gameState }) {
  // ── State ────────────────────────────────────────────
  const [tip, setTip] = useState('');           // NEXA-র message
  const [visible, setVisible] = useState(false); // popup দেখাচ্ছে কি?
  const [loading, setLoading] = useState(false); // API call চলছে?

  // ── Refs ─────────────────────────────────────────────
  const debounceRef = useRef(null);   // debounce timer
  const hideTimerRef = useRef(null);  // auto-hide timer
  const lastStateRef = useRef('');    // আগের gameState snapshot

  // ─────────────────────────────────────────────────────
  // ৩. gameState change → debounced askNEXA()
  // ─────────────────────────────────────────────────────

  useEffect(() => {
    if (!gameState) return;

    // gameState-কে string-এ convert করি যাতে comparison সহজ হয়
    const snapshot = JSON.stringify(gameState);

    // আগের state আর একই হলে কিছু করি না
    if (snapshot === lastStateRef.current) return;
    lastStateRef.current = snapshot;

    // ── Debounce ──────────────────────────────────────
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setLoading(true);

      const newTip = await askNEXA(gameState);

      setLoading(false);
      setTip(newTip);
      setVisible(true);

      // 🔔 robotic-ding বাজাই
      if (sounds?.nexa) {
        try {
          sounds.nexa.play();
        } catch (e) {
          // sound fail হলে গেম থামবে না
          console.warn('[NEXA] Sound play failed:', e.message);
        }
      }

      // ── Auto-hide timer ────────────────────────────
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => {
        setVisible(false);
      }, AUTO_HIDE_MS);
    }, DEBOUNCE_MS);

    // ── Cleanup ───────────────────────────────────────
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [gameState]);

  // ─────────────────────────────────────────────────────
  // ৪. Component unmount হলে সব timer clear করি
  // ─────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  // ─────────────────────────────────────────────────────
  // ৫. "Got it!" button handler
  // ─────────────────────────────────────────────────────

  const handleGotIt = () => {
    setVisible(false);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
  };

  // ─────────────────────────────────────────────────────
  // ৬. Manual open — robot avatar-এ ক্লিক করলে
  // ─────────────────────────────────────────────────────

  const handleAvatarClick = async () => {
    if (visible) {
      setVisible(false);
      return;
    }

    // আগের টিপ থাকলে সেটাই দেখাই
    if (tip) {
      setVisible(true);
      if (sounds?.nexa) sounds.nexa.play();
      return;
    }

    // টিপ না থাকলে এখনই askNEXA call করি
    setLoading(true);
    const newTip = await askNEXA(gameState || {});
    setLoading(false);
    setTip(newTip);
    setVisible(true);
    if (sounds?.nexa) sounds.nexa.play();
  };

  // ─────────────────────────────────────────────────────
  // ৭. Render
  // ─────────────────────────────────────────────────────

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none"
      aria-live="polite"
    >
      {/* ── Speech Bubble (popup) ─────────────────────── */}
      <AnimatePresence>
        {visible && (
          <motion.div
            key="nexa-bubble"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="pointer-events-auto max-w-xs rounded-2xl border border-cyan-400/40 
                       bg-slate-900/95 backdrop-blur-md shadow-[0_0_25px_rgba(34,211,238,0.35)] 
                       p-4 text-white"
          >
            {/* Header — NEXA branding */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🤖</span>
              <span className="text-xs font-bold tracking-widest text-cyan-300">
                NEXA
              </span>
              <span className="ml-auto text-[10px] text-cyan-500/70">
                AI COMPANION
              </span>
            </div>

            {/* Message */}
            <p className="text-sm leading-relaxed text-cyan-50">
              {loading ? 'Thinking…' : tip}
            </p>

            {/* Got it! button */}
            {!loading && (
              <button
                onClick={handleGotIt}
                className="mt-3 w-full rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 
                           px-3 py-2 text-xs font-semibold text-white 
                           hover:from-cyan-400 hover:to-purple-500 
                           active:scale-95 transition-all duration-150
                           shadow-[0_0_15px_rgba(168,85,247,0.4)]"
              >
                Got it! 👍
              </button>
            )}

            {/* Triangle pointer (bubble tail) */}
            <div
              className="absolute -bottom-2 right-6 h-4 w-4 rotate-45 
                         border-b border-r border-cyan-400/40 bg-slate-900/95"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Robot Avatar (always visible, clickable) ─── */}
      <motion.button
        onClick={handleAvatarClick}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        animate={{
          y: [0, -6, 0], // subtle floating animation
        }}
        transition={{
          y: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="pointer-events-auto relative h-16 w-16 rounded-full 
                   bg-gradient-to-br from-cyan-500 to-purple-600 
                   flex items-center justify-center text-3xl 
                   shadow-[0_0_25px_rgba(34,211,238,0.6)] 
                   border-2 border-cyan-300/50 
                   hover:shadow-[0_0_35px_rgba(168,85,247,0.8)] 
                   transition-shadow duration-300"
        aria-label="Talk to NEXA"
        title="Talk to NEXA"
      >
        🤖

        {/* Loading pulse indicator */}
        {loading && (
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-cyan-400 
                           animate-ping" />
        )}
      </motion.button>
    </div>
  );
}