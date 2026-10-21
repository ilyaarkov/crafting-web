import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { MacBrowserFrame } from './MacBrowserFrame';
import { PROJECTS_DATA } from '../data/projectsData';

export const Projects: React.FC = () => {
  const { t, lang } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      return true;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const projects = (t.projects.items || []).slice(0, 4);

  const navigateTo = (url: string) => {
    window.history.pushState({}, '', url);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="py-16 sm:py-20 lg:py-24 relative overflow-hidden bg-site z-10"
    >
      {/* Деликатные фоновые ореолы */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-blue-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Шапка блока */}
        <div className="max-w-3xl mb-12 sm:mb-14">
          <div className="text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-2.5">
            <span>{t.projects.preTitle}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {t.projects.title}
          </h2>
        </div>

        {/* Сетка проектов 2x2: открытие по клику на фото с интерактивной надписью "ПОСМОТРЕТЬ" */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {projects.map((project, idx) => {
            const meta = PROJECTS_DATA[project.id];
            const imageSrc = meta?.previewImage || project.image;
            const projectHref = `/portfolio/${project.id}`;
            const handleProjectClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
              if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
              event.preventDefault();
              navigateTo(projectHref);
            };

            return (
              <div
                key={project.id}
                style={{
                  transitionDelay: `${idx * 120}ms`,
                }}
                className={`group flex flex-col justify-start transition-all duration-700 ease-out motion-reduce:transition-none pb-8 md:pb-0 border-b border-white/10 md:border-b-0 last:border-b-0 last:pb-0 ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
              >
                {/* Окно браузера в стиле macOS с фото: кликабельно, курсор-указатель, оверлей "ПОСМОТРЕТЬ" */}
                <a
                  href={projectHref}
                  onClick={handleProjectClick}
                  className="mb-4 sm:mb-5 block rounded-2xl overflow-hidden group-hover:shadow-[0_0_35px_rgba(34,211,238,0.25)] transition-all duration-300"
                >
                  <MacBrowserFrame
                    imageSrc={imageSrc}
                    imageAlt={project.title}
                    overlayText={lang === 'ru' ? 'ПОСМОТРЕТЬ' : 'VIEW'}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                  />
                </a>

                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  <a
                    href={projectHref}
                    onClick={handleProjectClick}
                    className="rounded-sm text-white hover:text-cyan-300 transition-colors"
                  >
                    {project.title}
                  </a>
                </h3>

                {/* Лаконичное описание проекта */}
                <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed mt-2.5">
                  {project.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Кнопка "Все проекты" для перехода на полный каталог */}
        <div className="mt-14 sm:mt-18 flex justify-center">
          <button
            onClick={() => navigateTo('/portfolio')}
            className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full border border-cyan-400/50 bg-gradient-to-r from-cyan-950/80 to-blue-950/80 text-sm font-semibold text-white overflow-hidden transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_25px_rgba(34,211,238,0.35)] cursor-pointer"
          >
            <span className="absolute inset-0 w-full h-full bg-cyan-400 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out rounded-full pointer-events-none" />
            <span className="relative z-10 transition-colors duration-300 group-hover:text-slate-950">
              {t.projects.allProjectsBtn || 'Все проекты'}
            </span>
            <ArrowRight className="relative z-10 w-4 h-4 transition-all duration-300 group-hover:text-slate-950 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Projects;