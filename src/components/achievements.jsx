import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

export default function Achievements() {
  const buildings = useGameStore((s) => s.buildings) || [];
  const score = useGameStore((s) => s.score) || 0;
  const missionDay = useGameStore((s) => s.missionDay) || 1;
  const achievements = useGameStore((s) => s.achievements) || [];
  const unlockAchievement = useGameStore((s) => s.unlockAchievement);

  useEffect(() => {
    if (!unlockAchievement) return;

    // Check achievements on every state change
    if (buildings.length >= 1 && !achievements.find((a) => a.id === 'first_build')) {
      unlockAchievement('first_build', 'First Builder', '🔨');
    }
    if (buildings.length >= 5 && !achievements.find((a) => a.id === 'five_builds')) {
      unlockAchievement('five_builds', 'Colony Architect', '🏗️');
    }
    if (buildings.length >= 10 && !achievements.find((a) => a.id === 'ten_builds')) {
      unlockAchievement('ten_builds', 'Mars Mayor', '🏙️');
    }
    if (missionDay >= 2 && !achievements.find((a) => a.id === 'day2')) {
      unlockAchievement('day2', 'Survivor', '⏳');
    }
    if (score >= 1000 && !achievements.find((a) => a.id === 'score1000')) {
      unlockAchievement('score1000', 'High Scorer', '⭐');
    }
  }, [buildings, score, missionDay, achievements, unlockAchievement]);

  // Show only recently unlocked (last 5 seconds)
  const recent = achievements.filter((a) => Date.now() - a.unlockedAt < 5000);

  if (recent.length === 0) return null;

  return (
    <div className="absolute top-32 right-8 z-40 space-y-2">
      {recent.map((a) => (
        <div
          key={a.id}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 
                     rounded-xl px-4 py-3 shadow-2xl border-2 border-yellow-300"
          style={{ animation: 'slideIn 0.5s ease-out' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">{a.icon}</span>
            <div>
              <p className="text-white text-[10px] font-bold tracking-wider">
                ACHIEVEMENT UNLOCKED
              </p>
              <p className="text-white text-sm font-bold">{a.name}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}