import { notFound } from 'next/navigation';
import { getPage } from '@/lib/store';

export const dynamic = 'force-dynamic';

export default async function PublishedPage({ params }) {
  const data = await getPage(params.id);
  if (!data) notFound();
  const cleanWhatsApp = (data.wa || '').replace(/\D/g, '');
  return <main className="published-shell">
    <div className="published-ad ad"><span>ADVERTISEMENT</span><small>Your supplied ad script will be installed on published pages.</small></div>
    <div className="published-images">{(data.imgs || []).map((src,i)=><img src={src} key={i} alt={data.title || 'Landing page image'} />)}</div>
    <article className="published-content">
      <h1>{data.title}</h1><p>{data.desc}</p>
      {data.buttonOn && <a className="cta" href={data.url || '#'} target="_blank" rel="noreferrer">{data.btn || 'Watch Now 🎬'}</a>}
      {data.websiteOn && data.url && <a className="cta" href={data.url} target="_blank" rel="noreferrer">Visit Website</a>}
      {data.waOn && cleanWhatsApp && <a className="cta" href={`https://wa.me/${cleanWhatsApp}`} target="_blank" rel="noreferrer">WhatsApp</a>}
    </article>
    <div className="published-ad ad"><span>ADVERTISEMENT</span><small>Your supplied ad script will be installed on published pages.</small></div>
  </main>;
}
