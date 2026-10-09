import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Html, Stars } from '@react-three/drei';
import { useState, useRef, Suspense, useMemo } from 'react';
import * as THREE from 'three';
import { planets } from '../data/planets';
import { playSound } from '../audio/soundManager';

// ============ PLANET ============
function Planet({ planet, onSelect, index }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();
  const groupRef = useRef();
  const texture = useLoader(THREE.TextureLoader, planet.texture);

  // Planet rotates on its own axis
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += planet.rotationSpeed || 0.003;
    }
    // Floating motion
    if (groupRef.current) {
      groupRef.current.position.y =
        planet.position[1] +
        Math.sin(state.clock.elapsedTime * (planet.floatSpeed || 1) + index) * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={planet.position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => {
          setHovered(true);
          playSound('hover');
        }}
        onPointerOut={() => setHovered(false)}
        onClick={() => {
          if (planet.live) {
            playSound('click');
            onSelect(planet);
          } else {
            playSound('hazard');
            alert(`${planet.name} — Coming Soon!`);
          }
        }}
      >
        <sphereGeometry args={[planet.radius || 1, 64, 64]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      {/* Hover glow */}
      {hovered && (
        <mesh>
          <sphereGeometry args={[(planet.radius || 1) * 1.2, 32, 32]} />
          <meshBasicMaterial
            color={planet.color}
            transparent
            opacity={0.25}
          />
        </mesh>
      )}

      {/* Hover card */}
      {hovered && (
        <Html center distanceFactor={10}>
          <div className="bg-black/90 text-white p-3 rounded-xl border-2 border-cyan-500 w-52 text-center backdrop-blur">
            <h3 className="font-bold text-sm">{planet.name}</h3>
            <p className="text-xs text-gray-400 mt-1">
              {planet.live ? '✅ Click to play' : '🔒 Coming Soon'}
            </p>
          </div>
        </Html>
      )}
    </group>
  );
}

// ============ MAIN COMPONENT ============
export default function UniverseMap({ onPlanetSelect }) {
  return (
    <div className="h-screen w-screen bg-black relative">
      <Canvas camera={{ position: [0, 0, 12], fov: 65 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={2.5} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <pointLight position={[-10, -10, -10]} intensity={1.5} />

          <Stars
            radius={100}
            depth={80}
            count={8000}
            factor={5}
            saturation={0}
            fade
          />

          {planets.map((p, i) => (
            <Planet
              key={p.id}
              planet={p}
              onSelect={onPlanetSelect}
              index={i}
            />
          ))}

          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minDistance={6}
            maxDistance={20}
            autoRotate={true}
            autoRotateSpeed={0.3}
          />
        </Suspense>
      </Canvas>

      {/* Title */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center z-10 pointer-events-none">
        <h1 className="text-4xl font-bold text-white tracking-wide">
          Select Your Destination
        </h1>
        <p className="text-gray-400 text-sm mt-2">
          Drag to rotate • Click Mars to begin
        </p>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center z-10 pointer-events-none">
        <p className="text-gray-500 text-xs">Powered by NASA Open Data</p>
      </div>
    </div>
  );
}