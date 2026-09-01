'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';

export default function AdminLogin(){
 const [password,setPassword]=useState(''); const [error,setError]=useState(''); const [busy,setBusy]=useState(false); const router=useRouter();
 async function submit(e){e.preventDefault();setBusy(true);setError('');try{const r=await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password})});const d=await r.json();if(!r.ok){setError(d.error||'Invalid admin password.');return;}router.replace('/admin');}catch{setError('Unable to sign in. Please try again.');}finally{setBusy(false);}}
 return <main className="admin-login-page"><div className="admin-login-card"><div className="admin-login-icon">🔐</div><div className="admin-login-label">ADPAGE BUILDER</div><h1>Admin Login</h1><p>Private admin control panel. Customers cannot access this login.</p><form onSubmit={submit}><label>Admin Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter admin password" autoFocus required/><button disabled={busy}>{busy?'Signing in…':'Login to Admin Panel'}</button>{error&&<div className="admin-login-error">{error}</div>}</form></div></main>
}
