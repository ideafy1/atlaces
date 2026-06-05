export default async function handler(req, res) {
  // Extract slug from the URL path
  // Vercel rewrites /therapist/kiara-shah -> /api/seo, but req.url becomes /api/seo
  // The original path is in headers or we parse from query
  const slug = req.query?.slug || req.url.replace('/api/seo', '').replace(/^\//, '').split('?')[0];
  
  // Determine the real site domain
  const host = req.headers?.host || 'brainheal.in';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const siteUrl = `${protocol}://${host}`;
  const profileUrl = `${siteUrl}/therapist/${slug}`;

  // Default fallback SEO values (used if Firebase fetch fails)
  let seoTitle = 'BrainHeal - Online Therapy Platform';
  let seoDesc = 'Book a session with verified therapists for anxiety, depression, stress, relationships, trauma and more.';
  let seoImage = 'https://i.ibb.co/4G9pyV8/brainheal-og.avif';
  let siteName = 'BrainHeal';

  try {
    // Fetch website content from Firestore REST API (same source as the frontend DataContext)
    const apiKey = 'AIzaSyAD7XnA-ooSfl88zlfZKIUtu7IEK54QO1M';
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/brainheal-india/databases/(default)/documents/website/content?key=${apiKey}`;
    const response = await fetch(firestoreUrl);

    if (response.ok) {
      const data = await response.json();
      const fields = data.fields || {};

      // Extract the therapists array from the therapyPage map
      let therapists = [];
      const therapyPage = fields.therapyPage?.mapValue?.fields;
      if (therapyPage?.therapists?.arrayValue?.values) {
        therapists = therapyPage.therapists.arrayValue.values;
      }

      // Also check providers.therapists as a fallback
      if (therapists.length === 0) {
        const providers = fields.providers?.mapValue?.fields;
        if (providers?.therapists?.arrayValue?.values) {
          therapists = providers.therapists.arrayValue.values;
        }
      }

      // Find the therapist matching this slug
      for (const entry of therapists) {
        const t = entry.mapValue?.fields;
        if (!t) continue;

        const name = t.name?.stringValue || '';
        const storedSlug = t.slug?.stringValue || '';
        
        // Generate slug from name exactly like the frontend does
        const generatedSlug = name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

        // Match EITHER stored slug OR generated slug (same logic as frontend TherapistProfile.tsx)
        if (storedSlug === slug || generatedSlug === slug) {
          const title = t.title?.stringValue || 'Therapist';
          const image = t.image?.stringValue || seoImage;
          const credentials = t.credentials?.stringValue || '';
          const experience = t.experience?.stringValue || '';
          const rating = t.rating?.doubleValue || t.rating?.integerValue || '4.9';

          let specialtiesArray = [];
          if (t.specialties?.arrayValue?.values) {
            specialtiesArray = t.specialties.arrayValue.values.map(v => v.stringValue).filter(Boolean);
          }
          const specsList = specialtiesArray.length > 0 ? specialtiesArray.join(', ') : 'mental health';

          seoTitle = `${name} - ${title} | BrainHeal`;
          seoDesc = `${name} is a verified ${title}${credentials ? ` (${credentials})` : ''} at BrainHeal with ${experience || 'years'} of experience. ⭐ ${rating} rated. Specializes in ${specsList}. Book an online therapy session now.`;
          seoImage = image;
          break;
        }
      }
    }
  } catch (error) {
    console.error('SEO Firestore fetch error:', error);
    // Silently fallback to defaults — page still works
  }

  // Build a self-contained HTML page with perfect OG meta tags.
  // WhatsApp/Facebook/Twitter/LinkedIn bots ONLY read meta tags from <head>.
  // Real browsers will see the React app load normally via the <script> tag.
  const html = `<!DOCTYPE html>
<html lang="en" prefix="og: https://ogp.me/ns#">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <title>${escapeHtml(seoTitle)}</title>
  <meta name="description" content="${escapeHtml(seoDesc)}" />

  <!-- Open Graph (WhatsApp, Facebook, LinkedIn, iMessage) -->
  <meta property="og:type" content="profile" />
  <meta property="og:title" content="${escapeHtml(seoTitle)}" />
  <meta property="og:description" content="${escapeHtml(seoDesc)}" />
  <meta property="og:image" content="${escapeHtml(seoImage)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${escapeHtml(seoTitle)}" />
  <meta property="og:url" content="${escapeHtml(profileUrl)}" />
  <meta property="og:site_name" content="${escapeHtml(siteName)}" />
  <meta property="og:locale" content="en_IN" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(seoTitle)}" />
  <meta name="twitter:description" content="${escapeHtml(seoDesc)}" />
  <meta name="twitter:image" content="${escapeHtml(seoImage)}" />

  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${escapeHtml(profileUrl)}" />
  <link rel="icon" type="image/png" href="/favicon.png" />

  <!-- Structured Data (JSON-LD) injected at Edge -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": ["Person", "Physician"],
    "name": "${escapeHtml(seoTitle.split(' - ')[0])}",
    "description": "${escapeHtml(seoDesc)}",
    "image": "${escapeHtml(seoImage)}",
    "url": "${escapeHtml(profileUrl)}",
    "memberOf": {
      "@type": "MedicalOrganization",
      "name": "BrainHeal",
      "url": "https://brainheal.in"
    }
  }
  </script>

  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-2YVY612H6E"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-2YVY612H6E');</script>

  <!-- Razorpay -->
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>

  <!-- Preconnect -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preconnect" href="https://firestore.googleapis.com" />

  <!-- Load the actual React SPA assets -->
  ${getAssetTags()}
</head>
<body>
  <div id="root"></div>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=1800');
  return res.status(200).send(html);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function getAssetTags() {
  // Try to read the dist/index.html to extract the real hashed asset filenames
  // If that fails, use a JS-based fallback that fetches and loads them at runtime
  try {
    const fs = require('fs');
    const path = require('path');
    const distHtml = fs.readFileSync(path.join(process.cwd(), 'dist', 'index.html'), 'utf8');
    
    // Extract <link> and <script> tags from the built HTML
    const linkTags = distHtml.match(/<link[^>]+rel="stylesheet"[^>]*>/gi) || [];
    const scriptTags = distHtml.match(/<script[^>]+type="module"[^>]*>[\s\S]*?<\/script>/gi) || [];
    
    return [...linkTags, ...scriptTags].join('\n  ');
  } catch (e) {
    // Fallback: dynamically discover and load assets from the root page
    return `<script>
      fetch('/').then(r=>r.text()).then(html=>{
        const parser=new DOMParser();
        const doc=parser.parseFromString(html,'text/html');
        doc.querySelectorAll('link[rel="stylesheet"]').forEach(l=>{
          const link=document.createElement('link');
          link.rel='stylesheet';link.href=l.getAttribute('href');
          document.head.appendChild(link);
        });
        doc.querySelectorAll('script[type="module"]').forEach(s=>{
          const sc=document.createElement('script');
          sc.type='module';sc.src=s.getAttribute('src');
          document.head.appendChild(sc);
        });
      });
    </script>`;
  }
}
