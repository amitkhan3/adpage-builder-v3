import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublic = createRouteMatcher(['/p(.*)', '/sign-in(.*)', '/sign-up(.*)', '/api/orders']);

export default clerkMiddleware(async (auth, req) => {
  if (isPublic(req)) return;

  const { userId } = await auth();

  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!userId) return auth.protect();
    if (!process.env.ADMIN_USER_ID || userId !== process.env.ADMIN_USER_ID) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return;
  }

  if (!userId) return auth.protect();
});

export const config = { matcher: ['/((?!_next|.*\\..*).*)', '/api/(.*)'] };
