import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { listOrders, saveOrder, getPage } from '../../../lib/persistent-store';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
    return NextResponse.json({ orders: await listOrders(userId) });
  } catch (error) {
    return NextResponse.json({ error: error?.message || 'Unable to load orders' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.pageId || !body.name || !body.phone) return NextResponse.json({ error: 'Name and phone are required.' }, { status: 400 });
    const page = await getPage(body.pageId);
    if (!page || page.published === false) return NextResponse.json({ error: 'Published page not found.' }, { status: 404 });
    const price = Array.isArray(page.blocks) ? page.blocks.find((b) => b.type === 'price') : null;
    const regular = Number(price?.regular || body.regularPrice || 0);
    const offer = Number(price?.offer || body.offerPrice || 0);
    const unit = offer || regular;
    const quantity = Math.max(1, Number(body.quantity || 1));
    const total = unit * quantity;
    const order = await saveOrder({ ...body, quantity, regularPrice: regular, offerPrice: unit, currency: price?.currency || body.currency || '৳', total, ownerId: page.ownerId || null });
    return NextResponse.json({ order });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error?.message || 'Unable to create order' }, { status: 500 });
  }
}
