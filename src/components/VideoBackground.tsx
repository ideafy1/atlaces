import React, { useEffect, useRef } from 'react';

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let animationFrameId: number;
    let fadeDuration = 0.5;

    const updateOpacity = () => {
      if (!video) return;
      
      // Some browsers set duration to NaN initially or 0
      const duration = video.duration;
      const currentTime = video.currentTime;
      
      if (!duration || isNaN(duration)) {
        animationFrameId = requestAnimationFrame(updateOpacity);
        return;
      }

      let currentOpacity = 0;
      if (currentTime < fadeDuration) {
        currentOpacity = currentTime / fadeDuration;
      } else if (duration - currentTime < fadeDuration) {
        currentOpacity = Math.max(0, (duration - currentTime) / fadeDuration);
      } else {
        currentOpacity = 1;
      }
      
      video.style.opacity = currentOpacity.toString();
      animationFrameId = requestAnimationFrame(updateOpacity);
    };

    video.play().catch(console.error);
    animationFrameId = requestAnimationFrame(updateOpacity);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleEnded = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.style.opacity = '0';
    setTimeout(() => {
      video.currentTime = 0;
      video.play().catch(console.error);
    }, 100);
  };

  return (
    <div className="absolute inset-x-0 bottom-0 z-0 overflow-hidden" style={{ top: '300px' }}>
      <video
        ref={videoRef}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4"
        className="w-full h-full object-cover"
        muted
        playsInline
        onEnded={handleEnded}
        style={{ opacity: 0, transition: 'opacity 0.1s linear' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-white via-transparent to-brand-white pointer-events-none" />
    </div>
  );
}
