'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth/auth.storage';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function RouteGuard({ children, requireAuth = false, redirectTo }: RouteGuardProps) {
  const router = useRouter();
  const authenticated = isAuthenticated();

  useEffect(() => {
    if (requireAuth && !authenticated) {
      router.push(redirectTo || '/login');
    } else if (!requireAuth && authenticated && redirectTo) {
      router.push(redirectTo);
    }
  }, [authenticated, requireAuth, redirectTo, router]);

  // Show nothing while redirecting
  if (requireAuth && !authenticated) {
    return null;
  }

  if (!requireAuth && authenticated && redirectTo) {
    return null;
  }

  return <>{children}</>;
}

