import React from 'react';
import { useData } from '../DataContext';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();
  const { data } = useData();
  const foot = data?.footer || {};
  const links = Array.isArray(foot?.links) ? foot.links : [];
  const legal = Array.isArray(foot?.legal) ? foot.legal : [];
  const socials = Array.isArray(foot?.socials) ? foot.socials : [];

  return (
    <footer className="bg-brand-black text-brand-white pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-24">
          <div className="w-full md:w-1/3">
            <div className="text-3xl font-instrument mb-6 tracking-tight">{foot.logoText || 'BrainHeal'}</div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              {foot.description || foot.tagline || ''}
            </p>
          </div>
          
          <div className="w-full md:w-2/3 flex flex-wrap gap-12 sm:gap-24 justify-start md:justify-end">
            {links.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-6 uppercase tracking-widest text-gray-500">Links</h4>
                <ul className="space-y-4">
                  {links.map((link: string, i: number) => (
                    <li key={i}>
                      <button 
                        onClick={() => link === 'Apply as Therapist' ? navigate('/apply') : null}
                        className="text-gray-300 hover:text-white transition-colors text-sm text-left"
                      >
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div>
                <h4 className="text-sm font-medium mb-6 uppercase tracking-widest text-gray-500">Legal</h4>
                <ul className="space-y-4">
                  <li><a href="/privacy" className="text-gray-300 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
                  <li><a href="/terms" className="text-gray-300 hover:text-white transition-colors text-sm">Terms and Conditions</a></li>
                  <li><a href="/terms#5" className="text-gray-300 hover:text-white transition-colors text-sm">Refund Policy</a></li>
                </ul>
              </div>
            
            {socials.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-6 uppercase tracking-widest text-gray-500">Social</h4>
                <ul className="space-y-4">
                  {socials.map((link: string, i: number) => (
                    <li key={i}><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">{link}</a></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <div>{foot.copyright || '© 2026 BrainHeal India. All rights reserved.'}</div>
          <div className="uppercase tracking-widest">{foot.tagline || 'Built for Peace'}</div>
        </div>
      </div>
    </footer>
  );
}
