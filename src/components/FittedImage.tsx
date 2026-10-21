import React from 'react';

interface FittedImageProps {
  src: string;
  alt: string;
  loading?: 'eager' | 'lazy';
  className?: string;
  imageClassName?: string;
  // Размытие подложки: для миниатюр хватает слабого, для больших кадров нужно сильнее
  backdropBlur?: string;
}

/**
 * Фото целиком, без обрезки и искажения пропорций.
 * Свободное пространство по краям заполняется размытой копией того же кадра.
 */
export const FittedImage: React.FC<FittedImageProps> = ({
  src,
  alt,
  loading = 'eager',
  className = '',
  imageClassName = '',
  backdropBlur = 'blur-2xl',
}) => (
  <div className={`relative w-full h-full overflow-hidden ${className}`}>
    {/* Размытая подложка: тот же URL, поэтому браузер не скачивает файл повторно */}
    <img
      src={src}
      alt=""
      aria-hidden="true"
      loading={loading}
      decoding="async"
      draggable={false}
      className={`absolute inset-0 w-full h-full object-cover scale-125 opacity-60 saturate-150 pointer-events-none select-none ${backdropBlur}`}
    />
    <div className="absolute inset-0 bg-[#04060a]/40 pointer-events-none" />

    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      draggable={false}
      className={`relative w-full h-full object-contain select-none ${imageClassName}`}
    />
  </div>
);

export default FittedImage;
