import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Hand, X } from 'lucide-react';
import { MacBrowserFrame } from './MacBrowserFrame';
import { FittedImage } from './FittedImage';

// Планшеты, телефоны и любые сенсорные экраны: листание свайпом и полноэкранный просмотр по тапу
const TOUCH_GALLERY_QUERY = '(max-width: 1023px), (pointer: coarse)';

interface ProjectGalleryProps {
  screens: string[];
  title: string;
  activeIndex: number;
  onChange: (index: number) => void;
  lang: 'ru' | 'en';
}

interface SwipeOptions {
  count: number;
  index: number;
  onChange: (index: number) => void;
  onTap?: () => void;
  onInteract?: () => void;
}

// Лента слайдов, которую можно тянуть пальцем. Позиция ленты задаётся напрямую через style,
// чтобы движение за пальцем не вызывало ре-рендер на каждый pointermove.
const useSwipeTrack = ({ count, index, onChange, onTap, onInteract }: SwipeOptions) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    id: number;
    x: number;
    y: number;
    time: number;
    dx: number;
    touch: boolean;
    horizontal: boolean | null;
  } | null>(null);

  const applyOffset = useCallback(
    (dx: number, animate: boolean) => {
      const track = trackRef.current;
      if (!track) return;
      track.style.transition = animate ? '' : 'none';
      track.style.transform = `translate3d(calc(${-index * 100}% + ${dx}px), 0, 0)`;
    },
    [index],
  );

  useEffect(() => {
    applyOffset(0, true);
  }, [applyOffset]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    onInteract?.();
    drag.current = {
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      time: performance.now(),
      dx: 0,
      touch: e.pointerType !== 'mouse',
      horizontal: null,
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state || state.id !== e.pointerId) return;
    const dx = e.clientX - state.x;
    const dy = e.clientY - state.y;

    if (state.horizontal === null && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
      state.horizontal = Math.abs(dx) > Math.abs(dy);
      if (state.horizontal && state.touch) e.currentTarget.setPointerCapture(e.pointerId);
    }
    // Мышью ленту не тянем: на компьютере для этого есть стрелки
    if (!state.horizontal || !state.touch) return;

    // У крайних слайдов лента сопротивляется, как резинка
    const atEdge = (index === 0 && dx > 0) || (index === count - 1 && dx < 0);
    state.dx = atEdge ? dx * 0.3 : dx;
    applyOffset(state.dx, false);
  };

  const finish = (e: React.PointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const state = drag.current;
    if (!state || state.id !== e.pointerId) return;
    drag.current = null;

    if (state.horizontal && state.touch && !cancelled) {
      const width = viewportRef.current?.clientWidth || 1;
      const velocity = state.dx / Math.max(1, performance.now() - state.time);
      let next = index;
      if (state.dx < -width * 0.18 || velocity < -0.45) next = index + 1;
      if (state.dx > width * 0.18 || velocity > 0.45) next = index - 1;
      next = Math.max(0, Math.min(count - 1, next));
      if (next !== index) onChange(next);
      else applyOffset(0, true);
      return;
    }

    applyOffset(0, true);
    const moved = Math.hypot(e.clientX - state.x, e.clientY - state.y);
    if (!cancelled && state.horizontal === null && moved < 8) onTap?.();
  };

  return {
    viewportRef,
    trackRef,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: (e: React.PointerEvent<HTMLDivElement>) => finish(e, false),
      onPointerCancel: (e: React.PointerEvent<HTMLDivElement>) => finish(e, true),
    },
  };
};

// Космическая стрелка: стеклянный круг, орбита с «спутником» при наведении и вспышка-волна при нажатии
const GalleryArrow: React.FC<{ direction: 'prev' | 'next'; label: string; onClick: () => void }> = ({
  direction,
  label,
  onClick,
}) => {
  const [pulse, setPulse] = useState(0);
  const isPrev = direction === 'prev';
  const Icon = isPrev ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => {
        setPulse((p) => p + 1);
        onClick();
      }}
      className={`group/arrow absolute top-1/2 -translate-y-1/2 z-30 hidden [@media(min-width:1024px)_and_(hover:hover)_and_(pointer:fine)]:flex w-12 h-12 items-center justify-center rounded-full border border-cyan-300/25 bg-[#060a14]/60 backdrop-blur-md text-cyan-200 opacity-80 transition-all duration-300 hover:opacity-100 hover:border-cyan-300/70 hover:bg-[#081426]/80 hover:text-white hover:shadow-[0_0_26px_rgba(34,211,238,0.45),inset_0_0_12px_rgba(34,211,238,0.18)] active:scale-90 active:duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80 cursor-pointer ${
        isPrev ? 'left-4' : 'right-4'
      }`}
    >
      {/* Пунктирная орбита */}
      <span className="absolute -inset-[6px] rounded-full border border-dashed border-cyan-300/0 transition-colors duration-300 group-hover/arrow:border-cyan-300/30 pointer-events-none" />
      {/* Спутник, облетающий кнопку */}
      <span
        className={`absolute -inset-[6px] rounded-full opacity-0 transition-opacity duration-300 group-hover/arrow:opacity-100 animate-[spin_2.6s_linear_infinite] pointer-events-none ${
          isPrev ? '[animation-direction:reverse]' : ''
        }`}
      >
        <span className="absolute -top-[3px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-100 shadow-[0_0_8px_2px_rgba(165,243,252,0.85)]" />
      </span>
      {/* Волна при нажатии: новый key перезапускает анимацию */}
      {pulse > 0 && (
        <span
          key={pulse}
          className="gallery-arrow-pulse absolute inset-0 rounded-full border border-cyan-200/80 pointer-events-none"
        />
      )}
      <Icon
        className={`relative w-5 h-5 transition-transform duration-300 ${
          isPrev ? 'group-hover/arrow:-translate-x-0.5' : 'group-hover/arrow:translate-x-0.5'
        }`}
      />
    </button>
  );
};

// Полноэкранный просмотр для планшетов и телефонов
const GalleryLightbox: React.FC<ProjectGalleryProps & { onClose: () => void }> = ({
  screens,
  title,
  activeIndex,
  onChange,
  onClose,
  lang,
}) => {
  const count = screens.length;
  // Подсказка о свайпе показывается один раз при каждом открытии
  const [hinting, setHinting] = useState(count > 1);
  const hintDirection = activeIndex === count - 1 ? -1 : 1;
  const stopHint = useCallback(() => setHinting(false), []);
  const closeRef = useRef<HTMLButtonElement>(null);

  const { viewportRef, trackRef, handlers } = useSwipeTrack({
    count,
    index: activeIndex,
    onChange,
    onInteract: stopHint,
  });

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && activeIndex < count - 1) onChange(activeIndex + 1);
      if (e.key === 'ArrowLeft' && activeIndex > 0) onChange(activeIndex - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [activeIndex, count, onChange, onClose]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="gallery-lightbox fixed inset-0 z-[100] bg-[#020308] select-none"
    >
      <div
        ref={viewportRef}
        className="absolute inset-0 overflow-hidden touch-none"
        {...handlers}
      >
        <div
          className={`h-full ${hinting ? 'gallery-swipe-hint' : ''}`}
          style={{ '--hint-dir': hintDirection } as React.CSSProperties}
          onAnimationEnd={stopHint}
        >
          <div
            ref={trackRef}
            className="flex h-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
          >
            {screens.map((src, i) => (
              <div key={src} className="w-full h-full shrink-0" aria-hidden={i !== activeIndex}>
                <FittedImage
                  src={src}
                  alt={`${title} ${i + 1}`}
                  backdropBlur="blur-3xl"
                  imageClassName="p-2 sm:p-4"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Анимированная рука, показывающая жест смахивания */}
      {hinting && (
        <div
          className="gallery-hand-hint absolute left-1/2 top-1/2 -ml-7 -mt-7 w-14 h-14 rounded-full bg-[#060a14]/70 border border-cyan-300/40 backdrop-blur-md flex items-center justify-center text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.35)] pointer-events-none"
          style={{ '--hint-dir': hintDirection } as React.CSSProperties}
        >
          <Hand className="w-6 h-6" />
        </div>
      )}

      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label={lang === 'ru' ? 'Закрыть' : 'Close'}
        className="absolute z-10 top-[max(1rem,env(safe-area-inset-top))] right-4 w-11 h-11 rounded-full flex items-center justify-center border border-white/20 bg-[#060a14]/70 backdrop-blur-md text-white transition-all duration-200 active:scale-90 active:border-cyan-300/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80 cursor-pointer"
      >
        <X className="w-5 h-5" />
      </button>

      {count > 1 && (
        <div className="absolute z-10 left-1/2 -translate-x-1/2 bottom-[max(1.25rem,env(safe-area-inset-bottom))] flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#060a14]/70 border border-white/10 backdrop-blur-md pointer-events-none">
          {screens.map((src, i) => (
            <span
              key={src}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? 'w-5 bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.8)]' : 'w-1.5 bg-white/35'
              }`}
            />
          ))}
        </div>
      )}
    </div>,
    document.body,
  );
};

export const ProjectGallery: React.FC<ProjectGalleryProps> = (props) => {
  const { screens, title, activeIndex, onChange, lang } = props;
  const count = screens.length;
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // На компьютере стрелки листают по кругу
  const go = useCallback((delta: number) => onChange((activeIndex + delta + count) % count), [activeIndex, count, onChange]);

  const openLightbox = useCallback(() => {
    if (window.matchMedia(TOUCH_GALLERY_QUERY).matches) setLightboxOpen(true);
  }, []);
  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const { viewportRef, trackRef, handlers } = useSwipeTrack({
    count,
    index: activeIndex,
    onChange,
    onTap: openLightbox,
  });

  // Листание клавишами ← и → на компьютере
  useEffect(() => {
    if (count < 2 || lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [count, go, lightboxOpen]);

  return (
    <>
      <MacBrowserFrame>
        <div
          ref={viewportRef}
          className="absolute inset-0 overflow-hidden touch-pan-y cursor-zoom-in [@media(min-width:1024px)_and_(pointer:fine)]:cursor-default"
          aria-roledescription="carousel"
          aria-label={title}
          {...handlers}
        >
          <div
            ref={trackRef}
            className="flex h-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
          >
            {screens.map((src, i) => (
              <div
                key={src}
                className="w-full h-full shrink-0"
                aria-roledescription="slide"
                aria-label={`${i + 1} / ${count}`}
                aria-hidden={i !== activeIndex}
              >
                <FittedImage src={src} alt={`${title} screen ${i + 1}`} loading={i === 0 ? 'eager' : 'lazy'} />
              </div>
            ))}
          </div>
        </div>

        {count > 1 && (
          <>
            <GalleryArrow direction="prev" label={lang === 'ru' ? 'Предыдущее фото' : 'Previous photo'} onClick={() => go(-1)} />
            <GalleryArrow direction="next" label={lang === 'ru' ? 'Следующее фото' : 'Next photo'} onClick={() => go(1)} />
            <span className="absolute z-20 bottom-3 right-3 px-2 py-1 rounded-md text-[11px] font-mono bg-black/55 border border-white/10 text-slate-200 pointer-events-none" aria-live="polite">
              {activeIndex + 1} / {count}
            </span>
          </>
        )}
      </MacBrowserFrame>

      {lightboxOpen && <GalleryLightbox {...props} onClose={closeLightbox} />}
    </>
  );
};

export default ProjectGallery;
