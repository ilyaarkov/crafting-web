import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import "../styles/EarthHero.css";

const solarFlowVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const solarFlowFragmentShader = `
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    float lineAlpha = 0.0;
    vec3 lineColor = vec3(0.12, 0.62, 0.82);

    for (int i = 0; i < 3; i++) {
      float index = float(i);
      float phase = index * 1.17;
      float center = 0.18 + index * 0.32;
      float local = (vUv.x - center) / 0.24;
      float segment = 1.0 - smoothstep(0.82, 1.0, abs(local));
      float curve = 0.32 + index * 0.16
        + sin(local * 1.2 + phase) * 0.09
        + sin(local * 2.4 - phase) * 0.025;
      float distanceToCurve = abs(vUv.y - curve);
      float core = 1.0 - smoothstep(0.0007, 0.0018, distanceToCurve);
      float halo = 1.0 - smoothstep(0.0015, 0.005, distanceToCurve);

      float pulsePosition = fract(local * 0.5 + 0.5 - uTime * 0.045 + index * 0.31);
      float pulse = exp(-pow((pulsePosition - 0.5) / 0.09, 2.0));
      lineAlpha = max(lineAlpha, segment * (halo * 0.035 + core * (0.08 + pulse * 0.32)));
    }

    gl_FragColor = vec4(lineColor, lineAlpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function Globe() {
  const globe = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);
  const solarFlowMaterial = useRef<THREE.ShaderMaterial>(null);
  const scrollTarget = useRef(0);
  const reducedMotion = useRef(false);
  const pointerTarget = useRef({ x: 0, y: 0 });
  const pointerCurrent = useRef({ x: 0, y: 0 });
  // Public-domain NASA Blue Marble equirectangular map.
  const texture = useLoader(THREE.TextureLoader, "/earth/earth-surface.jpg");
  const surfaceTexture = useMemo(() => {
    const map = texture.clone();
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 4;
    return map;
  }, [texture]);
  useEffect(() => {
    const hero = document.querySelector(".earth-hero");
    const onScroll = () => {
      if (!hero) return;
      const bounds = hero.getBoundingClientRect();
      scrollTarget.current = THREE.MathUtils.clamp(-bounds.top / Math.max(1, bounds.height), 0, 1);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => () => surfaceTexture.dispose(), [surfaceTexture]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      reducedMotion.current = mediaQuery.matches;
    };
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useFrame((state, delta) => {
    if (!globe.current || !tilt.current || !solarFlowMaterial.current) return;
    const frameDelta = reducedMotion.current ? 0 : delta;
    pointerCurrent.current.x = THREE.MathUtils.damp(pointerCurrent.current.x, pointerTarget.current.x, 3, frameDelta);
    pointerCurrent.current.y = THREE.MathUtils.damp(pointerCurrent.current.y, pointerTarget.current.y, 3, frameDelta);

    // Keep continuous rotation separate from the small interactive tilt.
    globe.current.rotation.y += frameDelta * 0.035;
    solarFlowMaterial.current.uniforms.uTime.value += frameDelta;
    tilt.current.rotation.y = THREE.MathUtils.damp(
      tilt.current.rotation.y,
      pointerCurrent.current.x * 0.14,
      2.5,
      frameDelta
    );
    tilt.current.rotation.x = THREE.MathUtils.damp(
      tilt.current.rotation.x,
      pointerCurrent.current.y * 0.12 + scrollTarget.current * 0.22,
      2.5,
      frameDelta
    );
    const targetScale = 1.0 - scrollTarget.current * 0.13;
    globe.current.scale.setScalar(THREE.MathUtils.damp(globe.current.scale.x, targetScale, 2.0, frameDelta));

  });

  return (
    <group
      ref={tilt}
      onPointerMove={(event) => {
        const element = (event.nativeEvent.target as HTMLElement).closest(".earth-hero__canvas-wrap");
        const box = element?.getBoundingClientRect();
        if (box) {
          pointerTarget.current.x = ((event.clientX - box.left) / box.width - 0.5) * 2;
          pointerTarget.current.y = ((event.clientY - box.top) / box.height - 0.5) * 2;
        }
      }}
    >
      <group ref={globe}>
        <mesh>
          <sphereGeometry args={[1, 96, 96]} />
          <meshStandardMaterial map={surfaceTexture} color="#8298b3" roughness={0.94} metalness={0.04} />
        </mesh>

        <mesh scale={1.006} renderOrder={1}>
          <sphereGeometry args={[1, 96, 96]} />
          <shaderMaterial
            ref={solarFlowMaterial}
            uniforms={{ uTime: { value: 0 } }}
            vertexShader={solarFlowVertexShader}
            fragmentShader={solarFlowFragmentShader}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
}

const TUNNEL_PARTICLE_COUNT = 2400;
const TUNNEL_FAR_DEPTH = 172;
const glassVertexShader = `
  attribute vec3 color;
  attribute float aSize;
  varying vec3 vColor;
  void main() {
    vColor = color;
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = aSize * (42.0 / max(4.0, -viewPosition.z));
  }
`;
const glassFragmentShader = `
  varying vec3 vColor;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float radius = length(uv);
    float disc = 1.0 - smoothstep(0.32, 0.5, radius);
    float rim = smoothstep(0.22, 0.34, radius) * (1.0 - smoothstep(0.38, 0.49, radius));
    vec2 highlightOffset = uv - vec2(-0.13, 0.16);
    float shine = exp(-dot(highlightOffset * 13.0, highlightOffset * 13.0));
    vec3 glass = mix(vColor * 0.58, vec3(0.92, 0.98, 1.0), rim * 0.7 + shine * 0.72);
    gl_FragColor = vec4(glass, disc * (0.38 + rim * 0.48 + shine * 0.34));
  }
`;

function makeTunnelParticles(count: number) {
  const positions = new Float32Array(count * 3);
  const angles = new Float32Array(count);
  const radiusOffsets = new Float32Array(count);
  let seed = 271828;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  for (let i = 0; i < count; i += 1) {
    const offset = i * 3;
    const segmentCount = 24;
    const segment = Math.floor(random() * segmentCount);
    const angle = (segment / segmentCount + (random() - 0.5) * 0.035) * Math.PI * 2;
    const ring = Math.floor(random() * 40);
    const depth = 8 + ring * 4.05 + (random() - 0.5) * 0.7;
    const radiusOffset = (random() - 0.5) * depth * 0.009;
    const radius = (depth * (0.2 + 0.035 * Math.sin(depth * 0.019) + 0.015 * Math.sin(depth * 0.043)) + radiusOffset) * 1.2;

    angles[i] = angle;
    radiusOffsets[i] = radiusOffset;
    positions[offset] = Math.cos(angle) * radius;
    positions[offset + 1] = Math.sin(angle) * radius;
    positions[offset + 2] = -depth;
  }
  return { positions, angles, radiusOffsets };
}

function ParticleField() {
  const points = useRef<THREE.Points>(null);
  const positionAttribute = useRef<THREE.BufferAttribute>(null);
  const reducedMotion = useRef(false);
  const tunnel = useMemo(() => makeTunnelParticles(TUNNEL_PARTICLE_COUNT), []);
  const sizes = useMemo(() => {
    const values = new Float32Array(TUNNEL_PARTICLE_COUNT);
    let seed = 917231;
    for (let i = 0; i < values.length; i += 1) {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      values[i] = 1.8 + (seed / 4294967296) * 2.2;
    }
    return values;
  }, []);
  const colors = useMemo(() => {
    const values = new Float32Array(TUNNEL_PARTICLE_COUNT * 3);
    const color = new THREE.Color();
    const palette = [0.51, 0.55, 0.58, 0.62, 0.7];
    for (let i = 0; i < TUNNEL_PARTICLE_COUNT; i += 1) {
      color.setHSL(palette[i % palette.length], 0.72, 0.64 + (i % 4) * 0.045);
      color.toArray(values, i * 3);
    }
    return values;
  }, []);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => { reducedMotion.current = preference.matches; };
    updateMotionPreference();
    preference.addEventListener("change", updateMotionPreference);
    return () => preference.removeEventListener("change", updateMotionPreference);
  }, []);

  useFrame((state, delta) => {
    const attribute = positionAttribute.current;
    if (!attribute || !points.current) return;
    const camera = state.camera as THREE.PerspectiveCamera;
    const elapsed = reducedMotion.current ? 0 : state.clock.elapsedTime;
    const frameDelta = reducedMotion.current ? 0 : delta;
    const array = attribute.array as Float32Array;
    const rotation = elapsed * 0.12;

    for (let i = 0; i < TUNNEL_PARTICLE_COUNT; i += 1) {
      const j = i * 3;
      let depth = camera.position.z - array[j + 2];
      if (depth < 4) {
        depth = 132 + ((i * 37) % 40);
        array[j + 2] = camera.position.z - depth;
      }

      const angle = tunnel.angles[i] + rotation + depth * 0.003;
      const wave = 0.2
        + 0.035 * Math.sin(depth * 0.019 - elapsed * 0.34)
        + 0.015 * Math.sin(depth * 0.043 + elapsed * 0.2);
      const radius = (depth * wave + tunnel.radiusOffsets[i]) * 1.2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const amount = Math.min(1, frameDelta * 3);
      array[j] += (x - array[j]) * amount;
      array[j + 1] += (y - array[j + 1]) * amount;
    }
    attribute.needsUpdate = true;
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute ref={positionAttribute} attach="attributes-position" args={[tunnel.positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={glassVertexShader}
        fragmentShader={glassFragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}

function FlightCamera() {
  const pointer = useRef({ x: 0, y: 0 });
  const reducedMotion = useRef(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => { reducedMotion.current = preference.matches; };
    const move = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = -(event.clientY / window.innerHeight - 0.5) * 2;
    };
    updatePreference();
    preference.addEventListener("change", updatePreference);
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      preference.removeEventListener("change", updatePreference);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  useFrame((state, delta) => {
    const camera = state.camera as THREE.PerspectiveCamera;
    const motion = reducedMotion.current ? 0 : delta;
    camera.position.z -= motion * 1.15;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, pointer.current.x * 0.42, 1.3, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, pointer.current.y * 0.28, 1.3, delta);
    camera.rotation.y = THREE.MathUtils.damp(camera.rotation.y, -pointer.current.x * 0.018, 1.5, delta);
    camera.rotation.x = THREE.MathUtils.damp(camera.rotation.x, pointer.current.y * 0.014, 1.5, delta);
  });

  return null;
}

const starVertexShader = `
  attribute vec3 color;
  attribute float aSize;
  varying vec3 vColor;
  void main() {
    vColor = color;
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = aSize * (22.0 / max(5.0, -viewPosition.z));
  }
`;
const starFragmentShader = `
  varying vec3 vColor;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float radius = length(uv);
    float disc = 1.0 - smoothstep(0.31, 0.5, radius);
    float rim = smoothstep(0.2, 0.34, radius) * (1.0 - smoothstep(0.39, 0.49, radius));
    vec2 highlightOffset = uv - vec2(-0.13, 0.15);
    float shine = exp(-dot(highlightOffset * 12.0, highlightOffset * 12.0));
    float core = exp(-dot(uv, uv) * 150.0);
    float rayX = exp(-abs(uv.y) * 75.0) * (1.0 - smoothstep(0.012, 0.036, abs(uv.x))) * (1.0 - smoothstep(0.12, 0.48, abs(uv.x)));
    float rayY = exp(-abs(uv.x) * 75.0) * (1.0 - smoothstep(0.012, 0.036, abs(uv.y))) * (1.0 - smoothstep(0.12, 0.48, abs(uv.y)));
    float rays = max(rayX, rayY);
    vec3 glass = mix(vColor * 0.45, vec3(0.94, 0.98, 1.0), clamp(rim * 0.66 + shine * 0.68 + core * 0.72, 0.0, 1.0));
    float alpha = disc * (0.22 + rim * 0.62 + shine * 0.38 + core * 0.3) + rays * 0.35;
    if (radius > 0.5 && rays < 0.03) discard;
    gl_FragColor = vec4(glass, clamp(alpha, 0.0, 1.0));
  }
`;

function keepStarOutsideTunnel(x: number, y: number, seed: number) {
  if (Math.hypot(x, y) >= 0.48) return { x, y };
  const angle = seed * 2.3999632297;
  const radius = 0.55 + (seed % 17) / 100;
  return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
}

function Starfield() {
  const positionAttribute = useRef<THREE.BufferAttribute>(null);
  const colorAttribute = useRef<THREE.BufferAttribute>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const starCount = 1450;
  const { positions, homePositions, colors, baseColors, sizes } = useMemo(() => {
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const baseColors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    let seed = 198407;
    const random = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    const aspect = typeof window === "undefined" ? 1.8 : window.innerWidth / window.innerHeight;
    const color = new THREE.Color();

    for (let i = 0; i < starCount; i += 1) {
      const offset = i * 3;
      const depth = 8 + random() * 150;
      const halfHeight = depth * Math.tan(THREE.MathUtils.degToRad(22));
      const projected = keepStarOutsideTunnel(random() * 2 - 1, random() * 2 - 1, i);
      positions[offset] = projected.x * halfHeight * aspect * 1.2;
      positions[offset + 1] = projected.y * halfHeight * 1.2;
      positions[offset + 2] = -depth;
      sizes[i] = i % 53 === 0 ? 3.1 + random() * 1.4 : 1.5 + random() * 1.8;
      const hue = random() > 0.88 ? 0.12 : 0.53 + random() * 0.12;
      color.setHSL(hue, 0.36 + random() * 0.3, 0.68 + random() * 0.28);
      color.toArray(baseColors, offset);
      color.toArray(colors, offset);
    }
    return { positions, homePositions: positions.slice(), colors, baseColors, sizes };
  }, []);

  useEffect(() => {
    const move = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = -(event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useFrame((state, delta) => {
    const position = positionAttribute.current;
    const color = colorAttribute.current;
    const camera = state.camera as THREE.PerspectiveCamera;
    if (!position || !color) return;
    const p = position.array as Float32Array;
    const c = color.array as Float32Array;
    const elapsed = state.clock.elapsedTime;
    const viewAspect = state.size.width / Math.max(1, state.size.height);
    const cameraDepth = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));

    for (let i = 0; i < starCount; i += 1) {
      const j = i * 3;
      if (p[j + 2] > camera.position.z - 3) {
        const depth = 118 + ((i * 47) % 65);
        const halfHeight = depth * cameraDepth;
        const projected = keepStarOutsideTunnel(
          ((i * 0.754877666) % 1) * 2 - 1,
          ((i * 0.569840291 + 0.3) % 1) * 2 - 1,
          i,
        );
        homePositions[j] = camera.position.x + projected.x * halfHeight * viewAspect * 1.2;
        homePositions[j + 1] = camera.position.y + projected.y * halfHeight * 1.2;
        p[j] = homePositions[j];
        p[j + 1] = homePositions[j + 1];
        p[j + 2] = camera.position.z - depth;
      }

      const depth = camera.position.z - p[j + 2];
      const halfHeight = depth * cameraDepth;
      const cursorX = camera.position.x + pointer.current.x * halfHeight * viewAspect;
      const cursorY = camera.position.y + pointer.current.y * halfHeight;
      const homeX = homePositions[j];
      const homeY = homePositions[j + 1];
      const dx = homeX - cursorX;
      const dy = homeY - cursorY;
      const distance = Math.sqrt(dx * dx + dy * dy) + 0.001;
      const radius = depth * 0.075;
      const force = Math.max(0, 1 - distance / radius) * 0.16;
      const targetX = homeX + dx / distance * force;
      const targetY = homeY + dy / distance * force;
      const blend = Math.min(1, delta * 3);
      p[j] += (targetX - p[j]) * blend;
      p[j + 1] += (targetY - p[j + 1]) * blend;
      const twinkle = 0.78 + (Math.sin(elapsed * (0.7 + (i % 9) * 0.08) + i * 1.7) + 1) * 0.11;
      c[j] = baseColors[j] * twinkle;
      c[j + 1] = baseColors[j + 1] * twinkle;
      c[j + 2] = baseColors[j + 2] * twinkle;
    }
    position.needsUpdate = true;
    color.needsUpdate = true;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute ref={positionAttribute} attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute ref={colorAttribute} attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={starVertexShader}
        fragmentShader={starFragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}

export default function EarthHero() {
  return (
    <div className="earth-hero earth-hero--cosmic" aria-hidden="true">
      <div className="earth-hero__canvas-wrap">
        <Canvas
          dpr={[1, 1.6]}
          camera={{ position: [0, 0, 0], fov: 44, near: 0.1, far: 240 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          onCreated={({ gl }) => {
            gl.setClearColor("#000000", 0);
          }}
        >
          <ambientLight intensity={0.32} />
          <FlightCamera />
          <ParticleField />
          <Starfield />
        </Canvas>
      </div>
      <div className="earth-hero__vignette" />
    </div>
  );
}
