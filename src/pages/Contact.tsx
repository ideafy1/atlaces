import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import { Mail, Phone, MapPin, Instagram, Sparkles, Send, CheckCircle2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSending(true);
    try {
      await addDoc(collection(db, 'contact_messages'), {
        name,
        email,
        message,
        createdAt: serverTimestamp(),
      });
      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Something went wrong. Please try again.');
    }
    setSending(false);
  };

  const contactDetails = {
    name: "Aditya H Singh",
    address: "B-204 V- Raj Appartment Behind Panchayat Market, Dadra and Nagar Haveli, Silvassa 396230",
    phone: "9429991846",
    email: "brainheal.in@gmail.com",
    instagram: "@brainheal.in",
  };

  const seoTitle = "Contact Us | BrainHeal - India's Premium Therapist Collective";
  const seoDesc = "Get in touch with BrainHeal. Contact Aditya H Singh at Dadra and Nagar Haveli, Silvassa. Call +91 9429991846 or email brainheal.in@gmail.com for mental wellness support.";
  const seoKeywords = "contact BrainHeal, Aditya H Singh, BrainHeal phone number, BrainHeal email, Silvassa therapy center, online therapy contact";
  const pageUrl = "https://brainheal.in/contact";

  return (
    <>
      <SEOHead title={seoTitle} description={seoDesc} keywords={seoKeywords} url={pageUrl} />
      
      <div className="min-h-screen bg-[#FAFAFA] font-inter text-brand-black flex flex-col">
        {/* Navigation */}
        <Navigation activePage={-1} />

        {/* Hero Section */}
        <div className="relative py-20 px-6 bg-brand-black text-white text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(236,72,153,0.15),transparent_50%)]" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 bg-white/10 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase mb-6 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Connect With Us
            </span>
            <h1 className="font-instrument text-5xl md:text-7xl leading-tight tracking-tight mb-4">
              We are here to <span className="italic text-gray-300">support you</span>
            </h1>
            <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              Reach out to BrainHeal today. Let's make your healing journey comfortable, private, and seamless.
            </p>
          </div>
        </div>

        {/* Contact Info & Form Content */}
        <div className="max-w-6xl mx-auto px-6 py-16 flex-1 w-full grid grid-cols-1 lg:grid-cols-5 gap-12">
          
          {/* Contact Details Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-50 rounded-full blur-3xl opacity-60" />
              
              <h2 className="font-instrument text-3xl mb-8 text-brand-black">Our Details</h2>
              
              <div className="space-y-8">
                {/* Director Name */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-brand-gray font-bold uppercase tracking-wider mb-1">Director</p>
                    <p className="text-lg font-semibold text-brand-black">{contactDetails.name}</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-brand-gray font-bold uppercase tracking-wider mb-1">Address</p>
                    <p className="text-sm font-medium text-brand-black leading-relaxed">
                      {contactDetails.address}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-brand-gray font-bold uppercase tracking-wider mb-1">Phone Number</p>
                    <a 
                      href={`tel:${contactDetails.phone}`} 
                      className="text-sm font-bold text-brand-black hover:underline transition-all"
                    >
                      +91 {contactDetails.phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-brand-gray font-bold uppercase tracking-wider mb-1">Email Address</p>
                    <a 
                      href={`mailto:${contactDetails.email}`} 
                      className="text-sm font-bold text-brand-black hover:underline transition-all"
                    >
                      {contactDetails.email}
                    </a>
                  </div>
                </div>

                {/* Instagram */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 flex-shrink-0">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-brand-gray font-bold uppercase tracking-wider mb-1">Instagram</p>
                    <a 
                      href={`https://instagram.com/brainheal.in`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-brand-black hover:underline transition-all"
                    >
                      {contactDetails.instagram}
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-[2rem] border border-gray-100 p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="font-instrument text-3xl mb-3 text-brand-black">Send us a Message</h2>
              <p className="text-brand-gray text-sm mb-8 leading-relaxed">
                Have any inquiries, questions about therapy, or feedback? Send a message and our support team will reply within 24 hours.
              </p>

              {success ? (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-6 rounded-2xl flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-base mb-1">Message Sent!</h4>
                    <p className="text-sm opacity-90">Thank you for writing to us. We will get back to you very soon.</p>
                    <button 
                      onClick={() => setSuccess(false)} 
                      className="text-xs font-bold underline mt-4 hover:no-underline block"
                    >
                      Send another message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs font-semibold text-brand-gray uppercase tracking-wider mb-2">Your Name</label>
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Enter your name" 
                      className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-150 text-sm font-medium focus:outline-none focus:border-brand-black focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-gray uppercase tracking-wider mb-2">Your Email</label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Enter your email" 
                      className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-150 text-sm font-medium focus:outline-none focus:border-brand-black focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-gray uppercase tracking-wider mb-2">Message</label>
                    <textarea 
                      required
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Describe what you want to connect about..." 
                      rows={5}
                      className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-150 text-sm font-medium focus:outline-none focus:border-brand-black focus:bg-white transition-all resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={sending}
                    className="w-full bg-brand-black text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-md disabled:opacity-75"
                  >
                    {sending ? 'Sending...' : <><Send className="w-4 h-4" /> Send Message</>}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
