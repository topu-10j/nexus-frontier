import { useState, useEffect } from 'react';
import Landing from './components/Landing';
import UniverseMap from './components/UniverseMap';
import RocketLaunch from './components/RocketLaunch';
import MarsSurface from './components/MarsSurface';
import HUD from './components/HUD';
import BuildingPanel from './components/BuildingPanel';
import MissionBar from './components/MissionBar';
import DisasterAlert from './components/DisasterAlert';
import Achievements from './components/Achievements';
import MissionResult from './components/MissionResult';
import SummitActionButton from './components/SummitActionButton';
import BackgroundMusic from './components/BackgroundMusic';
import NEXA from './components/NEXA';
import FunFactPopup from './components/FunFactPopup';
import Certificate from './components/Certificate';
import { useGameStore } from './store/gameStore';
import { playSound } from './audio/soundManager';

export default function App() {
  const [stage, setStage] = useState('landing');
  const [planet, setPlanet] = useState(null);
  const [musicStarted, setMusicStarted] = useState(false);
  const [showCert, setShowCert] = useState(false);
  const { resetGame, missionStatus, buildings } = useGameStore();

  useEffect(() => {
    if (missionStatus === 'success') {
      playSound('victory');
      setTimeout(() => setShowCert(true), 3000);
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
  };

  return (
    <>
      <BackgroundMusic started={musicStarted} />

      {stage === 'landing' && <Landing onEnter={handleEnter} />}

      {stage === 'map' && (
        <UniverseMap onPlanetSelect={(p) => { setPlanet(p); setStage('launch'); }} />
      )}

      {stage === 'launch' && (
        <RocketLaunch planet={planet} onComplete={() => setStage('mars')} />
      )}

      {stage === 'mars' && (
        <div className="relative h-screen w-screen">
          <MarsSurface />
          <HUD />
          <BuildingPanel />
          <MissionBar />
          <DisasterAlert />
          <Achievements />
          <SummitActionButton />
          <NEXA />
          <FunFactPopup trigger={buildings.length} />
          <MissionResult onRestart={handleRestart} />
        </div>
      )}

      {showCert && <Certificate onClose={() => setShowCert(false)} />}
    </>
  );
}