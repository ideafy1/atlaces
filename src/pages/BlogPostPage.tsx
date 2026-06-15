import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, Copy } from 'lucide-react';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import { getBlogBySlug, getRelatedPosts, type BlogPost } from '../data/blogPosts';

const CATEGORY_GRADIENTS: Record<string, string> = {
  'Relationships': 'from-rose-400 via-pink-500 to-purple-500',
  'Self-Care': 'from-violet-400 via-purple-500 to-indigo-500',
  'Overthinking': 'from-blue-400 via-indigo-500 to-violet-500',
  'Healing': 'from-emerald-400 via-teal-500 to-cyan-500',
  'Growth': 'from-amber-400 via-orange-500 to-red-400',
  'Wellness': 'from-teal-400 via-cyan-500 to-blue-400',
};

function ShareBar({ url, title }: { url: string; title: string }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied!');
    } catch {
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      alert('Link copied!');
    }
  };

  return (
    <div className="flex items-center gap-3">
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-all text-xs font-bold"
        aria-label="Share on X"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </a>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-all"
        aria-label="Share on WhatsApp"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
      </a>
      <button
        onClick={handleCopy}
        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-all"
        aria-label="Copy link"
      >
        <Copy size={14} />
      </button>
    </div>
  );
}

function RelatedCard({ post }: { post: BlogPost }) {
  return (
    <Link
      to={`/breathe/${post.slug}`}
      className="group block"
    >
      <div className={`h-36 rounded-xl overflow-hidden mb-3 bg-gradient-to-br ${CATEGORY_GRADIENTS[post.category] || 'from-gray-400 to-gray-600'} opacity-85 group-hover:opacity-100 transition-opacity`}>
        <div className="absolute bottom-2 left-2">
          <span className="px-2 py-0.5 bg-white/80 rounded-full text-[10px] font-medium text-gray-700">
            {post.category}
          </span>
        </div>
      </div>
      <h4 className="font-instrument text-sm font-semibold text-gray-900 leading-snug group-hover:text-gray-500 transition-colors line-clamp-2">
        {post.title}
      </h4>
      <p className="mt-1.5 text-xs text-gray-400">{post.readTime}</p>
    </Link>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = getBlogBySlug(slug || '');
  const relatedPosts = getRelatedPosts(slug || '', 3);

  useEffect(() => { window.scrollTo({ top: 0 }); }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-6xl mb-4">404</p>
          <h1 className="font-instrument text-2xl text-black mb-2">Story not found</h1>
          <p className="text-gray-400 text-sm mb-6">This page doesn't exist or may have been moved.</p>
          <Link 
            to="/breathe" 
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Breathe
          </Link>
        </div>
      </div>
    );
  }

  const postUrl = `https://brainheal.in/breathe/${post.slug}`;
  const formattedDate = new Date(post.date).toLocaleDateString('en-IN', {
    month: 'long', day: 'numeric', year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title={`${post.title} - Breathe by Brain Heal`}
        description={post.excerpt}
        url={postUrl}
      />

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate('/breathe')}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Breathe</span>
          </button>
          <Link to="/" className="font-instrument text-lg font-semibold tracking-tight">
            Brain<span className="text-gray-400">Heal</span>
          </Link>
          <ShareBar url={postUrl} title={post.title} />
        </div>
      </nav>

      {/* ── Article ── */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <header className="pt-10 sm:pt-16 pb-8">
          <div className="flex items-center gap-2 mb-5">
            <span className="px-2.5 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
              {post.category}
            </span>
            <span className="text-xs text-gray-300">|</span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock size={12} />
              {post.readTime}
            </span>
          </div>

          <h1 className="font-instrument text-3xl sm:text-4xl lg:text-[2.625rem] font-semibold text-black leading-[1.15]">
            {post.title}
          </h1>

          <p className="mt-5 text-[17px] text-gray-500 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Author */}
          <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                <span className="text-white text-sm font-medium">BH</span>
              </div>
              <div>
                <p className="text-sm font-medium text-black">{post.author.name}</p>
                <p className="text-xs text-gray-400">{formattedDate}</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="mt-6 flex flex-wrap gap-1.5">
            {post.tags.map(tag => (
              <span key={tag} className="px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100 text-[11px] text-gray-500">
                #{tag}
              </span>
            ))}
          </div>
        </header>

        {/* Divider */}
        <div className="border-t border-gray-100 mb-10"></div>

        {/* Body */}
        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* ── CTA ── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-16 mb-12">
        <div className="rounded-2xl bg-gray-50 p-8 sm:p-10 border border-gray-100">
          <div className="text-center">
            <h3 className="font-instrument text-xl sm:text-2xl font-semibold text-black">
              Did this resonate with you?
            </h3>
            <p className="mt-3 text-gray-500 text-sm max-w-md mx-auto">
              Sometimes reading helps. But sometimes, you need someone who really listens. Our listeners are warm, affordable, and actually get it.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/therapy"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-full font-medium text-sm hover:bg-gray-800 transition-colors"
              >
                Talk to someone <ArrowRight size={14} />
              </Link>
              <Link
                to="/community"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black border border-gray-200 rounded-full font-medium text-sm hover:bg-gray-50 transition-colors"
              >
                Join the community
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Related ── */}
      {relatedPosts.length > 0 && (
        <div className="border-t border-gray-100 py-14">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-instrument text-xl sm:text-2xl font-semibold text-black">
                Related stories
              </h3>
              <Link to="/breathe" className="text-sm text-gray-500 hover:text-black transition-colors flex items-center gap-1">
                All stories <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {relatedPosts.map(p => (
                <RelatedCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />

      {/* ── Prose Styles ── */}
      <style>{`
        .article-body {
          font-family: 'Inter', -apple-system, sans-serif;
          font-size: 1.0625rem;
          line-height: 1.85;
          color: #1f2937;
        }
        .article-body h2 {
          font-family: 'Instrument Serif', serif;
          font-size: 1.5rem;
          font-weight: 600;
          color: #000;
          margin-top: 2.5rem;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }
        .article-body h3 {
          font-family: 'Instrument Serif', serif;
          font-size: 1.2rem;
          font-weight: 600;
          color: #111;
          margin-top: 2rem;
          margin-bottom: 0.6rem;
          line-height: 1.4;
        }
        .article-body p {
          margin-bottom: 1.25rem;
        }
        .article-body ul, .article-body ol {
          margin-bottom: 1.25rem;
          padding-left: 1.5rem;
        }
        .article-body ul { list-style-type: disc; }
        .article-body ol { list-style-type: decimal; }
        .article-body li {
          margin-bottom: 0.5rem;
          line-height: 1.7;
        }
        .article-body strong {
          color: #000;
          font-weight: 600;
        }
        .article-body em {
          font-style: italic;
          color: #6b7280;
        }
        .article-body a {
          color: #000;
          font-weight: 500;
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-thickness: 1px;
        }
        .article-body a:hover {
          text-decoration-thickness: 2px;
        }
        .article-body blockquote {
          border-left: 2px solid #000;
          padding-left: 1.25rem;
          margin: 1.5rem 0;
          color: #6b7280;
          font-style: italic;
        }
        .article-body img {
          border-radius: 0.75rem;
          margin: 1.5rem 0;
          width: 100%;
        }
        @media (max-width: 640px) {
          .article-body { font-size: 1rem; }
          .article-body h2 { font-size: 1.3rem; }
          .article-body h3 { font-size: 1.1rem; }
        }
      `}</style>
    </div>
  );
}
