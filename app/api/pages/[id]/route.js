import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getPage } from '../../../../lib/persistent-store';

export async function GET(request, { params }) {
  try {
    const data = await getPage(params.id);
    if (!data) return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    const { userId } = await auth();
    if (data.ownerId && data.ownerId !== userId) return NextResponse.json({ error: 'You do not own this page.' }, { status: 403 });
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Unable to load page' }, { status: 500 });
  }
}
