import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import { ToolbarDock } from '../components/ui/toolbar-dock';
import { getBlogBySlug, getRelatedPosts, type BlogPost } from '../data/blogPosts';

function RelatedCard({ post }: { post: BlogPost }) {
  // Using a placeholder image if none exists, to match the layout
  const imageUrl = post.slug === 'how-to-deal-with-breakup' ? 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&q=80&w=600' :
                   post.slug === 'how-to-stop-overthinking' ? 'https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?auto=format&fit=crop&q=80&w=600' :
                   'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=600';

  return (
    <Link
      to={`/breathe/${post.slug}`}
      className="group block bg-white h-full flex flex-col"
    >
      <div className="w-full aspect-[16/9] overflow-hidden bg-gray-100 mb-3">
        <img 
          src={imageUrl} 
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="inline-block px-2 py-0.5 bg-[#FFE4E1] text-red-500 text-[10px] font-bold uppercase tracking-wider mb-2 w-max">
        {post.category}
      </div>
      <h3 className="font-sans text-[15px] font-bold text-gray-900 leading-snug mb-2 group-hover:text-red-500 transition-colors line-clamp-2">
        {post.title}
      </h3>
      <div className="mt-auto text-xs text-gray-500 font-medium">
        {new Date(post.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
      </div>
    </Link>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = getBlogBySlug(slug || '');
  const relatedPosts = getRelatedPosts(slug || '', 4);

  useEffect(() => { window.scrollTo({ top: 0 }); }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-sans">
        <div className="text-center">
          <p className="text-6xl font-bold mb-4">404</p>
          <h1 className="text-2xl font-bold text-black mb-2">Story not found</h1>
          <p className="text-gray-500 text-sm mb-6">This page doesn't exist or may have been moved.</p>
          <button 
            onClick={() => navigate('/breathe')}
            className="px-6 py-2.5 bg-black text-white rounded-full text-sm font-bold hover:bg-gray-800 transition-colors"
          >
            Back to Content Hub
          </button>
        </div>
      </div>
    );
  }

  const postUrl = `https://brainheal.in/breathe/${post.slug}`;
  const formattedDate = new Date(post.date).toLocaleDateString('en-IN', {
    month: 'long', day: 'numeric', year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-white font-sans">
      <SEOHead
        title={`${post.title} - Breathe by Brain Heal`}
        description={post.excerpt}
        url={postUrl}
      />

      {/* ── Navbar (Same as List Page) ── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link to="/" className="font-sans text-2xl font-bold tracking-tight text-black">
              Brain<span className="font-normal text-gray-500">Heal</span>
            </Link>
            <div className="hidden lg:flex items-center gap-8">
              <Link to="/therapy" className="text-[14px] font-semibold text-gray-900 hover:text-red-500 transition-colors">Mental Health ▾</Link>
              <Link to="/therapy" className="text-[14px] font-semibold text-gray-900 hover:text-red-500 transition-colors">Sexual Health</Link>
              <Link to="/therapy" className="text-[14px] font-semibold text-gray-900 hover:text-red-500 transition-colors">Women's Health ▾</Link>
              <Link to="/community" className="text-[14px] font-semibold text-gray-900 hover:text-red-500 transition-colors">For Business</Link>
              <Link to="/community" className="text-[14px] font-semibold text-gray-900 hover:text-red-500 transition-colors">BrainHeal Labs <span className="ml-1 text-[10px] bg-[#FFE4E1] text-red-600 px-1.5 py-0.5 rounded-sm">New</span></Link>
              <Link to="/breathe" className="text-[14px] font-semibold text-red-500">Content Hub</Link>
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

      {/* ── Breadcrumb ── */}
      <div className="max-w-[720px] mx-auto px-4 pt-8 pb-4">
        <div className="flex items-center gap-2 text-[13px] font-semibold text-gray-400">
          <Link to="/" className="hover:text-red-500 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/breathe" className="hover:text-red-500 transition-colors">Content Hub</Link>
          <span>/</span>
          <span className="text-gray-900">{post.category}</span>
        </div>
      </div>

      {/* ── Article Content ── */}
      <article className="max-w-[720px] mx-auto px-4 pb-20">
        
        <h1 className="font-sans text-[36px] sm:text-[44px] font-bold text-gray-900 leading-[1.1] mb-6 tracking-tight">
          {post.title}
        </h1>

        <p className="text-[18px] text-gray-600 font-medium leading-relaxed mb-8">
          {post.excerpt}
        </p>

        {/* Author details */}
        <div className="flex items-center gap-3 mb-8">
          <img 
            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150" 
            alt="Author" 
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="text-[14px] font-bold text-red-500">{post.author.name}</p>
            <p className="text-[12px] font-semibold text-red-400">{formattedDate}</p>
          </div>
        </div>

        {/* Table of Contents Box */}
        <div className="bg-[#FFFDF9] border border-[#F2EBE1] p-8 mb-12 relative before:absolute before:left-0 before:top-0 before:w-1 before:h-full before:bg-[#E5D5C5]">
          <p className="text-[12px] font-bold text-gray-400 tracking-wider uppercase mb-4">Table of contents</p>
          <ul className="space-y-3">
            <li><a href="#" className="text-[15px] font-bold text-gray-900 hover:text-red-500 transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-black rounded-full"></span>Why we feel lonely in a relationship</a></li>
            <li><a href="#" className="text-[15px] font-bold text-gray-900 hover:text-red-500 transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-black rounded-full"></span>Signs of emotional loneliness</a></li>
            <li><a href="#" className="text-[15px] font-bold text-gray-900 hover:text-red-500 transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-black rounded-full"></span>Practical steps to overcome emotional loneliness</a></li>
            <li><a href="#" className="text-[15px] font-bold text-gray-900 hover:text-red-500 transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-black rounded-full"></span>When to seek professional help</a></li>
            <li><a href="#" className="text-[15px] font-bold text-gray-900 hover:text-red-500 transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-black rounded-full"></span>Conclusion</a></li>
            <li><a href="#" className="text-[15px] font-bold text-gray-900 hover:text-red-500 transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-black rounded-full"></span>References</a></li>
          </ul>
        </div>

        {/* Featured Image */}
        <div className="mb-12 aspect-[16/9] w-full overflow-hidden bg-gray-100">
          <img 
            src="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=1200" 
            alt="Featured" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Body */}
        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="flex justify-center mt-12 mb-8">
          <button className="px-8 py-3 bg-black text-white text-[15px] font-bold rounded-full hover:bg-gray-800 transition-colors">
            Share Article
          </button>
        </div>

      </article>

      {/* ── Related ── */}
      {relatedPosts.length > 0 && (
        <div className="bg-[#F8F9FA] py-20 border-t border-gray-200">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
            <h3 className="font-sans text-[24px] font-bold text-gray-900 mb-10">
              Related Articles
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
              {relatedPosts.map(p => (
                <RelatedCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer matching minimal black style */}
      <div className="bg-black text-white pt-20 pb-10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          
          {/* Logo Divider */}
          <div className="flex items-center justify-center gap-4 mb-16">
            <div className="h-px bg-gradient-to-r from-transparent to-[#FF69B4] w-full max-w-[200px]"></div>
            <div className="font-sans text-2xl font-bold tracking-tight">
              Brain<span className="font-normal text-gray-400">Heal</span>
            </div>
            <div className="h-px bg-gradient-to-l from-transparent to-[#FF69B4] w-full max-w-[200px]"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
            <div className="col-span-2">
              <h4 className="font-sans text-xl mb-4 font-bold">I'm excited. Tell me more.</h4>
              <div className="flex mb-8">
                <input type="email" placeholder="Enter your email" className="px-4 py-2.5 rounded-l-full bg-white text-black w-full outline-none text-sm font-bold" />
                <button className="px-6 py-2.5 bg-[#FF5722] text-white font-bold rounded-r-full text-sm hover:bg-[#e64a19] transition-colors">Submit</button>
              </div>
              <h4 className="font-sans text-xl mb-2 text-[#FF5722] font-bold">Have a question?</h4>
              <p className="text-sm text-gray-400 mb-6">Reach us at <a href="mailto:hello@brainheal.in" className="underline">hello@brainheal.in</a></p>
            </div>
            
            <div>
              <h5 className="font-bold mb-4">Popular</h5>
              <ul className="space-y-3 text-sm text-gray-400 font-medium">
                <li><a href="#" className="hover:text-white transition-colors">Mental Health</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Work Performance</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Women's Health</a></li>
                <li><a href="#" className="hover:text-white transition-colors">For Business</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Content Hub</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold mb-4">Learn</h5>
              <ul className="space-y-3 text-sm text-gray-400 font-medium">
                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Testimonials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cancel Stigma</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Our Medical Team</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold mb-4">Connect</h5>
              <ul className="space-y-3 text-sm text-gray-400 font-medium">
                <li><a href="#" className="hover:text-white transition-colors">WhatsApp</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center text-xs font-bold text-gray-500 pt-8 border-t border-gray-800">
            <p>© BrainHeal India</p>
            <div className="flex gap-4">
              <span>All rights reserved</span>
              <a href="#" className="text-[#FF5722] hover:underline">Terms and Conditions</a>
              <a href="#" className="text-[#FF5722] hover:underline">Privacy Policy</a>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Toolbar Dock */}
      <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <div className="pointer-events-auto shadow-2xl rounded-full">
          <ToolbarDock defaultCollapsed={true} />
        </div>
      </div>

      {/* ── Prose Styles ── */}
      <style>{`
        .article-body {
          font-family: 'Inter', -apple-system, sans-serif;
          font-size: 1.125rem;
          line-height: 1.8;
          color: #1a1a1a;
        }
        .article-body h2 {
          font-family: 'Inter', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #000;
          margin-top: 3rem;
          margin-bottom: 1rem;
          line-height: 1.3;
        }
        .article-body h3 {
          font-family: 'Inter', sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: #000;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }
        .article-body p {
          margin-bottom: 1.5rem;
        }
        .article-body ul, .article-body ol {
          margin-bottom: 1.5rem;
          padding-left: 1.25rem;
        }
        .article-body ul { list-style-type: disc; }
        .article-body li {
          margin-bottom: 0.5rem;
          padding-left: 0.5rem;
        }
        .article-body li::marker {
          color: #e5e7eb;
        }
        .article-body strong {
          color: #000;
          font-weight: 700;
        }
        .article-body a {
          color: #1a66ff;
          text-decoration: underline;
        }
        .article-body a:hover {
          color: #0044cc;
        }
        .article-body blockquote {
          font-style: italic;
          font-weight: 600;
          color: #000;
          font-size: 1.25rem;
          border-left: 4px solid #f87171;
          padding-left: 1.5rem;
          margin: 2rem 0;
        }
      `}</style>
    </div>
  );
}
