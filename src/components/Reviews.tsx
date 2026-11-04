import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { ParallaxStarfield } from './ParallaxStarfield';

const AUTOPLAY_MS = 7000;
const SWIPE_THRESHOLD_PX = 40;

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
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (next: number) => {
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  // Таймер перезапускается при каждой смене индекса, поэтому ручное листание сбрасывает автолистание
  useEffect(() => {
    if (count < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setTimeout(() => goTo(index + 1), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [index, count, goTo]);

  const review = reviews[index];
  const project = review?.projectId
    ? t.projects.items.find((p) => p.id === review.projectId)
    : undefined;

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
    <section id="reviews" className="py-16 sm:py-20 lg:py-24 relative overflow-hidden bg-[#03050a] z-10">
      <ParallaxStarfield seed={303} constellations={2} accent={<ReviewOrbits />} accentSpeed={0.4} />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[420px] bg-violet-600/15 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 right-1/5 w-[380px] h-[300px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {t.reviews.title}
          </h2>
        </div>

        {review && (
          <div className="relative" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            <figure
              key={index}
              className="relative mx-auto max-w-3xl rounded-3xl p-6 sm:p-10 border border-violet-300/15 bg-gradient-to-br from-white/[0.07] via-white/[0.02] to-violet-500/[0.08] backdrop-blur-md shadow-[0_0_70px_rgba(124,58,237,0.22)] animate-in fade-in duration-500"
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

              <blockquote className="text-base sm:text-lg text-slate-100 leading-relaxed min-h-[9rem]">
                {review.text}
              </blockquote>

              <figcaption className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-white">{review.name}</div>
                  <div className="text-xs text-slate-400">{review.role}</div>
                </div>
                {project && (
                  <span className="self-start sm:self-auto text-xs text-cyan-200/90 border border-cyan-400/30 bg-cyan-400/5 rounded-full px-3 py-1.5">
                    {project.title}
                  </span>
                )}
              </figcaption>
            </figure>

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
        )}
      </div>
    </section>
  );
};

export default Reviews;
