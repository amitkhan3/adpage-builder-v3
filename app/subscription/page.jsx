'use client';
import {useEffect,useState} from 'react';

const PLANS=[
 {id:'monthly',name:'1 Month',months:1,amount:1000},
 {id:'quarterly',name:'3 Months',months:3,amount:2500},
 {id:'half-yearly',name:'6 Months',months:6,amount:4500},
];

export default function Subscription(){
 const[s,setS]=useState(null),[plan,setPlan]=useState(PLANS[0]),[method,setMethod]=useState('bkash'),[tx,setTx]=useState(''),[msg,setMsg]=useState('');
 const load=()=>fetch('/api/subscription',{cache:'no-store'}).then(r=>r.json()).then(d=>setS(d.subscription||null));
 useEffect(()=>{load()},[]);
 const submit=async e=>{e.preventDefault();setMsg('Submitting…');const r=await fetch('/api/subscription',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({method,transactionId:tx.trim(),amount:plan.amount,plan:plan.id})});const d=await r.json();setMsg(r.ok?'Payment submitted. Waiting for admin approval.':d.error||'Could not submit.');if(r.ok){setS(d.subscription);setTx('')}};
 return <main style={{minHeight:'100vh',background:'#f6f7fb',padding:'32px 16px',fontFamily:'system-ui'}}><div style={{maxWidth:900,margin:'0 auto'}}>
  <a href="/">← Back to Builder</a><div style={{background:'#111827',color:'#fff',borderRadius:18,padding:24,margin:'18px 0'}}><h1 style={{margin:'0 0 8px'}}>Activate Subscription</h1><p style={{margin:0}}>Choose a plan and submit your bKash/Nagad payment for approval.</p></div>
  {s?.status==='active'?<div style={{background:'#fff',padding:24,borderRadius:16,border:'1px solid #ddd'}}><h2>✅ Subscription Active</h2><p>Plan: <b>{PLANS.find(x=>x.id===s.plan)?.name||s.plan}</b></p>{s.expiresAt&&<p>Expires: {new Date(s.expiresAt).toLocaleDateString()}</p>}</div>:<>
   <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:14,marginBottom:18}}>{PLANS.map(p=><button key={p.id} type="button" onClick={()=>setPlan(p)} style={{textAlign:'left',padding:20,borderRadius:16,border:plan.id===p.id?'2px solid #111827':'1px solid #ddd',background:'#fff',cursor:'pointer'}}><b style={{fontSize:18}}>{p.name}</b><div style={{fontSize:28,fontWeight:800,marginTop:8}}>৳{p.amount.toLocaleString()}</div><small>Full access for {p.months} month{p.months>1?'s':''}</small></button>)}</div>
   <form onSubmit={submit} style={{background:'#fff',padding:22,borderRadius:16,border:'1px solid #ddd',display:'grid',gap:14}}><h2 style={{margin:0}}>Payment</h2><div style={{padding:16,background:'#f3f4f6',borderRadius:12}}><b>bKash / Nagad</b><div style={{fontSize:23,fontWeight:800,marginTop:4}}>01311358241</div><div>Send Money to this number, then enter the Transaction ID.</div></div><div style={{display:'flex',gap:10}}>{['bkash','nagad'].map(m=><button key={m} type="button" onClick={()=>setMethod(m)} style={{flex:1,padding:12,borderRadius:10,border:method===m?'2px solid #111827':'1px solid #ccc',background:'#fff',fontWeight:700}}>{m==='bkash'?'bKash':'Nagad'}</button>)}</div><input required placeholder="Transaction ID" value={tx} onChange={e=>setTx(e.target.value)} style={{padding:14,borderRadius:10,border:'1px solid #ccc'}}/><button style={{padding:14,border:0,borderRadius:10,background:'#111827',color:'#fff',fontWeight:800}}>Submit ৳{plan.amount.toLocaleString()} Payment</button>{s?.status==='pending'&&<div>⏳ Payment pending admin approval.</div>}{msg&&<div>{msg}</div>}</form>
  </>}
 </div></main>
}