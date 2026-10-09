import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/gameStore';

export default function MagneticShield() {
  const buildings = useGameStore((s) => s.buildings);
  const activeDisaster = useGameStore((s) => s.activeDisaster);
  const shieldRef = useRef();

  // Check if player has built Magnetic Shield
  const hasShield = buildings.some((b) => b.id === 'shield');
  const isMeteorActive = activeDisaster === 'meteor';

  useFrame((state) => {
    if (shieldRef.current && hasShield) {
      // Pulsing effect
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.02;
      shieldRef.current.scale.set(pulse, pulse, pulse);

      // Slow rotation
      shieldRef.current.rotation.y += 0.005;
    }
  });

  if (!hasShield) return null;

  return (
    <mesh ref={shieldRef} position={[0, 5, 0]}>
      <sphereGeometry args={[25, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshBasicMaterial
        color="#00BFFF"
        transparent
        opacity={isMeteorActive ? 0.35 : 0.15}
        side={2}
        wireframe={false}
      />
    </mesh>
  );
}