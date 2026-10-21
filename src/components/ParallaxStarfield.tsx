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

const NEAR_LAYER = LAYERS.length - 1;

// Детерминированный генератор, чтобы звёзды не «прыгали» между рендерами
const mulberry32 = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const STAR_TINTS = ['255,255,255', '255,255,255', '226,240,255', '207,250,254', '254,243,226'];

const drawStar = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  a: number,
  tint: string,
  glow: boolean,
) => {
  if (glow) {
    const halo = ctx.createRadialGradient(x, y, 0, x, y, r * 5);
    halo.addColorStop(0, `rgba(${tint},${a * 0.35})`);
    halo.addColorStop(1, `rgba(${tint},0)`);
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(x, y, r * 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = `rgba(${tint},${a})`;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
};

// Рисует плитку слоя на canvas и возвращает data URL для background-image
const renderTile = (layer: StarLayer, dpr: number, seed: number, constellations: number): string => {
  const canvas = document.createElement('canvas');
  const size = Math.round(layer.tile * dpr);
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  ctx.scale(dpr, dpr);

  const random = mulberry32(layer.seed + seed);
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
        drawStar(ctx, px, py, r, a, tint, hasGlow);
      }
    }
  }

  // Созвездия: короткие ломаные из ярких звёзд. Держим их внутри плитки, чтобы линии не резались на стыках
  for (let c = 0; c < constellations; c++) {
    const margin = 160;
    let x = margin + random() * (layer.tile - margin * 2);
    let y = margin + random() * (layer.tile - margin * 2);
    let angle = random() * Math.PI * 2;
    const points = [{ x, y }];
    const length = 4 + Math.floor(random() * 3);

    for (let p = 1; p < length; p++) {
      angle += (random() - 0.5) * 1.6;
      const step = 45 + random() * 55;
      x = Math.min(layer.tile - 30, Math.max(30, x + Math.cos(angle) * step));
      y = Math.min(layer.tile - 30, Math.max(30, y + Math.sin(angle) * step));
      points.push({ x, y });
    }

    ctx.strokeStyle = 'rgba(125,211,252,0.16)';
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    points.forEach((pt, p) => (p ? ctx.lineTo(pt.x, pt.y) : ctx.moveTo(pt.x, pt.y)));
    ctx.stroke();

    points.forEach((pt) => {
      drawStar(ctx, pt.x, pt.y, 1.1 + random() * 0.5, 0.75 + random() * 0.2, '207,250,254', random() < 0.6);
    });
  }

  return canvas.toDataURL('image/png');
};

type ParallaxStarfieldProps = {
  // Сдвиг раскладки звёзд, чтобы у разных секций не было одинакового узора
  seed?: number;
  // Количество созвездий на плитку ближнего слоя
  constellations?: number;
  // Высота растворения звёзд у верхней и нижней границы, в процентах высоты секции
  fadeTop?: number;
  fadeBottom?: number;
  // Дополнительный декоративный слой поверх звёзд, движется со своей скоростью параллакса
  accent?: React.ReactNode;
  accentSpeed?: number;
};

/**
 * Равномерное звёздное поле с параллаксом по глубине.
 * Кладётся внутрь секции с `relative overflow-hidden`; занимает её целиком.
 */
// TEMP (test/no-animations): set to true to restore scroll parallax
const ANIMATIONS_ENABLED = false;

export const ParallaxStarfield: React.FC<ParallaxStarfieldProps> = ({
  seed = 0,
  constellations = 0,
  fadeTop = 9,
  fadeBottom = 9,
  accent,
  accentSpeed = 0.45,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const accentRef = useRef<HTMLDivElement>(null);

  // Плитки рисуются один раз на клиенте и сразу назначаются слоям, без лишнего ре-рендера
  useEffect(() => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    LAYERS.forEach((layer, i) => {
      const el = layerRefs.current[i];
      const tile = renderTile(layer, dpr, seed, i === NEAR_LAYER ? constellations : 0);
      if (el && tile) el.style.backgroundImage = `url(${tile})`;
    });
  }, [seed, constellations]);

  useEffect(() => {
    if (!ANIMATIONS_ENABLED) return;
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

      const offset = reducedMotion.matches ? 0 : rect.top + rect.height / 2 - viewportH / 2;
      LAYERS.forEach((layer, i) => {
        const el = layerRefs.current[i];
        if (!el) return;
        el.style.transform = `translate3d(0, ${(-offset * (1 - layer.speed)).toFixed(1)}px, 0)`;
      });
      if (accentRef.current) {
        accentRef.current.style.transform = `translate3d(0, ${(-offset * (1 - accentSpeed)).toFixed(1)}px, 0)`;
      }
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
  }, [accentSpeed]);

  // Маска только растворяет звёзды у верхней и нижней границы, чтобы не было шва с соседними блоками
  const mask = `linear-gradient(to bottom, transparent 0%, black ${fadeTop}%, black ${100 - fadeBottom}%, transparent 100%)`;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
      style={{ maskImage: mask, WebkitMaskImage: mask }}
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
      {accent && (
        <div ref={accentRef} className="absolute inset-0 will-change-transform">
          {accent}
        </div>
      )}
    </div>
  );
};

export default ParallaxStarfield;
