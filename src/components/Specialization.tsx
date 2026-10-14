import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Layers } from 'lucide-react';

export const Specialization: React.FC = () => {
  const { t, lang } = useLanguage();
  const isEn = lang === 'en';
  const [visibleItems, setVisibleItems] = useState<Record<string, boolean>>({});
  const [activeMobileTab, setActiveMobileTab] = useState<number>(0);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const categories = t.specialization.categories;

  // Intersection Observer для плавной анимации появления каждого элемента при скролле
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      const allVisible: Record<string, boolean> = {};
      categories.forEach((cat, cIdx) => {
        cat.items.forEach((_, iIdx) => {
          allVisible[`${cIdx}-${iIdx}`] = true;
        });
      });
      setVisibleItems(allVisible);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const key = entry.target.getAttribute('data-item-key');
            if (key) {
              setVisibleItems((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    Object.values(itemRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [categories, activeMobileTab]);

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

  const renderItemList = (categoryIndex: number, isMobileView = false) => {
    const category = categories[categoryIndex];
    if (!category) return null;
    const isWebCol = categoryIndex === 0;

    return (
      <div className="divide-y divide-white/10">
        {category.items.map((item, itemIdx) => {
          const itemKey = `${isMobileView ? 'm-' : ''}${categoryIndex}-${itemIdx}`;
          const isVisible = !!visibleItems[itemKey] || isMobileView;

          return (
            <div
              key={itemIdx}
              ref={(el) => {
                itemRefs.current[itemKey] = el;
              }}
              data-item-key={itemKey}
              style={{
                transitionDelay: `${itemIdx * 50}ms`,
              }}
              className={`group py-4 sm:py-5 transition-all duration-500 ease-out ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <h4
                  className={`text-base sm:text-lg font-bold text-white transition-colors duration-200 leading-snug ${
                    isWebCol ? 'group-hover:text-cyan-300' : 'group-hover:text-sky-300'
                  }`}
                >
                  {item.title}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-200 leading-relaxed mt-1 sm:mt-1.5">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section id="specialization" className="py-20 lg:py-32 relative overflow-hidden select-none">
      {/* Мягкие световые ореолы */}
      <div className="absolute top-1/4 -left-48 w-[600px] h-[600px] bg-cyan-500/8 blur-[180px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 -right-48 w-[600px] h-[600px] bg-sky-600/8 blur-[180px] rounded-full pointer-events-none -z-10" />

      {/* Тонкая сетка для глубины */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Заголовок секции: только чистый текст без звездочек, фона и рамок */}
        <div className="max-w-3xl mb-12 sm:mb-16 lg:mb-20">
          <div className="text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-3">
            <span>{t.specialization.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4 text-balance">
            {t.specialization.title}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed text-balance">
            {t.specialization.subtitle}
          </p>
        </div>

        {/* ========================================================= */}
        {/* МОБИЛЬНАЯ ВЕРСИЯ (< lg): Переключатель двух направлений вверху */}
        {/* ========================================================= */}
        <div className="block lg:hidden mb-8">
          {/* Вкладки переключения между Веб-разработкой и Автоматизацией */}
          <div className="flex border-b border-white/10 mb-6">
            {categories.map((category, idx) => {
              const isActive = activeMobileTab === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveMobileTab(idx)}
                  className={`flex-1 py-3 px-2 text-center text-sm font-bold transition-all relative cursor-pointer ${
                    isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{category.title}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-sky-400 shadow-[0_0_12px_rgba(34,211,238,0.5)]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Список смысловых блоков активной категории с разделением линиями */}
          {renderItemList(activeMobileTab, true)}
        </div>

        {/* ========================================================= */}
        {/* ДЕСКТОП ВЕРСИЯ (lg+): Два параллельных столбца с разделительными линиями */}
        {/* ========================================================= */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-12 lg:gap-14 xl:gap-16 items-start">
          {categories.map((category, catIdx) => {
            const isWebCol = catIdx === 0;

            return (
              <div key={catIdx} className="flex flex-col">
                {/* Шапка колонки: чистый заголовок и деликатная разделительная линия */}
                <div className="mb-6">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {category.title}
                  </h3>

                  <div
                    className={`h-px w-full mt-4 ${
                      isWebCol
                        ? 'bg-gradient-to-r from-cyan-500/30 via-white/10 to-transparent'
                        : 'bg-gradient-to-r from-sky-500/30 via-white/10 to-transparent'
                    }`}
                  />
                </div>

                {/* Чистый список блоков с разделением линиями без тяжелых коробок */}
                {renderItemList(catIdx, false)}
              </div>
            );
          })}
        </div>

        {/* Элегантная нижняя строка с приглашением обсудить задачу под ключ */}
        <div className="mt-14 sm:mt-18 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-400 text-center sm:text-left">
            <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              {isEn
                ? 'Need a tailored custom solution or a combination of multiple formats?'
                : 'Нужно индивидуальное решение или комбинация нескольких направлений?'}
            </span>
          </div>

          <a
            href="#contact"
            onClick={(e) => handleScrollTo(e, '#contact')}
            className="relative group/btn overflow-hidden inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:px-7 sm:py-3 rounded-full text-xs sm:text-sm font-semibold cursor-pointer transition-all duration-300 bg-white/10 text-white border border-white/15 hover:border-cyan-400/60 hover:shadow-[0_0_22px_rgba(6,182,212,0.25)]"
          >
            <span className="absolute inset-0 bg-white rounded-full -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300 ease-out pointer-events-none" />
            <span className="relative z-10 flex items-center gap-2 transition-colors duration-300 group-hover/btn:text-slate-950 font-semibold">
              <span>{t.specialization.orderCta}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Specialization;
