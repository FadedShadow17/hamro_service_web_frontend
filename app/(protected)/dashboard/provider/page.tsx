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

  const getStatusColor = (status: BookingStatus) => {
    const colors: Record<BookingStatus, string> = {
      PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      CONFIRMED: 'bg-[#69E6A6]/20 text-[#69E6A6] border-[#69E6A6]/50',
      COMPLETED: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      DECLINED: 'bg-red-500/20 text-red-400 border-red-500/50',
      CANCELLED: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
    };
    return colors[status] || 'bg-white/10 text-white/70 border-white/20';
  };

  const getVerificationBadge = () => {
    if (!verificationStatus) return null;
    const badges: Record<string, { text: string; color: string; icon: string }> = {
      NOT_SUBMITTED: { text: 'Not Verified', color: 'bg-gray-500/20 text-gray-400 border-gray-500/50', icon: '⚠️' },
      PENDING_REVIEW: { text: 'Pending Review', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50', icon: '⏳' },
      APPROVED: { text: 'Verified', color: 'bg-[#69E6A6]/20 text-[#69E6A6] border-[#69E6A6]/50', icon: '✅' },
      REJECTED: { text: 'Rejected', color: 'bg-red-500/20 text-red-400 border-red-500/50', icon: '❌' },
    };
    const badge = badges[verificationStatus];
    if (!badge) return null;
    return (
      <div className="flex items-center gap-2">
        <span className={`px-4 py-2 rounded-full text-sm font-semibold border flex items-center gap-2 ${badge.color}`}>
          <span>{badge.icon}</span>
          <span>{badge.text}</span>
        </span>
        {verificationStatus === 'APPROVED' && (
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
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    Welcome back, {user.name}! 👋
                  </h1>
                  <p className="text-white/70">Manage your bookings and services</p>
                </div>
                {getVerificationBadge()}
              </div>
            </div>

            {loading ? (
              <LoadingSkeleton />
            ) : (
              <>
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Link
                    href="/dashboard/provider/bookings?status=PENDING"
                    className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-500/30 via-yellow-500/15 to-yellow-500/5 p-6 border border-yellow-500/40 hover:border-yellow-500/60 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-yellow-500/20"
                  >
                    {/* Animated background pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-500 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-[#f59e0b] flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-yellow-500/30">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
                        </div>
                        <svg className="w-6 h-6 text-yellow-400 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-white font-bold text-3xl mb-1 group-hover:text-yellow-400 transition-colors">{pendingCount}</h3>
                        <p className="text-white/80 text-sm font-medium">Pending Requests</p>
                        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mt-2">
                          <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${Math.min((pendingCount / 10) * 100, 100)}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link
                    href="/dashboard/provider/bookings?status=CONFIRMED"
                    className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#69E6A6]/30 via-[#69E6A6]/15 to-[#69E6A6]/5 p-6 border border-[#69E6A6]/40 hover:border-[#69E6A6]/60 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#69E6A6]/20"
                  >
                    {/* Animated background pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 left-0 w-32 h-32 bg-[#69E6A6] rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                      <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#69E6A6] rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#69E6A6] to-[#5dd195] flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-[#69E6A6]/30">
                            <svg className="w-7 h-7 text-[#0A2640]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#69E6A6] rounded-full animate-pulse"></div>
                        </div>
                        <svg className="w-6 h-6 text-[#69E6A6] group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-white font-bold text-3xl mb-1 group-hover:text-[#69E6A6] transition-colors">{confirmedCount}</h3>
                        <p className="text-white/80 text-sm font-medium">Confirmed</p>
                        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mt-2">
                          <div className="h-full bg-[#69E6A6] rounded-full" style={{ width: `${Math.min((confirmedCount / 10) * 100, 100)}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link
                    href="/dashboard/provider/bookings?status=COMPLETED"
                    className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500/30 via-blue-500/15 to-blue-500/5 p-6 border border-blue-500/40 hover:border-blue-500/60 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20"
                  >
                    {/* Animated background pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-[#3b82f6] flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-blue-500/30">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                        </div>
                        <svg className="w-6 h-6 text-blue-400 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-white font-bold text-3xl mb-1 group-hover:text-blue-400 transition-colors">{completedCount}</h3>
                        <p className="text-white/80 text-sm font-medium">Completed</p>
                        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mt-2">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min((completedCount / 10) * 100, 100)}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link
                    href="/dashboard/provider/bookings"
                    className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#4A9EFF]/30 via-[#4A9EFF]/15 to-[#4A9EFF]/5 p-6 border border-[#4A9EFF]/40 hover:border-[#4A9EFF]/60 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#4A9EFF]/20"
                  >
                    {/* Animated background pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 left-0 w-32 h-32 bg-[#4A9EFF] rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                      <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#4A9EFF] rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4A9EFF] to-[#3a8eef] flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-[#4A9EFF]/30">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          </div>
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#4A9EFF] rounded-full animate-pulse"></div>
                        </div>
                        <svg className="w-6 h-6 text-[#4A9EFF] group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-white font-bold text-3xl mb-1 group-hover:text-[#4A9EFF] transition-colors">{totalCount}</h3>
                        <p className="text-white/80 text-sm font-medium">Total Bookings</p>
                        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mt-2">
                          <div className="h-full bg-[#4A9EFF] rounded-full" style={{ width: `${Math.min((totalCount / 20) * 100, 100)}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <Link
                    href="/dashboard/provider/bookings"
                    className="group rounded-2xl bg-[#1C3D5B] p-6 border border-white/10 hover:border-[#69E6A6]/50 transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-xl bg-[#69E6A6]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="w-7 h-7 text-[#69E6A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-xl mb-1">My Jobs</h3>
                        <p className="text-white/70 text-sm">View and manage booking requests</p>
                      </div>
                      <svg className="w-6 h-6 text-[#69E6A6] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>

                  <Link
                    href="/contact"
                    className="group rounded-2xl bg-[#1C3D5B] p-6 border border-white/10 hover:border-[#4A9EFF]/50 transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-xl bg-[#4A9EFF]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="w-7 h-7 text-[#4A9EFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-xl mb-1">Contact Us</h3>
                        <p className="text-white/70 text-sm">Get help anytime you need it</p>
                      </div>
                      <svg className="w-6 h-6 text-[#4A9EFF] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                </div>

                {/* Upcoming Jobs & Recent Bookings */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Upcoming Jobs */}
                  <div className="rounded-2xl bg-[#1C3D5B] border border-white/10 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-white">Upcoming Jobs</h2>
                      <Link
                        href="/dashboard/provider/bookings"
                        className="text-[#69E6A6] hover:text-[#5dd195] text-sm font-medium transition-colors"
                      >
                        View All →
                      </Link>
                    </div>
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
                          <Link
                            key={booking.id}
                            href="/dashboard/provider/bookings"
                            className="block rounded-xl bg-[#0A2640] border border-white/5 p-4 hover:border-[#69E6A6]/30 transition-all"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                                {booking.status}
                              </span>
                              <span className="text-white/60 text-sm">
                                {new Date(`${booking.date}T${booking.timeSlot}`).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                            <p className="text-white font-medium mb-1">Booking #{booking.id.slice(0, 8)}</p>
                            {booking.service ? (
                              <p className="text-white/80 text-sm font-medium mb-1">{booking.service.name}</p>
                            ) : null}
                            <p className="text-white/60 text-sm">{booking.area}</p>
                            <p className="text-white/60 text-sm">{booking.timeSlot}</p>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recent Bookings */}
                  <div className="rounded-2xl bg-[#1C3D5B] border border-white/10 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-white">Recent Activity</h2>
                      <Link
                        href="/dashboard/provider/bookings"
                        className="text-[#69E6A6] hover:text-[#5dd195] text-sm font-medium transition-colors"
                      >
                        View All →
                      </Link>
                    </div>
                    {recentBookings.length === 0 ? (
                      <div className="text-center py-12">
                        <svg className="w-16 h-16 text-white/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-white/60">No recent activity</p>
                        <p className="text-white/40 text-sm mt-1">Your bookings will appear here</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {recentBookings.map((booking) => (
                          <Link
                            key={booking.id}
                            href="/dashboard/provider/bookings"
                            className="block rounded-xl bg-[#0A2640] border border-white/5 p-4 hover:border-[#69E6A6]/30 transition-all"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                                {booking.status}
                              </span>
                              <span className="text-white/60 text-sm">
                                {new Date(booking.updatedAt || booking.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                            <p className="text-white font-medium mb-1">Booking #{booking.id.slice(0, 8)}</p>
                            {booking.service ? (
                              <p className="text-white/80 text-sm font-medium mb-1">{booking.service.name}</p>
                            ) : null}
                            <p className="text-white/60 text-sm">{booking.area}</p>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
