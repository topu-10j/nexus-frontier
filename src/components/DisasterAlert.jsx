import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { playSound } from '../audio/soundManager';

const disasters = {
  sandstorm: {
    icon: '🌪️',
    title: 'SANDSTORM',
    action: 'Build Power Grid!',
    color: 'from-orange-600 to-yellow-600',
    border: 'border-orange-400',
  },
  solarFlare: {
    icon: '☀️',
    title: 'SOLAR FLARE',
    action: 'Build Magnetic Shield!',
    color: 'from-red-600 to-orange-600',
    border: 'border-red-400',
  },
  meteor: {
    icon: '☄️',
    title: 'METEOR SHOWER',
    action: 'Build Oxygen Generator!',
    color: 'from-purple-600 to-pink-600',
    border: 'border-purple-400',
  },
};

export default function DisasterAlert() {
  const { activeDisaster, disasterTimer, triggerDisaster, clearDisaster } = useGameStore();

  useEffect(() => {
    const interval = setInterval(() => {
      const types = ['sandstorm', 'solarFlare', 'meteor'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      playSound('hazard');
      triggerDisaster(randomType);
    }, 30000 + Math.random() * 15000);
    return () => clearInterval(interval);
  }, [triggerDisaster]);

  useEffect(() => {
    if (!activeDisaster) return;
    if (disasterTimer <= 0) {
      clearDisaster();
      return;
    }
    const timer = setTimeout(() => {
      useGameStore.setState({ disasterTimer: disasterTimer - 1 });
    }, 1000);
    return () => clearTimeout(timer);
  }, [disasterTimer, activeDisaster, clearDisaster]);

  if (!activeDisaster) return null;

  const info = disasters[activeDisaster];

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
      <div
        className={`bg-gradient-to-r ${info.color} rounded-xl px-5 py-3 
                   border-2 ${info.border} shadow-2xl max-w-lg`}
        style={{ animation: 'shake 0.5s ease-in-out infinite' }}
      >
        <div className="flex items-center gap-3">
          <span className="text-4xl animate-bounce">{info.icon}</span>
          <div className="flex-1">
            <h3 className="text-white text-sm font-black tracking-wider">
              {info.title}
            </h3>
            <p className="text-white/95 text-xs font-bold mt-0.5">
              ⚡ {info.action}
            </p>
          </div>
          <div className="bg-black/40 px-3 py-1 rounded-full">
            <span className="text-white font-bold text-xs">⏱️ {disasterTimer}s</span>
          </div>
        </div>
      </div>
    </div>
  );
}