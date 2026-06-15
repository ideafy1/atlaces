import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Share2, Heart, Sparkles, Copy, ArrowRight } from 'lucide-react';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import { getBlogBySlug, getRelatedPosts, type BlogPost } from '../data/blogPosts';

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  'Relationships': { bg: 'bg-rose-50', text: 'text-rose-600' },
  'Self-Care': { bg: 'bg-violet-50', text: 'text-violet-600' },
  'Overthinking': { bg: 'bg-blue-50', text: 'text-blue-600' },
  'Healing': { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  'Growth': { bg: 'bg-amber-50', text: 'text-amber-600' },
  'Wellness': { bg: 'bg-teal-50', text: 'text-teal-600' },
};

const CARD_GRADIENTS = [
  'from-violet-200 via-purple-100 to-pink-200',
  'from-rose-200 via-pink-100 to-orange-100',
  'from-blue-200 via-indigo-100 to-purple-100',
  'from-emerald-200 via-teal-100 to-cyan-100',
  'from-amber-200 via-orange-100 to-yellow-100',
];

function ShareButtons({ url, title }: { url: string; title: string }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied!');
    } catch {
      // fallback
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
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400 mr-1">Share</span>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-blue-50 hover:text-blue-500 flex items-center justify-center text-gray-500 transition-all text-xs font-bold"
        aria-label="Share on X"
      >
        𝕏
      </a>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-green-50 hover:text-green-600 flex items-center justify-center text-gray-500 transition-all"
        aria-label="Share on WhatsApp"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
      </a>
      <button
        onClick={handleCopy}
        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-violet-50 hover:text-violet-500 flex items-center justify-center text-gray-500 transition-all"
        aria-label="Copy link"
      >
        <Copy size={14} />
      </button>
    </div>
  );
}

function RelatedPostCard({ post, index }: { post: BlogPost; index: number }) {
  const colors = CATEGORY_COLORS[post.category] || CATEGORY_COLORS['Healing'];
  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];

  return (
    <Link
      to={`/breathe/${post.slug}`}
      className="group block rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-400 hover:-translate-y-0.5"
    >
      <div className={`h-32 bg-gradient-to-br ${gradient} relative`}>
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${colors.bg} ${colors.text}`}>
            {post.category}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-instrument text-sm font-semibold text-gray-900 leading-snug group-hover:text-violet-600 transition-colors line-clamp-2">
          {post.title}
        </h4>
        <p className="mt-1.5 text-xs text-gray-400">{post.readTime}</p>
      </div>
    </Link>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = getBlogBySlug(slug || '');
  const relatedPosts = getRelatedPosts(slug || '', 3);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="font-instrument text-3xl text-gray-900 mb-4">Post not found</h1>
          <p className="text-gray-500 mb-6">The blog post you're looking for doesn't exist.</p>
          <Link to="/breathe" className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-medium hover:bg-violet-700 transition-colors">
            <ArrowLeft size={16} /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const colors = CATEGORY_COLORS[post.category] || CATEGORY_COLORS['Healing'];
  const postUrl = `https://brainheal.in/breathe/${post.slug}`;
  const formattedDate = new Date(post.date).toLocaleDateString('en-IN', {
    month: 'long', day: 'numeric', year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title={`${post.title} — Breathe by Brain Heal`}
        description={post.excerpt}
        url={postUrl}
      />

      {/* Top Navigation */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate('/breathe')}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back to Breathe</span>
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Sparkles size={12} className="text-white" />
            </div>
            <span className="font-instrument text-lg font-semibold">Brain Heal</span>
          </Link>
          <ShareButtons url={postUrl} title={post.title} />
        </div>
      </div>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Article Header */}
        <header className="pt-10 sm:pt-16 pb-8">
          <div className="flex items-center gap-3 mb-5">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
              {post.category}
            </span>
            <span className="text-xs text-gray-400">·</span>
            <span className="inline-flex items-center gap-1 text-xs text-gray-400">
              <Clock size={12} />
              {post.readTime}
            </span>
          </div>

          <h1 className="font-instrument text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-gray-900 leading-tight">
            {post.title}
          </h1>

          <p className="mt-5 text-lg text-gray-500 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Author & Date */}
          <div className="mt-8 flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-md shadow-violet-200">
              <Heart size={18} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
              <p className="text-xs text-gray-400">{post.author.role} · {formattedDate}</p>
            </div>
          </div>

          {/* Tags */}
          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="px-2.5 py-1 rounded-lg bg-gray-100 text-[11px] text-gray-500 font-medium">
                #{tag}
              </span>
            ))}
          </div>
        </header>

        {/* Divider */}
        <div className="border-t border-gray-100 mb-10"></div>

        {/* Article Body — Rich HTML content */}
        <div
          className="blog-prose"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* CTA Section */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-16 mb-12">
        <div className="rounded-2xl bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 p-8 sm:p-10 border border-violet-100/50">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-violet-100 mb-4">
              <Heart size={20} className="text-violet-600" />
            </div>
            <h3 className="font-instrument text-xl sm:text-2xl font-semibold text-gray-900">
              Did this resonate with you?
            </h3>
            <p className="mt-3 text-gray-500 text-sm sm:text-base max-w-md mx-auto">
              Sometimes reading helps. But sometimes, you need someone who really listens. Our therapists are warm, affordable, and actually get it.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/therapy"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-xl font-medium text-sm hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200"
              >
                Talk to Someone <ArrowRight size={16} />
              </Link>
              <Link
                to="/community"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-violet-700 border border-violet-200 rounded-xl font-medium text-sm hover:bg-violet-50 transition-colors"
              >
                Join the Community
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="bg-gray-50/80 py-14">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h3 className="font-instrument text-xl sm:text-2xl font-semibold text-gray-900 mb-8">
              Keep reading ✨
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {relatedPosts.map((p, i) => (
                <RelatedPostCard key={p.slug} post={p} index={i} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/breathe" className="text-sm text-violet-600 hover:text-violet-800 font-medium transition-colors">
                View all stories →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />

      {/* Blog Prose Styles */}
      <style>{`
        .blog-prose {
          font-family: 'Inter', sans-serif;
          font-size: 1.0625rem;
          line-height: 1.8;
          color: #374151;
        }
        .blog-prose h2 {
          font-family: 'Instrument Serif', serif;
          font-size: 1.625rem;
          font-weight: 600;
          color: #111827;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          line-height: 1.3;
        }
        .blog-prose h3 {
          font-family: 'Instrument Serif', serif;
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          line-height: 1.4;
        }
        .blog-prose p {
          margin-bottom: 1.25rem;
        }
        .blog-prose ul, .blog-prose ol {
          margin-bottom: 1.25rem;
          padding-left: 1.5rem;
        }
        .blog-prose ul {
          list-style-type: disc;
        }
        .blog-prose ol {
          list-style-type: decimal;
        }
        .blog-prose li {
          margin-bottom: 0.5rem;
          line-height: 1.7;
        }
        .blog-prose strong {
          color: #111827;
          font-weight: 600;
        }
        .blog-prose em {
          font-style: italic;
          color: #4b5563;
        }
        .blog-prose a {
          color: #7c3aed;
          font-weight: 500;
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-color: rgba(124, 58, 237, 0.3);
          transition: text-decoration-color 0.2s;
        }
        .blog-prose a:hover {
          text-decoration-color: rgba(124, 58, 237, 0.8);
        }
        .blog-prose blockquote {
          border-left: 3px solid #c4b5fd;
          padding-left: 1.25rem;
          margin: 1.5rem 0;
          color: #6b7280;
          font-style: italic;
        }
        .blog-prose img {
          border-radius: 1rem;
          margin: 1.5rem 0;
          width: 100%;
        }
        @media (max-width: 640px) {
          .blog-prose {
            font-size: 1rem;
          }
          .blog-prose h2 {
            font-size: 1.375rem;
          }
          .blog-prose h3 {
            font-size: 1.125rem;
          }
        }
      `}</style>
    </div>
  );
}
