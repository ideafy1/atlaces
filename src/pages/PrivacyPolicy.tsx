import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import SEOHead from '../components/SEOHead';

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  const today = 'May 25, 2026';

  return (
    <>
      <SEOHead
        title="Privacy Policy | BrainHeal"
        description="Learn how BrainHeal collects, uses, and protects your personal information. Read our comprehensive privacy policy for our online therapy platform."
        keywords="BrainHeal privacy policy, therapy data privacy, mental health data protection, online therapy privacy"
        url="https://brainheal.in/privacy"
      />
      <div className="min-h-screen bg-[#FAFAFA] font-inter pb-16">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
          <div className="max-w-3xl mx-auto px-5 md:px-8 py-4 flex items-center justify-between">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-brand-gray hover:text-brand-black transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <img src="/logo.svg" alt="BrainHeal" className="w-8 h-8 cursor-pointer object-contain" onClick={() => navigate('/')} />
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-5 md:px-8 py-10">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Legal</p>
          </div>
          <h1 className="font-instrument text-4xl md:text-5xl text-brand-black mb-3">Privacy Policy</h1>
          <p className="text-sm text-brand-gray mb-10">Last updated: {today}</p>

          <div className="prose-legal space-y-8">
            <section>
              <h2>1. Introduction</h2>
              <p>BrainHeal ("we," "our," "us," or the "Company") operates the website brainheal.in and all associated services (collectively, the "Platform"). This Privacy Policy explains how we collect, use, disclose, store, and protect your personal information when you use our Platform, including but not limited to browsing our website, booking therapy sessions, using our community features, and communicating with our therapists.</p>
              <p>By accessing or using our Platform in any way, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. If you do not agree with any part of this Privacy Policy, you must immediately discontinue use of the Platform.</p>
              <p>This Privacy Policy is incorporated into and subject to our Terms and Conditions. Capitalized terms not defined herein shall have the meanings ascribed to them in the Terms and Conditions.</p>
            </section>

            <section>
              <h2>2. Information We Collect</h2>
              <h3>2.1 Personal Information You Provide</h3>
              <p>When you use our Platform, you may provide us with the following categories of personal information:</p>
              <ul>
                <li><strong>Identity Information:</strong> Full name, age, gender identity, and any other identifying information you voluntarily provide during intake or session booking.</li>
                <li><strong>Contact Information:</strong> Email address, phone number, and any alternative contact details you provide.</li>
                <li><strong>Booking Information:</strong> Preferred session format (video, voice, or chat), selected date and time slots, therapist preferences, stated concerns and mental health topics, and session history.</li>
                <li><strong>Health and Wellness Information:</strong> Mental health concerns, therapy history (whether you have tried therapy before), specific areas of focus (e.g., anxiety, depression, relationships, trauma, ADHD), and any other health-related information you voluntarily disclose during the booking process or in community interactions.</li>
                <li><strong>Payment Information:</strong> We may collect billing details necessary to process payments for therapy sessions. Payment processing is handled by secure third-party payment processors, and we do not store your full credit card or debit card numbers on our servers.</li>
                <li><strong>Community Content:</strong> Messages, posts, reactions, replies, and any other content you submit to our community features. Please note that community posts are shared anonymously with other users.</li>
                <li><strong>Communication Data:</strong> Any correspondence between you and BrainHeal, including emails, chat messages, support requests, and feedback.</li>
              </ul>

              <h3>2.2 Information Collected Automatically</h3>
              <p>When you access our Platform, we automatically collect certain technical information, including but not limited to:</p>
              <ul>
                <li><strong>Device Information:</strong> Device type, operating system, browser type and version, screen resolution, and unique device identifiers.</li>
                <li><strong>Usage Data:</strong> Pages visited, time spent on each page, click patterns, navigation flow, features used, and interaction data.</li>
                <li><strong>Log Data:</strong> IP address, access timestamps, referring URLs, error logs, and server response codes.</li>
                <li><strong>Cookies and Tracking Technologies:</strong> We use cookies, web beacons, pixels, and similar technologies to enhance your experience, analyze usage patterns, and deliver personalized content. You may manage cookie preferences through your browser settings, but disabling cookies may impair Platform functionality.</li>
              </ul>

              <h3>2.3 Information from Third Parties</h3>
              <p>We may receive information about you from third-party services, including analytics providers (such as Google Analytics), hosting providers (such as Vercel), database services (such as Google Firebase/Firestore), and notification services (such as Telegram Bot API). This information is used solely for the purposes described in this Privacy Policy.</p>
            </section>

            <section>
              <h2>3. How We Use Your Information</h2>
              <p>We use the information we collect for the following purposes:</p>
              <ul>
                <li><strong>Service Delivery:</strong> To facilitate therapy session bookings, match you with appropriate therapists, process appointments, and manage your account.</li>
                <li><strong>Communication:</strong> To send booking confirmations, session reminders, and service-related notifications via email, SMS, or Telegram. By booking a session, you explicitly consent to receiving these communications.</li>
                <li><strong>Therapist Notifications:</strong> When you book a session, your name, selected date, time, session format, and stated concerns are shared with the selected therapist and the BrainHeal admin team via Telegram for the sole purpose of facilitating your appointment.</li>
                <li><strong>Community Features:</strong> To display your anonymous community posts, process reactions and replies, and enforce community guidelines. Your real identity is not disclosed in community features.</li>
                <li><strong>Platform Improvement:</strong> To analyze usage patterns, diagnose technical issues, improve our services, develop new features, and enhance overall user experience.</li>
                <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, legal processes, or enforceable governmental requests.</li>
                <li><strong>Security:</strong> To detect, prevent, and address fraud, abuse, security threats, and technical issues.</li>
                <li><strong>Marketing:</strong> With your explicit consent, to send you promotional materials, newsletters, and information about new services or features. You may opt out of marketing communications at any time.</li>
              </ul>
            </section>

            <section>
              <h2>4. Data Sharing and Disclosure</h2>
              <p>We do not sell, rent, or trade your personal information to third parties for their marketing purposes. We may share your information in the following limited circumstances:</p>
              <ul>
                <li><strong>With Therapists:</strong> When you book a session, relevant booking information (name, concerns, session format, date, and time) is shared with the selected therapist to facilitate your appointment. Therapists are independent professionals bound by their own professional ethics and confidentiality obligations.</li>
                <li><strong>With Service Providers:</strong> We share data with trusted third-party service providers who assist us in operating the Platform, including cloud hosting (Vercel), database services (Google Firebase/Firestore), notification delivery (Telegram Bot API), and analytics services. These providers are contractually obligated to use your data only for the purposes we specify.</li>
                <li><strong>For Legal Reasons:</strong> We may disclose your information if required by law, court order, subpoena, or other legal process, or if we believe in good faith that such disclosure is necessary to protect our rights, your safety, or the safety of others, investigate fraud, or respond to a government request.</li>
                <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, reorganization, bankruptcy, or sale of all or a portion of our assets, your information may be transferred as part of that transaction. We will notify you of any such change in ownership or control of your personal information.</li>
              </ul>
            </section>

            <section>
              <h2>5. Data Storage and Security</h2>
              <p>Your personal data is stored on Google Firebase/Firestore servers. We implement industry-standard security measures, including encryption in transit (TLS/SSL), access controls, and regular security assessments, to protect your personal information from unauthorized access, alteration, disclosure, or destruction.</p>
              <p>However, no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially reasonable means to protect your personal information, we cannot guarantee its absolute security. You acknowledge and accept this inherent risk when using our Platform.</p>
            </section>

            <section>
              <h2>6. Data Retention</h2>
              <p>We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. Specifically:</p>
              <ul>
                <li><strong>Booking Data:</strong> Retained for a minimum of 3 years from the date of the booking for record-keeping and dispute resolution purposes.</li>
                <li><strong>Community Posts:</strong> Anonymous community posts are automatically deleted after 24 hours from the time of posting.</li>
                <li><strong>Account Data:</strong> Retained for as long as your relationship with BrainHeal is active, and for a reasonable period thereafter.</li>
                <li><strong>Technical/Log Data:</strong> Retained for up to 12 months for analytics and security purposes.</li>
              </ul>
            </section>

            <section>
              <h2>7. Your Rights</h2>
              <p>Subject to applicable law, you may have the following rights regarding your personal information:</p>
              <ul>
                <li><strong>Access:</strong> You may request a copy of the personal information we hold about you.</li>
                <li><strong>Correction:</strong> You may request that we correct any inaccurate or incomplete personal information.</li>
                <li><strong>Deletion:</strong> You may request the deletion of your personal information, subject to our legal obligations and legitimate business interests.</li>
                <li><strong>Objection:</strong> You may object to the processing of your personal information for certain purposes, including direct marketing.</li>
                <li><strong>Data Portability:</strong> You may request a machine-readable copy of your personal information where technically feasible.</li>
              </ul>
              <p>To exercise any of these rights, please contact us at the details provided in Section 11. We will respond to your request within 30 days. We may require verification of your identity before processing any request.</p>
            </section>

            <section>
              <h2>8. Children's Privacy</h2>
              <p>Our Platform is not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If you are under 18 years of age, you must not use the Platform unless you have the explicit consent of a parent or legal guardian. If we discover that we have inadvertently collected personal information from a child under 18 without proper consent, we will take immediate steps to delete such information from our records.</p>
            </section>

            <section>
              <h2>9. Third-Party Links</h2>
              <p>Our Platform may contain links to third-party websites, services, or applications that are not operated or controlled by BrainHeal. This Privacy Policy does not apply to such third-party services. We are not responsible for the privacy practices, content, or security of any third-party websites or services. We encourage you to review the privacy policies of any third-party services you visit.</p>
            </section>

            <section>
              <h2>10. Changes to This Privacy Policy</h2>
              <p>We reserve the right to modify, amend, or update this Privacy Policy at any time and without prior notice. Any changes will be effective immediately upon posting the updated Privacy Policy on our Platform with a revised "Last updated" date. Your continued use of the Platform after any such changes constitutes your acceptance of the revised Privacy Policy. It is your responsibility to review this Privacy Policy periodically.</p>
            </section>

            <section>
              <h2>11. Contact Us</h2>
              <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:</p>
              <ul>
                <li><strong>Email:</strong> help@brainheal.in</li>
                <li><strong>Website:</strong> https://brainheal.in</li>
              </ul>
            </section>

            <section>
              <h2>12. Governing Law</h2>
              <p>This Privacy Policy shall be governed by and construed in accordance with the laws of India, including but not limited to the Information Technology Act, 2000, the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and the Digital Personal Data Protection Act, 2023 (as applicable). Any disputes arising out of or in connection with this Privacy Policy shall be subject to the exclusive jurisdiction of the courts in New Delhi, India.</p>
            </section>
          </div>
        </div>
      </div>

      <style>{`
        .prose-legal h2 { font-family: 'Instrument Serif', serif; font-size: 1.5rem; color: #0a0a0a; margin-bottom: 0.75rem; padding-top: 0.5rem; border-top: 1px solid #f3f4f6; }
        .prose-legal h3 { font-size: 0.95rem; font-weight: 700; color: #0a0a0a; margin-bottom: 0.5rem; margin-top: 1rem; }
        .prose-legal p { font-size: 0.875rem; color: #6b7280; line-height: 1.8; margin-bottom: 0.75rem; }
        .prose-legal ul { list-style: disc; padding-left: 1.5rem; margin-bottom: 0.75rem; }
        .prose-legal li { font-size: 0.875rem; color: #6b7280; line-height: 1.8; margin-bottom: 0.5rem; }
        .prose-legal strong { color: #0a0a0a; }
      `}</style>
    </>
  );
}
