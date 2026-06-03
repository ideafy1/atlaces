import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../DataContext';
import SEOHead from '../components/SEOHead';
import BookingFlow from '../components/BookingFlow';
import { Star, Clock, ArrowLeft, Shield, Award, Heart, Globe, Calendar, CheckCircle, Video, MessageCircle, Phone, GraduationCap, Sparkles, Instagram, Linkedin, Mail, Twitter, Quote, ChevronRight } from 'lucide-react';
import { db } from '../firebase';
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}

export default function TherapistProfile() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useData();
  const therapists = data?.therapyPage?.therapists || [];
  const [showBooking, setShowBooking] = useState(false);
  const [sliderVal, setSliderVal] = useState(5);
  const [hasRated, setHasRated] = useState(false);
  const [localRating, setLocalRating] = useState<number | null>(null);
  const [localReviews, setLocalReviews] = useState<number | null>(null);
  
  const [ratingStep, setRatingStep] = useState<'initial' | 'checking' | 'verified'>('initial');
  const [ratingPhone, setRatingPhone] = useState('');
  const [ratingError, setRatingError] = useState('');
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="w-8 h-8 border-4 border-brand-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  const therapist = therapists.find((t: any) => (t.slug && t.slug === slug) || toSlug(t.name) === slug);

  if (!therapist) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA] font-inter px-6">
        <div className="text-6xl mb-4 animate-bounce">🔍</div>
        <h1 className="font-instrument text-4xl text-brand-black mb-2">Profile not found</h1>
        <p className="text-brand-gray mb-6">This therapist profile doesn't exist or has been removed.</p>
        <button onClick={() => navigate('/therapy')} className="bg-brand-black text-white px-8 py-4 rounded-2xl text-sm font-bold shadow-lg hover:scale-105 transition-all">
          Browse Therapists
        </button>
      </div>
    );
  }

  const t = therapist;

  useEffect(() => {
    const identifier = t?.id || t?.slug || toSlug(t?.name || '');
    if (identifier) {
      const rated = localStorage.getItem(`rated_${identifier}`);
      if (rated) setHasRated(true);
    }
  }, [t]);

  const submitRating = async () => {
    if (hasRated) return;
    const identifier = t?.id || t?.slug || toSlug(t?.name || '');
    const currentReviews = t.reviews || 0;
    const currentRating = t.rating || 5;
    const newReviews = currentReviews + 1;
    const newAvg = ((currentRating * currentReviews) + sliderVal) / newReviews;
    const finalRating = parseFloat(newAvg.toFixed(1));

    if (t?.id) {
      try {
        await updateDoc(doc(db, 'therapists', t.id), {
          rating: finalRating,
          reviews: newReviews
        });
      } catch (err) {
        console.error("Error rating in db:", err);
      }
    }
    
    setLocalRating(finalRating);
    setLocalReviews(newReviews);
    setHasRated(true);
    if (identifier) {
      localStorage.setItem(`rated_${identifier}`, 'true');
    }
  };

  const verifyPhone = async () => {
    if (!ratingPhone || ratingPhone.length < 8) {
      setRatingError('Please enter a valid phone number');
      return;
    }
    setRatingStep('checking');
    setRatingError('');
    try {
      const bookingsRef = collection(db, 'bookings');
      const phone1 = ratingPhone.startsWith('+') ? ratingPhone : `+91${ratingPhone}`;
      const phone2 = ratingPhone;
      
      const q1 = query(bookingsRef, where('therapist', '==', t.name), where('phone', '==', phone1));
      const q2 = query(bookingsRef, where('therapist', '==', t.name), where('phone', '==', phone2));
      
      const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
      if (!snap1.empty || !snap2.empty) {
        setRatingStep('verified');
      } else {
        setRatingError('No session found for this phone number with this therapist.');
        setRatingStep('initial');
      }
    } catch (err) {
      console.error("Error verifying phone:", err);
      setRatingError('An error occurred. Please try again.');
      setRatingStep('initial');
    }
  };

  const getEmoji = (val: number) => {
    if (val === 1) return '😠';
    if (val === 2) return '😞';
    if (val === 3) return '😐';
    if (val === 4) return '🙂';
    return '😍';
  };

  const profileUrl = `https://brainheal.in/therapist/${slug}`;
  const specsList = (t.specialties || []).join(', ');
  const langsList = (t.languages || []).join(', ');
  
  // Social links array for UI and SEO
  const ensureUrl = (url: string) => url.startsWith('http') ? url : `https://${url}`;
  const socialLinks = [];
  if (t.instagramUrl) socialLinks.push({ name: 'Instagram', url: ensureUrl(t.instagramUrl), icon: Instagram, color: 'text-pink-600', bg: 'bg-pink-50', hover: 'hover:bg-pink-100 hover:scale-110' });
  if (t.linkedinUrl) socialLinks.push({ name: 'LinkedIn', url: ensureUrl(t.linkedinUrl), icon: Linkedin, color: 'text-blue-600', bg: 'bg-blue-50', hover: 'hover:bg-blue-100 hover:scale-110' });
  if (t.twitterUrl) socialLinks.push({ name: 'Twitter', url: ensureUrl(t.twitterUrl), icon: Twitter, color: 'text-sky-500', bg: 'bg-sky-50', hover: 'hover:bg-sky-100 hover:scale-110' });
  if (t.email) socialLinks.push({ name: 'Email', url: `mailto:${t.email}`, icon: Mail, color: 'text-emerald-600', bg: 'bg-emerald-50', hover: 'hover:bg-emerald-100 hover:scale-110' });

  const sameAsUrls = socialLinks.map(s => s.url);

  const seoTitle = `${t.name} - ${t.title} | BrainHeal`;
  const seoDesc = `${t.name} is a verified ${t.title} at BrainHeal. ${t.education ? `Educated in ${t.education}. ` : ''}${t.approach ? `Uses ${t.approach}. ` : ''}Specializes in ${specsList}. Book online therapy sessions today.`;
  const seoKeywords = `${t.name}, ${t.name} therapist, ${t.name} psychologist, ${t.title}, ${specsList}, online therapy India, therapist near me, book therapist online`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Person", "Physician"],
    "name": t.name,
    "description": seoDesc,
    "image": t.image,
    "url": profileUrl,
    "jobTitle": t.title,
    "medicalSpecialty": t.title.includes('Psychiatrist') ? 'Psychiatry' : 'Psychology',
    "qualification": t.education || t.credentials,
    "knowsLanguage": t.languages,
    "sameAs": [profileUrl, ...sameAsUrls],
    "memberOf": {
      "@type": "MedicalOrganization",
      "name": "BrainHeal",
      "url": "https://brainheal.in"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": String(t.rating),
      "reviewCount": String(t.reviews),
      "bestRating": "5",
      "worstRating": "1"
    },
    "priceRange": `Rs.${t.price}`,
    "address": { "@type": "PostalAddress", "addressCountry": "IN" }
  };

  const bio = t.bio || `${t.name} is a ${t.credentials}-qualified ${t.title.toLowerCase()} with ${t.experience} of clinical experience. Specializes in helping individuals navigate ${specsList.toLowerCase()}, using evidence-based therapeutic approaches. Sessions are available via video, voice, or chat in ${langsList}.`;

  return (
    <>
      <SEOHead title={seoTitle} description={seoDesc} keywords={seoKeywords} image={t.image} url={profileUrl} jsonLd={jsonLd} />
      
      <div className="min-h-screen bg-[#FAFAFA] font-inter pb-20">
        {/* Dynamic Blur Background Hero */}
        <div className="relative h-[250px] md:h-[300px] w-full overflow-hidden bg-brand-black">
          <div 
            className="absolute inset-0 opacity-40 blur-3xl scale-110" 
            style={{ backgroundImage: `url(${t.image})`, backgroundPosition: 'center', backgroundSize: 'cover' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAFA] to-transparent" />
          
          <div className="absolute top-0 left-0 w-full z-10 px-5 md:px-8 py-6 flex items-center justify-between">
            <button onClick={() => navigate('/therapy')} className="flex items-center gap-2 text-sm font-medium text-white hover:text-white/80 bg-black/20 px-4 py-2 rounded-full backdrop-blur-md transition-all hover:scale-105">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <img src="/logo.png" alt="BrainHeal" className="w-10 h-10 rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform" onClick={() => navigate('/')} />
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-5 md:px-8 -mt-24 md:-mt-32 relative z-20">
          
          {/* Main Hero Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white p-6 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start text-center md:text-left transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)]">
            
            {/* Image Container with floating badge */}
            <div className="relative flex-shrink-0 group">
              <div className="w-40 h-40 md:w-56 md:h-56 rounded-[2.5rem] overflow-hidden bg-gray-100 shadow-xl ring-4 ring-white transition-transform duration-500 group-hover:scale-[1.02]">
                <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
              </div>
              {t.online && (
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-emerald-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg border-2 border-white">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" /> ONLINE
                </div>
              )}
            </div>

            <div className="flex-1 w-full">
              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-4">
                <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase">
                  <Shield className="w-3.5 h-3.5" /> Verified
                </span>
                <span className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-amber-700" /> {localRating !== null ? localRating : t.rating} ({localReviews !== null ? localReviews : t.reviews})
                </span>
              </div>

              <h1 className="font-instrument text-4xl md:text-6xl text-brand-black tracking-tight mb-2 leading-none">{t.name}</h1>
              <p className="text-lg md:text-xl text-brand-gray font-medium mb-1">{t.title}</p>
              <p className="text-sm text-brand-gray/60 font-medium mb-6">{t.credentials}</p>

              {/* Action Button - Top */}
              <button 
                onClick={() => setShowBooking(true)}
                className="w-full md:w-auto px-8 py-4 rounded-2xl bg-brand-black text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all duration-300 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_50px_-10px_rgba(0,0,0,0.4)] hover:scale-[1.02] active:scale-95 group"
              >
                <Sparkles className="w-4 h-4 text-amber-300 group-hover:animate-spin" /> 
                Book Session - Rs.{t.price || 0}
              </button>

              {/* Social Links for SEO & Authority */}
              {socialLinks.length > 0 && (
                <div className="flex items-center justify-center md:justify-start gap-3 mt-6">
                  {socialLinks.map(s => (
                    <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className={`p-3 rounded-2xl ${s.bg} ${s.color} ${s.hover} transition-all duration-300`}>
                      <s.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              )}

              {/* Stats Bar */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mt-8 p-5 bg-gray-50/50 rounded-3xl border border-gray-100">
                <div className="flex flex-col">
                  <span className="text-[11px] text-brand-gray font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Award className="w-3.5 h-3.5" /> Experience</span>
                  <span className="font-semibold text-brand-black">{t.experience}</span>
                </div>
                <div className="w-px h-8 bg-gray-200 hidden sm:block" />
                <div className="flex flex-col">
                  <span className="text-[11px] text-brand-gray font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> Languages</span>
                  <span className="font-semibold text-brand-black">{langsList}</span>
                </div>
                <div className="w-px h-8 bg-gray-200 hidden sm:block" />
                <div className="flex flex-col">
                  <span className="text-[11px] text-brand-gray font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-emerald-600" /> Availability</span>
                  <span className="font-semibold text-brand-black">{t.available}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Editorial Quote Section */}
          {t.quote && (
            <div className="mt-8 bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-[2.5rem] p-8 md:p-12 text-center relative overflow-hidden transition-all duration-500 hover:shadow-lg border border-violet-100">
              <Quote className="absolute top-4 left-4 w-24 h-24 text-violet-500/10 -rotate-12" />
              <Quote className="absolute bottom-4 right-4 w-24 h-24 text-fuchsia-500/10 rotate-12" />
              <p className="font-instrument text-3xl md:text-5xl text-brand-black leading-tight max-w-3xl mx-auto relative z-10">"{t.quote}"</p>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column (Content) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* About Section */}
              <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><Heart className="w-6 h-6" /></div>
                  <h2 className="font-instrument text-3xl text-brand-black">About {t.name.split(' ')[0]}</h2>
                </div>
                <p className="text-brand-gray leading-loose text-lg">{bio}</p>
              </div>

              {/* Approach & Education Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {t.education && (
                  <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 duration-300">
                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-brand-black text-lg mb-3">Education & Training</h3>
                    <p className="text-brand-gray leading-relaxed">{t.education}</p>
                  </div>
                )}
                
                {t.approach && (
                  <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 duration-300">
                    <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-brand-black text-lg mb-3">Therapeutic Approach</h3>
                    <p className="text-brand-gray leading-relaxed">{t.approach}</p>
                  </div>
                )}
              </div>

              {/* Specialties */}
              <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-sm">
                <h2 className="font-instrument text-3xl text-brand-black mb-6">Areas of Expertise</h2>
                <div className="flex flex-wrap gap-3">
                  {(t.specialties || []).map((spec: string) => (
                    <span key={spec} className="px-5 py-3 rounded-2xl bg-gray-50 text-sm font-semibold text-brand-black border border-gray-100 flex items-center gap-2 hover:bg-gray-100 hover:scale-105 transition-all cursor-default">
                      <CheckCircle className="w-4 h-4 text-emerald-500" /> {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Formats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { Icon: Video, label: 'Video Call', desc: 'Face-to-face from anywhere', color: 'text-blue-500', bg: 'bg-blue-50' },
                  { Icon: Phone, label: 'Voice Call', desc: 'Audio-only for comfort', color: 'text-emerald-500', bg: 'bg-emerald-50' },
                  { Icon: MessageCircle, label: 'Chat Session', desc: 'Text-based therapy', color: 'text-purple-500', bg: 'bg-purple-50' },
                ].map(f => (
                  <div key={f.label} className="bg-white rounded-[2rem] p-6 text-center border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
                    <div className={`w-14 h-14 mx-auto rounded-full ${f.bg} flex items-center justify-center mb-4`}>
                      <f.Icon className={`w-6 h-6 ${f.color}`} />
                    </div>
                    <p className="font-bold text-brand-black">{f.label}</p>
                    <p className="text-xs text-brand-gray mt-1">{f.desc}</p>
                  </div>
                ))}
              </div>

            </div>

            {/* Right Column (Sticky Booking Widget) */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] p-8">
                <h3 className="font-bold text-brand-black text-lg mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-brand-black" /> Session Details
                </h3>
                
                <div className="bg-gray-50 rounded-[2rem] p-6 mb-6">
                  <p className="text-sm font-semibold text-brand-gray uppercase tracking-widest mb-1">Pricing</p>
                  <div className="flex items-end gap-1 mb-2">
                    <span className="text-4xl font-instrument text-brand-black">Rs.{t.price?.toLocaleString()}</span>
                    <span className="text-sm text-brand-gray font-medium pb-1">/ session</span>
                  </div>
                  <p className="text-xs text-brand-gray">50-minute comprehensive session</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-sm text-brand-black font-medium">
                    <CheckCircle className="w-5 h-5 text-emerald-500" /> ₹0 Switching Fee
                  </div>
                  <div className="flex items-center gap-3 text-sm text-brand-black font-medium">
                    <CheckCircle className="w-5 h-5 text-emerald-500" /> Secure & Confidential
                  </div>
                  <div className="flex items-center gap-3 text-sm text-brand-black font-medium">
                    <CheckCircle className="w-5 h-5 text-emerald-500" /> 2-Hour Matching Guarantee
                  </div>
                </div>

                <button 
                  onClick={() => setShowBooking(true)} 
                  className="w-full bg-brand-black text-white rounded-[1.5rem] py-5 text-base font-bold flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-95 transition-all shadow-xl hover:shadow-2xl"
                >
                  Book Session Now <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

          </div>

          {/* Rating Section (Bottom) */}
          <div className="mt-12 max-w-2xl mx-auto bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-12 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] text-center">
            <h2 className="font-instrument text-3xl text-brand-black mb-2">Rate your experience</h2>
            <p className="text-sm text-brand-gray mb-8">Your feedback is 100% anonymous and helps others.</p>
            
            {hasRated ? (
              <div className="bg-emerald-50 text-emerald-700 p-6 rounded-3xl animate-stepIn">
                <p className="text-4xl mb-3">🙏</p>
                <p className="font-bold text-lg">Thank you!</p>
                <p className="text-sm opacity-80 mt-1">Your rating has been successfully saved.</p>
              </div>
            ) : ratingStep === 'initial' || ratingStep === 'checking' ? (
              <div className="max-w-xs mx-auto animate-stepIn">
                <p className="text-xs font-semibold text-brand-gray mb-3 uppercase tracking-wider">Verify Session</p>
                <input
                  type="tel"
                  value={ratingPhone}
                  onChange={e => setRatingPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 text-sm font-medium text-center focus:outline-none focus:border-brand-black mb-3"
                  onKeyDown={e => e.key === 'Enter' && verifyPhone()}
                />
                {ratingError && <p className="text-xs text-red-500 mb-3">{ratingError}</p>}
                <button
                  onClick={verifyPhone}
                  disabled={ratingStep === 'checking'}
                  className="w-full bg-brand-black text-white px-6 py-4 rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {ratingStep === 'checking' ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</> : 'Verify & Rate'}
                </button>
              </div>
            ) : (
              <div className="space-y-8 animate-stepIn">
                <div className="text-7xl transition-all duration-300 transform scale-110">
                  {getEmoji(sliderVal)}
                </div>
                
                <div className="relative px-4">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={sliderVal}
                    onChange={(e) => setSliderVal(Number(e.target.value))}
                    className="w-full h-3 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-black outline-none"
                    style={{ WebkitAppearance: 'none' }}
                  />
                  <div className="flex justify-between mt-3 text-xs font-bold text-gray-400">
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                  </div>
                </div>

                <button
                  onClick={submitRating}
                  className="bg-brand-black text-white px-10 py-4 rounded-full font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-xl"
                >
                  Submit Rating
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {showBooking && (
        <BookingFlow
          therapistName={t.name}
          therapistImage={t.image}
          therapistTitle={t.title}
          price={t.price || 1500}
          firstSessionPrice={data?.firstSessionPrice || 111}
          therapistTelegramId={t.telegramId}
          therapistMeetLink={t.meetLink}
          therapistEmail={t.email}
          onClose={() => setShowBooking(false)}
        />
      )}
    </>
  );
}
