import React from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BreathePromo() {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-32 bg-brand-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="bg-[#fdfcfb] rounded-[2rem] p-8 md:p-16 relative overflow-hidden border border-brand-black/5 shadow-sm">
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#e8f0fe] rounded-full blur-[80px] opacity-70 -translate-y-1/3 translate-x-1/3 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#fff0e6] rounded-full blur-[80px] opacity-70 translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-black/5 text-brand-black mb-6">
                <BookOpen className="w-4 h-4" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase">BrainHeal Blog</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-instrument mb-6 text-brand-black leading-[1.1] tracking-tight">
                Breathe.
                <br className="hidden md:block" />
                <span className="text-brand-gray">Pause. Read. Heal.</span>
              </h2>
              <p className="text-lg md:text-xl text-brand-gray/80 mb-10 max-w-xl mx-auto md:mx-0 leading-relaxed">
                Real talk about the stuff nobody prepares you for. Breakups, overthinking, loneliness, self-love—we've been there too. Explore our curated stories.
              </p>
              <button
                onClick={() => {
                  navigate('/breathe');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-3 bg-brand-black text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-900 transition-all duration-300 shadow-xl shadow-brand-black/10 group"
              >
                Read Stories
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="flex-1 w-full max-w-md relative hidden sm:block">
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 border border-white/20">
                <img 
                  src="/blog-images/hero-desktop.png" 
                  alt="Breathe by BrainHeal" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
