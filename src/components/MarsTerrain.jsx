// src/components/MarsTerrain.jsx
import { useMemo, useRef, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

const CHUNK_SIZE = 150;
const CHUNK_SEGMENTS = 30;
const VIEW_DISTANCE = 1;
const ROCKS_PER_CHUNK = 25;
const HILLS_PER_CHUNK = 8;

// Subtle height (terrain flat enough to walk but has life)
const heightAt = (x, z) => {
  const n1 = Math.sin(x * 0.02) * Math.cos(z * 0.02) * 0.5;
  const n2 = Math.sin(x * 0.07 + 1.3) * Math.cos(z * 0.07) * 0.2;
  return n1 + n2;
};

// Deterministic pseudo-random
const rand = (seed) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

function Chunk({ cx, cz, marsTexture }) {
  // Terrain geometry with subtle height
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(
      CHUNK_SIZE,
      CHUNK_SIZE,
      CHUNK_SEGMENTS,
      CHUNK_SEGMENTS
    );
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const localX = pos.getX(i);
      const localY = pos.getY(i);
      const worldX = localX + cx * CHUNK_SIZE;
      const worldZ = localY + cz * CHUNK_SIZE;
      pos.setZ(i, heightAt(worldX, worldZ));
    }
    geo.computeVertexNormals();
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, [cx, cz]);

  // Rocks scattered per chunk (varied sizes)
  const rocks = useMemo(() => {
    const list = [];
    for (let i = 0; i < ROCKS_PER_CHUNK; i++) {
      const seed = cx * 10000 + cz * 100 + i;
      const roll = rand(seed);
      let size;
      if (roll < 0.6) size = 0.1 + rand(seed + 1) * 0.2;
      else if (roll < 0.9) size = 0.3 + rand(seed + 2) * 0.3;
      else size = 0.6 + rand(seed + 3) * 0.5;

      const localX = (rand(seed + 10) - 0.5) * CHUNK_SIZE * 0.7;
      const localZ = (rand(seed + 20) - 0.5) * CHUNK_SIZE * 0.7;
      const worldX = localX + cx * CHUNK_SIZE;
      const worldZ = localZ + cz * CHUNK_SIZE;

      list.push({
        localX,
        localZ,
        y: heightAt(worldX, worldZ) + size * 0.3,
        rotX: rand(seed + 30) * Math.PI,
        rotY: rand(seed + 40) * Math.PI,
        size,
        color: ['#6B2E14', '#8B3A1E', '#5C2E16', '#A0522D'][
          Math.floor(rand(seed + 50) * 4)
        ],
      });
    }
    return list;
  }, [cx, cz]);

  // Hills (cone shapes) scattered
  const hills = useMemo(() => {
    const list = [];
    for (let i = 0; i < HILLS_PER_CHUNK; i++) {
      const seed = cx * 20000 + cz * 200 + i;
      const angle = rand(seed) * Math.PI * 2;
      const dist = 20 + rand(seed + 1) * 40;

      const localX = Math.cos(angle) * dist;
      const localZ = Math.sin(angle) * dist;
      const worldX = localX + cx * CHUNK_SIZE;
      const worldZ = localZ + cz * CHUNK_SIZE;

      list.push({
        localX,
        localZ,
        y: heightAt(worldX, worldZ) + 1.5,
        radius: 4 + rand(seed + 2) * 5,
        height: 3 + rand(seed + 3) * 4,
      });
    }
    return list;
  }, [cx, cz]);

  return (
    <group position={[cx * CHUNK_SIZE, 0, cz * CHUNK_SIZE]}>
      {/* Ground with texture */}
      <mesh geometry={geometry} receiveShadow>
        <meshStandardMaterial
          map={marsTexture}
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* Rocks */}
      {rocks.map((rock, i) => (
        <mesh
          key={`rock-${i}`}
          position={[rock.localX, rock.y, rock.localZ]}
          rotation={[rock.rotX, rock.rotY, 0]}
          castShadow
        >
          <dodecahedronGeometry args={[rock.size, 0]} />
          <meshStandardMaterial color={rock.color} roughness={1} />
        </mesh>
      ))}

      {/* Hills */}
      {hills.map((hill, i) => (
        <mesh
          key={`hill-${i}`}
          position={[hill.localX, hill.y, hill.localZ]}
          castShadow
        >
          <coneGeometry args={[hill.radius, hill.height, 8]} />
          <meshStandardMaterial color="#7A2E14" roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  );
}

export default function MarsTerrain({ robotPositionRef }) {
  const marsTexture = useLoader(THREE.TextureLoader, '/textures/mars.jpg');

  // Texture settings for smooth original look
  useMemo(() => {
    if (marsTexture) {
      marsTexture.wrapS = THREE.ClampToEdgeWrapping;
      marsTexture.wrapT = THREE.ClampToEdgeWrapping;
      marsTexture.anisotropy = 8;
      marsTexture.colorSpace = THREE.SRGBColorSpace;
    }
  }, [marsTexture]);

  const buildChunks = (centerX, centerZ) => {
    const arr = [];
    for (let dx = -VIEW_DISTANCE; dx <= VIEW_DISTANCE; dx++) {
      for (let dz = -VIEW_DISTANCE; dz <= VIEW_DISTANCE; dz++) {
        arr.push({
          key: `${centerX + dx}_${centerZ + dz}`,
          cx: centerX + dx,
          cz: centerZ + dz,
        });
      }
    }
    return arr;
  };

  const [chunks, setChunks] = useState(() => buildChunks(0, 0));
  const centerRef = useRef({ cx: 0, cz: 0 });

  useFrame(() => {
    if (!robotPositionRef?.current) return;
    const rx = Math.floor(robotPositionRef.current.x / CHUNK_SIZE);
    const rz = Math.floor(robotPositionRef.current.z / CHUNK_SIZE);

    if (rx !== centerRef.current.cx || rz !== centerRef.current.cz) {
      centerRef.current = { cx: rx, cz: rz };
      setChunks(buildChunks(rx, rz));
    }
  });

  return (
    <group>
      {chunks.map((c) => (
        <Chunk
          key={c.key}
          cx={c.cx}
          cz={c.cz}
          marsTexture={marsTexture}
        />
      ))}
    </group>
  );
}