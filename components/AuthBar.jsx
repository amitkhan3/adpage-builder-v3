'use client';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

export default function AuthBar(){
  return <div className="auth-bar">
    <a className="auth-subscription" href="/subscription">💳 Subscription Plans</a>
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
