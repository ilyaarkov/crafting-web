import React, { useEffect, useRef, useState } from 'react';

export const CursorTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const mousePos = useRef({ x: 0, y: 0 });
  const trail = useRef<Array<{ x: number; y: number; alpha: number }>>([]);

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      trail.current.push({
        x: e.clientX,
        y: e.clientY,
        alpha: 1
      });

      if (trail.current.length > 20) {
        trail.current.shift();
      }
    };

    const animate = () => {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      trail.current = trail.current.filter(point => {
        point.alpha -= 0.05;
        return point.alpha > 0;
      });

      trail.current.forEach((point, index) => {
        const radius = 40 - (index * 2);
        const gradient = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, radius
        );

        gradient.addColorStop(0, `rgba(34, 211, 238, ${point.alpha * 0.15})`);
        gradient.addColorStop(0.5, `rgba(56, 189, 248, ${point.alpha * 0.08})`);
        gradient.addColorStop(1, 'rgba(14, 165, 233, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(point.x - radius, point.y - radius, radius * 2, radius * 2);
      });

      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [dimensions]);

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
