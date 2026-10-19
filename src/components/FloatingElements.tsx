import React from 'react';
import { motion } from 'framer-motion';

interface FloatingShapeProps {
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  size?: number;
  color?: string;
  blur?: boolean;
}

const FloatingShape: React.FC<FloatingShapeProps> = ({
  delay = 0,
  duration = 20,
  x = 0,
  y = 0,
  size = 100,
  color = 'cyan',
  blur = true
}) => {
  return (
    <motion.div
      className={`absolute ${blur ? 'blur-2xl' : 'blur-xl'} rounded-full pointer-events-none`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color === 'cyan' ? 'rgba(34, 211, 238, 0.2)' : 'rgba(56, 189, 248, 0.15)'}, transparent 70%)`
      }}
      animate={{
        y: [0, -30, 0],
        x: [0, 20, 0],
        scale: [1, 1.1, 1],
        opacity: [0.3, 0.6, 0.3]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay
      }}
    />
  );
};

interface FloatingElementsProps {
  count?: number;
  className?: string;
}

export const FloatingElements: React.FC<FloatingElementsProps> = ({
  count = 5,
  className = ''
}) => {
  const shapes = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 80 + Math.random() * 150,
    duration: 15 + Math.random() * 10,
    delay: Math.random() * 5,
    color: i % 2 === 0 ? 'cyan' : 'blue',
    blur: Math.random() > 0.5
  }));

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {shapes.map((shape) => (
        <FloatingShape key={shape.id} {...shape} />
      ))}
    </div>
  );
};

interface GeometricDecorProps {
  variant?: 'circle' | 'square' | 'triangle';
  size?: number;
  x?: number;
  y?: number;
  rotation?: number;
  opacity?: number;
}

export const GeometricDecor: React.FC<GeometricDecorProps> = ({
  variant = 'circle',
  size = 60,
  x = 50,
  y = 50,
  rotation = 0,
  opacity = 0.1
}) => {
  const shapes = {
    circle: (
      <circle cx={size / 2} cy={size / 2} r={size / 2} />
    ),
    square: (
      <rect width={size} height={size} />
    ),
    triangle: (
      <polygon points={`${size / 2},0 ${size},${size} 0,${size}`} />
    )
  };

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size
      }}
      initial={{ rotate: rotation, opacity: 0 }}
      animate={{
        rotate: rotation + 360,
        opacity: [opacity, opacity * 1.5, opacity]
      }}
      transition={{
        rotate: {
          duration: 30,
          repeat: Infinity,
          ease: 'linear'
        },
        opacity: {
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full"
      >
        <defs>
          <linearGradient id={`grad-${variant}-${x}-${y}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <g fill={`url(#grad-${variant}-${x}-${y})`} stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.3">
          {shapes[variant]}
        </g>
      </svg>
    </motion.div>
  );
};
