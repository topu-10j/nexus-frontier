import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';

export default function MeteorShower({ buildings }) {
  const activeDisaster = useGameStore((s) => s.activeDisaster);
  const meteorRef = useRef(null);

  // 15 meteors with random positions
  const meteorData = useMemo(() => {
    return [...Array(15)].map(() => ({
      startX: (Math.random() - 0.5) * 40,
      startY: 20 + Math.random() * 10,
      startZ: (Math.random() - 0.5) * 40,
      speed: 0.3 + Math.random() * 0.4,
      size: 0.15 + Math.random() * 0.25,
      offset: Math.random() * 10,
    }));
  }, []);

  const meteorRefs = useRef([]);

  useFrame((state) => {
    if (activeDisaster !== 'meteor') return;

    meteorRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const data = meteorData[i];

      // Move downward
      mesh.position.y -= data.speed;

      // Reset when hits ground
      if (mesh.position.y < -1) {
        mesh.position.set(data.startX, data.startY, data.startZ);
      }
    });
  });

  if (activeDisaster !== 'meteor') return null;

  return (
    <>
      {meteorData.map((data, i) => (
        <group
          key={i}
          ref={(el) => (meteorRefs.current[i] = el)}
          position={[data.startX, data.startY, data.startZ]}
        >
          {/* Meteor body */}
          <mesh>
            <sphereGeometry args={[data.size, 8, 8]} />
            <meshBasicMaterial color="#FF4500" />
          </mesh>

          {/* Glow */}
          <mesh>
            <sphereGeometry args={[data.size * 2, 8, 8]} />
            <meshBasicMaterial color="#FF6600" transparent opacity={0.4} />
          </mesh>

          {/* Trail */}
          <mesh position={[0, data.size * 3, 0]}>
            <coneGeometry args={[data.size * 0.5, data.size * 6, 8]} />
            <meshBasicMaterial color="#FFAA00" transparent opacity={0.6} />
          </mesh>
        </group>
      ))}

      {/* Red ambient light during meteor shower */}
      <pointLight position={[0, 15, 0]} intensity={2} color="#FF4500" />
    </>
  );
}