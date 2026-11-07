// robots.txt: every page may be read (share-card images too: X and others fetch them under robots rules).
export const dynamic = 'force-static';

export default function robots() {
  return { rules: [{ userAgent: '*', allow: '/' }], sitemap: 'https://hanzo.ai/sitemap.xml', host: 'https://hanzo.ai' };
}
