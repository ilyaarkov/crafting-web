import React, { useState, useEffect, useLayoutEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Specialization } from './components/Specialization';
import { Process } from './components/Process';
import { Projects } from './components/Projects';
import { Pricing } from './components/Pricing';
import { Guarantees } from './components/Guarantees';
import { ContactForm } from './components/ContactForm';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { TechStackPage } from './pages/TechStackPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { SERVICES_DATA } from './data/servicesData';
import { PROJECTS_DATA } from './data/projectsData';

type RouteState =
  | { type: 'home' }
  | { type: 'techstack' }
  | { type: 'portfolio' }
  | { type: 'policy' }
  | { type: 'project'; projectId: string }
  | { type: 'service'; serviceId: string }
  | { type: 'notFound' };

function parseRoute(pathname: string): RouteState {
  const p = pathname.toLowerCase().replace(/\/+$/, '') || '/';

  if (p === '/techstack' || p === '/tech-stack') {
    return { type: 'techstack' };
  }

  if (p === '/policy') return { type: 'policy' };

  if (p === '/portfolio') {
    return { type: 'portfolio' };
  }

  const portfolioMatch = p.match(/^\/portfolio\/([^/]+)$/);
  if (portfolioMatch && PROJECTS_DATA[portfolioMatch[1]]) {
    return { type: 'project', projectId: portfolioMatch[1] };
  }

  const projectMatch = p.match(/^\/project\/([^/]+)$/);
  if (projectMatch && PROJECTS_DATA[projectMatch[1]]) {
    return { type: 'project', projectId: projectMatch[1] };
  }

  const serviceMatch = p.match(/^\/(?:services|service)\/([^/]+)$/);
  if (serviceMatch && SERVICES_DATA[serviceMatch[1]]) {
    return { type: 'service', serviceId: serviceMatch[1] };
  }

  return p === '/' ? { type: 'home' } : { type: 'notFound' };
}

function PageMetadata({ route }: { route: RouteState }) {
  const { t, lang } = useLanguage();

  useEffect(() => {
    const project = route.type === 'project'
      ? t.projects.items.find((item) => item.id === route.projectId)
      : undefined;
    const projectMeta = route.type === 'project' ? PROJECTS_DATA[route.projectId] : undefined;
    const service = route.type === 'service' ? SERVICES_DATA[route.serviceId] : undefined;
    const titles: Record<RouteState['type'], string> = {
      home: `${t.header.name} – ${lang === 'ru' ? 'Разработка сайтов для экспертов и бизнеса' : 'Web Development for Experts and Businesses'}`,
      techstack: `${lang === 'ru' ? 'Стек технологий' : 'Tech Stack'} – ${t.header.name}`,
      portfolio: `${t.projects.title} – ${t.header.name}`,
      policy: `${t.privacyModal.title} – ${t.header.name}`,
      project: `${project?.title || t.projects.title} – ${t.header.name}`,
      service: `${service?.title[lang] || t.header.name} – ${t.header.name}`,
      notFound: `${lang === 'ru' ? 'Страница не найдена' : 'Page not found'} – ${t.header.name}`,
    };
    const descriptions: Record<RouteState['type'], string> = {
      home: t.hero.description,
      techstack: lang === 'ru'
        ? 'Технологии и инструменты, которые я использую для разработки современных сайтов.'
        : 'The technologies and tools I use to build modern websites.',
      portfolio: lang === 'ru'
        ? 'Реализованные сайты и подробные описания проектов.'
        : 'Selected websites and detailed project case studies.',
      policy: t.privacyModal.p1,
      project: project?.description || t.projects.title,
      service: service?.subtitle[lang] || t.header.name,
      notFound: lang === 'ru' ? 'Запрошенная страница не найдена.' : 'The requested page could not be found.',
    };
    const canonicalPaths: Record<RouteState['type'], string> = {
      home: '/',
      techstack: '/techstack',
      portfolio: '/portfolio',
      policy: '/policy',
      project: route.type === 'project' ? `/portfolio/${route.projectId}` : '/portfolio',
      service: route.type === 'service' ? `/services/${route.serviceId}` : '/services',
      notFound: window.location.pathname,
    };
    const title = titles[route.type];
    const description = descriptions[route.type];
    const canonical = `https://ilyaarkov.com${canonicalPaths[route.type]}`;

    document.title = title;
    document.documentElement.lang = lang;

    const setMeta = (selector: string, attribute: 'name' | 'property', key: string, content: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.append(element);
      }
      element.content = content;
    };

    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonical);
    const socialImage = projectMeta?.previewImage
      ? `https://ilyaarkov.com${projectMeta.previewImage}`
      : 'https://ilyaarkov.com/images/og-preview.png';
    setMeta('meta[property="og:image"]', 'property', 'og:image', socialImage);
    setMeta('meta[property="og:image:alt"]', 'property', 'og:image:alt', title);
    const hasProjectImage = Boolean(projectMeta?.previewImage);
    setMeta('meta[property="og:image:type"]', 'property', 'og:image:type', hasProjectImage ? 'image/webp' : 'image/png');
    if (hasProjectImage) {
      document.head.querySelector('meta[property="og:image:width"]')?.remove();
      document.head.querySelector('meta[property="og:image:height"]')?.remove();
    } else {
      setMeta('meta[property="og:image:width"]', 'property', 'og:image:width', '1249');
      setMeta('meta[property="og:image:height"]', 'property', 'og:image:height', '768');
    }
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', socialImage);
    if (route.type === 'notFound') {
      setMeta('meta[name="robots"]', 'name', 'robots', 'noindex, nofollow');
    } else {
      document.head.querySelector('meta[name="robots"]')?.remove();
    }

    let canonicalLink = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.append(canonicalLink);
    }
    canonicalLink.href = canonical;
  }, [route, t, lang]);

  return null;
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
      element.dataset.scrollReveal = variant;
      element.dataset.scrollRevealState = 'pending';
      element.style.setProperty('--scroll-reveal-delay', `${Math.min(siblingIndex, 4) * 80}ms`);
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [routeKey]);

  return null;
}

function NotFoundPage() {
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

export default function App() {
  const [route, setRoute] = useState<RouteState>(() =>
    parseRoute(typeof window !== 'undefined' ? window.location.pathname : '/')
  );

  useEffect(() => {
    const handlePopState = () => {
      setRoute(parseRoute(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (url: string) => {
    window.history.pushState({}, '', url);
    setRoute(parseRoute(url));
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const navigateHome = () => navigateTo('/');
  const navigatePortfolio = () => navigateTo('/portfolio');
  const navigateProject = (id: string) => navigateTo(`/portfolio/${id}`);
  const revealRouteKey = route.type === 'project'
    ? `${route.type}:${route.projectId}`
    : route.type === 'service'
      ? `${route.type}:${route.serviceId}`
      : route.type;

  return (
    <LanguageProvider>
      <PageMetadata route={route} />
      {route.type === 'techstack' ? (
        <TechStackPage onNavigateHome={navigateHome} />
      ) : route.type === 'portfolio' ? (
        <PortfolioPage
          onNavigateHome={navigateHome}
          onNavigateProject={navigateProject}
        />
      ) : route.type === 'service' ? (
        <ServiceDetailPage
          serviceId={route.serviceId}
          onNavigateHome={navigateHome}
        />
      ) : route.type === 'project' ? (
        <ProjectDetailPage
          projectId={route.projectId}
          onNavigatePortfolio={navigatePortfolio}
          onNavigateHome={navigateHome}
        />
      ) : route.type === 'policy' ? (
        <PrivacyPolicyPage onNavigateHome={navigateHome} />
      ) : route.type === 'notFound' ? (
        <NotFoundPage />
      ) : (
        <div className="min-h-screen bg-site text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
          <Header />
          <main className="flex-1">
            <Hero />
            <About />
            <Specialization />
            <Process />
            <Projects />
            <Pricing />
            <Guarantees />
            <ContactForm />
          </main>
          <Footer />
          <ScrollToTop />
        </div>
      )}
      <ScrollRevealObserver routeKey={revealRouteKey} />
    </LanguageProvider>
  );
}
