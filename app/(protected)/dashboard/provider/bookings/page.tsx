'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, isProvider } from '@/lib/auth/auth.storage';
import { RouteGuard } from '@/components/auth/RouteGuard';
import { getProviderBookings, acceptBooking, declineBooking, completeBooking, type Booking, type BookingStatus } from '@/lib/api/bookings.api';
import { HttpError } from '@/lib/api/http';

export default function ProviderBookingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<BookingStatus | 'ALL'>('ALL');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const currentUser = getUser();
    if (!currentUser || !isProvider(currentUser)) {
      router.replace('/dashboard');
    } else {
      setUser(currentUser);
      loadBookings();
    }
  }, [router, filter]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const status = filter === 'ALL' ? undefined : filter;
      const data = await getProviderBookings(status);
      setBookings(data);
    } catch (err) {
      setError('Failed to load bookings. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (bookingId: string) => {
    try {
      await acceptBooking(bookingId);
      loadBookings();
    } catch (err) {
      if (err instanceof HttpError) {
        alert(err.message);
      }
    }
  };

  const handleDecline = async (bookingId: string) => {
    if (!confirm('Are you sure you want to decline this booking?')) return;
    try {
      await declineBooking(bookingId);
      loadBookings();
    } catch (err) {
      if (err instanceof HttpError) {
        alert(err.message);
      }
    }
  };

  const handleComplete = async (bookingId: string) => {
    if (!confirm('Mark this booking as completed?')) return;
    try {
      await completeBooking(bookingId);
      loadBookings();
    } catch (err) {
      if (err instanceof HttpError) {
        alert(err.message);
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
            ) : error ? (
              <div className="rounded-2xl bg-red-500/20 border border-red-500/50 p-6 text-center">
                <p className="text-red-400 mb-4">{error}</p>
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
                          <div className="text-white/50 text-sm">
                            Service ID: {booking.serviceId}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        {booking.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleAccept(booking.id)}
                              className="px-6 py-2 bg-[#69E6A6] hover:bg-[#5dd195] text-[#0A2640] rounded-lg font-semibold transition-colors"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleDecline(booking.id)}
                              className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 rounded-lg font-semibold transition-colors"
                            >
                              Decline
                            </button>
                          </>
                        )}
                        {booking.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleComplete(booking.id)}
                            className="px-6 py-2 bg-[#4A9EFF] hover:bg-[#3a8ee0] text-white rounded-lg font-semibold transition-colors"
                          >
                            Mark Complete
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

