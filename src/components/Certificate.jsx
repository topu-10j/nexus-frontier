// src/components/Certificate.jsx
// Mission certificate with NASA logo, player stats, achievements
import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useGameStore } from '../store/gameStore';
import { playSound } from '../audio/soundManager';

export default function Certificate({ onClose }) {
  const {
    playerName,
    score,
    missionDay,
    discoveries,
    buildings,
    alienArtifactFound,
    interestingObjects,
    achievements,
    missionStatus,
  } = useGameStore();

  const certRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const isVictory = missionStatus === 'success';
  const objectsFound = interestingObjects?.filter((o) => o.found).length || 0;

  // ═══════════════════════════════════════════════════════
  // DOWNLOAD AS PNG
  // ═══════════════════════════════════════════════════════
  const handleDownload = async () => {
    if (!certRef.current || downloading) return;
    setDownloading(true);
    playSound('click');

    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        backgroundColor: '#0a0e27',
        useCORS: true,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `SPARK-FRONTIER-Certificate-${playerName || 'Explorer'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      playSound('victory');
    } catch (e) {
      console.error('Download failed:', e);
    } finally {
      setDownloading(false);
    }
  };

  // ═══════════════════════════════════════════════════════
  // DOWNLOAD AS PDF
  // ═══════════════════════════════════════════════════════
  const handleDownloadPDF = async () => {
    if (!certRef.current || downloading) return;
    setDownloading(true);
    playSound('click');

    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        backgroundColor: '#0a0e27',
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`SPARK-FRONTIER-Certificate-${playerName || 'Explorer'}.pdf`);
      playSound('victory');
    } catch (e) {
      console.error('PDF failed:', e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] bg-black/90 backdrop-blur-md flex items-start justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-4xl py-8">
        {/* ═══════════ CERTIFICATE ═══════════ */}
        <div
          ref={certRef}
          className="relative bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] 
                     rounded-3xl p-6 md:p-12 border-4 border-yellow-500/60 
                     shadow-2xl overflow-hidden"
        >
          {/* Background stars */}
          <div className="absolute inset-0 opacity-30">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${(i * 37) % 100}%`,
                  top: `${(i * 53) % 100}%`,
                  width: `${(i % 3) + 1}px`,
                  height: `${(i % 3) + 1}px`,
                }}
              />
            ))}
          </div>

          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-24 h-24 md:w-32 md:h-32 border-t-4 border-l-4 border-yellow-500/80 rounded-tl-3xl" />
          <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 border-t-4 border-r-4 border-yellow-500/80 rounded-tr-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 md:w-32 md:h-32 border-b-4 border-l-4 border-yellow-500/80 rounded-bl-3xl" />
          <div className="absolute bottom-0 right-0 w-24 h-24 md:w-32 md:h-32 border-b-4 border-r-4 border-yellow-500/80 rounded-br-3xl" />

          <div className="relative z-10">
            {/* ═══════ NASA LOGO + HEADER ═══════ */}
            <div className="text-center mb-4 md:mb-6">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="bg-white rounded-full p-2 shadow-xl">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/e/e5/NASA_logo.svg"
                    alt="NASA"
                    className="w-14 h-14 md:w-16 md:h-16 object-contain"
                    crossOrigin="anonymous"
                  />
                </div>
                <div className="text-left">
                  <p className="text-white text-[10px] md:text-xs font-black tracking-widest">
                    NASA SPACE APPS
                  </p>
                  <p className="text-yellow-400 text-[10px] md:text-xs font-bold tracking-wider">
                    CHALLENGE 2026
                  </p>
                </div>
              </div>

              <div className="h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent my-3 md:my-4" />

              <p className="text-cyan-300 text-[9px] md:text-[10px] font-black tracking-[0.3em] uppercase">
                Certificate of Achievement
              </p>
              <h1 className="text-2xl md:text-5xl font-black text-white mt-2 mb-1 md:mb-2 tracking-wider">
                SPARK-FRONTIER
              </h1>
              <p className="text-white/60 text-[9px] md:text-xs italic">
                Project NEXUS-FRONTIER • Team SPARK • DIU CSE
              </p>
            </div>

            {/* ═══════ STATUS BADGE ═══════ */}
            <div className="text-center mb-4 md:mb-6">
              {isVictory ? (
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 px-4 md:px-6 py-1.5 md:py-2 rounded-full border-2 border-green-300 shadow-2xl">
                  <span className="text-base md:text-xl">🏆</span>
                  <span className="text-white text-xs md:text-base font-black tracking-wider">
                    MISSION SUCCESS
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-700 px-4 md:px-6 py-1.5 md:py-2 rounded-full border-2 border-red-300 shadow-2xl">
                  <span className="text-base md:text-xl">💀</span>
                  <span className="text-white text-xs md:text-base font-black tracking-wider">
                    MISSION FAILED
                  </span>
                </div>
              )}
            </div>

            {/* ═══════ MAIN TEXT ═══════ */}
            <div className="text-center mb-4 md:mb-6">
              <p className="text-white/70 text-xs md:text-sm mb-2">
                This certificate is proudly presented to
              </p>
              <p className="text-2xl md:text-5xl font-black bg-gradient-to-r from-yellow-300 via-yellow-500 to-orange-500 bg-clip-text text-transparent mb-2 md:mb-3 tracking-wide">
                {(playerName || 'BRAVE EXPLORER').toUpperCase()}
              </p>
              <p className="text-white/80 text-[11px] md:text-sm max-w-2xl mx-auto leading-relaxed px-2">
                {isVictory
                  ? 'For successfully completing a 3-day Mars survival mission, demonstrating courage, scientific curiosity, and astronaut skills in the NEXUS-FRONTIER space program.'
                  : 'For participating bravely in the NEXUS-FRONTIER Mars mission and showing incredible effort in space exploration.'}
              </p>
            </div>

            {/* ═══════ STATS GRID ═══════ */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-4 md:mb-6">
              <CertStat icon="📅" label="Days" value={Math.max(0, missionDay - 1)} color="cyan" />
              <CertStat icon="⭐" label="Score" value={score} color="yellow" />
              <CertStat icon="🔍" label="Discoveries" value={discoveries} color="green" />
              <CertStat icon="🏗️" label="Buildings" value={buildings.length} color="purple" />
            </div>

            {/* ═══════ ACHIEVEMENTS / BADGES ═══════ */}
            {(alienArtifactFound || objectsFound > 0 || achievements.length > 0) && (
              <div className="mb-4 md:mb-6">
                <p className="text-center text-white/60 text-[9px] md:text-[10px] font-black tracking-widest mb-2 md:mb-3">
                  ═══ ACHIEVEMENTS ═══
                </p>
                <div className="flex flex-wrap gap-1.5 md:gap-2 justify-center">
                  {alienArtifactFound && <CertBadge icon="👽" text="Artifact Hunter" />}
                  {objectsFound >= 5 && <CertBadge icon="🔍" text={`Found ${objectsFound} Objects`} />}
                  {score >= 3000 && <CertBadge icon="⭐" text="Star Captain" />}
                  {buildings.length >= 3 && <CertBadge icon="🏗️" text="Colony Builder" />}
                  {achievements.slice(0, 3).map((a) => (
                    <CertBadge key={a.id} icon={a.icon} text={a.name} />
                  ))}
                </div>
              </div>
            )}

            {/* ═══════ FOOTER ═══════ */}
            <div className="border-t border-yellow-500/30 pt-3 md:pt-4 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
              <div className="text-center md:text-left">
                <p className="text-yellow-400 text-[9px] md:text-[10px] font-black tracking-widest">
                  ISSUED BY
                </p>
                <p className="text-white text-xs md:text-sm font-bold">
                  NEXA AI • Mission Control
                </p>
              </div>

              <div className="text-center">
                <p className="text-white/40 text-[8px] md:text-[9px] tracking-widest">DATE</p>
                <p className="text-white text-[10px] md:text-xs font-bold">
                  {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <div className="text-center md:text-right">
                <p className="text-yellow-400 text-[9px] md:text-[10px] font-black tracking-widest">
                  MISSION ID
                </p>
                <p className="text-white text-[10px] md:text-xs font-mono">
                  NXF-{Date.now().toString().slice(-6)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════ ACTION BUTTONS ═══════════ */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 
                       text-white font-black rounded-xl hover:scale-105 active:scale-95 
                       transition-all shadow-2xl border-2 border-cyan-300
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloading ? '⏳ Saving...' : '📥 Download PNG'}
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-600 
                       text-white font-black rounded-xl hover:scale-105 active:scale-95 
                       transition-all shadow-2xl border-2 border-red-300
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloading ? '⏳ Saving...' : '📄 Download PDF'}
          </button>
          <button
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="px-6 py-3 bg-white/10 backdrop-blur text-white font-black rounded-xl 
                       hover:scale-105 active:scale-95 transition-all 
                       shadow-2xl border-2 border-white/30 hover:bg-white/20"
          >
            ✖ Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// STAT
// ═══════════════════════════════════════════════════════
function CertStat({ icon, label, value, color }) {
  const colorMap = {
    cyan: 'text-cyan-300 border-cyan-400/50 bg-cyan-500/10',
    yellow: 'text-yellow-300 border-yellow-400/50 bg-yellow-500/10',
    green: 'text-green-300 border-green-400/50 bg-green-500/10',
    purple: 'text-purple-300 border-purple-400/50 bg-purple-500/10',
  };

  return (
    <div className={`rounded-xl p-2 md:p-3 border-2 ${colorMap[color]} text-center`}>
      <div className="text-xl md:text-2xl mb-1">{icon}</div>
      <div className="text-lg md:text-2xl font-black">{value}</div>
      <div className="text-[8px] md:text-[9px] font-black tracking-widest opacity-80 uppercase">
        {label}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// BADGE
// ═══════════════════════════════════════════════════════
function CertBadge({ icon, text }) {
  return (
    <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/60 rounded-full px-2.5 md:px-3 py-1">
      <span className="text-xs md:text-sm">{icon}</span>
      <span className="text-yellow-200 text-[9px] md:text-[10px] font-black tracking-wide">
        {text}
      </span>
    </div>
  );
}