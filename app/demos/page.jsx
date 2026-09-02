'use client';

import { useState } from 'react';

const demos = [
  {
    id: 'shop',
    label: 'E-commerce',
    title: 'AeroStep Pro',
    eyebrow: 'NEW COLLECTION • 2026',
    headline: 'Move faster. Look sharper.',
    text: 'A premium everyday sneaker designed for comfort, confidence and all-day movement.',
    price: '৳2,490',
    old: '৳3,200',
    accent: '#7c3aed',
    bg: '#f7f5ff',
  },
  {
    id: 'business',
    label: 'Business / Service',
    title: 'Nexa Studio',
    eyebrow: 'DIGITAL PRODUCT STUDIO',
    headline: 'We turn ideas into digital experiences.',
    text: 'Strategy, design and development for ambitious businesses that want to grow online.',
    accent: '#0f766e',
    bg: '#f2fbf8',
  },
  {
    id: 'agency',
    label: 'Agency / Portfolio',
    title: 'Northline Creative',
    eyebrow: 'BRAND • WEB • CREATIVE',
    headline: 'Make your brand impossible to ignore.',
    text: 'A modern creative agency helping brands stand out with bold identities and high-converting websites.',
    accent: '#ea580c',
    bg: '#fff7ed',
  },
];

function ProductVisual({ accent }) {
  return <div className="product-visual" style={{ '--accent': accent }}><div className="shoe-shadow"/><div className="shoe"><span/><i/><b/></div><div className="floating-tag">LIMITED<br/>DROP</div></div>;
}

function Demo({ d, active, setActive }) {
  const ecommerce = d.id === 'shop';
  return <article className="demo" style={{ '--accent': d.accent, '--bg': d.bg }}>
    <div className="demo-nav"><strong>{d.title}</strong><div><span>Home</span><span>About</span><span>{ecommerce ? 'Shop' : 'Services'}</span><span>Contact</span></div><button>Menu</button></div>
    <section className="demo-hero">
      <div className="copy"><span className="eyebrow">{d.eyebrow}</span><h2>{d.headline}</h2><p>{d.text}</p><div className="actions"><button className="primary" onClick={() => setActive(d.id)}>{ecommerce ? 'Order Now →' : 'Get Started →'}</button><button className="ghost">{ecommerce ? 'View Details' : 'Explore Our Work'}</button></div>{ecommerce && <div className="price"><strong>{d.price}</strong><del>{d.old}</del><small>20% OFF</small></div>}</div>
      <div className="visual">{ecommerce ? <ProductVisual accent={d.accent}/> : <div className="service-visual"><div className="orb one"/><div className="orb two"/><div className="service-card"><small>{d.id === 'business' ? 'WHAT WE DO' : 'SELECTED WORK'}</small><strong>{d.id === 'business' ? 'Design that works.' : 'Bold ideas. Real results.'}</strong><div className="mini-grid"><i/><i/><i/><i/></div></div></div>}</div>
    </section>
    <section className="features">{(ecommerce ? ['Premium materials','All-day comfort','Fast delivery'] : d.id === 'business' ? ['Strategy','UI / UX Design','Development'] : ['Brand Identity','Web Design','Creative Direction']).map((x,i)=><div key={x}><span>0{i+1}</span><strong>{x}</strong><p>{ecommerce ? 'Designed to give you a better everyday experience.' : 'Built around your goals, audience and brand.'}</p></div>)}</section>
    {active === d.id && <div className="demo-toast">Demo CTA clicked ✓</div>}
  </article>;
}

export default function DemosPage() {
  const [active, setActive] = useState('');
  return <main className="demos-page"><style>{`
    *{box-sizing:border-box}.demos-page{min-height:100vh;background:#090b12;color:#f8fafc;padding:28px 18px 70px;font-family:Inter,ui-sans-serif,system-ui,sans-serif}.intro{max-width:1180px;margin:0 auto 28px;text-align:center}.intro .pill{display:inline-flex;padding:7px 12px;border:1px solid #ffffff1c;background:#ffffff0a;border-radius:999px;font-size:11px;font-weight:800;letter-spacing:.14em}.intro h1{font-size:clamp(34px,6vw,68px);line-height:1.02;margin:18px 0 12px;letter-spacing:-.045em}.intro p{max-width:680px;margin:auto;color:#aab1c2;line-height:1.7}.demo{max-width:1180px;margin:26px auto;border-radius:30px;overflow:hidden;background:var(--bg);color:#172033;box-shadow:0 30px 90px #0007;position:relative}.demo-nav{height:72px;padding:0 30px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #17203312}.demo-nav strong{font-size:18px;letter-spacing:-.02em}.demo-nav div{display:flex;gap:25px;font-size:13px;color:#5b6475}.demo-nav button{display:none}.demo-hero{display:grid;grid-template-columns:1fr 1fr;min-height:500px;padding:64px 7%;align-items:center;gap:35px}.copy{max-width:540px}.eyebrow{font-size:11px;font-weight:900;letter-spacing:.16em;color:var(--accent)}.copy h2{font-size:clamp(42px,5vw,70px);line-height:.98;letter-spacing:-.055em;margin:18px 0}.copy p{font-size:17px;line-height:1.7;color:#5c6575;max-width:500px}.actions{display:flex;gap:12px;margin-top:27px;flex-wrap:wrap}.actions button{border:0;border-radius:13px;padding:14px 20px;font-weight:800;cursor:pointer}.primary{background:var(--accent);color:white}.ghost{background:#fff;color:#273044;border:1px solid #17203318!important}.price{display:flex;align-items:center;gap:12px;margin-top:22px}.price strong{font-size:28px}.price del{color:#8c94a2}.price small{background:#172033;color:#fff;padding:5px 8px;border-radius:6px;font-weight:800}.visual{min-height:370px;display:grid;place-items:center}.product-visual{width:min(100%,500px);height:390px;position:relative;display:grid;place-items:center;background:radial-gradient(circle at 50% 45%,#fff 0,#ece9ff 45%,transparent 70%)}.shoe-shadow{position:absolute;width:65%;height:35px;background:#0002;filter:blur(18px);bottom:65px;border-radius:50%}.shoe{width:72%;height:160px;position:relative;transform:rotate(-9deg);border-radius:80px 65px 35px 30px;background:linear-gradient(145deg,#fff,#d8d3ff);box-shadow:30px 30px 55px #0002}.shoe:before{content:'';position:absolute;right:-4%;bottom:-15px;width:92%;height:48px;border-radius:30px;background:#fff;border:3px solid #d8dbe7}.shoe:after{content:'';position:absolute;left:12%;top:22px;width:52%;height:18px;border-radius:10px;background:var(--accent);box-shadow:0 30px 0 #17203318,0 60px 0 #17203312}.shoe span{position:absolute;right:9%;top:18%;width:30%;height:70%;border-left:4px solid var(--accent);border-radius:50%}.shoe i{position:absolute;left:10%;top:35%;width:35%;height:5px;background:#a7a4bd;transform:rotate(20deg)}.shoe b{position:absolute;left:10%;top:53%;width:35%;height:5px;background:#a7a4bd;transform:rotate(20deg)}.floating-tag{position:absolute;right:5%;top:7%;padding:12px 15px;background:#fff;border-radius:12px;box-shadow:0 12px 30px #0002;font-size:10px;font-weight:900;letter-spacing:.1em;color:var(--accent)}.service-visual{position:relative;width:100%;height:390px;display:grid;place-items:center;overflow:hidden}.orb{position:absolute;border-radius:50%;filter:blur(1px)}.orb.one{width:260px;height:260px;background:var(--accent);opacity:.16;top:10px;right:15%}.orb.two{width:170px;height:170px;background:#fff;opacity:.8;bottom:15px;left:15%}.service-card{width:min(80%,390px);padding:30px;border-radius:24px;background:#fff;box-shadow:0 30px 70px #0002;position:relative}.service-card small{font-size:10px;font-weight:900;letter-spacing:.15em;color:var(--accent)}.service-card strong{display:block;font-size:34px;line-height:1.05;letter-spacing:-.04em;margin:18px 0 25px}.mini-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}.mini-grid i{height:70px;border-radius:12px;background:linear-gradient(135deg,var(--accent),#fff);opacity:.7}.features{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid #17203312}.features>div{padding:25px 7%;border-right:1px solid #17203312}.features>div:last-child{border:0}.features span{display:block;font-size:10px;font-weight:900;color:var(--accent);margin-bottom:10px}.features strong{font-size:18px}.features p{font-size:13px;line-height:1.6;color:#697283;margin-bottom:0}.demo-toast{position:absolute;right:22px;bottom:22px;background:#111827;color:#fff;padding:12px 16px;border-radius:12px;font-weight:800;font-size:13px;box-shadow:0 15px 40px #0004}@media(max-width:760px){.demos-page{padding:15px 10px 45px}.demo{border-radius:22px}.demo-nav{height:62px;padding:0 20px}.demo-nav div{display:none}.demo-nav button{display:block;border:1px solid #17203320;background:#fff;border-radius:9px;padding:8px 11px}.demo-hero{grid-template-columns:1fr;padding:45px 24px 30px;gap:8px}.copy h2{font-size:45px}.copy p{font-size:15px}.visual{min-height:300px}.product-visual,.service-visual{height:300px}.shoe{height:125px}.features{grid-template-columns:1fr}.features>div{border-right:0;border-bottom:1px solid #17203312;padding:19px 24px}}
  `}</style>
    <div className="intro"><span className="pill">ADPAGE BUILDER • DEMO SHOWCASE</span><h1>Three pages. Three different businesses.</h1><p>Real landing-page concepts showing what your builder can create for e-commerce, business services and creative agencies.</p></div>
    {demos.map(d => <Demo key={d.id} d={d} active={active} setActive={setActive}/>) }
  </main>;
}
