import React, { useState } from 'react';

import { useData } from '../DataContext';

export default function Reviews() {
  const { data } = useData();
  const rev = data?.reviews || {};
  const people = rev?.people || rev?.items || [];
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="py-24 px-6 bg-brand-white text-brand-black overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 scroll-reveal delay-100">
          <h2 className="text-5xl sm:text-6xl font-instrument mb-4">
            {rev.title}<br/>
            <span className="text-brand-gray italic">{rev.subtitle}</span>
          </h2>
          <p className="text-brand-gray text-base sm:text-lg max-w-xl mx-auto">
            {rev.text}
          </p>
        </div>

        {/* Bubble grid */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-5xl mx-auto mb-8 scroll-reveal delay-200">
          {people.map((person: any, i: number) => (
            <div
              key={i}
              className="relative group"
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
              onClick={() => setActiveIndex(activeIndex === i ? null : i)}
            >
              {/* Avatar bubble */}
              <div
                className={`
                  w-14 h-14 sm:w-16 sm:h-16 md:w-[72px] md:h-[72px] rounded-full overflow-hidden cursor-pointer
                  border-2 transition-all duration-300 ease-out
                  ${activeIndex === i 
                    ? 'border-brand-black scale-125 shadow-xl z-30 ring-4 ring-brand-black/10' 
                    : activeIndex !== null 
                      ? 'border-transparent scale-95 opacity-60 grayscale' 
                      : 'border-transparent hover:border-brand-black hover:scale-110 grayscale hover:grayscale-0'
                  }
                `}
                style={{ transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
              >
                <img
                  src={person.image}
                  alt={person.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Tooltip review card (Desktop only) */}
              <div
                className={`
                  hidden md:block absolute z-50 w-64 sm:w-72 p-5 bg-white rounded-2xl shadow-2xl border border-gray-100
                  transition-all duration-300 pointer-events-none
                  ${activeIndex === i 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-0 translate-y-2 scale-95'
                  }
                `}
                style={{ 
                  bottom: 'calc(100% + 16px)', 
                  left: '50%', 
                  transform: `translateX(-50%) ${activeIndex === i ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.95)'}`,
                }}
              >
                <p className="text-sm text-brand-gray leading-relaxed mb-3 italic">
                  "{person.review}"
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full overflow-hidden">
                    <img src={person.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs font-medium text-brand-black">{person.name}</span>
                  <span className="text-xs text-brand-gray">BrainHeal Client</span>
                </div>
                {/* Triangle pointer */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45 -mt-1.5"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile active reviewer card */}
        <div className="md:hidden w-full max-w-md mx-auto mb-8 h-40 relative scroll-reveal delay-300">
          <div className={`absolute inset-0 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all duration-300 flex flex-col justify-center ${activeIndex !== null ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
            {activeIndex !== null && people[activeIndex] && (
              <>
                <p className="text-sm text-brand-gray leading-relaxed mb-4 italic line-clamp-3">
                  "{people[activeIndex].review}"
                </p>
                <div className="flex items-center gap-2 mt-auto">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <img src={people[activeIndex].image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-sm font-medium text-brand-black">{people[activeIndex].name}</span>
                  <span className="text-xs text-brand-gray ml-auto">BrainHeal Client</span>
                </div>
              </>
            )}
          </div>
        </div>

        <p className="text-center text-brand-gray text-sm">
          {rev.counter || '500+'} people have found their clarity through BrainHeal.
        </p>
      </div>
    </section>
  );
}
