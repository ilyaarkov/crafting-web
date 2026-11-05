import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { ParallaxStarfield } from './ParallaxStarfield';
import { MacBrowserFrame } from './MacBrowserFrame';
import { PROJECTS_DATA } from '../data/projectsData';

// Тонкие наклонные орбиты с «планетами» – без заливок и свечения, только контуры
const PricingOrbits: React.FC = () => (
  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
    <g fill="none" stroke="rgba(125,211,252,0.09)" strokeWidth="1" vectorEffect="non-scaling-stroke">
      <ellipse cx="500" cy="520" rx="620" ry="170" transform="rotate(-12 500 520)" />
      <ellipse cx="500" cy="520" rx="470" ry="120" transform="rotate(-12 500 520)" strokeDasharray="2 7" />
    </g>
    <circle cx="1100" cy="379" r="3" fill="rgba(165,243,252,0.6)" transform="rotate(-12 500 520)" />
    <circle cx="225" cy="602" r="2.2" fill="rgba(186,230,253,0.55)" />
  </svg>
);

export const Pricing: React.FC = () => {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const handleProjectClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    navigate(href);
  };

  const handleScrollToContact = () => {
    const elem = document.querySelector('#contact');
    if (elem) {
      const offsetTop = elem.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  return (
    <section id="pricing" className="py-16 sm:py-20 lg:py-32 relative overflow-hidden bg-site z-10">
      {/* ФОН СЕКЦИИ: звёздное поле с созвездиями и наклонными орбитами на средней глубине */}
      <ParallaxStarfield seed={101} constellations={2} fadeBottom={5} accent={<PricingOrbits />} accentSpeed={0.55} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Заголовок */}
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {t.pricing.title}
          </h2>
        </div>

        {/* Коротко: вилка цен */}
        <div className="relative glass-panel rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-8 sm:mb-10 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/10 blur-[60px] rounded-full pointer-events-none" />
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
            <div className="shrink-0">
              <div className="text-[11px] sm:text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2">
                {t.pricing.briefLabel}
              </div>
              <div className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                {t.pricing.briefRange}
              </div>
            </div>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed sm:max-w-md">
              {t.pricing.briefNote}
            </p>
          </div>
        </div>

        {/* Подробно: объяснение */}
        <div className="mb-8 sm:mb-10">
          <div className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
            {t.pricing.detailsLabel}
          </div>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed [text-wrap:pretty]">
            {t.pricing.detailsText}
          </p>
        </div>

        {/* Кейсы: цена и миниатюра, ведут на страницу проекта */}
        <div className="mb-10 sm:mb-12">
          <div className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
            {t.pricing.examplesLabel}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {t.pricing.examples.map((example, idx) => {
              const href = `/portfolio/${example.id}`;
              const meta = PROJECTS_DATA[example.id];
              return (
                <a
                  key={example.id}
                  href={href}
                  onClick={(event) => handleProjectClick(event, href)}
                  className="group relative block rounded-2xl sm:rounded-3xl p-4 sm:p-5 glass-panel glass-panel-hover overflow-hidden transition-all duration-500 hover:-translate-y-1"
                  style={{ transitionDelay: `${idx * 40}ms` }}
                >
                  <div className="mb-4 rounded-xl overflow-hidden group-hover:shadow-[0_0_35px_rgba(34,211,238,0.25)] transition-all duration-300">
                    <MacBrowserFrame
                      imageSrc={meta?.previewImage}
                      imageAlt={example.title}
                      overlayText={lang === 'ru' ? 'ПОСМОТРЕТЬ' : 'VIEW'}
                      loading="lazy"
                    />
                  </div>

                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {example.price}
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-cyan-300 shrink-0 mt-1 opacity-70 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                    {example.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {example.description}
                  </p>
                </a>
              );
            })}
          </div>
        </div>

        {/* Финальный абзац + CTA */}
        <div className="text-center">
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto mb-8 [text-wrap:balance]">
            {t.pricing.conclusion}
          </p>
          <button
            type="button"
            onClick={handleScrollToContact}
            className="relative group overflow-hidden min-h-11 px-8 py-3.5 rounded-full font-bold text-slate-950 bg-cyan-400 transition-colors duration-300 active:scale-[0.98] text-sm sm:text-base inline-flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-400/20"
          >
            <span className="absolute inset-0 bg-white rounded-full -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out pointer-events-none" />
            <span className="relative z-10 flex items-center gap-2">
              <span>{t.pricing.cta}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
