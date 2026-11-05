import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ParallaxStarfield } from './ParallaxStarfield';

const AUTOPLAY_MS = 7000;
const SWIPE_THRESHOLD_PX = 40;
const GAP_PX = 24;

export const Reviews: React.FC = () => {
  const { t, lang } = useLanguage();
  const reviews = t.reviews.items;
  const count = reviews.length;
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(1);
  const [failedPhotos, setFailedPhotos] = useState<Record<string, boolean>>({});
  const touchStartX = useRef<number | null>(null);


  const goTo = useCallback(
    (next: number) => {
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  useEffect(() => {
    const updatePerView = () => {
      const width = window.innerWidth;
      setPerView(width >= 1100 ? 4 : width >= 700 ? 3 : 1);
    };

    updatePerView();
    window.addEventListener('resize', updatePerView);
    return () => window.removeEventListener('resize', updatePerView);
  }, []);

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
    if (d < perView) return { offset: d, visible: true };
    if (d === count - 1) return { offset: -1, visible: false };
    return { offset: d, visible: false };
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
    <section id="reviews" className="min-h-[100vh] flex flex-col justify-center py-14 sm:py-16 relative overflow-hidden bg-site z-10">
      <ParallaxStarfield seed={303} constellations={2} />

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-6 sm:mb-10">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {t.reviews.title}
          </h2>
        </div>

        <div
          className="relative grid touch-pan-y"
          style={{ gridTemplateColumns: '100%' }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {reviews.map((review, i) => {
            const { offset, visible } = placement(i);
            const initials = review.name
              .split(' ')
              .map((part) => part[0])
              .slice(0, 2)
              .join('');
            const showPhoto = Boolean(review.photo) && !failedPhotos[review.name];

            return (
              <article
                key={review.name}
                aria-hidden={!visible}
                className={`col-start-1 row-start-1 flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm transition-[transform,opacity] duration-700 ease-out motion-reduce:transition-none sm:p-6 ${
                  visible ? '' : 'pointer-events-none'
                }`}
                style={{
                  width: `calc((100% - ${GAP_PX * (perView - 1)}px) / ${perView})`,
                  transform: `translateX(calc(${offset} * (100% + ${GAP_PX}px)))`,
                  opacity: visible ? 1 : 0,
                }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0" aria-hidden="true">
                    <div className="absolute inset-0 flex items-center justify-center rounded-full border border-white/10 bg-white/10 text-xs font-bold text-white">
                      {initials}
                    </div>
                    {showPhoto && (
                      <img
                        src={review.photo}
                        alt=""
                        loading="lazy"
                        width={48}
                        height={48}
                        onError={() =>
                          setFailedPhotos((prev) => ({ ...prev, [review.name]: true }))
                        }
                        className="absolute inset-0 h-full w-full rounded-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-white">{review.name}</div>
                    <div className="text-xs leading-snug text-slate-400">{review.role}</div>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-slate-100">{review.text}</p>
              </article>
            );
          })}
        </div>

        {count > 1 && (
          <div className="mt-6 flex items-center justify-center gap-6 sm:mt-8">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label={prevLabel}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition-colors hover:border-white/25 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2.5">
              {reviews.map((_, n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => goTo(n)}
                  aria-label={dotLabel(n)}
                  aria-current={n === index}
                  className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
                    n === index ? 'w-7 bg-white' : 'w-2 bg-white/25 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label={nextLabel}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition-colors hover:border-white/25 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Reviews;
