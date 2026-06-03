import React, { useState } from 'react';
import { ArrowRight, Brain, Heart, Users, Shield } from 'lucide-react';
import { useData } from '../DataContext';

const cardThemes = [
  {
    gradient: 'from-amber-500 via-orange-500 to-rose-500',
    glow: 'rgba(251, 146, 60, 0.3)',
    accent: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200/60',
    icon: Brain,
    pill: 'bg-amber-100 text-amber-700',
  },
  {
    gradient: 'from-blue-500 via-indigo-500 to-violet-600',
    glow: 'rgba(99, 102, 241, 0.3)',
    accent: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200/60',
    icon: Heart,
    pill: 'bg-indigo-100 text-indigo-700',
  },
  {
    gradient: 'from-emerald-400 via-teal-500 to-cyan-500',
    glow: 'rgba(20, 184, 166, 0.3)',
    accent: 'text-teal-600',
    bg: 'bg-teal-50',
    border: 'border-teal-200/60',
    icon: Users,
    pill: 'bg-teal-100 text-teal-700',
  },
  {
    gradient: 'from-purple-500 via-fuchsia-500 to-pink-500',
    glow: 'rgba(168, 85, 247, 0.3)',
    accent: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200/60',
    icon: Shield,
    pill: 'bg-purple-100 text-purple-700',
  },
];

export default function Services() {
  const { data } = useData();
  const srv = data?.services || {};
  const items = srv?.items || [];
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative py-28 px-6 overflow-hidden" style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 50%, #FFFFFF 100%)' }}>
      {/* Floating background blobs */}
      <div className="absolute top-20 -left-32 w-96 h-96 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute bottom-20 -right-32 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-100/10 to-teal-100/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-20 scroll-reveal delay-100">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-instrument tracking-tight mb-5 text-brand-black">
            {srv.title}{' '}
            <span className="italic bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
              {srv.subtitle}
            </span>
          </h2>
          <p className="text-brand-gray text-base md:text-lg max-w-2xl mx-auto leading-relaxed scroll-reveal delay-200">
            {srv.text}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {items.map((service: any, index: number) => {
            const theme = cardThemes[index % cardThemes.length];
            const Icon = theme.icon;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={index}
                className="relative scroll-reveal"
                style={{ transitionDelay: `${300 + index * 120}ms` }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Glow effect behind card */}
                <div
                  className="absolute -inset-2 rounded-3xl opacity-0 transition-opacity duration-500 blur-xl pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${theme.glow} 0%, transparent 70%)`,
                    opacity: isHovered ? 0.8 : 0,
                  }}
                />

                <div
                  className={`
                    relative bg-white rounded-2xl overflow-hidden cursor-pointer
                    border ${theme.border}
                    transition-all duration-500 ease-out
                    ${isHovered ? 'shadow-2xl -translate-y-3 scale-[1.02]' : 'shadow-sm hover:shadow-md'}
                  `}
                >
                  {/* Image with gradient overlay */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      loading="lazy"
                      className={`
                        w-full h-full object-cover transition-all duration-700 ease-out
                        ${isHovered ? 'scale-110 brightness-105' : 'scale-100'}
                      `}
                    />
                    {/* Gradient overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${theme.gradient} transition-opacity duration-500`}
                      style={{ opacity: isHovered ? 0.25 : 0.05 }}
                    />
                    
                    {/* Floating icon badge */}
                    <div
                      className={`
                        absolute top-4 right-4 w-10 h-10 rounded-xl
                        bg-white/90 backdrop-blur-sm flex items-center justify-center
                        shadow-lg transition-all duration-500
                        ${isHovered ? 'scale-110 rotate-6' : 'scale-100 rotate-0'}
                      `}
                    >
                      <Icon className={`w-5 h-5 ${theme.accent}`} strokeWidth={2} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 pt-5">
                    {/* Category pill */}
                    <div className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase mb-3 ${theme.pill}`}>
                      {service.title}
                    </div>

                    <p className="text-sm font-inter text-brand-gray leading-relaxed mb-5">
                      {service.desc}
                    </p>

                    {/* CTA with animated arrow */}
                    <div className={`flex items-center gap-2 text-sm font-inter font-semibold ${theme.accent} transition-all duration-300`}>
                      <span>Get help now</span>
                      <ArrowRight
                        size={15}
                        strokeWidth={2.5}
                        className={`transition-all duration-300 ${isHovered ? 'translate-x-1.5' : 'translate-x-0'}`}
                      />
                    </div>
                  </div>

                  {/* Animated bottom gradient line */}
                  <div
                    className={`absolute bottom-0 left-0 h-[3px] bg-gradient-to-r ${theme.gradient} transition-all duration-500 ease-out`}
                    style={{ width: isHovered ? '100%' : '0%' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
