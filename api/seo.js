/**
 * Vercel Serverless Function — Universal Dynamic Renderer
 * 
 * This is the brain of BrainHeal's SEO architecture.
 * It intercepts ALL page requests and serves different content based on the requester:
 * 
 * 1. REAL BROWSERS (humans): Get the normal React SPA (index.html) — zero visual changes.
 * 2. AI BOTS & CRAWLERS (Google, ChatGPT, Claude, Gemini, etc.): Get a rich, 
 *    pre-rendered HTML page packed with actual content from Firebase.
 * 
 * This technique is called "Dynamic Rendering" and is officially recommended by Google:
 * https://developers.google.com/search/docs/crawling-indexing/javascript/dynamic-rendering
 * 
 * Routes handled: /, /therapy, /community, /therapist/:slug, /privacy, /terms, /apply, /contact
 */

const FIREBASE_URL =
  'https://firestore.googleapis.com/v1/projects/brainheal-india/databases/(default)/documents/website/content?key=AIzaSyAD7XnA-ooSfl88zlfZKIUtu7IEK54QO1M';

const DOMAIN = 'https://brainheal.in';
const SITE_NAME = 'Brain Heal India';
const OG_IMAGE = 'https://i.ibb.co/4G9pyV8/brainheal-og.avif';

// ─── BOT DETECTION ────────────────────────────────────────────────────────────

const BOT_USER_AGENTS = [
  // Search engines
  'googlebot', 'bingbot', 'yandexbot', 'baiduspider', 'duckduckbot',
  'slurp', 'sogou', 'exabot', 'facebot', 'ia_archiver',
  // AI assistants & their fetchers
  'chatgpt-user', 'oai-searchbot', 'gptbot',
  'claude-web', 'claudebot', 'anthropic-ai',
  'google-extended', 'gemini',
  'perplexitybot', 'cohere-ai',
  // Social media & preview bots
  'facebookexternalhit', 'twitterbot', 'linkedinbot',
  'whatsapp', 'telegrambot', 'slackbot', 'discordbot',
  'pinterestbot', 'redditbot',
  // SEO tools
  'semrushbot', 'ahrefsbot', 'mj12bot', 'dotbot',
  'rogerbot', 'screaming frog',
  // Generic bot indicators
  'bot', 'crawl', 'spider', 'scraper', 'fetch',
  'curl', 'wget', 'python-requests', 'node-fetch', 'axios'
];

function isBot(userAgent) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => ua.includes(bot));
}

// ─── ROUTE PARSING ────────────────────────────────────────────────────────────

function parseRoute(req) {
  // The original URL comes through x-matched-path or we parse from various sources
  const originalPath = req.headers?.['x-matched-path'] 
    || req.headers?.['x-invoke-path']
    || req.query?.path 
    || req.url?.split('?')[0] 
    || '/';
  
  // Extract slug for therapist pages
  const therapistMatch = originalPath.match(/^\/therapist\/([^\/\?]+)/);
  if (therapistMatch) {
    return { type: 'therapist', slug: therapistMatch[1] };
  }

  // Map known routes
  const routeMap = {
    '/': 'home',
    '/therapy': 'therapy',
    '/community': 'community',
    '/contact': 'contact',
    '/apply': 'apply',
    '/privacy': 'privacy',
    '/terms': 'terms'
  };

  return { type: routeMap[originalPath] || 'home', slug: null };
}

// ─── FIREBASE DATA FETCHER ───────────────────────────────────────────────────

let cachedData = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getFirebaseData() {
  const now = Date.now();
  if (cachedData && (now - cacheTime) < CACHE_TTL) {
    return cachedData;
  }

  try {
    const response = await fetch(FIREBASE_URL);
    if (!response.ok) throw new Error(`Firebase error: ${response.status}`);
    const data = await response.json();
    cachedData = data;
    cacheTime = now;
    return data;
  } catch (error) {
    console.error('Firebase fetch failed:', error);
    return null;
  }
}

// ─── DATA EXTRACTION HELPERS ─────────────────────────────────────────────────

function extractTherapists(data) {
  if (!data) return [];
  const therapists = [];

  const therapyPage = data.fields?.therapyPage?.mapValue?.fields;
  let rawTherapists = therapyPage?.therapists?.arrayValue?.values || [];

  // Fallback to providers.therapists
  if (rawTherapists.length === 0) {
    const providers = data.fields?.providers?.mapValue?.fields;
    rawTherapists = providers?.therapists?.arrayValue?.values || [];
  }

  for (const entry of rawTherapists) {
    const t = entry.mapValue?.fields;
    if (!t) continue;

    const name = t.name?.stringValue || '';
    const storedSlug = t.slug?.stringValue || '';
    const generatedSlug = name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

    let specialties = [];
    if (t.specialties?.arrayValue?.values) {
      specialties = t.specialties.arrayValue.values.map(v => v.stringValue).filter(Boolean);
    }

    let concerns = [];
    if (t.concerns?.arrayValue?.values) {
      concerns = t.concerns.arrayValue.values.map(v => v.stringValue).filter(Boolean);
    }

    therapists.push({
      name,
      slug: storedSlug || generatedSlug,
      generatedSlug,
      title: t.title?.stringValue || 'Therapist',
      credentials: t.credentials?.stringValue || '',
      experience: t.experience?.stringValue || '',
      rating: t.rating?.doubleValue || t.rating?.integerValue || '4.9',
      image: t.image?.stringValue || '',
      bio: t.bio?.stringValue || '',
      email: t.email?.stringValue || '',
      meetLink: t.meetLink?.stringValue || '',
      specialties,
      concerns,
      price: t.price?.integerValue || t.price?.stringValue || '',
      format: t.format?.stringValue || 'Video / Audio'
    });
  }

  return therapists;
}

function extractFAQs(data) {
  if (!data) return [];
  const faqFields = data.fields?.faq?.mapValue?.fields;
  const questions = faqFields?.questions?.arrayValue?.values || faqFields?.items?.arrayValue?.values || [];
  return questions.map(q => {
    const f = q.mapValue?.fields;
    return {
      q: f?.q?.stringValue || '',
      a: f?.a?.stringValue || ''
    };
  }).filter(item => item.q && item.a);
}

function extractReviews(data) {
  if (!data) return [];
  const reviewFields = data.fields?.reviews?.mapValue?.fields;
  const items = reviewFields?.items?.arrayValue?.values || [];
  return items.map(r => {
    const f = r.mapValue?.fields;
    return {
      name: f?.name?.stringValue || '',
      review: f?.review?.stringValue || ''
    };
  }).filter(r => r.name && r.review);
}

function extractHero(data) {
  if (!data) return { title: 'Awaken', subtitle: 'the best version of', highlight: 'you.', text: '' };
  const hero = data.fields?.hero?.mapValue?.fields;
  return {
    title: hero?.title?.stringValue || 'Awaken',
    subtitle: hero?.subtitle?.stringValue || 'the best version of',
    highlight: hero?.highlight?.stringValue || 'you.',
    text: hero?.text?.stringValue || 'Step into clarity. We connect you with a new generation of therapists to help you thrive, not just survive.'
  };
}

// ─── SEO CONTENT GENERATORS PER ROUTE ────────────────────────────────────────

function generateHomeSEO(data, therapists, faqs, reviews, hero) {
  const title = 'Brain Heal India — Best Online Therapy Platform | Affordable & Verified Therapists';
  const description = 'Brain Heal India (BrainHeal) is the most trusted online therapy platform. Find verified, affordable therapists for anxiety, depression, stress, relationships & more. Best cheap therapy with ₹0 switching fees. Book your first session today.';
  const url = DOMAIN + '/';

  // Build rich body content for bots
  const therapistListHTML = therapists.slice(0, 20).map(t => `
    <li>
      <a href="${DOMAIN}/therapist/${t.slug}">
        <strong>${esc(t.name)}</strong> — ${esc(t.title)}${t.credentials ? ` (${esc(t.credentials)})` : ''}
      </a>
      ${t.experience ? `<br>Experience: ${esc(t.experience)}` : ''}
      ${t.specialties.length > 0 ? `<br>Specializes in: ${t.specialties.map(esc).join(', ')}` : ''}
      ${t.rating ? `<br>Rating: ⭐ ${t.rating}` : ''}
    </li>`).join('\n');

  const faqHTML = faqs.map(f => `
    <details>
      <summary>${esc(f.q)}</summary>
      <p>${esc(f.a)}</p>
    </details>`).join('\n');

  const reviewHTML = reviews.slice(0, 10).map(r => `
    <blockquote>
      <p>"${esc(r.review)}"</p>
      <cite>— ${esc(r.name)}</cite>
    </blockquote>`).join('\n');

  const bodyContent = `
    <header>
      <h1>Brain Heal India — Best Online Therapy Platform</h1>
      <p>${esc(hero.title)} ${esc(hero.subtitle)} ${esc(hero.highlight)}</p>
      <p>${esc(hero.text)}</p>
    </header>

    <nav aria-label="Main Navigation">
      <ul>
        <li><a href="${DOMAIN}/">Home</a></li>
        <li><a href="${DOMAIN}/therapy">Find a Therapist</a></li>
        <li><a href="${DOMAIN}/community">Anonymous Community</a></li>
        <li><a href="${DOMAIN}/contact">Contact</a></li>
        <li><a href="${DOMAIN}/apply">Apply as Therapist</a></li>
        <li><a href="${DOMAIN}/privacy">Privacy Policy</a></li>
        <li><a href="${DOMAIN}/terms">Terms & Conditions</a></li>
      </ul>
    </nav>

    <main>
      <section>
        <h2>About Brain Heal India — Best Cheap Therapy</h2>
        <p>Brain Heal (also known as BrainHeal) is the world's first online therapist community and India's most trusted therapy platform. We provide affordable, accessible, and high-quality mental health care through our curated collective of verified therapists.</p>
        <p>Whether you're searching for "brain heal therapy", "brain heal india", "best cheap therapy", or "affordable online counseling in India", Brain Heal connects you with clinically vetted professionals who specialize in anxiety, depression, stress, relationships, trauma, ADHD, grief, and more.</p>
        <p>Brain Heal therapy sessions start at affordable rates with ₹0 switching fees — making us the best cheap therapy option in India without compromising on quality.</p>
      </section>

      <section>
        <h2>Why Choose Brain Heal Therapy?</h2>
        <ul>
          <li><strong>100% Verified Therapists</strong> — Every therapist undergoes a rigorous 4-step clinical review including license verification, case study reviews, and empathy assessments.</li>
          <li><strong>₹0 Switching Fees</strong> — Don't feel a connection? Switch your therapist anytime, no questions asked.</li>
          <li><strong>2-Hour Matching</strong> — Get matched with your ideal therapist within 2 hours of completing your intake.</li>
          <li><strong>Affordable Rates</strong> — BrainHeal offers the best cheap therapy sessions in India, starting from just ₹111 for your first session.</li>
          <li><strong>10,000+ Sessions Completed</strong> — Trusted by people across India.</li>
          <li><strong>4.9/5 Average Rating</strong> — Our therapists are highly rated by real clients.</li>
        </ul>
      </section>

      <section>
        <h2>What Can Brain Heal Therapy Help With?</h2>
        <ul>
          <li>Anxiety & Stress — Constant worry, racing thoughts, panic attacks</li>
          <li>Depression — Persistent sadness, loss of interest, fatigue</li>
          <li>Relationships — Couples counseling, family conflicts, dating struggles</li>
          <li>Trauma & PTSD — Past abuse, grief, accidents, deeply distressing events</li>
          <li>ADHD — Assessment, coping strategies, and ongoing support</li>
          <li>Career & Burnout — Work stress, career confusion, professional burnout</li>
          <li>Grief & Loss — Processing loss and finding a path forward</li>
          <li>LGBTQ+ Support — Affirming therapy for identity and relationship concerns</li>
        </ul>
      </section>

      <section>
        <h2>Our Verified Therapists at Brain Heal India</h2>
        <p>Browse our growing collective of verified therapists across India:</p>
        <ul>${therapistListHTML}</ul>
        <p><a href="${DOMAIN}/therapy">View all therapists and book a session →</a></p>
      </section>

      <section>
        <h2>How Brain Heal Therapy Works</h2>
        <ol>
          <li><strong>Tell us what you're going through</strong> — Answer a few simple, private questions about anxiety, stress, relationships, burnout, or anything on your mind.</li>
          <li><strong>Get matched with your therapist</strong> — Our team personally reviews your needs and matches you with a verified BrainHeal therapist.</li>
          <li><strong>Start your first session</strong> — Connect over video, voice, or chat. Your therapist is there for you, from anywhere in India.</li>
          <li><strong>Heal at your own pace</strong> — Message your therapist between sessions, reschedule anytime, or switch at zero cost.</li>
        </ol>
      </section>

      <section>
        <h2>Real Reviews from Brain Heal Users</h2>
        ${reviewHTML}
      </section>

      <section>
        <h2>Frequently Asked Questions about Brain Heal India</h2>
        ${faqHTML}
      </section>

      <section>
        <h2>Brain Heal vs. Finding a Therapist on Your Own</h2>
        <table>
          <thead><tr><th>Feature</th><th>BrainHeal</th><th>Searching Alone</th></tr></thead>
          <tbody>
            <tr><td>Vetted professionals only</td><td>✅ Yes</td><td>❌ No</td></tr>
            <tr><td>Zero switching fees</td><td>✅ Yes</td><td>❌ No</td></tr>
            <tr><td>Matched within 2 hours</td><td>✅ Yes</td><td>❌ No</td></tr>
            <tr><td>Verified credentials & portfolio</td><td>✅ Yes</td><td>❌ No</td></tr>
            <tr><td>Affordable therapy rates</td><td>✅ Yes</td><td>❌ Varies</td></tr>
          </tbody>
        </table>
      </section>
    </main>

    <footer>
      <p>© 2026 Brain Heal India. All rights reserved. Built for Peace.</p>
      <p>Brain Heal India — India's first premium therapist collective. Best online therapy, cheap therapy sessions, verified therapists. Mental health counseling, online counseling India.</p>
      <nav>
        <a href="${DOMAIN}/therapy">Find a Therapist</a> |
        <a href="${DOMAIN}/community">Community</a> |
        <a href="${DOMAIN}/privacy">Privacy</a> |
        <a href="${DOMAIN}/terms">Terms</a> |
        <a href="${DOMAIN}/apply">Apply as Therapist</a>
      </nav>
    </footer>`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalBusiness",
        "@id": `${DOMAIN}/#organization`,
        "name": "BrainHeal",
        "alternateName": ["Brain Heal", "BrainHeal India", "BrainHeal Therapy"],
        "url": DOMAIN,
        "logo": `${DOMAIN}/logo.png`,
        "image": OG_IMAGE,
        "description": "BrainHeal is India's best and most affordable online therapy platform. Find verified therapists for anxiety, depression, stress, relationships, trauma and more. Best cheap therapy with ₹0 switching fees.",
        "slogan": "All the bright places",
        "foundingDate": "2026",
        "areaServed": { "@type": "Country", "name": "India" },
        "serviceType": ["Online Therapy", "Mental Health Counseling", "Psychiatry", "Couples Therapy", "Anonymous Community Support", "Cheap Therapy", "Affordable Counseling"],
        "medicalSpecialty": ["Psychiatry", "Psychology"],
        "priceRange": "₹111 - ₹3500",
        "paymentAccepted": "UPI, Credit Card, Debit Card",
        "currenciesAccepted": "INR",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "500",
          "bestRating": "5",
          "worstRating": "1"
        },
        "sameAs": [
          "https://www.linkedin.com/in/brainheal/",
          "https://www.instagram.com/brainheal.in",
          "https://www.facebook.com/brainheal.in",
          "https://www.youtube.com/@BrainHeal-india",
          "https://www.reddit.com/user/brainheal-india/",
          "https://www.pinterest.com/brainheal_india",
          "https://www.quora.com/profile/Brain-Heal",
          "https://x.com/brainheal_india",
          "https://www.crunchbase.com/organization/brain-heal-india",
          "https://www.trustpilot.com/review/brainheal.in",
          "https://www.producthunt.com/@brainheal",
          "https://brainheal.sulekha.com"
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${DOMAIN}/#website`,
        "url": DOMAIN,
        "name": "Brain Heal India",
        "alternateName": ["Brain Heal", "BrainHeal", "BrainHeal India", "BrainHeal Therapy", "brainheal.in"],
        "description": "India's best online therapy platform. Brain Heal connects you with verified, affordable therapists.",
        "publisher": { "@id": `${DOMAIN}/#organization` },
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${DOMAIN}/therapy?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "WebPage",
        "@id": `${DOMAIN}/#webpage`,
        "url": DOMAIN,
        "name": "Brain Heal India — Best Online Therapy Platform",
        "description": description,
        "isPartOf": { "@id": `${DOMAIN}/#website` },
        "about": { "@id": `${DOMAIN}/#organization` }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": `${DOMAIN}/`
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Online Therapy",
            "item": `${DOMAIN}/therapy`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Anonymous Community",
            "item": `${DOMAIN}/community`
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqs.map(f => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.a
          }
        }))
      }
    ]
  };

  return { title, description, url, bodyContent, jsonLd, image: OG_IMAGE };
}

function generateTherapySEO(data, therapists) {
  const title = 'Find a Therapist | Brain Heal India — Best Affordable Online Therapy';
  const description = `Browse ${therapists.length || '50+'}  verified therapists at Brain Heal India. Online therapy for anxiety, depression, relationships, trauma, ADHD & more. ₹0 switching fees. Best cheap therapy sessions starting from ₹111. Book now.`;
  const url = DOMAIN + '/therapy';

  const therapistListHTML = therapists.map(t => `
    <article>
      <h3><a href="${DOMAIN}/therapist/${t.slug}">${esc(t.name)} — ${esc(t.title)}</a></h3>
      ${t.credentials ? `<p>Credentials: ${esc(t.credentials)}</p>` : ''}
      ${t.experience ? `<p>Experience: ${esc(t.experience)}</p>` : ''}
      ${t.specialties.length > 0 ? `<p>Specialties: ${t.specialties.map(esc).join(', ')}</p>` : ''}
      ${t.bio ? `<p>${esc(t.bio)}</p>` : ''}
      <p>Rating: ⭐ ${t.rating} | Format: ${esc(t.format)}</p>
      <p><a href="${DOMAIN}/therapist/${t.slug}">View Profile & Book Session →</a></p>
    </article>`).join('\n<hr>\n');

  const bodyContent = `
    <header>
      <h1>Find a Therapist — Brain Heal India's Best Affordable Therapy</h1>
      <p>Browse our collective of verified therapists. Best cheap therapy in India with ₹0 switching fees.</p>
    </header>

    <nav aria-label="Main Navigation">
      <ul>
        <li><a href="${DOMAIN}/">Home</a></li>
        <li><a href="${DOMAIN}/therapy">Find a Therapist</a></li>
        <li><a href="${DOMAIN}/community">Anonymous Community</a></li>
        <li><a href="${DOMAIN}/privacy">Privacy Policy</a></li>
        <li><a href="${DOMAIN}/terms">Terms</a></li>
      </ul>
    </nav>

    <main>
      <section>
        <h2>All Verified Therapists at BrainHeal</h2>
        <p>Every therapist listed below is personally vetted through our 4-step clinical review. BrainHeal therapy is the best affordable option for quality mental health care in India.</p>
        ${therapistListHTML}
      </section>

      <section>
        <h2>Therapy Categories Available at BrainHeal</h2>
        <ul>
          <li><strong>Therapist</strong> — Individual therapy for anxiety, depression, stress, self-growth</li>
          <li><strong>Couples Therapist</strong> — Relationship counseling and couples therapy</li>
          <li><strong>Counsellor</strong> — General counseling and emotional support</li>
          <li><strong>Psychiatrist</strong> — Clinical psychiatry with medication management</li>
        </ul>
      </section>

      <section>
        <h2>Common Concerns Treated</h2>
        <p>Anxiety, Low Mood, Overthinking, Stress, Relationships, Self Growth, Trauma, ADHD, Depression, Grief</p>
      </section>
    </main>

    <footer>
      <p>© 2026 BrainHeal India. Best cheap therapy, affordable online counseling, verified therapists India.</p>
    </footer>`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Verified Therapists at BrainHeal",
    "description": "Browse all verified therapists available on BrainHeal — India's best affordable online therapy platform.",
    "numberOfItems": therapists.length,
    "itemListElement": therapists.map((t, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "Person",
        "name": t.name,
        "jobTitle": t.title,
        "url": `${DOMAIN}/therapist/${t.slug}`,
        "image": t.image || OG_IMAGE,
        "description": `${t.name} is a verified ${t.title} at BrainHeal${t.specialties.length > 0 ? ` specializing in ${t.specialties.join(', ')}` : ''}`
      }
    }))
  };

  return { title, description, url, bodyContent, jsonLd, image: OG_IMAGE };
}

function generateCommunitySEO() {
  const title = 'Anonymous Mental Health Community | BrainHeal — Free Peer Support';
  const description = 'Join BrainHeal\'s free anonymous mental health community. Share your story, find peer support, and realize you are not alone. 24-hour posts, zero judgment. Brain Heal community support for everyone in India.';
  const url = DOMAIN + '/community';

  const bodyContent = `
    <header>
      <h1>Anonymous Mental Health Community — BrainHeal Free Peer Support</h1>
      <p>A safe, anonymous space to share what you're going through. No accounts needed.</p>
    </header>

    <nav aria-label="Main Navigation">
      <ul>
        <li><a href="${DOMAIN}/">Home</a></li>
        <li><a href="${DOMAIN}/therapy">Find a Therapist</a></li>
        <li><a href="${DOMAIN}/community">Anonymous Community</a></li>
      </ul>
    </nav>

    <main>
      <section>
        <h2>About BrainHeal Community</h2>
        <p>BrainHeal's anonymous community is a free, safe space where you can share your thoughts, feelings, and experiences without judgment. All posts disappear after 24 hours, ensuring complete privacy.</p>
        <p>Whether you're dealing with anxiety, depression, loneliness, stress, or any mental health challenge, our community is here for you. Brain Heal believes that peer support is a powerful complement to professional therapy.</p>
      </section>

      <section>
        <h2>Community Features</h2>
        <ul>
          <li>100% Anonymous — No login, no tracking, no judgment</li>
          <li>24-Hour Posts — All posts automatically expire for privacy</li>
          <li>Mood Tags — Express yourself with emojis and mood indicators</li>
          <li>Reactions & Support — Show solidarity with fellow community members</li>
          <li>Free Forever — BrainHeal community is completely free to use</li>
        </ul>
      </section>

      <section>
        <h2>Need More Than Peer Support?</h2>
        <p>If you feel you need professional help, <a href="${DOMAIN}/therapy">browse our verified therapists</a> and book an affordable session. BrainHeal therapy starts at just ₹111 for your first session.</p>
      </section>
    </main>

    <footer>
      <p>© 2026 BrainHeal India. Free mental health community, anonymous peer support, BrainHeal community.</p>
    </footer>`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "BrainHeal Anonymous Mental Health Community",
    "description": description,
    "url": url,
    "isPartOf": { "@id": `${DOMAIN}/#website` }
  };

  return { title, description, url, bodyContent, jsonLd, image: OG_IMAGE };
}

function generateTherapistSEO(therapist) {
  if (!therapist) {
    return {
      title: 'Therapist Profile | BrainHeal',
      description: 'View therapist profile on BrainHeal — India\'s best online therapy platform.',
      url: DOMAIN + '/therapy',
      bodyContent: '<h1>Therapist Profile</h1><p><a href="' + DOMAIN + '/therapy">Browse all therapists →</a></p>',
      jsonLd: {},
      image: OG_IMAGE
    };
  }

  const t = therapist;
  const specsList = t.specialties.length > 0 ? t.specialties.join(', ') : 'mental health';
  const title = `${t.name} — ${t.title} | BrainHeal Therapy`;
  const description = `${t.name} is a verified ${t.title}${t.credentials ? ` (${t.credentials})` : ''} at BrainHeal with ${t.experience || 'years'} of experience. ⭐ ${t.rating} rated. Specializes in ${specsList}. Book an affordable online therapy session now.`;
  const url = `${DOMAIN}/therapist/${t.slug}`;

  const bodyContent = `
    <header>
      <h1>${esc(t.name)} — ${esc(t.title)} at BrainHeal</h1>
      ${t.credentials ? `<p>Credentials: ${esc(t.credentials)}</p>` : ''}
    </header>

    <nav aria-label="Main Navigation">
      <ul>
        <li><a href="${DOMAIN}/">Home</a></li>
        <li><a href="${DOMAIN}/therapy">All Therapists</a></li>
        <li><a href="${DOMAIN}/community">Community</a></li>
      </ul>
    </nav>

    <main>
      <article>
        <h2>About ${esc(t.name)}</h2>
        ${t.bio ? `<p>${esc(t.bio)}</p>` : ''}
        ${t.experience ? `<p><strong>Experience:</strong> ${esc(t.experience)}</p>` : ''}
        <p><strong>Rating:</strong> ⭐ ${t.rating}</p>
        <p><strong>Format:</strong> ${esc(t.format)}</p>
        ${t.specialties.length > 0 ? `<p><strong>Specialties:</strong> ${t.specialties.map(esc).join(', ')}</p>` : ''}
        ${t.concerns.length > 0 ? `<p><strong>Concerns treated:</strong> ${t.concerns.map(esc).join(', ')}</p>` : ''}
      </article>

      <section>
        <h2>Book a Session with ${esc(t.name)}</h2>
        <p>${esc(t.name)} is available for online therapy sessions through BrainHeal. Book your first session at an affordable introductory rate.</p>
        <p><a href="${url}">Book Now →</a></p>
      </section>

      <section>
        <h2>Other Therapists at BrainHeal</h2>
        <p><a href="${DOMAIN}/therapy">Browse all verified therapists →</a></p>
      </section>
    </main>

    <footer>
      <p>© 2026 BrainHeal India. ${esc(t.name)} verified therapist profile. Best affordable therapy India.</p>
    </footer>`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Person", "Physician"],
    "name": t.name,
    "jobTitle": t.title,
    "description": description,
    "image": t.image || OG_IMAGE,
    "url": url,
    "memberOf": {
      "@type": "MedicalOrganization",
      "name": "BrainHeal",
      "url": DOMAIN
    }
  };

  return { title, description, url, bodyContent, jsonLd, image: t.image || OG_IMAGE };
}

function generateStaticPageSEO(type) {
  const pages = {
    privacy: {
      title: 'Privacy Policy | BrainHeal — Your Data is Safe',
      description: 'Read BrainHeal\'s privacy policy. We protect your therapy data and personal information with enterprise-grade security. Brain Heal takes your privacy seriously.',
      url: DOMAIN + '/privacy'
    },
    terms: {
      title: 'Terms & Conditions | BrainHeal',
      description: 'Read BrainHeal\'s terms of service, including our therapy session policies, refund policy, and user guidelines.',
      url: DOMAIN + '/terms'
    },
    apply: {
      title: 'Apply as a Therapist | Join BrainHeal Collective',
      description: 'Join BrainHeal\'s verified therapist collective. Apply to become a BrainHeal therapist and help people across India with affordable online therapy.',
      url: DOMAIN + '/apply'
    },
    contact: {
      title: 'Contact Us | BrainHeal — Get in Touch',
      description: 'Contact BrainHeal for questions about therapy sessions, therapist applications, or general inquiries. Brain Heal support team is here to help.',
      url: DOMAIN + '/contact'
    }
  };

  const page = pages[type] || pages.contact;

  const bodyContent = `
    <header>
      <h1>${esc(page.title.split(' | ')[0])}</h1>
    </header>
    <nav aria-label="Main Navigation">
      <ul>
        <li><a href="${DOMAIN}/">Home</a></li>
        <li><a href="${DOMAIN}/therapy">Find a Therapist</a></li>
        <li><a href="${DOMAIN}/community">Community</a></li>
      </ul>
    </nav>
    <main>
      <p>${esc(page.description)}</p>
      <p><a href="${DOMAIN}/">Return to BrainHeal Home →</a></p>
    </main>
    <footer><p>© 2026 BrainHeal India. All rights reserved.</p></footer>`;

  return {
    title: page.title,
    description: page.description,
    url: page.url,
    bodyContent,
    jsonLd: { "@context": "https://schema.org", "@type": "WebPage", "name": page.title, "url": page.url },
    image: OG_IMAGE
  };
}

// ─── HTML BUILDER ────────────────────────────────────────────────────────────

function buildBotHTML(seo) {
  return `<!DOCTYPE html>
<html lang="en" prefix="og: https://ogp.me/ns#">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>${esc(seo.title)}</title>
  <meta name="description" content="${esc(seo.description)}">
  <meta name="keywords" content="BrainHeal, Brain Heal, brainheal therapy, best cheap therapy, affordable therapy India, online therapy India, online counseling, mental health India, verified therapists, anxiety therapy, depression help, BrainHeal.in, brainheal">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(seo.title)}">
  <meta property="og:description" content="${esc(seo.description)}">
  <meta property="og:image" content="${esc(seo.image)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:url" content="${esc(seo.url)}">
  <meta property="og:site_name" content="${SITE_NAME}">
  <meta property="og:locale" content="en_IN">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(seo.title)}">
  <meta name="twitter:description" content="${esc(seo.description)}">
  <meta name="twitter:image" content="${esc(seo.image)}">

  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="${esc(seo.url)}">
  <link rel="icon" type="image/png" href="/favicon.png">

  <!-- Geo targeting -->
  <meta name="geo.region" content="IN">
  <meta name="geo.placename" content="India">
  <meta name="ICBM" content="20.5937, 78.9629">

  <!-- JSON-LD Structured Data -->
  <script type="application/ld+json">
  ${JSON.stringify(seo.jsonLd, null, 2)}
  </script>
</head>
<body>
  ${seo.bodyContent}
</body>
</html>`;
}

function buildHumanHTML(seo) {
  // For real browsers, serve the React SPA with proper meta tags
  try {
    const fs = require('fs');
    const path = require('path');
    let html;
    try {
      html = fs.readFileSync(path.join(process.cwd(), 'dist', 'index.html'), 'utf8');
    } catch(err1) {
      try {
        html = fs.readFileSync(path.join(__dirname, '..', 'dist', 'index.html'), 'utf8');
      } catch(err2) {
        html = fs.readFileSync(path.join(__dirname, 'dist', 'index.html'), 'utf8');
      }
    }

    // Replace the default <title> and meta tags with route-specific ones
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(seo.title)}</title>`);
    
    // Inject/replace meta description
    if (html.includes('name="description"')) {
      html = html.replace(/(<meta\s+name="description"\s+content=")[^"]*(")/i, `$1${esc(seo.description)}$2`);
    } else {
      html = html.replace('</head>', `  <meta name="description" content="${esc(seo.description)}">\n</head>`);
    }

    // Inject/replace OG tags
    if (html.includes('property="og:title"')) {
      html = html.replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/i, `$1${esc(seo.title)}$2`);
      html = html.replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/i, `$1${esc(seo.description)}$2`);
      html = html.replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/i, `$1${esc(seo.url)}$2`);
    }

    // Inject/replace canonical
    if (html.includes('rel="canonical"')) {
      html = html.replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/i, `$1${esc(seo.url)}$2`);
    } else {
      html = html.replace('</head>', `  <link rel="canonical" href="${esc(seo.url)}">\n</head>`);
    }

    return html;
  } catch (e) {
    // Fallback: serve bot HTML with SPA loader (works for bots and humans)
    const loaderScript = `<style>body { opacity: 0; transition: opacity 0.5s; }</style>
    <script>
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
        setTimeout(() => { document.body.style.opacity = '1'; }, 100);
      });
    </script>`;
    
    return buildBotHTML(seo)
      .replace('</head>', `${loaderScript}\n</head>`)
      .replace('<body>', '<body>\n<div id="seo-bot-content" style="display:none;">')
      .replace('</body>', '</div>\n<div id="root"></div>\n</body>');
  }
}

// ─── UTILITY ─────────────────────────────────────────────────────────────────

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ─── MAIN HANDLER ────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  const userAgent = req.headers?.['user-agent'] || '';
  const route = parseRoute(req);
  const botDetected = isBot(userAgent);

  // Fetch Firebase data (cached)
  const data = await getFirebaseData();
  const therapists = extractTherapists(data);

  // Generate route-specific SEO content
  let seo;
  switch (route.type) {
    case 'home':
      seo = generateHomeSEO(data, therapists, extractFAQs(data), extractReviews(data), extractHero(data));
      break;
    case 'therapy':
      seo = generateTherapySEO(data, therapists);
      break;
    case 'community':
      seo = generateCommunitySEO();
      break;
    case 'therapist': {
      const therapist = therapists.find(t => t.slug === route.slug || t.generatedSlug === route.slug);
      seo = generateTherapistSEO(therapist);
      break;
    }
    default:
      seo = generateStaticPageSEO(route.type);
  }

  // Generate the appropriate HTML
  const html = botDetected ? buildBotHTML(seo) : buildHumanHTML(seo);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=1800');
  
  // Vary on User-Agent so CDN caches bot vs human responses separately
  res.setHeader('Vary', 'User-Agent');

  return res.status(200).send(html);
}
