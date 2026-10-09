// src/components/NEXA.jsx
// NEXA AI Mascot — D-Pad + warning + tower messages
import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { playSound } from '../audio/soundManager';

export default function NEXA() {
  const {
    oxygen, power, temperature, radiation, waterLevel, budget, buildings,
    activeDisaster, missionStatus, deathReason,
    currentProblem, quizActive, welcomeShown,
    setProblem, touchNEXA, resolveProblem,
    setWelcomeShown, setWalkDirection,
    clearWalkDirection, walkDirection,
    activeWarning,
    warningEscalation,
    towerDiscovered,
    towerInstalledParts,
  } = useGameStore();

  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const [solutionShown, setSolutionShown] = useState(false);

  // ═══════════ WELCOME MESSAGE ═══════════
  useEffect(() => {
    if (welcomeShown) return;
    const timer = setTimeout(() => {
      setMessage('Captain! Welcome to Mars. Explore to find the broken NASA tower. Use D-Pad to move!');
      setVisible(true);
      playSound('nexa');
      setWelcomeShown();
      setTimeout(() => setVisible(false), 9000);
    }, 2000);
    return () => clearTimeout(timer);
  }, [welcomeShown, setWelcomeShown]);

  // ═══════════ LIVE PROBLEM DETECTION ═══════════
  useEffect(() => {
    if (missionStatus !== 'active') return;
    if (quizActive) return;

    let newProblem = null;

    if (activeDisaster === 'sandstorm') {
      newProblem = '🌪️ Dust storm! Solar panels disabled!';
    } else if (activeDisaster === 'solarFlare') {
      newProblem = '☀️ Solar flare! Radiation rising!';
    } else if (activeDisaster === 'meteor') {
      newProblem = '☄️ Meteor shower incoming!';
    } else if (oxygen < 30) {
      newProblem = '⚠️ Oxygen low! Touch me for solution.';
    } else if (power < 30) {
      newProblem = '⚠️ Power dropping! Touch me.';
    } else if (temperature < 30) {
      newProblem = '⚠️ Temperature critical! Touch me.';
    } else if (radiation > 70) {
      newProblem = '⚠️ Radiation high! Touch me.';
    } else if (waterLevel < 30) {
      newProblem = '⚠️ Water low! Touch me.';
    }

    if (newProblem !== currentProblem) {
      if (newProblem) {
        setProblem(newProblem);
        playSound('nexa');
      } else {
        resolveProblem();
      }
    }
  }, [
    oxygen, power, temperature, radiation, waterLevel,
    activeDisaster, missionStatus, quizActive,
    currentProblem, setProblem, resolveProblem,
  ]);

  // ═══════════ VICTORY / DEFEAT ═══════════
  useEffect(() => {
    if (missionStatus === 'success') {
      setMessage('🎉 SIGNAL ESTABLISHED! You contacted Earth!');
      setVisible(true);
      playSound('victory');
    } else if (missionStatus === 'failed' && !activeWarning) {
      setMessage(`💀 ${deathReason || 'Mission failed.'}`);
      setVisible(true);
      playSound('nexa');
    }
  }, [missionStatus, deathReason, activeWarning]);

  // ═══════════ DIRECTION HANDLER ═══════════
  const handleDirection = (dir) => {
    playSound('click');
    if (walkDirection === dir) {
      clearWalkDirection();
    } else {
      setWalkDirection(dir);
    }
  };

  // ═══════════ NEXA BUTTON — solution ═══════════
  const handleNEXA = () => {
    playSound('click');
    touchNEXA();
    clearWalkDirection();

    // If there's an active warning — show its solution
    if (activeWarning) {
      setMessage(activeWarning.solution || '💡 Follow the warning instructions!');
      setVisible(true);
      setTimeout(() => setVisible(false), 5000);
      return;
    }

    // If there's an active problem — show its solution
    if (currentProblem && !solutionShown) {
      let solution = '';

      if (currentProblem.includes('Oxygen')) {
        solution = '💡 Build Oxygen Generator ($800) or Bio-Dome ($1200)!';
      } else if (currentProblem.includes('Power')) {
        solution = '💡 Build Power Grid ($600)!';
      } else if (currentProblem.includes('Temperature') || currentProblem.includes('Temp')) {
        solution = '💡 Build Thermal Regulator ($700)!';
      } else if (currentProblem.includes('Radiation')) {
        solution = '💡 Build Magnetic Shield ($900)!';
      } else if (currentProblem.includes('Water')) {
        solution = '💡 Click an Ice Crater to mine ($1000)!';
      } else if (
        currentProblem.includes('Dust storm') ||
        currentProblem.includes('Dust Storm') ||
        currentProblem.includes('sandstorm')
      ) {
        solution = '💡 Build Magnetic Shield Generator to deflect!';
      } else if (
        currentProblem.includes('Solar flare') ||
        currentProblem.includes('Solar Flare')
      ) {
        solution = '💡 Build Magnetic Shield ($900)!';
      } else if (currentProblem.includes('Meteor') || currentProblem.includes('meteor')) {
        solution = '💡 Build Magnetic Shield Generator!';
      } else {
        solution = '💡 Check your resources, Captain!';
      }

      setMessage(solution);
      setVisible(true);
      setSolutionShown(true);
      setTimeout(() => {
        setVisible(false);
        setSolutionShown(false);
      }, 6000);
      return;
    }

    // 🆕 Tower hints
    if (towerDiscovered && towerInstalledParts?.length < 3) {
      const installed = towerInstalledParts?.length || 0;
      setMessage(`📡 Tower repair: ${installed}/3 parts installed. Craft parts at base and walk to tower!`);
      setVisible(true);
      setTimeout(() => setVisible(false), 6000);
      return;
    }

    // All good
    setMessage('💡 All systems stable, Captain! 🚀');
    setVisible(true);
    setTimeout(() => setVisible(false), 3000);
  };

  const dirBtnClass = (dir) =>
    `absolute w-14 h-14 rounded-lg flex items-center justify-center 
     border-4 shadow-2xl transition-all cursor-pointer
     ${
       walkDirection === dir
         ? 'bg-gradient-to-b from-green-400 to-green-600 border-yellow-300 scale-110'
         : 'bg-gradient-to-b from-cyan-400 to-cyan-600 border-white hover:scale-110'
     }`;

  return (
    <>
      {/* ═══════════ D-PAD (Bottom Right) ═══════════ */}
      <div className="absolute bottom-4 right-4 z-40 select-none">
        <div className="relative w-40 h-40">
          <button
            onClick={() => handleDirection('up')}
            className={`${dirBtnClass('up')} top-0 left-1/2 -translate-x-1/2`}
          >
            <span className="text-2xl text-white">▲</span>
          </button>

          <button
            onClick={() => handleDirection('left')}
            className={`${dirBtnClass('left')} top-1/2 left-0 -translate-y-1/2`}
          >
            <span className="text-2xl text-white">◄</span>
          </button>

          <button
            onClick={() => handleDirection('right')}
            className={`${dirBtnClass('right')} top-1/2 right-0 -translate-y-1/2`}
          >
            <span className="text-2xl text-white">►</span>
          </button>

          <button
            onClick={() => handleDirection('down')}
            className={`${dirBtnClass('down')} bottom-0 left-1/2 -translate-x-1/2`}
          >
            <span className="text-2xl text-white">▼</span>
          </button>

          {/* CENTER — NEXA */}
          <button
            onClick={handleNEXA}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                       w-16 h-16 rounded-full flex items-center justify-center 
                       border-4 border-white shadow-2xl 
                       hover:scale-110 active:scale-95 transition-all cursor-pointer
                       ${
                         activeWarning || currentProblem
                           ? 'bg-gradient-to-br from-red-500 via-red-600 to-red-800 animate-pulse'
                           : 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600'
                       }`}
          >
            <span className="text-2xl">
              {activeWarning && warningEscalation >= 2
                ? '😡'
                : activeWarning || currentProblem
                ? '😠'
                : '🤖'}
            </span>
            {(currentProblem || activeWarning) && (
              <>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-ping" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
              </>
            )}
          </button>
        </div>

        {walkDirection && walkDirection !== 'stop' && (
          <div className="mt-2 text-center">
            <span className="inline-block bg-green-500/90 text-white text-[10px] font-bold px-3 py-1 rounded-full animate-pulse">
              🚶 WALKING {walkDirection.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* ═══════════ WARNING BANNER ═══════════ */}
      {activeWarning && !quizActive && (
        <div className="absolute top-32 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-md">
          <div
            className="rounded-2xl p-4 shadow-2xl border-4 animate-pulse"
            style={{
              background: `linear-gradient(135deg, ${activeWarning.color}DD, ${activeWarning.color}99)`,
              borderColor: activeWarning.color,
            }}
          >
            <div className="flex items-center gap-3">
              <div className="text-4xl animate-bounce">{activeWarning.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-black tracking-wider mb-0.5">
                  ⚠️ {activeWarning.title}
                </p>
                <p className="text-white/95 text-xs leading-tight mb-1">
                  {activeWarning.message}
                </p>
                <p className="text-yellow-200 text-[10px] font-bold">
                  {activeWarning.solution}
                </p>
              </div>
              <div className="flex flex-col items-center bg-black/40 rounded-xl px-3 py-2 border-2 border-white/30">
                <span className="text-white text-[9px] font-bold tracking-wider">
                  TIME
                </span>
                <span
                  className={`text-2xl font-black ${
                    activeWarning.timeLeft <= 5
                      ? 'text-red-300 animate-ping'
                      : activeWarning.timeLeft <= 10
                      ? 'text-yellow-300'
                      : 'text-white'
                  }`}
                >
                  {activeWarning.timeLeft}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ MESSAGE POPUP ═══════════ */}
      {visible && message && !quizActive && (
        <div className="absolute right-[300px] top-[35%] -translate-y-1/2 z-40 w-[280px] max-w-[280px]">
          <div
            className={`backdrop-blur-lg rounded-2xl p-3 shadow-2xl border-2 flex items-start gap-2
              ${
                activeWarning && warningEscalation >= 2
                  ? 'bg-gradient-to-br from-red-600/95 to-red-800/95 border-red-300'
                  : activeWarning
                  ? 'bg-gradient-to-br from-orange-500/95 to-red-600/95 border-orange-300'
                  : 'bg-gradient-to-br from-cyan-500/95 to-blue-600/95 border-cyan-300'
              }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 border-white flex-shrink-0
                ${
                  activeWarning
                    ? 'bg-gradient-to-br from-red-300 to-red-500'
                    : 'bg-gradient-to-br from-gray-200 to-gray-400'
                }`}
            >
              <span className="text-xl">
                {activeWarning && warningEscalation >= 2
                  ? '😡'
                  : activeWarning
                  ? '😠'
                  : '🤖'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-[9px] font-black tracking-wider mb-0.5">
                NEXA AI {activeWarning && warningEscalation >= 2 && '— FURIOUS'}
                {activeWarning && warningEscalation === 1 && '— ANGRY'}
              </p>
              <p className="text-white text-xs leading-tight">{message}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}