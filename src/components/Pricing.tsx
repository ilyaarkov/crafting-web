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

  return (
    <section id="pricing" className="py-16 sm:py-20 lg:py-32 relative overflow-hidden bg-[#06080c] z-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-cyan-600/15 via-blue-600/10 to-transparent blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-4xl mx-auto mb-10 sm:mb-16">
          <div className="text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-2.5">
            <span>{t.pricing.preTitle}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {t.pricing.title}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed text-balance">
            {t.pricing.intro}
          </p>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed text-balance">
            {t.pricing.followUp}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch mb-10 sm:mb-14">
          {t.pricing.plans.map((plan) => (
            <div
              key={plan.id}
              className="group relative rounded-2xl sm:rounded-3xl p-5 sm:p-8 flex flex-col justify-between transition-all duration-300 glass-panel glass-panel-hover"
            >
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
                  </div>
                  <div className="text-xs text-cyan-300/80 font-medium mt-2">
                    {t.pricing.durationPrefix} {plan.duration}
                  </div>
                </div>

                <div className="space-y-4 mb-6 sm:mb-8">
                  <div>
                    <div className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      {t.pricing.audienceTitle}
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed">
                      {plan.audience}
                    </p>
                  </div>
                  <div>
                    <div className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      {t.pricing.resultTitle}
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed">
                      {plan.result}
                    </p>
                  </div>
                  <div>
                    <div className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      {t.pricing.includedTitle}
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-200 leading-relaxed">
                          <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {plan.disclaimer && (
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {plan.disclaimer}
                    </p>
                  )}
                </div>
              </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="glass-panel rounded-2xl sm:rounded-3xl p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
              {t.pricing.afterLaunch.title}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-5">
              {t.pricing.afterLaunch.description}
            </p>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              {t.pricing.afterLaunch.followUp}
            </p>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              {t.pricing.afterLaunch.priceNote}
            </p>
            <button
              onClick={() => handleSelectPlan('custom')}
              className="relative group/btn overflow-hidden w-full py-3 px-5 rounded-full font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer bg-white/10 text-white border border-white/15 hover:border-cyan-400/60"
            >
              <span className="absolute inset-0 bg-white rounded-full -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300 ease-out pointer-events-none" />
              <span className="relative z-10 flex items-center gap-2 group-hover/btn:text-slate-950">
                {t.pricing.afterLaunch.btnText}
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
              </span>
            </button>
          </div>

          <div className="glass-panel rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                {t.pricing.extraService.title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {t.pricing.extraService.description}
              </p>
            </div>
            <div className="shrink-0 sm:text-right">
              <div className="text-xl sm:text-2xl font-extrabold text-white mb-3">
                {t.pricing.extraService.price}
              </div>
              <button
                onClick={() => handleSelectPlan('redesign')}
                className="relative group/btn overflow-hidden w-full sm:w-auto px-6 py-3 rounded-full text-sm font-semibold text-slate-950 bg-cyan-400 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
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