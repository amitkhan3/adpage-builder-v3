'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function PublishedPage() {
  const params = useParams();
  const [data, setData] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = params?.id;
    if (!id) return;
    try {
      const raw = localStorage.getItem('adpage:' + id);
      if (raw) setData(JSON.parse(raw));
    } catch (e) {
      console.error('Unable to load published page', e);
    } finally {
      setReady(true);
    }
  }, [params]);

  if (!ready) return <div className="published-loading">Loading page…</div>;
  if (!data) {
    return (
      <main className="published-error">
        <h1>Page not found</h1>
        <p>This landing page does not exist in this browser.</p>
        <a href="/">← Back to AdPage Builder</a>
      </main>
    );
  }

  const cleanWhatsApp = (data.wa || '').replace(/\D/g, '');

  return (
    <main className="published-shell">
      <div className="published-ad ad">
        <span>ADVERTISEMENT</span>
        <small>Your supplied ad script will be installed on published pages.</small>
      </div>

      <div className="published-images">
        {(data.imgs || []).map((src, i) => (
          <img src={src} key={i} alt={data.title || 'Landing page image'} />
        ))}
      </div>

      <article className="published-content">
        <h1>{data.title}</h1>
        <p>{data.desc}</p>

        {data.buttonOn && (
          <a className="cta" href={data.url || '#'} target="_blank" rel="noreferrer">
            {data.btn || 'Watch Now 🎬'}
          </a>
        )}

        {data.websiteOn && data.url && (
          <a className="cta" href={data.url} target="_blank" rel="noreferrer">
            Visit Website
          </a>
        )}

        {data.waOn && cleanWhatsApp && (
          <a className="cta" href={`https://wa.me/${cleanWhatsApp}`} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        )}
      </article>

      <div className="published-ad ad">
        <span>ADVERTISEMENT</span>
        <small>Your supplied ad script will be installed on published pages.</small>
      </div>
    </main>
  );
}
