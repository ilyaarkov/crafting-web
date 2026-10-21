import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export function NotFound() {
  const { lang } = useLanguage();

  return (
    <main className="min-h-screen bg-site flex flex-col items-center justify-center px-6 text-center text-slate-100">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">404</p>
      <h1 className="mt-4 text-3xl sm:text-5xl font-bold">
        {lang === 'ru' ? 'Страница не найдена' : 'Page not found'}
      </h1>
      <a href="/" className="mt-8 inline-flex min-h-11 items-center rounded-full bg-cyan-400 px-6 font-semibold text-slate-950">
        {lang === 'ru' ? 'На главную' : 'Home'}
      </a>
    </main>
  );
}
