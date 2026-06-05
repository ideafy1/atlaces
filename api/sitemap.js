/**
 * Vercel Serverless Function — Dynamic XML Sitemap Generator
 *
 * Generates a complete sitemap by combining static page URLs with
 * dynamically fetched therapist profile URLs from Firebase Firestore.
 *
 * Route: /sitemap.xml  (via vercel.json rewrite)
 * Cache: 1 hour with stale-while-revalidate
 */

const FIREBASE_URL =
  'https://firestore.googleapis.com/v1/projects/brainheal-india/databases/(default)/documents/website/content?key=AIzaSyAD7XnA-ooSfl88zlfZKIUtu7IEK54QO1M';

const DOMAIN = 'https://brainheal.in';

/** Static pages with their respective priorities and change frequencies. */
const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/therapy', priority: '0.9', changefreq: 'daily' },
  { path: '/community', priority: '0.8', changefreq: 'hourly' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly' },
  { path: '/apply', priority: '0.6', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.3', changefreq: 'monthly' },
  { path: '/terms', priority: '0.3', changefreq: 'monthly' },
];

/**
 * Generates a URL-safe slug from a therapist name.
 * Strips special characters, collapses whitespace into hyphens,
 * and deduplicates consecutive hyphens.
 *
 * @param {string} name - The therapist's display name.
 * @returns {string} A lowercase, hyphen-separated slug.
 */
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Builds a single <url> XML element.
 *
 * @param {string} loc      - Full canonical URL.
 * @param {string} lastmod  - ISO date string (YYYY-MM-DD).
 * @param {string} changefreq - Sitemap change frequency hint.
 * @param {string} priority - Sitemap priority (0.0–1.0).
 * @returns {string} XML fragment.
 */
function buildUrlEntry(loc, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

/**
 * Fetches therapist data from Firebase Firestore and extracts unique slugs.
 *
 * For each therapist entry the function collects:
 *   1. The stored slug (if present).
 *   2. A slug generated from the therapist name (if present).
 * Both are included to maximise URL coverage.
 *
 * @returns {Promise<string[]>} Deduplicated array of therapist slugs.
 */
async function fetchTherapistSlugs() {
  const response = await fetch(FIREBASE_URL);

  if (!response.ok) {
    console.error(`Firebase fetch failed: ${response.status} ${response.statusText}`);
    return [];
  }

  const data = await response.json();

  // Safely traverse the nested Firestore document structure.
  const therapists =
    data?.fields?.therapyPage?.mapValue?.fields?.therapists?.arrayValue?.values;

  if (!Array.isArray(therapists)) {
    console.warn('No therapist array found in Firestore response.');
    return [];
  }

  const slugSet = new Set();

  for (const therapist of therapists) {
    const fields = therapist?.mapValue?.fields;
    if (!fields) continue;

    // 1. Stored slug
    const storedSlug = fields.slug?.stringValue;
    if (storedSlug) {
      slugSet.add(storedSlug.trim());
    }

    // 2. Generated slug from name
    const name = fields.name?.stringValue;
    if (name) {
      const generatedSlug = generateSlug(name);
      if (generatedSlug) {
        slugSet.add(generatedSlug);
      }
    }
  }

  return Array.from(slugSet);
}

/**
 * Vercel serverless handler.
 * Generates and returns a complete XML sitemap.
 */
export default async function handler(req, res) {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Fetch dynamic therapist slugs.
    const therapistSlugs = await fetchTherapistSlugs();

    // Build XML entries — static pages first, then therapist profiles.
    const urlEntries = [];

    for (const page of STATIC_PAGES) {
      urlEntries.push(
        buildUrlEntry(`${DOMAIN}${page.path}`, today, page.changefreq, page.priority)
      );
    }

    for (const slug of therapistSlugs) {
      urlEntries.push(
        buildUrlEntry(`${DOMAIN}/therapist/${slug}`, today, 'weekly', '0.9')
      );
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join('\n')}
</urlset>`;

    // Response headers — XML content type + aggressive edge caching.
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=1800'
    );

    return res.status(200).send(sitemap);
  } catch (error) {
    console.error('Sitemap generation failed:', error);

    // Return a minimal valid sitemap with static pages only so crawlers
    // always receive a parseable response.
    const today = new Date().toISOString().split('T')[0];
    const fallbackEntries = STATIC_PAGES.map((page) =>
      buildUrlEntry(`${DOMAIN}${page.path}`, today, page.changefreq, page.priority)
    );

    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${fallbackEntries.join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=60');
    return res.status(200).send(fallbackSitemap);
  }
}
