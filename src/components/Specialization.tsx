import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Laptop,
  Building,
  ShoppingBag,
  Rocket,
  Palette,
  Send,
  Cpu,
  CreditCard,
  Bot,
  ArrowRight,
  Layers,
} from 'lucide-react';

export const Specialization: React.FC = () => {
  const { t, lang } = useLanguage();
  const isEn = lang === 'en';
  const [visibleItems, setVisibleItems] = useState<Record<string, boolean>>({});
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Иконки для веб-разработки (5 направлений)
  const webIcons = [Laptop, Building, ShoppingBag, Rocket, Palette];

  // Иконки для автоматизации и интеграций (4 направления)
  const autoIcons = [Send, Cpu, CreditCard, Bot];

  const categories = t.specialization.categories;

  // Intersection Observer для анимации появления каждого смыслового блока при скролле
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      // Fallback: показать все элементы сразу
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
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    Object.values(itemRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [categories]);

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

  return (
    <section id="specialization" className="py-24 lg:py-32 relative overflow-hidden select-none">
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
        <div className="max-w-3xl mb-16 sm:mb-20">
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

        {/* Два стильных столбца без тяжелых внешних рамок ("бордеры в бордерах" полностью устранены) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-14 xl:gap-16 items-start">
          {categories.map((category, catIdx) => {
            const isWebCol = catIdx === 0;
            const icons = isWebCol ? webIcons : autoIcons;
            const colAccent = isWebCol ? 'cyan' : 'sky';

            return (
              <div key={catIdx} className="flex flex-col">
                {/* Шапка колонки: чистый заголовок и деликатная разделительная линия */}
                <div className="mb-8">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {category.title}
                  </h3>

                  {/* Тонкий градиентный акцент вместо тяжелого бордера */}
                  <div
                    className={`h-px w-full mt-4 ${
                      isWebCol
                        ? 'bg-gradient-to-r from-cyan-500/30 via-white/10 to-transparent'
                        : 'bg-gradient-to-r from-sky-500/30 via-white/10 to-transparent'
                    }`}
                  />
                </div>

                {/* Смысловые блоки под заголовком: чистые, без вложенных коробок, с анимацией при скролле и дорогим ховером */}
                <div className="space-y-4">
                  {category.items.map((item, itemIdx) => {
                    const Icon = icons[itemIdx % icons.length];
                    const itemKey = `${catIdx}-${itemIdx}`;
                    const isVisible = !!visibleItems[itemKey];

                    return (
                      <div
                        key={itemIdx}
                        ref={(el) => {
                          itemRefs.current[itemKey] = el;
                        }}
                        data-item-key={itemKey}
                        style={{
                          transitionDelay: `${itemIdx * 80}ms`,
                        }}
                        className={`group relative rounded-2xl p-5 sm:p-6 border transition-all duration-500 ease-out cursor-default ${
                          isVisible
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-6 pointer-events-none'
                        } bg-gradient-to-r from-white/[0.025] to-transparent border-white/[0.06] hover:border-white/20 hover:bg-white/[0.04]`}
                      >
                        {/* Тонкий акцентный световой индикатор слева при наведении */}
                        <div
                          className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 group-hover:h-8 rounded-r transition-all duration-300 ease-out ${
                            isWebCol ? 'bg-cyan-400' : 'bg-sky-400'
                          }`}
                        />

                        <div className="flex items-start gap-4">
                          {/* Аккуратная иконка с деликатным изменением контраста */}
                          <div
                            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 ${
                              isWebCol
                                ? 'bg-white/[0.03] text-slate-300 border-white/10 group-hover:bg-cyan-500/10 group-hover:text-cyan-300 group-hover:border-cyan-500/30 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                                : 'bg-white/[0.03] text-slate-300 border-white/10 group-hover:bg-sky-500/10 group-hover:text-sky-300 group-hover:border-sky-500/30 group-hover:shadow-[0_0_15px_rgba(14,165,233,0.15)]'
                            }`}
                          >
                            <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-105" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <h4
                                className={`text-base sm:text-lg font-bold text-white transition-colors duration-200 leading-snug ${
                                  isWebCol
                                    ? 'group-hover:text-cyan-200'
                                    : 'group-hover:text-sky-200'
                                }`}
                              >
                                {item.title}
                              </h4>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-200">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Элегантная нижняя строка с приглашением обсудить задачу под ключ */}
        <div className="mt-16 sm:mt-20 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-400">
            <Layers className="w-4 h-4 text-cyan-400" />
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
