import React, { useLayoutEffect } from 'react';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation } from 'react-router';
import { LanguageProvider } from '../context/LanguageContext';
import '../index.css';

const FONTS_URL = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#06080c" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Илья Арьков" />
        <meta property="og:locale" content="ru_RU" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" as="image" href="/images/ilya.webp" type="image/webp" fetchPriority="high" />
        <link rel="stylesheet" href={FONTS_URL} media="print" onLoad={(event) => { event.currentTarget.media = 'all'; }} />
        <noscript>
          <link rel="stylesheet" href={FONTS_URL} />
        </noscript>
        <Meta />
        <Links />
      </head>
      <body className="bg-site text-slate-100 antialiased selection:bg-cyan-500/20 selection:text-cyan-200">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function ScrollRevealObserver({ routeKey }: { routeKey: string }) {
  useLayoutEffect(() => {
    const candidates = Array.from(document.querySelectorAll<HTMLElement>(
      'main section, main article, main .grid > div, main [class*="glass-panel"], main > div[class*="max-w-"] > div:not(.absolute), footer'
    )).filter((element) =>
      !element.closest('.hero-scene, [aria-hidden="true"]') &&
      !element.classList.contains('absolute')
    );

    if (!('IntersectionObserver' in window)) {
      candidates.forEach((element) => {
        element.dataset.scrollRevealState = 'visible';
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        (entry.target as HTMLElement).dataset.scrollRevealState = 'visible';
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -7% 0px',
    });

    candidates.forEach((element, index) => {
      const siblings = element.parentElement ? Array.from(element.parentElement.children) : [];
      const siblingIndex = Math.max(0, siblings.indexOf(element));
      const variant = element.tagName === 'SECTION' || element.tagName === 'FOOTER'
        ? 'section'
        : ['rise', 'soft', 'scale'][(siblingIndex + index) % 3];
      const rect = element.getBoundingClientRect();
      const inViewAtMount = rect.top < window.innerHeight && rect.bottom > 0;
      element.dataset.scrollReveal = variant;
      element.dataset.scrollRevealState = inViewAtMount ? 'visible' : 'pending';
      element.style.setProperty('--scroll-reveal-delay', `${Math.min(siblingIndex, 4) * 80}ms`);
      if (!inViewAtMount) observer.observe(element);
    });

    const settleInView = () => {
      candidates.forEach((element) => {
        if (element.dataset.scrollRevealState !== 'pending') return;
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          element.dataset.scrollRevealState = 'visible';
          observer.unobserve(element);
        }
      });
    };
    window.addEventListener('load', settleInView, { once: true });
    if (document.readyState === 'complete') settleInView();

    return () => {
      window.removeEventListener('load', settleInView);
      observer.disconnect();
    };
  }, [routeKey]);

  return null;
}

export default function App() {
  const { pathname } = useLocation();

  return (
    <LanguageProvider>
      <Outlet />
      <ScrollRevealObserver routeKey={pathname} />
    </LanguageProvider>
  );
}
