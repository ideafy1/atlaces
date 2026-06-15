import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, ChevronRight } from 'lucide-react';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import { blogPosts, BLOG_CATEGORIES, type BlogPost } from '../data/blogPosts';

const CATEGORY_GRADIENTS: Record<string, string> = {
  'Relationships': 'from-rose-400 via-pink-500 to-purple-500',
  'Self-Care': 'from-violet-400 via-purple-500 to-indigo-500',
  'Overthinking': 'from-blue-400 via-indigo-500 to-violet-500',
  'Healing': 'from-emerald-400 via-teal-500 to-cyan-500',
  'Growth': 'from-amber-400 via-orange-500 to-red-400',
  'Wellness': 'from-teal-400 via-cyan-500 to-blue-400',
};

const CATEGORY_EMOJIS: Record<string, string> = {
  'Relationships': '\u2764\uFE0F',
  'Self-Care': '\u2728',
  'Overthinking': '\uD83E\uDDE0',
  'Healing': '\uD83C\uDF3F',
  'Growth': '\uD83D\uDE80',
  'Wellness': '\uD83E\uDDD8',
};

function ArticleCard({ post, size = 'default' }: { post: BlogPost; size?: 'default' | 'small' }) {
  const isSmall = size === 'small';
  
  return (
    <Link
      to={`/breathe/${post.slug}`}
      className="group block"
    >
      {/* Image area with gradient */}
      <div className={`relative ${isSmall ? 'h-40' : 'h-52'} rounded-xl overflow-hidden mb-3`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${CATEGORY_GRADIENTS[post.category] || 'from-gray-400 to-gray-600'} opacity-80`}></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-50"></div>
        <div className="absolute bottom-3 left-3">
          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[11px] font-medium text-gray-800">
            {post.category}
          </span>
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
      </div>
      
      {/* Text */}
      <h3 className={`font-instrument ${isSmall ? 'text-base' : 'text-lg'} font-semibold text-gray-900 leading-snug group-hover:text-gray-600 transition-colors line-clamp-2`}>
        {post.title}
      </h3>
      <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
        <span>{post.readTime}</span>
        <span className="w-0.5 h-0.5 rounded-full bg-gray-300"></span>
        <span>{new Date(post.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
      </div>
    </Link>
  );
}

export default function BlogListPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredPosts = activeCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(p => p.category === activeCategory);

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  // Get unique categories from actual posts
  const categories = ['Relationships', 'Self-Care', 'Overthinking', 'Healing', 'Growth', 'Wellness'];

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Breathe by Brain Heal - Stories, Healing & Real Talk"
        description="Breathe is Brain Heal India's space for real stories, practical advice, and gentle wisdom. Breakups, anxiety, loneliness, self-love - we talk about it all. No judgment, just healing."
        url="https://brainheal.in/breathe"
      />

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="font-instrument text-xl font-semibold tracking-tight">
              Brain<span className="text-gray-400">Heal</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-[13px] text-gray-500 hover:text-black transition-colors">Home</Link>
              <Link to="/therapy" className="text-[13px] text-gray-500 hover:text-black transition-colors">Therapy</Link>
              <Link to="/community" className="text-[13px] text-gray-500 hover:text-black transition-colors">Community</Link>
              <span className="text-[13px] font-medium text-black">Breathe</span>
            </div>
          </div>
          <Link 
            to="/therapy"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-black text-white text-[13px] font-medium rounded-full hover:bg-gray-800 transition-colors"
          >
            Talk to someone
            <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-rose-400 via-purple-500 to-indigo-500">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
          <p className="text-white/70 text-sm font-medium tracking-wider uppercase mb-4">Breathe by Brain Heal</p>
          <h1 className="font-instrument text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-tight">
            All the healing starts here
          </h1>
          <p className="mt-4 text-white/80 text-base sm:text-lg max-w-lg mx-auto">
            Real stories and honest advice about relationships, heartbreak, overthinking, and finding your calm.
          </p>
          <div className="mt-6 animate-bounce">
            <svg className="mx-auto w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Category Cards ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? 'All' : cat)}
              className={`relative rounded-xl p-4 sm:p-5 text-left overflow-hidden transition-all duration-300 ${
                activeCategory === cat ? 'ring-2 ring-black ring-offset-2 scale-[1.02]' : 'hover:scale-[1.02]'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${CATEGORY_GRADIENTS[cat]} opacity-90`}></div>
              <div className="relative">
                <span className="text-2xl">{CATEGORY_EMOJIS[cat]}</span>
                <p className="mt-2 text-white text-sm font-medium">{cat}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Articles Section ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-instrument text-2xl sm:text-3xl font-semibold text-black">
              {activeCategory === 'All' ? 'Stories & Guides' : activeCategory}
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              {activeCategory === 'All' 
                ? 'Read, reflect, and feel a little lighter.' 
                : `Everything about ${activeCategory.toLowerCase()}.`}
            </p>
          </div>
          {activeCategory !== 'All' && (
            <button 
              onClick={() => setActiveCategory('All')}
              className="text-sm text-gray-500 hover:text-black transition-colors flex items-center gap-1"
            >
              View all <ChevronRight size={14} />
            </button>
          )}
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400">No stories in this category yet.</p>
          </div>
        ) : (
          <>
            {/* Featured article (first post, larger) */}
            {filteredPosts.length > 0 && (
              <Link
                to={`/breathe/${filteredPosts[0].slug}`}
                className="group block mb-12"
              >
                <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-center">
                  {/* Image */}
                  <div className={`relative h-64 md:h-80 rounded-2xl overflow-hidden bg-gradient-to-br ${CATEGORY_GRADIENTS[filteredPosts[0].category]} opacity-90`}>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-40"></div>
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-800">
                        {filteredPosts[0].category}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                  </div>
                  
                  {/* Text */}
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Featured</p>
                    <h3 className="font-instrument text-2xl sm:text-3xl font-semibold text-black leading-snug group-hover:text-gray-600 transition-colors">
                      {filteredPosts[0].title}
                    </h3>
                    <p className="mt-4 text-gray-500 text-[15px] leading-relaxed line-clamp-3">
                      {filteredPosts[0].excerpt}
                    </p>
                    <div className="mt-6 flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock size={14} />
                        <span>{filteredPosts[0].readTime}</span>
                      </div>
                      <span className="text-gray-300">|</span>
                      <span className="text-sm text-gray-400">
                        {new Date(filteredPosts[0].date).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="mt-6">
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-black group-hover:gap-2.5 transition-all">
                        Read more <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Divider */}
            <div className="border-t border-gray-100 mb-10"></div>

            {/* Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {filteredPosts.slice(1).map((post) => (
                <ArticleCard key={post.slug} post={post} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── CTA Strip ── */}
      <div className="bg-black py-14 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-instrument text-2xl sm:text-3xl font-semibold text-white">
            Reading helps. Talking heals.
          </h2>
          <p className="mt-3 text-gray-400 text-[15px] max-w-md mx-auto">
            If any of these stories hit close to home, maybe it's time to talk to someone who truly listens.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/therapy"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-full font-medium text-sm hover:bg-gray-100 transition-colors"
            >
              Talk to someone <ArrowRight size={14} />
            </Link>
            <Link
              to="/community"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white border border-white/20 rounded-full font-medium text-sm hover:bg-white/20 transition-colors"
            >
              Join the community
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
