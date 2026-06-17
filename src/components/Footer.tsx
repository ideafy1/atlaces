import React from 'react';
import { useData } from '../DataContext';
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Apple, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const { data } = useData();

  return (
    <footer className="w-full bg-[#EAF2F6] flex flex-col pt-12" itemScope itemType="https://schema.org/WPFooter">
      
      {/* Disclaimer Top */}
      <div className="text-center text-xs text-[#000000] mb-8 px-6">
        By signing up, I agree to the <Link to="/terms" className="font-bold underline">Terms of Use</Link> and to receive emails from BrainHeal.
      </div>

      {/* Main Dark Footer Area */}
      <div className="bg-[#185C78] text-white px-6 md:px-16 pt-16 pb-12 w-full md:w-[95%] lg:w-[90%] max-w-[1440px] mx-auto overflow-hidden relative md:rounded-lg">
        <div className="flex flex-col md:flex-row justify-between gap-12 relative z-10">
          
          {/* Left: App Download & Mockup */}
          <div className="w-full md:w-1/3 flex flex-col items-center md:items-start relative">
            <h3 className="text-lg font-bold mb-4 font-sans tracking-tight">Download the app</h3>
            <div className="bg-white p-2.5 rounded-xl mb-8 w-32 h-32 flex items-center justify-center shadow-lg">
              {/* Generated QR Code using public API for realism */}
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://brainheal.in&color=185C78" alt="QR Code" className="w-full h-full object-contain" />
            </div>
            
            {/* Store Buttons */}
            <div className="flex flex-col gap-3 w-full sm:w-auto">
              <a href="#" className="flex items-center gap-3 bg-brand-black/20 border border-white/10 text-white px-5 py-2.5 rounded-xl hover:bg-brand-black/40 transition-colors backdrop-blur-sm">
                <Apple className="w-6 h-6" />
                <div className="flex flex-col items-start">
                  <span className="text-[10px] leading-none text-gray-300">Download on the</span>
                  <span className="text-sm font-bold leading-tight">App Store</span>
                </div>
              </a>
              <a href="#" className="flex items-center gap-3 bg-brand-black/20 border border-white/10 text-white px-5 py-2.5 rounded-xl hover:bg-brand-black/40 transition-colors backdrop-blur-sm">
                <Play className="w-5 h-5 ml-0.5" />
                <div className="flex flex-col items-start ml-0.5">
                  <span className="text-[10px] leading-none text-gray-300">GET IT ON</span>
                  <span className="text-sm font-bold leading-tight">Google Play</span>
                </div>
              </a>
            </div>
          </div>
          
          {/* Right: Links */}
          <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-8 md:pl-12 lg:pl-24">
            {/* Company */}
            <div>
              <h4 className="text-[22px] font-instrument mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-gray-200">
                <li><Link to="/#reviews" className="hover:text-white transition-all">Reviews</Link></li>
                <li><Link to="/careers" className="hover:text-white transition-all">Careers</Link></li>
                <li><Link to="/press" className="hover:text-white transition-all">Press</Link></li>
                <li><Link to="/apply" className="hover:text-white transition-all">Join as Therapist</Link></li>
                <li><Link to="/about" className="hover:text-white transition-all">BrainHeal difference</Link></li>
              </ul>
            </div>
            
            {/* Resources */}
            <div>
              <h4 className="text-[22px] font-instrument mb-6">Resources</h4>
              <ul className="space-y-4 text-sm text-gray-200">
                <li><Link to="/help" className="hover:text-white transition-all">Help center</Link></li>
                <li><Link to="/breathe" className="hover:text-white transition-all">Blog</Link></li>
                <li><Link to="/community" className="hover:text-white transition-all">Community</Link></li>
                <li><Link to="/conditions" className="hover:text-white transition-all">Mental health conditions</Link></li>
                <li><Link to="/tests" className="hover:text-white transition-all">Free mental health tests</Link></li>
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h4 className="text-[22px] font-instrument mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-gray-200">
                <li><Link to="/privacy" className="hover:text-white transition-all">Privacy policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-all">Terms of use</Link></li>
                <li><Link to="/accessibility" className="hover:text-white transition-all">Accessibility</Link></li>
                <li><Link to="/privacy-settings" className="hover:text-white transition-all">Privacy settings</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Bottom Rows (Addresses, Social, Trustpilot) */}
        <div className="mt-16 md:mt-24 pt-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 relative z-10 border-t border-white/20">
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 w-full md:w-auto lg:pl-12">
            <div>
              <h5 className="text-[13px] font-bold mb-2 tracking-tight">Business Correspondence</h5>
              <p className="text-xs text-gray-200 leading-relaxed">
                BrainHeal India<br />
                Koramangala, Bengaluru<br />
                Karnataka 560034
              </p>
            </div>
            <div>
              <h5 className="text-[13px] font-bold mb-2 tracking-tight">Support / Claims</h5>
              <p className="text-xs text-gray-200 leading-relaxed">
                help@brainheal.in<br />
                +91 98765 43210
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-6 w-full md:w-auto">
            {/* Socials */}
            <div className="flex items-center gap-5">
              <a href="https://facebook.com" className="hover:opacity-75 transition-opacity"><Facebook className="w-[18px] h-[18px] fill-current" /></a>
              <a href="https://twitter.com" className="hover:opacity-75 transition-opacity"><Twitter className="w-[18px] h-[18px] fill-current" /></a>
              <a href="https://instagram.com" className="hover:opacity-75 transition-opacity"><Instagram className="w-[18px] h-[18px]" /></a>
              <a href="https://linkedin.com" className="hover:opacity-75 transition-opacity"><Linkedin className="w-[18px] h-[18px] fill-current" /></a>
            </div>
            
            {/* Reviews badge */}
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-semibold">Excellent</span>
              <div className="flex gap-[2px] text-[#00B67A]">
                {'★★★★★'.split('').map((star, i) => <span key={i} className="bg-[#00B67A] text-white text-[11px] w-[18px] h-[18px] flex items-center justify-center rounded-[2px]">{star}</span>)}
              </div>
              <span className="text-[13px] underline text-gray-200 ml-1">2,231 reviews on</span>
              <span className="text-[15px] font-bold flex items-center gap-1 text-[#00B67A]">
                <span className="text-[18px] mb-1">★</span> Trustpilot
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Disclaimer */}
      <div className="w-full text-center text-xs text-[#185C78] pt-6 pb-12 px-6 bg-[#EAF2F6]">
        If you are in a life threatening situation - don't use this site. Call <span className="font-bold">112</span> or use <Link to="/resources" className="font-bold underline">these resources</Link> to get immediate help.
      </div>
    </footer>
  );
}
