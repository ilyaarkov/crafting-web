import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  ArrowRight,
  Building2,
  Contact,
  FileText,
  LayoutTemplate,
  ShoppingBag,
} from 'lucide-react';
import { ParallaxStarfield } from './ParallaxStarfield';

const formatIcons = [Contact, FileText, Building2, LayoutTemplate, ShoppingBag];

export const Specialization: React.FC = () => {
  const { t, lang } = useLanguage();
  const formats = t.specialization.formats;
  const [activeFormat, setActiveFormat] = useState(0);
  const formatRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;

    const updateActiveFormat = () => {
      const centerLine = window.innerHeight * 0.46;
      let closestIndex = -1;
      let closestDistance = Infinity;

      formatRefs.current.forEach((element, index) => {
        if (!element) return;
        const rect = element.getBoundingClientRect();
        if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;
        const distance = Math.abs(rect.top + rect.height / 2 - centerLine);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      if (closestIndex >= 0) setActiveFormat(closestIndex);
    };

    const observer = new IntersectionObserver(updateActiveFormat, {
      rootMargin: '-12% 0px -28% 0px',
      threshold: [0, 0.15, 0.35, 0.6],
    });

    formatRefs.current.forEach((element) => element && observer.observe(element));
    updateActiveFormat();

    return () => observer.disconnect();
  }, [formats]);

  const handleScrollTo = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const element = document.getElementById(id);
    if (!element) return;

    const top = element.getBoundingClientRect().top + window.scrollY - 112;
    window.scrollTo({
      top,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  };

  const contactLabel = lang === 'ru' ? 'Обсудить задачу' : 'Discuss your project';
  const navLabel = lang === 'ru' ? 'Форматы сайтов' : 'Website formats';

  return (
    <section id="specialization" className="relative isolate overflow-hidden bg-site py-20 sm:py-24 lg:py-32">
      <ParallaxStarfield seed={61} constellations={1} fadeTop={8} fadeBottom={10} />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(250px,0.8fr)_minmax(0,1.35fr)] lg:gap-16 xl:gap-24">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="mb-4 text-3xl font-black leading-tight tracking-tight text-white text-balance sm:text-4xl lg:text-5xl">
            {t.specialization.title}
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-slate-300 text-balance sm:text-base">
            {t.specialization.subtitle}
          </p>

          <nav aria-label={navLabel} className="relative mt-9 hidden lg:block">
            <div className="absolute bottom-4 left-[7px] top-4 w-px bg-white/10" aria-hidden="true" />
            <div
              className="absolute left-[4px] top-[18px] h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.9)] transition-transform duration-500 ease-out motion-reduce:transition-none"
              style={{ transform: `translateY(${activeFormat * 52}px)` }}
              aria-hidden="true"
            />
            <ul className="space-y-1">
              {formats.map((format, index) => (
                <li key={format.id}>
                  <a
                    href={`#format-${format.id}`}
                    onClick={(event) => handleScrollTo(event, `format-${format.id}`)}
                    aria-current={activeFormat === index ? 'location' : undefined}
                    className={`flex min-h-11 items-center pl-8 pr-2 text-sm transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 ${
                      activeFormat === index ? 'text-white' : 'text-slate-500 hover:text-slate-200'
                    }`}
                  >
                    {format.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div>
          <div className="divide-y divide-white/10">
            {formats.map((format, index) => {
              const Icon = formatIcons[index] ?? FileText;
              const isActive = activeFormat === index;

              return (
                <article
                  key={format.id}
                  id={`format-${format.id}`}
                  ref={(element) => {
                    formatRefs.current[index] = element;
                  }}
                  className="group scroll-mt-28 py-7 sm:py-9 lg:flex lg:min-h-[220px] lg:items-center lg:py-10"
                >
                  <div className="flex items-start gap-5 sm:gap-7">
                    <div
                      className={`relative mt-1 flex h-12 w-12 shrink-0 items-center justify-center transition-all duration-500 ease-out motion-reduce:transition-none sm:h-14 sm:w-14 ${
                        isActive ? 'scale-100 text-cyan-200' : 'scale-95 text-slate-500 group-hover:text-slate-300'
                      }`}
                    >
                      <div
                        className={`absolute inset-0 rounded-full border transition-all duration-500 motion-reduce:transition-none ${
                          isActive ? 'rotate-45 border-cyan-300/40' : 'rotate-0 border-white/10'
                        }`}
                        aria-hidden="true"
                      />
                      <Icon className="relative h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.5} aria-hidden="true" />
                    </div>

                    <div className="max-w-2xl pt-0.5">
                      <h3
                        className={`text-xl font-bold leading-snug tracking-tight transition-colors duration-300 sm:text-2xl lg:text-3xl ${
                          isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'
                        }`}
                      >
                        {format.title}
                      </h3>
                      <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-slate-400 transition-colors duration-300 group-hover:text-slate-300 sm:mt-3 sm:text-base">
                        {format.description}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-7 border-t border-white/10 pt-7 sm:mt-9 sm:pt-9">
            <a
              href="#contact"
              onClick={(event) => handleScrollTo(event, 'contact')}
              className="group relative inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
            >
              <span className="absolute inset-0 rounded-full bg-white -translate-x-full transition-transform duration-300 ease-out group-hover:translate-x-0 pointer-events-none" />
              <span className="relative z-10 flex items-center gap-2 transition-colors duration-300 group-hover:text-slate-950">
                <span>{t.specialization.orderCta || contactLabel}</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Specialization;
