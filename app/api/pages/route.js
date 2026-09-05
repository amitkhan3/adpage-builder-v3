export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { savePage, getPage, listPages } from '../../../lib/persistent-store';
import { isActiveSubscription } from '../../../lib/subscription-store';

const FREE_PAGE_LIMIT = 3;

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
    const publishedPages = pages.filter(page => page.published === true);

    // Saving is always allowed. The free limit applies only when publishing.
    // Existing published pages can still be edited and re-published.
    if (body.published === true && !active) {
      const currentIsPublished = existing?.published === true;
      const publishedCountWithoutCurrent = publishedPages.filter(page => page.id !== id).length;

      if (!currentIsPublished && publishedCountWithoutCurrent >= FREE_PAGE_LIMIT) {
        return NextResponse.json({
          error: `You have used all ${FREE_PAGE_LIMIT} free published landing pages. Please choose a subscription plan to publish another page.`,
          code: 'FREE_PUBLISH_LIMIT_REACHED',
          freeLimit: FREE_PAGE_LIMIT,
          used: publishedPages.length,
          remaining: 0
        }, { status: 402 });
      }
    }

    const page = await savePage(id, {
      ...body,
      id,
      ownerId: existing?.ownerId || userId
    });

    const updatedPages = await listPages(userId);
    const updatedPublishedPages = updatedPages.filter(item => item.published === true);

    return NextResponse.json({
      id: page.id,
      page,
      quota: {
        freeLimit: FREE_PAGE_LIMIT,
        used: updatedPublishedPages.length,
        remaining: Math.max(0, FREE_PAGE_LIMIT - updatedPublishedPages.length),
        unlimited: active
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error?.message || 'Unable to save page' }, { status: 500 });
  }
}
