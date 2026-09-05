export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { listPages } from '../../../lib/persistent-store';
import { isActiveSubscription } from '../../../lib/subscription-store';

const FREE_PUBLISH_LIMIT = 3;

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

    const pages = await listPages(userId);
    const active = await isActiveSubscription(userId);
    const publishUsed = pages.reduce((total, page) => {
      if (typeof page.publishCount === 'number') return total + Math.max(0, page.publishCount);
      return total + (page.published === true ? 1 : 0);
    }, 0);

    return NextResponse.json({
      pages,
      quota: {
        freeLimit: FREE_PUBLISH_LIMIT,
        used: publishUsed,
        remaining: Math.max(0, FREE_PUBLISH_LIMIT - publishUsed),
        unlimited: active,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error?.message || 'Unable to load saved pages' }, { status: 500 });
  }
}
