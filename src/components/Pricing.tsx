import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Check, Sparkles, ArrowRight, RefreshCw, PlusCircle } from 'lucide-react';

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
    <section id="pricing" className="py-20 lg:py-32 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-cyan-600/15 via-blue-600/10 to-transparent blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-3">
            <span>{t.pricing.preTitle}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            {t.pricing.title}
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-3">
            {t.pricing.intro}
          </p>
          <p className="text-xs sm:text-sm text-slate-500">
            {t.pricing.strikethroughNote}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-20">
          {t.pricing.plans.map((plan) => {
            const isOptimal = plan.popular;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                  isOptimal
                    ? 'glass-panel-glow scale-100 lg:scale-[1.03] z-10'
                    : 'glass-panel glass-panel-hover'
                }`}
              >
                {plan.popularBadge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full text-xs font-bold bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/30 uppercase tracking-wide">
                      <Sparkles className="w-3 h-3 text-slate-950" />
                      <span>{plan.popularBadge}</span>
                    </span>
                  </div>
                )}

                <div>
                  <div className="mb-4">
                    <div className="text-sm font-semibold tracking-wider uppercase text-cyan-400 mb-1">
                      {plan.name}
                    </div>
                    <div className="text-xl font-bold text-white">
                      {plan.subtitle}
                    </div>
                  </div>

                  <div className="my-6 pb-6 border-b border-white/10">
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                        {plan.currentPrice}
                      </span>
                      <span className="text-base sm:text-lg text-slate-500 line-through">
                        {plan.oldPrice}
                      </span>
                    </div>
                    <div className="text-xs text-cyan-300/80 font-medium">
                      {plan.currentPriceSub} · {t.pricing.durationPrefix} {plan.duration}
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                    {plan.audience}
                  </p>

                  <div className="mb-8">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                      {t.pricing.includedTitle}
                    </div>
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            isOptimal
                              ? 'bg-cyan-400/20 text-cyan-300'
                              : 'bg-white/10 text-slate-300'
                          }`}>
                            <Check className="w-2.5 h-2.5" />
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {plan.disclaimer && (
                    <p className="text-xs text-slate-400 italic mb-6">
                      {plan.disclaimer}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-3.5 px-6 rounded-full font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                    isOptimal
                      ? 'bg-white text-slate-950 hover:bg-slate-100 shadow-xl shadow-cyan-500/20 font-bold'
                      : 'bg-white/10 hover:bg-white/15 text-white border border-white/15'
                  }`}
                >
                  <span>{plan.btnText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="glass-panel rounded-3xl p-7 sm:p-10 border border-white/10 mb-14 bg-gradient-to-r from-[#0d141e]/70 via-[#0a0f17]/70 to-[#0d141e]/70">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950/70 text-indigo-300 border border-indigo-500/30 mb-3">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t.pricing.extraService.preTitle}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                {t.pricing.extraService.title}
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
                className="w-full sm:w-auto px-6 py-3 rounded-full text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-300 to-sky-400 hover:from-cyan-200 hover:to-sky-300 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
              >
                {t.pricing.extraService.btnText}
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              {t.pricing.addOns.title}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {t.pricing.addOns.items.map((item, idx) => (
              <div
                key={idx}
                className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-white/15 transition-all flex items-start gap-3.5"
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-normal">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;