import { NextResponse } from 'next/server';
import { savePage } from '../../../lib/persistent-store';

export async function POST(request) {
  try {
    const body = await request.json();
    const id = body.id || Math.random().toString(36).slice(2, 10);
    const page = await savePage(id, { ...body, id });
    return NextResponse.json({ id: page.id, page });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error?.message || 'Unable to save page' }, { status: 500 });
  }
}
