'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, USER_ROLES } from '@/lib/auth/auth.storage';

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const user = getUser();
    if (user) {
      if (user.role === USER_ROLES.USER) {
        router.replace('/dashboard/user');
      } else if (user.role === USER_ROLES.PROVIDER) {
        router.replace('/dashboard/provider');
      }
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A2640]">
      <div className="text-lg text-white/70">Redirecting...</div>
    </div>
  );
}

