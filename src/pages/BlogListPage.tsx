import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, User, Eye, Bookmark } from 'lucide-react';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import { ToolbarDock } from '../components/ui/toolbar-dock';
import { blogPosts, BLOG_CATEGORIES, type BlogPost } from '../data/blogPosts';

/* ─────────────── Category card photos ─────────────── */
const CATEGORY_CARDS = [
  {
    name: 'Relationships',
    emoji: '💕',
    photo: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=600',
    desc: 'Love, trust & heartbreak'
  },
  {
    name: 'Wellness',
    emoji: '🧘',
    photo: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600',
    desc: 'Mind, body & soul'
  },
  {
    name: 'Growth',
    emoji: '🌱',
    photo: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=600',
    desc: 'Career & self-growth'
  },
  {
    name: 'Healing',
    emoji: '✨',
    photo: 'https://images.unsplash.com/photo-1510525009512-ad7fc13eefab?auto=format&fit=crop&q=80&w=600',
    desc: 'Recovery & resilience'
  },
];

/* ─────────────── Marquee messages ─────────────── */
const MARQUEE_ITEMS = [
  { text: "You are enough.", style: "font-semibold" },
  { text: "✦", style: "text-blue-400 mx-6" },
  { text: "It's okay to not be okay.", style: "font-normal italic" },
  { text: "✦", style: "text-purple-400 mx-6" },
  { text: "Healing is not linear.", style: "font-semibold" },
  { text: "✦", style: "text-teal-400 mx-6" },
  { text: "Your feelings are valid.", style: "font-normal italic" },
  { text: "✦", style: "text-pink-400 mx-6" },
  { text: "Take it one breath at a time.", style: "font-semibold" },
  { text: "✦", style: "text-indigo-400 mx-6" },
  { text: "Progress, not perfection.", style: "font-normal italic" },
  { text: "✦", style: "text-cyan-400 mx-6" },
  { text: "You deserve peace.", style: "font-semibold" },
  { text: "✦", style: "text-violet-400 mx-6" },
  { text: "Small steps still count.", style: "font-normal italic" },
  { text: "✦", style: "text-emerald-400 mx-6" },
];

/* ─────────────── Article Card (Material Design 3 inspired) ─────────────── */
function ArticleCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <Link
      to={`/breathe/${post.slug}`}
      className="group block"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      {/* Image container with rounded corners like M3 */}
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-3xl bg-gray-100 mb-5 shadow-sm">
        <img
          src={post.heroImage}
          alt={post.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Category pill overlay */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[11px] font-bold text-gray-800 shadow-sm">
            {post.category}
          </span>
        </div>
      </div>

      {/* Meta row: author + read time + icons */}
      <div className="flex items-center gap-3 mb-3 text-[12px] text-gray-500 font-medium">
        <span className="inline-flex items-center gap-1">
          <User size={13} strokeWidth={2} />
          {post.author.name}
        </span>
        <span className="w-[3px] h-[3px] rounded-full bg-gray-300"></span>
        <span className="inline-flex items-center gap-1">
          <Clock size={13} strokeWidth={2} />
          {post.readTime}
        </span>
        <span className="ml-auto inline-flex items-center gap-2 text-gray-400">
          <Bookmark size={14} strokeWidth={1.5} className="hover:text-gray-600 transition-colors cursor-pointer" />
          <Eye size={14} strokeWidth={1.5} />
        </span>
      </div>

      {/* Title */}
      <h3 className="font-sans text-[16px] sm:text-[17px] font-bold text-gray-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
        {post.title}
      </h3>

      {/* Excerpt */}
      <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-2 mb-4">
        {post.excerpt}
      </p>

      {/* Read more link */}
      <div className="inline-flex items-center gap-1.5 text-[13px] font-bold text-blue-600 group-hover:gap-3 transition-all duration-300">
        Read story
        <ArrowRight size={14} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}


/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
export default function BlogListPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();

  const filteredPosts = activeCategory === 'All'
    ? blogPosts
    : blogPosts.filter(p => p.category === activeCategory);

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      <SEOHead
        title="Breathe by Brain Heal — Stories, Healing & Real Talk"
        description="Breathe is Brain Heal India's space for real stories, practical advice, and gentle wisdom. Breakups, anxiety, loneliness, self-love — we talk about it all. No judgment, just healing."
        url="https://brainheal.in/breathe"
      />

      {/* ── Marquee Banner ── */}
      <div className="w-full bg-[#f5f7ff] border-b border-gray-100 overflow-hidden py-2.5">
        <div className="whitespace-nowrap animate-[marquee_40s_linear_infinite] flex items-center text-[12px] tracking-widest text-gray-600 uppercase" style={{ fontFamily: 'var(--font-dm)' }}>
          {/* Duplicate for seamless loop */}
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className={item.style}>{item.text}</span>
          ))}
        </div>
      </div>

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/80">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 h-[64px] flex items-center justify-between">
          <Link to="/" className="font-sans text-xl font-bold tracking-tight text-black">
            Brain<span className="font-normal text-gray-400">Heal</span>
          </Link>
          <div className="relative z-[60]">
            <ToolbarDock defaultCollapsed={true} />
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#e8f0fe] via-[#d2e3fc] to-[#c2d9ff]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-24 sm:py-32 lg:py-40">
          <div className="max-w-3xl">
            {/* Overline */}
            <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-sm text-[12px] font-bold text-blue-700 tracking-wide uppercase mb-8 border border-blue-100/60">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Breathe by BrainHeal
            </div>

            {/* Main heading */}
            <h1 className="animate-fade-in-up font-sans text-[2.8rem] sm:text-[4rem] lg:text-[4.5rem] font-bold tracking-tight text-gray-900 leading-[1.08] mb-6" style={{ animationDelay: '0.1s' }}>
              Find your
              <br />
              <span className="text-blue-600">
                peace of mind.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="animate-fade-in-up text-gray-600 text-[16px] sm:text-[18px] font-medium max-w-xl leading-relaxed mb-10" style={{ animationDelay: '0.2s', fontFamily: 'var(--font-dm)' }}>
              A quiet corner of the internet for real stories, practical advice, and gentle wisdom. No judgment here. Just space to breathe and be.
            </p>

            {/* CTA */}
            <div className="animate-fade-in-up flex flex-wrap gap-4" style={{ animationDelay: '0.3s' }}>
              <button
                onClick={() => document.getElementById('healing-guides')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-gray-900 text-white text-[14px] font-bold rounded-full hover:bg-black transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/20 hover:-translate-y-0.5 active:translate-y-0"
              >
                Start reading
                <ArrowRight size={16} strokeWidth={2.5} />
              </button>
              <button
                onClick={() => navigate('/therapy')}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/70 backdrop-blur-sm text-gray-800 text-[14px] font-bold rounded-full border border-gray-200/80 hover:bg-white hover:border-gray-300 transition-all duration-300 hover:-translate-y-0.5"
              >
                Talk to someone
              </button>
            </div>
          </div>
        </div>
        {/* Decorative blurred shapes */}
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-blue-300/30 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-40 w-56 h-56 rounded-full bg-purple-300/20 blur-3xl pointer-events-none"></div>
        <div className="absolute top-40 right-1/3 w-40 h-40 rounded-full bg-indigo-200/30 blur-2xl pointer-events-none"></div>
      </section>

      {/* ── Category Cards ── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-8 -mt-16 relative z-10 mb-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 stagger-children">
          {CATEGORY_CARDS.map((card) => (
            <button
              key={card.name}
              onClick={() => {
                setActiveCategory(activeCategory === card.name ? 'All' : card.name);
                document.getElementById('healing-guides')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`group relative aspect-[3/2] sm:aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden text-left transition-all duration-500 hover:-translate-y-2 hover:shadow-xl ${activeCategory === card.name ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
            >
              <img src={card.photo} alt={card.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="relative h-full p-4 sm:p-6 flex flex-col justify-end">
                <p className="text-white/70 text-[11px] sm:text-[12px] font-medium mb-1" style={{ fontFamily: 'var(--font-dm)' }}>{card.desc}</p>
                <h3 className="font-sans text-base sm:text-lg font-bold text-white leading-tight">
                  {card.name} <span className="ml-1">{card.emoji}</span>
                </h3>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── Healing Guides (Articles) ── */}
      <section id="healing-guides" className="max-w-[1200px] mx-auto px-4 sm:px-8 py-16 sm:py-24">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <p className="text-[12px] font-bold text-blue-600 uppercase tracking-widest mb-2" style={{ fontFamily: 'var(--font-dm)' }}>Stories & Guides</p>
            <h2 className="font-sans text-[28px] sm:text-[36px] font-bold text-gray-900 leading-tight">
              Healing Guides
            </h2>
            <p className="text-[14px] sm:text-[15px] text-gray-500 mt-3 max-w-md leading-relaxed" style={{ fontFamily: 'var(--font-dm)' }}>
              Real conversations and expert-backed advice to help you navigate life's toughest moments.
            </p>
          </div>
        </div>

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {BLOG_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-[12px] font-bold transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles grid — always visible */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14 stagger-children">
          {filteredPosts.map((post, i) => (
            <ArticleCard key={post.slug} post={post} index={i} />
          ))}
        </div>
      </section>

      {/* ── Vibe & Heal (Playlists) ── */}
      <section className="bg-[#fafbfd] border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-20 sm:py-28">
          <div className="text-center mb-14">
            <p className="text-[12px] font-bold text-purple-600 uppercase tracking-widest mb-2" style={{ fontFamily: 'var(--font-dm)' }}>Curated Playlists</p>
            <h2 className="font-sans text-[28px] sm:text-[36px] font-bold text-gray-900 leading-tight mb-3">
              Vibe & Heal
            </h2>
            <p className="text-[14px] sm:text-[15px] text-gray-500 max-w-md mx-auto" style={{ fontFamily: 'var(--font-dm)' }}>
              Music is therapy. Tune into playlists designed to calm your anxiety and lift your mood.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {[
              { title: 'Late Night\nThoughts', label: 'Night Owls 🌙', photo: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&q=80&w=600' },
              { title: 'Morning\nCalm', label: 'Sunrise 🌅', photo: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=600' },
              { title: 'Overcoming\nHeartbreak', label: 'Healing ❤️‍🩹', photo: 'https://images.unsplash.com/photo-1490750967868-88cb4ecb0704?auto=format&fit=crop&q=80&w=600' },
            ].map((playlist) => (
              <div key={playlist.label} className="group relative aspect-[4/5] rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <img src={playlist.photo} alt={playlist.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10 group-hover:from-black/80 transition-colors duration-500"></div>
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-8">
                  <p className="text-[12px] font-bold text-white/70 tracking-widest uppercase mb-4">BrainHeal</p>
                  <h3 className="font-sans text-2xl sm:text-3xl font-bold text-white drop-shadow-md whitespace-pre-line mb-8">{playlist.title}</h3>
                  <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm text-gray-900 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-white transition-all duration-300">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/40 backdrop-blur-lg font-bold text-sm text-white z-10 border-t border-white/10">
                  {playlist.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
