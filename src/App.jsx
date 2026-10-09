// src/App.jsx
import { useState, useEffect } from 'react';
import Landing from './components/Landing';
import UniverseMap from './components/UniverseMap';
import RocketLaunch from './components/RocketLaunch';
import MarsSurface from './components/MarsSurface';
import HUD from './components/HUD';
import BuildingPanel from './components/BuildingPanel';
import Achievements from './components/Achievements';
import MissionResult from './components/MissionResult';
import BackgroundMusic from './components/BackgroundMusic';
import NEXA from './components/NEXA';
import FunFactPopup from './components/FunFactPopup';
import Certificate from './components/Certificate';
import QuizModal from './components/QuizModal';
import DeathAnimation from './components/DeathAnimation';
import VictoryScreen from './components/VictoryScreen';
import { useGameStore } from './store/gameStore';
import { useAlertPunishment } from './hooks/useAlertPunishment';
import { useMeteorDamage } from './hooks/useMeteorDamage';
import { useDisasterSchedule } from './hooks/useDisasterSchedule';
import { useDayCycle } from './hooks/useDayCycle';
import { playSound } from './audio/soundManager';

export default function App() {
  const [stage, setStage] = useState('landing');
  const [planet, setPlanet] = useState(null);
  const [musicStarted, setMusicStarted] = useState(false);
  const [showCert, setShowCert] = useState(false);
  const [showVictory, setShowVictory] = useState(false);

  const { resetGame, missionStatus, setMarsLoaded, marsLoaded } = useGameStore();

  // ═══════════════════════════════════════════════════════
  // GLOBAL HOOKS — они self-gate via marsLoaded flag
  // ═══════════════════════════════════════════════════════
  useAlertPunishment();
  useMeteorDamage();
  useDisasterSchedule();
  useDayCycle();

  // ═══════════════════════════════════════════════════════
  // 🎯 TRIGGER timers ONLY when stage = 'mars'
  // ═══════════════════════════════════════════════════════
  useEffect(() => {
    if (stage === 'mars' && !marsLoaded) {
      const timer = setTimeout(() => {
        setMarsLoaded();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [stage, marsLoaded, setMarsLoaded]);

  // ═══════════════════════════════════════════════════════
  // VICTORY / DEFEAT HANDLER
  // ═══════════════════════════════════════════════════════
  useEffect(() => {
    if (missionStatus === 'success') {
      playSound('victory');
      setTimeout(() => setShowVictory(true), 800);
    } else if (missionStatus === 'failed') {
      playSound('hazard');
    }
  }, [missionStatus]);

  const handleEnter = () => {
    playSound('click');
    setMusicStarted(true);
    setStage('map');
  };

  const handleRestart = () => {
    playSound('click');
    resetGame();
    setStage('landing');
    setPlanet(null);
    setShowCert(false);
    setShowVictory(false);
  };

  return (
    <>
      <BackgroundMusic started={musicStarted} />

      {stage === 'landing' && <Landing onEnter={handleEnter} />}

      {stage === 'map' && (
        <UniverseMap
          onPlanetSelect={(p) => {
            setPlanet(p);
            setStage('launch');
          }}
        />
      )}

      {stage === 'launch' && (
        <RocketLaunch planet={planet} onComplete={() => setStage('mars')} />
      )}

      {stage === 'mars' && (
        <div className="relative h-screen w-screen">
          <MarsSurface />
          <HUD />
          <BuildingPanel />
          <NEXA />
          <Achievements />
          <FunFactPopup trigger={0} />
          <MissionResult onRestart={handleRestart} />
        </div>
      )}

      <QuizModal />
      <DeathAnimation />

      {showVictory && (
        <VictoryScreen
          onShowCertificate={() => {
            setShowVictory(false);
            setShowCert(true);
          }}
          onRestart={handleRestart}
        />
      )}

      {showCert && <Certificate onClose={() => setShowCert(false)} />}
    </>
  );
}