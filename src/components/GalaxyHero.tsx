import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import "../styles/GalaxyHero.css";

const galaxyVertexShader = `
  uniform float uTime;
  attribute vec3 color;
  attribute float aSize;
  attribute float aIntensity;
  attribute float aSeed;
  attribute vec4 aOrbit;
  attribute vec4 aShape;
  varying vec3 vColor;
  varying float vIntensity;
  varying float vSeed;

  void main() {
    float theta = aOrbit.z + uTime * aOrbit.w;
    float wobble = 1.0 + aShape.z * sin(theta * 2.0 + aShape.w);
    vec2 orbitPoint = vec2(cos(theta) * aOrbit.x, sin(theta) * aOrbit.y) * wobble;
    vec2 tiltedPoint = vec2(
      orbitPoint.x * aShape.x - orbitPoint.y * aShape.y,
      orbitPoint.x * aShape.y + orbitPoint.y * aShape.x
    );

    vColor = color;
    vIntensity = aIntensity * (0.92 - 0.08 * sin(theta));
    vSeed = aSeed;
    vec4 viewPosition = modelViewMatrix * vec4(tiltedPoint, position.z, 1.0);
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

const DESKTOP_PARTICLE_COUNT = 7392;
const MOBILE_PARTICLE_COUNT = 4224;

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function gaussianRandom(random: () => number) {
  const radius = Math.sqrt(-2 * Math.log(Math.max(0.0001, random())));
  return radius * Math.cos(random() * Math.PI * 2);
}

function createGalaxy(count: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const intensities = new Float32Array(count);
  const seeds = new Float32Array(count);
  const orbits = new Float32Array(count * 4);
  const shapes = new Float32Array(count * 4);
  const random = seededRandom(0x1a4a7);
  const color = new THREE.Color();
  const ringRadius = 0.62;
  const orbitWidth = 4.9;
  const orbitHeight = 1.55;
  const baseSpeed = 0.028;

  for (let i = 0; i < count; i += 1) {
    const offset = i * 3;
    const orbitOffset = i * 4;
    const isInnerRing = random() < 8 / 11;
    const isOuterDisc = !isInnerRing && random() < 0.7;
    const isHalo = !isInnerRing && !isOuterDisc && random() < 0.3;
    const isCenterDust = !isInnerRing && !isOuterDisc && !isHalo;
    let radius: number;

    if (isInnerRing) {
      const deviation = gaussianRandom(random);
      radius = ringRadius + (deviation < 0 ? deviation * 0.045 : deviation * 0.11);
    } else if (isOuterDisc) {
      radius = 0.7 + Math.pow(random(), 1.7) * 0.85;
    } else if (isHalo) {
      radius = 1.15 + random() * 0.75;
    } else {
      radius = 0.16 + random() * 0.28;
    }
    radius = Math.max(0.12, radius);

    const eccentricity = isHalo
      ? 0.75 + random() * 0.6
      : 0.88 + random() * 0.24;
    const semiMajor = radius * orbitWidth * (0.97 + random() * 0.06);
    const semiMinor = radius * orbitHeight * eccentricity;
    const phase = random() * Math.PI * 2;
    const speed = baseSpeed
      * Math.pow(Math.max(radius, 0.3) / ringRadius, -1.5)
      * (0.85 + random() * 0.3);
    const tilt = (random() - 0.5) * 0.09;
    const wobbleAmount = 0.015 + random() * 0.035;
    const wobblePhase = random() * Math.PI * 2;
    const z = (random() - 0.5) * (0.12 + radius * 0.3);
    const ringDistance = Math.abs(radius - ringRadius);
    const ringBrightness = Math.exp(-((ringDistance / 0.14) ** 2));
    const isBrightStar = random() < (isHalo ? 0.035 : isCenterDust ? 0.028 : 0.016);
    const brightness = isCenterDust
      ? (isBrightStar ? 0.58 + random() * 0.28 : 0.12 + random() * 0.13)
      : (isBrightStar ? 0.92 : 0.34 + random() * 0.34)
        * (0.7 + ringBrightness * 0.42);
    const tint = random();

    positions[offset] = 0;
    positions[offset + 1] = 0;
    positions[offset + 2] = z;
    orbits[orbitOffset] = semiMajor;
    orbits[orbitOffset + 1] = semiMinor;
    orbits[orbitOffset + 2] = phase;
    orbits[orbitOffset + 3] = speed;
    shapes[orbitOffset] = Math.cos(tilt);
    shapes[orbitOffset + 1] = Math.sin(tilt);
    shapes[orbitOffset + 2] = wobbleAmount;
    shapes[orbitOffset + 3] = wobblePhase;

    if (tint > 0.96) {
      color.setRGB(1.0, 0.82, 0.72);
    } else if (tint > 0.84) {
      color.setRGB(0.76, 0.84, 0.92);
    } else {
      const neutral = 0.56 + random() * 0.37;
      color.setRGB(neutral * 0.93, neutral * 0.97, neutral);
    }
    color.toArray(colors, offset);

    sizes[i] = isCenterDust
      ? isBrightStar
        ? 1.6 + random() * 1.4
        : 0.5 + random() * 0.4
      : isBrightStar
        ? 2.5 + random() * 2.4
        : 0.7 + random() * 1.45;
    intensities[i] = brightness;
    seeds[i] = random();
  }

  return { positions, colors, sizes, intensities, seeds, orbits, shapes };
}

function GalaxyField() {
  const field = useRef<THREE.Group>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const animationTime = useRef(0);
  const reducedMotion = useRef(false);
  const pointerTarget = useRef({ x: 0, y: 0 });
  const pointerCurrent = useRef({ x: 0, y: 0 });
  const { size } = useThree();
  const isMobileLayout = size.width < 768;
  const particleCount = isMobileLayout ? MOBILE_PARTICLE_COUNT : DESKTOP_PARTICLE_COUNT;
  const galaxy = useMemo(() => createGalaxy(particleCount), [particleCount]);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

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
    const frameDelta = Number.isFinite(delta) ? Math.min(Math.max(delta, 0), 0.1) : 0;
    const animationDelta = reducedMotion.current ? 0 : frameDelta;
    const layoutDelta = reducedMotion.current ? 1 / 60 : frameDelta;
    const aspect = state.size.width / Math.max(1, state.size.height);
    const isPortrait = isMobileLayout || aspect < 0.9;
    const targetScaleX = isPortrait ? 0.66 : Math.min(1.18, aspect * 0.74);
    const targetScaleY = isPortrait ? 1.3 : 1.0;
    const basePositionX = isMobileLayout ? state.viewport.width / 2 : 0;

    pointerCurrent.current.x = THREE.MathUtils.damp(pointerCurrent.current.x, pointerTarget.current.x, 1.8, frameDelta);
    pointerCurrent.current.y = THREE.MathUtils.damp(pointerCurrent.current.y, pointerTarget.current.y, 1.8, frameDelta);
    field.current.rotation.x = THREE.MathUtils.damp(field.current.rotation.x, pointerCurrent.current.y * 0.018, 1.5, frameDelta);
    field.current.rotation.y = THREE.MathUtils.damp(field.current.rotation.y, pointerCurrent.current.x * 0.028, 1.5, frameDelta);
    field.current.position.x = basePositionX + pointerCurrent.current.x * 0.08;
    field.current.position.y = (isPortrait ? -0.16 : -0.12) + pointerCurrent.current.y * 0.05;
    field.current.scale.x = THREE.MathUtils.damp(field.current.scale.x, targetScaleX, 2.2, layoutDelta);
    field.current.scale.y = THREE.MathUtils.damp(field.current.scale.y, targetScaleY, 2.2, layoutDelta);
    animationTime.current += animationDelta;
    material.current.uniforms.uTime.value = animationTime.current;
  });

  return (
    <group ref={field} rotation={[0, 0, 0]}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[galaxy.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[galaxy.colors, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[galaxy.sizes, 1]} />
          <bufferAttribute attach="attributes-aIntensity" args={[galaxy.intensities, 1]} />
          <bufferAttribute attach="attributes-aSeed" args={[galaxy.seeds, 1]} />
          <bufferAttribute attach="attributes-aOrbit" args={[galaxy.orbits, 4]} />
          <bufferAttribute attach="attributes-aShape" args={[galaxy.shapes, 4]} />
        </bufferGeometry>
        <shaderMaterial
          ref={material}
          uniforms={uniforms}
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

export default function GalaxyHero() {
  return (
    <div className="galaxy-hero galaxy-hero--cosmic" aria-hidden="true">
      <div className="galaxy-hero__canvas-wrap">
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
      <div className="galaxy-hero__vignette" />
    </div>
  );
}
