import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import SEOHead from '../components/SEOHead';

export default function TermsConditions() {
  const navigate = useNavigate();
  const today = 'May 25, 2026';

  return (
    <>
      <SEOHead
        title="Terms and Conditions | BrainHeal"
        description="Read the complete Terms and Conditions for using the BrainHeal online therapy platform. Covers service terms, refund policy, liability limitations, and dispute resolution."
        keywords="BrainHeal terms and conditions, therapy platform terms, online therapy agreement, BrainHeal refund policy"
        url="https://brainheal.in/terms"
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
            <FileText className="w-6 h-6 text-violet-600" />
            <p className="text-xs font-bold text-violet-600 uppercase tracking-widest">Legal</p>
          </div>
          <h1 className="font-instrument text-4xl md:text-5xl text-brand-black mb-3">Terms and Conditions</h1>
          <p className="text-sm text-brand-gray mb-10">Last updated: {today}</p>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-10">
            <p className="text-sm font-semibold text-amber-900 mb-1">Important Notice</p>
            <p className="text-xs text-amber-800 leading-relaxed">By using BrainHeal, you agree to these Terms and Conditions in their entirety. These Terms contain important provisions including limitations of liability, a strict no-refund policy, binding arbitration, and a class action waiver. Please read them carefully before using our services.</p>
          </div>

          <div className="prose-legal space-y-8">
            <section>
              <h2>1. Acceptance of Terms</h2>
              <p>These Terms and Conditions ("Terms") constitute a legally binding agreement between you ("User," "you," or "your") and BrainHeal ("Company," "we," "our," or "us"). By accessing, browsing, or using the BrainHeal website at brainheal.in, booking a therapy session, posting in the community, or using any other feature of the Platform (collectively, the "Services"), you represent and warrant that you have read, understood, and agree to be bound by these Terms and our <Link to="/privacy" className="text-brand-black font-semibold underline">Privacy Policy</Link>, which is incorporated herein by reference.</p>
              <p>If you do not agree to any provision of these Terms, you must immediately cease all use of the Platform and Services. Your continued use of the Platform following any modification to these Terms constitutes your acceptance of such modifications.</p>
            </section>

            <section>
              <h2>2. Eligibility</h2>
              <p>You must be at least 18 years of age to use the Platform and Services. By using the Platform, you represent and warrant that:</p>
              <ul>
                <li>You are at least 18 years old, or you have the explicit written consent of a parent or legal guardian who has reviewed and agreed to these Terms on your behalf.</li>
                <li>You have the legal capacity to enter into a binding contract under applicable law.</li>
                <li>You are not barred from using the Services under any applicable law or regulation.</li>
                <li>You will provide accurate, current, and complete information as requested during the booking or registration process.</li>
                <li>You are accessing the Services from India or a jurisdiction where such services are lawful.</li>
              </ul>
              <p>We reserve the right to refuse service, terminate accounts, or cancel bookings at our sole discretion if we believe you do not meet these eligibility requirements.</p>
            </section>

            <section>
              <h2>3. Nature of Services</h2>
              <h3>3.1 Platform, Not Provider</h3>
              <p>BrainHeal is a technology platform that connects individuals seeking mental health support with independent, verified therapists ("Therapists"). <strong>BrainHeal is NOT a healthcare provider, medical facility, or mental health clinic.</strong> We do not provide medical advice, diagnoses, prescriptions, or treatment. The Therapists accessible through our Platform are independent professionals, not employees, agents, or representatives of BrainHeal.</p>
              <h3>3.2 No Doctor-Patient Relationship with BrainHeal</h3>
              <p>Your use of the Platform does not create a doctor-patient, therapist-client, or any other professional healthcare relationship between you and BrainHeal. Any therapeutic relationship that may be formed is solely between you and the individual Therapist you engage with through the Platform.</p>
              <h3>3.3 Not for Emergencies</h3>
              <p><strong>THE PLATFORM IS NOT DESIGNED FOR OR INTENDED TO ADDRESS MEDICAL OR PSYCHIATRIC EMERGENCIES.</strong> If you are experiencing a medical emergency, suicidal thoughts, or are in immediate danger, please call your local emergency services (112 in India), contact the Vandrevala Foundation Helpline (1860-2662-345), or go to the nearest emergency room immediately. Do not rely on the Platform for emergency assistance.</p>
              <h3>3.4 No Guarantee of Outcomes</h3>
              <p>We make no representations, warranties, or guarantees regarding the outcomes, effectiveness, or results of any therapy sessions booked through the Platform. Mental health treatment outcomes vary significantly between individuals, and no specific results can be promised or implied. You acknowledge that therapy may not be effective for everyone and that you are using the Services at your own discretion and risk.</p>
            </section>

            <section>
              <h2>4. Booking and Sessions</h2>
              <h3>4.1 Booking Process</h3>
              <p>By completing the booking flow on our Platform, you are requesting a therapy session with a specific Therapist at a specific date and time. A booking is confirmed only when both the Platform confirms the booking and the Therapist accepts the appointment. We reserve the right to cancel or reschedule bookings at any time.</p>
              <h3>4.2 Notifications</h3>
              <p>By completing a booking, you explicitly consent to receiving booking confirmations, reminders, and related notifications via email, SMS, phone call, and/or Telegram messaging. You acknowledge that your booking details (name, contact information, session preferences, and stated concerns) will be shared with the selected Therapist and the BrainHeal administrative team for the purpose of facilitating your appointment.</p>
              <h3>4.3 Session Conduct</h3>
              <p>You agree to conduct yourself respectfully and professionally during all interactions with Therapists. Any abusive, harassing, threatening, or inappropriate behavior toward a Therapist will result in immediate termination of the session and permanent suspension of your access to the Platform, without any refund.</p>
              <h3>4.4 Cancellation by User</h3>
              <p>You may cancel or reschedule a booking by contacting us at least 24 hours before the scheduled session time. Cancellations made less than 24 hours before the scheduled time, or no-shows, are subject to a 100% cancellation fee (i.e., no refund will be issued). See Section 5 for the complete Refund Policy.</p>
              <h3>4.5 Cancellation by Therapist or BrainHeal</h3>
              <p>In the event that a Therapist or BrainHeal cancels a confirmed booking, we will make reasonable efforts to reschedule the session with the same or a different Therapist at a mutually agreeable time. If rescheduling is not possible, a credit may be issued toward a future session at BrainHeal's sole discretion.</p>
            </section>

            <section>
              <h2>5. Payment and Refund Policy</h2>
              <h3>5.1 Pricing</h3>
              <p>Session prices are set by individual Therapists and displayed on their profiles on the Platform. Prices are in Indian Rupees (INR) and are inclusive of all applicable taxes unless otherwise stated. We reserve the right to change pricing at any time without prior notice.</p>
              <h3>5.2 Payment</h3>
              <p>Payment for sessions must be made in full at the time of booking through the payment methods available on the Platform. We use secure third-party payment processors and do not store your complete payment card information.</p>

              <div className="bg-red-50 border border-red-200 rounded-2xl p-5 my-4">
                <p className="text-sm font-bold text-red-900 mb-2">5.3 STRICT NO-REFUND POLICY</p>
                <p className="text-xs text-red-800 leading-relaxed mb-2"><strong>ALL PAYMENTS MADE ON THE PLATFORM ARE FINAL AND NON-REFUNDABLE.</strong> Under no circumstances will BrainHeal issue monetary refunds for any reason, including but not limited to:</p>
                <ul className="text-xs text-red-800 leading-relaxed list-disc pl-4 space-y-1">
                  <li>Dissatisfaction with a therapy session or Therapist</li>
                  <li>Failure to attend a scheduled session (no-show)</li>
                  <li>Late cancellation (less than 24 hours before the session)</li>
                  <li>Technical difficulties experienced during a session</li>
                  <li>Change of mind after booking</li>
                  <li>Perceived lack of therapeutic progress or results</li>
                  <li>Any other reason whatsoever</li>
                </ul>
                <p className="text-xs text-red-800 leading-relaxed mt-2">By completing a booking and making payment, you expressly acknowledge, accept, and agree to this no-refund policy. You waive any and all rights to chargeback, payment reversal, or refund claim through your bank, credit card company, or any other financial institution.</p>
              </div>

              <h3>5.4 Chargebacks</h3>
              <p>Filing a chargeback or payment dispute with your bank or financial institution without first attempting to resolve the issue directly with BrainHeal constitutes a breach of these Terms. In the event of a chargeback, we reserve the right to: (a) permanently suspend your account, (b) pursue all available legal remedies, including recovery of the disputed amount plus all associated fees, legal costs, and damages, and (c) report the incident to relevant fraud prevention databases.</p>
              <h3>5.5 Credits</h3>
              <p>In exceptional circumstances and at BrainHeal's sole and absolute discretion, we may offer Platform credits toward future sessions in lieu of monetary refunds. Such credits are non-transferable, have no cash value, and expire 90 days from issuance unless otherwise specified. The issuance of credits in one instance does not establish a precedent or entitle you to credits in any other instance.</p>
            </section>

            <section>
              <h2>6. Community Guidelines</h2>
              <h3>6.1 Anonymous Community</h3>
              <p>The BrainHeal Community feature allows users to post anonymously. While your real identity is not publicly displayed, we retain the ability to identify users for moderation and safety purposes. Community posts are automatically deleted after 24 hours.</p>
              <h3>6.2 Prohibited Content</h3>
              <p>You agree not to post, share, or transmit any content that:</p>
              <ul>
                <li>Is abusive, threatening, harassing, defamatory, or harmful to others</li>
                <li>Contains personally identifiable information of any individual</li>
                <li>Promotes self-harm, suicide, or violence</li>
                <li>Is sexually explicit, obscene, or otherwise inappropriate</li>
                <li>Constitutes spam, advertising, or commercial solicitation</li>
                <li>Violates any applicable law, regulation, or third-party rights</li>
                <li>Contains malicious links, malware, or phishing attempts</li>
                <li>Provides medical advice, diagnoses, or treatment recommendations</li>
              </ul>
              <h3>6.3 Moderation</h3>
              <p>We reserve the right to remove, edit, or refuse to display any community content at our sole discretion, without notice or explanation. We may also suspend or terminate the access of any user who violates these community guidelines.</p>
            </section>

            <section>
              <h2>7. Intellectual Property</h2>
              <p>All content, materials, features, and functionality on the Platform, including but not limited to text, graphics, logos (including the BrainHeal logo), icons, images, audio, video, software, code, data compilations, and the design, selection, and arrangement thereof (collectively, "Platform Content"), are the exclusive property of BrainHeal or its licensors and are protected by Indian and international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>
              <p>You are granted a limited, non-exclusive, non-transferable, revocable license to access and use the Platform Content solely for your personal, non-commercial use in accordance with these Terms. You may not copy, reproduce, modify, distribute, transmit, display, perform, publish, license, create derivative works from, sell, or exploit any Platform Content without our prior written consent.</p>
            </section>

            <section>
              <h2>8. Limitation of Liability</h2>
              <div className="bg-gray-100 border border-gray-200 rounded-2xl p-5 my-4">
                <p className="text-xs text-gray-800 leading-relaxed"><strong>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, BRAINHEAL, ITS DIRECTORS, OFFICERS, EMPLOYEES, AGENTS, PARTNERS, SUPPLIERS, AND AFFILIATES (COLLECTIVELY, THE "BRAINHEAL PARTIES") SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, EMOTIONAL DISTRESS, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR IN CONNECTION WITH:</strong></p>
                <ul className="text-xs text-gray-800 leading-relaxed list-disc pl-4 space-y-1 mt-2">
                  <li>Your use of or inability to use the Platform or Services</li>
                  <li>Any conduct, content, or advice of any Therapist accessed through the Platform</li>
                  <li>Any unauthorized access to or alteration of your data</li>
                  <li>Any therapy outcomes, results, or lack thereof</li>
                  <li>Any interruption, suspension, or termination of the Services</li>
                  <li>Any errors, omissions, or inaccuracies in Platform Content</li>
                  <li>Any harm resulting from community interactions</li>
                  <li>Any other matter relating to the Platform or Services</li>
                </ul>
                <p className="text-xs text-gray-800 leading-relaxed mt-2"><strong>IN NO EVENT SHALL THE TOTAL, CUMULATIVE LIABILITY OF THE BRAINHEAL PARTIES TO YOU FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICES EXCEED THE AMOUNT YOU HAVE PAID TO BRAINHEAL IN THE TWELVE (12) MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE CLAIM, OR FIVE HUNDRED INDIAN RUPEES (Rs. 500), WHICHEVER IS LESS.</strong></p>
              </div>
            </section>

            <section>
              <h2>9. Disclaimer of Warranties</h2>
              <p><strong>THE PLATFORM AND ALL SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, TITLE, OR ACCURACY.</strong></p>
              <p>BrainHeal does not warrant that: (a) the Platform will be uninterrupted, timely, secure, or error-free; (b) the results obtained from the use of the Platform will be accurate, reliable, or meet your expectations; (c) any errors in the Platform will be corrected; or (d) the Platform is free of viruses or other harmful components.</p>
              <p>You acknowledge that BrainHeal does not control, endorse, or guarantee the quality, safety, legality, truthfulness, or accuracy of any Therapist's services, qualifications, or advice. Any reliance on Therapist advice is at your sole risk.</p>
            </section>

            <section>
              <h2>10. Indemnification</h2>
              <p>You agree to indemnify, defend, and hold harmless the BrainHeal Parties from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees and court costs) arising out of or in connection with: (a) your use of or access to the Platform or Services; (b) your violation of these Terms; (c) your violation of any applicable law, regulation, or third-party right; (d) any content you submit to the Platform, including community posts; (e) any dispute between you and a Therapist; or (f) your negligence or willful misconduct. This indemnification obligation shall survive the termination of these Terms and your use of the Platform.</p>
            </section>

            <section>
              <h2>11. Dispute Resolution and Arbitration</h2>
              <div className="bg-violet-50 border border-violet-200 rounded-2xl p-5 my-4">
                <p className="text-sm font-bold text-violet-900 mb-2">MANDATORY BINDING ARBITRATION AND CLASS ACTION WAIVER</p>
                <p className="text-xs text-violet-800 leading-relaxed">Please read this section carefully. It affects your legal rights, including your right to file a lawsuit in court.</p>
              </div>
              <h3>11.1 Informal Resolution</h3>
              <p>Before initiating any formal dispute resolution proceeding, you agree to first attempt to resolve any dispute, claim, or controversy arising out of or relating to these Terms or the Services ("Dispute") informally by contacting us at help@brainheal.in. We will attempt to resolve the Dispute within 30 days of receiving your notice.</p>
              <h3>11.2 Binding Arbitration</h3>
              <p>If a Dispute cannot be resolved informally within 30 days, you and BrainHeal agree that the Dispute shall be resolved exclusively through final and binding arbitration, rather than in court. The arbitration shall be conducted by a sole arbitrator in accordance with the Arbitration and Conciliation Act, 1996 (as amended). The seat and venue of arbitration shall be New Delhi, India. The language of arbitration shall be English.</p>
              <h3>11.3 Class Action Waiver</h3>
              <p><strong>YOU AND BRAINHEAL AGREE THAT EACH PARTY MAY BRING DISPUTES AGAINST THE OTHER PARTY ONLY IN AN INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS, CONSOLIDATED, REPRESENTATIVE, OR MULTI-PARTY ACTION OR PROCEEDING.</strong> The arbitrator may not consolidate more than one person's claims and may not otherwise preside over any form of class or representative proceeding.</p>
              <h3>11.4 Waiver of Jury Trial</h3>
              <p>YOU AND BRAINHEAL HEREBY WAIVE ANY CONSTITUTIONAL AND STATUTORY RIGHTS TO SUE IN COURT AND HAVE A TRIAL IN FRONT OF A JUDGE OR A JURY. You and BrainHeal are instead electing that all Disputes shall be resolved by arbitration as described above.</p>
              <h3>11.5 Limitation Period</h3>
              <p>Any Dispute must be brought within one (1) year of the date on which the Dispute first arose, or the claim shall be permanently barred. This limitation period applies regardless of whether the Dispute arises in contract, tort, statute, or otherwise.</p>
            </section>

            <section>
              <h2>12. Termination</h2>
              <p>We may terminate or suspend your access to the Platform and Services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach any provision of these Terms. Upon termination: (a) your right to use the Platform and Services will immediately cease; (b) you must cease all use of the Platform; (c) any outstanding payments shall become immediately due and payable; and (d) any provisions of these Terms that by their nature should survive termination shall survive, including but not limited to ownership provisions, warranty disclaimers, indemnification, limitation of liability, and dispute resolution provisions.</p>
            </section>

            <section>
              <h2>13. Force Majeure</h2>
              <p>BrainHeal shall not be liable for any failure or delay in performing its obligations under these Terms if such failure or delay results from circumstances beyond our reasonable control, including but not limited to natural disasters, pandemics, epidemics, acts of God, war, terrorism, riots, government actions, power failures, internet disruptions, telecommunications failures, or any other force majeure event. In such cases, our obligations shall be suspended for the duration of the force majeure event.</p>
            </section>

            <section>
              <h2>14. Severability</h2>
              <p>If any provision of these Terms is found to be invalid, illegal, or unenforceable by a court or arbitrator of competent jurisdiction, such invalidity, illegality, or unenforceability shall not affect any other provision of these Terms, which shall remain in full force and effect. The invalid, illegal, or unenforceable provision shall be modified to the minimum extent necessary to make it valid, legal, and enforceable while preserving its original intent.</p>
            </section>

            <section>
              <h2>15. Entire Agreement</h2>
              <p>These Terms, together with the <Link to="/privacy" className="text-brand-black font-semibold underline">Privacy Policy</Link> and any other legal notices or policies published by BrainHeal on the Platform, constitute the entire agreement between you and BrainHeal regarding the use of the Platform and Services, and supersede all prior and contemporaneous understandings, agreements, representations, and warranties, both written and oral, regarding the subject matter.</p>
            </section>

            <section>
              <h2>16. Governing Law and Jurisdiction</h2>
              <p>These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Subject to the arbitration provisions in Section 11, any legal action or proceeding that is not subject to arbitration shall be brought exclusively in the courts located in New Delhi, India, and you hereby consent to the personal jurisdiction and venue of such courts.</p>
            </section>

            <section>
              <h2>17. Modifications to Terms</h2>
              <p>We reserve the right to modify, amend, or replace these Terms at any time and at our sole discretion. Any changes will be effective immediately upon posting the updated Terms on the Platform with a revised "Last updated" date. We may, but are not obligated to, provide additional notice of significant changes via email or a prominent notice on the Platform. Your continued use of the Platform after any changes constitutes your acceptance of the revised Terms. If you do not agree to the new Terms, you must stop using the Platform immediately.</p>
            </section>

            <section>
              <h2>18. Contact Information</h2>
              <p>For any questions, concerns, or notices regarding these Terms, please contact us at:</p>
              <ul>
                <li><strong>Email:</strong> help@brainheal.in</li>
                <li><strong>Website:</strong> https://brainheal.in</li>
              </ul>
              <p>By using BrainHeal, you acknowledge that you have read these Terms and Conditions in their entirety and agree to be bound by them.</p>
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
        .prose-legal a { color: #0a0a0a; font-weight: 600; text-decoration: underline; }
      `}</style>
    </>
  );
}
