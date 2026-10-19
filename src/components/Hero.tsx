import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  ArrowRight,
  ChevronDown,
} from 'lucide-react';

const EarthHero = React.lazy(() => import('./EarthHero'));

export const Hero: React.FC = () => {
  const { t } = useLanguage();

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const elem = document.querySelector(id);
    if (!elem) return;

    e.preventDefault();
    const offsetTop = elem.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({
      top: offsetTop,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  };

  // Повторяем список тегов для 100% бесшовного бесконечного цикла бегущей строки
  const marqueeBlock = [...t.hero.tags, ...t.hero.tags, ...t.hero.tags];

  return (
    <section
      className="hero-scene relative overflow-hidden isolate h-[100dvh] max-h-[100dvh] flex flex-col justify-between bg-[#080b12]"
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
        .marquee-track {
          display: flex;
          width: max-content;
          animation: continuousMarquee 26s linear infinite;
          will-change: transform;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            width: 100%;
            animation: none;
            white-space: normal;
            justify-content: center;
          }
          .marquee-track > div:first-child {
            max-width: 100%;
            flex-wrap: wrap;
            justify-content: center;
          }
          .marquee-track > div[aria-hidden="true"] {
            display: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-enter {
            animation: none;
          }
        }
      `}</style>

      <React.Suspense fallback={null}>
        <EarthHero />
      </React.Suspense>

      {/* ========================================================= */}
      {/* МОБИЛЬНАЯ ВЕРСИЯ */}
      {/* ========================================================= */}
      <div className="flex lg:hidden flex-col h-full w-full relative z-10">
        {/* Верхняя половина (0 - 50dvh): Заголовок упирается низом точно в середину экрана */}
        <div className="h-[50dvh] flex flex-col justify-end items-center px-4 pb-2 sm:pb-3 text-center">
          <h1 className="hero-enter text-[26px] sm:text-3xl font-black tracking-tight leading-[1.14] max-w-md mx-auto">
            <span className="block text-white mb-0.5">
              {t.hero.titlePrefix}
            </span>
            <span className="block text-cyan-300">
              {t.hero.titleHighlight}
            </span>
          </h1>
        </div>

        {/* Нижняя половина (50dvh - 100dvh) */}
        <div className="h-[50dvh] min-h-0 flex flex-col justify-between items-center w-full relative">
          {/* Пространство между 50dvh и верхней кнопкой в естественном flex-потоке */}
          <div className="flex-1 w-full flex flex-col justify-between items-center min-h-0 py-1">
            {/* 1. Верхний слот: Бегущая строка (непрерывный бесшовный цикл без прерываний) */}
            <div className="hero-enter hero-enter-delay-1 flex-1 w-full flex items-center min-h-[30px] overflow-hidden pointer-events-none">
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
            <div className="hero-enter hero-enter-delay-2 shrink-0 px-4 text-center max-w-sm mx-auto my-auto">
              <p className="text-sm sm:text-[15px] md:text-base text-slate-300 leading-relaxed text-balance font-bold">
                {t.hero.description}
              </p>
            </div>

            {/* 3. Нижний слот: симметричное пространство для идеальной центровки описания */}
            <div className="flex-1 w-full min-h-[10px]" />
          </div>

          {/* Нижняя группа: Кнопки + Галочка */}
          <div className="hero-enter hero-enter-delay-3 shrink-0 flex flex-col items-center w-full pb-2 px-4 z-20">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-xs sm:max-w-none w-full mb-1.5">
              {/* Главная кнопка */}
              <a
                href="#contact"
                onClick={(e) => handleScrollTo(e, '#contact')}
                className="relative group overflow-hidden w-full sm:w-auto min-h-11 px-6 py-2.5 rounded-full font-bold text-slate-950 bg-cyan-400 transition-colors duration-300 active:scale-[0.98] text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-400/20"
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
                className="relative group overflow-hidden w-full sm:w-auto min-h-11 px-6 py-2.5 rounded-full font-semibold text-slate-200 transition-colors duration-300 active:scale-[0.98] text-xs flex items-center justify-center gap-2 cursor-pointer bg-white/5 border border-white/10 hover:border-white/30"
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
                className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
              >
                <ChevronDown className="w-4 h-4 text-cyan-400" />
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
        <div className="my-auto py-2 flex flex-col items-center justify-center">
          <h1 className="hero-enter text-5xl xl:text-6xl font-black tracking-tight leading-[1.10] mb-3 max-w-4xl mx-auto">
            <span className="block text-white mb-1">
              {t.hero.titlePrefix}
            </span>
            <span className="block text-cyan-300">
              {t.hero.titleHighlight}
            </span>
          </h1>

          {/* Строка специализаций на ПК: ГАРАНТИРОВАННО В ОДНУ СТРОКУ, БЕЗ ПЕРЕНОСОВ */}
          <div className="hero-enter hero-enter-delay-1 flex flex-nowrap items-center justify-center gap-x-6 text-xs font-sans font-bold text-slate-300 uppercase tracking-[0.16em] my-3.5 w-full max-w-5xl mx-auto whitespace-nowrap">
            {t.hero.tags.map((tag, idx) => (
              <span key={idx} className="hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0">{tag}</span>
            ))}
          </div>

          <p className="hero-enter hero-enter-delay-2 text-base lg:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto text-balance font-bold px-3 mt-2">
            {t.hero.description}
          </p>
        </div>

        {/* Низ экрана на ПК: Метрики + Кнопки + Галочка */}
          <div className="mt-auto -translate-y-5 pb-6 flex flex-col items-center w-full z-20 shrink-0">
          <div className="hero-enter hero-enter-delay-2 grid grid-cols-3 gap-4 max-w-4xl mx-auto text-center mb-5 w-full">
            <div className="hero-metric p-4 rounded-2xl backdrop-blur-sm border hover:border-cyan-300/40 transition-colors flex flex-col items-center justify-center text-center">
              <div className="text-white font-extrabold text-lg tracking-tight mb-0.5">
                {t.hero.metrics.days}
              </div>
              <div className="text-[13px] text-slate-300/75">
                {t.hero.metrics.daysLabel}
              </div>
            </div>

            <div className="hero-metric p-4 rounded-2xl backdrop-blur-sm border hover:border-cyan-300/40 transition-colors flex flex-col items-center justify-center text-center">
              <div className="text-white font-extrabold text-lg tracking-tight mb-0.5">
                {t.hero.metrics.price}
              </div>
              <div className="text-[13px] text-slate-300/75">
                {t.hero.metrics.priceLabel}
              </div>
            </div>

            <div className="hero-metric p-4 rounded-2xl backdrop-blur-sm border hover:border-cyan-300/40 transition-colors flex flex-col items-center justify-center text-center">
              <div className="text-white font-extrabold text-lg tracking-tight mb-0.5">
                {t.hero.metrics.direct}
              </div>
              <div className="text-[13px] text-slate-300/75">
                {t.hero.metrics.directLabel}
              </div>
            </div>
          </div>

          <div className="hero-enter hero-enter-delay-3 flex flex-row items-center justify-center gap-4 mx-auto w-full mb-4 px-3">
            <a
              href="#contact"
              onClick={(e) => handleScrollTo(e, '#contact')}
              className="relative group overflow-hidden px-9 py-4 rounded-full font-bold text-slate-950 bg-cyan-400 transition-colors duration-300 active:scale-[0.98] text-base flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-400/20"
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
              className="relative group overflow-hidden px-9 py-4 rounded-full font-semibold text-slate-200 transition-colors duration-300 active:scale-[0.98] text-base flex items-center justify-center gap-2 cursor-pointer bg-white/5 border border-white/10 hover:border-white/30"
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
              className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-slate-400 hover:text-cyan-400 hover:bg-white/5 transition-colors cursor-pointer group"
            >
              <ChevronDown className="w-5 h-5 text-cyan-400" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
