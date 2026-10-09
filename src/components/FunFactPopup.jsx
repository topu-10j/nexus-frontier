import { useState, useEffect } from 'react';

const FACTS = [
  "Kepler-186f is 500 light-years away!",
  "On TRAPPIST-1e, a year lasts only 6 Earth days!",
  "TOI-700 d might have liquid water!",
  "Mars has the largest volcano in the solar system!",
  "A day on Venus is longer than its year!",
  "Light from the Sun takes 8 minutes to reach Earth.",
  "There are more stars than grains of sand on Earth.",
];

export default function FunFactPopup({ trigger }) {
  const [fact, setFact] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (trigger) {
      setFact(FACTS[Math.floor(Math.random() * FACTS.length)]);
      setVisible(true);
      setTimeout(() => setVisible(false), 5000);
    }
  }, [trigger]);

  if (!visible || !fact) return null;

  return (
    <div className="absolute top-32 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
      <div className="bg-gradient-to-r from-purple-600/95 to-pink-600/95 backdrop-blur-lg px-5 py-3 rounded-2xl shadow-2xl border-2 border-purple-300 max-w-md">
        <p className="text-white text-xs font-bold text-center">💡 Did you know?</p>
        <p className="text-white text-[11px] text-center mt-1">{fact}</p>
      </div>
    </div>
  );
}