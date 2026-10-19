import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, FileText, Lock, Headphones } from 'lucide-react';

const icons = [ShieldCheck, FileText, Lock, Headphones];

export const Guarantees: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="guarantees" className="py-20 lg:py-24 relative overflow-hidden bg-site z-10">
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[350px] bg-cyan-500/5 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[350px] bg-indigo-500/5 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mb-12 sm:mb-14">
          <div className="text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-3">
            <span>{t.guarantees.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">
            {t.guarantees.title}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            {t.guarantees.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {t.guarantees.items.map((item, idx) => {
            const Icon = icons[idx] || ShieldCheck;
            return (
              <div
                key={idx}
                className="group relative rounded-2xl border border-white/10 bg-[#080d17]/85 backdrop-blur-xl p-5 sm:p-6 flex flex-col justify-between hover:border-cyan-400/40 hover:shadow-[0_0_25px_-5px_rgba(34,211,238,0.15)] transition-all duration-300 overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-cyan-500/10 blur-xl rounded-full group-hover:bg-cyan-400/20 transition-all duration-500 pointer-events-none" />

                <div>
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:text-cyan-300 group-hover:scale-105 group-hover:border-cyan-400/40 transition-all shadow-sm mb-4">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white mb-2.5 group-hover:text-cyan-200 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-slate-300 text-xs sm:text-[13px] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Guarantees;