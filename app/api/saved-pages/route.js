export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { listPages } from '../../../lib/persistent-store';
import { isActiveSubscription } from '../../../lib/subscription-store';

const FREE_PAGE_LIMIT = 3;

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
    const pages = await listPages(userId);
    const active = await isActiveSubscription(userId);
    return NextResponse.json({
      pages,
      quota: {
        freeLimit: FREE_PAGE_LIMIT,
        used: pages.length,
        remaining: Math.max(0, FREE_PAGE_LIMIT - pages.length),
        unlimited: active,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error?.message || 'Unable to load saved pages' }, { status: 500 });
  }
}
