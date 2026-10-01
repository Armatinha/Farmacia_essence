import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Page-specific SEO metadata
const pageMeta: Record<string, { title: string; description: string; ogTitle?: string }> = {
  '/': {
    title: 'Essence Pharma | Science for a Better You',
    description:
      'Essence Pharma delivers premium pharmaceutical compounds with full batch traceability, HPLC-verified purity ≥99%, and a public anti-counterfeiting system.',
    ogTitle: 'Essence Pharma — Premium Research Compounds',
  },
  '/sobre': {
    title: 'About Us | Essence Pharma',
    description:
      "Learn about Essence Pharma's scientific philosophy, advanced synthesis methods, and commitment to transparency through our digital verification system.",
  },
  '/produtos': {
    title: 'Product Catalog | Essence Pharma',
    description:
      "Explore Essence Pharma's rigorously tested compound catalog. Every product is HPLC-certified, batch-tracked, and authenticity-verifiable via unique 6-character code.",
  },
  '/autenticacao': {
    title: 'Verify Your Product | Essence Pharma',
    description:
      'Instantly verify the authenticity of your Essence Pharma product. Enter the 6-character code from the scratch-off seal to confirm originality in our official registry.',
  },
  '/contato': {
    title: 'Contact Us | Essence Pharma',
    description:
      'Get in touch with the Essence Pharma technical and commercial team for product inquiries, authentication support, or partnership opportunities.',
  },
  '/admin': {
    title: 'Security Core & Telemetry | Essence Pharma',
    description:
      'Enterprise administration and batch verification telemetry console for Essence Pharma pharmaceutical registry.',
  },
};

const OG_IMAGE = 'https://essencepharmalab.com/og-image.webp';
const SITE_URL = 'https://essencepharmalab.com';

export function useSEO() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = pageMeta[pathname] ?? pageMeta['/'];

    // Title
    document.title = meta.title;

    // Helper to set or create a meta tag
    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement('meta');
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    // Standard meta description
    setMeta('meta[name="description"]', 'name', 'description');
    setMeta('meta[name="description"]', 'content', meta.description);

    // Open Graph
    setMeta('meta[property="og:title"]', 'property', 'og:title');
    setMeta('meta[property="og:title"]', 'content', meta.ogTitle ?? meta.title);

    setMeta('meta[property="og:description"]', 'property', 'og:description');
    setMeta('meta[property="og:description"]', 'content', meta.description);

    setMeta('meta[property="og:type"]', 'property', 'og:type');
    setMeta('meta[property="og:type"]', 'content', 'website');

    setMeta('meta[property="og:url"]', 'property', 'og:url');
    setMeta('meta[property="og:url"]', 'content', `${SITE_URL}${pathname}`);

    setMeta('meta[property="og:image"]', 'property', 'og:image');
    setMeta('meta[property="og:image"]', 'content', OG_IMAGE);

    setMeta('meta[property="og:site_name"]', 'property', 'og:site_name');
    setMeta('meta[property="og:site_name"]', 'content', 'Essence Pharma');

    // Twitter Card
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card');
    setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');

    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title');
    setMeta('meta[name="twitter:title"]', 'content', meta.ogTitle ?? meta.title);

    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description');
    setMeta('meta[name="twitter:description"]', 'content', meta.description);

    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image');
    setMeta('meta[name="twitter:image"]', 'content', OG_IMAGE);

    // Canonical
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `${SITE_URL}${pathname}`;
  }, [pathname]);
}
