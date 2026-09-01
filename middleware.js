import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { adminCookieName, verifyAdminToken } from './lib/admin-auth';

const isPublic = createRouteMatcher(['/p(.*)', '/sign-in(.*)', '/sign-up(.*)', '/admin-login(.*)', '/api/orders', '/api/admin/login']);

export default clerkMiddleware(async (auth, req) => {
  if (isPublic(req)) return;
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!verifyAdminToken(req.cookies.get(adminCookieName())?.value)) return NextResponse.redirect(new URL('/admin-login', req.url));
    return;
  }
  const { userId } = await auth();
  if (!userId) return auth.protect();
});

export const config = { matcher: ['/((?!_next|.*\\..*).*)', '/api/(.*)'] };
