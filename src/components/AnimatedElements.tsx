import React, { useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedCounterProps {
  value: number | string;
  duration?: number;
  label: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, duration = 2, label }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);

          if (typeof value === 'number') {
            let start = 0;
            const end = value;
            const increment = end / (duration * 60);

            const timer = setInterval(() => {
              start += increment;
              if (start >= end) {
                setCount(end);
                clearInterval(timer);
              } else {
                setCount(Math.floor(start));
              }
            }, 1000 / 60);

            return () => clearInterval(timer);
          }
        }
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById(`counter-${label}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [value, duration, label, hasAnimated]);

  return (
    <motion.div
      id={`counter-${label}`}
      className="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent backdrop-blur-sm border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300 hover:scale-105"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ boxShadow: '0 0 25px rgba(34, 211, 238, 0.3)' }}
    >
      <div className="text-white font-extrabold text-base tracking-tight mb-0.5 flex items-center gap-2">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        >
          {typeof value === 'number' ? count : value}
        </motion.span>
        <motion.div
          className="w-2 h-2 rounded-full bg-cyan-400"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </div>
      <div className="text-xs text-slate-400">{label}</div>
    </motion.div>
  );
};

interface TypewriterTextProps {
  text: string;
  delay?: number;
  speed?: number;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({ text, delay = 0, speed = 50 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex === 0) {
      const startTimer = setTimeout(() => {
        setCurrentIndex(1);
      }, delay);
      return () => clearTimeout(startTimer);
    }

    if (currentIndex > 0 && currentIndex <= text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex));
        setCurrentIndex(currentIndex + 1);
      }, speed);
      return () => clearTimeout(timer);
    }

    if (currentIndex > text.length) {
      setIsComplete(true);
    }
  }, [currentIndex, text, delay, speed]);

  return (
    <span className="relative inline-block">
      {displayedText}
      {!isComplete && (
        <motion.span
          className="inline-block w-0.5 h-5 bg-cyan-400 ml-0.5"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
    </span>
  );
};

interface FloatingBadgeProps {
  text: string;
  icon?: React.ReactNode;
  delay?: number;
}

export const FloatingBadge: React.FC<FloatingBadgeProps> = ({ text, icon, delay = 0 }) => {
  return (
    <motion.div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-md border border-cyan-400/30 text-cyan-300 text-sm font-semibold"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      transition={{
        duration: 0.6,
        delay,
        type: 'spring',
        stiffness: 200,
        damping: 15
      }}
      whileHover={{
        scale: 1.05,
        boxShadow: '0 0 20px rgba(34, 211, 238, 0.4)'
      }}
    >
      {icon && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          {icon}
        </motion.div>
      )}
      <span>{text}</span>
    </motion.div>
  );
};
