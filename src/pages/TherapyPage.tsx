import React, { useState } from 'react';
import { Star, Clock, ChevronRight, Search, SlidersHorizontal, Heart, Sparkles, Globe, ArrowRight, Eye, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../DataContext';

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}

export default function TherapyPage() {
  const { data } = useData();
  const tp = data?.therapyPage || {};
  const categories = tp?.categories?.length > 3 ? tp.categories : ['All', 'Therapist', 'Couples Therapist', 'Counsellor', 'Psychiatrist', 'Clinical Psychologist', 'Counseling Psychologist', 'Psychotherapist', 'Child Psychologist'];
  const concernsList = tp?.concerns?.length > 3 ? tp.concerns : ['Anxiety', 'Low Mood', 'Overthinking', 'Stress', 'Relationships', 'Self Growth', 'Trauma', 'ADHD', 'Depression', 'Grief', 'OCD', 'Bipolar Disorder', 'Career Counseling', 'Anger Management', 'PTSD'];
  const allTherapists = tp?.therapists || [];

  const [activeCategory, setActiveCategory] = useState(0);
  const [activeConcerns, setActiveConcerns] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [likedIds, setLikedIds] = useState<number[]>([]);
  const navigate = useNavigate();

  const toggleConcern = (concern: string) => {
    setActiveConcerns(prev =>
      prev.includes(concern) ? prev.filter(c => c !== concern) : [...prev, concern]
    );
  };

  const toggleLike = (i: number) => {
    setLikedIds(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  };

  const filtered = allTherapists.filter((t: any) => {
    const specs: string[] = t.specialties || [];
    if (activeConcerns.length > 0 && !specs.some((s: string) => activeConcerns.includes(s))) return false;
    if (searchQuery && !t.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    const selectedCat = categories[activeCategory];
    if (selectedCat && selectedCat !== 'All') {
      const titleLower = (t.title || '').toLowerCase();
      const catLower = selectedCat.toLowerCase();
      if (!titleLower.includes(catLower)) {
        if (catLower === 'counsellor' && !titleLower.includes('counsel')) return false;
        else if (catLower === 'therapist' && !titleLower.includes('psycholog') && !titleLower.includes('therapist')) return false;
        else if (!titleLower.includes(catLower.split(' ')[0])) return false;
      }
    }
    return true;
  }).sort((a: any, b: any) => (a.name || '').localeCompare(b.name || ''));

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-28 md:pb-12">
      {/* Header */}
      <div className="bg-white sticky top-0 md:top-[73px] z-40 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-5 md:px-8 pt-6 pb-4">
          {/* Desktop: horizontal layout */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-instrument tracking-tight text-brand-black">
                {tp.heading || 'Find your'}{' '}
                <span className="italic text-brand-gray">{tp.headingItalic || 'therapist'}</span>
              </h1>
              <p className="text-sm text-brand-gray mt-1">{tp.subtext || 'The right support for what you\'re going through.'}</p>
            </div>

            {/* Search - wider on desktop */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray" />
              <input
                type="text"
                placeholder="Search by name or speciality..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-12 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm font-inter focus:outline-none focus:border-brand-black focus:bg-white transition-colors"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-brand-black rounded-lg flex items-center justify-center">
                <SlidersHorizontal className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Category pills */}
        <div className="max-w-6xl mx-auto px-5 md:px-8 pb-3">
          <div className="flex gap-2 md:gap-3 overflow-x-auto no-scrollbar">
            {categories.map((cat: string, i: number) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(i)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold tracking-wide transition-all duration-300 ${
                  activeCategory === i
                    ? 'bg-brand-black text-white shadow-md'
                    : 'bg-gray-100 text-brand-gray hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Concern tags + results count */}
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex gap-2 flex-wrap">
            {concernsList.map((concern: string) => (
              <button
                key={concern}
                onClick={() => toggleConcern(concern)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] md:text-xs font-medium tracking-wide border transition-all duration-300 ${
                  activeConcerns.includes(concern)
                    ? 'bg-brand-black text-white border-brand-black'
                    : 'bg-white text-brand-gray border-gray-200 hover:border-gray-400'
                }`}
              >
                {concern}
              </button>
            ))}
          </div>
          <p className="text-xs text-brand-gray font-medium flex-shrink-0">{filtered.length} therapists available</p>
        </div>
      </div>

      {/* Therapist cards - 1 col mobile, 2 col desktop */}
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {filtered.map((t: any, i: number) => (
            <div
              key={i}
              className="therapy-card bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-500 group flex flex-col h-full"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="p-5 md:p-6 flex-1 flex flex-col justify-between h-full">
                <div className="flex-grow">
                  {/* Top row */}
                  <div className="flex gap-4">
                    {/* Profile image */}
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden bg-gray-100 ring-2 ring-gray-50 group-hover:ring-4 group-hover:ring-gray-100 transition-all duration-500">
                        <img src={t.image} alt={t.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" loading="lazy" />
                      </div>
                      {t.online && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-[2.5px] border-white flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-inter font-semibold text-base md:text-lg text-brand-black leading-tight group-hover:text-gray-900 transition-colors">{t.name}</h3>
                          <p className="text-xs md:text-sm text-brand-gray mt-0.5">{t.title}</p>
                          <p className="text-[11px] text-brand-gray/60 mt-0.5 font-medium">{t.credentials}</p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleLike(i); }}
                          className="p-2 rounded-xl hover:bg-red-50 active:scale-90 transition-all duration-300"
                        >
                          <Heart className={`w-5 h-5 transition-all duration-500 ${likedIds.includes(i) ? 'fill-red-500 text-red-500 scale-110 drop-shadow-sm' : 'text-gray-300 hover:text-red-400'}`} />
                        </button>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mt-2.5">
                        <div className="flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg group-hover:bg-emerald-100 transition-colors duration-300">
                          <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                          <span className="text-xs font-bold text-emerald-700">{t.rating}</span>
                        </div>
                        <span className="text-[11px] text-brand-gray">({t.reviews} reviews)</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className="text-[11px] text-brand-gray">{t.experience}</span>
                      </div>
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="flex items-center gap-1.5 mt-4">
                    <Globe className="w-3.5 h-3.5 text-brand-gray/40" />
                    <span className="text-[11px] text-brand-gray font-medium">{(t.languages || []).join(', ')}</span>
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {(t.specialties || []).slice(0, 6).map((spec: string) => (
                      <span key={spec} className="specialty-chip px-2.5 py-1 rounded-lg bg-gray-50 text-[10px] md:text-[11px] font-medium text-brand-gray border border-gray-100 group-hover:bg-gray-100 group-hover:border-gray-200 transition-all duration-300">
                        {spec}
                      </span>
                    ))}
                    {(t.specialties || []).length > 6 && (
                      <span className="px-2.5 py-1 rounded-lg bg-gray-50 text-[10px] md:text-[11px] font-medium text-brand-gray/60 border border-gray-100">
                        +{(t.specialties || []).length - 6} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Pricing bar */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-[11px] font-semibold text-emerald-600">{t.available}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-400 line-through">Rs.{(t.price || 0).toLocaleString()}</span>
                      <span className="text-lg font-bold font-inter text-brand-black">Rs.{data?.firstSessionPrice || 11}</span>
                      <span className="offer-badge text-[8px] font-extrabold text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm">
                        1st Session
                      </span>
                    </div>
                  </div>

                  {/* Side-by-side buttons */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <a
                      href={`/therapist/${t.slug || toSlug(t.name)}`}
                      onClick={(e) => { e.preventDefault(); navigate(`/therapist/${t.slug || toSlug(t.name)}`); }}
                      className="group/btn relative overflow-hidden flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-200 text-[13px] font-semibold text-brand-black hover:border-brand-black hover:bg-gray-50 active:scale-[0.97] transition-all duration-300"
                    >
                      <Eye className="w-4 h-4 text-brand-gray group-hover/btn:text-brand-black transition-colors duration-300" />
                      <span>View Profile</span>
                    </a>
                    <a
                      href={`/therapist/${t.slug || toSlug(t.name)}`}
                      onClick={(e) => { e.preventDefault(); navigate(`/therapist/${t.slug || toSlug(t.name)}`); }}
                      className="group/btn relative overflow-hidden flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-black text-white text-[13px] font-bold hover:bg-gray-900 active:scale-[0.97] transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      <Calendar className="w-4 h-4 opacity-80 group-hover/btn:opacity-100 transition-opacity" />
                      <span>Book Session</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 -ml-2 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all duration-300" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-brand-gray text-sm">No therapists found matching your filters.</p>
            <button onClick={() => { setActiveConcerns([]); setActiveCategory(0); setSearchQuery(''); }} className="mt-3 text-brand-black text-sm font-semibold underline hover:no-underline transition-all">
              Clear all filters
            </button>
          </div>
        )}
      </div>

      <style>{`
        .therapy-card {
          animation: cardFadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes cardFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .offer-badge {
          animation: badgeGlow 2s ease-in-out infinite;
        }
        @keyframes badgeGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.3); }
          50% { box-shadow: 0 0 12px 2px rgba(16, 185, 129, 0.15); }
        }
        .specialty-chip {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .specialty-chip:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
      `}</style>
    </div>
  );
}
