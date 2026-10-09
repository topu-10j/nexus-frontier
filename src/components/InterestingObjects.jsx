// src/components/InterestingObjects.jsx
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';
import { playSound } from '../audio/soundManager';

function ObjectModel({ type, found }) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current || found) return;
    ref.current.rotation.y += 0.02;
    ref.current.position.y = 0.6 + Math.sin(state.clock.elapsedTime * 2) * 0.15;
  });

  if (found) {
    return (
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial color="#444444" />
      </mesh>
    );
  }

  return (
    <group ref={ref} position={[0, 0.6, 0]}>
      {type === 'crystal' && (
        <mesh>
          <octahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial
            color="#00FFFF"
            emissive="#00FFFF"
            emissiveIntensity={0.8}
            metalness={0.8}
            roughness={0.1}
          />
        </mesh>
      )}

      {type === 'skull' && (
        <group>
          <mesh>
            <sphereGeometry args={[0.4, 12, 12]} />
            <meshStandardMaterial color="#E8DCC4" roughness={0.9} />
          </mesh>
          <mesh position={[-0.15, 0.05, 0.35]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
          <mesh position={[0.15, 0.05, 0.35]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
        </group>
      )}

      {type === 'meteor' && (
        <mesh>
          <dodecahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial
            color="#4A2C1A"
            emissive="#FF4500"
            emissiveIntensity={0.4}
            roughness={0.9}
          />
        </mesh>
      )}

      {type === 'mushroom' && (
        <group>
          <mesh position={[0, -0.15, 0]}>
            <cylinderGeometry args={[0.1, 0.15, 0.4, 8]} />
            <meshStandardMaterial color="#F5F5DC" />
          </mesh>
          <mesh position={[0, 0.15, 0]}>
            <sphereGeometry args={[0.35, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#FF1493" emissive="#FF1493" emissiveIntensity={0.3} />
          </mesh>
        </group>
      )}

      {type === 'statue' && (
        <group>
          <mesh position={[0, -0.3, 0]}>
            <cylinderGeometry args={[0.3, 0.4, 0.3, 8]} />
            <meshStandardMaterial color="#8B7355" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[0.35, 0.7, 0.25]} />
            <meshStandardMaterial color="#A0896B" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.75, 0]}>
            <sphereGeometry args={[0.22, 12, 12]} />
            <meshStandardMaterial color="#A0896B" roughness={0.9} />
          </mesh>
        </group>
      )}

      {type === 'plant' && (
        <group>
          <mesh position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.05, 0.08, 0.4, 6]} />
            <meshStandardMaterial color="#2E8B57" />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <sphereGeometry args={[0.3, 12, 12]} />
            <meshStandardMaterial color="#00FF00" emissive="#00FF00" emissiveIntensity={0.4} />
          </mesh>
        </group>
      )}

      {type === 'debris' && (
        <group>
          <mesh>
            <boxGeometry args={[0.6, 0.3, 0.4]} />
            <meshStandardMaterial color="#A9A9A9" metalness={0.8} roughness={0.4} />
          </mesh>
          <mesh position={[0.3, 0.2, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.5, 6]} />
            <meshStandardMaterial color="#696969" />
          </mesh>
        </group>
      )}

      {type === 'volcano' && (
        <group>
          <mesh position={[0, -0.3, 0]}>
            <coneGeometry args={[0.5, 0.6, 12]} />
            <meshStandardMaterial color="#3B0A00" roughness={0.95} />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshBasicMaterial color="#FF4500" />
          </mesh>
        </group>
      )}

      {type === 'footprint' && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
          <circleGeometry args={[0.4, 16]} />
          <meshBasicMaterial color="#5C2E16" transparent opacity={0.7} />
        </mesh>
      )}

      {type === 'cave' && (
        <mesh position={[0, -0.15, 0]}>
          <sphereGeometry args={[0.6, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#2A1810" side={THREE.BackSide} />
        </mesh>
      )}
    </group>
  );
}

function InterestingObject({ obj, robotPositionRef }) {
  const [near, setNear] = useState(false);
  const foundRef = useRef(false);
  const findInterestingObject = useGameStore((s) => s.findInterestingObject);
  const unlockAchievement = useGameStore((s) => s.unlockAchievement);

  useFrame(() => {
    if (obj.found || !robotPositionRef?.current || foundRef.current) return;
    const dx = robotPositionRef.current.x - obj.position[0];
    const dz = robotPositionRef.current.z - obj.position[2];
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist < 4) setNear(true);
    else setNear(false);

    if (dist < 1.5) {
      foundRef.current = true;
      findInterestingObject(obj.id);
      unlockAchievement(`obj_${obj.id}`, `Found ${obj.name}`, obj.icon);
      playSound('victory');
    }
  });

  return (
    <group position={[obj.position[0], 0, obj.position[2]]}>
      <ObjectModel type={obj.type} found={obj.found} />

      {!obj.found && (
        <pointLight
          position={[0, 1.5, 0]}
          intensity={near ? 2 : 1}
          distance={6}
          color="#00FFFF"
        />
      )}

      {near && !obj.found && (
        <Html center distanceFactor={15}>
          <div className="bg-black/90 text-white px-3 py-2 rounded-lg border-2 border-cyan-400 text-center whitespace-nowrap">
            <p className="font-bold text-xs">
              {obj.icon} {obj.name}
            </p>
            <p className="text-[10px] text-yellow-300">+${obj.reward}</p>
            <p className="text-[9px] text-cyan-300 mt-0.5">Walk closer!</p>
          </div>
        </Html>
      )}
    </group>
  );
}

export default function InterestingObjects({ robotPositionRef }) {
  const interestingObjects = useGameStore((s) => s.interestingObjects);

  return (
    <group>
      {interestingObjects.map((obj) => (
        <InterestingObject
          key={obj.id}
          obj={obj}
          robotPositionRef={robotPositionRef}
        />
      ))}
    </group>
  );
}