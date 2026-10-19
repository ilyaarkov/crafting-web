import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface GeometricShapeProps {
  position: [number, number, number];
  scale: number;
  color: string;
  speed: number;
  mousePosition: { x: number; y: number };
}

const GeometricShape: React.FC<GeometricShapeProps> = ({
  position,
  scale,
  color,
  speed,
  mousePosition
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => {
    const type = Math.floor(Math.random() * 3);
    if (type === 0) return new THREE.IcosahedronGeometry(1, 0);
    if (type === 1) return new THREE.OctahedronGeometry(1, 0);
    return new THREE.TetrahedronGeometry(1, 0);
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();

    // Плавное вращение
    meshRef.current.rotation.x = time * speed * 0.3;
    meshRef.current.rotation.y = time * speed * 0.5;

    // Реакция на курсор
    const targetX = mousePosition.x * 0.5;
    const targetY = mousePosition.y * 0.5;

    meshRef.current.position.x = position[0] + Math.sin(time * speed) * 0.3 + targetX * 0.3;
    meshRef.current.position.y = position[1] + Math.cos(time * speed) * 0.3 + targetY * 0.3;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} scale={scale} geometry={geometry}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.3}
          metalness={0.8}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.7}
        />
      </mesh>
    </Float>
  );
};

interface ParticleFieldProps {
  mousePosition: { x: number; y: number };
}

const ParticleField: React.FC<ParticleFieldProps> = ({ mousePosition }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const count = 800;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }

    return positions;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = time * 0.05 + mousePosition.x * 0.1;
    pointsRef.current.rotation.x = mousePosition.y * 0.1;
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(particles, 3));
    return geo;
  }, [particles]);

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.02}
        color="#38bdf8"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

interface Scene3DProps {
  mousePosition: { x: number; y: number };
  scrollProgress: number;
}

export const Scene3D: React.FC<Scene3DProps> = ({ mousePosition, scrollProgress }) => {
  const shapes = useMemo(() => [
    { position: [-3, 2, -2], scale: 0.8, color: '#22d3ee', speed: 0.5 },
    { position: [3, -1, -3], scale: 1.2, color: '#38bdf8', speed: 0.3 },
    { position: [0, 3, -4], scale: 0.6, color: '#0ea5e9', speed: 0.7 },
    { position: [-2, -2, -1], scale: 0.9, color: '#06b6d4', speed: 0.4 },
    { position: [4, 2, -5], scale: 0.7, color: '#0284c7', speed: 0.6 },
  ], []);

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#38bdf8" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0ea5e9" />

      <ParticleField mousePosition={mousePosition} />

      {shapes.map((shape, idx) => (
        <GeometricShape
          key={idx}
          {...shape}
          position={[
            shape.position[0],
            shape.position[1] + scrollProgress * 2,
            shape.position[2]
          ] as [number, number, number]}
          mousePosition={mousePosition}
        />
      ))}
    </Canvas>
  );
};
