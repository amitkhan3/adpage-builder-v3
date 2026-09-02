import { notFound } from 'next/navigation';
import { getPage } from '../../../lib/persistent-store';
import OrderForm from './OrderForm';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const data = await getPage(params.id);
  if (!data || data.published === false) return {};

  const title = data.title || 'Professional Landing Page';
  const description = data.desc || 'A professional landing page created with AdPage Builder.';
  const base = 'https://adpage-builder-v3-pied.vercel.app';
  const image = `${base}/adpage-og.svg`;
  const url = `${base}/p/${params.id}`;

  return {
    title,
    description,
    keywords: ['landing page', 'business website', 'product landing page', 'AdPage Builder'],
    alternates: { canonical: url },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: 'AdPage Builder',
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

function Block({b,id,accent}){if(b.type==='text')return <div className="published-text" style={{textAlign:b.align||'left',color:b.color||'inherit',fontSize:b.size||18,fontWeight:b.weight||500,lineHeight:b.line||1.6,letterSpacing:(b.spacing||0)+'px',background:b.background||'transparent'}}>{b.text}</div>;if(b.type==='image'){if(!b.src)return null;const width=Math.min(100,Math.max(20,Number(b.width)||85));const im=<img className="published-product-image" src={b.src} alt={b.alt||'Landing page image'} style={{width:`${width}%`,height:'auto',maxWidth:'720px',maxHeight:'620px',display:'block',margin:'22px auto',objectFit:'contain',objectPosition:'center'}}/>;return b.url?<a href={b.url} target="_blank" rel="noreferrer" className="image-link">{im}</a>:im}if(b.type==='price'){const r=Number(b.regular||0),o=Number(b.offer||0),price=o||r,off=r>price?Math.round((r-price)/r*100):0;return <div className="price-block">{r>price&&<del>{b.currency||'৳'}{r.toLocaleString()}</del>}<strong>{b.currency||'৳'}{price.toLocaleString()}</strong>{b.showDiscount!==false&&off>0&&<span>{off}% OFF</span>}</div>}if(b.type==='button'){const isOrder=b.orderAction===true||(!b.url&&/order now|অর্ডার/i.test(b.text||''));const href=isOrder?`/order/${id}`:(b.url||'#');return <a className={`cta anim-${b.animation||'fade-up'}`} style={{background:accent}} href={href} target={isOrder?'_self':'_blank'} rel={isOrder?undefined:'noreferrer'}>{b.text||'Get Started'}</a>}if(b.type==='whatsapp'){const n=(b.number||'').replace(/\D/g,'');return n?<a className="cta whatsapp" href={`https://wa.me/${n}${b.message?`?text=${encodeURIComponent(b.message)}`:''}`} target="_blank" rel="noreferrer">{b.text||'WhatsApp'}</a>:null}return null}

export default async function PublishedPage({params}){const data=await getPage(params.id);if(!data||data.published===false)notFound();const blocks=data.blocks?.length?data.blocks:[];const isEcom=data.template==='ecommerce';const priceBlock=isEcom?blocks.find(b=>b.type==='price'):null;return <main className="published-shell" style={{background:data.bgColor||'#fff',color:data.textColor||'#172033',fontFamily:data.fontFamily||'Inter,system-ui,sans-serif'}}>{blocks.map(b=>b.type==='order'&&isEcom?<OrderForm key={b.id} pageId={params.id} heading={b.heading} button={b.button} price={priceBlock}/>:<Block key={b.id} b={b} id={params.id} accent={data.accentColor||'#2563eb'}/>)}{!blocks.length&&<div className="published-content"><h1>{data.title||'Your Website'}</h1>{data.desc&&<p>{data.desc}</p>}</div>}</main>}
