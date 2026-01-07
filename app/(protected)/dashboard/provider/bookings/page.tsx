'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, isProvider } from '@/lib/auth/auth.storage';
import { RouteGuard } from '@/components/auth/RouteGuard';
import { getProviderBookings, acceptBooking, declineBooking, completeBooking, cancelProviderBooking, type Booking, type BookingStatus } from '@/lib/api/bookings.api';
import { getVerificationStatus, type VerificationData } from '@/lib/api/provider-verification.api';
import { HttpError } from '@/lib/api/http';
import { useToastContext } from '@/providers/ToastProvider';
import { isCategoryMatch } from '@/lib/utils/category-matcher';

export default function ProviderBookingsPage() {
  const router = useRouter();
  const toast = useToastContext();
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isProviderProfileMissing, setIsProviderProfileMissing] = useState(false);
  const [filter, setFilter] = useState<BookingStatus | 'ALL'>('ALL');
  const [mounted, setMounted] = useState(false);
  const [actionLoading, setActionLoading] = useState<Record<string, string>>({}); // Track which action is loading for which booking
  const [providerVerification, setProviderVerification] = useState<VerificationData | null>(null);

  useEffect(() => {
    setMounted(true);
    const currentUser = getUser();
    if (!currentUser || !isProvider(currentUser)) {
      router.replace('/dashboard');
      return;
    }
    
    setUser(currentUser);
    
    // Wrap in async function to properly handle errors and prevent Next.js error overlay
    const loadData = async () => {
      try {
        // Load verification status to get serviceRole for category checking
        try {
          const verification = await getVerificationStatus();
          setProviderVerification(verification);
        } catch (err) {
          // Verification might not exist yet, that's okay
          console.info('Verification status not available:', err);
        }
        await loadBookings();
      } catch (err) {
        // Error is already handled in loadBookings, but we catch here
        // to prevent unhandled promise rejection that triggers Next.js error overlay
        // The error state is set in loadBookings, so we don't need to do anything here
        if (err instanceof HttpError && err.status === 404 && err.message.includes('Provider profile not found')) {
          // This is an expected error, already handled in loadBookings
          return;
        }
      }
    };
    
    loadData();

    // Refetch bookings when page gains focus (to sync with any external changes)
    const handleFocus = () => {
      loadBookings();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [router, filter]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError('');
      setIsProviderProfileMissing(false);
      const status = filter === 'ALL' ? undefined : filter;
      const data = await getProviderBookings(status);
      setBookings(data);
    } catch (err) {
      // Prevent error from propagating to Next.js error overlay
      if (err instanceof HttpError) {
        if (err.status === 404 && err.message.includes('Provider profile not found')) {
          // Silently handle - provider needs to complete verification first
          setBookings([]);
          setIsProviderProfileMissing(true);
          // Don't show error message, just show empty state with link to verification
          return;
        } else {
          setError(err.message || 'Failed to load bookings. Please try again.');
          setIsProviderProfileMissing(false);
        }
      } else {
        setError('Failed to load bookings. Please try again.');
        setIsProviderProfileMissing(false);
      }
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (bookingId: string) => {
    setActionLoading({ ...actionLoading, [bookingId]: 'accept' });
    try {
      await acceptBooking(bookingId);
      toast.success('Booking accepted successfully');
      await loadBookings(); // Refetch to update UI immediately
    } catch (err) {
      if (err instanceof HttpError) {
        // Handle booking already assigned to another provider
        if (err.status === 409 && err.code === 'BOOKING_ALREADY_ASSIGNED') {
          toast.info('Another provider has already accepted this booking. Refreshing...');
          setTimeout(() => loadBookings(), 1000);
        }
        // Handle verification requirement
        else if (err.status === 403 && err.message.includes('verification')) {
          toast.error(`${err.message} Please complete your verification to accept bookings.`);
          setTimeout(() => router.push('/dashboard/provider/verification'), 2000);
        } 
        // Handle ownership error
        else if (err.status === 403 && (err.code === 'BOOKING_NOT_ASSIGNED' || err.code === 'UNAUTHORIZED_PROVIDER' || err.message.includes('not assigned'))) {
          toast.error('This booking is not assigned to you. Please refresh the page.');
          setTimeout(() => loadBookings(), 1000);
        }
        // Handle category restriction error
        else if (err.status === 403 && err.code === 'CATEGORY_NOT_ALLOWED') {
          toast.error(err.message || 'You are not verified for this service category.');
        }
        // Handle other errors
        else {
          toast.error(err.message || 'Failed to accept booking. Please try again.');
        }
      } else {
        console.error('Unexpected error accepting booking:', err);
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setActionLoading((prev) => {
        const next = { ...prev };
        delete next[bookingId];
        return next;
      });
    }
  };

  const handleDecline = async (bookingId: string) => {
    if (!confirm('Are you sure you want to decline this booking?')) return;
    setActionLoading({ ...actionLoading, [bookingId]: 'decline' });
    try {
      await declineBooking(bookingId);
      toast.success('Booking declined successfully');
      await loadBookings(); // Refetch to update UI immediately
    } catch (err) {
      if (err instanceof HttpError) {
        // Handle ownership error
        if (err.status === 403 && (err.code === 'BOOKING_NOT_ASSIGNED' || err.code === 'UNAUTHORIZED_PROVIDER' || err.message.includes('not assigned'))) {
          toast.error('This booking is not assigned to you. Please refresh the page.');
          setTimeout(() => loadBookings(), 1000);
        }
        // Handle category restriction error
        else if (err.status === 403 && err.code === 'CATEGORY_NOT_ALLOWED') {
          toast.error(err.message || 'You are not verified for this service category.');
        } else {
          toast.error(err.message || 'Failed to decline booking. Please try again.');
        }
      } else {
        console.error('Unexpected error declining booking:', err);
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setActionLoading((prev) => {
        const next = { ...prev };
        delete next[bookingId];
        return next;
      });
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) return;
    setActionLoading({ ...actionLoading, [bookingId]: 'cancel' });
    try {
      await cancelProviderBooking(bookingId);
      toast.success('Booking cancelled successfully');
      await loadBookings(); // Refetch to update UI immediately
    } catch (err) {
      if (err instanceof HttpError) {
        // Handle ownership error
        if (err.status === 403 && (err.code === 'BOOKING_NOT_ASSIGNED' || err.code === 'UNAUTHORIZED_PROVIDER' || err.message.includes('not assigned'))) {
          toast.error('This booking is not assigned to you. Please refresh the page.');
          setTimeout(() => loadBookings(), 1000);
        }
        // Handle invalid status transition
        else if (err.status === 400 && err.code === 'INVALID_STATUS_TRANSITION') {
          toast.error(err.message || 'Cannot cancel this booking. Only CONFIRMED bookings can be cancelled.');
        }
        // Handle other errors
        else {
          toast.error(err.message || 'Failed to cancel booking. Please try again.');
        }
      } else {
        console.error('Unexpected error cancelling booking:', err);
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setActionLoading((prev) => {
        const next = { ...prev };
        delete next[bookingId];
        return next;
      });
    }
  };

  const handleComplete = async (bookingId: string) => {
    if (!confirm('Mark this booking as completed?')) return;
    setActionLoading({ ...actionLoading, [bookingId]: 'complete' });
    try {
      await completeBooking(bookingId);
      toast.success('Service marked as completed');
      await loadBookings(); // Refetch to update UI immediately
    } catch (err) {
      if (err instanceof HttpError) {
        // Handle verification requirement
        if (err.status === 403 && err.message.includes('verification')) {
          toast.error(`${err.message} Please complete your verification to mark bookings as complete.`);
          setTimeout(() => router.push('/dashboard/provider/verification'), 2000);
        }
        // Handle ownership error
        else if (err.status === 403 && (err.code === 'BOOKING_NOT_ASSIGNED' || err.code === 'UNAUTHORIZED_PROVIDER' || err.message.includes('not assigned'))) {
          toast.error('This booking is not assigned to you. Please refresh the page.');
          setTimeout(() => loadBookings(), 1000);
        }
        // Handle category restriction error
        else if (err.status === 403 && err.code === 'CATEGORY_NOT_ALLOWED') {
          toast.error(err.message || 'You are not verified for this service category.');
        }
        // Handle other errors
        else {
          toast.error(err.message || 'Failed to complete booking. Please try again.');
        }
      } else {
        console.error('Unexpected error completing booking:', err);
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setActionLoading((prev) => {
        const next = { ...prev };
        delete next[bookingId];
        return next;
      });
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

  // Check if provider can accept this booking (category must match)
  // Decline is always allowed regardless of category
  const canProviderAcceptBooking = (booking: Booking): { canAccept: boolean; reason?: string } => {
    // NEW LOGIC: Can accept if booking is unassigned (providerId is null) and category matches
    // If booking is already assigned (providerId is set), backend will handle ownership check
    
    // If booking is already assigned to another provider, backend will return 409
    // Frontend can't check this without provider profile ID, so we allow the attempt
    // Backend will enforce the check
    
    // Check if provider has a verified role
    if (!providerVerification?.serviceRole) {
      return { canAccept: false, reason: 'You need to complete verification with a service role to accept bookings.' };
    }

    // For unassigned bookings (providerId is null), check category match
    if (!booking.providerId && booking.service) {
      const categoryMatches = isCategoryMatch(providerVerification.serviceRole, booking.service.name);
      
      if (!categoryMatches) {
        return {
          canAccept: false,
          reason: `You're verified as ${providerVerification.serviceRole}. This booking is for ${booking.service.name}. You can decline this booking if needed.`,
        };
      }
    }

    // If booking is already assigned (providerId is set), allow attempt
    // Backend will check if it's assigned to this provider
    // If assigned to different provider, backend returns 409 BOOKING_ALREADY_ASSIGNED
    
    return { canAccept: true };
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

  const filteredBookings = filter === 'ALL' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <RouteGuard requireAuth redirectTo="/login">
      <div className="min-h-screen bg-[#0A2640]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                My Jobs
              </h1>
              <p className="text-white/70">Manage your booking requests</p>
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
            ) : isProviderProfileMissing ? (
              <div className="rounded-2xl bg-[#1C3D5B] border border-white/10 p-12 text-center">
                <div className="mb-6">
                  <svg className="w-16 h-16 text-[#69E6A6] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Complete Your Verification</h3>
                <p className="text-white/70 mb-6 max-w-md mx-auto">
                  Fill out your verification form to start receiving and accepting service bookings from users.
                </p>
                <button
                  onClick={() => router.push('/dashboard/provider/verification')}
                  className="px-6 py-3 bg-[#69E6A6] hover:bg-[#5dd195] text-[#0A2640] rounded-lg font-semibold transition-colors"
                >
                  Complete Verification
                </button>
              </div>
            ) : error ? (
              <div className="rounded-2xl bg-red-500/20 border border-red-500/50 p-6 text-center">
                <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
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
                          {booking.user && (
                            <div className="flex items-center gap-2 text-white/80 mt-2 pt-2 border-t border-white/10">
                              <svg className="w-5 h-5 text-[#69E6A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span className="font-medium">Customer: {booking.user.name}</span>
                              {booking.user.phone && (
                                <a
                                  href={`tel:${booking.user.phone}`}
                                  className="text-[#69E6A6] hover:text-[#5dd195] transition-colors flex items-center gap-1"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                  </svg>
                                  {booking.user.phone}
                                </a>
                              )}
                              {!booking.user.phone && (
                                <span className="text-white/50 text-sm">({booking.user.email})</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        {booking.status === 'PENDING' && (() => {
                          const { canAccept, reason } = canProviderAcceptBooking(booking);
                          return (
                            <>
                              {canAccept ? (
                                <button
                                  onClick={() => handleAccept(booking.id)}
                                  disabled={actionLoading[booking.id] === 'accept'}
                                  className="px-6 py-2 bg-[#69E6A6] hover:bg-[#5dd195] text-[#0A2640] rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {actionLoading[booking.id] === 'accept' ? 'Accepting...' : 'Accept'}
                                </button>
                              ) : (
                                <div className="flex flex-col gap-2">
                                  <button
                                    disabled
                                    className="px-6 py-2 bg-gray-500/20 border border-gray-500/50 text-gray-400 rounded-lg font-semibold cursor-not-allowed"
                                    title={reason}
                                  >
                                    Accept
                                  </button>
                                  {reason && (
                                    <span className="px-3 py-1.5 bg-orange-500/20 border border-orange-500/50 text-orange-400 rounded-lg text-xs font-medium max-w-xs">
                                      {reason}
                                    </span>
                                  )}
                                </div>
                              )}
                              {/* Decline is always allowed */}
                              <button
                                onClick={() => handleDecline(booking.id)}
                                disabled={actionLoading[booking.id] === 'decline'}
                                className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {actionLoading[booking.id] === 'decline' ? 'Declining...' : 'Decline'}
                              </button>
                            </>
                          );
                        })()}
                        {booking.status === 'CONFIRMED' && (
                          <>
                            <button
                              onClick={() => handleComplete(booking.id)}
                              disabled={actionLoading[booking.id] === 'complete' || actionLoading[booking.id] === 'cancel'}
                              className="px-6 py-2 bg-[#4A9EFF] hover:bg-[#3a8ee0] text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {actionLoading[booking.id] === 'complete' ? 'Completing...' : 'Mark Complete'}
                            </button>
                            <button
                              onClick={() => handleCancel(booking.id)}
                              disabled={actionLoading[booking.id] === 'cancel' || actionLoading[booking.id] === 'complete'}
                              className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {actionLoading[booking.id] === 'cancel' ? 'Cancelling...' : 'Cancel'}
                            </button>
                          </>
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

