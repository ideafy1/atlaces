import React from 'react';
import { useData } from '../DataContext';
import { CheckCircle2 } from 'lucide-react';
import GsapButton from './GsapButton';

import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const { data } = useData();
  const navigate = useNavigate();
  
  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full bg-[#EAF2F6] font-sans text-brand-black flex flex-col">
      {/* Split Screen Container */}
      <div className="flex-1 flex flex-col-reverse lg:flex-row w-full h-full">
        
        {/* Left Side - Content */}
        <div className="w-full lg:w-[55%] bg-[#EAF2F6] flex flex-col justify-center px-8 sm:px-12 lg:px-24 py-12 lg:py-0 relative z-10">
          <div className="max-w-xl mx-auto lg:mx-0 w-full animate-fade-in-up">
            <h1 
              className="font-sans font-medium text-4xl sm:text-5xl lg:text-6xl mb-6 tracking-tight text-[#000000]"
              style={{ lineHeight: 1.1 }}
            >
              Space to figure<br />things out
            </h1>
            
            <div className="flex flex-col gap-3.5 mb-8 text-base text-[#000000]">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#20759A] flex-shrink-0" />
                <span>Convenient access anytime, anywhere</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#20759A] flex-shrink-0" />
                <span>Professional support from verified therapists</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#20759A] flex-shrink-0" />
                <span>Affordable options tailored to your needs</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <GsapButton
                onClick={() => navigate('/therapy')}
                variant="solid"
                className="w-full sm:w-auto px-6 py-3 text-sm"
                aria-label="Get started with BrainHeal therapy"
              >
                Get started
              </GsapButton>
              <GsapButton
                onClick={() => navigate('/therapy')}
                variant="outline"
                className="w-full sm:w-auto px-6 py-3 text-sm border border-[#20759A] text-[#000000]"
                aria-label="Find a verified therapist"
              >
                Find a therapist
              </GsapButton>
            </div>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="w-full lg:w-[45%] relative min-h-[50vh] lg:min-h-screen">
          <div className="absolute inset-0 bg-[#322E29]/10 z-10 mix-blend-multiply pointer-events-none" />
          <img 
            src="/hero-therapist.png" 
            alt="Compassionate therapist" 
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: 'center top' }}
          />
        </div>
        
      </div>
    </div>
  );
}
