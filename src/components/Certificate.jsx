// src/components/Certificate.jsx
// Certificate — Mission সফল হলে NASA লোগো সহ সার্টিফিকেট

import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

export default function Certificate() {
  const [playerName, setPlayerName] = useState('');
  const certRef = useRef(null);

  // store থেকে ডেটা
  const buildings = useGameStore((s) => s.buildings);
  const budget = useGameStore((s) => s.budget);
  const resetGame = useGameStore((s) => s.resetGame);

  const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  // PDF ডাউনলোড
  const downloadPDF = async () => {
    if (!certRef.current) return;
    const canvas = await html2canvas(certRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
    pdf.save(`${playerName || 'Space-Colonist'}-Certificate.pdf`);
  };

  // PNG ডাউনলোড
  const downloadPNG = async () => {
    if (!certRef.current) return;
    const canvas = await html2canvas(certRef.current, { scale: 2 });
    const link = document.createElement('a');
    link.download = `${playerName || 'Space-Colonist'}-Certificate.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Share to Web
  const shareToWeb = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Certified Space Colonist',
          text: `I established a colony on Mars! 🚀`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      alert('Share not supported on this browser');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-50 bg-black/95 backdrop-blur-md
                 flex flex-col items-center justify-center p-4 overflow-y-auto"
    >
      {/* Victory Heading */}
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl md:text-5xl font-bold text-cyan-400 mb-2 text-center"
      >
        🎉 MISSION SUCCESSFUL!
      </motion.h1>
      <p className="text-gray-300 mb-6 text-center">
        Colony Established on Mars
      </p>

      {/* Name Input */}
      <div className="mb-6 w-full max-w-md">
        <label className="text-gray-300 text-sm block mb-2 text-center">
          Enter your name for the certificate:
        </label>
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Your Name"
          className="w-full px-4 py-2 rounded-lg bg-gray-800
                     border border-cyan-500/50 text-white text-center
                     focus:outline-none focus:border-cyan-400"
        />
      </div>

      {/* Certificate Design */}
      <div
        ref={certRef}
        className="w-full max-w-2xl bg-gradient-to-br from-blue-900
                   via-purple-900 to-indigo-900 p-8 rounded-2xl
                   border-4 border-cyan-400/40 shadow-2xl mb-6"
      >
        <div className="text-center">
          {/* NASA Logo */}
          <img
            src="/images/nasa-logo.png"
            alt="NASA"
            className="h-16 w-auto mx-auto mb-4"
            onError={(e) => {
              // লোগো না পেলে emoji দেখাবে
              e.target.style.display = 'none';
            }}
          />

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">
            Certified Space Colonist
          </h2>

          <div className="w-24 h-1 bg-cyan-400 mx-auto my-4 rounded-full" />

          <p className="text-gray-300 text-sm mb-2">
            This certifies that
          </p>

          <h3 className="text-3xl md:text-4xl font-bold text-cyan-300 mb-4">
            {playerName || '_______________'}
          </h3>

          <p className="text-gray-300 text-sm mb-2">
            has successfully established a colony on
          </p>

          <h4 className="text-2xl md:text-3xl font-bold text-orange-400 mb-4">
            🔴 MARS
          </h4>

          {/* Stats */}
          <div className="flex justify-center gap-6 text-gray-300 text-xs mt-6 mb-4">
            <div>
              <div className="text-cyan-400 font-bold text-lg">
                {buildings.length}
              </div>
              <div>Buildings</div>
            </div>
            <div>
              <div className="text-yellow-400 font-bold text-lg">
                ${budget}
              </div>
              <div>Budget Left</div>
            </div>
            <div>
              <div className="text-green-400 font-bold text-lg">
                {today}
              </div>
              <div>Mission Date</div>
            </div>
          </div>

          <p className="text-gray-400 text-[10px] mt-4">
            Project NEXUS-FRONTIER | NASA Space Apps Challenge 2026
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={downloadPDF}
          className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500
                     text-white font-bold rounded-full text-sm
                     transition-all"
        >
          📥 Download PDF
        </button>

        <button
          onClick={downloadPNG}
          className="px-5 py-2.5 bg-green-600 hover:bg-green-500
                     text-white font-bold rounded-full text-sm
                     transition-all"
        >
          🖼️ Download PNG
        </button>

        <button
          onClick={shareToWeb}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500
                     text-white font-bold rounded-full text-sm
                     transition-all"
        >
          🔗 Share to Web
        </button>

        <button
          onClick={resetGame}
          className="px-5 py-2.5 bg-gray-600 hover:bg-gray-500
                     text-white font-bold rounded-full text-sm
                     transition-all"
        >
          🔄 New Mission
        </button>
      </div>
    </motion.div>
  );
}