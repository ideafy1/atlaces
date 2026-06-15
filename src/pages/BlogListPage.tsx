import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight, ArrowDown } from 'lucide-react';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import { blogPosts, BLOG_CATEGORIES, type BlogPost } from '../data/blogPosts';

const CATEGORY_CARDS = [
  { name: 'Health Guide', emoji: '📖', gradient: 'from-[#E0C3FC] to-[#8EC5FC]' },
  { name: 'Playlist', emoji: '🎵', gradient: 'from-[#D9AFD9] to-[#97D9E1]' },
  { name: 'Mindful Hustle', emoji: '🏃🏻', gradient: 'from-[#8EC5FC] to-[#E0C3FC]' },
  { name: 'Monthly Updates', emoji: '🗓', gradient: 'from-[#97D9E1] to-[#D9AFD9]' },
];

function ArticleCard({ post }: { post: BlogPost }) {
  // Using a placeholder image if none exists, to match the layout
  const imageUrl = post.slug === 'how-to-deal-with-breakup' ? 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&q=80&w=600' :
                   post.slug === 'how-to-stop-overthinking' ? 'https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?auto=format&fit=crop&q=80&w=600' :
                   'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=600';

  return (
    <Link
      to={`/breathe/${post.slug}`}
      className="group block bg-white h-full flex flex-col"
    >
      <div className="w-full aspect-[4/3] overflow-hidden bg-gray-100 mb-4">
        <img 
          src={imageUrl} 
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <h3 className="font-sans text-[17px] font-bold text-gray-900 leading-snug mb-3 pr-4 group-hover:text-red-500 transition-colors line-clamp-3">
        {post.title}
      </h3>
      <div className="mt-auto flex items-center text-sm font-semibold text-gray-900 group-hover:text-red-500 transition-colors">
        Read more <span className="ml-1 text-red-500 text-lg leading-none">›</span>
      </div>
    </Link>
  );
}

export default function BlogListPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();

  const filteredPosts = activeCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(p => p.category === activeCategory);

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      <SEOHead
        title="Breathe by Brain Heal - Stories, Healing & Real Talk"
        description="Breathe is Brain Heal India's space for real stories, practical advice, and gentle wisdom. Breakups, anxiety, loneliness, self-love - we talk about it all. No judgment, just healing."
        url="https://brainheal.in/breathe"
      />

      {/* ── Marquee Banner ── */}
      <div className="w-full bg-[#FCF8F3] border-b border-gray-200 overflow-hidden py-2.5">
        <div className="whitespace-nowrap animate-[marquee_20s_linear_infinite] flex items-center justify-around text-xs font-semibold tracking-wide text-black uppercase">
          <span>Take a mental health break with us</span>
          <span className="hidden sm:inline">Take a mental health break with us</span>
          <span className="hidden md:inline">Take a mental health break with us</span>
          <span className="hidden lg:inline">Take a mental health break with us</span>
        </div>
      </div>

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link to="/" className="font-instrument text-2xl font-bold tracking-tight text-black">
              Rocket<span className="font-normal text-gray-500">Health</span>
              <span className="ml-2 font-sans text-xs tracking-normal font-bold">BrainHeal</span>
            </Link>
            <div className="hidden lg:flex items-center gap-8">
              <Link to="/therapy" className="text-[14px] font-semibold text-gray-900 hover:text-red-500 transition-colors">Mental Health ▾</Link>
              <Link to="/therapy" className="text-[14px] font-semibold text-gray-900 hover:text-red-500 transition-colors">Sexual Health</Link>
              <Link to="/therapy" className="text-[14px] font-semibold text-gray-900 hover:text-red-500 transition-colors">Women's Health ▾</Link>
              <Link to="/community" className="text-[14px] font-semibold text-gray-900 hover:text-red-500 transition-colors">For Business</Link>
              <Link to="/community" className="text-[14px] font-semibold text-gray-900 hover:text-red-500 transition-colors">Rocket Labs <span className="ml-1 text-[10px] bg-[#FFE4E1] text-red-600 px-1.5 py-0.5 rounded-sm">New</span></Link>
              <span className="text-[14px] font-semibold text-red-500">Content Hub</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/" className="hidden sm:block text-[14px] font-semibold text-gray-900 hover:text-red-500 transition-colors">About ▾</Link>
            <button className="hidden sm:inline-flex px-6 py-2.5 bg-black text-white text-[14px] font-bold rounded-full hover:bg-gray-800 transition-colors">
              Log in
            </button>
            <button className="lg:hidden p-2">
              <div className="w-5 h-0.5 bg-black mb-1.5"></div>
              <div className="w-5 h-0.5 bg-black mb-1.5"></div>
              <div className="w-5 h-0.5 bg-black"></div>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div className="relative w-full h-[500px] sm:h-[600px] bg-gradient-to-br from-[#8A2BE2] via-[#FF69B4] to-[#FFA500] flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-instrument text-[3.5rem] sm:text-[5rem] font-medium text-white leading-tight mb-6">
          All the fun starts here
        </h1>
        <p className="text-white text-[15px] sm:text-[17px] font-medium max-w-2xl mx-auto leading-relaxed mb-12">
          Welcome to our Content Hub! It's like a little treat for your eyes and ears. Scroll to find our curated playlists and articles!
        </p>
        <ArrowDown className="text-white/80 animate-bounce" size={32} strokeWidth={1.5} />
      </div>

      {/* ── Category Cards (Overlapping) ── */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 -mt-24 relative z-10 mb-24">
        <div className="bg-white rounded-[32px] p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {CATEGORY_CARDS.map((card, idx) => (
              <button
                key={card.name}
                onClick={() => setActiveCategory(activeCategory === card.name ? 'All' : card.name)}
                className="group relative aspect-square sm:aspect-[4/5] rounded-3xl overflow-hidden text-left transition-transform duration-300 hover:-translate-y-2 border border-gray-100 shadow-sm"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-90`}></div>
                <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]"></div>
                <div className="relative h-full p-5 sm:p-6 flex flex-col justify-between">
                  <h3 className="font-sans text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                    {card.name} <span className="font-normal">{card.emoji}</span>
                  </h3>
                  <div className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center text-white backdrop-blur-sm group-hover:bg-white group-hover:text-black transition-colors">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Articles Section (Split Layout) ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left: Title & Description */}
          <div className="lg:w-1/4 shrink-0">
            <h2 className="font-sans text-[32px] font-bold text-gray-900 mb-4">
              Health Guide
            </h2>
            <p className="text-[15px] font-medium text-gray-700 leading-relaxed mb-8">
              Reliable, relatable medical information in your hands. Grab a coffee and take a deep dive on all things mental and sexual health related ☕️
            </p>
            <button 
              onClick={() => setActiveCategory('All')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-gray-300 text-[13px] font-bold text-gray-900 hover:bg-gray-50 transition-colors"
            >
              View all <span className="text-red-500 text-lg leading-none">›</span>
            </button>
          </div>

          {/* Right: Article Grid */}
          <div className="lg:w-3/4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {filteredPosts.slice(0, 3).map((post) => (
                <ArticleCard key={post.slug} post={post} />
              ))}
            </div>
            
            {/* Carousel Arrows (Visual only to match design) */}
            <div className="flex items-center justify-center gap-4 mt-16">
              <button className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors">
                <ChevronRight size={24} className="rotate-180" />
              </button>
              <button className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ── Playlists Section (Placeholder for matching design) ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-24 border-t border-gray-200">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          <div className="lg:w-1/4 shrink-0">
            <h2 className="font-sans text-[32px] font-bold text-gray-900 mb-4">
              Playlist
            </h2>
            <p className="text-[15px] font-medium text-gray-700 leading-relaxed mb-8">
              Add a little pep to your day with our team's curated playlists. We've got music to soothe every mood 🌸
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-gray-300 text-[13px] font-bold text-gray-900 hover:bg-gray-50 transition-colors">
              View all <span className="text-red-500 text-lg leading-none">›</span>
            </button>
          </div>

          <div className="lg:w-3/4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="aspect-[4/5] rounded-xl bg-[#D4F7A1] p-8 flex flex-col items-center justify-center text-center relative group cursor-pointer">
                <p className="text-sm font-bold mb-4">BrainHeal</p>
                <h3 className="font-instrument text-3xl mb-8">April Recap<br/>Playlist</h3>
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white font-bold text-sm flex items-center justify-between">
                  April Recap 🔁
                </div>
              </div>
              
              <div className="aspect-[4/5] rounded-xl bg-[#FFD1B3] p-8 flex flex-col items-center justify-center text-center relative group cursor-pointer">
                <p className="text-sm font-bold mb-4">BrainHeal</p>
                <h3 className="font-instrument text-3xl mb-8">March Recap<br/>Playlist</h3>
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white font-bold text-sm flex items-center justify-between">
                  March Recap 🔁
                </div>
              </div>

              <div className="aspect-[4/5] rounded-xl bg-gradient-to-br from-[#E0EAFC] to-[#CFDEF3] p-8 flex flex-col items-center justify-center text-center relative group cursor-pointer">
                <p className="text-sm font-bold mb-4">BrainHeal</p>
                <h3 className="font-instrument text-3xl mb-8">Confused &<br/>Overthinking</h3>
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white font-bold text-sm flex items-center justify-between">
                  Confused 🌀
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-4 mt-12">
              <button className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors">
                <ChevronRight size={24} className="rotate-180" />
              </button>
              <button className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Footer is already included */}
      <Footer />

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
