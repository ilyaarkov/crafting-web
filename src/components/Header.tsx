import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Menu, X, ArrowUpRight, Globe } from 'lucide-react';

export const Header: React.FC = () => {
  const { lang, setLang, t } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);
  const [hasTouchScreen, setHasTouchScreen] = useState(() =>
    typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0
  );
  const lastScrollY = useRef(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const updateTouchCapability = () => {
      setHasTouchScreen(navigator.maxTouchPoints > 0);
    };

    updateTouchCapability();
    window.addEventListener('pointerdown', updateTouchCapability, { once: true, passive: true });
    return () => window.removeEventListener('pointerdown', updateTouchCapability);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setHasScrolled(currentScrollY > 20);

      if (hasTouchScreen) {
        setIsVisible(true);
      } else {
        if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
          setIsVisible(false);
          setMobileMenuOpen(false);
        } else {
          setIsVisible(true);
        }
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasTouchScreen]);

  const toggleLanguage = () => {
    setLang(lang === 'ru' ? 'en' : 'ru');
  };

  const navItems = [
    { label: t.header.nav.about, href: '#about' },
    { label: t.header.nav.process, href: '#process' },
    { label: t.header.nav.projects, href: '#projects' },
    { label: t.header.nav.pricing, href: '#pricing' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 transform ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${hasScrolled ? 'pt-3 pb-2' : 'pt-5 pb-3'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          className={`flex items-center justify-between px-4 sm:px-6 py-3 rounded-full transition-all duration-300 ${
            hasScrolled
              ? 'glass-pill shadow-2xl shadow-cyan-950/20'
              : 'bg-[#0b0e14]/70 backdrop-blur-md border border-white/5'
          }`}
        >
          {/* Brand Wordmark */}
          <a
            href="#"
            className="flex items-center gap-2 group text-base sm:text-lg font-bold tracking-tight text-white hover:text-cyan-400 transition-colors whitespace-nowrap"
          >
            <span>{t.header.name}</span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs xl:text-sm font-medium text-slate-300">
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="hover:text-white transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[2px] after:bg-cyan-400 after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-200"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Actions: Language Switcher + CTA */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              aria-label="Switch Language"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span className={lang === 'ru' ? 'text-cyan-300' : 'text-slate-400'}>RU</span>
              <span className="text-slate-600">/</span>
              <span className={lang === 'en' ? 'text-cyan-300' : 'text-slate-400'}>EN</span>
            </button>

            {/* Primary Action Button */}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="relative group overflow-hidden hidden sm:inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-slate-950 bg-cyan-400 transition-colors duration-300 active:scale-[0.98] whitespace-nowrap cursor-pointer"
            >
              {/* Эффект смены цвета слева направо с тем же border-radius */}
              <span className="absolute inset-0 bg-white rounded-full -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out pointer-events-none" />
              <span className="relative z-10 flex items-center gap-1.5">
                <span>{t.header.cta}</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </a>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full bg-white/5 text-slate-300 hover:text-white border border-white/10"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 p-5 rounded-2xl glass-panel border border-white/10 shadow-2xl flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-200">
            <nav className="flex flex-col gap-3">
              {navItems.map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="px-3 py-2 text-sm font-medium text-slate-200 hover:text-cyan-400 hover:bg-white/5 rounded-lg transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="pt-3 border-t border-white/10 flex flex-col gap-3">
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, '#contact')}
                className="relative group overflow-hidden w-full py-2.5 px-4 rounded-full text-center text-sm font-bold text-slate-950 bg-cyan-400 transition-colors duration-300 active:scale-[0.98]"
              >
                <span className="absolute inset-0 bg-white rounded-full -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out pointer-events-none" />
                <span className="relative z-10 flex items-center justify-center gap-1.5">
                  <span>{t.header.cta}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};