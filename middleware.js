import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const ADMIN_ID = 'user_3IkJ9yqORLSrkT6QDtrL7e53p5h';
const isPublic = createRouteMatcher(['/p(.*)', '/sign-in(.*)', '/sign-up(.*)', '/api/orders']);

export default clerkMiddleware(async (auth, req) => {
  if (isPublic(req)) return;
  const { userId } = await auth();

  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!userId) return auth.protect();
    if (userId !== ADMIN_ID && userId !== process.env.ADMIN_USER_ID) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return;
  }

  if (!userId) return auth.protect();
});

export const config = { matcher: ['/((?!_next|.*\\..*).*)', '/api/(.*)'] };
