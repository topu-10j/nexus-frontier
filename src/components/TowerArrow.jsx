// src/components/TowerArrow.jsx
// 3D floating arrow above robot pointing to tower
// MUST be rendered INSIDE <Canvas>
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';
import { TOWER_POSITION } from '../data/towerData';

export default function TowerArrow({ robotPositionRef }) {
  const arrowRef = useRef();
  const [visible, setVisible] = useState(false);

  const towerCompleted = useGameStore((s) => s.towerCompleted);
  const robotHasMoved = useGameStore((s) => s.robotHasMoved);
  const marsLoaded = useGameStore((s) => s.marsLoaded);

  useFrame((state) => {
    if (!robotPositionRef?.current || towerCompleted || !robotHasMoved || !marsLoaded) {
      if (visible) setVisible(false);
      return;
    }

    const rx = robotPositionRef.current.x;
    const rz = robotPositionRef.current.z;

    const dx = TOWER_POSITION[0] - rx;
    const dz = TOWER_POSITION[2] - rz;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist < 15) {
      if (visible) setVisible(false);
      return;
    }

    if (!visible) setVisible(true);

    if (arrowRef.current) {
      // Position above robot's head
      arrowRef.current.position.x = rx;
      arrowRef.current.position.y =
        3.5 + Math.sin(state.clock.elapsedTime * 3) * 0.15;
      arrowRef.current.position.z = rz;

      // Point at tower (rotate around Y axis)
      const angle = Math.atan2(dx, dz);
      arrowRef.current.rotation.y = angle;
    }
  });

  if (!visible) return null;

  return (
    <group ref={arrowRef}>
      {/* Arrow cone (pointing forward = +Z) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.4]}>
        <coneGeometry args={[0.35, 0.9, 4]} />
        <meshBasicMaterial color="#00FFFF" />
      </mesh>

      {/* Arrow shaft */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.1]}>
        <cylinderGeometry args={[0.12, 0.12, 0.6, 8]} />
        <meshBasicMaterial color="#00FFFF" />
      </mesh>

      {/* Glow */}
      <pointLight intensity={1.5} distance={4} color="#00FFFF" />

      {/* Bobbing indicator ring below arrow */}
      <mesh position={[0, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.6, 16]} />
        <meshBasicMaterial color="#00FFFF" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}