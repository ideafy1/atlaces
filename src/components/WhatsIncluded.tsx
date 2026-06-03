import React from 'react';
import { CheckCircle2, Shield, Clock } from 'lucide-react';
import { useData } from '../DataContext';
export default function WhatsIncluded() {
  const { data } = useData();
  const whats = data?.whatsIncluded || {};
  const features = whats?.features || [];
  const icons = [Shield, CheckCircle2, Clock];

  return (
    <section className="py-24 px-6 bg-brand-white">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        {/* Left: Image */}
        <div className="w-full lg:w-5/12">
          <div className="relative aspect-[16/9] sm:aspect-[4/3] lg:aspect-[4/5] overflow-hidden rounded-2xl group scroll-reveal delay-100">
            <img
              src={whats.image}
              alt="Young Indian woman feeling at peace"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Right: Content */}
        <div className="w-full lg:w-7/12">
          <h2 className="text-4xl sm:text-5xl font-instrument mb-12 text-brand-black leading-tight tracking-tight scroll-reveal delay-200">
            {whats.title}
            <br />
            <span className="italic text-brand-gray">{whats.subtitle}</span>
          </h2>

          <ul className="space-y-8" role="list">
            {features.map((feature: any, index: number) => {
              const Icon = icons[index % icons.length];
              return (
                <li
                  key={index}
                  className="flex items-start gap-5 group/item scroll-reveal"
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-black flex items-center justify-center mt-0.5 transition-transform duration-300 group-hover/item:scale-110">
                    <Icon className="w-5 h-5 text-brand-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-brand-black mb-2">{feature.title}</h3>
                    <p className="text-brand-gray leading-relaxed text-sm sm:text-base">
                      {feature.desc}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
