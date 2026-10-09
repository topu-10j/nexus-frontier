// src/components/MarsSurface.jsx
import { Canvas, useLoader, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import { useRef, useState, Suspense, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';
import MarsTerrain from './MarsTerrain';
import InterestingObjects from './InterestingObjects';
import Tower from './Tower';
import TowerTracker from './TowerTracker';
import TowerArrow from './TowerArrow';
import CraftingPanel from './CraftingPanel';
import AmbientFacts from './AmbientFacts';
import QuizButton from './QuizButton';
import DayPopup from './DayPopup';

// ═══════════════════════════════════════════════════════
// ============ ICE CRATERS ============
// ═══════════════════════════════════════════════════════
function IceCraters() {
  const iceCraters = useGameStore((s) => s.iceCraters);
  const mineIceCrater = useGameStore((s) => s.mineIceCrater);
  const [hovered, setHovered] = useState(null);

  return (
    <>
      {iceCraters.map((crater) => (
        <group key={crater.id} position={[crater.position[0], 0, crater.position[2]]}>
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            onPointerOver={() => setHovered(crater.id)}
            onPointerOut={() => setHovered(null)}
            onClick={() => !crater.mined && mineIceCrater(crater.id)}
            position={[0, 0.1, 0]}
          >
            <ringGeometry args={[1.5, 2, 32]} />
            <meshBasicMaterial
              color={crater.mined ? '#666666' : '#00D9FF'}
              transparent
              opacity={0.6}
            />
          </mesh>

          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[1.5, 1.5, 0.3, 16]} />
            <meshStandardMaterial
              color={crater.mined ? '#5C2E16' : '#B0E8FF'}
              emissive={crater.mined ? '#000000' : '#00D9FF'}
              emissiveIntensity={crater.mined ? 0 : 0.5}
            />
          </mesh>

          {hovered === crater.id && (
            <Html center distanceFactor={15}>
              <div className="bg-black/90 text-white p-3 rounded-xl border-2 border-cyan-500 w-56 text-center">
                <p className="font-bold text-sm">🧊 Ice Crater</p>
                <p className="text-xs text-cyan-300 mt-1">
                  {crater.mined ? 'Mined ✓' : 'Click to Mine ($1000)'}
                </p>
              </div>
            </Html>
          )}
        </group>
      ))}
    </>
  );
}

// ═══════════════════════════════════════════════════════
// ============ ALIEN ARTIFACT ============
// ═══════════════════════════════════════════════════════
function AlienArtifact({ robotPositionRef }) {
  const [near, setNear] = useState(false);
  const artifactRef = useRef();

  const alienArtifactFound = useGameStore((s) => s.alienArtifactFound);
  const alienArtifactPosition = useGameStore((s) => s.alienArtifactPosition);
  const findAlienArtifact = useGameStore((s) => s.findAlienArtifact);

  useFrame((state) => {
    if (artifactRef.current) {
      artifactRef.current.position.y = 0.4 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      artifactRef.current.rotation.y += 0.03;
      artifactRef.current.rotation.x += 0.02;
    }
  });

  useFrame(() => {
    if (alienArtifactFound || !robotPositionRef?.current) return;

    const dx = robotPositionRef.current.x - alienArtifactPosition[0];
    const dz = robotPositionRef.current.z - alienArtifactPosition[1];
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist < 4) {
      setNear(true);
      if (dist < 1.5) {
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
      position={[alienArtifactPosition[0], 0.4, alienArtifactPosition[1]]}
    >
      <mesh>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#00FF00" transparent opacity={0.2} />
      </mesh>
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
      <mesh>
        <octahedronGeometry args={[0.3, 0]} />
        <meshBasicMaterial color="#FFFFFF" />
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

// ═══════════════════════════════════════════════════════
// ============ METEOR SHOWER ============
// ═══════════════════════════════════════════════════════
function MeteorShower() {
  const activeDisaster = useGameStore((s) => s.activeDisaster);
  const meteorRefs = useRef([]);

  const meteorData = useMemo(() => {
    return [...Array(15)].map(() => ({
      startX: (Math.random() - 0.5) * 40,
      startY: 20 + Math.random() * 10,
      startZ: (Math.random() - 0.5) * 40,
      speed: 0.3 + Math.random() * 0.4,
      size: 0.15 + Math.random() * 0.25,
    }));
  }, []);

  useFrame(() => {
    if (activeDisaster !== 'meteor') return;

    meteorRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const data = meteorData[i];
      mesh.position.y -= data.speed;
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
          <mesh>
            <sphereGeometry args={[data.size, 8, 8]} />
            <meshBasicMaterial color="#FF4500" />
          </mesh>
          <mesh>
            <sphereGeometry args={[data.size * 2, 8, 8]} />
            <meshBasicMaterial color="#FF6600" transparent opacity={0.4} />
          </mesh>
        </group>
      ))}
      <pointLight position={[0, 15, 0]} intensity={2} color="#FF4500" />
    </>
  );
}

// ═══════════════════════════════════════════════════════
// ============ MAGNETIC SHIELD ============
// ═══════════════════════════════════════════════════════
function MagneticShield({ robotPositionRef }) {
  const buildings = useGameStore((s) => s.buildings);
  const activeDisaster = useGameStore((s) => s.activeDisaster);
  const shieldRef = useRef();
  const followRef = useRef();

  const hasShield = buildings.some((b) => b.id === 'shield');
  const isMeteorActive = activeDisaster === 'meteor';

  useFrame((state) => {
    if (shieldRef.current && hasShield) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.02;
      shieldRef.current.scale.set(pulse, pulse, pulse);
      shieldRef.current.rotation.y += 0.005;
    }
    if (followRef.current && robotPositionRef?.current) {
      followRef.current.position.x = robotPositionRef.current.x;
      followRef.current.position.z = robotPositionRef.current.z;
    }
  });

  if (!hasShield) return null;

  return (
    <group ref={followRef} position={[0, 0, 0]}>
      <mesh ref={shieldRef} position={[0, 5, 0]}>
        <sphereGeometry args={[15, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshBasicMaterial
          color="#00BFFF"
          transparent
          opacity={isMeteorActive ? 0.35 : 0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════════════════
// ============ ASTRONAUT ============
// ═══════════════════════════════════════════════════════
function Astronaut({ positionRef, rotationRef, setIsMoving }) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef();
  const walkCycle = useRef(0);
  const lastDrainTime = useRef(0);

  const walkingDrain = useGameStore((s) => s.walkingDrain);
  const missionStatus = useGameStore((s) => s.missionStatus);
  const walkDirection = useGameStore((s) => s.walkDirection);
  const activeDeath = useGameStore((s) => s.activeDeath);
  const quizActive = useGameStore((s) => s.quizActive);

  useFrame((state, delta) => {
    if (!groupRef.current || missionStatus !== 'active') return;
    if (activeDeath) return;
    if (quizActive) return;

    const dt = Math.min(delta, 0.05);
    const speed = 6;

    let moving = false;
    let dx = 0;
    let dz = 0;

    if (walkDirection === 'up')    dz = -1;
    if (walkDirection === 'down')  dz = 1;
    if (walkDirection === 'left')  dx = -1;
    if (walkDirection === 'right') dx = 1;

    if (dx !== 0 || dz !== 0) {
      moving = true;
      const len = Math.sqrt(dx * dx + dz * dz);
      dx /= len;
      dz /= len;

      positionRef.current.x += dx * speed * dt;
      positionRef.current.z += dz * speed * dt;

      const targetAngle = Math.atan2(dx, dz);
      const currentAngle = groupRef.current.rotation.y;
      let diff = targetAngle - currentAngle;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      groupRef.current.rotation.y += diff * Math.min(1, dt * 8);

      walkCycle.current += dt * 12;

      lastDrainTime.current += dt;
      if (lastDrainTime.current > 1) {
        walkingDrain();
        lastDrainTime.current = 0;
      }
    } else {
      walkCycle.current = 0;
    }

    // MASTER GATE
    if (moving) {
      const s = useGameStore.getState();
      if (!s.robotHasMoved) {
        s.markRobotMoved();
      }
    }

    setIsMoving(moving);
    rotationRef.current = groupRef.current.rotation.y;

    const bob = moving ? Math.abs(Math.sin(walkCycle.current)) * 0.05 : 0;
    groupRef.current.position.x = positionRef.current.x;
    groupRef.current.position.z = positionRef.current.z;
    groupRef.current.position.y = bob;
  });

  return (
    <group
      ref={groupRef}
      position={[0, 0, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh position={[0, 1.45, 0]} castShadow>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial color="#F5F5F5" metalness={0.5} roughness={0.15} />
      </mesh>

      <mesh position={[0, 1.45, 0.18]}>
        <sphereGeometry args={[0.27, 32, 32, 0, Math.PI * 2, 0.5, Math.PI * 0.6]} />
        <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.05} transparent opacity={0.85} />
      </mesh>

      <mesh position={[0, 0.85, 0]} castShadow>
        <capsuleGeometry args={[0.28, 0.55, 8, 16]} />
        <meshStandardMaterial color="#FAFAFA" metalness={0.2} roughness={0.6} />
      </mesh>

      <mesh position={[0, 0.95, 0.26]}>
        <boxGeometry args={[0.24, 0.16, 0.02]} />
        <meshStandardMaterial color="#2A2A2A" metalness={0.8} />
      </mesh>

      <mesh position={[0, 0.85, -0.3]} castShadow>
        <boxGeometry args={[0.42, 0.55, 0.22]} />
        <meshStandardMaterial color="#E0E0E0" metalness={0.3} roughness={0.5} />
      </mesh>

      <mesh position={[-0.38, 0.95, 0]} rotation={[0, 0, 0.3]} castShadow>
        <capsuleGeometry args={[0.09, 0.28, 4, 12]} />
        <meshStandardMaterial color="#FAFAFA" roughness={0.6} />
      </mesh>
      <mesh position={[-0.55, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="#FF6B00" />
      </mesh>

      <mesh position={[0.38, 0.95, 0]} rotation={[0, 0, -0.3]} castShadow>
        <capsuleGeometry args={[0.09, 0.28, 4, 12]} />
        <meshStandardMaterial color="#FAFAFA" roughness={0.6} />
      </mesh>
      <mesh position={[0.55, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="#FF6B00" />
      </mesh>

      <mesh position={[-0.13, 0.4, 0]} castShadow>
        <capsuleGeometry args={[0.1, 0.32, 4, 12]} />
        <meshStandardMaterial color="#FAFAFA" roughness={0.6} />
      </mesh>
      <mesh position={[-0.13, -0.12, 0.05]} castShadow>
        <boxGeometry args={[0.14, 0.1, 0.24]} />
        <meshStandardMaterial color="#424242" />
      </mesh>

      <mesh position={[0.13, 0.4, 0]} castShadow>
        <capsuleGeometry args={[0.1, 0.32, 4, 12]} />
        <meshStandardMaterial color="#FAFAFA" roughness={0.6} />
      </mesh>
      <mesh position={[0.13, -0.12, 0.05]} castShadow>
        <boxGeometry args={[0.14, 0.1, 0.24]} />
        <meshStandardMaterial color="#424242" />
      </mesh>

      {hovered && !activeDeath && (
        <Html center distanceFactor={12}>
          <div className="bg-black/90 text-white p-2 rounded-lg border border-cyan-500 w-48 text-center">
            <p className="font-bold text-xs">👨‍🚀 You</p>
          </div>
        </Html>
      )}
    </group>
  );
}

// ═══════════════════════════════════════════════════════
// ============ LANDED ROCKET ============
// ═══════════════════════════════════════════════════════
function LandedRocket() {
  return (
    <group position={[-7, 0, 4]}>
      <mesh position={[0, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 3, 16]} />
        <meshStandardMaterial color="#E0E0E0" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 3.6, 0]} castShadow>
        <coneGeometry args={[0.4, 0.8, 16]} />
        <meshStandardMaterial color="#C1440E" metalness={0.6} />
      </mesh>
      <mesh position={[0, 2.5, 0.42]}>
        <circleGeometry args={[0.12, 16]} />
        <meshStandardMaterial color="#00BCD4" emissive="#00BCD4" emissiveIntensity={0.5} />
      </mesh>
      {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, i) => (
        <mesh key={i} position={[Math.cos(angle) * 0.6, 0.15, Math.sin(angle) * 0.6]} rotation={[0, angle, Math.PI / 8]}>
          <cylinderGeometry args={[0.03, 0.03, 1, 8]} />
          <meshStandardMaterial color="#424242" metalness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

// ═══════════════════════════════════════════════════════
// ============ NASA ROVER ============
// ═══════════════════════════════════════════════════════
function NASARover() {
  return (
    <group position={[5, 0, 2]}>
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.2, 0.5, 0.8]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[1.6, 0.05, 0.8]} />
        <meshStandardMaterial color="#1E3A8A" metalness={0.9} />
      </mesh>
      <mesh position={[0, 1.1, 0.3]}>
        <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
        <meshStandardMaterial color="#808080" />
      </mesh>
      <mesh position={[0, 1.4, 0.3]}>
        <boxGeometry args={[0.3, 0.15, 0.2]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {[-0.5, 0.5].map((x) =>
        [-0.3, 0, 0.3].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.15, 16]} />
            <meshStandardMaterial color="#333" />
          </mesh>
        ))
      )}
    </group>
  );
}

// ═══════════════════════════════════════════════════════
// ============ PLACED BUILDINGS ============
// ═══════════════════════════════════════════════════════
function PlacedBuildings() {
  const buildings = useGameStore((s) => s.buildings);
  const solarDisabled = useGameStore((s) => s.solarDisabled);

  return (
    <>
      {buildings.map((b) => {
        const isSolar = b.id === 'power';
        const dim = isSolar && solarDisabled;
        const hp = b.hp ?? 100;
        const maxHp = b.maxHp ?? 100;
        const hpPercent = (hp / maxHp) * 100;
        const damaged = hpPercent < 100;
        const barColor =
          hpPercent > 60 ? '#4ADE80' : hpPercent > 30 ? '#FBBF24' : '#EF4444';

        return (
          <group key={b.instanceId || b.id} position={b.position}>
            <mesh position={[0, 0.5, 0]} castShadow>
              <boxGeometry args={[0.8, 1, 0.8]} />
              <meshStandardMaterial
                color={dim ? '#333333' : b.color}
                emissive={damaged ? '#FF0000' : dim ? '#000000' : b.color}
                emissiveIntensity={damaged ? 0.4 : dim ? 0 : 0.3}
                metalness={0.5}
                roughness={0.4}
              />
            </mesh>

            <mesh position={[0, 1.1, 0]}>
              <sphereGeometry args={[0.15, 12, 12]} />
              <meshBasicMaterial color={dim ? '#333333' : b.color} />
            </mesh>

            {damaged && (
              <group position={[0, 1.4, 0]}>
                <mesh>
                  <planeGeometry args={[0.9, 0.1]} />
                  <meshBasicMaterial color="#000000" transparent opacity={0.7} />
                </mesh>
                <mesh position={[(hpPercent / 100 - 1) * 0.45, 0, 0.01]}>
                  <planeGeometry args={[(hpPercent / 100) * 0.9, 0.08]} />
                  <meshBasicMaterial color={barColor} />
                </mesh>
              </group>
            )}
          </group>
        );
      })}
    </>
  );
}

// ═══════════════════════════════════════════════════════
// ============ CAMERA CONTROLLER ============
// ═══════════════════════════════════════════════════════
function CameraController({ targetPosition, rotationRef, isMoving }) {
  const { camera } = useThree();
  const followCamPos = useRef(new THREE.Vector3(0, 6, 10));
  const followLookAt = useRef(new THREE.Vector3(0, 1, 0));
  const [userControlling, setUserControlling] = useState(false);
  const orbitRef = useRef();

  useFrame((state, delta) => {
    if (!targetPosition) return;
    if (!isMoving) return;
    if (userControlling) return;

    const dt = Math.min(delta, 0.05);
    const robotRot = rotationRef.current || 0;

    const offsetDistance = 10;
    const offsetHeight = 6;

    const forwardX = Math.sin(robotRot);
    const forwardZ = Math.cos(robotRot);

    const desiredCamX = targetPosition.x - forwardX * offsetDistance;
    const desiredCamZ = targetPosition.z - forwardZ * offsetDistance;
    const desiredCamY = offsetHeight;

    followCamPos.current.x += (desiredCamX - followCamPos.current.x) * Math.min(1, dt * 5);
    followCamPos.current.y += (desiredCamY - followCamPos.current.y) * Math.min(1, dt * 5);
    followCamPos.current.z += (desiredCamZ - followCamPos.current.z) * Math.min(1, dt * 5);

    const lookX = targetPosition.x;
    const lookY = targetPosition.y + 1;
    const lookZ = targetPosition.z;

    followLookAt.current.x += (lookX - followLookAt.current.x) * Math.min(1, dt * 8);
    followLookAt.current.y += (lookY - followLookAt.current.y) * Math.min(1, dt * 8);
    followLookAt.current.z += (lookZ - followLookAt.current.z) * Math.min(1, dt * 8);

    camera.position.copy(followCamPos.current);
    camera.lookAt(followLookAt.current);

    if (orbitRef.current) {
      orbitRef.current.target.lerp(new THREE.Vector3(lookX, lookY, lookZ), 0.1);
    }
  });

  return (
    <OrbitControls
      ref={orbitRef}
      enabled={true}
      target={[
        targetPosition?.x || 0,
        (targetPosition?.y || 0) + 1,
        targetPosition?.z || 0,
      ]}
      enableZoom={true}
      enablePan={false}
      minDistance={3}
      maxDistance={40}
      maxPolarAngle={Math.PI / 2.1}
      minPolarAngle={Math.PI / 8}
      enableDamping={true}
      dampingFactor={0.08}
      onStart={() => setUserControlling(true)}
      onEnd={() => {
        setTimeout(() => setUserControlling(false), 1500);
      }}
    />
  );
}

// ═══════════════════════════════════════════════════════
// ============ DAY / NIGHT SYSTEM ============
// ═══════════════════════════════════════════════════════
function DayNightSystem({ timeOfDay, activeDisaster }) {
  const isDay = timeOfDay === 'day';
  const isStorming = activeDisaster === 'sandstorm';

  return (
    <>
      {isDay && !isStorming && (
        <mesh position={[30, 25, -50]}>
          <sphereGeometry args={[2, 32, 32]} />
          <meshBasicMaterial color="#FFB88C" />
        </mesh>
      )}

      <ambientLight
        intensity={isDay ? (isStorming ? 0.3 : 0.8) : 0.2}
        color={isStorming ? '#8B5A2B' : isDay ? '#FFA07A' : '#4A6FA5'}
      />

      <directionalLight
        position={isDay ? [30, 25, -50] : [-20, 30, 20]}
        intensity={isStorming ? 0.2 : isDay ? 2 : 0.4}
        color={isStorming ? '#A0724A' : isDay ? '#FFB88C' : '#8BA3D4'}
        castShadow
      />

      <Stars
        radius={150}
        depth={100}
        count={isDay && !isStorming ? 1500 : 8000}
        factor={4}
        saturation={0}
        fade
      />
    </>
  );
}

// ═══════════════════════════════════════════════════════
// ============ FOG CONTROLLER ============
// ═══════════════════════════════════════════════════════
function FogController({ robotPositionRef, activeDisaster }) {
  const { scene } = useThree();

  useEffect(() => {
    scene.fog = new THREE.Fog(
      activeDisaster === 'sandstorm' ? '#A0724A' : '#B8432E',
      activeDisaster === 'sandstorm' ? 10 : 60,
      activeDisaster === 'sandstorm' ? 40 : 150
    );
  }, [scene, activeDisaster]);

  useFrame(() => {
    if (scene.fog && robotPositionRef?.current) {
      scene.fog.position = robotPositionRef.current;
    }
  });

  return null;
}

// ═══════════════════════════════════════════════════════
// ============ MAIN COMPONENT ============
// ═══════════════════════════════════════════════════════
export default function MarsSurface() {
  const [timeOfDay, setTimeOfDay] = useState('day');
  const [isMoving, setIsMoving] = useState(false);

  const robotPositionRef = useRef(new THREE.Vector3(0, 0, 0));
  const robotRotationRef = useRef(0);
  const activeDisaster = useGameStore((s) => s.activeDisaster);

  return (
    <div className="h-screen w-screen relative">
      {/* Background gradient */}
      <div
        className={`absolute inset-0 transition-all duration-1000 ${
          activeDisaster === 'sandstorm'
            ? 'bg-gradient-to-b from-[#A0724A] to-[#5C2E16]'
            : timeOfDay === 'day'
            ? 'bg-gradient-to-b from-[#E8985E] to-[#8B3A1E]'
            : 'bg-gradient-to-b from-[#0A0E27] to-[#1A0E05]'
        }`}
      />

      {/* ═══════════ 3D CANVAS ═══════════ */}
      <Canvas camera={{ position: [0, 6, 10], fov: 60 }} shadows="basic">
        <Suspense fallback={null}>
          <DayNightSystem timeOfDay={timeOfDay} activeDisaster={activeDisaster} />
          <FogController
            robotPositionRef={robotPositionRef}
            activeDisaster={activeDisaster}
          />

          <MarsTerrain robotPositionRef={robotPositionRef} />

          <IceCraters />
          <AlienArtifact robotPositionRef={robotPositionRef} />
          <MeteorShower />
          <MagneticShield robotPositionRef={robotPositionRef} />

          <Tower robotPositionRef={robotPositionRef} />

          <LandedRocket />
          <NASARover />
          <PlacedBuildings />

          <InterestingObjects robotPositionRef={robotPositionRef} />

          <Astronaut
            positionRef={robotPositionRef}
            rotationRef={robotRotationRef}
            setIsMoving={setIsMoving}
          />

          <CameraController
            targetPosition={robotPositionRef.current}
            rotationRef={robotRotationRef}
            isMoving={isMoving}
          />

          {/* 🆕 3D floating arrow above robot */}
          <TowerArrow robotPositionRef={robotPositionRef} />
        </Suspense>
      </Canvas>

      {/* ═══════════ UI OVERLAYS ═══════════ */}
         <TowerTracker robotPositionRef={robotPositionRef} />
            <CraftingPanel robotPositionRef={robotPositionRef} />
           <AmbientFacts />
          <QuizButton />
          <DayPopup />

      {/* ═══════════ TOP HEADER ═══════════ */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 text-center z-10 pointer-events-none mt-14">
        <h1 className="text-sm font-bold text-white/90 drop-shadow-lg tracking-wider">
          SURFACE OF MARS — JEZERO CRATER
        </h1>
        <p className="text-orange-200/80 text-[10px] mt-0.5">
          {timeOfDay === 'day' ? '☀️ DAY' : '🌙 NIGHT'} • Temperature:{' '}
          {timeOfDay === 'day' ? '-20°C' : '-85°C'}
        </p>
      </div>

      {/* ═══════════ DAY/NIGHT TOGGLE ═══════════ */}
      <div className="absolute top-3 right-32 z-30">
        <button
          onClick={() => setTimeOfDay(timeOfDay === 'day' ? 'night' : 'day')}
          className={`px-4 py-2 rounded-xl font-bold text-white text-sm shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 border-2 ${
            timeOfDay === 'day'
              ? 'bg-gradient-to-r from-yellow-500 to-orange-600 border-yellow-400/50'
              : 'bg-gradient-to-r from-indigo-700 to-purple-800 border-purple-400/50'
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="text-base">{timeOfDay === 'day' ? '🌙' : '☀️'}</span>
            <span className="font-bold whitespace-nowrap">
              {timeOfDay === 'day' ? 'Night Mode' : 'Day Mode'}
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}