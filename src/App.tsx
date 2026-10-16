import React, { useState, useEffect } from 'react';
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
    </LanguageProvider>
  );
}