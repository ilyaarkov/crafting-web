import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

export const MobileLoader: React.FC = () => {
  const { lang, t } = useLanguage();
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
  const progressRef = useRef<number>(0);

  useEffect(() => {
    // Only activate on mobile screens/devices
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

    // Track real assets
    let realProgress = 15;
    let isFullyLoaded = false;

    // Check document readyState
    if (document.readyState === 'complete') {
      realProgress = Math.max(realProgress, 50);
    }

    // Monitor fonts
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        realProgress = Math.max(realProgress, 65);
      });
    }

    // Monitor images
    const images = Array.from(document.querySelectorAll('img'));
    let loadedImagesCount = 0;
    const totalImages = images.length;

    if (totalImages > 0) {
      images.forEach((img) => {
        if (img.complete) {
          loadedImagesCount++;
        } else {
          img.addEventListener(
            'load',
            () => {
              loadedImagesCount++;
              const ratio = loadedImagesCount / totalImages;
              realProgress = Math.max(realProgress, Math.round(50 + ratio * 45));
            },
            { once: true }
          );
          img.addEventListener(
            'error',
            () => {
              loadedImagesCount++;
              const ratio = loadedImagesCount / totalImages;
              realProgress = Math.max(realProgress, Math.round(50 + ratio * 45));
            },
            { once: true }
          );
        }
      });
      if (loadedImagesCount === totalImages) {
        realProgress = Math.max(realProgress, 90);
      }
    } else {
      realProgress = Math.max(realProgress, 70);
    }

    const handleWindowLoad = () => {
      isFullyLoaded = true;
      realProgress = 100;
    };

    if (document.readyState === 'complete') {
      isFullyLoaded = true;
      realProgress = 100;
    } else {
      window.addEventListener('load', handleWindowLoad, { once: true });
    }

    // Safety fallback: if some asset hangs on slow mobile 3G, unlock after max 3.2s
    const safetyTimer = setTimeout(() => {
      isFullyLoaded = true;
      realProgress = 100;
    }, 3200);

    // Smooth animation loop for progress bar
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }

        // Increment smoothly towards target realProgress
        const target = isFullyLoaded ? 100 : Math.min(realProgress, 92);
        const step = isFullyLoaded ? Math.max(4, (100 - prev) * 0.3) : Math.max(1, (target - prev) * 0.15);
        const next = Math.min(100, Math.round(prev + step));

        progressRef.current = next;

        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsDone(true);
            setTimeout(() => {
              setIsVisible(false);
              // Unlock scroll smoothly
              document.body.style.overflow = originalBodyOverflow;
              document.documentElement.style.overflow = originalHtmlOverflow;
              document.body.style.touchAction = originalTouchAction;
            }, 550);
          }, 200);
        }
        return next;
      });
    }, 35);

    return () => {
      window.removeEventListener('load', handleWindowLoad);
      clearInterval(interval);
      clearTimeout(safetyTimer);
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.touchAction = originalTouchAction;
    };
  }, []);

  if (!isMobile || !isVisible) {
    return null;
  }

  // Dynamic status text based on progress
  const getStatusText = () => {
    if (progress < 30) {
      return isEn ? 'Initializing system...' : 'Инициализация системы...';
    } else if (progress < 70) {
      return isEn ? 'Loading fonts & graphics...' : 'Загрузка шрифтов и графики...';
    } else if (progress < 95) {
      return isEn ? 'Optimizing layout...' : 'Оптимизация интерфейса...';
    } else {
      return isEn ? 'Ready' : 'Готово к работе';
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isEn ? 'Loading page' : 'Загрузка страницы'}
      className={`fixed inset-0 z-[99999] bg-[#06080c] flex flex-col items-center justify-center select-none transition-all duration-500 ease-out ${
        isDone ? 'opacity-0 scale-[1.02] pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background glow effects matching the dark space hero aesthetic */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-cyan-500/15 blur-[90px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] rounded-full bg-blue-600/10 blur-[60px]" />
        {/* Subtle radial orbital ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full border border-cyan-500/10 animate-spin [animation-duration:18s]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center px-6 max-w-sm w-full text-center">
        {/* Developer Monogram / Icon */}
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400/20 via-blue-500/10 to-transparent border border-cyan-400/30 backdrop-blur-xl flex items-center justify-center shadow-[0_0_25px_-5px_rgba(34,211,238,0.3)]">
            <span className="font-['JetBrains_Mono',monospace] font-bold text-xl text-cyan-300 tracking-tighter">
              &lt;IA/&gt;
            </span>
          </div>
          {/* Subtle pulsating indicator dot */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-400 border-2 border-[#06080c]" />
          </span>
        </div>

        {/* Brand Name & Role */}
        <h2 className="text-xl font-bold tracking-tight text-white mb-1">
          {t.header?.name || 'Илья Арьков'}
        </h2>
        <p className="text-xs text-slate-400 mb-8 font-['JetBrains_Mono',monospace] tracking-wider uppercase">
          {isEn ? '// Web Development' : '// Разработка сайтов'}
        </p>

        {/* Progress Bar Container */}
        <div className="w-full max-w-[260px] flex flex-col items-center gap-3">
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden relative p-[1px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 transition-[width] duration-150 ease-out relative shadow-[0_0_12px_rgba(34,211,238,0.6)]"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer light effect running across progress bar */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
            </div>
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

        {/* Bottom micro-hint */}
        <div className="mt-8 flex items-center gap-2 text-[11px] text-slate-500 font-['JetBrains_Mono',monospace]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 animate-pulse" />
          <span>{isEn ? 'Mobile engine initializing' : 'Подготовка мобильной версии'}</span>
        </div>
      </div>
    </div>
  );
};
