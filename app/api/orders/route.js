import { NextResponse } from 'next/server';
import { listOrders, saveOrder } from '../../../lib/persistent-store';

export async function GET() {
  try { return NextResponse.json({ orders: await listOrders() }); }
  catch (error) { return NextResponse.json({ error: error?.message || 'Unable to load orders' }, { status: 500 }); }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.pageId || !body.name || !body.phone) return NextResponse.json({ error: 'Name and phone are required.' }, { status: 400 });
    const order = await saveOrder(body);
    return NextResponse.json({ order });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error?.message || 'Unable to create order' }, { status: 500 });
  }
}
