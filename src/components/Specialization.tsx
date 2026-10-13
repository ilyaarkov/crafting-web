import React, { useState } from 'react';
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
} from 'lucide-react';

export const Specialization: React.FC = () => {
  const { t } = useLanguage();
  const [hoveredIdx, setHoveredIdx] = useState<string | null>(null);

  // Иконки для первой колонки: Веб-разработка
  const webIcons = [Laptop, Building, ShoppingBag, Rocket, Palette];

  // Иконки для второй колонки: Автоматизация и интеграции
  const autoIcons = [Send, Cpu, CreditCard, Bot];

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

  const categories = t.specialization.categories;

  return (
    <section id="specialization" className="py-20 lg:py-28 relative overflow-hidden select-none">
      {/* Декоративные световые ореолы */}
      <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 -right-40 w-[500px] h-[500px] bg-sky-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      {/* Тонкая сетка для глубины */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Заголовок секции: "Моя специализация" */}
        <div className="max-w-3xl mb-14 sm:mb-16">
          <div className="text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-3">
            <span>{t.specialization.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4 text-balance">
            {t.specialization.title}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed text-balance">
            {t.specialization.subtitle}
          </p>
        </div>

        {/* Две основные колонки без синих точек, без бейджей количества и без слоп-текстов */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
          {categories.map((category, catIdx) => {
            const isFirstCol = catIdx === 0;
            const icons = isFirstCol ? webIcons : autoIcons;

            return (
              <div
                key={catIdx}
                className={`relative rounded-[32px] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 border ${
                  isFirstCol
                    ? 'bg-gradient-to-b from-[#090e18]/90 via-[#070b13]/85 to-[#060910]/90 border-cyan-500/25 shadow-[0_10px_40px_rgba(6,182,212,0.06)]'
                    : 'bg-gradient-to-b from-[#0a0d1b]/90 via-[#070914]/85 to-[#06080f]/90 border-sky-500/25 shadow-[0_10px_40px_rgba(14,165,233,0.06)]'
                }`}
              >
                {/* Фоновый деликатный акцент в углу колонки */}
                <div
                  className={`absolute -top-16 -right-16 w-48 h-48 rounded-full blur-[80px] pointer-events-none -z-10 ${
                    isFirstCol ? 'bg-cyan-500/15' : 'bg-sky-500/15'
                  }`}
                />

                {/* Шапка колонки: только чистый заголовок без синих точек и счетчиков */}
                <div className="mb-6 pb-4 border-b border-white/5">
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {category.title}
                  </h3>
                </div>

                {/* Список направлений внутри колонки (без цифр 01/02) */}
                <div className="space-y-3.5 flex-1">
                  {category.items.map((item, itemIdx) => {
                    const Icon = icons[itemIdx % icons.length];
                    const cardKey = `${catIdx}-${itemIdx}`;
                    const isHovered = hoveredIdx === cardKey;

                    return (
                      <div
                        key={itemIdx}
                        onMouseEnter={() => setHoveredIdx(cardKey)}
                        onMouseLeave={() => setHoveredIdx(null)}
                        className={`group rounded-2xl p-4 sm:p-4.5 border transition-all duration-200 cursor-default ${
                          isHovered
                            ? isFirstCol
                              ? 'bg-cyan-950/30 border-cyan-400/40 translate-x-1 shadow-md shadow-cyan-950/40'
                              : 'bg-sky-950/30 border-sky-400/40 translate-x-1 shadow-md shadow-sky-950/40'
                            : 'bg-white/[0.02] border-white/5 hover:border-white/15'
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          {/* Аккуратная мини-иконка */}
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                              isHovered
                                ? isFirstCol
                                  ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/40'
                                  : 'bg-sky-400/20 text-sky-300 border border-sky-400/40'
                                : 'bg-white/5 text-slate-300 border border-white/10 group-hover:text-white'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4
                              className={`text-sm sm:text-base font-bold mb-1 transition-colors leading-snug ${
                                isHovered
                                  ? isFirstCol
                                    ? 'text-cyan-200'
                                    : 'text-sky-200'
                                  : 'text-white'
                              }`}
                            >
                              {item.title}
                            </h4>
                            <p className="text-xs sm:text-[13px] text-slate-400 leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Низ колонки: кнопка призыва к действию без слоп-подписей */}
                <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-end">
                  <a
                    href="#contact"
                    onClick={(e) => handleScrollTo(e, '#contact')}
                    className="relative group/btn overflow-hidden px-4.5 py-2 rounded-full text-xs sm:text-sm font-semibold text-cyan-300 bg-cyan-950/50 border border-cyan-500/30 hover:border-cyan-400 transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="absolute inset-0 bg-cyan-400 rounded-full -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300 ease-out pointer-events-none" />
                    <span className="relative z-10 flex items-center gap-1.5 transition-colors duration-300 group-hover/btn:text-slate-950 font-bold">
                      <span>{t.specialization.orderCta}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                    </span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Specialization;