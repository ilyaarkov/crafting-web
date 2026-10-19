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

export default function EarthHero() {
  return (
    <div className="earth-hero" aria-hidden="true">
      <div className="earth-hero__canvas-wrap">
        <Canvas
          dpr={[1, 1.6]}
          camera={{ position: [0, 0, 3.15], fov: 38 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          onCreated={({ gl }) => {
            gl.setClearColor("#000000", 0);
          }}
        >
          <ambientLight intensity={0.42} />
          <directionalLight color="#c4eaff" intensity={2.2} position={[-3, 2, 4]} />
          <directionalLight color="#0877c4" intensity={1.15} position={[3, -1, -2]} />
          <Globe />
        </Canvas>
      </div>
      <div className="earth-hero__vignette" />
    </div>
  );
}
