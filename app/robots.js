export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/admin/'] }],
    sitemap: 'https://adpage-builder-v3-pied.vercel.app/sitemap.xml',
    host: 'https://adpage-builder-v3-pied.vercel.app',
  };
}
