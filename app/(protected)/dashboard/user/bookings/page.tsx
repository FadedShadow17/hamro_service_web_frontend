'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, isUser } from '@/lib/auth/auth.storage';
import { RouteGuard } from '@/components/auth/RouteGuard';
import { getMyBookings, cancelBooking, type Booking, type BookingStatus } from '@/lib/api/bookings.api';
import { HttpError } from '@/lib/api/http';
import { useToastContext } from '@/providers/ToastProvider';

export default function UserBookingsPage() {
  const router = useRouter();
  const toast = useToastContext();
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<BookingStatus | 'ALL'>('ALL');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const currentUser = getUser();
    if (!currentUser || !isUser(currentUser)) {
      router.replace('/dashboard');
      return;
    }
    
    setUser(currentUser);
    
    // Wrap in async function to properly handle errors and prevent Next.js error overlay
    const loadData = async () => {
      try {
        await loadBookings();
      } catch (err) {
        // Error is already handled in loadBookings, but we catch here
        // to prevent unhandled promise rejection that triggers Next.js error overlay
        // The error state is set in loadBookings, so we don't need to do anything here
        if (err instanceof HttpError && err.status === 403) {
          // This is an expected error (insufficient permissions), already handled
          return;
        }
      }
    };
    
    loadData();

    // Refetch bookings when page gains focus (to sync with provider actions)
    const handleFocus = () => {
      loadData();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, filter]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const status = filter === 'ALL' ? undefined : filter;
      const data = await getMyBookings(status);
      setBookings(data);
    } catch (err) {
      // Prevent error from propagating to Next.js error overlay
      if (err instanceof HttpError) {
        // Handle 403 (insufficient permissions) gracefully
        if (err.status === 403) {
          const errorMsg = 'You do not have permission to view bookings. Please ensure you are logged in as a user.';
          setError(errorMsg);
          toast.error('Insufficient permissions. Please log in as a user to view your bookings.');
          // Redirect to dashboard after showing error
          setTimeout(() => router.push('/dashboard'), 2000);
        } else {
          // For other errors, just set error state (no toast to avoid duplication)
          setError(err.message || 'Failed to load bookings. Please try again.');
        }
      } else {
        setError('Failed to load bookings. Please try again.');
      }
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await cancelBooking(bookingId);
      toast.success('Booking cancelled successfully');
      await loadBookings(); // Refetch to update UI immediately
    } catch (err) {
      if (err instanceof HttpError) {
        // Handle ownership error
        if (err.status === 403 && (err.code === 'UNAUTHORIZED_USER' || err.message.includes('does not belong'))) {
          toast.error('This booking does not belong to you. Please refresh the page.');
          setTimeout(() => loadBookings(), 1000);
        } else {
          toast.error(err.message || 'Failed to cancel booking. Please try again.');
        }
      } else {
        console.error('Unexpected error cancelling booking:', err);
        toast.error('An unexpected error occurred. Please try again.');
      }
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'CONFIRMED':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'COMPLETED':
        return 'bg-[#69E6A6]/20 text-[#69E6A6] border-[#69E6A6]/50';
      case 'DECLINED':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'CANCELLED':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      default:
        return 'bg-white/10 text-white border-white/20';
    }
  };

  if (!mounted || !user || !isUser(user)) {
    return (
      <RouteGuard requireAuth redirectTo="/login">
        <div className="flex min-h-screen items-center justify-center bg-[#0A2640]">
          <div className="text-lg text-white/70">Loading...</div>
        </div>
      </RouteGuard>
    );
  }

  const filteredBookings = filter === 'ALL' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <RouteGuard requireAuth redirectTo="/login">
      <div className="min-h-screen bg-[#0A2640]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                My Bookings
              </h1>
              <p className="text-white/70">View and manage your service bookings</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-3 mb-6">
              {(['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'DECLINED', 'CANCELLED'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filter === status
                      ? 'bg-[#69E6A6] text-[#0A2640]'
                      : 'bg-[#1C3D5B] text-white/70 hover:text-white hover:bg-[#1C3D5B]/80 border border-white/10'
                  }`}
                >
                  {status === 'ALL' ? 'All' : status}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="rounded-2xl bg-[#1C3D5B] border border-white/10 p-6 animate-pulse">
                    <div className="h-6 bg-white/10 rounded mb-4 w-1/3"></div>
                    <div className="h-4 bg-white/10 rounded mb-2"></div>
                    <div className="h-4 bg-white/10 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="rounded-2xl bg-red-500/20 border border-red-500/50 p-6 text-center">
                <p className="text-red-400 mb-4 text-lg font-semibold">{error}</p>
                <button
                  onClick={loadBookings}
                  className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-400 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="rounded-2xl bg-[#1C3D5B] border border-white/10 p-12 text-center">
                <svg className="w-16 h-16 text-white/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-white/70 text-lg">No bookings found</p>
                <p className="text-white/50 text-sm mt-2">
                  {filter === 'ALL' ? 'You don\'t have any bookings yet.' : `No ${filter.toLowerCase()} bookings.`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-2xl bg-[#1C3D5B] border border-white/10 p-6 hover:border-[#69E6A6]/50 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                          <span className="text-white/50 text-sm">
                            Booking #{booking.id.slice(-8)}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {/* Status Message & Timeline */}
                          <div className="mb-3 space-y-2">
                            {booking.status === 'PENDING' && (
                              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                                <svg className="w-4 h-4 text-yellow-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-yellow-400 text-sm font-medium">Waiting for provider response</span>
                              </div>
                            )}
                            {booking.status === 'CONFIRMED' && (
                              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30">
                                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-blue-400 text-sm font-medium">Accepted by provider</span>
                              </div>
                            )}
                            {booking.status === 'DECLINED' && (
                              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30">
                                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-red-400 text-sm font-medium">Declined by provider</span>
                              </div>
                            )}
                            {booking.status === 'COMPLETED' && (
                              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#69E6A6]/10 border border-[#69E6A6]/30">
                                <svg className="w-4 h-4 text-[#69E6A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-[#69E6A6] text-sm font-medium">Service completed</span>
                              </div>
                            )}
                            {booking.status === 'CANCELLED' && (
                              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-500/10 border border-gray-500/30">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span className="text-gray-400 text-sm font-medium">Cancelled</span>
                              </div>
                            )}
                            
                            {/* Status Timeline */}
                            <div className="flex items-center gap-2 text-xs text-white/50 mt-2">
                              <span className={booking.status !== 'PENDING' ? 'text-[#69E6A6]' : ''}>Requested</span>
                              {booking.status !== 'PENDING' && (
                                <>
                                  <span>→</span>
                                  <span className={booking.status === 'CONFIRMED' || booking.status === 'COMPLETED' ? 'text-[#69E6A6]' : booking.status === 'DECLINED' ? 'text-red-400' : ''}>
                                    {booking.status === 'CONFIRMED' || booking.status === 'COMPLETED' ? 'Accepted' : booking.status === 'DECLINED' ? 'Declined' : ''}
                                  </span>
                                </>
                              )}
                              {booking.status === 'COMPLETED' && (
                                <>
                                  <span>→</span>
                                  <span className="text-[#69E6A6]">Completed</span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-white">
                            <svg className="w-5 h-5 text-[#69E6A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-semibold">{new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            <span className="text-white/70">at</span>
                            <span className="font-semibold">{booking.timeSlot}</span>
                          </div>
                          <div className="flex items-center gap-2 text-white/70">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{booking.area}, Kathmandu</span>
                          </div>
                          {booking.service ? (
                            <div className="flex items-center gap-2 text-white/80">
                              <svg className="w-5 h-5 text-[#69E6A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span className="font-semibold">{booking.service.name}</span>
                              {booking.service.basePrice && (
                                <span className="text-[#69E6A6]">• Rs. {booking.service.basePrice.toLocaleString()}</span>
                              )}
                            </div>
                          ) : (
                            <div className="text-white/50 text-sm">
                              Service ID: {booking.serviceId}
                            </div>
                          )}
                          {booking.provider && (
                            <div className="flex items-center gap-2 text-white/80 mt-2 pt-2 border-t border-white/10">
                              <svg className="w-5 h-5 text-[#69E6A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span className="font-medium">
                                Provider: {booking.provider.fullName || booking.provider.serviceRole || 'Provider'}
                              </span>
                              {booking.provider.serviceRole && (
                                <span className="text-white/50 text-sm">({booking.provider.serviceRole})</span>
                              )}
                              {booking.provider.phone && (
                                <a
                                  href={`tel:${booking.provider.phone}`}
                                  className="text-[#69E6A6] hover:text-[#5dd195] transition-colors flex items-center gap-1 ml-2"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                  </svg>
                                  {booking.provider.phone}
                                </a>
                              )}
                            </div>
                          )}
                          {!booking.provider && booking.providerId && (
                            <div className="text-white/50 text-sm mt-2 pt-2 border-t border-white/10">
                              Provider ID: {booking.providerId}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                          <button
                            onClick={() => handleCancel(booking.id)}
                            className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 rounded-lg font-semibold transition-colors"
                          >
                            Cancel Booking
                          </button>
                        )}
                        {(booking.status === 'COMPLETED' || booking.status === 'DECLINED' || booking.status === 'CANCELLED') && (
                          <span className="px-6 py-2 text-white/50 text-sm">
                            {booking.status === 'COMPLETED' ? 'Completed' : booking.status === 'DECLINED' ? 'Declined' : 'Cancelled'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}

