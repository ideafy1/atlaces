import React from 'react';
import { useData } from '../DataContext';

export default function Footer() {
  const { data } = useData();
  const foot = data?.footer || {};
  const socials = Array.isArray(foot?.socials) ? foot.socials : [];

  return (
    <footer className="bg-brand-black text-brand-white pt-24 pb-12 px-6" itemScope itemType="https://schema.org/WPFooter">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-24">
          <div className="w-full md:w-1/3">
            <a href="/" className="text-3xl font-instrument mb-6 tracking-tight block hover:opacity-80 transition-opacity">{foot.logoText || 'BrainHeal'}</a>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              {foot.description || foot.tagline || ''}
            </p>
          </div>
          
          <div className="w-full md:w-2/3 flex flex-wrap gap-12 sm:gap-24 justify-start md:justify-end">
            <nav aria-label="Quick links">
              <h4 className="text-sm font-medium mb-6 uppercase tracking-widest text-gray-500">Links</h4>
              <ul className="space-y-4">
                <li><a href="/#how-it-works" className="text-gray-300 hover:text-white transition-colors text-sm">How it works</a></li>
                <li><a href="/therapy" className="text-gray-300 hover:text-white transition-colors text-sm">Browse Therapists</a></li>
                <li><a href="/community" className="text-gray-300 hover:text-white transition-colors text-sm">Community</a></li>
                <li><a href="/contact" className="text-gray-300 hover:text-white transition-colors text-sm">Contact</a></li>
                <li><a href="/apply" className="text-gray-300 hover:text-white transition-colors text-sm">Apply as Therapist</a></li>
              </ul>
            </nav>
            
            <nav aria-label="Legal">
              <h4 className="text-sm font-medium mb-6 uppercase tracking-widest text-gray-500">Legal</h4>
              <ul className="space-y-4">
                <li><a href="/privacy" className="text-gray-300 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
                <li><a href="/terms" className="text-gray-300 hover:text-white transition-colors text-sm">Terms and Conditions</a></li>
                <li><a href="/terms#5" className="text-gray-300 hover:text-white transition-colors text-sm">Refund Policy</a></li>
              </ul>
            </nav>
            
            <div>
              <h4 className="text-sm font-medium mb-6 uppercase tracking-widest text-gray-500">Social</h4>
              <ul className="space-y-4">
                <li><a href="https://www.linkedin.com/in/brainheal/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors text-sm">LinkedIn</a></li>
                <li><a href="https://www.instagram.com/brainheal.in" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors text-sm">Instagram</a></li>
                <li><a href="https://www.facebook.com/brainheal.in" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors text-sm">Facebook</a></li>
                <li><a href="https://www.youtube.com/@BrainHeal-india" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors text-sm">YouTube</a></li>
                <li><a href="https://www.reddit.com/user/brainheal-india/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors text-sm">Reddit</a></li>
                <li><a href="https://www.pinterest.com/brainheal_india" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors text-sm">Pinterest</a></li>
                <li><a href="https://www.quora.com/profile/Brain-Heal" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors text-sm">Quora</a></li>
              </ul>
            </div>
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
