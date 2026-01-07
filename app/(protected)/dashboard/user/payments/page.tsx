'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, isUser } from '@/lib/auth/auth.storage';
import { RouteGuard } from '@/components/auth/RouteGuard';
import { getMyPayableBookings, payForBooking } from '@/lib/api/payments.api';
import { type Booking } from '@/lib/api/bookings.api';
import { HttpError } from '@/lib/api/http';
import { useToastContext } from '@/providers/ToastProvider';

export default function PaymentsPage() {
  const router = useRouter();
  const toast = useToastContext();
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const [payingBookingId, setPayingBookingId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const currentUser = getUser();
    if (!currentUser || !isUser(currentUser)) {
      router.replace('/dashboard');
      return;
    }
    
    setUser(currentUser);
    loadBookings();
  }, [router]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getMyPayableBookings();
      setBookings(data);
    } catch (err) {
      if (err instanceof HttpError) {
        if (err.status === 403) {
          setError('You do not have permission to view payments. Please ensure you are logged in as a user.');
          toast.error('Insufficient permissions. Please log in as a user to view payments.');
          setTimeout(() => router.push('/dashboard'), 2000);
        } else {
          setError(err.message || 'Failed to load payments. Please try again.');
        }
      } else {
        setError('Failed to load payments. Please try again.');
      }
      console.error('Error loading payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (bookingId: string) => {
    if (!confirm('Are you sure you want to mark this booking as paid?')) return;
    
    setPayingBookingId(bookingId);
    try {
      await payForBooking(bookingId, 'COD');
      toast.success('Payment processed successfully');
      await loadBookings(); // Refetch to update UI
    } catch (err) {
      if (err instanceof HttpError) {
        if (err.status === 403 && err.code === 'UNAUTHORIZED_USER') {
          toast.error('This booking does not belong to you');
        } else if (err.status === 400 && err.code === 'INVALID_BOOKING_STATUS') {
          toast.error('Only confirmed bookings can be paid');
        } else if (err.status === 400 && err.code === 'ALREADY_PAID') {
          toast.error('This booking is already paid');
          await loadBookings(); // Refetch to update UI
        } else {
          toast.error(err.message || 'Failed to process payment. Please try again.');
        }
      } else {
        console.error('Unexpected error processing payment:', err);
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setPayingBookingId(null);
    }
  };

  const getPaymentStatusColor = (paymentStatus?: string) => {
    if (paymentStatus === 'PAID') {
      return 'bg-[#69E6A6]/20 text-[#69E6A6] border-[#69E6A6]/50';
    }
    // Default to UNPAID if not set
    return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
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

  return (
    <RouteGuard requireAuth redirectTo="/login">
      <div className="min-h-screen bg-[#0A2640]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Payments
              </h1>
              <p className="text-white/70">Pay for your confirmed bookings</p>
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
            ) : bookings.length === 0 ? (
              <div className="rounded-2xl bg-[#1C3D5B] border border-white/10 p-12 text-center">
                <svg className="w-16 h-16 text-white/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <p className="text-white/70 text-lg">No payments pending</p>
                <p className="text-white/50 text-sm mt-2">
                  You don't have any confirmed bookings that need payment.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-2xl bg-[#1C3D5B] border border-white/10 p-6 hover:border-[#69E6A6]/50 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPaymentStatusColor(booking.paymentStatus)}`}>
                            {booking.paymentStatus === 'PAID' ? 'PAID' : 'UNPAID'}
                          </span>
                          <span className="text-white/50 text-sm">
                            Booking #{booking.id.slice(-8)}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {booking.service && (
                            <div className="flex items-center gap-2 text-white/80">
                              <svg className="w-5 h-5 text-[#69E6A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span className="font-semibold">{booking.service.name}</span>
                              {booking.service.basePrice && (
                                <span className="text-[#69E6A6]">• Rs. {booking.service.basePrice.toLocaleString()}</span>
                              )}
                            </div>
                          )}
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
                          {booking.provider && (
                            <div className="flex items-center gap-2 text-white/80 mt-2 pt-2 border-t border-white/10">
                              <svg className="w-5 h-5 text-[#69E6A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span className="font-medium">
                                Provider: {booking.provider.fullName || booking.provider.serviceRole || 'Provider'}
                              </span>
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
                          {booking.paymentStatus === 'PAID' && booking.paidAt && (
                            <div className="flex items-center gap-2 text-[#69E6A6] text-sm mt-2 pt-2 border-t border-white/10">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Paid on {new Date(booking.paidAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                              {booking.paymentMethod && (
                                <span className="text-white/50">• {booking.paymentMethod}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        {(booking.paymentStatus !== 'PAID') ? (
                          <button
                            onClick={() => handlePayment(booking.id)}
                            disabled={payingBookingId === booking.id}
                            className="px-6 py-2 bg-[#69E6A6] hover:bg-[#5dd195] text-[#0A2640] rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {payingBookingId === booking.id ? 'Processing...' : 'Make Payment'}
                          </button>
                        ) : (
                          <span className="px-6 py-2 bg-[#69E6A6]/20 border border-[#69E6A6]/50 text-[#69E6A6] rounded-lg font-semibold text-center">
                            Paid
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

