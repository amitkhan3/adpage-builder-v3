'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

export default function AuthBar(){
  const pathname = usePathname();
  const [subscription, setSubscription] = useState(null);
  const [loaded, setLoaded] = useState(false);

  // Published landing pages and the customer-facing thank-you page must look
  // like standalone customer pages. Never expose builder/auth navigation there.
  const customerPage = pathname?.startsWith('/p/') || pathname === '/thank-you';

  useEffect(() => {
    if (customerPage) return;
    let live = true;
    fetch('/api/subscription', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (live) {
          setSubscription(d?.subscription || null);
          setLoaded(true);
        }
      })
      .catch(() => {
        if (live) setLoaded(true);
      });
    return () => { live = false; };
  }, [customerPage]);

  if (customerPage) return null;

  return <div className="auth-bar">
    {loaded && subscription?.status !== 'active' && (
      <a className="auth-subscription" href="/subscription">💳 Subscription Plans</a>
    )}
    <SignedOut>
      <SignInButton mode="modal"><button className="auth-signin">Login</button></SignInButton>
      <a className="auth-signup" href="/sign-up">Create account</a>
    </SignedOut>
    <SignedIn>
      <a className="auth-dashboard" href="/">Dashboard</a>
      <UserButton afterSignOutUrl="/sign-in" />
    </SignedIn>
  </div>;
}
