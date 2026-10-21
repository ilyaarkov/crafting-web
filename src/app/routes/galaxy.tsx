// TEMP (test/galaxy-page): standalone galaxy for screen recording
import React from 'react';
import GalaxyHero from '../../components/GalaxyHero';

export default function GalaxyPageRoute() {
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#010204', overflow: 'hidden' }}>
      <style>{`
        .galaxy-hero__vignette { display: none !important; }
        .galaxy-hero__canvas-wrap { inset: 0 !important; opacity: 1 !important; }
      `}</style>
      <React.Suspense fallback={null}>
        <GalaxyHero />
      </React.Suspense>
    </div>
  );
}
