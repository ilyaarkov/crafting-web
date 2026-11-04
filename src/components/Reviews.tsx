import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { ParallaxStarfield } from './ParallaxStarfield';

const AUTOPLAY_MS = 7000;
const SWIPE_THRESHOLD_PX = 40;
const GAP_PX = 24;

// Наклонные орбиты с «планетами» в фиолетово-голубых тонах
const ReviewOrbits: React.FC = () => (
  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
    <g fill="none" stroke="rgba(167,139,250,0.10)" strokeWidth="1" vectorEffect="non-scaling-stroke">
      <ellipse cx="500" cy="500" rx="560" ry="200" transform="rotate(-18 500 500)" />
      <ellipse cx="500" cy="500" rx="400" ry="130" transform="rotate(-18 500 500)" strokeDasharray="2 8" />
    </g>
    <circle cx="905" cy="352" r="3" fill="rgba(196,181,253,0.7)" />
    <circle cx="142" cy="640" r="2.2" fill="rgba(165,243,252,0.6)" />
  </svg>
);

export const Reviews: React.FC = () => {
  const { t, lang } = useLanguage();
  const reviews = t.reviews.items;
  const count = reviews.length;
  const [index, setIndex] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [cardHeight, setCardHeight] = useState<number | undefined>(undefined);
  const viewportRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const touchStartX = useRef<number | null>(null);

  const perView = viewportWidth >= 1100 ? 4 : viewportWidth >= 700 ? 3 : 1;
  const cardWidth = viewportWidth > 0 ? (viewportWidth - GAP_PX * (perView - 1)) / perView : 0;
  const step = cardWidth + GAP_PX;

  const goTo = useCallback(
    (next: number) => {
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setViewportWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Высота карточек одинаковая: берём самую высокую из измеренных
  useLayoutEffect(() => {
    if (cardWidth <= 0) return;
    const heights = cardRefs.current.map((el) => el?.offsetHeight ?? 0);
    setCardHeight(Math.max(...heights));
  }, [cardWidth, lang, count]);

  // Таймер перезапускается при каждой смене индекса, поэтому ручное листание сбрасывает автолистание
  useEffect(() => {
    if (count < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setTimeout(() => goTo(index + 1), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [index, count, goTo]);

  // Позиция каждой карточки относительно активной; карточки по кругу, поэтому переход без скачка
  const placement = (i: number) => {
    const d = (i - index + count) % count;
    if (d < perView) return { x: d * step, visible: true };
    if (d === count - 1) return { x: -step, visible: false };
    return { x: d * step, visible: false };
  };

  const prevLabel = lang === 'ru' ? 'Предыдущий отзыв' : 'Previous review';
  const nextLabel = lang === 'ru' ? 'Следующий отзыв' : 'Next review';
  const dotLabel = (n: number) => (lang === 'ru' ? `Отзыв ${n + 1}` : `Review ${n + 1}`);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < SWIPE_THRESHOLD_PX) return;
    goTo(dx < 0 ? index + 1 : index - 1);
  };

  return (
    <section id="reviews" className="h-[100vh] flex flex-col justify-center relative overflow-hidden bg-[#03050a] z-10">
      <ParallaxStarfield seed={303} constellations={2} accent={<ReviewOrbits />} accentSpeed={0.4} />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[420px] bg-violet-600/15 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 right-1/5 w-[380px] h-[300px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {t.reviews.title}
          </h2>
        </div>

        <div
          ref={viewportRef}
          className="relative touch-pan-y select-none"
          style={{ height: cardHeight }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {reviews.map((review, i) => {
            const project = review.projectId
              ? t.projects.items.find((p) => p.id === review.projectId)
              : undefined;
            const { x, visible } = placement(i);

            return (
              <div
                key={review.name}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                aria-hidden={!visible}
                className={`absolute top-0 left-0 rounded-3xl p-6 sm:p-8 flex flex-col border border-violet-300/15 bg-gradient-to-br from-white/[0.07] via-white/[0.02] to-violet-500/[0.08] backdrop-blur-md shadow-[0_0_70px_rgba(124,58,237,0.22)] transition-[transform,opacity] duration-700 ease-out ${
                  visible ? '' : 'pointer-events-none'
                }`}
                style={{
                  width: cardWidth,
                  transform: `translate3d(${x}px, 0, 0)`,
                  opacity: visible ? 1 : 0,
                }}
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="relative w-14 h-14 shrink-0">
                    <div className="absolute inset-0 rounded-full border border-dashed border-cyan-300/40 animate-[spin_18s_linear_infinite]" />
                    <div className="absolute inset-1.5 rounded-full bg-gradient-to-br from-violet-500/40 to-cyan-400/30 border border-white/15 flex items-center justify-center text-sm font-bold text-white">
                      {review.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                    </div>
                  </div>
                  <Quote className="w-8 h-8 text-violet-300/60 shrink-0" />
                </div>

                <p className="flex-1 text-sm sm:text-base text-slate-100 leading-relaxed">
                  {review.text}
                </p>

                <div className="mt-6 pt-5 border-t border-white/10">
                  <div className="text-sm font-semibold text-white">{review.name}</div>
                  <div className="text-xs text-slate-400">{review.role}</div>
                  {project && (
                    <span className="inline-block mt-3 text-xs text-cyan-200/90 border border-cyan-400/30 bg-cyan-400/5 rounded-full px-3 py-1.5">
                      {project.title}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {count > 1 && (
          <div className="mt-8 flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label={prevLabel}
              className="w-11 h-11 rounded-full border border-white/10 bg-white/5 hover:bg-violet-500/20 hover:border-violet-300/40 hover:shadow-[0_0_20px_rgba(167,139,250,0.4)] text-slate-200 flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              {reviews.map((_, n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => goTo(n)}
                  aria-label={dotLabel(n)}
                  aria-current={n === index}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    n === index
                      ? 'w-7 bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.8)]'
                      : 'w-2 bg-white/25 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label={nextLabel}
              className="w-11 h-11 rounded-full border border-white/10 bg-white/5 hover:bg-violet-500/20 hover:border-violet-300/40 hover:shadow-[0_0_20px_rgba(167,139,250,0.4)] text-slate-200 flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Reviews;
