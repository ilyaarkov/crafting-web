import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  ArrowRight,
  ChevronDown,
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { t } = useLanguage();

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
    <section className="relative overflow-hidden isolate h-[100dvh] max-h-[100dvh] flex flex-col justify-between bg-[#06080c]">
      <style>{`
        @keyframes continuousMarquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        @keyframes earthSlowSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
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
        .earth-rotate {
          animation: earthSlowSpin 140s linear infinite;
          will-change: transform;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
        .earth-tilt {
          transform: rotateX(-24deg);
          transform-origin: center top;
        }
        @media (prefers-reduced-motion: reduce) {
          .earth-rotate {
            animation: none;
          }
        }
      `}</style>

      {/* ========================================================= */}
      {/* ФОН 100vh ЭКРАНА: Величественный горизонт планеты и космическое свечение */}
      {/* ========================================================= */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {/* Фоновые мягкие туманности глубокого космоса */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] sm:w-[1100px] h-[260px] sm:h-[520px] bg-gradient-to-b from-sky-400/20 via-cyan-500/15 to-transparent blur-[40px] sm:blur-[110px] rounded-full" />
        <div className="hidden sm:block absolute top-1/4 left-1/4 w-[550px] h-[450px] bg-blue-600/20 blur-[120px] rounded-full" />
        <div className="hidden sm:block absolute top-1/3 right-1/4 w-[550px] h-[450px] bg-cyan-600/20 blur-[120px] rounded-full" />

        {/* Звездная глубина космоса */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Световой ореол горизонта */}
        <div className="absolute top-[60dvh] lg:top-[50vh] left-1/2 -translate-x-1/2 w-[85vw] sm:w-[900px] h-[200px] sm:h-[350px] bg-cyan-400/20 blur-[35px] sm:blur-[100px] rounded-full pointer-events-none" />

        {/* КРУГЛЫЙ КУПОЛ ЗЕМЛИ ИЗ КОСМОСА С ПЛАВНЫМ ВРАЩЕНИЕМ (ОДИНАКОВЫЙ ИДЕАЛЬНЫЙ ПОЛУКРУГ НА ВСЕХ ЭКРАНАХ) */}
        <div className="absolute top-[calc(70dvh+10px)] lg:top-[62vh] left-1/2 -translate-x-1/2 w-[220vw] min-w-[950px] max-w-[2600px] aspect-square rounded-full pointer-events-none select-none z-0">
          {/* Световые ореолы кромки горизонта (Apple Maps стиль) */}
          <div className="absolute -top-8 sm:-top-14 left-1/2 -translate-x-1/2 w-[70%] h-16 sm:h-28 bg-cyan-400/35 blur-[25px] sm:blur-[45px] rounded-full pointer-events-none" />
          <div className="absolute -top-3 sm:-top-6 left-1/2 -translate-x-1/2 w-[50%] h-8 sm:h-14 bg-sky-300/45 blur-[12px] sm:blur-[22px] rounded-full pointer-events-none" />

          {/* Идеально круглая сфера с медленно вращающейся текстурой фотореалистичной Земли */}
          <div className="relative w-full h-full rounded-full overflow-hidden shadow-[0_-12px_60px_rgba(34,211,238,0.55),0_0_120px_rgba(56,189,248,0.25)] bg-[#040812]" style={{ perspective: '1800px', perspectiveOrigin: 'center top' }}>
            <picture className="absolute inset-0 earth-tilt">
              <source srcSet="/images/earth.png" type="image/png" />
              <img
                src="/images/earth.png"
                alt="Earth"
                className="w-full h-full object-cover object-center rounded-full will-change-transform earth-rotate scale-[1.2] blur-[0.5px]"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </picture>

            <div className="absolute inset-0 rounded-full bg-black/50 pointer-events-none" />
            {/* Мягкое космическое затенение к нижней части планеты для бесшовного слияния с #06080c */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-transparent via-[#06080c]/55 to-[#06080c] pointer-events-none" />
            <div className="absolute inset-0 rounded-full [background:radial-gradient(circle_at_50%_0%,transparent_55%,#06080c_90%)] pointer-events-none" />
          </div>
        </div>
      </div>

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
                        <span className="text-[11px] sm:text-xs font-['JetBrains_Mono',monospace] font-semibold text-slate-200 uppercase tracking-wider px-2">
                          {tag}
                        </span>
                        <span className="text-cyan-400 font-bold text-xs sm:text-sm px-1.5 drop-shadow-[0_0_8px_rgba(34,211,238,0.7)] font-['JetBrains_Mono',monospace]">
                          //
                        </span>
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center shrink-0" aria-hidden="true">
                    {marqueeBlock.map((tag, idx) => (
                      <span key={`mob-ticker-b-${idx}`} className="inline-flex items-center">
                        <span className="text-[11px] sm:text-xs font-['JetBrains_Mono',monospace] font-semibold text-slate-200 uppercase tracking-wider px-2">
                          {tag}
                        </span>
                        <span className="text-cyan-400 font-bold text-xs sm:text-sm px-1.5 drop-shadow-[0_0_8px_rgba(34,211,238,0.7)] font-['JetBrains_Mono',monospace]">
                          //
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
          <div className="flex flex-nowrap items-center justify-center gap-x-2 text-xs font-['JetBrains_Mono',monospace] font-semibold text-slate-300 uppercase tracking-wider my-3.5 w-full max-w-5xl mx-auto whitespace-nowrap">
            {t.hero.tags.map((tag, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && (
                  <span className="text-cyan-400/80 font-bold px-1.5 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] shrink-0">
                    //
                  </span>
                )}
                <span className="hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0">{tag}</span>
              </React.Fragment>
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