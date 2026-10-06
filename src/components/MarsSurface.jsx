import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import { useRef, useState, Suspense } from 'react';
import * as THREE from 'three';

function MarsGround() {
  // NASA Mars texture ব্যবহার করছি
  const marsTexture = useLoader(THREE.TextureLoader, '/textures/mars.jpg');

  return (
    <>
      {/* Mars surface - NASA texture সহ */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[200, 200, 100, 100]} />
        <meshStandardMaterial map={marsTexture} roughness={1} />
      </mesh>

      {/* Rocks */}
      {[...Array(50)].map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 70,
            -0.9 + Math.random() * 0.15,
            (Math.random() - 0.5) * 70,
          ]}
          rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
          castShadow
        >
          <dodecahedronGeometry args={[0.1 + Math.random() * 0.4, 0]} />
          <meshStandardMaterial
            color={['#6B2E14', '#8B3A1E', '#5C2E16', '#A0522D'][i % 4]}
            roughness={1}
          />
        </mesh>
      ))}

      {/* Hills far away */}
      {[...Array(20)].map((_, i) => (
        <mesh
          key={`hill-${i}`}
          position={[
            (Math.random() - 0.5) * 120,
            -1 + Math.random() * 2,
            -40 - Math.random() * 40,
          ]}
        >
          <coneGeometry args={[4 + Math.random() * 5, 3 + Math.random() * 5, 8]} />
          <meshStandardMaterial color="#7A2E14" roughness={1} />
        </mesh>
      ))}
    </>
  );
}

function NASARover() {
  const [hovered, setHovered] = useState(false);
  const roverRef = useRef();

  return (
    <group
      ref={roverRef}
      position={[3, -0.4, 2]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Body */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.2, 0.5, 0.8]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Solar panel */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[1.6, 0.05, 0.8]} />
        <meshStandardMaterial color="#1E3A8A" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Camera mast */}
      <mesh position={[0, 1.1, 0.3]}>
        <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
        <meshStandardMaterial color="#808080" />
      </mesh>
      <mesh position={[0, 1.4, 0.3]}>
        <boxGeometry args={[0.3, 0.15, 0.2]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      {/* 6 wheels */}
      {[-0.5, 0.5].map((x) =>
        [-0.3, 0, 0.3].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.15, 16]} />
            <meshStandardMaterial color="#333" />
          </mesh>
        ))
      )}

      {hovered && (
        <Html center distanceFactor={10}>
          <div className="bg-black/90 text-white p-3 rounded-lg border border-red-500 w-56 text-center">
            <h3 className="font-bold text-sm">🤖 NASA Perseverance</h3>
            <p className="text-xs text-gray-400 mt-1">
              Exploring Mars since 2021
            </p>
          </div>
        </Html>
      )}
    </group>
  );
}

function DayNightSystem({ timeOfDay }) {
  // timeOfDay: 'day' | 'night'
  const isDay = timeOfDay === 'day';

  return (
    <>
      {/* Sun (শুধু দিনে দেখা যাবে) */}
      {isDay && (
        <mesh position={[30, 25, -50]}>
          <sphereGeometry args={[2, 32, 32]} />
          <meshBasicMaterial color="#FFB88C" />
        </mesh>
      )}

      {/* Lights */}
      <ambientLight intensity={isDay ? 0.8 : 0.15} color={isDay ? '#FFA07A' : '#4A6FA5'} />
      <directionalLight
        position={isDay ? [30, 25, -50] : [-20, 30, 20]}
        intensity={isDay ? 2 : 0.3}
        color={isDay ? '#FFB88C' : '#8BA3D4'}
        castShadow
      />

      {/* Stars (রাতে বেশি উজ্জ্বল) */}
      <Stars
        radius={150}
        depth={100}
        count={isDay ? 2000 : 8000}
        factor={4}
        saturation={0}
        fade
      />
    </>
  );
}

export default function MarsSurface() {
  const [timeOfDay, setTimeOfDay] = useState('day');

  const toggleTime = () => {
    setTimeOfDay(timeOfDay === 'day' ? 'night' : 'day');
  };

  return (
    <div className="h-screen w-screen relative">
      {/* Background color দিনে ও রাতে আলাদা */}
      <div
        className={`absolute inset-0 transition-all duration-1000 ${
          timeOfDay === 'day'
            ? 'bg-gradient-to-b from-[#E8985E] to-[#8B3A1E]'
            : 'bg-gradient-to-b from-[#0A0E27] to-[#1A0E05]'
        }`}
      />

      <Canvas camera={{ position: [0, 3, 10], fov: 60 }} shadows>
        <Suspense fallback={null}>
          <DayNightSystem timeOfDay={timeOfDay} />
          <MarsGround />
          <NASARover />

          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minDistance={5}
            maxDistance={20}
            maxPolarAngle={Math.PI / 2.2}
            minPolarAngle={Math.PI / 4}
          />
        </Suspense>
      </Canvas>

      {/* Title */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center z-10 pointer-events-none">
        <h1 className="text-3xl font-bold text-white drop-shadow-lg">
          Surface of Mars — Jezero Crater
        </h1>
        <p className="text-orange-200 text-sm mt-2">
          Temperature: {timeOfDay === 'day' ? '-20°C' : '-85°C'} • Gravity: 3.71 m/s²
        </p>
      </div>

      {/* Day/Night Toggle Button (উপরে ডান দিকে) */}
      <div className="absolute top-8 right-8 z-20">
        <button
          onClick={toggleTime}
          className={`px-6 py-3 rounded-full font-bold text-white shadow-lg 
                     transition-all duration-500 hover:scale-105 ${
            timeOfDay === 'day'
              ? 'bg-gradient-to-r from-orange-500 to-red-600'
              : 'bg-gradient-to-r from-blue-800 to-purple-900'
          }`}
        >
          {timeOfDay === 'day' ? '🌙 Switch to Night' : '☀️ Switch to Day'}
        </button>
      </div>

      {/* NASA Rover info panel */}
      <div className="absolute top-24 left-8 bg-black/70 backdrop-blur p-4 rounded-lg border border-red-500/30 z-10 max-w-xs">
        <p className="text-white text-xs">
          🤖 <strong>NASA Perseverance Rover</strong> landed Feb 2021.
          Currently exploring Jezero Crater for signs of ancient life.
        </p>
      </div>

      {/* Current time indicator */}
      <div className="absolute top-24 right-8 bg-black/60 backdrop-blur px-4 py-2 rounded-full z-10">
        <p className="text-white text-sm">
          {timeOfDay === 'day' ? '☀️ DAY TIME' : '🌙 NIGHT TIME'}
        </p>
      </div>

      {/* Bottom button */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <button
          onClick={() => alert('Next: HUD & Colony Building!')}
          className="px-8 py-4 bg-red-600 text-white font-bold rounded-full 
                     text-lg hover:bg-red-500 transition-all animate-pulse shadow-lg"
        >
          🚀 BEGIN COLONY MISSION
        </button>
      </div>
    </div>
  );
}