'use client';

import { useEffect, useMemo, useState } from 'react';

const empty = { title: 'Your Amazing Offer', desc: 'Create a beautiful landing page for your ad campaign.', btn: 'Watch Now 🎬', url: '', wa: '', waMessage: '', imgs: [], websiteOn: false, waOn: false, buttonOn: true };

function makeId() { return Math.random().toString(36).slice(2, 10); }

async function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 1400;
        const scale = Math.min(1, max / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.72));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function Builder() {
  const [form, setForm] = useState(empty);
  const [pageId, setPageId] = useState('');
  const [saved, setSaved] = useState([]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  const publishedUrl = useMemo(() => pageId ? `${typeof window !== 'undefined' ? window.location.origin : ''}/p/${pageId}` : '', [pageId]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const loadSaved = async () => {
    try {
      const res = await fetch('/api/saved-pages', { cache: 'no-store' });
      const data = await res.json();
      if (res.ok) setSaved(data.pages || []);
    } catch {}
  };

  useEffect(() => { loadSaved(); }, []);

  const upload = async (e) => {
    const files = Array.from(e.target.files || []).slice(0, 6);
    if (!files.length) return;
    setNotice('Optimizing images…');
    try {
      const converted = await Promise.all(files.map(compressImage));
      setForm((f) => ({ ...f, imgs: [...f.imgs, ...converted].slice(0, 6) }));
      setNotice(`${converted.length} image(s) added.`);
    } catch { setNotice('Could not process an image. Please try another file.'); }
    e.target.value = '';
  };

  const removeImage = (index) => setForm((f) => ({ ...f, imgs: f.imgs.filter((_, i) => i !== index) }));

  const save = async (publish = false) => {
    setBusy(true); setNotice('Saving…');
    try {
      const id = pageId || makeId();
      const payload = { ...form, id, published: publish };
      const res = await fetch('/api/pages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setPageId(data.id);
      await loadSaved();
      setNotice(publish ? 'Landing page published successfully.' : 'Landing page saved successfully.');
    } catch (error) { setNotice(error.message); }
    finally { setBusy(false); }
  };

  const openSaved = async (id) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/pages/${id}`, { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not open page');
      setForm({ ...empty, ...data });
      setPageId(id);
      setNotice('Saved landing page loaded.');
    } catch (e) { setNotice(e.message); }
    finally { setBusy(false); }
  };

  return <>
    <header className="header">
      <div className="brand"><b>AdPage Builder</b><small>Build • Save • Publish</small></div>
      <div className="top-actions"><button className="secondary" onClick={() => save(false)} disabled={busy}>Save</button><button onClick={() => save(true)} disabled={busy}>{busy ? 'Saving…' : 'Publish Page'}</button></div>
    </header>
    <main className="wrap">
      <div className="hero"><div><span className="eyebrow">AD LANDING PAGE</span><h1>Create pages that stay saved</h1><p>Build once, save permanently, and share the published URL from any device.</p></div><button className="new-btn" onClick={() => { setForm(empty); setPageId(''); setNotice('New landing page ready.'); }}>＋ New Page</button></div>
      <div className="grid">
        <section className="card builder-card">
          <div className="section-title"><div><h2>Landing Page</h2><p className="muted">Your page content and campaign CTA.</p></div>{pageId && <span className="saved-pill">● Saved</span>}</div>
          <label className="label">Headline</label><input className="field" value={form.title} onChange={e => set('title', e.target.value)} />
          <label className="label">Description</label><textarea className="field" rows="4" value={form.desc} onChange={e => set('desc', e.target.value)} />
          <label className="label">Images <small>(up to 6)</small></label>
          <div className="upload"><input id="files" type="file" accept="image/*" multiple onChange={upload} /><label htmlFor="files"><b>＋ Add images</b><br/><small>Images are optimized before saving</small></label></div>
          <div className="thumbs">{form.imgs.map((src, i) => <div className="thumb" key={i}><img src={src} alt=""/><button onClick={() => removeImage(i)} aria-label="Remove image">×</button></div>)}</div>
          <div className="subhead">CTA SETTINGS</div>
          <div className="toggle"><span>Button</span><button className={`switch ${form.buttonOn ? 'on' : ''}`} onClick={() => set('buttonOn', !form.buttonOn)}><i /></button></div>
          {form.buttonOn && <input className="field compact" value={form.btn} onChange={e => set('btn', e.target.value)} placeholder="Button text" />}
          <div className="toggle"><span>Website URL</span><button className={`switch ${form.websiteOn ? 'on' : ''}`} onClick={() => set('websiteOn', !form.websiteOn)}><i /></button></div>
          {form.websiteOn && <input className="field compact" placeholder="https://example.com" value={form.url} onChange={e => set('url', e.target.value)} />}
          <div className="toggle"><span>WhatsApp</span><button className={`switch ${form.waOn ? 'on' : ''}`} onClick={() => set('waOn', !form.waOn)}><i /></button></div>
          {form.waOn && <><input className="field compact" placeholder="8801XXXXXXXXX" value={form.wa} onChange={e => set('wa', e.target.value)} /><input className="field compact" placeholder="WhatsApp message (optional)" value={form.waMessage} onChange={e => set('waMessage', e.target.value)} /></>}
          <div className="action-row"><button className="save-btn" onClick={() => save(false)} disabled={busy}>💾 Save Landing Page</button><button className="publish" onClick={() => save(true)} disabled={busy}>🚀 Publish</button></div>
          {notice && <div className="notice">{notice}</div>}
          {publishedUrl && <div className="result"><b>Published / Saved URL</b><a href={publishedUrl} target="_blank" rel="noreferrer">{publishedUrl}</a><button onClick={() => navigator.clipboard?.writeText(publishedUrl)}>Copy URL</button></div>}
        </section>
        <section className="right-col">
          <div className="card preview"><div className="section-title"><div><h2>Live Preview</h2><p className="muted">Visitor view</p></div></div><div className="phone"><Visitor {...form} /></div></div>
          <div className="card saved-card"><div className="section-title"><div><h2>Saved Landing Pages</h2><p className="muted">Your last 50 saved pages.</p></div><button className="link-btn" onClick={loadSaved}>Refresh</button></div>{saved.length ? saved.map(p => <div className="saved-item" key={p.id}><div><b>{p.title || 'Untitled page'}</b><small>{new Date(p.updatedAt).toLocaleString()}</small></div><div><button onClick={() => openSaved(p.id)}>Edit</button><a href={`/p/${p.id}`} target="_blank" rel="noreferrer">Open</a></div></div>) : <div className="empty">No saved pages yet. Click <b>Save Landing Page</b> to keep your first page.</div>}</div>
        </section>
      </div>
    </main>
  </>;
}

function Visitor({ title, desc, imgs, btn, url, wa, waMessage, websiteOn, waOn, buttonOn }) {
  const clean = (wa || '').replace(/\D/g, '');
  const waUrl = clean ? `https://wa.me/${clean}${waMessage ? `?text=${encodeURIComponent(waMessage)}` : ''}` : '#';
  return <div className="visitor"><div className="ad"><span>ADVERTISEMENT</span><small>Ad space</small></div><div className="images">{imgs.map((x, i) => <img src={x} key={i} alt="" />)}</div><article><h1>{title}</h1><p>{desc}</p>{buttonOn && <a className="cta" href={url || '#'} target="_blank" rel="noreferrer">{btn}</a>}{websiteOn && url && <a className="cta" href={url} target="_blank" rel="noreferrer">Visit Website</a>}{waOn && clean && <a className="cta" href={waUrl} target="_blank" rel="noreferrer">WhatsApp</a>}</article></div>;
}
