'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, isProvider } from '@/lib/auth/auth.storage';
import { RouteGuard } from '@/components/auth/RouteGuard';
import { VerificationForm } from '@/components/provider/VerificationForm';

export default function ProviderVerificationPage() {
  const router = useRouter();
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const currentUser = getUser();
    if (!currentUser || !isProvider(currentUser)) {
      router.replace('/dashboard');
    } else {
      setUser(currentUser);
    }
  }, [router]);

  if (!mounted || !user || !isProvider(user)) {
    return (
      <RouteGuard requireAuth redirectTo="/login">
        <div className="flex min-h-screen items-center justify-center bg-[#0A2640]">
          <div className="text-lg text-white/70">Loading...</div>
        </div>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard requireAuth redirectTo="/login">
      <div className="min-h-screen bg-[#0A2640]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Provider Verification
              </h1>
              <p className="text-white/70">Complete your verification to start accepting bookings</p>
            </div>

            <div className="rounded-2xl bg-[#1C3D5B] border border-white/10 p-8">
              <VerificationForm
                onSuccess={() => {
                  router.push('/dashboard/provider');
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}

