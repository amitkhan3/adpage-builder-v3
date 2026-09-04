'use client';

import { useEffect, useState } from 'react';

const FREE_LIMIT = 3;

export default function FreePageQuota() {
  const [quota, setQuota] = useState(null);
  const [open, setOpen] = useState(false);
  const [checking, setChecking] = useState(false);

  const loadQuota = async () => {
    try {
      const r = await fetch('/api/saved-pages', { cache: 'no-store' });
      const d = await r.json();
      if (r.ok && d.quota) {
        setQuota(d.quota);
        return d.quota;
      }
    } catch {}
    return null;
  };

  useEffect(() => {
    if (window.location.pathname !== '/') return;
    loadQuota();
    const timer = setInterval(loadQuota, 15000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (window.location.pathname !== '/') return;

    const guard = async (e) => {
      const button = e.target.closest('button');
      if (!button) return;
      const text = (button.textContent || '').trim().toLowerCase();
      if (!text.includes('new page')) return;
      if (button.dataset.quotaAllowed === '1') {
        delete button.dataset.quotaAllowed;
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      if (checking) return;
      setChecking(true);

      const q = await loadQuota();
      setChecking(false);

      if (!q) {
        button.dataset.quotaAllowed = '1';
        button.click();
        return;
      }

      if (!q.unlimited && Number(q.used) >= Number(q.freeLimit || FREE_LIMIT)) {
        setOpen(true);
        return;
      }

      button.dataset.quotaAllowed = '1';
      button.click();
    };

    document.addEventListener('click', guard, true);
    return () => document.removeEventListener('click', guard, true);
  }, [checking]);

  if (typeof window === 'undefined' || window.location.pathname !== '/') return null;
  if (!quota || quota.unlimited) return null;

  const used = Math.min(Number(quota.used || 0), Number(quota.freeLimit || FREE_LIMIT));
  const limit = Number(quota.freeLimit || FREE_LIMIT);
  const full = used >= limit;

  return (
    <>
      <div style={{position:'fixed',right:18,bottom:18,zIndex:1000,maxWidth:380,background:'#fff',border:'1px solid #dbe3ef',borderRadius:14,boxShadow:'0 12px 35px rgba(15,23,42,.14)',padding:'12px 14px',display:'flex',alignItems:'center',gap:12,fontFamily:'Inter,system-ui,sans-serif'}}>
        <div style={{width:38,height:38,borderRadius:10,background:full?'#fff1f2':'#eff6ff',display:'grid',placeItems:'center',fontSize:18}}>{full?'🔒':'🆓'}</div>
        <div style={{minWidth:0,flex:1}}>
          <div style={{fontSize:13,fontWeight:800,color:'#172033'}}>{full?'Free limit reached':'Free Landing Pages'}</div>
          <div style={{fontSize:12,color:'#64748b',marginTop:2}}>{used} / {limit} used · {full?'Upgrade to create more':`You can create ${Math.max(0,limit-used)} more`}</div>
        </div>
        {full && <button onClick={()=>setOpen(true)} style={{border:0,borderRadius:9,padding:'8px 11px',background:'#172033',color:'#fff',fontWeight:800,cursor:'pointer'}}>View Plans</button>}
      </div>

      {open && <div onClick={()=>setOpen(false)} style={{position:'fixed',inset:0,zIndex:1100,background:'rgba(15,23,42,.45)',display:'grid',placeItems:'center',padding:20}}>
        <div onClick={e=>e.stopPropagation()} style={{width:'100%',maxWidth:430,background:'#fff',borderRadius:18,padding:26,boxShadow:'0 25px 70px rgba(15,23,42,.25)',fontFamily:'Inter,system-ui,sans-serif'}}>
          <div style={{fontSize:13,fontWeight:800,color:'#2563eb',letterSpacing:'.08em'}}>ADPAGE BUILDER</div>
          <h2 style={{margin:'8px 0 8px',fontSize:25,color:'#172033'}}>3 free pages are included</h2>
          <p style={{margin:'0 0 20px',lineHeight:1.6,color:'#64748b'}}>You have used all {limit} free landing pages. Choose a subscription to create and publish additional pages.</p>
          <div style={{display:'flex',gap:10}}>
            <button onClick={()=>setOpen(false)} style={{flex:1,padding:'12px 14px',border:'1px solid #dbe3ef',borderRadius:10,background:'#fff',fontWeight:700,cursor:'pointer'}}>Close</button>
            <button onClick={()=>window.location.href='/subscription'} style={{flex:1,padding:'12px 14px',border:0,borderRadius:10,background:'#172033',color:'#fff',fontWeight:800,cursor:'pointer'}}>View Subscription Plans</button>
          </div>
        </div>
      </div>}
    </>
  );
}
