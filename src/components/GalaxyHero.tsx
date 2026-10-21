import React, { useEffect, useRef } from "react";
import "../styles/GalaxyHero.css";

export default function GalaxyHero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const isMobile = window.matchMedia("(max-width: 767px)");
    video.poster = isMobile.matches ? "/galaxy/poster-mobile.webp" : "/galaxy/poster-desktop.webp";

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        void video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="galaxy-hero galaxy-hero--cosmic" aria-hidden="true">
      <div className="galaxy-hero__canvas-wrap">
        <video
          ref={videoRef}
          className="galaxy-hero__video"
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/galaxy/galaxy-mobile.mp4" type="video/mp4" media="(max-width: 767px)" />
          <source src="/galaxy/galaxy-desktop.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="galaxy-hero__vignette" />
    </div>
  );
}
