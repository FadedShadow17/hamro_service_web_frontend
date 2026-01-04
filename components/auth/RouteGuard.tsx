'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth/auth.storage';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function RouteGuard({ children, requireAuth = false, redirectTo }: RouteGuardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authenticated = isAuthenticated();

  useEffect(() => {
    if (requireAuth && !authenticated) {
      // Preserve the intended destination in the next query param
      const currentPath = window.location.pathname;
      const nextParam = encodeURIComponent(currentPath);
      router.push(`${redirectTo || '/login'}?next=${nextParam}`);
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

