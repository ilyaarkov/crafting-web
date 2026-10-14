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

  // Повторяем список тегов для гарантированного непрерывного бесшовного цикла бегущей строки
  const tickerList = [...t.hero.tags, ...t.hero.tags];

  return (
    <section className="relative overflow-hidden select-none min-h-[100dvh] flex flex-col justify-between">
      <style>{`
        @keyframes orbitRotate {
          from {
            transform: rotateX(70deg) rotateZ(0deg);
          }
          to {
            transform: rotateX(70deg) rotateZ(360deg);
          }
        }
        @keyframes orbitRotateReverse {
          from {
            transform: rotateX(68deg) rotateZ(360deg);
          }
          to {
            transform: rotateX(68deg) rotateZ(0deg);
          }
        }
        .orbit-ring-1 {
          animation: orbitRotate 48s linear infinite;
        }
        .orbit-ring-2 {
          animation: orbitRotateReverse 36s linear infinite;
        }

        @keyframes heroMarquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .animate-hero-marquee {
          display: flex;
          width: max-content;
          animation: heroMarquee 24s linear infinite;
          will-change: transform;
        }
      `}</style>

      {/* ========================================================= */}
      {/* ФОН 100vh ЭКРАНА: Живой космический горизонт планеты с атмосферой и орбитами */}
      {/* ========================================================= */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        {/* Фоновые мягкие туманности глубокого космоса */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[500px] bg-gradient-to-b from-sky-500/20 via-cyan-500/15 to-transparent blur-[120px] rounded-full" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[400px] bg-blue-600/15 blur-[130px] rounded-full" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[400px] bg-cyan-600/15 blur-[130px] rounded-full" />

        {/* Звездная глубина космоса */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
            backgroundSize: '36px 36px',
          }}
        />

        {/* Вращающаяся орбита 1 (внешняя тонкая эллиптическая линия со светящимся спутником) */}
        <div className="absolute top-12 sm:top-16 md:top-20 left-1/2 -translate-x-1/2 w-[min(940px,94vw)] h-[min(580px,60vh)] pointer-events-none [perspective:1200px]">
          <div className="orbit-ring-1 w-full h-full rounded-full border border-cyan-400/30 relative">
            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_15px_#22d3ee]" />
          </div>
        </div>

        {/* Вращающаяся орбита 2 (внутренняя линия, обратное вращение) */}
        <div className="absolute top-20 sm:top-24 md:top-28 left-1/2 -translate-x-1/2 w-[min(720px,76vw)] h-[min(440px,48vh)] pointer-events-none [perspective:1200px]">
          <div className="orbit-ring-2 w-full h-full rounded-full border border-white/15 relative">
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_12px_#ffffff]" />
          </div>
        </div>

        {/* ВИДИМЫЙ КУПОЛ ПЛАНЕТЫ С НЕОНОВОЙ КРОМКОЙ И СВЕТЯЩЕЙСЯ АТМОСФЕРОЙ */}
        <div className="absolute top-[22vh] sm:top-[26vh] left-1/2 -translate-x-1/2 w-[160vw] min-w-[1400px] max-w-[3200px] h-[900px] sm:h-[1100px] rounded-[100%] bg-gradient-to-b from-[#0b274c] via-[#06152a] to-[#06080c] border-t-2 border-cyan-400/80 shadow-[0_-12px_70px_rgba(34,211,238,0.55),0_0_140px_rgba(56,189,248,0.3)]">
          {/* Яркая ионизированная полоса атмосферного сияния на кромке горизонта */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[80%] h-28 bg-cyan-400/30 blur-[45px] rounded-full pointer-events-none" />
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-[60%] h-16 bg-sky-300/40 blur-[25px] rounded-full pointer-events-none" />
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. ПОЛНОЭКРАННЫЙ КОНТЕНТ */}
      {/* ========================================================= */}
      <div className="relative flex-1 flex flex-col justify-between pt-16 sm:pt-20 lg:pt-24 pb-4 sm:pb-6 max-w-6xl mx-auto px-4 sm:px-6 z-10 w-full text-center">
        {/* Верхний спейсер */}
        <div className="h-1 sm:h-2" />

        {/* ЦЕНТР ЭКРАНА */}
        <div className="my-auto py-2 sm:py-4 flex flex-col items-center justify-center">
          {/* Главный заголовок H1: по середине */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.18] sm:leading-[1.10] mb-3.5 sm:mb-5 max-w-4xl mx-auto">
            <span className="block text-white mb-1.5">
              {t.hero.titlePrefix}
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-300">
              {t.hero.titleHighlight}
            </span>
          </h1>

          {/* ---------------------------------------------------- */}
          {/* ПК: Строка специализаций (статичные теги) */}
          {/* ---------------------------------------------------- */}
          <div className="hidden lg:flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs font-mono font-medium text-slate-400 uppercase tracking-widest mb-6 max-w-2xl mx-auto">
            {t.hero.tags.map((tag, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-cyan-400 font-bold select-none">&bull;</span>}
                <span className="hover:text-cyan-300 transition-colors whitespace-nowrap">{tag}</span>
              </React.Fragment>
            ))}
          </div>

          {/* ---------------------------------------------------- */}
          {/* МОБИЛКИ И ПЛАНШЕТЫ: Бесконечная бегущая строка от края до края экрана */}
          {/* ---------------------------------------------------- */}
          <div className="w-screen relative left-1/2 -translate-x-1/2 overflow-hidden py-1.5 sm:py-2 my-2 sm:my-3 lg:hidden pointer-events-none select-none">
            <div className="animate-hero-marquee flex items-center whitespace-nowrap">
              {/* Первый набор */}
              <div className="flex items-center shrink-0">
                {tickerList.map((tag, idx) => (
                  <span key={`ticker-a-${idx}`} className="inline-flex items-center">
                    <span className="text-[11px] sm:text-xs font-mono font-medium text-slate-300 uppercase tracking-widest px-2.5 sm:px-3">
                      {tag}
                    </span>
                    <span className="text-cyan-400 font-bold select-none text-[10px]">&bull;</span>
                  </span>
                ))}
              </div>
              {/* Второй набор для бесшовной бесконечной петли */}
              <div className="flex items-center shrink-0" aria-hidden="true">
                {tickerList.map((tag, idx) => (
                  <span key={`ticker-b-${idx}`} className="inline-flex items-center">
                    <span className="text-[11px] sm:text-xs font-mono font-medium text-slate-300 uppercase tracking-widest px-2.5 sm:px-3">
                      {tag}
                    </span>
                    <span className="text-cyan-400 font-bold select-none text-[10px]">&bull;</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Описание: на ПК и на мобилках (на мобилках расположено сразу под бегущей строкой) */}
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto mb-5 sm:mb-7 text-balance font-normal px-3">
            {t.hero.description}
          </p>

          {/* Кнопки призыва к действию (единый блок для мобилок, планшетов и ПК) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-xs sm:max-w-none mx-auto w-full">
            {/* Главная кнопка: эффект смены цвета слева направо */}
            <a
              href="#contact"
              onClick={(e) => handleScrollTo(e, '#contact')}
              className="relative group overflow-hidden w-full sm:w-auto px-7 sm:px-8 py-3.5 rounded-full font-bold text-slate-950 bg-cyan-400 transition-colors duration-300 active:scale-[0.98] text-xs sm:text-sm md:text-base flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-400/20"
            >
              <span className="absolute inset-0 bg-white rounded-full -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out pointer-events-none" />
              <span className="relative z-10 flex items-center gap-2">
                <span>{t.hero.ctaPrimary}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </a>

            {/* Второстепенная кнопка: эффект смены цвета слева направо */}
            <a
              href="#projects"
              onClick={(e) => handleScrollTo(e, '#projects')}
              className="relative group overflow-hidden w-full sm:w-auto px-7 sm:px-8 py-3.5 rounded-full font-semibold text-slate-200 transition-colors duration-300 active:scale-[0.98] text-xs sm:text-sm md:text-base flex items-center justify-center gap-2 cursor-pointer bg-white/5 border border-white/10 hover:border-white/30"
            >
              <span className="absolute inset-0 bg-white rounded-full -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out pointer-events-none" />
              <span className="relative z-10 transition-colors duration-300 group-hover:text-slate-950 font-semibold">
                {t.hero.ctaSecondary}
              </span>
            </a>
          </div>
        </div>

        {/* ========================================================= */}
        {/* НИЗ 100vh ЭКРАНА */}
        {/* ========================================================= */}
        <div className="mt-auto">
          {/* ---------------------------------------------------- */}
          {/* ПК: Метрики (на мобилках и планшетах полностью скрыты, отображаются только на ПК) */}
          {/* ---------------------------------------------------- */}
          <div className="hidden lg:grid grid-cols-3 gap-4 max-w-3xl mx-auto text-center mb-5">
            <div className="p-3.5 rounded-2xl bg-white/[0.04] backdrop-blur-sm border border-white/10 hover:border-cyan-400/30 transition-colors flex flex-col items-center justify-center text-center">
              <div className="text-white font-extrabold text-sm md:text-base tracking-tight mb-0.5">
                {t.hero.metrics.days}
              </div>
              <div className="text-xs text-slate-400">
                {t.hero.metrics.daysLabel}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.04] backdrop-blur-sm border border-white/10 hover:border-cyan-400/30 transition-colors flex flex-col items-center justify-center text-center">
              <div className="text-white font-extrabold text-sm md:text-base tracking-tight mb-0.5">
                {t.hero.metrics.price}
              </div>
              <div className="text-xs text-slate-400">
                {t.hero.metrics.priceLabel}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.04] backdrop-blur-sm border border-white/10 hover:border-cyan-400/30 transition-colors flex flex-col items-center justify-center text-center">
              <div className="text-white font-extrabold text-sm md:text-base tracking-tight mb-0.5">
                {t.hero.metrics.direct}
              </div>
              <div className="text-xs text-slate-400">
                {t.hero.metrics.directLabel}
              </div>
            </div>
          </div>

          {/* Стрелочка вниз */}
          <div className="flex justify-center">
            <a
              href="#about"
              onClick={(e) => handleScrollTo(e, '#about')}
              aria-label="Перейти к разделу Обо мне"
              className="p-1 sm:p-1.5 rounded-full text-slate-400 hover:text-cyan-400 hover:bg-white/5 transition-colors cursor-pointer group"
            >
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 animate-bounce" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;