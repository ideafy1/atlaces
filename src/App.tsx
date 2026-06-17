/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './DataContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import TherapyPage from './pages/TherapyPage';
import CommunityPage from './pages/CommunityPage';
import Admin from './pages/Admin';
import TherapistProfile from './pages/TherapistProfile';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import ApplyTherapist from './pages/ApplyTherapist';
import BlogListPage from './pages/BlogListPage';
import BlogPostPage from './pages/BlogPostPage';

const seoProps = {
  home: {
    title: "BrainHeal - India's Premium Online Therapy Platform",
    description: "India's first premium therapist collective. We connect you with verified clinical experts for meaningful, long-term healing.",
    url: "https://brainheal.in/",
  },
  therapy: {
    title: "Find a Therapist | BrainHeal India",
    description: "Browse verified clinical psychologists, couples therapists, and counsellors in India. ₹0 switching fees. Match within 2 hours.",
    url: "https://brainheal.in/therapy",
  },
  community: {
    title: "Mental Health Community | BrainHeal India",
    description: "Join India's safest anonymous mental health community. Share your story, find support, and realize you are not alone.",
    url: "https://brainheal.in/community"
  }
};

export default function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout seoProps={seoProps.home}><HomePage /></Layout>} />
          <Route path="/therapy" element={<Layout seoProps={seoProps.therapy}><TherapyPage /></Layout>} />
          <Route path="/community" element={<Layout seoProps={seoProps.community}><CommunityPage /></Layout>} />
          <Route path="/therapist/:slug" element={<Layout><TherapistProfile /></Layout>} />
          <Route path="/privacy" element={<Layout><PrivacyPolicy /></Layout>} />
          <Route path="/terms" element={<Layout><TermsConditions /></Layout>} />
          <Route path="/apply" element={<Layout><ApplyTherapist /></Layout>} />
          <Route path="/breathe" element={<Layout><BlogListPage /></Layout>} />
          <Route path="/breathe/:slug" element={<Layout><BlogPostPage /></Layout>} />
          <Route path="/makechanges" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </DataProvider>
  );
}
