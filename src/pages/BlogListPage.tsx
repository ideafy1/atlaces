import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, Sparkles, Heart, Search } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import { blogPosts, BLOG_CATEGORIES, type BlogPost } from '../data/blogPosts';

const CATEGORY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  'Relationships': { bg: 'bg-rose-50', text: 'text-rose-600', dot: 'bg-rose-400' },
  'Self-Care': { bg: 'bg-violet-50', text: 'text-violet-600', dot: 'bg-violet-400' },
  'Overthinking': { bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-400' },
  'Healing': { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-400' },
  'Growth': { bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-400' },
  'Wellness': { bg: 'bg-teal-50', text: 'text-teal-600', dot: 'bg-teal-400' },
};

const CARD_GRADIENTS = [
  'from-violet-200 via-purple-100 to-pink-200',
  'from-rose-200 via-pink-100 to-orange-100',
  'from-blue-200 via-indigo-100 to-purple-100',
  'from-emerald-200 via-teal-100 to-cyan-100',
  'from-amber-200 via-orange-100 to-yellow-100',
  'from-pink-200 via-rose-100 to-red-100',
  'from-teal-200 via-emerald-100 to-green-100',
  'from-indigo-200 via-blue-100 to-sky-100',
  'from-orange-200 via-amber-100 to-yellow-100',
  'from-purple-200 via-violet-100 to-fuchsia-100',
];

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  const colors = CATEGORY_COLORS[post.category] || CATEGORY_COLORS['Healing'];
  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group block rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Card Image / Gradient */}
      <div className={`relative h-48 sm:h-52 bg-gradient-to-br ${gradient} overflow-hidden`}>
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/40 blur-xl"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-white/30 blur-lg"></div>
        </div>
        
        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text} backdrop-blur-sm`}>
            <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`}></span>
            {post.category}
          </span>
        </div>

        {/* Read time */}
        <div className="absolute bottom-4 right-4">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white/80 text-gray-700 backdrop-blur-sm">
            <Clock size={12} />
            {post.readTime}
          </span>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500"></div>
      </div>

      {/* Card Content */}
      <div className="p-5 sm:p-6">
        <h3 className="font-instrument text-lg sm:text-xl font-semibold text-gray-900 leading-snug group-hover:text-violet-700 transition-colors duration-300 line-clamp-2">
          {post.title}
        </h3>
        <p className="mt-2.5 text-sm text-gray-500 leading-relaxed line-clamp-2">
          {post.excerpt}
        </p>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
              <Heart size={12} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-800">{post.author.name}</p>
              <p className="text-[10px] text-gray-400">{new Date(post.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>
          <ArrowRight size={16} className="text-gray-300 group-hover:text-violet-500 group-hover:translate-x-1 transition-all duration-300" />
        </div>
      </div>
    </Link>
  );
}

export default function BlogListPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [visiblePosts, setVisiblePosts] = useState<BlogPost[]>(blogPosts);

  useEffect(() => {
    let filtered = blogPosts;
    
    if (activeCategory !== 'All') {
      filtered = filtered.filter(p => p.category === activeCategory);
    }
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    
    setVisiblePosts(filtered);
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <SEOHead
        title="Stories & Healing — Brain Heal India Blog"
        description="Real stories, practical advice, and gentle wisdom for navigating life's toughest moments. Breakups, anxiety, loneliness, self-love — we talk about it all. No judgment, just healing."
        url="https://brainheal.in/blog"
      />

      {/* Top Navigation */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-instrument text-xl font-semibold">Brain Heal</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors hidden sm:block">Home</Link>
            <Link to="/therapy" className="text-sm text-gray-500 hover:text-gray-900 transition-colors hidden sm:block">Therapy</Link>
            <Link to="/community" className="text-sm text-gray-500 hover:text-gray-900 transition-colors hidden sm:block">Community</Link>
            <span className="text-sm font-medium text-violet-600">Blog</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-purple-50/50 to-pink-50/30"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-violet-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-pink-200/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-12">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-100/80 text-violet-700 text-xs font-medium mb-6">
              <Sparkles size={14} />
              Brain Heal Blog
            </div>
            <h1 className="font-instrument text-4xl sm:text-5xl lg:text-6xl font-semibold text-gray-900 leading-tight">
              Stories & <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Healing</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-500 leading-relaxed max-w-lg mx-auto">
              Real talk about the stuff nobody prepares you for. Breakups, overthinking, loneliness, self-love — we've been there too.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-8 max-w-md mx-auto relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for a topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white shadow-sm border border-gray-200/60 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent transition-all"
            />
          </div>

          {/* Category Pills */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {BLOG_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-200'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {visiblePosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-gray-400">No posts found. Try a different search or category.</p>
          </div>
        ) : (
          <>
            {/* Featured Post (first one, larger) */}
            {visiblePosts.length > 0 && (
              <Link
                to={`/blog/${visiblePosts[0].slug}`}
                className="group block mb-10 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <div className="grid md:grid-cols-2 gap-0">
                  <div className={`h-56 md:h-full min-h-[280px] bg-gradient-to-br ${CARD_GRADIENTS[0]} relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-30">
                      <div className="absolute top-8 right-8 w-32 h-32 rounded-full bg-white/40 blur-2xl"></div>
                      <div className="absolute bottom-8 left-8 w-24 h-24 rounded-full bg-white/30 blur-xl"></div>
                    </div>
                    <div className="absolute top-5 left-5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/80 text-violet-700 backdrop-blur-sm">
                        ✨ Featured
                      </span>
                    </div>
                  </div>
                  <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium w-fit ${CATEGORY_COLORS[visiblePosts[0].category]?.bg || 'bg-gray-100'} ${CATEGORY_COLORS[visiblePosts[0].category]?.text || 'text-gray-600'}`}>
                      {visiblePosts[0].category}
                    </span>
                    <h2 className="mt-4 font-instrument text-2xl sm:text-3xl font-semibold text-gray-900 leading-snug group-hover:text-violet-700 transition-colors duration-300">
                      {visiblePosts[0].title}
                    </h2>
                    <p className="mt-3 text-gray-500 leading-relaxed line-clamp-3">
                      {visiblePosts[0].excerpt}
                    </p>
                    <div className="mt-6 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
                        <Heart size={14} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{visiblePosts[0].author.name}</p>
                        <p className="text-xs text-gray-400">{visiblePosts[0].readTime} · {new Date(visiblePosts[0].date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Rest of posts in grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visiblePosts.slice(1).map((post, i) => (
                <BlogCard key={post.slug} post={post} index={i + 1} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 py-16 sm:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-instrument text-2xl sm:text-3xl font-semibold text-white">
            Reading helps. Talking heals.
          </h2>
          <p className="mt-4 text-violet-200 text-base sm:text-lg leading-relaxed">
            If any of these stories resonated with you, maybe it's time to talk to someone who truly listens. No judgment. No lectures. Just real connection.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/therapy"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-violet-700 rounded-xl font-medium text-sm hover:bg-violet-50 transition-colors shadow-lg"
            >
              Talk to Someone <ArrowRight size={16} />
            </Link>
            <Link
              to="/community"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl font-medium text-sm hover:bg-white/20 transition-colors"
            >
              Join the Community
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
