import { notFound } from 'next/navigation';
import { getPage } from '../../../lib/persistent-store';

export const dynamic = 'force-dynamic';

function ActionButton({ href, children }) {
  if (!href) return null;
  return <a className="cta" href={href} target="_blank" rel="noreferrer">{children}</a>;
}

export default async function PublishedPage({ params }) {
  const data = await getPage(params.id);
  if (!data) notFound();
  const whatsapp = (data.wa || '').replace(/\D/g, '');
  const whatsappUrl = whatsapp ? `https://wa.me/${whatsapp}${data.waMessage ? `?text=${encodeURIComponent(data.waMessage)}` : ''}` : '';
  return <main className="published-shell">
    <div className="published-ad ad"><span>ADVERTISEMENT</span><small>Ad space</small></div>
    <div className="published-images">{(data.imgs || []).map((src, i) => <img src={src} key={i} alt={data.title || 'Landing page image'} />)}</div>
    <article className="published-content">
      <h1>{data.title || 'Your Amazing Offer'}</h1>
      {data.desc && <p>{data.desc}</p>}
      {data.buttonOn && <ActionButton href={data.url}>{data.btn || 'Watch Now 🎬'}</ActionButton>}
      {data.websiteOn && data.url && <ActionButton href={data.url}>Visit Website</ActionButton>}
      {data.waOn && whatsappUrl && <ActionButton href={whatsappUrl}>WhatsApp</ActionButton>}
    </article>
    <div className="published-ad ad"><span>ADVERTISEMENT</span><small>Ad space</small></div>
  </main>;
}
