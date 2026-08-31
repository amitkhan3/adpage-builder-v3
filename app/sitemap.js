export default function sitemap() {
  const base = 'https://adpage-builder-v3-pied.vercel.app';
  return [
    { url: base, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/subscription`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/sign-in`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/sign-up`, changeFrequency: 'monthly', priority: 0.3 },
  ];
}
