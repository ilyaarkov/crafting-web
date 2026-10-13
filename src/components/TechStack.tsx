import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, CheckCircle, ExternalLink } from 'lucide-react';

const cosmicStars = [
  { top: '10%', left: '15%', size: '2px', opacity: '0.6', delay: '0s' },
  { top: '18%', left: '82%', size: '2.5px', opacity: '0.8', delay: '1s' },
  { top: '25%', left: '45%', size: '1.5px', opacity: '0.5', delay: '2s' },
  { top: '38%', left: '8%', size: '2px', opacity: '0.7', delay: '0.5s' },
  { top: '50%', left: '94%', size: '2px', opacity: '0.6', delay: '1.5s' },
  { top: '62%', left: '22%', size: '1.5px', opacity: '0.4', delay: '2.5s' },
  { top: '72%', left: '76%', size: '2.5px', opacity: '0.7', delay: '0.8s' },
  { top: '85%', left: '12%', size: '2px', opacity: '0.8', delay: '1.2s' },
  { top: '90%', left: '65%', size: '1.5px', opacity: '0.5', delay: '2.2s' },
];

const toolVisuals: Record<
  string,
  {
    iconBg: string;
    renderFallback: () => React.ReactNode;
  }
> = {
  react: {
    iconBg: 'bg-[#0a1524] border border-[#00d8ff]/30 hover:border-[#00d8ff] hover:shadow-[0_0_15px_rgba(0,216,255,0.4)]',
    renderFallback: () => (
      <svg viewBox="-11.5 -10.23174 23 20.46348" className="w-5 h-5 fill-none stroke-[#00d8ff] stroke-[1.3]">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        <circle r="2" fill="#00d8ff" />
      </svg>
    ),
  },
  typescript: {
    iconBg: 'bg-[#152e4d] border border-[#3178c6]/50 hover:border-white hover:shadow-[0_0_15px_rgba(49,120,198,0.5)]',
    renderFallback: () => (
      <span className="text-[#3178c6] font-extrabold font-mono text-[13px] tracking-tight">
        TS
      </span>
    ),
  },
  tailwind: {
    iconBg: 'bg-[#081a26] border border-[#38bdf8]/35 hover:border-[#38bdf8] hover:shadow-[0_0_15px_rgba(56,189,248,0.4)]',
    renderFallback: () => (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#38bdf8]">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C4.336 17.818 5.697 19.2 8.671 19.2c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z" />
      </svg>
    ),
  },
  node: {
    iconBg: 'bg-[#0a2014] border border-[#22c55e]/30 hover:border-[#22c55e] hover:shadow-[0_0_15px_rgba(34,197,94,0.4)]',
    renderFallback: () => (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#22c55e]">
        <path d="M12 2L3.5 6.9v9.8L12 21.6l8.5-4.9V6.9L12 2zm0 2.3l6.5 3.8v7.6L12 19.5 5.5 15.7V8.1L12 4.3z" />
        <path d="M10.2 9.2h3.6v1.8h-1.8v3.8h-1.8V9.2z" fill="#22c55e" />
      </svg>
    ),
  },
  postgres: {
    iconBg: 'bg-[#0a1b2d] border border-[#336791]/40 hover:border-[#41b0ff] hover:shadow-[0_0_15px_rgba(65,176,255,0.4)]',
    renderFallback: () => (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#41b0ff]">
        <path d="M12 2C6.48 2 2 4.02 2 6.5s4.48 4.5 10 4.5 10-2.02 10-4.5S17.52 2 12 2zm0 6.5c-4.41 0-8-1.34-8-2.5S7.59 3.5 12 3.5s8 1.34 8 2.5-3.59 2.5-8 2.5z" />
        <path d="M2 9.5c0 1.95 3.13 3.61 7.5 4.19v2.06C5.07 15.22 2 13.29 2 11V9.5zm20 0V11c0 2.29-3.07 4.22-7.5 4.75v-2.06c4.37-.58 7.5-2.24 7.5-4.19z" />
        <path d="M2 14c0 1.95 3.13 3.61 7.5 4.19v2.06C5.07 19.72 2 17.79 2 15.5V14zm20 0v1.5c0 2.29-3.07 4.22-7.5 4.75v-2.06c4.37-.58 7.5-2.24 7.5-4.19z" />
      </svg>
    ),
  },
  cloudflare: {
    iconBg: 'bg-[#1a120e] border border-[#f38020]/35 hover:border-[#f38020] hover:shadow-[0_0_15px_rgba(243,128,32,0.4)]',
    renderFallback: () => (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#f38020]">
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
      </svg>
    ),
  },
  vercel: {
    iconBg: 'bg-[#0f1117] border border-white/20 hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]',
    renderFallback: () => (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
        <path d="M12 1L24 22H0L12 1Z" />
      </svg>
    ),
  },
};

const TechIconImage: React.FC<{
  id: string;
  alt: string;
  fallback: () => React.ReactNode;
}> = ({ id, alt, fallback }) => {
  const [extIdx, setExtIdx] = useState<number>(0);
  const extensions = ['.svg', '.png', '.webp'];

  if (extIdx >= extensions.length) {
    return <>{fallback()}</>;
  }

  const src = `/tech/${id}${extensions[extIdx]}`;

  return (
    <img
      src={src}
      alt={alt}
      className="w-5 h-5 object-contain select-none pointer-events-none transition-transform group-hover/tool:scale-110"
      onError={() => setExtIdx((prev) => prev + 1)}
    />
  );
};

export const TechStack: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="tech-stack" className="py-20 lg:py-28 relative border-t border-b border-white/5 overflow-hidden bg-[#04060a]">
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-gradient-to-br from-indigo-900/15 via-purple-900/10 to-transparent blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[650px] h-[450px] bg-gradient-to-tl from-cyan-950/25 via-blue-950/20 to-transparent blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-sky-900/10 blur-[160px] rounded-full pointer-events-none -z-10" />

      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

      <div className="absolute inset-0 pointer-events-none -z-10">
        {cosmicStars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-200 animate-pulse"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
              animationDelay: star.delay,
              animationDuration: '3s',
              boxShadow: `0 0 6px 1px rgba(165, 243, 252, ${star.opacity})`,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl mb-12 sm:mb-14 cursor-default select-none">
          <div className="text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-3">
            <span>{t.tools.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4 cursor-default select-none">
            {t.tools.title}
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed cursor-default select-none">
            {t.tools.intro}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {t.tools.items.map((card) => (
            <div
              key={card.id}
              className="group relative p-6 sm:p-7 rounded-2xl border border-white/10 bg-[#070b13]/85 backdrop-blur-xl flex flex-col justify-start hover:border-cyan-400/40 hover:shadow-[0_0_30px_-5px_rgba(34,211,238,0.18)] transition-all duration-300 overflow-hidden cursor-default select-none"
            >
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none -z-10">
                <div
                  className="absolute -inset-6 opacity-35 group-hover:opacity-65 transition-opacity duration-500"
                  style={{
                    perspective: '450px',
                    perspectiveOrigin: '50% 50%',
                  }}
                >
                  <div
                    className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle, rgba(56, 189, 248, 0.45) 1.2px, transparent 1.2px)',
                      backgroundSize: '16px 16px',
                      transform: 'rotateX(18deg)',
                      transformOrigin: 'center center',
                      maskImage:
                        'radial-gradient(ellipse 85% 75% at 50% 50%, rgba(0,0,0,1) 25%, rgba(0,0,0,0.15) 85%, transparent 100%)',
                      WebkitMaskImage:
                        'radial-gradient(ellipse 85% 75% at 50% 50%, rgba(0,0,0,1) 25%, rgba(0,0,0,0.15) 85%, transparent 100%)',
                    }}
                  />
                </div>

                <div className="absolute -top-12 -right-12 w-28 h-28 bg-cyan-500/10 blur-2xl rounded-full group-hover:bg-cyan-400/20 transition-all duration-500" />
                <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-indigo-500/10 blur-2xl rounded-full group-hover:bg-indigo-400/20 transition-all duration-500" />
              </div>

              <div className="flex items-center gap-2 mb-4.5 relative z-10">
                {card.tools.map((tool, tIdx) => {
                  const visual = toolVisuals[tool.id] || {
                    iconBg: 'bg-white/5 border border-white/10',
                    renderFallback: () => null,
                  };
                  return (
                    <a
                      key={tIdx}
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={tool.title}
                      className={`w-11 h-11 rounded-[13px] flex items-center justify-center shrink-0 shadow-md transition-all duration-200 cursor-pointer group/tool hover:scale-110 active:scale-95 ${visual.iconBg}`}
                    >
                      <TechIconImage
                        id={tool.id}
                        alt={tool.name}
                        fallback={visual.renderFallback}
                      />
                      <span className="sr-only">{tool.name}</span>
                    </a>
                  );
                })}

                <span className="text-[10px] text-slate-500 font-mono ml-auto opacity-60 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                  <span>{t.tools.officialLabel}</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </span>
              </div>

              <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-cyan-200 transition-colors cursor-default select-none pointer-events-none">
                {card.name}
              </h3>

              <div className="text-[13px] font-semibold text-slate-200 mt-1 leading-snug cursor-default select-none pointer-events-none">
                {card.subtitle}
              </div>

              <p className="text-xs sm:text-[13px] text-slate-400 mt-2.5 leading-relaxed cursor-default select-none pointer-events-none">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 glass-panel p-5 sm:p-6 rounded-2xl border border-cyan-500/20 bg-cyan-950/20 flex items-center gap-3.5 text-cyan-200 text-sm sm:text-base font-medium cursor-default select-none">
          <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0" />
          <span className="cursor-default select-none">{t.tools.signature}</span>
        </div>
      </div>
    </section>
  );
};

export default TechStack;