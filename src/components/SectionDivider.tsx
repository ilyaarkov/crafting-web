import React from 'react';
import { motion } from 'framer-motion';

interface SectionDividerProps {
  variant?: 'wave' | 'curve' | 'zigzag' | 'blob';
  flip?: boolean;
  color?: string;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({
  variant = 'wave',
  flip = false,
  color = '#0ea5e9'
}) => {
  const paths = {
    wave: 'M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z',
    curve: 'M0,64L60,58.7C120,53,240,43,360,48C480,53,600,75,720,80C840,85,960,75,1080,64C1200,53,1320,43,1380,37.3L1440,32L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z',
    zigzag: 'M0,32L40,42.7L80,32L120,42.7L160,32L200,42.7L240,32L280,42.7L320,32L360,42.7L400,32L440,42.7L480,32L520,42.7L560,32L600,42.7L640,32L680,42.7L720,32L760,42.7L800,32L840,42.7L880,32L920,42.7L960,32L1000,42.7L1040,32L1080,42.7L1120,32L1160,42.7L1200,32L1240,42.7L1280,32L1320,42.7L1360,32L1400,42.7L1440,32L1440,0L0,0Z',
    blob: 'M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z'
  };

  return (
    <div className={`relative w-full overflow-hidden ${flip ? 'rotate-180' : ''}`}>
      <svg
        className="w-full h-16 md:h-20"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d={paths[variant]}
          fill={color}
          fillOpacity="0.1"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
        <motion.path
          d={paths[variant]}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeOpacity="0.3"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.2 }}
        />
      </svg>
    </div>
  );
};
