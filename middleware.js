import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
const isPublic = createRouteMatcher(['/p(.*)', '/sign-in(.*)', '/sign-up(.*)', '/api/orders']);
export default clerkMiddleware(async (auth, req) => {
  if (!isPublic(req)) await auth.protect();
});
export const config={matcher:['/((?!_next|.*\\..*).*)','/api/(.*)']};
