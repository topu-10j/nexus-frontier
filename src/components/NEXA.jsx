import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { playSound } from '../audio/soundManager';
import { 
  getNEXAMessage, 
  getDisasterMessage, 
  getVictoryMessage, 
  getDefeatMessage 
} from '../services/nexaAI';

export default function NEXA() {
  const { 
    oxygen, power, temperature, radiation, budget, buildings, 
    activeDisaster, missionStatus, deathReason 
  } = useGameStore();
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const msg = getNEXAMessage({ oxygen, power, temperature, radiation, budget, buildings });
      if (msg) {
        setMessage(msg);
        setVisible(true);
        playSound('nexa');
        setTimeout(() => setVisible(false), 6000);
      }
    }, 12000);
    return () => clearInterval(interval);
  }, [oxygen, power, temperature, radiation, budget, buildings]);

  useEffect(() => {
    if (activeDisaster) {
      setMessage(getDisasterMessage(activeDisaster));
      setVisible(true);
      playSound('nexa');
      setTimeout(() => setVisible(false), 5000);
    }
  }, [activeDisaster]);

  useEffect(() => {
    if (missionStatus === 'success') {
      setMessage(getVictoryMessage());
      setVisible(true);
      playSound('nexa');
    } else if (missionStatus === 'failed') {
      setMessage(getDefeatMessage(deathReason));
      setVisible(true);
      playSound('nexa');
    }
  }, [missionStatus, deathReason]);

  return (
    <div className="absolute bottom-4 left-4 z-30 pointer-events-none">
      {visible && message && (
        <div className="bg-gradient-to-br from-cyan-500/95 to-blue-600/95 backdrop-blur-lg rounded-2xl p-3 max-w-xs shadow-2xl border-2 border-cyan-300 flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-400 rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-bounce">
              <span className="text-2xl">🤖</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[10px] font-black tracking-wider mb-1">NEXA AI</p>
            <p className="text-white text-xs leading-tight">{message}</p>
          </div>
        </div>
      )}
    </div>
  );
}