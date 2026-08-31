import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { listPages } from '../../../lib/persistent-store';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
    return NextResponse.json({ pages: await listPages(userId) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error?.message || 'Unable to load saved pages' }, { status: 500 });
  }
}
