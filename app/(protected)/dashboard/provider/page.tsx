'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, isProvider } from '@/lib/auth/auth.storage';
import { RouteGuard } from '@/components/auth/RouteGuard';
import Link from 'next/link';
import { getProviderDashboardSummary, type Booking, type BookingStatus, type DashboardSummary } from '@/lib/api/bookings.api';
import { getVerificationStatus, type VerificationStatus } from '@/lib/api/provider-verification.api';
import { HttpError } from '@/lib/api/http';
import { LoadingSkeleton, BookingCardSkeleton } from '@/components/dashboard/LoadingSkeleton';
import { StatCard, SectionCard, BookingCard } from '@/components/dashboard';
import { useToastContext } from '@/providers/ToastProvider';

export default function ProviderDashboardPage() {
  const router = useRouter();
  const toast = useToastContext();
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummary | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);

  useEffect(() => {
    setMounted(true);
    const currentUser = getUser();
    if (!currentUser || !isProvider(currentUser)) {
      router.replace('/dashboard');
    } else {
      setUser(currentUser);
      
      // Wrap in async function to properly handle errors and prevent Next.js error overlay
      const loadData = async () => {
        try {
          await loadDashboardData();
        } catch (err) {
          // Error is already handled in loadDashboardData, but we catch here
          // to prevent unhandled promise rejection that triggers Next.js error overlay
          if (err instanceof HttpError && err.status === 404 && err.message.includes('Provider profile not found')) {
            // This is an expected error, already handled in loadDashboardData
            return;
          }
        }
      };
      
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // Refetch dashboard data when page gains focus (to sync with actions from My Jobs page)
  useEffect(() => {
    const handleFocus = () => {
      if (user && isProvider(user)) {
        // Wrap in async function to prevent unhandled promise rejections
        const loadData = async () => {
          try {
            await loadDashboardData();
          } catch (err) {
            // Error is already handled in loadDashboardData
            if (err instanceof HttpError && err.status === 404 && err.message.includes('Provider profile not found')) {
              return;
            }
          }
        };
        loadData();
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user]);

  // Listen for custom event to refresh dashboard summary (triggered from My Jobs page)
  useEffect(() => {
    const handleRefresh = () => {
      if (user && isProvider(user)) {
        // Wrap in async function to prevent unhandled promise rejections
        const loadData = async () => {
          try {
            await loadDashboardData();
          } catch (err) {
            // Error is already handled in loadDashboardData
            if (err instanceof HttpError && err.status === 404 && err.message.includes('Provider profile not found')) {
              return;
            }
          }
        };
        loadData();
      }
    };
    window.addEventListener('refreshDashboardSummary', handleRefresh);
    return () => window.removeEventListener('refreshDashboardSummary', handleRefresh);
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [summaryData, verificationData] = await Promise.all([
        getProviderDashboardSummary().catch((err) => {
          // Prevent error from propagating to Next.js error overlay
          if (err instanceof HttpError) {
            // Handle 404 (provider profile not found) gracefully
            if (err.status === 404 && err.message.includes('Provider profile not found')) {
              // This is expected for providers who haven't completed verification yet
              // Return empty summary - verification status will show they need to verify
              console.info('Provider profile not found - user needs to complete verification');
              return {
                pending: 0,
                confirmed: 0,
                completed: 0,
                total: 0,
                upcoming: [],
                recent: [],
              };
            }
            // For other errors, log but still return empty summary
            console.error('Error loading dashboard summary:', err);
          } else {
            console.error('Unexpected error loading dashboard summary:', err);
          }
          // Return default empty summary on any error
          return {
            pending: 0,
            confirmed: 0,
            completed: 0,
            total: 0,
            upcoming: [],
            recent: [],
          };
        }),
        getVerificationStatus().catch(() => null),
      ]);
      setDashboardSummary(summaryData);
      setVerificationStatus(verificationData?.verificationStatus || null);
    } catch (err) {
      // This catch should rarely be hit since we're catching errors in Promise.all
      // But we keep it as a safety net
      console.error('Error loading dashboard data:', err);
      if (err instanceof HttpError) {
        // Only show toast for unexpected errors, not for missing profile
        if (err.status !== 404 || !err.message.includes('Provider profile not found')) {
          toast.error(err.message || 'Failed to load dashboard data');
        }
      }
    } finally {
      setLoading(false);
    }
  };


  if (!mounted || !user || !isProvider(user)) {
    return (
      <RouteGuard requireAuth redirectTo="/login">
        <div className="flex min-h-screen items-center justify-center bg-[#0A2640]">
          <div className="text-lg text-white/70">Loading...</div>
        </div>
      </RouteGuard>
    );
  }

  // Use dashboard summary data (real data from API)
  const pendingCount = dashboardSummary?.pending || 0;
  const confirmedCount = dashboardSummary?.confirmed || 0;
  const completedCount = dashboardSummary?.completed || 0;
  const totalCount = dashboardSummary?.total || 0;
  const upcomingBookings = dashboardSummary?.upcoming || [];
  const recentBookings = dashboardSummary?.recent || [];

  const getVerificationBadge = () => {
    if (!verificationStatus) return null;
    const badges: Record<string, { text: string; color: string; icon: string }> = {
      pending: { text: 'Pending Review', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50', icon: '⏳' },
      verified: { text: 'Verified', color: 'bg-[#69E6A6]/20 text-[#69E6A6] border-[#69E6A6]/50', icon: '✅' },
    };
    const badge = badges[verificationStatus];
    if (!badge) return null;
    return (
      <div className="flex items-center gap-3">
        <span className={`px-4 py-2 rounded-full text-sm font-semibold border flex items-center gap-2 transition-all duration-300 ${badge.color} ${verificationStatus === 'verified' ? 'shadow-lg shadow-[#69E6A6]/20' : ''}`}>
          <span>{badge.icon}</span>
          <span>{badge.text}</span>
        </span>
        {verificationStatus === 'verified' && (
          <span className="text-[#69E6A6] text-sm font-medium">Ready to accept requests</span>
        )}
      </div>
    );
  };

  return (
    <RouteGuard requireAuth redirectTo="/login">
      <div className="min-h-screen bg-[#0A2640]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#69E6A6]/20 to-[#69E6A6]/10 flex items-center justify-center border border-[#69E6A6]/20">
                    <svg className="w-6 h-6 text-[#69E6A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
                      Welcome back, {user.name}! 
                    </h1>
                    <p className="text-white/70 text-lg">Manage your bookings and services</p>
                  </div>
                </div>
                {getVerificationBadge()}
              </div>
              {verificationStatus && verificationStatus === 'pending' && (
                <div className="mt-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-start gap-3">
                  <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-yellow-400 font-semibold text-sm mb-1">
                      Verification Under Review
                    </p>
                    <p className="text-yellow-300/80 text-xs">
                      Your verification is being processed by admin.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {loading ? (
              <LoadingSkeleton />
            ) : (
              <>
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                  <StatCard
                    value={pendingCount}
                    label="Pending Requests"
                    icon={
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    }
                    color="yellow"
                    href="/dashboard/provider/bookings?status=PENDING"
                    progress={Math.min((pendingCount / 10) * 100, 100)}
                  />

                  <StatCard
                    value={confirmedCount}
                    label="Confirmed"
                    icon={
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    }
                    color="green"
                    href="/dashboard/provider/bookings?status=CONFIRMED"
                    progress={Math.min((confirmedCount / 10) * 100, 100)}
                  />

                  <StatCard
                    value={completedCount}
                    label="Completed"
                    icon={
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    }
                    color="blue"
                    href="/dashboard/provider/bookings?status=COMPLETED"
                    progress={Math.min((completedCount / 10) * 100, 100)}
                  />

                  <StatCard
                    value={totalCount}
                    label="Total Bookings"
                    icon={
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    }
                    color="blue"
                    href="/dashboard/provider/bookings"
                    progress={Math.min((totalCount / 20) * 100, 100)}
                  />
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <svg className="w-6 h-6 text-[#69E6A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">Quick Actions</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link
                      href="/dashboard/provider/bookings"
                      className="group rounded-2xl bg-gradient-to-br from-[#1C3D5B] to-[#0A2640] p-6 border border-white/10 hover:border-[#69E6A6]/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#69E6A6]/10"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#69E6A6]/20 to-[#69E6A6]/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-[#69E6A6]/20">
                          <svg className="w-7 h-7 text-[#69E6A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-bold text-xl mb-1 group-hover:text-[#69E6A6] transition-colors">My Jobs</h3>
                          <p className="text-white/70 text-sm">View and manage all booking requests</p>
                          {pendingCount > 0 && (
                            <p className="text-yellow-400 text-xs font-medium mt-1">{pendingCount} pending request{pendingCount !== 1 ? 's' : ''} waiting</p>
                          )}
                        </div>
                        <svg className="w-6 h-6 text-[#69E6A6] group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>

                    {verificationStatus !== 'verified' ? (
                      <Link
                        href="/dashboard/provider/verification"
                        className="group rounded-2xl bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 p-6 border border-yellow-500/30 hover:border-yellow-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-yellow-500/10"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-500/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-yellow-500/20">
                            <svg className="w-7 h-7 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-bold text-xl mb-1 group-hover:text-yellow-400 transition-colors">Verification</h3>
                            <p className="text-white/70 text-sm">Complete your profile verification</p>
                          </div>
                          <svg className="w-6 h-6 text-yellow-400 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>
                    ) : (
                      <Link
                        href="/contact"
                        className="group rounded-2xl bg-gradient-to-br from-[#1C3D5B] to-[#0A2640] p-6 border border-white/10 hover:border-[#4A9EFF]/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#4A9EFF]/10"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#4A9EFF]/20 to-[#4A9EFF]/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-[#4A9EFF]/20">
                            <svg className="w-7 h-7 text-[#4A9EFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-bold text-xl mb-1 group-hover:text-[#4A9EFF] transition-colors">Contact Us</h3>
                            <p className="text-white/70 text-sm">Get help anytime you need it</p>
                          </div>
                          <svg className="w-6 h-6 text-[#4A9EFF] group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Upcoming Jobs & Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Upcoming Jobs */}
                  <SectionCard
                    title="Upcoming Jobs"
                    subtitle={`Your next ${upcomingBookings.length > 0 ? upcomingBookings.length : 'scheduled'} job${upcomingBookings.length !== 1 ? 's' : ''}`}
                    actionLink={{
                      href: '/dashboard/provider/bookings',
                      text: 'View All Jobs',
                    }}
                  >
                    {upcomingBookings.length === 0 ? (
                      <div className="text-center py-12">
                        <svg className="w-16 h-16 text-white/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className="text-white/60">No upcoming jobs</p>
                        <p className="text-white/40 text-sm mt-1">Bookings will appear here</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {upcomingBookings.map((booking) => (
                          <BookingCard
                            key={booking.id}
                            booking={booking}
                            href="/dashboard/provider/bookings"
                            showUser={true}
                          />
                        ))}
                      </div>
                    )}
                  </SectionCard>

                  {/* Recent Activity */}
                  <SectionCard
                    title="Recent Activity"
                    subtitle={`Your latest ${recentBookings.length > 0 ? recentBookings.length : 'booking'} update${recentBookings.length !== 1 ? 's' : ''}`}
                    actionLink={{
                      href: '/dashboard/provider/bookings',
                      text: 'View All Jobs',
                    }}
                  >
                    {recentBookings.length === 0 ? (
                      <div className="text-center py-12">
                        <svg className="w-16 h-16 text-white/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-white/60">No recent activity</p>
                        <p className="text-white/40 text-sm mt-1">Your booking updates will appear here</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {recentBookings.map((booking) => (
                          <BookingCard
                            key={booking.id}
                            booking={booking}
                            href="/dashboard/provider/bookings"
                            showUser={true}
                          />
                        ))}
                      </div>
                    )}
                  </SectionCard>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
