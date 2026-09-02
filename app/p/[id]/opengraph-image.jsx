import { ImageResponse } from 'next/og';
import { getPage } from '../../../../lib/persistent-store';

export const runtime = 'edge';
export const alt = 'AdPage Builder landing page';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }) {
  const page = await getPage(params.id);
  const title = page?.title || 'Professional Landing Page';
  const desc = page?.desc || 'Created with AdPage Builder';
  const accent = page?.accentColor || '#2563eb';
  const bg = page?.bgColor || '#f8fafc';

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '70px', background: bg, color: page?.textColor || '#172033', fontFamily: 'Arial' }}>
        <div style={{ display: 'flex', fontSize: 28, fontWeight: 800, color: accent, marginBottom: 28 }}>AdPage Builder</div>
        <div style={{ display: 'flex', fontSize: 64, lineHeight: 1.08, fontWeight: 900, maxWidth: 1050 }}>{title}</div>
        <div style={{ display: 'flex', fontSize: 30, lineHeight: 1.35, marginTop: 28, maxWidth: 980, opacity: 0.78 }}>{desc}</div>
        <div style={{ display: 'flex', marginTop: 45, fontSize: 24, fontWeight: 700 }}>Create • Save • Publish</div>
      </div>
    ),
    { ...size }
  );
}
