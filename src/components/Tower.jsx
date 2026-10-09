// src/components/Tower.jsx
// Deep Space Signal Decoder — 3D tower with repair progress + beacon
import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';
import { playSound } from '../audio/soundManager';
import {
  TOWER_POSITION,
  TOWER_REPAIR_DISTANCE,
  TOWER_PARTS,
  getNextPart,
  getRepairProgress,
  isTowerComplete,
  TOWER_MESSAGES,
  TOWER_BEACON_HEIGHT,
} from '../data/towerData';

export default function Tower({ robotPositionRef }) {
  const installedParts = useGameStore((s) => s.towerInstalledParts) || [];
  const craftPart = useGameStore((s) => s.craftTowerPart);

  const [near, setNear] = useState(false);
  const [repairFlash, setRepairFlash] = useState(false);
  const [justDiscovered, setJustDiscovered] = useState(false);

  const towerRef = useRef();
  const antennaRef = useRef();
  const beaconRef = useRef();
  const beaconLightRef = useRef();

  const progress = getRepairProgress(installedParts);
  const isComplete = isTowerComplete(installedParts);
  const nextPart = getNextPart(installedParts);

  // ═══════════════════════════════════════════════════════
  // ANIMATION
  // ═══════════════════════════════════════════════════════
  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (towerRef.current) {
      towerRef.current.rotation.y = Math.sin(t * 0.3) * 0.05;
    }

    if (antennaRef.current && progress >= 33) {
      antennaRef.current.rotation.y += 0.02;
    }

    // Beacon pulse
    if (beaconRef.current) {
      const pulse = 0.6 + Math.sin(t * 3) * 0.4;
      beaconRef.current.material.opacity = 0.4 + pulse * 0.4;
      beaconRef.current.material.emissiveIntensity = 0.8 + pulse * 1.2;
    }

    if (beaconLightRef.current) {
      beaconLightRef.current.intensity = 2 + Math.sin(t * 3) * 1.5;
    }
  });

  // ═══════════════════════════════════════════════════════
  // PROXIMITY — repair when robot reaches
  // ═══════════════════════════════════════════════════════
  useEffect(() => {
    const interval = setInterval(() => {
      if (!robotPositionRef?.current || isComplete) return;

      const dx = robotPositionRef.current.x - TOWER_POSITION[0];
      const dz = robotPositionRef.current.z - TOWER_POSITION[2];
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < TOWER_REPAIR_DISTANCE) {
        setNear(true);

        if (!justDiscovered && installedParts.length === 0) {
          setJustDiscovered(true);
          useGameStore.getState().setProblem(TOWER_MESSAGES.discovered.text);
        }

        // Auto-install next part if carrying it
        if (nextPart && useGameStore.getState().towerPartsCarried?.includes(nextPart.id)) {
          handleInstallPart(nextPart);
        }
      } else if (dist < 12) {
        setNear(true);
      } else {
        setNear(false);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [installedParts, isComplete, nextPart, justDiscovered, robotPositionRef]);

  const handleInstallPart = (part) => {
    playSound('victory');
    setRepairFlash(true);
    setTimeout(() => setRepairFlash(false), 800);
    useGameStore.getState().installTowerPart(part.id);
  };

  // ═══════════════════════════════════════════════════════
  // COLOR
  // ═══════════════════════════════════════════════════════
  const progressColor =
    progress === 100
      ? '#4ADE80'
      : progress >= 66
      ? '#FBBF24'
      : progress >= 33
      ? '#FB923C'
      : '#EF4444';

  return (
    <group position={TOWER_POSITION}>
      {/* ═══════════ HUGE BEACON (always visible from far) ═══════════ */}
      <mesh ref={beaconRef} position={[0, TOWER_BEACON_HEIGHT / 2, 0]}>
        <cylinderGeometry args={[0.3, 0.8, TOWER_BEACON_HEIGHT, 8]} />
        <meshBasicMaterial
          color={progressColor}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Beacon top sphere */}
      <mesh position={[0, TOWER_BEACON_HEIGHT, 0]}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial color={progressColor} />
      </mesh>

      {/* Beacon light */}
      <pointLight
        ref={beaconLightRef}
        position={[0, TOWER_BEACON_HEIGHT, 0]}
        intensity={3}
        distance={200}
        color={progressColor}
      />

      {/* ═══════════ BASE PLATFORM ═══════════ */}
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <cylinderGeometry args={[2.5, 2.8, 0.3, 16]} />
        <meshStandardMaterial color="#5C5C5C" metalness={0.5} roughness={0.6} />
      </mesh>

      {/* ═══════════ TOWER BODY ═══════════ */}
      <group ref={towerRef}>
        <mesh position={[0, 4, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.5, 7, 8]} />
          <meshStandardMaterial color="#8B7355" metalness={0.6} roughness={0.5} />
        </mesh>

        {[2, 3.5, 5, 6.5].map((y, i) => (
          <mesh key={i} position={[0, y, 0]}>
            <boxGeometry args={[1.2, 0.1, 1.2]} />
            <meshStandardMaterial color="#5C5C5C" metalness={0.7} />
          </mesh>
        ))}

        {[0, 1, 2, 3].map((angle) => {
          const rad = (angle / 4) * Math.PI * 2;
          return (
            <mesh
              key={`strut-${angle}`}
              position={[Math.cos(rad) * 0.7, 4, Math.sin(rad) * 0.7]}
              rotation={[0, -rad, 0.15]}
              castShadow
            >
              <cylinderGeometry args={[0.05, 0.05, 6.5, 6]} />
              <meshStandardMaterial color="#424242" metalness={0.8} />
            </mesh>
          );
        })}

        {/* Antenna Dish */}
        {progress >= 33 ? (
          <group ref={antennaRef} position={[0, 8, 0]}>
            <mesh rotation={[Math.PI / 4, 0, 0]}>
              <sphereGeometry args={[1.5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial
                color="#E0E0E0"
                metalness={0.9}
                roughness={0.2}
                side={THREE.DoubleSide}
              />
            </mesh>
            <mesh position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 1, 6]} />
              <meshStandardMaterial color="#FF4500" />
            </mesh>
          </group>
        ) : (
          <group position={[1.2, 7.5, 0]} rotation={[0, 0, Math.PI / 3]}>
            <mesh>
              <sphereGeometry args={[1.5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#666" metalness={0.5} side={THREE.DoubleSide} />
            </mesh>
          </group>
        )}

        {/* Power Core */}
        {progress >= 66 && (
          <group position={[0, 4.5, 0]}>
            <mesh>
              <cylinderGeometry args={[0.7, 0.7, 0.5, 16]} />
              <meshStandardMaterial
                color="#FFD54F"
                emissive="#FFD54F"
                emissiveIntensity={0.6}
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            <pointLight position={[0, 0.5, 0]} intensity={1.5} distance={6} color="#FFD54F" />
          </group>
        )}

        {/* Signal Chip beacon */}
        {progress >= 100 && (
          <mesh position={[0, 8.8, 0]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial color="#4ADE80" emissive="#4ADE80" emissiveIntensity={1} />
          </mesh>
        )}
      </group>

      {/* ═══════════ PROGRESS RING ═══════════ */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.32, 0]}>
        <ringGeometry args={[2.4, 2.7, 32, 1, 0, (progress / 100) * Math.PI * 2]} />
        <meshBasicMaterial color={progressColor} />
      </mesh>

      {/* ═══════════ REPAIR FLASH ═══════════ */}
      {repairFlash && (
        <pointLight position={[0, 5, 0]} intensity={8} distance={15} color="#FFFFFF" />
      )}

      {/* ═══════════ PROXIMITY POPUP ═══════════ */}
      {near && !isComplete && (
        <Html center distanceFactor={20} position={[0, 12, 0]}>
          <div className="bg-black/90 backdrop-blur text-white p-3 rounded-xl border-2 border-cyan-500 w-72 text-center">
            <p className="font-black text-sm">📡 NASA Tower</p>
            <p className="text-xs text-cyan-300 mt-1">Repair: {progress}%</p>

            {nextPart ? (
              <div className="mt-2 bg-yellow-500/20 rounded-lg p-2 border border-yellow-400/50">
                <p className="text-[10px] text-yellow-200 font-bold">
                  Next: {nextPart.icon} {nextPart.name}
                </p>
                <p className="text-[10px] text-white/70">
                  Craft at base: ${nextPart.cost}
                </p>
              </div>
            ) : (
              <p className="text-xs text-green-400 font-bold mt-2">✅ SIGNAL LOCKED!</p>
            )}
          </div>
        </Html>
      )}

      {/* Complete popup */}
      {isComplete && (
        <Html center distanceFactor={20} position={[0, 12, 0]}>
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-4 rounded-xl border-4 border-green-300 w-80 text-center animate-pulse shadow-2xl">
            <p className="text-3xl mb-1">🛰️</p>
            <p className="font-black text-lg">SIGNAL LOCKED!</p>
            <p className="text-xs mt-1">Earth is receiving your message!</p>
          </div>
        </Html>
      )}

      {/* 4-Point lights */}
      {progress >= 66 && (
        <>
          {[0, 1, 2, 3].map((i) => {
            const rad = (i / 4) * Math.PI * 2;
            return (
              <mesh key={`beacon-${i}`} position={[Math.cos(rad) * 2.2, 0.5, Math.sin(rad) * 2.2]}>
                <sphereGeometry args={[0.15, 8, 8]} />
                <meshBasicMaterial color={isComplete ? '#4ADE80' : '#FFD54F'} />
              </mesh>
            );
          })}
        </>
      )}
    </group>
  );
}