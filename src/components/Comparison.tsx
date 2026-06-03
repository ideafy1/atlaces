import React from 'react';
import { Check, X } from 'lucide-react';
import { useData } from '../DataContext';

export default function Comparison() {
  const { data } = useData();
  const comp = data?.comparison || {};
  const items = comp?.items || [];

  return (
    <section className="py-24 px-6 bg-[#FAFAFA] border-y border-gray-100">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-instrument mb-16 text-center text-brand-black tracking-tight scroll-reveal delay-100">
          {comp.title} <span className="italic text-brand-gray">{comp.subtitle}</span>
        </h2>
        
        <div className="bg-brand-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-200 scroll-reveal delay-200">
          <div className="grid grid-cols-12 border-b border-gray-100 pb-6 mb-6">
            <div className="col-span-6"></div>
            <div className="col-span-3 text-center font-instrument text-xl text-brand-black">BrainHeal</div>
            <div className="col-span-3 text-center font-instrument text-xl text-brand-gray">Traditional</div>
          </div>
          
          <div className="space-y-6">
            {items.map((item: any, i: number) => (
              <div key={i} className="grid grid-cols-12 items-center group">
                <div className="col-span-6 font-inter text-sm sm:text-base text-brand-gray pr-4">
                  {item.feature || item.label}
                </div>
                <div className="col-span-3 flex justify-center">
                  {(item.brainheal ?? item.atl) ? (
                    <div className="w-8 h-8 rounded-full border-2 border-brand-black flex items-center justify-center">
                      <Check className="w-4 h-4 text-brand-black" strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="w-8 h-8 flex items-center justify-center text-gray-300">
                      <X className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <div className="col-span-3 flex justify-center">
                  {(item.traditional ?? item.op) ? (
                    <div className="w-8 h-8 rounded-full border-2 border-gray-800 flex items-center justify-center">
                      <Check className="w-4 h-4 text-gray-800" strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="w-8 h-8 flex items-center justify-center text-gray-300">
                      <X className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Cards List */}
        <div className="flex md:hidden flex-col gap-4 scroll-reveal delay-200 mt-8">
          {items.map((item: any, i: number) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 flex flex-col gap-3 shadow-sm">
              <h3 className="text-sm font-medium text-brand-black leading-snug">{item.feature || item.label}</h3>
              <div className="flex gap-3 mt-1">
                <div className="flex-1 flex flex-col gap-1.5 p-3 rounded-xl bg-gray-50/80 border border-gray-100">
                  <span className="text-[10px] font-semibold tracking-wider uppercase text-brand-gray">BrainHeal</span>
                  <div className="flex items-center gap-2">
                    {(item.brainheal ?? item.atl) ? (
                      <div className="w-5 h-5 rounded-full border border-brand-black flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-brand-black" strokeWidth={3} />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center flex-shrink-0">
                        <X className="w-3 h-3 text-gray-300" strokeWidth={3} />
                      </div>
                    )}
                    <span className="text-xs font-medium text-brand-black">{(item.brainheal ?? item.atl) ? 'Yes' : 'No'}</span>
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-1.5 p-3 rounded-xl bg-gray-50/50 border border-gray-100">
                  <span className="text-[10px] font-semibold tracking-wider uppercase text-brand-gray/70">On your own</span>
                  <div className="flex items-center gap-2">
                    {(item.traditional ?? item.op) ? (
                      <div className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-gray-600" strokeWidth={3} />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0">
                        <X className="w-3 h-3 text-gray-300" strokeWidth={3} />
                      </div>
                    )}
                    <span className="text-xs text-brand-gray">{(item.traditional ?? item.op) ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
