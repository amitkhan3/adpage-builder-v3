import { NextResponse } from 'next/server';
import { savePage } from '../../../lib/store';

export async function POST(request) {
  try {
    const data = await request.json();
    const id = Math.random().toString(36).slice(2, 10);
    await savePage(id, data);
    return NextResponse.json({ id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Unable to publish page' }, { status: 500 });
  }
}
