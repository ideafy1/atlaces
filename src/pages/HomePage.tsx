import React from 'react';
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

export default function HomePage() {
  return (
    <main role="main" id="main-content">
      <Hero />
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
  );
}
