import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  ArrowRight,
  ChevronDown,
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { t } = useLanguage();
  const heroRef = React.useRef<HTMLElement>(null);
  const networkRef = React.useRef<HTMLCanvasElement>(null);
  const pointerRef = React.useRef({ x: 0, y: 0, active: false });

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return;

    const bounds = e.currentTarget.getBoundingClientRect();
    pointerRef.current.x = e.clientX - bounds.left;
    pointerRef.current.y = e.clientY - bounds.top;
    pointerRef.current.active = true;
  };

  React.useEffect(() => {
    const canvas = networkRef.current;
    const section = heroRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !section || !context) return;

    const spacing = 68;
    const honeycombSize = 26;
    const crystallizationRadius = 230;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0;
    let height = 0;
    let columns = 0;
    let frameId = 0;
    let nodes: Array<{ x: number; y: number; row: number; col: number; phase: number }> = [];

    const resize = () => {
      const bounds = section.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      columns = Math.ceil(width / spacing) + 2;
      const rows = Math.ceil(height / spacing) + 2;
      nodes = Array.from({ length: rows * columns }, (_, index) => {
        const row = Math.floor(index / columns);
        const col = index % columns;
        return {
          x: col * spacing + (row % 2) * spacing / 2 - spacing / 2,
          y: row * spacing - spacing / 2,
          row,
          col,
          phase: Math.random() * Math.PI * 2,
        };
      });
    };

    const closestHoneycombVertex = (x: number, y: number, centerX: number, centerY: number) => {
      const qEstimate = Math.round((x - centerX) / (1.5 * honeycombSize));
      const best = { x, y, distance: Number.POSITIVE_INFINITY };

      for (let q = qEstimate - 1; q <= qEstimate + 1; q += 1) {
        const rEstimate = Math.round(
          (y - centerY) / (Math.sqrt(3) * honeycombSize) - q / 2,
        );
        for (let r = rEstimate - 1; r <= rEstimate + 1; r += 1) {
          const cellX = centerX + 1.5 * honeycombSize * q;
          const cellY = centerY + Math.sqrt(3) * honeycombSize * (r + q / 2);
          for (let corner = 0; corner < 6; corner += 1) {
            const angle = (corner * Math.PI) / 3;
            const vertexX = cellX + honeycombSize * Math.cos(angle);
            const vertexY = cellY + honeycombSize * Math.sin(angle);
            const distance = Math.hypot(x - vertexX, y - vertexY);
            if (distance < best.distance) {
              best.x = vertexX;
              best.y = vertexY;
              best.distance = distance;
            }
          }
        }
      }
      return best;
    };

    const draw = (time: number) => {
      const elapsed = reducedMotion.matches ? 0 : time / 1000;
      const pointer = pointerRef.current;
      const isCrystallizing = pointer.active;
      const positions = nodes.map((node) => {
        const driftX = reducedMotion.matches
          ? 0
          : Math.sin(elapsed * 0.42 + node.phase) * 9 +
            Math.sin(elapsed * 0.19 + node.phase * 1.7) * 5;
        const driftY = reducedMotion.matches
          ? 0
          : Math.cos(elapsed * 0.36 + node.phase * 1.3) * 8 +
            Math.sin(elapsed * 0.23 + node.phase) * 5;
        const x = node.x + driftX;
        const y = node.y + driftY;

        if (!isCrystallizing) return { x, y, influence: 0 };

        const distance = Math.hypot(x - pointer.x, y - pointer.y);
        const influence = Math.max(0, 1 - distance / crystallizationRadius);
        if (!influence) return { x, y, influence };

        const vertex = closestHoneycombVertex(x, y, pointer.x, pointer.y);
        const strength = influence * influence * 0.88;
        return {
          x: x + (vertex.x - x) * strength,
          y: y + (vertex.y - y) * strength,
          influence,
        };
      });

      context.clearRect(0, 0, width, height);
      context.lineWidth = 0.7;
      context.strokeStyle = 'rgba(125, 177, 198, 0.14)';
      context.beginPath();
      positions.forEach((point, index) => {
        const node = nodes[index];
        const right = node.col + 1 < columns ? index + 1 : -1;
        const below = index + columns;
        if (right >= 0 && right < positions.length) {
          context.moveTo(point.x, point.y);
          context.lineTo(positions[right].x, positions[right].y);
        }
        if (below < positions.length) {
          context.moveTo(point.x, point.y);
          context.lineTo(positions[below].x, positions[below].y);
          const diagonal = node.row % 2 === 0
            ? (node.col > 0 ? below - 1 : -1)
            : (node.col + 1 < columns ? below + 1 : -1);
          if (diagonal >= 0 && diagonal < positions.length) {
            context.moveTo(point.x, point.y);
            context.lineTo(positions[diagonal].x, positions[diagonal].y);
          }
        }
      });
      context.stroke();

      if (isCrystallizing) {
        context.save();
        context.lineWidth = 1;
        positions.forEach((point, index) => {
          const node = nodes[index];
          const right = node.col + 1 < columns ? index + 1 : -1;
          const below = index + columns;
          const diagonal = node.row % 2 === 0
            ? (node.col > 0 ? below - 1 : -1)
            : (node.col + 1 < columns ? below + 1 : -1);
          const neighbors = [right, below, diagonal];
          neighbors.forEach((neighborIndex) => {
            if (neighborIndex < 0 || neighborIndex >= positions.length) return;
            const neighbor = positions[neighborIndex];
            const influence = Math.max(point.influence, neighbor.influence);
            if (influence < 0.08) return;
            context.strokeStyle = `rgba(103, 232, 249, ${influence * 0.62})`;
            context.beginPath();
            context.moveTo(point.x, point.y);
            context.lineTo(neighbor.x, neighbor.y);
            context.stroke();
          });
        });

        const qMin = Math.floor(-crystallizationRadius / (1.5 * honeycombSize));
        const qMax = Math.ceil(crystallizationRadius / (1.5 * honeycombSize));
        for (let q = qMin; q <= qMax; q += 1) {
          const rMin = Math.floor(
            -crystallizationRadius / (Math.sqrt(3) * honeycombSize) - q / 2,
          );
          const rMax = Math.ceil(
            crystallizationRadius / (Math.sqrt(3) * honeycombSize) - q / 2,
          );
          for (let r = rMin; r <= rMax; r += 1) {
            const cellX = pointer.x + 1.5 * honeycombSize * q;
            const cellY = pointer.y + Math.sqrt(3) * honeycombSize * (r + q / 2);
            const distance = Math.hypot(cellX - pointer.x, cellY - pointer.y);
            if (distance > crystallizationRadius) continue;
            const alpha = (1 - distance / crystallizationRadius) * 0.2;
            context.strokeStyle = `rgba(103, 232, 249, ${alpha})`;
            context.beginPath();
            for (let corner = 0; corner < 6; corner += 1) {
              const angle = (corner * Math.PI) / 3;
              const x = cellX + honeycombSize * Math.cos(angle);
              const y = cellY + honeycombSize * Math.sin(angle);
              if (corner === 0) context.moveTo(x, y);
              else context.lineTo(x, y);
            }
            context.closePath();
            context.stroke();
          }
        }
        context.restore();
      }

      positions.forEach((point) => {
        const radius = 1 + point.influence * 0.8;
        context.fillStyle = point.influence
          ? `rgba(165, 243, 252, ${0.38 + point.influence * 0.55})`
          : 'rgba(148, 192, 209, 0.48)';
        context.beginPath();
        context.arc(point.x, point.y, radius, 0, Math.PI * 2);
        context.fill();
      });

      frameId = window.requestAnimationFrame(draw);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(section);
    frameId = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
    };
  }, []);

  const handlePointerLeave = () => {
    pointerRef.current.active = false;
  };

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const elem = document.querySelector(id);
    if (elem) {
      const offsetTop = elem.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  };

  // Повторяем список тегов для 100% бесшовного бесконечного цикла бегущей строки
  const marqueeBlock = [...t.hero.tags, ...t.hero.tags, ...t.hero.tags];

  return (
    <section
      ref={heroRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative overflow-hidden isolate h-[100dvh] max-h-[100dvh] flex flex-col justify-between bg-[#080b12]"
    >
      <style>{`
        @keyframes continuousMarquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .hero-ambient {
          background:
            radial-gradient(ellipse at 18% 12%, rgba(14, 165, 233, 0.17), transparent 44%),
            radial-gradient(ellipse at 84% 76%, rgba(79, 70, 229, 0.14), transparent 42%),
            linear-gradient(135deg, #090e19 0%, #080b12 52%, #0b0d19 100%);
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: continuousMarquee 26s linear infinite;
          will-change: transform;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
      `}</style>

      <div className="hero-ambient absolute inset-0 pointer-events-none" aria-hidden="true" />
      <canvas
        ref={networkRef}
        className="absolute inset-0 h-full w-full pointer-events-none"
        aria-hidden="true"
      />

      {/* ========================================================= */}
      {/* МОБИЛЬНАЯ ВЕРСИЯ */}
      {/* ========================================================= */}
      <div className="flex lg:hidden flex-col h-full w-full relative z-10">
        {/* Верхняя половина (0 - 50dvh): Заголовок упирается низом точно в середину экрана */}
        <div className="h-[50dvh] flex flex-col justify-end items-center px-4 pb-2 sm:pb-3 text-center">
          <h1 className="text-[26px] sm:text-3xl font-black tracking-tight leading-[1.14] max-w-md mx-auto">
            <span className="block text-white mb-0.5">
              {t.hero.titlePrefix}
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-300">
              {t.hero.titleHighlight}
            </span>
          </h1>
        </div>

        {/* Нижняя половина (50dvh - 100dvh) */}
        <div className="h-[50dvh] min-h-0 flex flex-col justify-between items-center w-full relative">
          {/* Пространство между 50dvh и верхней кнопкой в естественном flex-потоке */}
          <div className="flex-1 w-full flex flex-col justify-between items-center min-h-0 py-1">
            {/* 1. Верхний слот: Бегущая строка (непрерывный бесшовный цикл без прерываний) */}
            <div className="flex-1 w-full flex items-center min-h-[30px] overflow-hidden pointer-events-none">
              <div className="w-full overflow-hidden py-0.5 sm:py-1">
                <div className="marquee-track flex whitespace-nowrap">
                  <div className="flex items-center shrink-0">
                    {marqueeBlock.map((tag, idx) => (
                      <span key={`mob-ticker-a-${idx}`} className="inline-flex items-center">
                        <span className="text-[11px] sm:text-xs font-sans font-bold text-slate-200 uppercase tracking-[0.14em] px-4">
                          {tag}
                        </span>
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center shrink-0" aria-hidden="true">
                    {marqueeBlock.map((tag, idx) => (
                      <span key={`mob-ticker-b-${idx}`} className="inline-flex items-center">
                        <span className="text-[11px] sm:text-xs font-sans font-bold text-slate-200 uppercase tracking-[0.14em] px-4">
                          {tag}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Центральный слот: Описание (ровно посередине между 50dvh и кнопками) */}
            <div className="shrink-0 px-4 text-center max-w-sm mx-auto my-auto">
              <p className="text-sm sm:text-[15px] md:text-base text-slate-300 leading-relaxed text-balance font-bold">
                {t.hero.description}
              </p>
            </div>

            {/* 3. Нижний слот: симметричное пространство для идеальной центровки описания */}
            <div className="flex-1 w-full min-h-[10px]" />
          </div>

          {/* Нижняя группа: Кнопки + Галочка */}
          <div className="shrink-0 flex flex-col items-center w-full pb-2 px-4 z-20">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-xs sm:max-w-none w-full mb-1.5">
              {/* Главная кнопка */}
              <a
                href="#contact"
                onClick={(e) => handleScrollTo(e, '#contact')}
                className="relative group overflow-hidden w-full sm:w-auto px-6 py-2.5 rounded-full font-bold text-slate-950 bg-cyan-400 transition-colors duration-300 active:scale-[0.98] text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-400/20"
              >
                <span className="absolute inset-0 bg-white rounded-full -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out pointer-events-none" />
                <span className="relative z-10 flex items-center gap-2">
                  <span>{t.hero.ctaPrimary}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </a>

              {/* Второстепенная кнопка */}
              <a
                href="#projects"
                onClick={(e) => handleScrollTo(e, '#projects')}
                className="relative group overflow-hidden w-full sm:w-auto px-6 py-2.5 rounded-full font-semibold text-slate-200 transition-colors duration-300 active:scale-[0.98] text-xs flex items-center justify-center gap-2 cursor-pointer bg-white/5 border border-white/10 hover:border-white/30"
              >
                <span className="absolute inset-0 bg-white rounded-full -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out pointer-events-none" />
                <span className="relative z-10 transition-colors duration-300 group-hover:text-slate-950 font-semibold">
                  {t.hero.ctaSecondary}
                </span>
              </a>
            </div>

            {/* Галочка в самом низу */}
            <div className="flex justify-center pb-0.5">
              <a
                href="#about"
                onClick={(e) => handleScrollTo(e, '#about')}
                aria-label="Перейти к разделу Обо мне"
                className="p-1 rounded-full text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
              >
                <ChevronDown className="w-4 h-4 text-cyan-400 animate-bounce" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ДЕСКТОП ВЕРСИЯ */}
      {/* ========================================================= */}
      <div className="hidden lg:flex flex-col justify-between pt-22 pb-4 max-w-6xl mx-auto px-6 z-10 w-full text-center h-full">
        {/* Верхний спейсер */}
        <div className="shrink-0 h-1" />

        {/* Смысловой центр */}
        <div className="my-auto py-2 flex flex-col items-center justify-center -translate-y-4">
          <h1 className="text-5xl xl:text-6xl font-black tracking-tight leading-[1.10] mb-3 max-w-4xl mx-auto">
            <span className="block text-white mb-1">
              {t.hero.titlePrefix}
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-300">
              {t.hero.titleHighlight}
            </span>
          </h1>

          {/* Строка специализаций на ПК: ГАРАНТИРОВАННО В ОДНУ СТРОКУ, БЕЗ ПЕРЕНОСОВ */}
          <div className="flex flex-nowrap items-center justify-center gap-x-6 text-xs font-sans font-bold text-slate-300 uppercase tracking-[0.16em] my-3.5 w-full max-w-5xl mx-auto whitespace-nowrap">
            {t.hero.tags.map((tag, idx) => (
              <span key={idx} className="hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0">{tag}</span>
            ))}
          </div>

          <p className="text-base lg:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto text-balance font-bold px-3 mt-2">
            {t.hero.description}
          </p>
        </div>

        {/* Низ экрана на ПК: Метрики + Кнопки + Галочка */}
        <div className="mt-auto flex flex-col items-center w-full z-20 shrink-0">
          <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto text-center mb-5 w-full">
            <div className="p-3.5 rounded-2xl bg-white/[0.04] backdrop-blur-sm border border-white/10 hover:border-cyan-400/30 transition-colors flex flex-col items-center justify-center text-center">
              <div className="text-white font-extrabold text-base tracking-tight mb-0.5">
                {t.hero.metrics.days}
              </div>
              <div className="text-xs text-slate-400">
                {t.hero.metrics.daysLabel}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.04] backdrop-blur-sm border border-white/10 hover:border-cyan-400/30 transition-colors flex flex-col items-center justify-center text-center">
              <div className="text-white font-extrabold text-base tracking-tight mb-0.5">
                {t.hero.metrics.price}
              </div>
              <div className="text-xs text-slate-400">
                {t.hero.metrics.priceLabel}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.04] backdrop-blur-sm border border-white/10 hover:border-cyan-400/30 transition-colors flex flex-col items-center justify-center text-center">
              <div className="text-white font-extrabold text-base tracking-tight mb-0.5">
                {t.hero.metrics.direct}
              </div>
              <div className="text-xs text-slate-400">
                {t.hero.metrics.directLabel}
              </div>
            </div>
          </div>

          <div className="flex flex-row items-center justify-center gap-4 mx-auto w-full mb-4 px-3">
            <a
              href="#contact"
              onClick={(e) => handleScrollTo(e, '#contact')}
              className="relative group overflow-hidden px-8 py-3.5 rounded-full font-bold text-slate-950 bg-cyan-400 transition-colors duration-300 active:scale-[0.98] text-sm md:text-base flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-400/20"
            >
              <span className="absolute inset-0 bg-white rounded-full -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out pointer-events-none" />
              <span className="relative z-10 flex items-center gap-2">
                <span>{t.hero.ctaPrimary}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </a>

            <a
              href="#projects"
              onClick={(e) => handleScrollTo(e, '#projects')}
              className="relative group overflow-hidden px-8 py-3.5 rounded-full font-semibold text-slate-200 transition-colors duration-300 active:scale-[0.98] text-sm md:text-base flex items-center justify-center gap-2 cursor-pointer bg-white/5 border border-white/10 hover:border-white/30"
            >
              <span className="absolute inset-0 bg-white rounded-full -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out pointer-events-none" />
              <span className="relative z-10 transition-colors duration-300 group-hover:text-slate-950 font-semibold">
                {t.hero.ctaSecondary}
              </span>
            </a>
          </div>

          <div className="flex justify-center pb-1">
            <a
              href="#about"
              onClick={(e) => handleScrollTo(e, '#about')}
              aria-label="Перейти к разделу Обо мне"
              className="p-1 rounded-full text-slate-400 hover:text-cyan-400 hover:bg-white/5 transition-colors cursor-pointer group"
            >
              <ChevronDown className="w-5 h-5 text-cyan-400 animate-bounce" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;