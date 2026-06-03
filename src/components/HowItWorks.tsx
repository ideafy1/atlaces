import React, { useState, useEffect } from 'react';
import { Check, ArrowRight, Star, Shield, Clock, Brain, MessageCircle, Heart } from 'lucide-react';
import { useData } from '../DataContext';

export default function HowItWorks() {
  const { data } = useData();
  const how = data?.howItWorks || {};
  const steps = how?.steps || [];
  const [activeStep, setActiveStep] = useState(0);

  // Auto-cycle through steps
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Phone screen content for each step
  const phoneScreens = [
    // Step 1: Tell us what you're going through
    (
      <div className="flex flex-col h-full">
        <p className="text-xs font-semibold text-brand-gray mb-4">What brings you here?</p>
        <div className="space-y-2.5 flex-1">
          {['😰 Anxiety & Stress', '😔 Feeling Low', '💔 Relationship Issues', '😤 Burnout', '🌱 Self Growth', '😴 Sleep Problems'].map((item, i) => (
            <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-500 cursor-default ${i <= activeStep ? 'border-brand-black bg-gray-50 scale-[1.02]' : 'border-gray-200 bg-white'}`}
              style={{ transitionDelay: `${i * 80}ms` }}>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${i <= 1 ? 'border-brand-black bg-brand-black' : 'border-gray-300'}`}>
                {i <= 1 && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </div>
              <span className="text-xs font-medium text-brand-black">{item}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    // Step 2: Get matched
    (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="relative mb-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-green-50 flex items-center justify-center">
            <Brain className="w-9 h-9 text-emerald-600" />
          </div>
          <div className="absolute -top-1 -right-1 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
            <Check className="w-4 h-4 text-white" strokeWidth={3} />
          </div>
        </div>
        <h4 className="font-instrument text-lg text-brand-black mb-1">Perfect Match Found</h4>
        <p className="text-[11px] text-brand-gray mb-5">Based on your needs and preferences</p>

        <div className="w-full bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
              <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=100&auto=format&fit=crop" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-brand-black">Dr. Saachi Arora</p>
              <p className="text-[10px] text-brand-gray">Clinical Psychologist · 8 yrs</p>
            </div>
            <div className="ml-auto flex items-center gap-0.5 bg-green-50 px-2 py-0.5 rounded-md">
              <Star className="w-3 h-3 fill-green-600 text-green-600" />
              <span className="text-[10px] font-bold text-green-700">4.9</span>
            </div>
          </div>
          <div className="flex gap-1.5">
            {['Anxiety', 'Low Mood', 'Stress'].map(t => (
              <span key={t} className="px-2 py-0.5 rounded-md bg-white text-[9px] font-medium text-brand-gray border border-gray-100">{t}</span>
            ))}
          </div>
        </div>
      </div>
    ),
    // Step 3: Start first session
    (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-semibold text-green-700">Session in progress</span>
        </div>
        <div className="flex-1 bg-gradient-to-b from-gray-50 to-white rounded-2xl p-4 border border-gray-100 flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 rounded-2xl overflow-hidden mb-4 ring-2 ring-green-400 ring-offset-2">
            <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=100&auto=format&fit=crop" alt="" className="w-full h-full object-cover" />
          </div>
          <p className="text-xs font-semibold text-brand-black mb-0.5">Dr. Saachi Arora</p>
          <p className="text-[10px] text-brand-gray mb-4">Video Session · 42:15</p>
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"><MessageCircle className="w-4 h-4 text-brand-gray" /></div>
            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center"><div className="w-4 h-1.5 bg-white rounded-full" /></div>
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"><Shield className="w-4 h-4 text-brand-gray" /></div>
          </div>
        </div>
      </div>
    ),
    // Step 4: Heal at your pace - Community
    (
      <div className="flex flex-col h-full">
        <p className="text-xs font-semibold text-brand-gray mb-3">Community support</p>
        <div className="space-y-2.5 flex-1">
          {[
            { name: 'Brave Lotus', color: 'from-violet-500 to-purple-600', msg: 'Today was hard but I showed up anyway. That counts.', mood: '💪 Hopeful', reactions: 12 },
            { name: 'Calm River', color: 'from-cyan-500 to-blue-600', msg: 'Three months of therapy. I can finally sleep through the night.', mood: '🙏 Grateful', reactions: 24 },
            { name: 'Gentle Moon', color: 'from-rose-500 to-pink-600', msg: 'Is it normal to feel worse before you feel better?', mood: '😔 Feeling low', reactions: 8 },
          ].map((post, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-3 border border-gray-100" style={{ animation: `fadeSlideUp 0.4s ease ${i * 0.15}s both` }}>
              <div className="flex items-center gap-2 mb-1.5">
                <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${post.color} flex items-center justify-center`}>
                  <span className="text-white text-[7px] font-bold">{post.name.split(' ').map(w => w[0]).join('')}</span>
                </div>
                <span className="text-[10px] font-semibold text-brand-black">{post.name}</span>
                <span className="text-[8px] text-brand-gray ml-auto">{post.mood}</span>
              </div>
              <p className="text-[10px] text-brand-gray leading-relaxed pl-7">{post.msg}</p>
              <div className="flex items-center gap-1 mt-1.5 pl-7">
                <Heart className="w-3 h-3 text-red-400 fill-red-400" />
                <span className="text-[9px] text-brand-gray font-medium">{post.reactions}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  ];

  return (
    <section className="py-24 px-6 bg-[#FAFAFA]" aria-label="How BrainHeal therapy works" itemScope itemType="https://schema.org/HowTo">
      <meta itemProp="name" content="How to get started with BrainHeal online therapy" />
      <meta itemProp="description" content="Get matched with a verified therapist in India in 4 simple steps" />

      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-instrument mb-16 text-center text-brand-black tracking-tight scroll-reveal delay-100">
          {how.title} <span className="italic text-brand-gray">{how.subtitle}</span>
        </h2>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          {/* Left: Steps */}
          <div className="w-full lg:w-1/2 flex flex-col">
            {steps.map((step: any, i: number) => (
              <button
                key={step.num}
                onClick={() => setActiveStep(i)}
                className={`group flex gap-6 py-8 text-left transition-all duration-300 ${
                  i !== steps.length - 1 ? 'border-b border-gray-200' : ''
                } ${activeStep === i ? 'opacity-100' : 'opacity-60 hover:opacity-80'}`}
                itemProp="step" itemScope itemType="https://schema.org/HowToStep"
              >
                <meta itemProp="position" content={String(i + 1)} />
                <span className={`font-instrument text-3xl sm:text-4xl select-none leading-none pt-1 min-w-[48px] transition-colors duration-300 ${
                  activeStep === i ? 'text-brand-black' : 'text-brand-black/15 group-hover:text-brand-black/30'
                }`}>
                  {step.num}
                </span>
                <div>
                  <h3 className="font-inter text-lg sm:text-xl font-semibold text-brand-black mb-2 leading-snug" itemProp="name">{step.title}</h3>
                  <p className="font-inter text-sm sm:text-[15px] text-brand-gray leading-relaxed max-w-md" itemProp="text">{step.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Right: Interactive phone mockup */}
          <div className="w-full lg:w-1/2 flex justify-center scroll-reveal delay-300">
            <div className="relative">
              <div className="absolute -inset-8 bg-gradient-to-br from-violet-100/40 via-transparent to-emerald-50/40 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative w-[280px] sm:w-[300px] h-[580px] sm:h-[610px] bg-white rounded-[44px] border-[8px] border-gray-900 shadow-2xl overflow-hidden flex flex-col">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-gray-900 rounded-b-2xl z-20" />
                
                {/* Screen content with transition */}
                <div className="pt-12 px-5 pb-5 flex-1 flex flex-col overflow-hidden">
                  <div key={activeStep} style={{ animation: 'fadeSlideUp 0.5s ease-out' }} className="flex-1 flex flex-col">
                    {phoneScreens[activeStep]}
                  </div>

                  {/* Bottom button */}
                  <button className="w-full bg-brand-black text-white rounded-full py-3.5 mt-auto text-sm font-medium flex items-center justify-center gap-2 cursor-default">
                    {activeStep === 0 ? 'Continue' : activeStep === 1 ? 'Book First Session' : activeStep === 2 ? 'End Session' : 'Share Your Story'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Step indicator dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                  {[0,1,2,3].map(i => (
                    <div key={i} className={`h-1 rounded-full transition-all duration-500 ${activeStep === i ? 'w-5 bg-brand-black' : 'w-1.5 bg-gray-300'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
