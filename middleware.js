import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublic = createRouteMatcher([
  '/p(.*)',
  '/order(.*)',
  '/thank-you(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/admin-login(.*)',
  '/api/orders',
  '/api/admin/login'
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublic(req)) return;
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!req.cookies.get('adpage_admin_session')?.value) return NextResponse.redirect(new URL('/admin-login', req.url));
    return;
  }
  const { userId } = await auth();
  if (!userId) return auth.protect();
});

export const config = { matcher: ['/((?!_next|.*\\..*).*)', '/api/(.*)'] };
