import React, { useEffect } from 'react';
import { ArrowLeft, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface PrivacyPolicyPageProps {
  onNavigateHome: () => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigateHome }) => {
  const { t, lang, setLang } = useLanguage();
  const paragraphs = [
    t.privacyModal.p1,
    t.privacyModal.p2,
    t.privacyModal.p3,
    t.privacyModal.p4,
    t.privacyModal.p5,
    t.privacyModal.p6,
    t.privacyModal.p7,
    t.privacyModal.p8,
    t.privacyModal.p9,
    t.privacyModal.p10,
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen bg-site text-slate-100 font-sans">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#070a10]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-medium text-slate-200 transition-colors hover:text-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
          >
            <ArrowLeft className="h-4 w-4 text-cyan-300" />
            <span>{lang === 'ru' ? 'На главную' : 'Back to home'}</span>
          </button>
          <button
            type="button"
            onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')}
            aria-label={lang === 'ru' ? 'Switch language to English' : 'Переключить язык на русский'}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 px-3 text-sm font-semibold text-slate-300 transition-colors hover:border-cyan-300/40 hover:text-white"
          >
            <Globe className="h-4 w-4 text-cyan-300" />
            {lang.toUpperCase()}
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8 sm:py-20">
        <article>
          <h1 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            {t.privacyModal.title}
          </h1>
          <div className="mt-8 space-y-5 text-[15px] leading-7 text-slate-300 sm:mt-10 sm:text-base">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          <a
            href="/"
            onClick={(event) => {
              event.preventDefault();
              onNavigateHome();
            }}
            className="mt-10 inline-flex min-h-11 items-center justify-center rounded-full bg-cyan-400 px-6 text-sm font-bold text-slate-950 transition-colors hover:bg-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
          >
            {lang === 'ru' ? 'Вернуться на главную' : 'Return to home'}
          </a>
        </article>
      </main>
    </div>
  );
};

