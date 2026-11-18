import { site } from '@/data/site';

/**
 * schema.org Person markup: tells search engines who this site is about and
 * which profiles are the same person (sameAs). '<' is escaped so a stray
 * "</script>" in any value can't break out of the tag (the XSS note in Next's docs).
 */
export function JsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    url: site.url,
    email: `mailto:${site.email}`,
    jobTitle: 'Full-stack & AI/ML engineer',
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'Thapar Institute of Engineering and Technology' },
    sameAs: [site.socials.github, site.socials.linkedin],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
