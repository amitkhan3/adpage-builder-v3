export const dynamic = 'force-dynamic';

const pageStyle={minHeight:'100vh',display:'grid',placeItems:'center',padding:'24px 16px',background:'linear-gradient(135deg,#f7faf8,#eef6f1)',fontFamily:'Inter,system-ui,sans-serif'};
const cardStyle={width:'min(560px,100%)',background:'#fff',border:'1px solid #e1e8e3',borderRadius:'28px',padding:'44px 28px',textAlign:'center',boxShadow:'0 24px 70px rgba(17,80,45,.12)'};
const iconStyle={width:82,height:82,margin:'0 auto 20px',borderRadius:'50%',display:'grid',placeItems:'center',background:'#e9f8ee',color:'#16803f',fontSize:40,fontWeight:900,boxShadow:'0 8px 24px rgba(22,128,63,.12)'};
const labelStyle={fontSize:11,fontWeight:900,letterSpacing:'.18em',color:'#16803f'};
const titleStyle={fontSize:'clamp(34px,8vw,50px)',lineHeight:1.05,margin:'10px 0 12px',color:'#13261b'};
const textStyle={margin:'0 auto 8px',fontSize:17,lineHeight:1.6,color:'#405248'};
const smallStyle={display:'block',color:'#718078',fontSize:13,lineHeight:1.6};
const summaryStyle={margin:'26px 0',padding:'16px',borderRadius:16,background:'#f7faf8',border:'1px solid #e5ece7',display:'grid',gap:11};
const rowStyle={display:'flex',justifyContent:'space-between',gap:12,alignItems:'center',fontSize:13};
const mutedStyle={color:'#718078'};
const primaryStyle={display:'block',width:'100%',padding:'14px 16px',borderRadius:12,background:'#16803f',color:'#fff',textDecoration:'none',fontWeight:850,boxShadow:'0 8px 20px rgba(22,128,63,.18)'};
const secondaryStyle={display:'block',marginTop:10,padding:'12px 16px',borderRadius:12,border:'1px solid #d9e2dc',background:'#fff',color:'#263a2d',textDecoration:'none',fontWeight:750};

export default async function ThankYouPage({ searchParams }) {
  const params = await searchParams;
  const orderId = params?.order || '';
  const pageId = params?.page || '';
  const total = params?.total || '';
  const currency = params?.currency || '৳';
  const productUrl = pageId ? `/p/${encodeURIComponent(pageId)}` : '/';
  return <main style={pageStyle}>
    <section style={cardStyle}>
      <div style={iconStyle}>✓</div>
      <div style={labelStyle}>ORDER CONFIRMED</div>
      <h1 style={titleStyle}>Thank You! 🎉</h1>
      <p style={textStyle}>Your order has been received successfully.</p>
      <small style={smallStyle}>We will contact you soon to confirm your order.</small>
      {(orderId || total) && <div style={summaryStyle}>
        {orderId && <div style={rowStyle}><span style={mutedStyle}>Order ID</span><b>{orderId}</b></div>}
        {total && <div style={rowStyle}><span style={mutedStyle}>Total</span><b>{currency}{total}</b></div>}
      </div>}
      <a style={primaryStyle} href={productUrl}>Place Another Order</a>
      {pageId && <a style={secondaryStyle} href={productUrl}>← Back to Product</a>}
    </section>
  </main>;
}
