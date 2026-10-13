import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  FileText,
  HelpCircle,
  FolderHeart,
  ArrowRightCircle,
  Building2,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

const solutionIcons = [
  FileText,
  HelpCircle,
  FolderHeart,
  ArrowRightCircle,
  Building2,
  ShieldAlert,
];

export const Solutions: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="solutions" className="py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[350px] bg-cyan-500/5 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-1/3 right-1/4 w-[450px] h-[350px] bg-indigo-600/5 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-3 px-3 py-1">
            <span>{t.header.nav.solutions}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4 text-balance">
            {t.solutions.title}
          </h2>
          <div className="space-y-2 text-slate-300 text-base sm:text-lg leading-relaxed">
            <p>{t.solutions.intro1}</p>
            <p className="text-cyan-200/90 font-medium">{t.solutions.intro2}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.solutions.items.map((item, idx) => {
            const Icon = solutionIcons[idx % solutionIcons.length];
            return (
              <div
                key={idx}
                className="group relative rounded-3xl border border-white/10 bg-[#090d16]/85 backdrop-blur-xl p-6 sm:p-7 flex flex-col justify-between hover:border-cyan-400/40 hover:shadow-[0_0_30px_-5px_rgba(34,211,238,0.15)] transition-all duration-300 overflow-hidden cursor-default select-none"
              >
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-cyan-500/10 blur-2xl rounded-full group-hover:bg-cyan-400/20 transition-all duration-500 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:text-cyan-300 group-hover:scale-105 group-hover:border-cyan-400/40 transition-all shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs sm:text-[13px] font-bold px-3 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 whitespace-nowrap shadow-sm">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2.5 group-hover:text-cyan-200 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
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

export default Solutions;