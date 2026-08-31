import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { savePage, getPage } from '../../../lib/persistent-store';

export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
    const body = await request.json();
    const id = body.id || Math.random().toString(36).slice(2, 10);
    const existing = await getPage(id);
    if (existing && existing.ownerId && existing.ownerId !== userId) {
      return NextResponse.json({ error: 'You do not own this page.' }, { status: 403 });
    }
    const page = await savePage(id, { ...body, id, ownerId: existing?.ownerId || userId });
    return NextResponse.json({ id: page.id, page });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error?.message || 'Unable to save page' }, { status: 500 });
  }
}
