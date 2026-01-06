'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, USER_ROLES } from '@/lib/auth/auth.storage';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const user = getUser();
    if (user) {
      if (user.role === USER_ROLES.USER) {
        router.replace('/dashboard/user');
      } else if (user.role === USER_ROLES.PROVIDER) {
        router.replace('/dashboard/provider');
      }
    }
  }, [router]);

  return <>{children}</>;
}

