import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  ArrowRight,
  Zap,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  XCircle,
  Smartphone,
  Send,
  Lock,
  Globe,
  Layers,
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { t, lang } = useLanguage();

  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const badgeLeftRef = useRef<HTMLDivElement>(null);
  const badgeRightRef = useRef<HTMLDivElement>(null);

  const [isTouch, setIsTouch] = useState(false);

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

  // 1. Аппаратно-ускоренный 3D-параллакс через прямые ref-мутации (БЕЗ перерендера React, 60-120 FPS на Intel Mac)
  useEffect(() => {
    const isTouchDevice =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches);

    setIsTouch(isTouchDevice);

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animationFrameId: number;

    const renderLoop = () => {
      // Мягкая кинематографическая интерполяция lerp
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      // Прямое обновление стилей через ref (исключает тормоза от React re-render)
      if (mockupRef.current) {
        if (isTouchDevice) {
          mockupRef.current.style.transform = `perspective(1000px) rotateX(${currentY * -0.5}deg)`;
        } else {
          mockupRef.current.style.transform = `perspective(1000px) rotateX(${currentY * -0.65}deg) rotateY(${currentX * 0.65}deg)`;
        }
      }

      if (badgeLeftRef.current && !isTouchDevice) {
        badgeLeftRef.current.style.transform = `translate3d(${currentX * 1.5}px, ${currentY * 1.5}px, 20px)`;
      }

      if (badgeRightRef.current && !isTouchDevice) {
        badgeRightRef.current.style.transform = `translate3d(${currentX * -1.4}px, ${currentY * -1.4}px, 20px)`;
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    if (isTouchDevice) {
      // НА ТЕЛЕФОНАХ: плавный скролл-параллакс
      const handleScroll = () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight || 800;
        const scrollProgress = Math.min(1, Math.max(0, scrollY / (windowHeight * 0.9)));
        targetY = (scrollProgress - 0.2) * 8;
        targetX = 0;
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('scroll', handleScroll);
      };
    } else {
      // НА ПК / Mac: плавное следование за курсором мыши
      const handleMouseMove = (e: MouseEvent) => {
        const { innerWidth, innerHeight } = window;
        const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
        const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);
        targetX = Math.max(-1, Math.min(1, x)) * 10;
        targetY = Math.max(-1, Math.min(1, y)) * 10;
      };

      window.addEventListener('mousemove', handleMouseMove, { passive: true });

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, []);

  // 2. Легковесный фоновый Canvas (оптимизирован для встроенной графики Intel Iris)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Сниженное количество точек для отсутствия просадок FPS на ноутбуках
    const particleCount = width < 768 ? 20 : 36;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 1.4 + 0.8,
    }));

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = width < 768 ? 85 : 125;

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.18;
            ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.fillStyle = 'rgba(56, 189, 248, 0.5)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[94vh] flex flex-col items-center justify-center pt-28 pb-16 lg:pt-36 lg:pb-28 overflow-hidden select-none"
    >
      {/* 1. Живой интерактивный Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0"
      />

      {/* 2. Атмосферные градиенты (статичные, без тяжелой повторной растеризации на Intel Mac) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[400px] bg-gradient-to-tr from-cyan-600/20 via-sky-500/15 to-blue-700/10 blur-[85px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-5 w-[320px] h-[320px] bg-cyan-500/10 blur-[75px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-5 w-[360px] h-[360px] bg-blue-600/10 blur-[85px] rounded-full pointer-events-none -z-10" />

      {/* 3. Фоновая сетка */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none -z-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1.2px, transparent 0)',
          backgroundSize: '36px 36px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 w-full text-center">
        {/* Статус / Бейдж */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-cyan-950/70 text-cyan-300 border border-cyan-500/30 mb-6 backdrop-blur-md shadow-lg shadow-cyan-950/40 hover:border-cyan-400/50 transition-colors">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>{t.hero.badge}</span>
        </div>

        {/* Главный заголовок H1 */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.14] sm:leading-[1.12] mb-5 max-w-4xl mx-auto text-balance">
          {lang === 'ru' ? (
            <>
              Сайт, который объясняет{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-300">
                ваши услуги за вас
              </span>
            </>
          ) : (
            <>
              A website that explains{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-300">
                your services for you
              </span>
            </>
          )}
        </h1>

        {/* Короткий лид */}
        <p className="text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto mb-8 text-balance font-normal">
          {t.hero.description}
        </p>

        {/* Кнопки призыва к действию */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <a
            href="#contact"
            onClick={(e) => handleScrollTo(e, '#contact')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-slate-950 bg-gradient-to-r from-cyan-300 via-cyan-400 to-sky-400 hover:from-cyan-200 hover:to-sky-300 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-400/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{t.hero.ctaPrimary}</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="#projects"
            onClick={(e) => handleScrollTo(e, '#projects')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full font-medium text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{t.hero.ctaSecondary}</span>
          </a>
        </div>

        {/* 4. ИНТЕРАКТИВНЫЙ МАКЕТ С КАРТИНКАМИ (Аппаратно ускорен, 60-120 FPS без лагов) */}
        <div
          ref={mockupRef}
          className="relative max-w-4xl mx-auto mb-16 perspective-[1200px]"
          style={{
            willChange: 'transform',
            transformStyle: 'preserve-3d',
          }}
        >

          {/* Стеклянное окно веб-интерфейса */}
          <div className="glass-panel rounded-3xl border border-white/15 bg-[#090d15]/95 shadow-2xl overflow-hidden text-left relative group">
            <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between bg-[#0b101a]/90">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/70" />
                <span className="w-3 h-3 rounded-full bg-amber-500/70" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
              </div>

              <div className="flex items-center gap-1.5 px-4 py-1 rounded-full bg-black/40 border border-white/10 text-[11px] text-slate-400 font-mono">
                <Lock className="w-2.5 h-2.5 text-cyan-400" />
                <span>ilyaarkov.com / your-website</span>
              </div>
            </div>

            {/* Картинки визуального сравнения (Было vs Стало) */}
            <div className="p-4 sm:p-7 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {/* Левый блок: Было */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-rose-500/25 flex flex-col justify-between group/card hover:border-rose-500/40 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                      <XCircle className="w-4 h-4" />
                      <span>{lang === 'ru' ? 'Было · без сайта' : 'Before · No website'}</span>
                    </div>
                    <span className="text-[11px] text-rose-300/70 font-medium">
                      {lang === 'ru' ? 'Хаос в переписках' : 'Messy chat routine'}
                    </span>
                  </div>

                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-rose-500/20 bg-slate-950 mb-4 shadow-inner">
                    <picture>
                      <source srcSet="/images/before-chaos.webp" type="image/webp" />
                      <img
                        src="/images/before-chaos.jpg"
                        alt={lang === 'ru' ? 'Хаос в переписках и мессенджерах' : 'Chaotic messaging and scattered price lists'}
                        fetchPriority="high"
                        decoding="async"
                        width={1000}
                        height={625}
                        className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                      />
                    </picture>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14]/90 via-transparent to-transparent" />
                    <div className="absolute bottom-2.5 left-3 right-3 text-[11px] text-rose-200/90 font-medium leading-snug">
                      {lang === 'ru'
                        ? 'Постоянная отправка PDF-файлов, ответы на одни и те же вопросы и потеря заявок в переписках'
                        : 'Typing prices manually, sending PDFs, and losing clients in slow back-and-forth chats'}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-rose-500/10 flex items-center justify-between text-[11px] text-rose-400/80">
                  <span>{lang === 'ru' ? 'Трата времени на рутину' : 'Time lost on repetitive questions'}</span>
                  <span className="text-xs">⏱️</span>
                </div>
              </div>

              {/* Правый блок: Стало */}
              <div className="p-4 sm:p-5 rounded-2xl bg-cyan-950/20 border border-cyan-400/40 flex flex-col justify-between shadow-lg shadow-cyan-950/40 group/card hover:border-cyan-400/70 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      <span>{lang === 'ru' ? 'Стало · с новым сайтом' : 'After · With your website'}</span>
                    </div>
                    <span className="text-[11px] text-emerald-300 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{lang === 'ru' ? 'Работает 24/7' : '24/7 automation'}</span>
                    </span>
                  </div>

                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-cyan-400/30 bg-slate-950 mb-4 shadow-inner shadow-cyan-950/50">
                    <picture>
                      <source srcSet="/images/after-website.webp" type="image/webp" />
                      <img
                        src="/images/after-website.jpg"
                        alt={lang === 'ru' ? 'Современный сайт со структурой и заявками' : 'Clean structured website with instant leads'}
                        decoding="async"
                        width={1000}
                        height={625}
                        className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                      />
                    </picture>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14]/90 via-transparent to-transparent" />
                    <div className="absolute bottom-2.5 left-3 right-3 text-[11px] text-cyan-100 font-medium leading-snug">
                      {lang === 'ru'
                        ? 'Одна понятная ссылка: структурированные услуги, цены, портфолио и моментальное уведомление о новых заявках'
                        : 'One clear link: structured rates, portfolio, and instant notification of new applications'}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-cyan-500/20 flex items-center justify-between text-[11px] text-cyan-300 font-medium">
                  <span>{t.hero.subDescription2}</span>
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                </div>
              </div>
            </div>

            {/* Подсказка внизу окна */}
            <div className="px-6 py-2.5 bg-black/40 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <span className="text-cyan-400 font-mono text-[10px]">
                React &bull; TypeScript &bull; Tailwind
              </span>
            </div>
          </div>
        </div>

        {/* 5. Карточки преимуществ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto text-left">
          <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 border border-white/10 hover:border-cyan-500/30 transition-all hover:-translate-y-0.5">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-extrabold text-base">{t.hero.metrics.days}</div>
              <div className="text-xs text-slate-400">{t.hero.metrics.daysLabel}</div>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 border border-white/10 hover:border-cyan-500/30 transition-all hover:-translate-y-0.5">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-extrabold text-base">{t.hero.metrics.price}</div>
              <div className="text-xs text-slate-400">{t.hero.metrics.priceLabel}</div>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 border border-white/10 hover:border-cyan-500/30 transition-all hover:-translate-y-0.5">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-extrabold text-base">{t.hero.metrics.direct}</div>
              <div className="text-xs text-slate-400">{t.hero.metrics.directLabel}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;