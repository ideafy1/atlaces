import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import Footer from './Footer';
import BottomNav from './BottomNav';
import SEOHead from './SEOHead';

interface LayoutProps {
  children: ReactNode;
  seoProps?: any;
}

export default function Layout({ children, seoProps }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="bg-brand-white font-sans text-brand-black relative overflow-x-hidden min-h-screen flex flex-col">
      {seoProps && <SEOHead {...seoProps} />}
      
      {/* Global docked nav */}
      <Navigation />

      {/* Page transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex-grow relative z-0"
        >
          {children}
        </motion.div>
      </AnimatePresence>

      <Footer />

      {/* Mobile bottom nav */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
