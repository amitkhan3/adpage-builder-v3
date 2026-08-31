import { NextResponse } from 'next/server';
import { getPage } from '@/lib/store';

export async function GET(request, { params }) {
  try {
    const data = await getPage(params.id);
    if (!data) return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Unable to load page' }, { status: 500 });
  }
}
