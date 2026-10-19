import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle2,
  Send,
  Sparkles,
  Layers,
  Code2,
  ShieldCheck,
  FolderOpen,
  UserCheck,
} from 'lucide-react';
import { SERVICES_DATA, ServiceDetail } from '../data/servicesData';

interface ServiceDetailPageProps {
  serviceId: string;
  onNavigateHome: () => void;
}

const cosmicStars = [
  { top: '6%', left: '12%', size: '2px', opacity: '0.6', delay: '0s' },
  { top: '14%', left: '86%', size: '2.5px', opacity: '0.8', delay: '1s' },
  { top: '26%', left: '44%', size: '1.5px', opacity: '0.5', delay: '2s' },
  { top: '38%', left: '8%', size: '2px', opacity: '0.7', delay: '0.5s' },
  { top: '50%', left: '92%', size: '2px', opacity: '0.6', delay: '1.5s' },
  { top: '64%', left: '18%', size: '1.5px', opacity: '0.4', delay: '2.5s' },
  { top: '78%', left: '82%', size: '2.5px', opacity: '0.7', delay: '0.8s' },
  { top: '88%', left: '14%', size: '2px', opacity: '0.8', delay: '1.2s' },
];

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({
  serviceId,
  onNavigateHome,
}) => {
  const { lang, setLang } = useLanguage();
  const currentLang = (lang === 'en' ? 'en' : 'ru') as 'ru' | 'en';

  const service: ServiceDetail | undefined =
    SERVICES_DATA[serviceId] || SERVICES_DATA['landing-page'];

  useEffect(() => {
    const origTitle = document.title;
    if (service) {
      document.title = `${service.title[currentLang]} – Илья Арьков`;
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    return () => {
      document.title = origTitle;
    };
  }, [service, currentLang]);

  const toggleLanguage = () => {
    setLang(lang === 'ru' ? 'en' : 'ru');
  };

  const navigateToHomeContact = () => {
    onNavigateHome();
    setTimeout(() => {
      const el = document.querySelector('#contact');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  if (!service) return null;

  const isWeb = service.category === 'web';
  const accentColor = isWeb ? 'cyan' : 'sky';

  return (
    <div className="min-h-screen bg-site text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200 relative overflow-hidden">
      {/* Декоративные космические звезды */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {cosmicStars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-200 animate-pulse pointer-events-none"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
              animationDelay: star.delay,
              animationDuration: '4s',
            }}
          />
        ))}
      </div>

      {/* Ореолы свечения */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-cyan-500/10 blur-[160px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-40 right-10 w-[500px] h-[500px] bg-sky-500/10 blur-[160px] rounded-full pointer-events-none -z-10" />

      {/* Верхняя навигационная панель */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-site/80 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="group flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-500/30 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5 text-cyan-400" />
            <span>{currentLang === 'ru' ? 'На главную' : 'Back to Home'}</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold text-slate-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 transition-colors cursor-pointer"
            >
              {lang === 'ru' ? 'EN' : 'RU'}
            </button>

            <button
              onClick={navigateToHomeContact}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all cursor-pointer"
            >
              {currentLang === 'ru' ? 'Обсудить проект' : 'Discuss Project'}
            </button>
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 lg:py-20 relative z-10 w-full">
        {/* Бейдж и заголовок */}
        <div className="mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-widest text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{service.badge[currentLang]}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6">
            {service.title[currentLang]}
          </h1>

          <p className="text-base sm:text-xl text-slate-300 leading-relaxed max-w-3xl mb-8">
            {service.subtitle[currentLang]}
          </p>

          {/* Метрики / преимущества */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>{currentLang === 'ru' ? 'Срок реализации' : 'Estimated Delivery'}</span>
              </div>
              <div className="text-base font-bold text-white">{service.duration[currentLang]}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>{currentLang === 'ru' ? 'Формат работы' : 'Collaboration'}</span>
              </div>
              <div className="text-base font-bold text-white">
                {currentLang === 'ru' ? '1 на 1 с разработчиком' : 'Direct with Developer'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>{currentLang === 'ru' ? 'Гарантия' : 'Assurance'}</span>
              </div>
              <div className="text-base font-bold text-white">
                {currentLang === 'ru' ? 'Официальный договор' : 'Official Agreement'}
              </div>
            </div>
          </div>
        </div>

        {/* 1. О формате и сути */}
        <section className="mb-14 p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>{currentLang === 'ru' ? 'О решении' : 'About Solution'}</span>
          </h2>
          <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            {service.fullDescription[currentLang].map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </section>

        {/* 2. Кому подходит + Что входит (2 колонки) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
          {/* Кому подходит */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-5 flex items-center gap-2.5">
              <UserCheck className="w-5 h-5 text-cyan-400" />
              <span>{currentLang === 'ru' ? 'Для кого подходит' : 'Target Audience'}</span>
            </h3>
            <ul className="space-y-3.5">
              {service.targetAudience[currentLang].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Что входит в разработку */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-5 flex items-center gap-2.5">
              <Code2 className="w-5 h-5 text-sky-400" />
              <span>{currentLang === 'ru' ? 'Что входит в разработку' : 'Scope & Deliverables'}</span>
            </h3>
            <ul className="space-y-3.5">
              {service.scope[currentLang].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-sky-400/10 border border-sky-400/30 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                  </div>
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 3. Преимущества и стек */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
          {/* Преимущества */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4">
              {currentLang === 'ru' ? 'Ключевые преимущества' : 'Key Advantages'}
            </h3>
            <div className="space-y-3">
              {service.advantages[currentLang].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs sm:text-sm text-slate-300 flex items-center gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Стек технологий */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                {currentLang === 'ru' ? 'Стек технологий' : 'Technologies Used'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mb-5">
                {currentLang === 'ru'
                  ? 'Современные и надежные инструменты без тяжелых конструкторов.'
                  : 'Modern, high-performance web engineering tools.'}
              </p>
              <div className="flex flex-wrap gap-2">
                {service.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold text-cyan-300 bg-cyan-950/40 border border-cyan-500/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-white/5 text-xs text-slate-400">
              {currentLang === 'ru'
                ? 'Быстрая сборка, чистый исходный код и отсутствие привязки к платформе.'
                : 'Fast compilation, clean source code, and zero vendor lock-in.'}
            </div>
          </div>
        </div>

        {/* 4. Блок кейсов (подготовлен под будущие примеры работ) */}
        <section className="mb-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-cyan-500/20 relative overflow-hidden">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-[11px] font-mono uppercase tracking-wider text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 mb-3">
              <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>{currentLang === 'ru' ? 'Кейсы и примеры' : 'Portfolio & Cases'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
              {service.casesPlaceholder.title[currentLang]}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              {service.casesPlaceholder.description[currentLang]}
            </p>
            <a
              href="https://t.me/ilyaarkovdotcom"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 hover:border-cyan-400 hover:text-white transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>
                {currentLang === 'ru' ? 'Запросить примеры в Telegram' : 'Request Examples on Telegram'}
              </span>
            </a>
          </div>
        </section>

        {/* Финальный CTA */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-cyan-950/30 via-slate-900/40 to-sky-950/30 border border-cyan-500/30 text-center relative overflow-hidden">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 tracking-tight">
            {currentLang === 'ru' ? 'Готовы обсудить вашу задачу?' : 'Ready to Discuss Your Project?'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mb-6">
            {currentLang === 'ru'
              ? 'Напишите мне, и мы обсудим детали, точные сроки и подберем оптимальный формат под ваш бюджет.'
              : 'Get in touch to review requirements, confirm precise deadlines, and align on budget.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={navigateToHomeContact}
              className="px-6 py-3 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{currentLang === 'ru' ? 'Заполнить заявку' : 'Submit Project Request'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="https://t.me/ilyaarkovdotcom"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl text-sm font-semibold text-slate-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-500/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4 text-cyan-400" />
              <span>Telegram</span>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};
