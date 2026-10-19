import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

// Морфинг куба в сферу
const MorphingShape: React.FC<{ mousePosition: { x: number; y: number } }> = ({ mousePosition }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometryRef = useRef<THREE.BufferGeometry>(null);

  const [cubeGeo, sphereGeo] = useMemo(() => {
    const cube = new THREE.BoxGeometry(2, 2, 2, 32, 32, 32);
    const sphere = new THREE.SphereGeometry(1.4, 32, 32);

    // Ensure both geometries have the same vertex count
    const cubePositions = cube.attributes.position.array as Float32Array;
    const spherePositions = sphere.attributes.position.array as Float32Array;

    return [cubePositions, spherePositions];
  }, []);

  const initialGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(cubeGeo, 3));
    return geo;
  }, [cubeGeo]);

  useFrame((state) => {
    if (!meshRef.current || !geometryRef.current) return;

    const time = state.clock.getElapsedTime();

    // Плавный морфинг между кубом и сферой
    const morphProgress = (Math.sin(time * 0.5) + 1) / 2;

    const positions = geometryRef.current.attributes.position.array as Float32Array;

    for (let i = 0; i < positions.length; i++) {
      positions[i] = THREE.MathUtils.lerp(
        cubeGeo[i],
        sphereGeo[i],
        morphProgress
      );
    }

    geometryRef.current.attributes.position.needsUpdate = true;
    geometryRef.current.computeVertexNormals();

    // Вращение и реакция на курсор
    meshRef.current.rotation.x = time * 0.2 + mousePosition.y * 0.3;
    meshRef.current.rotation.y = time * 0.3 + mousePosition.x * 0.3;

    // Плавное движение
    meshRef.current.position.y = Math.sin(time * 0.4) * 0.3;
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={meshRef} position={[-2, 0, 0]} geometry={initialGeometry}>
        <bufferGeometry ref={geometryRef} />
        <MeshTransmissionMaterial
          backside
          backsideThickness={5}
          thickness={2}
          chromaticAberration={0.5}
          anisotropy={0.3}
          distortion={0.2}
          distortionScale={0.5}
          temporalDistortion={0.1}
          ior={1.5}
          color="#22d3ee"
          transmission={0.95}
          roughness={0.2}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
    </Float>
  );
};

// Частицы собираются в икосаэдр
const ParticleFormation: React.FC<{ mousePosition: { x: number; y: number } }> = ({ mousePosition }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const targetGeometryRef = useRef<THREE.IcosahedronGeometry>(null);

  const { particles, targetPositions } = useMemo(() => {
    const count = 1500;
    const particlePositions = new Float32Array(count * 3);
    const target = new THREE.IcosahedronGeometry(1.5, 2);
    const targetPos = target.attributes.position.array as Float32Array;

    // Начальные позиции частиц (рандомно разбросаны)
    for (let i = 0; i < count * 3; i += 3) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const radius = 3 + Math.random() * 2;

      particlePositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i + 2] = radius * Math.cos(phi);
    }

    return { particles: particlePositions, targetPositions: targetPos };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.getElapsedTime();
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

    // Прогресс сборки (цикличный)
    const formationProgress = (Math.sin(time * 0.4) + 1) / 2;

    for (let i = 0; i < positions.length; i += 3) {
      const targetIndex = (i % targetPositions.length);

      // Lerp между начальной позицией и целевой
      const startX = particles[i];
      const startY = particles[i + 1];
      const startZ = particles[i + 2];

      const targetX = targetPositions[targetIndex] * 1.5;
      const targetY = targetPositions[targetIndex + 1] * 1.5;
      const targetZ = targetPositions[targetIndex + 2] * 1.5;

      positions[i] = THREE.MathUtils.lerp(startX, targetX, formationProgress);
      positions[i + 1] = THREE.MathUtils.lerp(startY, targetY, formationProgress);
      positions[i + 2] = THREE.MathUtils.lerp(startZ, targetZ, formationProgress);

      // Добавляем небольшое волнообразное движение
      positions[i] += Math.sin(time * 2 + i * 0.1) * 0.02;
      positions[i + 1] += Math.cos(time * 2 + i * 0.1) * 0.02;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Вращение всей системы частиц
    pointsRef.current.rotation.y = time * 0.15 + mousePosition.x * 0.2;
    pointsRef.current.rotation.x = mousePosition.y * 0.2;
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(particles, 3));
    return geo;
  }, [particles]);

  return (
    <points ref={pointsRef} position={[2.5, 0, 0]} geometry={geometry}>
      <pointsMaterial
        size={0.04}
        color="#38bdf8"
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// Ambient частицы для атмосферы
const AmbientParticles: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const count = 400;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 25;
      positions[i + 1] = (Math.random() - 0.5) * 25;
      positions[i + 2] = (Math.random() - 0.5) * 15 - 5;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.03;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.015}
        color="#0ea5e9"
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

interface HeroScene3DProps {
  mousePosition: { x: number; y: number };
  scrollProgress: number;
}

export const HeroScene3D: React.FC<HeroScene3DProps> = ({ mousePosition, scrollProgress }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
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
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2
      }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['#080b12']} />

      {/* HDR Environment для реалистичных отражений */}
      <Environment preset="city" />

      {/* Освещение */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#22d3ee" />
      <pointLight position={[-10, -10, -5]} intensity={0.8} color="#0ea5e9" />
      <spotLight
        position={[0, 5, 5]}
        angle={0.5}
        penumbra={1}
        intensity={1}
        color="#38bdf8"
        castShadow
      />

      {/* Основные 3D элементы */}
      <MorphingShape mousePosition={mousePosition} />
      <ParticleFormation mousePosition={mousePosition} />
      <AmbientParticles />

      {/* Эффект глубины при скролле */}
      <group position={[0, -scrollProgress * 3, 0]}>
        <mesh position={[0, -5, -8]} scale={[20, 0.1, 20]}>
          <planeGeometry />
          <meshStandardMaterial
            color="#0a1929"
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.3}
          />
        </mesh>
      </group>
    </Canvas>
  );
};
