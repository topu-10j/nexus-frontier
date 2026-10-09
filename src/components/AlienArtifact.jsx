import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useGameStore } from '../store/gameStore';
import { playSound } from '../audio/soundManager';

export default function AlienArtifact({ astronautPosition }) {
  const [near, setNear] = useState(false);
  const artifactRef = useRef();

  const alienArtifactFound = useGameStore((s) => s.alienArtifactFound);
  const alienArtifactPosition = useGameStore((s) => s.alienArtifactPosition);
  const findAlienArtifact = useGameStore((s) => s.findAlienArtifact);

  // Floating animation
  useFrame((state) => {
    if (artifactRef.current) {
      artifactRef.current.position.y = -0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      artifactRef.current.rotation.y += 0.03;
      artifactRef.current.rotation.x += 0.02;
    }
  });

  // Proximity detection
  useFrame(() => {
    if (alienArtifactFound || !astronautPosition || !artifactRef.current) return;

    const dx = astronautPosition.x - alienArtifactPosition[0];
    const dz = astronautPosition.z - alienArtifactPosition[1];
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist < 4) {
      setNear(true);
      if (dist < 1.5) {
        playSound('victory');
        findAlienArtifact();
      }
    } else {
      setNear(false);
    }
  });

  if (alienArtifactFound) return null;

  return (
    <group
      ref={artifactRef}
      position={[alienArtifactPosition[0], -0.3, alienArtifactPosition[1]]}
    >
      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#00FF00" transparent opacity={0.2} />
      </mesh>

      {/* Main artifact — octahedron */}
      <mesh>
        <octahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial
          color="#00FF00"
          emissive="#00FF00"
          emissiveIntensity={near ? 2 : 0.8}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Inner core */}
      <mesh>
        <octahedronGeometry args={[0.3, 0]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>

      {/* Marker light above */}
      <mesh position={[0, 2, 0]}>
        <coneGeometry args={[0.2, 0.5, 8]} />
        <meshBasicMaterial color="#00FF00" transparent opacity={0.6} />
      </mesh>

      {near && (
        <Html center distanceFactor={12}>
          <div className="bg-black/90 text-white p-3 rounded-xl border-2 border-green-500 w-64 text-center animate-pulse">
            <p className="font-bold text-sm">👽 Alien Artifact!</p>
            <p className="text-xs text-green-300 mt-1">Walk closer to scan!</p>
            <p className="text-[10px] text-yellow-300 mt-1">+$2000 Bonus!</p>
          </div>
        </Html>
      )}
    </group>
  );
}