import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ScrollToTop: React.FC = () => {
  const { lang } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Появляется как только пользователь проскроллил Hero (блок Обо мне)
      if (window.scrollY > 380) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label={lang === 'ru' ? 'Вернуться наверх' : 'Scroll to top'}
      title={lang === 'ru' ? 'Наверх' : 'Back to top'}
      className={`fixed bottom-6 right-6 z-40 p-3.5 rounded-full glass-panel border border-cyan-500/30 text-cyan-300 hover:text-white bg-[#0a0f18]/90 hover:bg-cyan-500/20 shadow-xl shadow-cyan-950/60 hover:shadow-cyan-500/30 transition-all duration-300 motion-reduce:transition-none transform cursor-pointer group ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-6 pointer-events-none'
      }`}
    >
      <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
    </button>
  );
};

export default ScrollToTop;