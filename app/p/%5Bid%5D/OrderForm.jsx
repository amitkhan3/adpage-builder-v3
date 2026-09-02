'use client';
import { useState } from 'react';

export default function OrderForm({ pageId, heading, button, price }) {
  const [f, setF] = useState({ name: '', phone: '', address: '', quantity: 1 });
  const [msg, setMsg] = useState('');
  const regular = Number(price?.regular || 0);
  const offer = Number(price?.offer || 0);
  const unit = offer || regular;
  const total = unit * Math.max(1, Number(f.quantity || 1));

  const submit = async (e) => {
    e.preventDefault();
    setMsg('Sending…');
    try {
      const r = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...f,
          pageId,
          quantity: Math.max(1, Number(f.quantity || 1)),
          currency: price?.currency || '৳',
          regularPrice: regular,
          offerPrice: unit,
          total,
        }),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error || 'Could not send order');

      const orderId = d?.order?.id || '';
      window.location.href = `/thank-you?order=${encodeURIComponent(orderId)}&page=${encodeURIComponent(pageId)}&total=${encodeURIComponent(total)}&currency=${encodeURIComponent(price?.currency || '৳')}`;
    } catch (e) {
      setMsg(e.message || 'Could not send order');
    }
  };

  return (
    <form className="order-form published-order" onSubmit={submit}>
      <h3>{heading || 'Order Now'}</h3>
      {unit > 0 && (
        <div className="order-price">
          {regular > unit && <del>{price?.currency || '৳'}{regular}</del>}
          <strong>{price?.currency || '৳'}{unit}</strong>
          {regular > unit && <span>{Math.round(((regular - unit) / regular) * 100)}% OFF</span>}
          <small>Total: {price?.currency || '৳'}{total}</small>
        </div>
      )}
      <input required placeholder="Your Name" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} />
      <input required placeholder="Phone Number" value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} />
      <textarea required placeholder="Delivery Address" value={f.address} onChange={e => setF({ ...f, address: e.target.value })} />
      <input type="number" min="1" placeholder="Quantity" value={f.quantity} onChange={e => setF({ ...f, quantity: e.target.value })} />
      <div className="order-total"><b>Total: {price?.currency || '৳'}{total}</b></div>
      <button type="submit">{button || 'Place Order'}</button>
      {msg && <small>{msg}</small>}
    </form>
  );
}
