import React from 'react';

interface MacBrowserFrameProps {
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
  imageClassName?: string;
  overlayText?: string;
  loading?: 'eager' | 'lazy';
  // Собственное содержимое окна (например, галерея) вместо одиночного изображения
  children?: React.ReactNode;
}

export const MacBrowserFrame: React.FC<MacBrowserFrameProps> = ({
  imageSrc = '',
  imageAlt = '',
  className = '',
  imageClassName = '',
  overlayText,
  loading = 'lazy',
  children,
}) => {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-[#0a0f1d] overflow-hidden shadow-2xl transition-all ${className}`}
    >
      {/* macOS Top Bar: чистые и аутентичные кнопки управления окном */}
      <div className="px-3.5 py-2.5 sm:px-4 sm:py-3 bg-[#0d1322] border-b border-white/10 flex items-center select-none">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]/40 shadow-sm" />
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]/40 shadow-sm" />
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27c93f] border border-[#1aab29]/40 shadow-sm" />
        </div>
      </div>

      {/* Browser Viewport */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9.5] bg-[#070b14] overflow-hidden">
        {children ?? (
          // Превью проекта заполняет окно целиком
          <img
            src={imageSrc}
            alt={imageAlt}
            loading={loading}
            decoding="auto"
            className={`w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02] ${imageClassName}`}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060a12]/30 via-transparent to-transparent pointer-events-none" />

        {overlayText && (
          <div className="project-preview-overlay absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none select-none z-20">
            <span className="text-xs sm:text-sm font-semibold tracking-[0.28em] text-white/50 uppercase">
              {overlayText}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MacBrowserFrame;
