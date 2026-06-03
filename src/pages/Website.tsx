import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import WhatsIncluded from '../components/WhatsIncluded';
import HowItWorks from '../components/HowItWorks';
import Chapters from '../components/Chapters';
import Services from '../components/Services';
import Providers from '../components/Providers';
import Stats from '../components/Stats';
import Reviews from '../components/Reviews';
import Comparison from '../components/Comparison';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';
import Navigation from '../components/Navigation';
import TherapyPage from './TherapyPage';
import CommunityPage from './CommunityPage';

const paths = ['/', '/therapy', '/community'];

interface WebsiteProps {
  initialPage?: number;
}

export default function Website({ initialPage = 0 }: WebsiteProps) {
  const [activePage, setActivePage] = useState(initialPage);
  const [transitioning, setTransitioning] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Sync URL → state
  useEffect(() => {
    const idx = paths.indexOf(location.pathname);
    if (idx >= 0 && idx !== activePage) {
      setActivePage(idx);
    }
  }, [location.pathname]);

  const handlePageChange = (page: number) => {
    if (page === activePage) return;
    setTransitioning(true);
    setActivePage(page);
    navigate(paths[page]);
    window.scrollTo({ top: 0 });
    setTimeout(() => setTransitioning(false), 500);
  };

  return (
    <div className="bg-brand-white font-inter text-brand-black relative overflow-hidden">
      {/* Desktop-only sticky nav for Therapy/Community */}
      {activePage !== 0 && (
        <div className="hidden md:block sticky top-0 z-[100] bg-white/90 backdrop-blur-xl border-b border-gray-100/50">
          <Navigation activePage={activePage} onPageChange={handlePageChange} />
        </div>
      )}

      <div className="relative" style={{ minHeight: '100vh' }}>
        {/* Home */}
        <div
          className="w-full"
          style={{
            opacity: activePage === 0 ? 1 : 0,
            transform: activePage === 0 ? 'scale(1)' : 'scale(0.95)',
            position: activePage === 0 ? 'relative' : 'absolute',
            top: 0, left: 0, right: 0,
            transition: 'opacity 0.45s ease, transform 0.45s ease',
            pointerEvents: activePage === 0 ? 'auto' : 'none',
            willChange: 'transform, opacity',
          }}
        >
          <main role="main" id="main-content">
            <Hero activePage={activePage} onPageChange={handlePageChange} />
            <WhatsIncluded />
            <HowItWorks />
            <Chapters />
            <Services />
            <Providers />
            <Stats />
            <Reviews />
            <Comparison />
            <FAQ />
          </main>
          <Footer />
        </div>

        {/* Therapy */}
        <div
          className="w-full"
          style={{
            opacity: activePage === 1 ? 1 : 0,
            transform: activePage === 1 ? 'scale(1) translateY(0)' : 'scale(1.02) translateY(20px)',
            position: activePage === 1 ? 'relative' : 'absolute',
            top: 0, left: 0, right: 0,
            transition: 'opacity 0.45s ease, transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: activePage === 1 ? 'auto' : 'none',
            willChange: 'transform, opacity',
          }}
        >
          <TherapyPage />
        </div>

        {/* Community */}
        <div
          className="w-full"
          style={{
            opacity: activePage === 2 ? 1 : 0,
            transform: activePage === 2 ? 'scale(1) translateY(0)' : 'scale(1.02) translateY(20px)',
            position: activePage === 2 ? 'relative' : 'absolute',
            top: 0, left: 0, right: 0,
            transition: 'opacity 0.45s ease, transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: activePage === 2 ? 'auto' : 'none',
            willChange: 'transform, opacity',
          }}
        >
          <CommunityPage />
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden">
        <BottomNav active={activePage} onChange={handlePageChange} />
      </div>
    </div>
  );
}
