import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { UserCheck } from 'lucide-react';

export const About: React.FC = () => {
  const { t, lang } = useLanguage();
  const [imgError, setImgError] = useState(false);

  // Кастомные SVG иконки соцсетей для точного визуального соответствия брендам
  const socialIcons: Record<string, {
    icon: React.ReactNode;
    hoverClasses: string;
  }> = {
    Threads: {
      hoverClasses: 'hover:text-white hover:border-white/60 hover:bg-white/15 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M18.263 11.097c-.03-3.486-1.92-5.586-5.111-5.586-2.13 0-3.922.963-4.863 2.499l2.062 1.438c.535-.843 1.272-1.543 2.628-1.543 1.528 0 2.318.85 2.544 2.431a15 15 0 0 0-2.236-.173c-4.125 0-6.068 1.867-6.068 4.336s1.943 3.99 4.804 3.99c3.139 0 5.013-2.115 5.781-4.735.798.361 1.348 1.204 1.348 2.47 0 3.387-3.907 5.232-7.22 5.232-4.885 0-8.077-3.207-8.077-8.424 0-6.392 4.223-10.487 9.9-10.487 3.808 0 5.69 1.671 6.97 3.914l2.108-1.475C21.44 2.078 18.331 0 13.663 0 6.227 0 1.168 5.277 1.168 12.934c0 7 4.953 11.066 10.856 11.066 4.878 0 9.809-2.846 9.809-7.716 0-2.545-1.46-4.231-3.569-5.187m-6.33 4.855c-1.077 0-2.026-.512-2.026-1.453 0-1.483 1.822-1.934 3.606-1.934.678 0 1.34.045 1.927.173-.422 1.927-1.671 3.215-3.508 3.214Z" />
        </svg>
      ),
    },
    Instagram: {
      hoverClasses: 'hover:text-[#E4405F] hover:border-[#E4405F]/60 hover:bg-[#E4405F]/15 hover:shadow-[0_0_20px_rgba(228,64,95,0.4)]',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    // X: {
    //   hoverClasses: 'hover:text-white hover:border-white/60 hover:bg-white/15 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]',
    //   icon: (
    //     <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    //       <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    //     </svg>
    //   ),
    // },
    LinkedIn: {
      hoverClasses: 'hover:text-[#0A66C2] hover:border-[#0A66C2]/60 hover:bg-[#0A66C2]/15 hover:shadow-[0_0_20px_rgba(10,102,194,0.4)]',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      ),
    },
    GitHub: {
      hoverClasses: 'hover:text-white hover:border-white/60 hover:bg-white/15 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      ),
    },
    Telegram: {
      hoverClasses: 'hover:text-[#229ED9] hover:border-[#229ED9]/60 hover:bg-[#229ED9]/15 hover:shadow-[0_0_20px_rgba(34,158,217,0.4)]',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .34z" />
        </svg>
      ),
    },
  };

  return (
    <section id="about" className="py-20 lg:py-28 relative overflow-hidden bg-site z-10">
      <style>{`
        @keyframes morphDarkMatter {
          0%, 100% {
            border-radius: 60% 40% 70% 30% / 45% 60% 40% 55%;
          }
          34% {
            border-radius: 42% 58% 35% 65% / 60% 38% 62% 40%;
          }
          67% {
            border-radius: 68% 32% 55% 45% / 36% 64% 36% 64%;
          }
        }
        @keyframes darkMatterGlow {
          0%, 100% {
            transform: scale(1.03) rotate(0deg);
            opacity: 0.65;
          }
          50% {
            transform: scale(1.1) rotate(180deg);
            opacity: 0.95;
          }
        }
        .morph-frame {
          animation: morphDarkMatter 14s ease-in-out infinite alternate;
        }
        .morph-aura {
          animation: morphDarkMatter 18s ease-in-out infinite alternate-reverse;
        }
      `}</style>

      {/* Мягкие фоновые световые акценты */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-sky-600/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Заголовок секции */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight text-balance">
            {t.about.title}
          </h2>
        </div>

        {/* Главный блок: Фотография с эффектом темной материи (слева) + Авторский текст (справа) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 items-start mb-12 sm:mb-16">
          {/* Фото слева: органический изменяющийся контур «темная материя» без двойных коробок */}
          <div className="md:col-span-4 flex justify-center">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80">
              {/* Сияющий ореол темной материи вокруг контура */}
              <div className="morph-aura absolute -inset-2 bg-gradient-to-tr from-cyan-500/30 via-sky-500/20 to-blue-600/30 blur-xl pointer-events-none" />

              {/* Само фото в живой морфирующейся форме */}
              <div className="morph-frame relative w-full h-full overflow-hidden border-2 border-cyan-400/50 shadow-[0_0_35px_rgba(34,211,238,0.25)] bg-[#070b12] group">
                {!imgError ? (
                  <picture>
                    <source srcSet="/images/ilya.webp" type="image/webp" />
                    <img
                      src="/images/ilya.webp"
                      alt={lang === 'ru' ? 'Илья Арьков – Веб-разработчик' : 'Ilya Arkov – Web Developer'}
                      onError={() => setImgError(true)}
                      width={320}
                      height={320}
                      loading="eager"
                      fetchPriority="high"
                      decoding="sync"
                      className="w-full h-full object-cover object-top scale-105 group-hover:scale-110 transition-transform duration-700"
                    />
                  </picture>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-cyan-950/80 via-[#0a0f18] to-slate-900 text-cyan-300 p-4">
                    <UserCheck className="w-16 h-16 text-cyan-400/80 mb-2" />
                    <span className="text-sm font-semibold text-slate-300">
                      {lang === 'ru' ? 'Илья Арьков' : 'Ilya Arkov'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Текст справа: искреннее обращение без слопов и шаблонных списков */}
          <div className="md:col-span-8 space-y-4 text-slate-200 text-sm sm:text-base leading-relaxed">
            <p className="text-white font-semibold text-base sm:text-lg">
              {t.about.bioParagraph1}
            </p>
            <div>
              <h3 className="text-white font-semibold mb-2">{t.about.businessReasonsTitle}</h3>
              <ul className="list-disc pl-5 space-y-1 text-slate-300 [text-wrap:pretty]">
                {t.about.businessReasons.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">{t.about.businessNeedsTitle}</h3>
              <ul className="list-disc pl-5 space-y-1 text-slate-300 [text-wrap:pretty]">
                {t.about.businessNeeds.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <p className="text-slate-300 [text-wrap:pretty]">{t.about.bioParagraph2}</p>
            <p className="text-slate-300 [text-wrap:pretty]">{t.about.bioParagraph3}</p>
            <p className="text-cyan-300/90 font-medium pt-1 [text-wrap:pretty]">{t.about.bioParagraph4}</p>
          </div>
        </div>

        {/* Ссылки на соц. сети: круглые прозрачные/стеклянные иконки по центру ниже, окрашивающиеся в свои цвета при наведении */}
        <div className="flex flex-col items-center justify-center pt-2">
          <div className="flex items-center justify-center gap-3.5 sm:gap-4 flex-wrap">
            {t.about.socials.map((social, idx) => {
              const brand = socialIcons[social.name];
              if (!brand) return null;

              return (
                <a
                  key={idx}
                  href={social.url.startsWith('http') ? social.url : `https://${social.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-white/[0.03] backdrop-blur-md border border-white/10 text-slate-400 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer ${brand.hoverClasses}`}
                >
                  {brand.icon}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
