import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  ArrowLeft,
  ArrowRight,
  Globe,
  CheckCircle2,
  Send,
  Mail,
  Layers,
  Sparkles,
} from 'lucide-react';
import { MacBrowserFrame } from '../components/MacBrowserFrame';
import { PROJECTS_DATA } from '../data/projectsData';

interface ProjectDetailPageProps {
  projectId: string;
  onNavigatePortfolio: () => void;
  onNavigateHome: () => void;
}

const cosmicStars = [
  { top: '8%', left: '15%', size: '2px', opacity: '0.6', delay: '0s' },
  { top: '18%', left: '84%', size: '2.5px', opacity: '0.8', delay: '1s' },
  { top: '30%', left: '40%', size: '1.5px', opacity: '0.5', delay: '2s' },
  { top: '42%', left: '10%', size: '2px', opacity: '0.7', delay: '0.5s' },
  { top: '55%', left: '90%', size: '2px', opacity: '0.6', delay: '1.5s' },
  { top: '70%', left: '20%', size: '1.5px', opacity: '0.4', delay: '2.5s' },
  { top: '85%', left: '80%', size: '2.5px', opacity: '0.7', delay: '0.8s' },
];

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  projectId,
  onNavigatePortfolio,
  onNavigateHome,
}) => {
  const { t, lang, setLang } = useLanguage();

  const projects = t.projects.items || [];
  const project = projects.find((p) => p.id === projectId) || projects[0];
  const meta = PROJECTS_DATA[project?.id || ''] || {
    id: project?.id || '',
    previewImage: project?.image || '',
    screens: [project?.image || ''],
    mockupDomain: 'ilyaarkov.com',
  };

  const screens = meta.screens && meta.screens.length > 0 ? meta.screens : [meta.previewImage];
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);

  useEffect(() => {
    setActiveScreenIndex(0);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [projectId]);

  useEffect(() => {
    const origTitle = document.title;
    if (project) {
      document.title = `${project.title} – ${t.footer.name}`;
    }
    return () => {
      document.title = origTitle;
    };
  }, [project, t.footer.name]);

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

  if (!project) return null;

  return (
    <div className="min-h-screen bg-[#04060a] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* ========================================================= */}
      {/* HEADER НАВИГАЦИИ СТРАНИЦЫ ПРОЕКТА */}
      {/* ========================================================= */}
      <header className="sticky top-0 left-0 right-0 z-50 bg-site/85 backdrop-blur-xl border-b border-white/10 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          {/* Навигация назад в портфолио */}
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigatePortfolio}
              className="group relative inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full border border-white/15 bg-white/5 hover:border-cyan-400/40 text-xs sm:text-sm font-medium text-slate-200 hover:text-white transition-all overflow-hidden cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400 transition-transform group-hover:-translate-x-0.5" />
              <span>{lang === 'ru' ? 'Все проекты' : 'All Projects'}</span>
            </button>

            <button
              onClick={onNavigateHome}
              className="hidden md:inline-flex text-xs text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              / {t.footer.name}
            </button>
          </div>

          {/* Правая панель действий */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Переключатель языка */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-white/10 hover:border-cyan-400/40 bg-white/5 text-xs font-mono font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
              title={lang === 'ru' ? 'Switch to English' : 'Переключить на русский'}
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang.toUpperCase()}</span>
            </button>

            {/* CTA кнопка "Обсудить проект" */}
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
      {/* ОСНОВНОЙ КОНТЕНТ СТРАНИЦЫ ПРОЕКТА */}
      {/* ========================================================= */}
      <main className="flex-1 relative overflow-hidden">
        {/* Фоновые мягкие ореолы */}
        <div className="absolute top-10 left-1/4 w-[600px] h-[450px] bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-transparent blur-[140px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/2 right-1/4 w-[650px] h-[500px] bg-gradient-to-tl from-cyan-950/25 via-blue-950/20 to-transparent blur-[140px] rounded-full pointer-events-none -z-10" />

        {/* Космические звезды */}
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

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20 relative z-10">
          {/* Шапка проекта */}
          <div className="max-w-4xl mb-10 sm:mb-12">
            {project.tag && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/30 text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-4">
                <Layers className="w-3.5 h-3.5" />
                <span>{project.tag}</span>
              </div>
            )}
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              {project.title}
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl">
              {project.description}
            </p>
          </div>

          {/* Окно браузера Mac с текущим экраном без лишних внешних обёрток */}
          <div className="mb-6 rounded-2xl overflow-hidden shadow-2xl">
            <MacBrowserFrame
              imageSrc={screens[activeScreenIndex]}
              imageAlt={`${project.title} screen ${activeScreenIndex + 1}`}
              imageClassName="object-contain sm:object-cover"
            />
          </div>

          {/* Галерея экранов / миниатюры (если экранов больше одного) */}
          {screens.length > 1 && (
            <div className="mb-14 sm:mb-18">
              <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
                <span className="font-mono text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {lang === 'ru' ? 'Все экраны проекта' : 'All Project Screens'} ({screens.length})
                </span>
                <span>
                  {lang === 'ru' ? 'Нажмите на экран для просмотра' : 'Click screen to inspect'}
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
                {screens.map((screen, sIdx) => {
                  const isCurrent = sIdx === activeScreenIndex;
                  return (
                    <button
                      key={sIdx}
                      onClick={() => setActiveScreenIndex(sIdx)}
                      className={`relative rounded-xl overflow-hidden aspect-[16/10] border transition-all cursor-pointer ${
                        isCurrent
                          ? 'border-cyan-400 ring-2 ring-cyan-400/40 shadow-[0_0_20px_rgba(34,211,238,0.4)] scale-105'
                          : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={screen}
                        alt={`Thumbnail ${sIdx + 1}`}
                        className="w-full h-full object-cover object-top"
                      />
                      <span className="absolute bottom-1 right-1.5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/70 text-slate-200">
                        {sIdx + 1}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Детальный обзор: две колонки (контекст + чек-лист выполненных работ) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-10">
            {/* Левая колонка: описание задачи и решения */}
            <div className="lg:col-span-7 space-y-6">
              <div className="rounded-3xl p-6 sm:p-8 border border-white/10 bg-[#070b13]/80 backdrop-blur-xl">
                <h3 className="text-xl font-bold text-white mb-4 tracking-tight">
                  {lang === 'ru' ? 'О проекте и задачах' : 'About the Project'}
                </h3>
                {(project.paragraphs || [project.p2, project.p3].filter(Boolean)).map((paragraph, index) => (
                  <p key={index} className={`text-sm sm:text-base text-slate-300 leading-relaxed [text-wrap:balance] ${index ? 'mt-4' : ''}`}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Правая колонка: что конкретно сделано */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl p-6 sm:p-8 border border-cyan-500/20 bg-cyan-950/15 backdrop-blur-xl">
                <h3 className="text-xl font-bold text-white mb-4 tracking-tight flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                  <span>{project.whatDoneTitle || (lang === 'ru' ? 'Что сделано:' : 'Delivered:')}</span>
                </h3>

                <ul className="space-y-3">
                  {project.whatDoneList.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 leading-relaxed"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Финальный призыв к действию */}
          <div className="mt-14 p-6 sm:p-8 rounded-3xl border border-cyan-500/25 bg-cyan-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5">
                {lang === 'ru' ? 'Понравился этот проект?' : 'Liked this project?'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                {lang === 'ru'
                  ? 'Можем разработать похожий сайт под специфику вашего бизнеса – с чистым дизайном, быстрой загрузкой и прозрачной ценой.'
                  : 'We can develop a tailored website for your unique brand – with clean design, high performance, and fixed pricing.'}
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
                onClick={onNavigatePortfolio}
                className="hover:text-cyan-400 transition-colors cursor-pointer"
              >
                {lang === 'ru' ? 'Все проекты' : 'All Projects'}
              </button>

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

export default ProjectDetailPage;
