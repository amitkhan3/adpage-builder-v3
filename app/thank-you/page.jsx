export const dynamic = 'force-dynamic';

const pageStyle={minHeight:'100vh',display:'grid',placeItems:'center',padding:'28px 16px',background:'#f5f7fb',fontFamily:'Inter,system-ui,sans-serif'};
const cardStyle={width:'min(520px,100%)',background:'#fff',border:'1px solid #e2e7ee',borderRadius:'22px',padding:'38px 26px',textAlign:'center',boxShadow:'0 18px 55px rgba(17,24,39,.08)'};
const iconStyle={width:68,height:68,margin:'0 auto 18px',borderRadius:'50%',display:'grid',placeItems:'center',background:'#eaf8ee',color:'#16803f',fontSize:34,fontWeight:900};
const labelStyle={fontSize:11,fontWeight:900,letterSpacing:'.16em',color:'#7b8597'};
const titleStyle={fontSize:'clamp(30px,7vw,42px)',margin:'8px 0 10px',color:'#172033'};
const textStyle={margin:'0 auto 7px',fontSize:16,lineHeight:1.6,color:'#475467'};
const smallStyle={display:'block',color:'#7b8597',fontSize:13,lineHeight:1.5};
const summaryStyle={margin:'24px 0',padding:'14px',borderRadius:14,background:'#f7f9fc',border:'1px solid #e7ebf1',display:'grid',gap:10};
const rowStyle={display:'flex',justifyContent:'space-between',gap:12,alignItems:'center',fontSize:13};
const mutedStyle={color:'#7b8597'};
const primaryStyle={display:'block',width:'100%',padding:'13px 16px',borderRadius:11,background:'#111827',color:'#fff',textDecoration:'none',fontWeight:850};
const secondaryStyle={display:'block',marginTop:10,padding:'11px 16px',borderRadius:11,border:'1px solid #d9dfe7',background:'#fff',color:'#172033',textDecoration:'none',fontWeight:750};

export default async function ThankYouPage({ searchParams }) {
  const params = await searchParams;
  const orderId = params?.order || '';
  const pageId = params?.page || '';
  const total = params?.total || '';
  const currency = params?.currency || '৳';
  const productUrl = pageId ? `/p/${encodeURIComponent(pageId)}` : '/';

  return (
    <main style={pageStyle}>
      <section style={cardStyle}>
        <div style={iconStyle}>✓</div>
        <div style={labelStyle}>ORDER CONFIRMED</div>
        <h1 style={titleStyle}>Thank You! 🎉</h1>
        <p style={textStyle}>Your order has been received successfully.</p>
        <small style={smallStyle}>We will contact you soon to confirm your order.</small>

        {(orderId || total) && (
          <div style={summaryStyle}>
            {orderId && <div style={rowStyle}><span style={mutedStyle}>Order ID</span><b>{orderId}</b></div>}
            {total && <div style={rowStyle}><span style={mutedStyle}>Total</span><b>{currency}{total}</b></div>}
          </div>
        )}

        <a style={primaryStyle} href={productUrl}>Place Another Order</a>
        {pageId && <a style={secondaryStyle} href={productUrl}>← Back to Product</a>}
      </section>
    </main>
  );
}
