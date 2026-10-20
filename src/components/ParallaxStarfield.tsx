import React, { useEffect, useRef } from 'react';

// Слои звёздного поля: чем дальше слой, тем меньше и тусклее звёзды и тем медленнее он движется на экране.
// speed — скорость слоя относительно скролла страницы (1 = движется вместе с контентом).
// tile — размер повторяющейся плитки; разные «некратные» размеры не дают узору заметно повторяться.
type StarLayer = {
  speed: number;
  tile: number;
  count: number;
  radius: [number, number];
  alpha: [number, number];
  glowChance: number;
  seed: number;
};

const LAYERS: StarLayer[] = [
  // Дальний слой: много мелкой тусклой пыли
  { speed: 0.18, tile: 557, count: 150, radius: [0.35, 0.7], alpha: [0.18, 0.45], glowChance: 0, seed: 11 },
  // Средний слой
  { speed: 0.45, tile: 733, count: 70, radius: [0.6, 1.05], alpha: [0.35, 0.7], glowChance: 0.05, seed: 23 },
  // Ближний слой: редкие крупные яркие звёзды
  { speed: 0.78, tile: 941, count: 26, radius: [0.95, 1.6], alpha: [0.6, 0.95], glowChance: 0.3, seed: 37 },
];

// Детерминированный генератор, чтобы звёзды не «прыгали» между рендерами
const mulberry32 = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const STAR_TINTS = ['255,255,255', '255,255,255', '226,240,255', '207,250,254', '254,243,226'];

// Рисует плитку слоя на canvas и возвращает data URL для background-image
const renderTile = (layer: StarLayer, dpr: number): string => {
  const canvas = document.createElement('canvas');
  const size = Math.round(layer.tile * dpr);
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  ctx.scale(dpr, dpr);

  const random = mulberry32(layer.seed);
  const lerp = ([a, b]: [number, number]) => a + (b - a) * random();

  for (let i = 0; i < layer.count; i++) {
    const x = random() * layer.tile;
    const y = random() * layer.tile;
    const r = lerp(layer.radius);
    const a = lerp(layer.alpha);
    const tint = STAR_TINTS[Math.floor(random() * STAR_TINTS.length)];
    const hasGlow = random() < layer.glowChance;

    // Звезду у края дублируем с противоположной стороны, чтобы стыки плиток были незаметны
    const pad = r * 6;
    const xs = [x, ...(x < pad ? [x + layer.tile] : x > layer.tile - pad ? [x - layer.tile] : [])];
    const ys = [y, ...(y < pad ? [y + layer.tile] : y > layer.tile - pad ? [y - layer.tile] : [])];

    for (const px of xs) {
      for (const py of ys) {
        if (hasGlow) {
          const halo = ctx.createRadialGradient(px, py, 0, px, py, r * 5);
          halo.addColorStop(0, `rgba(${tint},${a * 0.35})`);
          halo.addColorStop(1, `rgba(${tint},0)`);
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(px, py, r * 5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = `rgba(${tint},${a})`;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  return canvas.toDataURL('image/png');
};

/**
 * Равномерное звёздное поле с параллаксом по глубине.
 * Кладётся внутрь секции с `relative overflow-hidden`; занимает её целиком.
 */
export const ParallaxStarfield: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Плитки рисуются один раз на клиенте и сразу назначаются слоям, без лишнего ре-рендера
  useEffect(() => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    LAYERS.forEach((layer, i) => {
      const el = layerRefs.current[i];
      const tile = renderTile(layer, dpr);
      if (el && tile) el.style.backgroundImage = `url(${tile})`;
    });
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;

    // Смещение слоя = -(отклонение центра секции от центра экрана) * (1 - speed).
    // Тогда слой движется по экрану со скоростью speed относительно скролла.
    const update = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      const viewportH = window.innerHeight;
      if (rect.bottom < -100 || rect.top > viewportH + 100) return;

      const offset = rect.top + rect.height / 2 - viewportH / 2;
      LAYERS.forEach((layer, i) => {
        const el = layerRefs.current[i];
        if (!el) return;
        const shift = reducedMotion.matches ? 0 : -offset * (1 - layer.speed);
        el.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`;
      });
    };

    // Запас высоты слоя сверху и снизу, чтобы при максимальном смещении не появлялись пустые края
    const resize = () => {
      const travel = (root.offsetHeight + window.innerHeight) / 2;
      LAYERS.forEach((layer, i) => {
        const el = layerRefs.current[i];
        if (!el) return;
        const overscan = Math.ceil(travel * (1 - layer.speed)) + 40;
        el.style.top = `${-overscan}px`;
        el.style.bottom = `${-overscan}px`;
      });
      update();
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(root);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resize, { passive: true });
    reducedMotion.addEventListener('change', update);
    resize();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
      reducedMotion.removeEventListener('change', update);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      // Маска только растворяет звёзды у верхней и нижней границы, чтобы не было шва с соседними блоками
      className="absolute inset-0 overflow-hidden pointer-events-none z-0 [mask-image:linear-gradient(to_bottom,transparent_0%,black_9%,black_91%,transparent_100%)]"
    >
      {LAYERS.map((layer, i) => (
        <div
          key={layer.seed}
          ref={(el) => {
            layerRefs.current[i] = el;
          }}
          className="absolute inset-x-0 will-change-transform"
          style={{
            backgroundSize: `${layer.tile}px ${layer.tile}px`,
            backgroundRepeat: 'repeat',
          }}
        />
      ))}
    </div>
  );
};

export default ParallaxStarfield;
