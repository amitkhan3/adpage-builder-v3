export const dynamic = 'force-dynamic';

export default async function ThankYouPage({ searchParams }) {
  const params = await searchParams;
  const orderId = params?.order || '';
  const pageId = params?.page || '';
  const total = params?.total || '';
  const currency = params?.currency || '৳';

  return (
    <main className="thank-you-page">
      <section className="thank-you-card">
        <div className="thank-icon">✓</div>
        <div className="thank-label">ORDER CONFIRMED</div>
        <h1>Thank You! 🎉</h1>
        <p>Your order has been received successfully.</p>
        <small>We will contact you soon to confirm your order.</small>

        {(orderId || total) && (
          <div className="thank-order-summary">
            {orderId && <div><span>Order ID</span><b>{orderId}</b></div>}
            {total && <div><span>Total</span><b>{currency}{total}</b></div>}
          </div>
        )}

        <div className="thank-actions">
          {pageId && <a className="thank-primary" href={`/p/${encodeURIComponent(pageId)}`}>Place Another Order</a>}
          {pageId && <a className="thank-secondary" href={`/p/${encodeURIComponent(pageId)}`}>← Back to Product</a>}
          {!pageId && <a className="thank-primary" href="/">Go to Home</a>}
        </div>
      </section>
    </main>
  );
}
