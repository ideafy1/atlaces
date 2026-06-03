import React, { useState } from 'react';
import VideoBackground from './VideoBackground';
import Navigation from './Navigation';
import { useData } from '../DataContext';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroProps {
  activePage?: number;
  onPageChange?: (page: number) => void;
}

export default function Hero({ activePage, onPageChange }: HeroProps) {
  const { data } = useData();
  const hero = data.hero;
  const [btnHover, setBtnHover] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-brand-white font-inter text-brand-black overflow-hidden flex flex-col">
      <VideoBackground />
      
      <div className="relative z-10 flex flex-col flex-1">
        <Navigation activePage={activePage} onPageChange={onPageChange} />
        
        <div 
          className="flex flex-col items-center justify-center text-center px-6 flex-1"
          style={{ paddingBottom: '10rem' }} 
        >
          <h1 
            itemProp="headline"
            className="font-instrument font-normal text-4xl sm:text-6xl md:text-7xl lg:text-8xl max-w-5xl animate-fade-rise mx-auto"
            style={{ lineHeight: 1.05, letterSpacing: '-2px' }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">{hero.title}</span>{' '}
            {hero.subtitle}{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">{hero.highlight}</span>
          </h1>
          
          <p className="text-brand-gray text-base sm:text-lg max-w-2xl mt-8 leading-relaxed animate-fade-rise-delay mx-auto">
            {hero.text}
          </p>
          
          {/* CTA Button with immersive transition */}
          <button
            className="group mt-12 relative animate-fade-rise-delay-2"
            onClick={() => onPageChange?.(1)}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
          >
            <div
              className="relative flex items-center gap-3 bg-brand-black text-white rounded-full px-10 py-5 md:px-14 md:py-6 text-base md:text-lg font-medium overflow-hidden transition-all duration-500"
              style={{
                boxShadow: btnHover 
                  ? '0 20px 60px rgba(0,0,0,0.3), 0 0 0 2px rgba(0,0,0,0.1)' 
                  : '0 4px 20px rgba(0,0,0,0.15)',
                transform: btnHover ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              {/* Shine effect */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                  background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 55%, transparent 60%)',
                  backgroundSize: '200% 100%',
                  animation: btnHover ? 'shine 1.5s ease-in-out' : 'none',
                }}
              />
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-500" />
              <span className="relative z-10">{hero.buttonText}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes shine {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
