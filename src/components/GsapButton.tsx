import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface GsapButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'solid' | 'outline';
}

export default function GsapButton({ children, variant = 'solid', className = '', ...props }: GsapButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const flairRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    const flair = flairRef.current;
    if (!button || !flair) return;

    const xSet = gsap.quickSetter(flair, "xPercent");
    const ySet = gsap.quickSetter(flair, "yPercent");

    const getXY = (e: MouseEvent) => {
      const { left, top, width, height } = button.getBoundingClientRect();
      const xTransformer = gsap.utils.pipe(
        gsap.utils.mapRange(0, width, 0, 100),
        gsap.utils.clamp(0, 100)
      );
      const yTransformer = gsap.utils.pipe(
        gsap.utils.mapRange(0, height, 0, 100),
        gsap.utils.clamp(0, 100)
      );
      return {
        x: xTransformer(e.clientX - left),
        y: yTransformer(e.clientY - top)
      };
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const { x, y } = getXY(e);
      xSet(x);
      ySet(y);
      gsap.to(flair, {
        scale: 1,
        duration: 0.4,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const { x, y } = getXY(e);
      gsap.killTweensOf(flair);
      gsap.to(flair, {
        xPercent: x > 90 ? x + 20 : x < 10 ? x - 20 : x,
        yPercent: y > 90 ? y + 20 : y < 10 ? y - 20 : y,
        scale: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { x, y } = getXY(e);
      gsap.to(flair, {
        xPercent: x,
        yPercent: y,
        duration: 0.4,
        ease: "power2"
      });
    };

    button.addEventListener("mouseenter", handleMouseEnter);
    button.addEventListener("mouseleave", handleMouseLeave);
    button.addEventListener("mousemove", handleMouseMove);

    return () => {
      button.removeEventListener("mouseenter", handleMouseEnter);
      button.removeEventListener("mouseleave", handleMouseLeave);
      button.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const isOutline = variant === 'outline';

  return (
    <button
      ref={buttonRef}
      className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full font-medium ${
        isOutline 
          ? 'border border-[#20759A] text-[#000000] hover:text-white' 
          : 'bg-[#20759A] text-white hover:text-white'
      } ${className}`}
      {...props}
    >
      <span
        ref={flairRef}
        className="pointer-events-none absolute left-0 top-0 bottom-0 right-0 origin-top-left scale-0"
        style={{ willChange: 'transform' }}
      >
        <span 
          className={`absolute left-0 top-0 block aspect-square w-[170%] -translate-x-1/2 -translate-y-1/2 rounded-full ${
            isOutline ? 'bg-[#20759A]' : 'bg-[#134B61]'
          }`} 
        />
      </span>
      <span className="relative z-10 flex items-center justify-center gap-2 transition-colors duration-300">
        {children}
      </span>
    </button>
  );
}
