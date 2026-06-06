import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Home, Brain, Users, Mail, Menu, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const tabs = [
  { label: 'Home', Icon: Home, path: '/' },
  { label: 'Therapy', Icon: Brain, path: '/therapy' },
  { label: 'Community', Icon: Users, path: '/community' },
];

interface NavigationProps {
  activePage?: number;
  onPageChange?: (page: number) => void;
}

export default function Navigation({ activePage = 0, onPageChange }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleNav = (page: number) => {
    onPageChange?.(page);
    navigate(tabs[page].path);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Mobile menu rendered via portal so it escapes ALL stacking contexts
  const mobileMenu = isOpen ? createPortal(
    <div
      className="fixed inset-0 md:hidden flex flex-col"
      style={{
        zIndex: 99999,
        background: 'rgba(255,255,255,0.98)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
    >
      {/* Top bar inside menu */}
      <div className="flex justify-between items-center px-6 py-5">
        <div className="flex items-center gap-3" onClick={() => handleNav(0)}>
          <img src="/logo.png" alt="BrainHeal" className="w-10 h-10 rounded-full object-cover" />
          <span className="font-instrument text-2xl text-brand-black">BrainHeal</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="p-2 -mr-2" aria-label="Close menu">
          <X className="w-7 h-7 text-brand-black" />
        </button>
      </div>

      {/* Menu items */}
      <div className="flex-1 flex flex-col justify-center px-8 pb-20">
        <div className="flex flex-col gap-3">
          {tabs.map((tab, i) => {
            const isActive = activePage === i;
            return (
              <a
                key={i}
                href={tab.path}
                onClick={(e) => { e.preventDefault(); handleNav(i); }}
                className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl text-left transition-all duration-300 ${
                  isActive
                    ? 'bg-brand-black text-white shadow-lg'
                    : 'bg-gray-50 text-brand-black hover:bg-gray-100 active:bg-gray-200'
                }`}
                style={{ animation: `menuSlideIn 0.3s ease-out ${i * 0.08}s both` }}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isActive ? 'bg-white/20' : 'bg-white shadow-sm'}`}>
                  <tab.Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-brand-black'}`} fill={isActive ? 'currentColor' : 'none'} />
                </div>
                <span className="font-instrument text-2xl">{tab.label}</span>
              </a>
            );
          })}

          <a
            href="/therapy"
            className="w-full mt-4 bg-brand-black text-white rounded-2xl px-8 py-5 text-lg font-medium flex items-center justify-center gap-3 active:scale-95 transition-transform duration-200"
            onClick={(e) => { e.preventDefault(); handleNav(1); }}
            style={{ animation: 'menuSlideIn 0.3s ease-out 0.24s both' }}
          >
            Start Healing
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>

      <style>{`
        @keyframes menuSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <header role="banner" className="relative z-[100]">
        <nav role="navigation" aria-label="Main" className="flex justify-between items-center px-6 sm:px-8 py-5 max-w-7xl mx-auto w-full relative">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNav(0)}>
            <img
              src="/logo.png"
              alt="BrainHeal Logo"
              className="w-10 h-10 md:w-11 md:h-11 rounded-full object-cover"
              loading="eager"
            />
            <div className="flex flex-col">
              <div className="font-instrument text-2xl md:text-3xl tracking-tight text-brand-black leading-none">
                BrainHeal
              </div>
              <div className="text-[8px] font-inter text-brand-gray tracking-[0.2em] uppercase mt-0.5">
                Your sanctuary for mental peace
              </div>
            </div>
          </div>

          {/* Desktop floating pill nav */}
          <div
            className="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-full border border-gray-200/80"
            style={{
              background: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 2px 16px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)',
            }}
          >
            {tabs.map((tab, i) => {
              const isActive = activePage === i;
              return (
                <a
                  key={i}
                  href={tab.path}
                  onClick={(e) => { e.preventDefault(); handleNav(i); }}
                  className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium ${
                    isActive
                      ? 'bg-brand-black text-white shadow-md'
                      : 'text-brand-gray hover:text-brand-black hover:bg-gray-100/80'
                  }`}
                  style={{ transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                >
                  <tab.Icon className="w-4 h-4" strokeWidth={isActive ? 2.2 : 1.8} fill={isActive ? 'currentColor' : 'none'} />
                  {tab.label}
                </a>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <a
            href="/therapy"
            onClick={(e) => { e.preventDefault(); handleNav(1); }}
            className="hidden md:flex items-center gap-2 bg-brand-black text-white rounded-full pl-6 pr-5 py-2.5 text-sm font-medium hover:gap-3 transition-all duration-300 group"
          >
            Start Healing
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
          </a>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-brand-black p-2 -mr-2"
            style={{ zIndex: 100000 }}
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </header>

      {/* Portal-rendered mobile menu */}
      {mobileMenu}
    </>
  );
}
