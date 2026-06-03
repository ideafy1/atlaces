import React from 'react';
import { useData } from '../DataContext';
import { useNavigate } from 'react-router-dom';

export default function Stats() {
  const navigate = useNavigate();
  const { data } = useData();
  const st = data?.stats || {};
  const metrics = st?.metrics || [];

  return (
    <section className="py-24 px-6 bg-[#FAFAFA] text-center border-y border-gray-100">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-instrument mb-16 tracking-tight scroll-reveal delay-100">
          {st.title}{' '}
          <span className="italic text-brand-gray">{st.subtitle}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {metrics.map((stat: any, i: number) => (
            <div key={i} className="flex flex-col items-center scroll-reveal" style={{ transitionDelay: `${200 + i * 100}ms` }}>
              <div className="text-4xl sm:text-5xl font-instrument text-brand-black mb-2 tracking-tight">
                {stat.val}
              </div>
              <div className="text-brand-gray text-lg font-inter">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-32">
          <h2 className="text-4xl sm:text-5xl font-instrument mb-6 text-brand-black max-w-3xl mx-auto leading-tight tracking-tight scroll-reveal delay-100">
            {st.ctaTitle}{' '}
            <span className="italic text-brand-gray">{st.ctaSubtitle}</span>
          </h2>
          <p className="text-brand-gray font-inter max-w-2xl mx-auto mb-16 text-lg leading-relaxed scroll-reveal delay-200">
            {st.ctaText}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-4xl mx-auto">
            <div className="bg-[#f0fdf4] p-10 rounded-2xl flex-1 flex flex-col items-center justify-center text-center scroll-reveal delay-300">
              <div className="w-16 h-16 flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-instrument font-medium mb-2 text-green-950">Talk to someone</h3>
              <p className="text-green-800 text-sm mb-8">Get matched with a verified therapist in 2 hours.</p>
              <button className="bg-green-600 text-white rounded-full px-8 py-3 text-sm font-medium hover:bg-green-700 transition-colors w-full">Start Intake</button>
            </div>
            
            <div className="bg-brand-black p-10 rounded-2xl flex-1 flex flex-col items-center justify-center text-center scroll-reveal delay-400">
              <div className="w-16 h-16 flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-brand-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-instrument font-medium mb-2 text-brand-white">Join as a Therapist</h3>
              <p className="text-gray-400 text-sm mb-8">Apply to join India's premium verified collective.</p>
              <button onClick={() => navigate('/apply')} className="bg-brand-white text-brand-black rounded-full px-8 py-3 text-sm font-medium hover:bg-gray-100 transition-colors w-full">Apply Now</button>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-16 uppercase tracking-widest scroll-reveal delay-500">
            BRAINHEAL · YOUR SANCTUARY FOR MENTAL PEACE
          </p>
        </div>
      </div>
    </section>
  );
}
