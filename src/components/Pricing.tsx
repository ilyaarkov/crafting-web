import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Check, ArrowRight } from 'lucide-react';

export const Pricing: React.FC = () => {
  const { t } = useLanguage();

  const handleSelectPlan = (planId: string) => {
    const contactElem = document.querySelector('#contact');
    if (contactElem) {
      const offsetTop = contactElem.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });

      const selectElem = document.querySelector<HTMLSelectElement>('#tariff-select');
      if (selectElem) {
        selectElem.value = planId;
        selectElem.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  };

  const renderPricingTitle = (title: string) => {
    // Гарантируем, что слово "сайта" не отрывается в одиночку:
    // либо вся фраза помещается в одну строку, либо переносятся минимум 2 слова ("формат сайта")
    if (title.includes('формат сайта')) {
      const [before] = title.split('формат сайта');
      return (
        <>
          <span className="inline">{before}</span>
          <span className="whitespace-nowrap">формат сайта</span>
        </>
      );
    }
    if (title.includes('Website Format')) {
      const [before] = title.split('Website Format');
      return (
        <>
          <span className="inline">{before}</span>
          <span className="whitespace-nowrap">Website Format</span>
        </>
      );
    }
    return title;
  };

  const renderRedesignTitle = (title: string) => {
    if (title.includes('существующего сайта')) {
      const [before] = title.split('существующего сайта');
      return (
        <>
          <span className="inline">{before}</span>
          <span className="whitespace-nowrap">существующего сайта</span>
        </>
      );
    }
    if (title.includes('Existing Website')) {
      const [before] = title.split('Existing Website');
      return (
        <>
          <span className="inline">{before}</span>
          <span className="whitespace-nowrap">Existing Website</span>
        </>
      );
    }
    return title;
  };

  return (
    <section id="pricing" className="py-16 sm:py-20 lg:py-32 relative overflow-hidden bg-[#06080c] z-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-cyan-600/15 via-blue-600/10 to-transparent blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-4xl mx-auto mb-10 sm:mb-16">
          <div className="text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-2.5">
            <span>{t.pricing.preTitle}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {renderPricingTitle(t.pricing.title)}
          </h2>
        </div>

        {/* Сетка трех тарифов: чистый дизайн, на мобильных компактный */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch mb-10 sm:mb-14">
          {t.pricing.plans.map((plan) => (
            <div
              key={plan.id}
              className="group relative rounded-2xl sm:rounded-3xl p-5 sm:p-8 flex flex-col justify-between transition-all duration-300 glass-panel glass-panel-hover"
            >
              {plan.popularBadge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap z-20">
                  <span className="inline-block px-3.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 uppercase tracking-wide">
                    {plan.popularBadge}
                  </span>
                </div>
              )}

              <div>
                <div className="mb-3 sm:mb-4">
                  <div className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-cyan-400 mb-0.5 sm:mb-1">
                    {plan.name}
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-white">
                    {plan.subtitle}
                  </div>
                </div>

                <div className="my-4 sm:my-6 pb-4 sm:pb-6 border-b border-white/10">
                  <div className="flex items-baseline gap-2 sm:gap-3 mb-1">
                    <span className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                      {plan.currentPrice}
                    </span>
                    <span className="text-sm sm:text-lg text-slate-500 line-through">
                      {plan.oldPrice}
                    </span>
                  </div>
                  <div className="text-xs text-cyan-300/80 font-medium">
                    {t.pricing.durationPrefix} {plan.duration}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 mb-4 sm:mb-6 leading-relaxed">
                  {plan.audience}
                </p>

                <div className="mb-6 sm:mb-8">
                  <div className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 sm:mb-3">
                    {t.pricing.includedTitle}
                  </div>
                  <ul className="space-y-2 sm:space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-slate-200">
                        <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-cyan-400/15 text-cyan-300">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.disclaimer && (
                  <p className="text-[11px] sm:text-xs text-slate-400 italic mb-4 sm:mb-6">
                    {plan.disclaimer}
                  </p>
                )}
              </div>

              {/* Кнопка CTA: подсвечивается при наведении на блок, а при наведении на саму кнопку заливка слева направо */}
              <button
                onClick={() => handleSelectPlan(plan.id)}
                className="relative group/btn overflow-hidden w-full py-3 sm:py-3.5 px-5 sm:px-6 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer bg-white/10 text-white border border-white/15 group-hover:border-cyan-400/60 group-hover:shadow-[0_0_22px_rgba(6,182,212,0.25)]"
              >
                <span className="absolute inset-0 bg-white rounded-full -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300 ease-out pointer-events-none" />
                <span className="relative z-10 flex items-center justify-center gap-2 transition-colors duration-300 group-hover/btn:text-slate-950 font-semibold">
                  <span>{plan.btnText}</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                </span>
              </button>
            </div>
          ))}
        </div>

        {/* Блок переделки существующего сайта: надпись РЕДИЗАЙН в едином стиле с тарифами */}
        <div className="glass-panel rounded-3xl p-7 sm:p-10 border border-white/10 bg-gradient-to-r from-[#0d141e]/70 via-[#0a0f17]/70 to-[#0d141e]/70">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="text-sm font-semibold tracking-wider uppercase text-cyan-400 mb-2">
                {t.pricing.extraService.preTitle}
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                {renderRedesignTitle(t.pricing.extraService.title)}
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                {t.pricing.extraService.description}
              </p>

              <div>
                <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3">
                  {t.pricing.extraService.whatCanImproveTitle}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {t.pricing.extraService.whatCanImproveList.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <Check className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-center items-start lg:items-end border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-8">
              <div className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
                {t.pricing.extraService.price}
              </div>
              <p className="text-xs text-slate-400 mb-6 lg:text-right">
                {t.pricing.extraService.priceNote}
              </p>
              <button
                onClick={() => handleSelectPlan('redesign')}
                className="relative group/btn overflow-hidden w-full sm:w-auto px-7 py-3.5 rounded-full text-sm font-semibold text-slate-950 bg-cyan-400 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="absolute inset-0 bg-white rounded-full -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300 ease-out pointer-events-none" />
                <span className="relative z-10 flex items-center gap-2 transition-colors duration-300">
                  <span>{t.pricing.extraService.btnText}</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;