import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import "../styles/EarthHero.css";

const galaxyVertexShader = `
  attribute vec3 color;
  attribute float aSize;
  attribute float aIntensity;
  attribute float aSeed;
  varying vec3 vColor;
  varying float vIntensity;
  varying float vSeed;

  void main() {
    vColor = color;
    vIntensity = aIntensity;
    vSeed = aSeed;
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = aSize * (38.0 / max(4.0, -viewPosition.z));
  }
`;

const galaxyFragmentShader = `
  uniform float uTime;
  varying vec3 vColor;
  varying float vIntensity;
  varying float vSeed;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float radius = length(uv);
    float disc = 1.0 - smoothstep(0.3, 0.5, radius);
    float halo = 1.0 - smoothstep(0.02, 0.5, radius);
    float core = exp(-dot(uv, uv) * 170.0);
    float pulse = 0.86 + 0.14 * sin(uTime * (0.42 + vSeed * 0.9) + vSeed * 23.0);
    float alpha = disc * (0.12 + halo * 0.22 + core * 0.72) * vIntensity * pulse;
    vec3 color = mix(vColor * 0.72, vec3(1.0), core * 0.66 + halo * 0.12);

    if (alpha < 0.012) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

const DESKTOP_PARTICLE_COUNT = 5600;
const MOBILE_PARTICLE_COUNT = 3200;

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function createGalaxy(count: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const intensities = new Float32Array(count);
  const seeds = new Float32Array(count);
  const random = seededRandom(0x1a4a7);
  const color = new THREE.Color();

  for (let i = 0; i < count; i += 1) {
    const offset = i * 3;
    const isHalo = random() < 0.16;
    const radius = isHalo
      ? 1.1 + Math.pow(random(), 0.48) * 0.95
      : 0.23 + Math.pow(random(), 0.66) * 1.18;
    const angle = random() * Math.PI * 2 + radius * 2.4;
    const armWarp = Math.sin(angle * 2.0 + radius * 7.0) * 0.055 * radius;
    const width = isHalo ? 1.35 : 0.96 + radius * 0.13;
    const x = Math.cos(angle) * radius * 5.65 + (random() - 0.5) * width;
    const y = Math.sin(angle) * radius * 1.68 + armWarp + (random() - 0.5) * (0.08 + radius * 0.2);
    const z = (random() - 0.5) * (0.18 + radius * 0.34);

    positions[offset] = x;
    positions[offset + 1] = y;
    positions[offset + 2] = z;

    const isHot = !isHalo && radius > 0.78 && random() < 0.13;
    const isBrightStar = random() < (isHalo ? 0.035 : 0.012);
    const brightness = isBrightStar ? 0.92 : isHot ? 0.72 + random() * 0.22 : 0.34 + random() * 0.34;
    const tint = random();

    if (tint > 0.96) {
      color.setRGB(1.0, 0.82, 0.72);
    } else if (tint > 0.84) {
      color.setRGB(0.76, 0.84, 0.92);
    } else {
      const neutral = 0.56 + random() * 0.37;
      color.setRGB(neutral * 0.93, neutral * 0.97, neutral);
    }
    color.toArray(colors, offset);

    sizes[i] = isBrightStar ? 2.5 + random() * 2.4 : isHot ? 1.35 + random() * 1.55 : 0.7 + random() * 1.45;
    intensities[i] = brightness;
    seeds[i] = random();
  }

  return { positions, colors, sizes, intensities, seeds };
}

function GalaxyField() {
  const field = useRef<THREE.Group>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const reducedMotion = useRef(false);
  const pointerTarget = useRef({ x: 0, y: 0 });
  const pointerCurrent = useRef({ x: 0, y: 0 });
  const { size } = useThree();
  const particleCount = size.width < 768 ? MOBILE_PARTICLE_COUNT : DESKTOP_PARTICLE_COUNT;
  const galaxy = useMemo(() => createGalaxy(particleCount), [particleCount]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => {
      reducedMotion.current = preference.matches;
    };
    const onPointerMove = (event: PointerEvent) => {
      pointerTarget.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointerTarget.current.y = -(event.clientY / window.innerHeight - 0.5) * 2;
    };

    updateMotionPreference();
    preference.addEventListener("change", updateMotionPreference);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      preference.removeEventListener("change", updateMotionPreference);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  useFrame((state, delta) => {
    if (!field.current || !material.current) return;
    const frameDelta = reducedMotion.current ? 0 : delta;
    const aspect = state.size.width / Math.max(1, state.size.height);
    const isPortrait = aspect < 0.9;
    const targetScaleX = isPortrait ? 0.76 : Math.min(1.18, aspect * 0.74);
    const targetScaleY = isPortrait ? 1.52 : 1.0;

    pointerCurrent.current.x = THREE.MathUtils.damp(pointerCurrent.current.x, pointerTarget.current.x, 1.8, frameDelta);
    pointerCurrent.current.y = THREE.MathUtils.damp(pointerCurrent.current.y, pointerTarget.current.y, 1.8, frameDelta);
    field.current.rotation.z += frameDelta * 0.012;
    field.current.rotation.x = THREE.MathUtils.damp(field.current.rotation.x, pointerCurrent.current.y * 0.018, 1.5, frameDelta);
    field.current.rotation.y = THREE.MathUtils.damp(field.current.rotation.y, pointerCurrent.current.x * 0.028, 1.5, frameDelta);
    field.current.position.x = THREE.MathUtils.damp(field.current.position.x, pointerCurrent.current.x * 0.08, 1.2, frameDelta);
    field.current.position.y = THREE.MathUtils.damp(field.current.position.y, (isPortrait ? -0.16 : -0.12) + pointerCurrent.current.y * 0.05, 1.2, frameDelta);
    field.current.scale.x = THREE.MathUtils.damp(field.current.scale.x, targetScaleX, 2.2, frameDelta || 1 / 60);
    field.current.scale.y = THREE.MathUtils.damp(field.current.scale.y, targetScaleY, 2.2, frameDelta || 1 / 60);
    material.current.uniforms.uTime.value += frameDelta;
  });

  return (
    <group ref={field} rotation={[0, 0, -0.2]}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[galaxy.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[galaxy.colors, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[galaxy.sizes, 1]} />
          <bufferAttribute attach="attributes-aIntensity" args={[galaxy.intensities, 1]} />
          <bufferAttribute attach="attributes-aSeed" args={[galaxy.seeds, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={material}
          uniforms={{ uTime: { value: 0 } }}
          vertexShader={galaxyVertexShader}
          fragmentShader={galaxyFragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>
    </group>
  );
}

export default function EarthHero() {
  return (
    <div className="earth-hero earth-hero--cosmic" aria-hidden="true">
      <div className="earth-hero__canvas-wrap">
        <Canvas
          dpr={[1, 1.35]}
          camera={{ position: [0, 0, 10], fov: 42, near: 0.1, far: 40 }}
          gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
          onCreated={({ gl }) => {
            gl.setClearColor("#000000", 0);
          }}
        >
          <GalaxyField />
        </Canvas>
      </div>
      <div className="earth-hero__vignette" />
    </div>
  );
}
