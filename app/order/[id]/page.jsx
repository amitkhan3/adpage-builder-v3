import { notFound } from 'next/navigation';
import { getPage } from '../../../lib/persistent-store';
import OrderForm from '../../p/[id]/OrderForm';

export const dynamic = 'force-dynamic';

export default async function OrderPage({ params }) {
  const data = await getPage(params.id);
  if (!data || data.published === false) notFound();
  const price = (data.blocks || []).find(b => b.type === 'price');
  return (
    <main className="published-shell" style={{ background: data.bgColor || '#fff', color: data.textColor || '#172033', minHeight: '100vh' }}>
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '28px 15px 50px' }}>
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 800, opacity: .65, letterSpacing: '.12em' }}>ORDER NOW</div>
          <h1 style={{ margin: '8px 0', fontSize: 28 }}>{data.title || 'Place Your Order'}</h1>
          <p style={{ margin: 0, opacity: .72 }}>Please enter your name, phone number and delivery address.</p>
        </div>
        <OrderForm pageId={params.id} heading="Order Now" button="Place Order" price={price} />
      </div>
    </main>
  );
}
