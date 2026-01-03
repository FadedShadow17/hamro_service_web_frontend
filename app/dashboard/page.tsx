'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, clearAuth, isAuthenticated } from '@/lib/auth/auth.storage';
import type { User } from '@/lib/auth/auth.storage';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const userData = getUser();
    if (!userData) {
      router.push('/login');
      return;
    }

    setUser(userData);
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A2640]">
        <div className="text-lg text-white/70">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0A2640]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl bg-[#1C3D5B] p-8 md:p-12 shadow-2xl border border-white/10">
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#69E6A6] flex items-center justify-center">
                  <span className="text-[#0A2640] font-bold text-xl">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    Welcome, {user.name}!
                  </h1>
                  <p className="mt-2 text-lg text-white/70">
                    Role: <span className="font-semibold capitalize text-[#69E6A6]">{user.role}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={handleLogout}
                className="rounded-full bg-red-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-red-600"
              >
                Logout
              </button>
              <button
                onClick={() => window.location.href = '/services'}
                className="rounded-full border-2 border-white/20 text-white px-6 py-3 font-semibold transition-colors hover:bg-white/10"
              >
                Browse Services
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

