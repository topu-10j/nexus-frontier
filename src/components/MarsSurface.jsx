import { Canvas, useLoader, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import { useRef, useState, Suspense, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';

// ============ MARS GROUND ============
function MarsGround() {
  const marsTexture = useLoader(THREE.TextureLoader, '/textures/mars.jpg');

  const rocks = useMemo(() => {
    return [...Array(40)].map(() => ({
      x: (Math.random() - 0.5) * 80,
      y: -0.85 + Math.random() * 0.15,
      z: (Math.random() - 0.5) * 80,
      rotX: Math.random() * Math.PI,
      rotY: Math.random() * Math.PI,
      size: 0.15 + Math.random() * 0.35,
      colorIdx: Math.floor(Math.random() * 4),
    }));
  }, []);

  const hills = useMemo(() => {
    return [...Array(15)].map(() => ({
      x: (Math.random() - 0.5) * 140,
      y: -0.5 + Math.random() * 1.5,
      z: -60 - Math.random() * 30,
      radius: 5 + Math.random() * 6,
      height: 4 + Math.random() * 5,
    }));
  }, []);

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[300, 300, 100, 100]} />
        <meshStandardMaterial map={marsTexture} roughness={1} />
      </mesh>

      {rocks.map((rock, i) => (
        <mesh key={i} position={[rock.x, rock.y, rock.z]} rotation={[rock.rotX, rock.rotY, 0]} castShadow>
          <dodecahedronGeometry args={[rock.size, 0]} />
          <meshStandardMaterial color={['#6B2E14', '#8B3A1E', '#5C2E16', '#A0522D'][rock.colorIdx]} roughness={1} />
        </mesh>
      ))}

      {hills.map((hill, i) => (
        <mesh key={`hill-${i}`} position={[hill.x, hill.y, hill.z]} castShadow>
          <coneGeometry args={[hill.radius, hill.height, 8]} />
          <meshStandardMaterial color="#7A2E14" roughness={1} flatShading />
        </mesh>
      ))}
    </>
  );
}

// ============ GROUND CLICK HANDLER ============
function GroundClickHandler({ setTargetPosition }) {
  const { camera, raycaster, pointer } = useThree();

  const handleClick = (e) => {
    e.stopPropagation();
    raycaster.setFromCamera(pointer, camera);
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 1);
    const target = new THREE.Vector3();
    raycaster.ray.intersectPlane(groundPlane, target);

    if (target) {
      target.x = Math.max(-30, Math.min(30, target.x));
      target.z = Math.max(-30, Math.min(30, target.z));
      setTargetPosition(target.clone());
    }
  };

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.98, 0]} onClick={handleClick} visible={false}>
      <planeGeometry args={[300, 300]} />
    </mesh>
  );
}

// ============ ASTRONAUT ============
function Astronaut({ targetPosition, setCurrentPosition, setIsMoving }) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef();
  const currentPos = useRef(new THREE.Vector3(0, -0.4, 0));
  const walkCycle = useRef(0);
  const lastDrainTime = useRef(0);
  const { walkingDrain, missionStatus } = useGameStore();

  useFrame((state, delta) => {
    if (!groupRef.current || missionStatus !== 'active') return;

    let moving = false;

    if (targetPosition) {
      const target = new THREE.Vector3(targetPosition.x, -0.4, targetPosition.z);
      const distance = currentPos.current.distanceTo(target);

      if (distance > 0.15) {
        moving = true;
        const direction = target.clone().sub(currentPos.current).normalize();
        const speed = 2.0;
        currentPos.current.add(direction.multiplyScalar(speed * delta));

        const angle = Math.atan2(direction.x, direction.z);
        let currentAngle = groupRef.current.rotation.y;
        let angleDiff = angle - currentAngle;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        groupRef.current.rotation.y += angleDiff * 0.12;

        walkCycle.current += delta * 8;

        lastDrainTime.current += delta;
        if (lastDrainTime.current > 1) {
          walkingDrain();
          lastDrainTime.current = 0;
        }
      }
    }

    if (setIsMoving) setIsMoving(moving);

    const targetY = -0.4 + Math.abs(Math.sin(walkCycle.current)) * 0.05;
    groupRef.current.position.y = groupRef.current.position.y * 0.9 + targetY * 0.1;

    groupRef.current.position.x = currentPos.current.x;
    groupRef.current.position.z = currentPos.current.z;

    if (setCurrentPosition) {
      setCurrentPosition(currentPos.current.clone());
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.4, 0]} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
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

      {hovered && (
        <Html center distanceFactor={12}>
          <div className="bg-black/90 text-white p-2 rounded-lg border border-cyan-500 w-48 text-center">
            <p className="font-bold text-xs">👨‍🚀 You</p>
          </div>
        </Html>
      )}
    </group>
  );
}

// ============ LANDED ROCKET ============
function LandedRocket() {
  return (
    <group position={[-6, -0.3, 3]}>
      <mesh position={[0, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 3, 16]} />
        <meshStandardMaterial color="#E0E0E0" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 3.6, 0]} castShadow>
        <coneGeometry args={[0.4, 0.8, 16]} />
        <meshStandardMaterial color="#C1440E" metalness={0.6} />
      </mesh>
      {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, i) => (
        <mesh key={i} position={[Math.cos(angle) * 0.6, 0.15, Math.sin(angle) * 0.6]} rotation={[0, angle, Math.PI / 6]}>
          <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
          <meshStandardMaterial color="#424242" metalness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 2.5, 0.42]}>
        <circleGeometry args={[0.12, 16]} />
        <meshStandardMaterial color="#00BCD4" emissive="#00BCD4" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

// ============ NASA ROVER ============
function NASARover() {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={[5, -0.4, 2]} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
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
      {hovered && (
        <Html center distanceFactor={12}>
          <div className="bg-black/90 text-white p-2 rounded-lg border border-red-500 w-48 text-center">
            <p className="font-bold text-xs">🤖 NASA Perseverance</p>
          </div>
        </Html>
      )}
    </group>
  );
}

// ============ PLACED BUILDINGS ============
function PlacedBuildings() {
  const buildings = useGameStore((s) => s.buildings);

  return (
    <>
      {buildings.map((b, i) => (
        <group key={i} position={b.position}>
          <mesh position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[0.8, 1, 0.8]} />
            <meshStandardMaterial color={b.color || '#00BCD4'} emissive={b.color || '#00BCD4'} emissiveIntensity={0.3} metalness={0.5} roughness={0.4} />
          </mesh>
          <mesh position={[0, 1.1, 0]}>
            <sphereGeometry args={[0.15, 12, 12]} />
            <meshBasicMaterial color={b.color || '#00BCD4'} />
          </mesh>
        </group>
      ))}
    </>
  );
}

// ============ CAMERA CONTROLLER ============
function CameraController({ targetPosition, isMoving }) {
  const { camera } = useThree();
  const followCamPos = useRef(new THREE.Vector3(0, 4, 8));
  const followLookAt = useRef(new THREE.Vector3(0, 1, 0));
  const [orbitEnabled, setOrbitEnabled] = useState(true);

  useEffect(() => {
    if (isMoving) setOrbitEnabled(false);
    else {
      const timer = setTimeout(() => setOrbitEnabled(true), 300);
      return () => clearTimeout(timer);
    }
  }, [isMoving]);

  useFrame(() => {
    if (!targetPosition || !isMoving) return;

    const desiredCamPos = new THREE.Vector3(targetPosition.x, targetPosition.y + 4, targetPosition.z + 8);
    const desiredLookAt = new THREE.Vector3(targetPosition.x, targetPosition.y + 1, targetPosition.z);

    followCamPos.current.lerp(desiredCamPos, 0.06);
    followLookAt.current.lerp(desiredLookAt, 0.08);

    camera.position.copy(followCamPos.current);
    camera.lookAt(followLookAt.current);
  });

  useEffect(() => {
    if (!targetPosition || isMoving) return;
    followCamPos.current.set(targetPosition.x, targetPosition.y + 4, targetPosition.z + 8);
    followLookAt.current.set(targetPosition.x, targetPosition.y + 1, targetPosition.z);
  }, [targetPosition, isMoving]);

  if (!targetPosition) return null;

  return (
    <OrbitControls
      enabled={orbitEnabled}
      target={[targetPosition.x, targetPosition.y + 1, targetPosition.z]}
      enableZoom={true}
      enablePan={false}
      minDistance={5}
      maxDistance={25}
      maxPolarAngle={Math.PI / 2.1}
      minPolarAngle={Math.PI / 8}
      enableDamping={true}
      dampingFactor={0.08}
    />
  );
}

// ============ DAY/NIGHT ============
function DayNightSystem({ timeOfDay }) {
  const isDay = timeOfDay === 'day';
  return (
    <>
      {isDay && (
        <mesh position={[30, 25, -50]}>
          <sphereGeometry args={[2, 32, 32]} />
          <meshBasicMaterial color="#FFB88C" />
        </mesh>
      )}
      <ambientLight intensity={isDay ? 0.8 : 0.2} color={isDay ? '#FFA07A' : '#4A6FA5'} />
      <directionalLight position={isDay ? [30, 25, -50] : [-20, 30, 20]} intensity={isDay ? 2 : 0.4} color={isDay ? '#FFB88C' : '#8BA3D4'} castShadow />
      <Stars radius={150} depth={100} count={isDay ? 1500 : 8000} factor={4} saturation={0} fade />
    </>
  );
}

// ============ MAIN COMPONENT ============
export default function MarsSurface() {
  const [timeOfDay, setTimeOfDay] = useState('day');
  const [targetPosition, setTargetPosition] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(new THREE.Vector3(0, -0.4, 0));
  const [isMoving, setIsMoving] = useState(false);

  return (
    <div className="h-screen w-screen relative">
      <div className={`absolute inset-0 transition-all duration-1000 ${timeOfDay === 'day' ? 'bg-gradient-to-b from-[#E8985E] to-[#8B3A1E]' : 'bg-gradient-to-b from-[#0A0E27] to-[#1A0E05]'}`} />

      <Canvas camera={{ position: [0, 4, 8], fov: 60 }} shadows>
        <Suspense fallback={null}>
          <DayNightSystem timeOfDay={timeOfDay} />
          <MarsGround />
          <GroundClickHandler setTargetPosition={setTargetPosition} />
          <LandedRocket />
          <NASARover />
          <PlacedBuildings />
          <Astronaut targetPosition={targetPosition} setCurrentPosition={setCurrentPosition} setIsMoving={setIsMoving} />
          <CameraController targetPosition={currentPosition} isMoving={isMoving} />
        </Suspense>
      </Canvas>

      <div className="absolute top-3 left-1/2 -translate-x-1/2 text-center z-10 pointer-events-none mt-14">
        <h1 className="text-sm font-bold text-white/90 drop-shadow-lg tracking-wider">
          SURFACE OF MARS — JEZERO CRATER
        </h1>
        <p className="text-orange-200/80 text-[10px] mt-0.5">
          {timeOfDay === 'day' ? '☀️ DAY' : '🌙 NIGHT'} • Temperature: {timeOfDay === 'day' ? '-20°C' : '-85°C'}
        </p>
      </div>

      <InstructionHint />

      <div className="absolute top-3 right-32 z-30">
        <button
          onClick={() => setTimeOfDay(timeOfDay === 'day' ? 'night' : 'day')}
          className={`px-4 py-2 rounded-xl font-bold text-white text-sm shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 border-2 ${timeOfDay === 'day' ? 'bg-gradient-to-r from-yellow-500 to-orange-600 border-yellow-400/50' : 'bg-gradient-to-r from-indigo-700 to-purple-800 border-purple-400/50'}`}
        >
          <span className="flex items-center gap-2">
            <span className="text-base">{timeOfDay === 'day' ? '🌙' : '☀️'}</span>
            <span className="font-bold whitespace-nowrap">{timeOfDay === 'day' ? 'Night Mode' : 'Day Mode'}</span>
          </span>
        </button>
      </div>
    </div>
  );
}

// ============ INSTRUCTION HINT ============
function InstructionHint() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
      <div className="bg-cyan-500/95 backdrop-blur px-6 py-3 rounded-2xl shadow-2xl border-2 border-cyan-300">
        <p className="text-white text-sm font-bold text-center">🖱️ Click on Mars to walk</p>
        <p className="text-white/90 text-xs text-center mt-0.5">When idle — drag to rotate around astronaut</p>
      </div>
    </div>
  );
}