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

const SHAPE_COUNT = 980;
const CYCLE_SECONDS = 7.2;
const EXPLOSION_SECONDS = 0.85;
const glassVertexShader = `
  attribute vec3 color;
  varying vec3 vColor;
  void main() {
    vColor = color;
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = 4.8 * (6.2 / max(1.0, -viewPosition.z));
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
    vec3 glass = mix(vColor * 0.62, vec3(0.92, 0.98, 1.0), rim * 0.68 + shine * 0.72);
    gl_FragColor = vec4(glass, disc * (0.46 + rim * 0.42 + shine * 0.32));
  }
`;

function makeShapeTargets(count: number, centerX: number) {
  const targets = Array.from({ length: 6 }, () => new Float32Array(count * 3));
  let seed = 271828;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  for (let i = 0; i < count; i += 1) {
    const offset = i * 3;
    const u = random() * 2 - 1;
    const v = random() * 2 - 1;
    const w = random() * 2 - 1;
    const face = i % 6;
    const cube = [u, v, w];
    cube[Math.floor(face / 2)] = face % 2 === 0 ? 1 : -1;
    targets[0].set([centerX + cube[0] * 0.82, cube[1] * 0.82, cube[2] * 0.82], offset);

    const longitude = random() * Math.PI * 2;
    const latitude = Math.acos(random() * 2 - 1);
    targets[1].set([
      centerX + 0.96 * Math.sin(latitude) * Math.cos(longitude),
      0.96 * Math.cos(latitude),
      0.96 * Math.sin(latitude) * Math.sin(longitude),
    ], offset);

    const angle = random() * Math.PI * 2;
    const tube = (random() * 2 - 1) * 0.16;
    const ring = 0.66 + tube;
    targets[2].set([
      centerX + ring * Math.cos(angle), tube * 1.8, ring * Math.sin(angle),
    ], offset);

    // Four triangular faces meeting at the apex create a recognizable pyramid.
    const pyramidFace = i % 4;
    const sideU = Math.sqrt(random());
    const sideV = random();
    const baseCorners = [[-0.82, -0.62], [0.82, -0.62], [0.82, 0.62], [-0.82, 0.62]];
    const [cornerAX, cornerAZ] = baseCorners[pyramidFace];
    const [cornerBX, cornerBZ] = baseCorners[(pyramidFace + 1) % 4];
    const baseX = THREE.MathUtils.lerp(cornerAX, cornerBX, sideV);
    const baseZ = THREE.MathUtils.lerp(cornerAZ, cornerBZ, sideV);
    targets[3].set([
      centerX + baseX * sideU,
      -0.68 + 1.38 * (1 - sideU),
      baseZ * sideU,
    ], offset);

    // An elongated octahedral crystal with sharp shoulders and a pointed base.
    const crystalFace = i % 8;
    const crystalU = Math.sqrt(random());
    const crystalV = random() * crystalU;
    const crystalSigns = [[1, 1], [-1, 1], [-1, -1], [1, -1]];
    const [signX, signZ] = crystalSigns[crystalFace % 4];
    const topFace = crystalFace < 4;
    targets[4].set([
      centerX + signX * (0.94 * crystalU - 0.03 * crystalV),
      topFace ? 0.9 - 0.86 * crystalU : -0.9 + 0.86 * crystalU,
      signZ * 0.56 * crystalV,
    ], offset);

    // A zig-zag bolt, distributed along six connected strokes with a glassy body.
    const boltPath = [[-0.34, 0.92], [0.18, 0.28], [-0.22, 0.28], [0.42, -0.42], [0.02, -0.42], [0.32, -0.92]];
    const segment = Math.floor(random() * (boltPath.length - 1));
    const along = random();
    const [startX, startY] = boltPath[segment];
    const [endX, endY] = boltPath[segment + 1];
    targets[5].set([
      centerX + THREE.MathUtils.lerp(startX, endX, along) + (random() - 0.5) * 0.08,
      THREE.MathUtils.lerp(startY, endY, along) + (random() - 0.5) * 0.08,
      (random() - 0.5) * 0.2,
    ], offset);
  }
  return targets;
}

function ParticleField() {
  const points = useRef<THREE.Points>(null);
  const ambientPoints = useRef<THREE.Points>(null);
  const positionAttribute = useRef<THREE.BufferAttribute>(null);
  const pointer = useRef({ x: 0, y: 0, active: false });
  const reducedMotion = useRef(false);
  const centerX = typeof window !== "undefined" && window.innerWidth < 760 ? 0.1 : 2.05;
  const targets = useMemo(() => makeShapeTargets(SHAPE_COUNT, centerX), [centerX]);
  const positions = useMemo(() => {
    const values = new Float32Array(SHAPE_COUNT * 3);
    values.set(targets[0]);
    return values;
  }, [targets]);
  const colors = useMemo(() => {
    const values = new Float32Array(SHAPE_COUNT * 3);
    const color = new THREE.Color();
    for (let i = 0; i < SHAPE_COUNT; i += 1) {
      const palette = [0.49, 0.52, 0.57, 0.64, 0.72];
      color.setHSL(palette[i % palette.length], 0.7 + (i % 3) * 0.1, 0.62 + (i % 4) * 0.055);
      color.toArray(values, i * 3);
    }
    return values;
  }, []);
  const ambientPositions = useMemo(() => {
    const values = new Float32Array(260 * 3);
    let seed = 314159;
    const random = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    const halfWidth = Math.max(4.5, (typeof window !== "undefined" ? window.innerWidth / window.innerHeight : 1.8) * 3.5);
    for (let i = 0; i < 260; i += 1) {
      values[i * 3] = (random() * 2 - 1) * halfWidth;
      values[i * 3 + 1] = (random() * 2 - 1) * 3.4;
      values[i * 3 + 2] = -1.5 + random() * 2;
    }
    return values;
  }, []);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => { reducedMotion.current = preference.matches; };
    updateMotionPreference();
    preference.addEventListener("change", updateMotionPreference);
    const move = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = -(event.clientY / window.innerHeight - 0.5) * 2;
      pointer.current.active = true;
    };
    const leave = () => { pointer.current.active = false; };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("blur", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("blur", leave);
      preference.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  useFrame((state, delta) => {
    const attribute = positionAttribute.current;
    const object = points.current;
    if (!attribute || !object) return;
    const frameDelta = reducedMotion.current ? 0 : delta;
    const elapsed = reducedMotion.current ? 4 : state.clock.elapsedTime;
    const cycle = (elapsed % CYCLE_SECONDS) / CYCLE_SECONDS;
    const shapeIndex = Math.floor(elapsed / CYCLE_SECONDS) % targets.length;
    const nextIndex = (shapeIndex + 1) % targets.length;
    const stageTime = cycle * CYCLE_SECONDS;
    const assembly = THREE.MathUtils.smoothstep(stageTime, EXPLOSION_SECONDS, EXPLOSION_SECONDS + 2.2);
    const hold = THREE.MathUtils.smoothstep(stageTime, EXPLOSION_SECONDS + 2.2, CYCLE_SECONDS);
    const burst = stageTime < EXPLOSION_SECONDS ? Math.sin((stageTime / EXPLOSION_SECONDS) * Math.PI) : 0;
    const array = attribute.array as Float32Array;
    const target = targets[shapeIndex];
    const next = targets[nextIndex];
    const drift = 0.025 * Math.sin(elapsed * 0.65);
    const blend = Math.max(assembly, hold);
    const aspect = state.size.width / Math.max(1, state.size.height);
    const pointerX = pointer.current.x * Math.min(aspect * 3.5, 6);
    const pointerY = pointer.current.y * 3.5;

    for (let i = 0; i < SHAPE_COUNT; i += 1) {
      const j = i * 3;
      const baseX = THREE.MathUtils.lerp(target[j], next[j], blend);
      const baseY = THREE.MathUtils.lerp(target[j + 1], next[j + 1], blend);
      const baseZ = THREE.MathUtils.lerp(target[j + 2], next[j + 2], blend);
      const dx = baseX - pointerX;
      const dy = baseY - pointerY;
      const distance = Math.sqrt(dx * dx + dy * dy + baseZ * baseZ) + 0.001;
      const repel = pointer.current.active ? Math.max(0, 1 - distance / 1.6) * 0.5 : 0;
      const scatterX = (((i * 0.754877666) % 1) * 2 - 1) * Math.max(3.5, aspect * 2.15);
      const scatterY = (((i * 0.569840291 + 0.3) % 1) * 2 - 1) * 2.25;
      const scatterZ = (((i * 0.43857921 + 0.7) % 1) * 2 - 1) * 1.4;
      const amount = Math.min(1, frameDelta * 5);
      array[j] += (THREE.MathUtils.lerp(baseX, scatterX, burst) + drift - dx / distance * repel - array[j]) * amount;
      array[j + 1] += (THREE.MathUtils.lerp(baseY, scatterY, burst) + Math.sin(elapsed * 0.55 + i) * 0.025 - dy / distance * repel - array[j + 1]) * amount;
      array[j + 2] += (THREE.MathUtils.lerp(baseZ, scatterZ, burst) - array[j + 2]) * amount;
    }
    attribute.needsUpdate = true;
    object.rotation.y += frameDelta * 0.08;
    object.rotation.x = THREE.MathUtils.damp(object.rotation.x, pointer.current.y * -0.08, 2, frameDelta);
    if (ambientPoints.current) ambientPoints.current.rotation.y += frameDelta * 0.006;
  });

  return (
    <>
      <points ref={ambientPoints} position={[0, 0, -1]} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[ambientPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#64c9ee" size={0.018} transparent opacity={0.48} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      <points ref={points} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute ref={positionAttribute} attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
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
    </>
  );
}

export default function EarthHero() {
  return (
    <div className="earth-hero" aria-hidden="true">
      <div className="earth-hero__canvas-wrap">
        <Canvas
          dpr={[1, 1.6]}
          camera={{ position: [0, 0, 6.2], fov: 42 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          onCreated={({ gl }) => {
            gl.setClearColor("#000000", 0);
          }}
        >
          <ambientLight intensity={0.42} />
          <directionalLight color="#c4eaff" intensity={2.2} position={[-3, 2, 4]} />
          <directionalLight color="#0877c4" intensity={1.15} position={[3, -1, -2]} />
          <ParticleField />
        </Canvas>
      </div>
      <div className="earth-hero__vignette" />
    </div>
  );
}
