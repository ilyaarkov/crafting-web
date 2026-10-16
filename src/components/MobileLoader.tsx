import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

export const MobileLoader: React.FC = () => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.innerWidth <= 768 ||
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );
  });

  const [progress, setProgress] = useState<number>(0);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const isCompleteRef = useRef<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkMobile =
      window.innerWidth <= 768 ||
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (!checkMobile) {
      setIsMobile(false);
      setIsVisible(false);
      return;
    }

    setIsMobile(true);

    // Lock scroll on mobile while loading
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalTouchAction = document.body.style.touchAction;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    // List of critical assets that MUST be fully downloaded and decoded into memory
    const criticalImages = [
      '/images/before-chaos.webp',
      '/images/ilya.webp',
      '/projects/portfolio.webp',
      '/projects/nonprofit.webp',
      '/projects/intuitivo.webp',
      '/projects/driftet.webp',
    ];

    let totalTasks = criticalImages.length + 2; // images + fonts + window load
    let completedTasks = 0;

    const updateProgressFromTasks = () => {
      completedTasks++;
      const computedRatio = Math.min(0.95, completedTasks / totalTasks);
      const targetPercent = Math.round(computedRatio * 95);
      setProgress((prev) => Math.max(prev, targetPercent));
    };

    // Helper to preload AND decode an image bitmap into GPU memory
    const preloadAndDecode = (src: string): Promise<void> => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = src;

        const onDone = () => {
          if ('decode' in img) {
            img
              .decode()
              .catch(() => {})
              .finally(() => {
                updateProgressFromTasks();
                resolve();
              });
          } else {
            updateProgressFromTasks();
            resolve();
          }
        };

        if (img.complete && img.naturalWidth > 0) {
          onDone();
        } else {
          img.onload = onDone;
          img.onerror = () => {
            updateProgressFromTasks();
            resolve();
          };
        }
      });
    };

    // Helper for document fonts
    const fontsPromise = (
      document.fonts && document.fonts.ready
        ? document.fonts.ready
        : Promise.resolve()
    ).then(() => {
      updateProgressFromTasks();
    });

    // Helper for window load
    const windowLoadPromise = new Promise<void>((resolve) => {
      if (document.readyState === 'complete') {
        updateProgressFromTasks();
        resolve();
      } else {
        const onLoad = () => {
          window.removeEventListener('load', onLoad);
          updateProgressFromTasks();
          resolve();
        };
        window.addEventListener('load', onLoad);
      }
    });

    // Also collect any img elements currently attached in DOM
    const domImages = Array.from(document.querySelectorAll('img'));
    const domImagesPromises = domImages.map((img) => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      return new Promise<void>((resolve) => {
        img.addEventListener('load', () => resolve(), { once: true });
        img.addEventListener('error', () => resolve(), { once: true });
      });
    });

    // Fallback safety timer: in case network drops or hangs on bad 3G, unlock after 6.5s
    const fallbackTimer = setTimeout(() => {
      if (!isCompleteRef.current) {
        finalizeLoad();
      }
    }, 6500);

    const finalizeLoad = () => {
      if (isCompleteRef.current) return;
      isCompleteRef.current = true;
      clearTimeout(fallbackTimer);

      // Verify layout & rendering frame commits
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setProgress(100);
          setTimeout(() => {
            setIsDone(true);
            setTimeout(() => {
              setIsVisible(false);
              document.body.style.overflow = originalBodyOverflow;
              document.documentElement.style.overflow = originalHtmlOverflow;
              document.body.style.touchAction = originalTouchAction;
            }, 500);
          }, 250);
        });
      });
    };

    // Await all critical tasks
    Promise.all([
      fontsPromise,
      windowLoadPromise,
      ...criticalImages.map(preloadAndDecode),
      ...domImagesPromises,
    ]).then(() => {
      finalizeLoad();
    });

    // Smooth counter ticker toward current loaded progress
    const ticker = setInterval(() => {
      setProgress((prev) => {
        if (isCompleteRef.current) {
          clearInterval(ticker);
          return 100;
        }
        if (prev < 90) {
          return prev + 1;
        }
        return prev;
      });
    }, 40);

    return () => {
      clearInterval(ticker);
      clearTimeout(fallbackTimer);
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.touchAction = originalTouchAction;
    };
  }, []);

  if (!isMobile || !isVisible) {
    return null;
  }

  const getStatusText = () => {
    if (progress < 40) {
      return isEn ? 'Initializing...' : 'Инициализация...';
    } else if (progress < 80) {
      return isEn ? 'Loading assets...' : 'Загрузка контента...';
    } else if (progress < 100) {
      return isEn ? 'Rendering page...' : 'Рендеринг интерфейса...';
    } else {
      return isEn ? 'Ready' : 'Готово к работе';
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isEn ? 'Loading page' : 'Загрузка страницы'}
      className={`fixed inset-0 z-[99999] bg-[#06080c] flex flex-col justify-between items-center px-6 py-10 sm:py-12 select-none transition-all duration-500 ease-out ${
        isDone ? 'opacity-0 scale-[1.01] pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Top spacer to balance layout vertically */}
      <div className="w-full flex justify-center pt-2 sm:pt-4" />

      {/* Center Block: Clean domain, slogan, progress bar */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-sm text-center">
        {/* Domain name */}
        <div className="font-['JetBrains_Mono',monospace] text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
          <span>ilyaarkov</span>
          <span className="text-cyan-400">.com</span>
        </div>

        {/* Slogan without slops or glowing circles */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-[280px] sm:max-w-[300px] mb-8 sm:mb-9 font-normal">
          {isEn
            ? 'Custom modern websites for experts, specialists, and businesses.'
            : 'Разработка современных сайтов под ключ для экспертов, мастеров и малого бизнеса.'}
        </p>

        {/* Progress Bar Container */}
        <div className="w-full max-w-[270px] flex flex-col items-center gap-3">
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden relative shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 transition-[width] duration-150 ease-out shadow-[0_0_10px_rgba(34,211,238,0.4)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Metrics & Status */}
          <div className="w-full flex items-center justify-between text-xs font-['JetBrains_Mono',monospace] px-0.5">
            <span className="text-slate-400 text-[11px] truncate max-w-[190px] text-left">
              {getStatusText()}
            </span>
            <span className="font-bold text-cyan-300 tabular-nums">
              {progress}%
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Block: Only 3 Social Icons (Instagram, Telegram, Email) */}
      <div className="w-full flex flex-col items-center pb-2 sm:pb-4">
        <div className="flex items-center justify-center gap-3.5">
          {/* Instagram */}
          <a
            href="https://instagram.com/ilyaarkovdotcom?vrfl=eHpjcnZrMDgzNThu&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="w-11 h-11 rounded-full flex items-center justify-center bg-white/[0.04] border border-white/10 text-slate-300 hover:text-[#E4405F] hover:border-[#E4405F]/60 hover:bg-[#E4405F]/15 hover:shadow-[0_0_20px_rgba(228,64,95,0.3)] transition-all duration-300 active:scale-95 cursor-pointer"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>

          {/* Telegram */}
          <a
            href="https://t.me/ilyaarkovdotcom"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram"
            className="w-11 h-11 rounded-full flex items-center justify-center bg-white/[0.04] border border-white/10 text-slate-300 hover:text-[#229ED9] hover:border-[#229ED9]/60 hover:bg-[#229ED9]/15 hover:shadow-[0_0_20px_rgba(34,158,217,0.3)] transition-all duration-300 active:scale-95 cursor-pointer"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .34z" />
            </svg>
          </a>

          {/* Email: mailto with hello@ilyaarkov.com */}
          <a
            href="mailto:hello@ilyaarkov.com"
            aria-label="Email hello@ilyaarkov.com"
            className="w-11 h-11 rounded-full flex items-center justify-center bg-white/[0.04] border border-white/10 text-slate-300 hover:text-cyan-400 hover:border-cyan-400/60 hover:bg-cyan-400/15 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300 active:scale-95 cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};
