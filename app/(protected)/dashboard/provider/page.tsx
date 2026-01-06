'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, isProvider } from '@/lib/auth/auth.storage';
import { RouteGuard } from '@/components/auth/RouteGuard';
import Link from 'next/link';

export default function ProviderDashboardPage() {
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
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Provider Dashboard
              </h1>
              <p className="text-white/70">Manage your bookings and availability</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Link
                href="/dashboard/provider/bookings"
                className="rounded-2xl bg-[#1C3D5B] p-6 border border-white/10 hover:border-[#69E6A6]/50 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-[#69E6A6]/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#69E6A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">My Jobs</h3>
                    <p className="text-white/70 text-sm">View and manage booking requests</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/dashboard/provider/availability"
                className="rounded-2xl bg-[#1C3D5B] p-6 border border-white/10 hover:border-[#69E6A6]/50 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-[#4A9EFF]/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#4A9EFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Availability</h3>
                    <p className="text-white/70 text-sm">Set your weekly schedule</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}

