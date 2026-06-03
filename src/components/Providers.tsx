import React from 'react';
import { useData } from '../DataContext';
import { Star } from 'lucide-react';

export default function Providers() {
  const { data } = useData();
  const prov = data?.providers || {};
  const tags = prov?.tags || [];
  const therapists = prov?.therapists || [];
  const trust = prov?.trust || {};
  const trustStats = trust?.stats || [];

  return (
    <section className="py-24 px-6 bg-brand-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          <div className="w-full lg:w-1/3">
            <h2 className="text-4xl sm:text-5xl font-instrument mb-6 text-brand-black tracking-tight scroll-reveal">
              {prov.title} <span className="italic text-brand-gray">{prov.subtitle}</span>
            </h2>
            <p className="text-brand-gray text-base sm:text-lg mb-8 leading-relaxed scroll-reveal delay-100">
              {prov.text}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-10 scroll-reveal delay-200">
              {tags.map((tag: string) => (
                <span key={tag} className="px-4 py-2 rounded-full border border-gray-200 text-sm text-brand-black">
                  {tag}
                </span>
              ))}
            </div>
            
            <button className="w-full sm:w-auto px-8 py-4 bg-brand-black text-brand-white rounded-full font-medium hover:scale-[1.03] transition-transform duration-300 scroll-reveal delay-300">
              {prov.buttonText}
            </button>
          </div>
          
          <div className="w-full lg:w-2/3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {therapists.map((therapist: any, index: number) => (
                <div 
                  key={index} 
                  className="bg-gray-50 rounded-3xl p-6 group cursor-pointer hover:bg-gray-100 transition-colors duration-300 scroll-reveal"
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-200">
                      <img 
                        src={therapist.image}
                        alt={therapist.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div>
                      <h3 className="font-instrument text-2xl text-brand-black">{therapist.name}</h3>
                      <p className="text-brand-gray text-sm">{therapist.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-brand-black font-medium">
                    <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-brand-black" /> 5.0</span>
                    <span>{therapist.exp}</span>
                  </div>
                </div>
              ))}
              
              {trust.title && (
                <div className="bg-brand-black text-brand-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between scroll-reveal delay-300">
                  <div>
                    <h3 className="font-instrument text-3xl mb-4">
                      {trust.title} <span className="italic text-gray-400">{trust.subtitle}</span>
                    </h3>
                    <p className="text-gray-300 text-sm mb-8 leading-relaxed">
                      {trust.text}
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    {trustStats.map((stat: any, index: number) => (
                      <div key={index} className="flex gap-4">
                        <div className="font-instrument text-3xl text-brand-white w-16">{stat.value}</div>
                        <div className="text-gray-400 text-sm leading-snug">{stat.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
