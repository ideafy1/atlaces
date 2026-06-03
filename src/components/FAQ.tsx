import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useData } from '../DataContext';

export default function FAQ() {
  const { data } = useData();
  const faqData = data?.faq || {};
  const questions = faqData?.questions || faqData?.items || [];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 px-6 bg-brand-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-instrument mb-16 text-center text-brand-black tracking-tight scroll-reveal delay-100">
          {faqData.title} <span className="italic text-brand-gray">{faqData.subtitle}</span>
        </h2>
        
        <div className="space-y-4 scroll-reveal delay-200">
          {questions.map((faq: any, index: number) => (
            <div 
              key={index}
              className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                openIndex === index 
                  ? 'border-brand-black shadow-md bg-white' 
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white'
              }`}
            >
              <button
                className="w-full px-6 py-5 flex items-center justify-between text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-instrument text-xl text-brand-black pr-8">
                  {faq.q}
                </span>
                <span className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-colors duration-300 ${
                  openIndex === index 
                    ? 'border-brand-black bg-brand-black text-white' 
                    : 'border-gray-300 text-brand-gray'
                }`}>
                  {openIndex === index ? (
                    <Minus className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </span>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6 text-brand-gray leading-relaxed text-sm sm:text-base">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
