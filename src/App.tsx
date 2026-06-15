/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './DataContext';
import Website from './pages/Website';
import Admin from './pages/Admin';
import TherapistProfile from './pages/TherapistProfile';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import ApplyTherapist from './pages/ApplyTherapist';
import BlogListPage from './pages/BlogListPage';
import BlogPostPage from './pages/BlogPostPage';

export default function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Website />} />
          <Route path="/therapy" element={<Website initialPage={1} />} />
          <Route path="/community" element={<Website initialPage={2} />} />
          <Route path="/therapist/:slug" element={<TherapistProfile />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/apply" element={<ApplyTherapist />} />
          <Route path="/breathe" element={<BlogListPage />} />
          <Route path="/breathe/:slug" element={<BlogPostPage />} />
          <Route path="/makechanges" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </DataProvider>
  );
}
