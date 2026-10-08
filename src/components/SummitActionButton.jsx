import { useGameStore } from '../store/gameStore';

export default function SummitActionButton() {
  const { reachedSummit, flagPlanted, plantFlag } = useGameStore();

  if (!reachedSummit || flagPlanted) return null;

  return (
    <div className="absolute bottom-48 left-1/2 -translate-x-1/2 z-40">
      <button
        onClick={plantFlag}
        className="px-8 py-5 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 
                   text-white font-black rounded-2xl text-lg tracking-wider
                   border-4 border-white/40 shadow-2xl
                   hover:scale-110 active:scale-95 transition-all
                   animate-bounce"
      >
        🇧🇩 PLANT YOUR FLAG
      </button>
    </div>
  );
}