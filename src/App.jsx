import { useState } from 'react';
import Landing from './components/Landing';
import UniverseMap from './components/UniverseMap';
import RocketLaunch from './components/RocketLaunch';
import MarsSurface from './components/MarsSurface';

export default function App() {
  const [stage, setStage] = useState('landing');
  const [planet, setPlanet] = useState(null);

  return (
    <>
      {stage === 'landing' && (
        <Landing onEnter={() => setStage('map')} />
      )}

      {stage === 'map' && (
        <UniverseMap
          onPlanetSelect={(p) => {
            setPlanet(p);
            setStage('launch');
          }}
        />
      )}

      {stage === 'launch' && (
        <RocketLaunch
          planet={planet}
          onComplete={() => setStage('mars')}
        />
      )}

      {stage === 'mars' && (
        <MarsSurface />
      )}
    </>
  );
}