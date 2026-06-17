import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Home, Brain, Users, BookOpen, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import GsapButton from './GsapButton';

const tabs = [
  { label: 'Home', Icon: Home, path: '/' },
  { label: 'Therapy', Icon: Brain, path: '/therapy' },
  { label: 'Community', Icon: Users, path: '/community' },
  { label: 'Breathe', Icon: BookOpen, path: '/breathe' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  const mobileMenu = isOpen ? createPortal(
    <div
      className="fixed inset-0 md:hidden flex flex-col z-[99999]"
      style={{ background: '#FBF6EF' }}
    >
      <div className="flex justify-between items-center px-6 py-4 border-b border-[#E6DCCD]">
        <Link to="/" className="flex items-center gap-3" onClick={closeMenu}>
          <img src="/logo.svg" alt="BrainHeal" className="w-12 h-12 sm:w-14 sm:h-14 object-contain" />
          <span className="font-sans font-medium text-2xl text-[#000000]">BrainHeal</span>
        </Link>
        <button onClick={closeMenu} className="p-2 -mr-2 text-[#000000]">
          <X className="w-7 h-7" />
        </button>
      </div>

      <div className="flex-1 flex flex-col px-8 py-8 gap-4 overflow-y-auto">
        {tabs.map((tab, i) => {
          const isActive = currentPath === tab.path || (tab.path !== '/' && currentPath.startsWith(tab.path));
          return (
            <Link
              key={i}
              to={tab.path}
              onClick={closeMenu}
              className={`flex items-center gap-4 px-6 py-4 rounded-xl text-lg font-medium transition-colors ${
                isActive ? 'bg-[#20759A] text-white' : 'text-[#000000] hover:bg-[#EAF2F6]'
              }`}
            >
              <tab.Icon className="w-5 h-5" />
              {tab.label}
            </Link>
          );
        })}
        
        <div className="mt-8 border-t border-[#E6DCCD] pt-8 flex flex-col gap-4">
          <Link to="/login" onClick={closeMenu} className="px-6 py-4 text-center text-[#000000] font-medium hover:bg-[#EAF2F6] rounded-xl transition-colors">
            Log in
          </Link>
          <Link to="/therapy" onClick={closeMenu} className="w-full">
            <GsapButton 
              variant="solid"
              className="w-full px-6 py-4 text-lg"
            >
              Find a therapist
            </GsapButton>
          </Link>
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <header className="w-full sticky top-0 z-[100] flex flex-col shadow-sm">
        {/* Top Banner */}
        <div className="w-full bg-[#185C78] text-white text-xs sm:text-sm py-2 px-4 text-center font-medium">
          Get matched with a verified therapist in 2 hours. <Link to="/therapy" className="underline underline-offset-2 hover:text-[#A8C9D9] transition-colors">Start healing today {'>'}</Link>
        </div>
        
        {/* Main Navbar */}
        <div className="w-full bg-[#FBF6EF] border-b border-[#E6DCCD]">
          <nav className="max-w-[1440px] mx-auto flex justify-between items-center px-6 sm:px-8 py-2 lg:py-2.5 w-full">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo.svg"
              alt="BrainHeal Logo"
              className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
            />
            <span className="font-sans font-semibold text-xl tracking-tight text-[#000000]">
              BrainHeal
            </span>
          </Link>

          {/* Middle: Links */}
          <div className="hidden md:flex items-center gap-8">
            {tabs.map((tab, i) => {
              const isActive = currentPath === tab.path || (tab.path !== '/' && currentPath.startsWith(tab.path));
              return (
                <Link
                  key={i}
                  to={tab.path}
                  className={`text-sm font-medium transition-colors hover:text-[#20759A] ${
                    isActive ? 'text-[#20759A]' : 'text-[#000000]'
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>

          {/* Right: Actions */}
          <div className="hidden md:flex items-center gap-5">
            <Link to="/login" className="text-sm font-medium text-[#000000] hover:text-[#20759A] transition-colors">
              Log in
            </Link>
            <Link to="/therapy">
              <GsapButton
                variant="solid"
                className="px-6 py-2.5 text-sm"
                aria-label="Find a verified therapist"
              >
                Find a therapist
              </GsapButton>
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-[#000000] p-2 -mr-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
        </div>
      </header>

      {mobileMenu}
    </>
  );
}
