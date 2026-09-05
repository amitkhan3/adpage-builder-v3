export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { savePage, getPage, listPages } from '../../../lib/persistent-store';
import { isActiveSubscription } from '../../../lib/subscription-store';

const FREE_PUBLISH_LIMIT = 3;

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

    const active = await isActiveSubscription(userId);
    const pages = await listPages(userId);

    // Every free Publish action uses one publish credit.
    // An existing published page edit + Publish is also a new publish action.
    const publishUsed = pages.reduce((total, page) => {
      if (typeof page.publishCount === 'number') return total + Math.max(0, page.publishCount);
      return total + (page.published === true ? 1 : 0);
    }, 0);

    if (body.published === true && !active && publishUsed >= FREE_PUBLISH_LIMIT) {
      return NextResponse.json({
        error: `You have used all ${FREE_PUBLISH_LIMIT} free publish actions. Please choose a subscription plan to publish or edit a published page again.`,
        code: 'FREE_PUBLISH_LIMIT_REACHED',
        freeLimit: FREE_PUBLISH_LIMIT,
        used: publishUsed,
        remaining: 0
      }, { status: 402 });
    }

    const currentPublishCount = typeof existing?.publishCount === 'number'
      ? Math.max(0, existing.publishCount)
      : (existing?.published === true ? 1 : 0);

    const nextPublishCount = body.published === true
      ? currentPublishCount + 1
      : currentPublishCount;

    const page = await savePage(id, {
      ...body,
      id,
      ownerId: existing?.ownerId || userId,
      publishCount: nextPublishCount
    });

    const updatedPages = await listPages(userId);
    const updatedPublishUsed = updatedPages.reduce((total, item) => {
      if (typeof item.publishCount === 'number') return total + Math.max(0, item.publishCount);
      return total + (item.published === true ? 1 : 0);
    }, 0);

    return NextResponse.json({
      id: page.id,
      page,
      quota: {
        freeLimit: FREE_PUBLISH_LIMIT,
        used: updatedPublishUsed,
        remaining: Math.max(0, FREE_PUBLISH_LIMIT - updatedPublishUsed),
        unlimited: active
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error?.message || 'Unable to save page' }, { status: 500 });
  }
}
