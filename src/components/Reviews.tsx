import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Quote } from 'lucide-react';
import { ParallaxStarfield } from './ParallaxStarfield';

export const Reviews: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="reviews" className="py-16 sm:py-20 lg:py-24 relative overflow-hidden bg-site z-10">
      <ParallaxStarfield seed={303} constellations={1} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <p className="text-xs sm:text-sm font-semibold text-cyan-400 uppercase tracking-widest mb-3">
            {t.reviews.preTitle}
          </p>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {t.reviews.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {t.reviews.items.map((review) => {
            const initials = review.name
              .split(' ')
              .map((part) => part[0])
              .slice(0, 2)
              .join('');

            return (
              <figure
                key={review.name}
                className="group relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col transition-all duration-300 glass-panel glass-panel-hover"
              >
                <Quote className="w-8 h-8 text-cyan-400/70 mb-4" />
                <blockquote className="flex-1 text-sm sm:text-base text-slate-200 leading-relaxed">
                  {review.text}
                </blockquote>
                <figcaption className="mt-6 pt-5 border-t border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-cyan-400/30 to-sky-500/20 border border-cyan-400/30 flex items-center justify-center text-xs font-bold text-cyan-200">
                    {initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{review.name}</div>
                    <div className="text-xs text-slate-400">{review.role}</div>
                  </div>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
