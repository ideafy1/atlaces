import React from 'react';
import { useData } from '../DataContext';

export default function Chapters() {
  const { data } = useData();
  const chap = data.chapters;

  return (
    <section className="px-6 py-12 bg-brand-white">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#fdfaf6] rounded-3xl overflow-hidden flex flex-col md:flex-row relative">
          <div className="w-full md:w-1/2 p-6 sm:p-12 lg:p-20 flex flex-col justify-center z-10 scroll-reveal">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-instrument text-brand-black mb-2 scroll-reveal delay-100">
              {chap.title}
            </h2>
            <p className="text-sm font-medium text-brand-gray mb-8 uppercase tracking-widest scroll-reveal delay-200">
              {chap.subtitle}
            </p>
            <p className="text-brand-gray leading-relaxed mb-10 max-w-md scroll-reveal delay-300">
              {chap.text}
            </p>
            <div className="scroll-reveal delay-400">
              <button className="bg-brand-black text-brand-white rounded-full px-8 py-3 text-sm hover:scale-[1.03] transition-transform duration-300">
                {chap.buttonText}
              </button>
            </div>
          </div>

          <div className="w-full md:w-1/2 min-h-[300px] relative scroll-reveal delay-300">
            <img
              src={chap.image}
              alt="Diverse group of young professionals collaborating"
              className="absolute inset-0 w-full h-full object-cover grayscale opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#fdfaf6] via-[#fdfaf6]/50 to-transparent w-1/3 md:w-1/2"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
