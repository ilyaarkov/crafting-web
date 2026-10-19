import React, { useState, useEffect, useLayoutEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
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
import { MobileLoader } from './components/MobileLoader';

type RouteState =
  | { type: 'home' }
  | { type: 'techstack' }
  | { type: 'portfolio' }
  | { type: 'project'; projectId: string }
  | { type: 'service'; serviceId: string };

function parseRoute(pathname: string): RouteState {
  const p = pathname.toLowerCase().replace(/\/+$/, '') || '/';

  if (
    p === '/techstack' ||
    p === '/tech-stack' ||
    p.startsWith('/techstack/') ||
    p.startsWith('/tech-stack/')
  ) {
    return { type: 'techstack' };
  }

  if (p === '/portfolio') {
    return { type: 'portfolio' };
  }

  const portfolioMatch = p.match(/^\/portfolio\/([^/]+)/);
  if (portfolioMatch) {
    return { type: 'project', projectId: portfolioMatch[1] };
  }

  const projectMatch = p.match(/^\/project\/([^/]+)/);
  if (projectMatch) {
    return { type: 'project', projectId: projectMatch[1] };
  }

  const serviceMatch = p.match(/^\/(?:services|service)\/([^/]+)/);
  if (serviceMatch) {
    return { type: 'service', serviceId: serviceMatch[1] };
  }

  return { type: 'home' };
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
      <MobileLoader />
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
      ) : (
        <div className="min-h-screen bg-[#06080c] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
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
