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
import BreathePromo from '../components/BreathePromo';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';
import Navigation from '../components/Navigation';
import TherapyPage from './TherapyPage';
import CommunityPage from './CommunityPage';
import SEOHead from '../components/SEOHead';

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

  const getSeoProps = () => {
    switch (activePage) {
      case 1:
        return {
          title: "Find a Therapist | BrainHeal India",
          description: "Browse verified clinical psychologists, couples therapists, and counsellors in India. ₹0 switching fees. Match within 2 hours.",
          url: "https://brainheal.in/therapy",
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Therapy Services",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Online Therapy" },
              { "@type": "ListItem", "position": 2, "name": "Couples Counseling" },
              { "@type": "ListItem", "position": 3, "name": "Psychiatry" }
            ]
          }
        };
      case 2:
        return {
          title: "Mental Health Community | BrainHeal India",
          description: "Join India's safest anonymous mental health community. Share your story, find support, and realize you are not alone.",
          url: "https://brainheal.in/community"
        };
      case 0:
      default:
        return {
          title: "BrainHeal - India's Premium Online Therapy Platform",
          description: "India's first premium therapist collective. We connect you with verified clinical experts for meaningful, long-term healing.",
          url: "https://brainheal.in/",
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "MedicalBusiness",
            "name": "BrainHeal India",
            "url": "https://brainheal.in/",
            "logo": "https://brainheal.in/logo.png",
            "image": "https://brainheal.in/logo.png",
            "description": "Premium online therapy and counseling services in India.",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "IN"
            }
          }
        };
    }
  };

  const seoProps = getSeoProps();

  return (
    <div className="bg-brand-white font-inter text-brand-black relative overflow-hidden">
      <SEOHead {...seoProps} />
      
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
          aria-hidden={activePage !== 0}
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
            <BreathePromo />
            <FAQ />
          </main>
          <Footer />
        </div>

        {/* Therapy */}
        <div
          className="w-full"
          aria-hidden={activePage !== 1}
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
          aria-hidden={activePage !== 2}
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
