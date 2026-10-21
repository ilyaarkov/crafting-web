import React from 'react';
import { Header } from '../../components/Header';
import { Hero } from '../../components/Hero';
import { About } from '../../components/About';
import { Specialization } from '../../components/Specialization';
import { Process } from '../../components/Process';
import { Projects } from '../../components/Projects';
import { Pricing } from '../../components/Pricing';
import { Guarantees } from '../../components/Guarantees';
import { ContactForm } from '../../components/ContactForm';
import { Footer } from '../../components/Footer';
import { ScrollToTop } from '../../components/ScrollToTop';
import { seoMeta } from '../seo';

export function meta() {
  return seoMeta('/');
}

export default function HomeRoute() {
  return (
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
  );
}
