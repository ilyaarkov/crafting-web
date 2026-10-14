import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  ArrowLeft,
  ArrowRight,
  Globe,
  Briefcase,
  Layers,
  Smartphone,
  UserCheck,
  Send,
  Mail,
} from 'lucide-react';
import { MacBrowserFrame } from '../components/MacBrowserFrame';
import { PROJECTS_DATA } from '../data/projectsData';

interface PortfolioPageProps {
  onNavigateHome: () => void;
  onNavigateProject: (id: string) => void;
}

const cosmicStars = [
  { top: '7%', left: '10%', size: '2px', opacity: '0.6', delay: '0s' },
  { top: '16%', left: '88%', size: '2.5px', opacity: '0.8', delay: '1s' },
  { top: '28%', left: '46%', size: '1.5px', opacity: '0.5', delay: '2s' },
  { top: '39%', left: '7%', size: '2px', opacity: '0.7', delay: '0.5s' },
  { top: '52%', left: '94%', size: '2px', opacity: '0.6', delay: '1.5s' },
  { top: '65%', left: '16%', size: '1.5px', opacity: '0.4', delay: '2.5s' },
  { top: '74%', left: '82%', size: '2.5px', opacity: '0.7', delay: '0.8s' },
  { top: '86%', left: '11%', size: '2px', opacity: '0.8', delay: '1.2s' },
];

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  onNavigateHome,
  onNavigateProject,
}) => {
  const { t, lang, setLang } = useLanguage();

  useEffect(() => {
    const origTitle = document.title;
    document.title = lang === 'ru' ? 'Портфолио – Илья Арьков' : 'Portfolio – Ilya Arkov';
    window.scrollTo({ top: 0, behavior: 'instant' });
    return () => {
      document.title = origTitle;
    };
  }, [lang]);

  const toggleLanguage = () => {
    setLang(lang === 'ru' ? 'en' : 'ru');
  };

  const projects = t.projects.items || [];

  const navigateToHomeContact = () => {
    onNavigateHome();
    setTimeout(() => {
      const el = document.querySelector('#contact');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#04060a] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* ========================================================= */}
      {/* HEADER НАВИГАЦИИ СТРАНИЦЫ ПОРТФОЛИО */}
      {/* ========================================================= */}
      <header className="sticky top-0 left-0 right-0 z-50 bg-[#06080c]/85 backdrop-blur-xl border-b border-white/10 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          {/* Бренд */}
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 group cursor-pointer text-left"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] transition-transform group-hover:scale-125" />
            <span className="text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
              {t.footer.name}
            </span>
            <span className="hidden sm:inline-block text-xs font-mono text-slate-500 ml-2 py-0.5 px-2 rounded-full border border-white/10 bg-white/[0.03]">
              /portfolio
            </span>
          </button>

          {/* Правая панель действий */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Кнопка "На главную" */}
            <button
              onClick={onNavigateHome}
              className="group relative inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full border border-white/15 bg-white/5 hover:border-cyan-400/40 text-xs sm:text-sm font-medium text-slate-200 hover:text-white transition-all overflow-hidden cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400 transition-transform group-hover:-translate-x-0.5" />
              <span>{lang === 'ru' ? 'На главную' : 'Back to Home'}</span>
            </button>

            {/* Переключатель языка */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-white/10 hover:border-cyan-400/40 bg-white/5 text-xs font-mono font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
              title={lang === 'ru' ? 'Switch to English' : 'Переключить на русский'}
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang.toUpperCase()}</span>
            </button>

            {/* CTA кнопка "Обсудить проект" с фирменным стилем hover */}
            <button
              onClick={navigateToHomeContact}
              className="group relative hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-cyan-400/40 bg-gradient-to-r from-cyan-950/70 to-blue-950/70 text-xs sm:text-sm font-semibold text-white overflow-hidden transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] cursor-pointer"
            >
              <span className="absolute inset-0 w-full h-full bg-cyan-400 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out rounded-full pointer-events-none" />
              <span className="relative z-10 transition-colors duration-300 group-hover:text-slate-950">
                {t.header.cta}
              </span>
              <ArrowRight className="relative z-10 w-4 h-4 transition-all duration-300 group-hover:text-slate-950 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* ОСНОВНОЙ КОНТЕНТ СТРАНИЦЫ ПОРТФОЛИО */}
      {/* ========================================================= */}
      <main className="flex-1 relative overflow-hidden">
        {/* Фоновые мягкие ореолы */}
        <div className="absolute top-10 left-1/4 w-[600px] h-[450px] bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-transparent blur-[140px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/2 right-1/4 w-[650px] h-[500px] bg-gradient-to-tl from-cyan-950/25 via-blue-950/20 to-transparent blur-[140px] rounded-full pointer-events-none -z-10" />
        <div className="absolute bottom-10 left-1/3 w-[700px] h-[400px] bg-sky-900/10 blur-[160px] rounded-full pointer-events-none -z-10" />

        {/* Космические мерцающие звезды */}
        <div className="absolute inset-0 pointer-events-none -z-10">
          {cosmicStars.map((star, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-cyan-200 animate-pulse"
              style={{
                top: star.top,
                left: star.left,
                width: star.size,
                height: star.size,
                opacity: star.opacity,
                animationDelay: star.delay,
                animationDuration: '3s',
                boxShadow: `0 0 6px 1px rgba(165, 243, 252, ${star.opacity})`,
              }}
            />
          ))}
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 lg:py-24 relative z-10">
          {/* Верхний заголовочный блок */}
          <div className="max-w-3xl mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/30 text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-4">
              <Briefcase className="w-3.5 h-3.5" />
              <span>{t.projects.preTitle}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-5">
              {t.projects.title}
            </h1>
            <p className="text-slate-300 text-base sm:text-xl leading-relaxed">
              {lang === 'ru'
                ? 'Реализованные сайты с понятной структурой, высокой скоростью загрузки и индивидуальным стилем. Ниже представлены ключевые проекты – каждый можно открыть и изучить подробно.'
                : 'Implemented websites featuring transparent structure, high loading speeds, and bespoke aesthetics. Explore key featured projects in detail below.'}
            </p>
          </div>

          {/* Сетка проектов (2 на 2) без двойных рамок */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {projects.map((project) => {
              const meta = PROJECTS_DATA[project.id];
              const imageSrc = meta?.previewImage || project.image;

              return (
                <div
                  key={project.id}
                  className="group flex flex-col justify-start transition-all duration-300 pb-8 md:pb-0 border-b border-white/10 md:border-b-0 last:border-b-0 last:pb-0"
                >
                  {/* Окно браузера в стиле macOS с фото: кликабельно, курсор-указатель, оверлей "ПОСМОТРЕТЬ" */}
                  <div
                    onClick={() => onNavigateProject(project.id)}
                    className="mb-4 sm:mb-5 rounded-2xl overflow-hidden group-hover:shadow-[0_0_35px_rgba(34,211,238,0.25)] transition-all duration-300 cursor-pointer"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        onNavigateProject(project.id);
                      }
                    }}
                  >
                    <MacBrowserFrame
                      imageSrc={imageSrc}
                      imageAlt={project.title}
                      overlayText={lang === 'ru' ? 'ПОСМОТРЕТЬ' : 'VIEW'}
                    />
                  </div>

                  {/* Заголовок проекта (также кликабелен) */}
                  <h3
                    onClick={() => onNavigateProject(project.id)}
                    className="text-xl sm:text-2xl font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    {project.title}
                  </h3>

                  {/* Лаконичное описание проекта */}
                  <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed mt-2.5">
                    {project.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Инженерные стандарты разработки */}
          <div className="mt-14 sm:mt-18 grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl border border-white/10 bg-[#070b13]/70 backdrop-blur-lg">
              <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">
                {lang === 'ru' ? 'Индивидуальный дизайн' : 'Bespoke Design'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {lang === 'ru'
                  ? 'Каждый проект проектируется под сферу клиента, подчеркивая индивидуальность и закрывая конкретные бизнес-задачи.'
                  : 'Every project is built specifically around your niche, elevating your brand and converting visitors into loyal clients.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-[#070b13]/70 backdrop-blur-lg">
              <div className="w-9 h-9 rounded-xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
                <Smartphone className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">
                {lang === 'ru' ? 'Адаптивность для всех экранов' : 'Mobile-First Perfection'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {lang === 'ru'
                  ? 'Сайты безупречно открываются на любых смартфонах, планшетах и мониторах с высокой скоростью отклика.'
                  : 'Pixel-perfect responsiveness across phones, tablets, and high-res desktop displays with instant interactivity.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-[#070b13]/70 backdrop-blur-lg">
              <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mb-4">
                <UserCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">
                {lang === 'ru' ? 'Прямая связь с разработчиком' : 'Direct Developer Access'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {lang === 'ru'
                  ? 'Работаем без испорченного телефона и агентских менеджеров – быстро согласовываем правки и запускаем проект в срок.'
                  : 'Direct collaboration without intermediaries, ensuring prompt turnaround and transparent execution.'}
              </p>
            </div>
          </div>

          {/* Финальный призыв к действию */}
          <div className="mt-10 p-6 sm:p-8 rounded-3xl border border-cyan-500/25 bg-cyan-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5">
                {lang === 'ru' ? 'Хотите такой же сайт для вашего дела?' : 'Ready to build a website for your business?'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                {lang === 'ru'
                  ? 'Обсудим задачи, подберем структуру и зафиксируем точные сроки и стоимость разработки.'
                  : 'Let’s discuss your goals, define the right structure, and lock in transparent pricing and timelines.'}
              </p>
            </div>

            <button
              onClick={navigateToHomeContact}
              className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-full border border-cyan-400/50 bg-cyan-500/10 text-xs sm:text-sm font-semibold text-white overflow-hidden transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] shrink-0 cursor-pointer"
            >
              <span className="absolute inset-0 w-full h-full bg-cyan-400 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out rounded-full pointer-events-none" />
              <span className="relative z-10 transition-colors duration-300 group-hover:text-slate-950">
                {t.header.cta}
              </span>
              <ArrowRight className="relative z-10 w-4 h-4 transition-all duration-300 group-hover:text-slate-950 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </main>

      {/* ========================================================= */}
      {/* FOOTER СТРАНИЦЫ */}
      {/* ========================================================= */}
      <footer className="py-12 border-t border-white/10 relative bg-[#040609]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-base font-bold text-white tracking-tight">
                {t.footer.name}
              </span>
              <span className="text-xs text-slate-500 ml-2">
                &bull; {lang === 'ru' ? 'Веб-разработка' : 'Web Development'}
              </span>
            </div>

            <div className="flex items-center gap-5 text-sm text-slate-400">
              <button
                onClick={onNavigateHome}
                className="hover:text-cyan-400 transition-colors cursor-pointer"
              >
                {lang === 'ru' ? 'На главную' : 'Home'}
              </button>

              <a
                href="https://t.me/ilyaarkovdotcom"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-cyan-400" />
                <span>Telegram</span>
              </a>

              <a
                href="mailto:hello@ilyaarkov.com"
                className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>hello@ilyaarkov.com</span>
              </a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 text-center sm:text-left text-xs text-slate-500">
            {t.footer.copyright}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PortfolioPage;
