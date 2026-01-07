'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, isUser } from '@/lib/auth/auth.storage';
import { RouteGuard } from '@/components/auth/RouteGuard';
import { getServices, type Service } from '@/lib/api/services.api';
import { getMyBookings, type Booking } from '@/lib/api/bookings.api';
import { ServicesGrid } from '@/components/services/ServicesGrid';
import Link from 'next/link';

export default function UserDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
    const currentUser = getUser();
    if (!currentUser || !isUser(currentUser)) {
      router.replace('/dashboard');
    } else {
      setUser(currentUser);
      loadData();
    }
  }, [router]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch services - this is critical, so we'll show error if it fails
      let servicesData: Service[] = [];
      let servicesError: string | null = null;
      
      try {
        servicesData = await getServices(true);
      } catch (servicesErr) {
        console.error('Error loading services:', servicesErr);
        servicesError = servicesErr instanceof Error ? servicesErr.message : 'Failed to load services';
        
        // Try without active filter as fallback
        try {
          servicesData = await getServices();
          servicesError = null; // Clear error if fallback succeeds
        } catch (fallbackErr) {
          console.error('Error loading all services:', fallbackErr);
          // Keep the original error
        }
      }

      // If services failed to load, show error but continue loading other data
      if (servicesError && servicesData.length === 0) {
        setError(servicesError);
      }

      // Fetch bookings (optional - don't block on error)
      let bookingsData: Booking[] = [];
      try {
        bookingsData = await getMyBookings();
      } catch (bookingsErr) {
        console.warn('Bookings not available (this is normal for new users):', bookingsErr);
        // Silently fail - bookings are optional and might fail for new users
      }

      // Always set the data, even if some parts failed
      setServices(servicesData);
      setBookings(bookingsData);
      
      // Only show error if services couldn't be loaded
      if (servicesError && servicesData.length === 0) {
        setError(servicesError);
      } else if (servicesError) {
        // Services loaded with fallback, clear any previous error
        setError('');
      }
    } catch (err) {
      // This should only catch unexpected errors
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data. Please try again.';
      setError(errorMessage);
      console.error('Unexpected load data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = useMemo(() => {
    let filtered = services;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [services, searchQuery]);

  const pendingBookings = bookings.filter((b) => b.status === 'PENDING' || b.status === 'CONFIRMED');
  const completedBookings = bookings.filter((b) => b.status === 'COMPLETED');

  // Show loading state until mounted and user is verified
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
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Welcome back, {user.name}! 👋
              </h1>
              <p className="text-white/70">Browse and book services for your home</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Link
                href="/dashboard/user/bookings"
                className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#69E6A6]/30 via-[#69E6A6]/15 to-[#69E6A6]/5 p-6 border border-[#69E6A6]/40 hover:border-[#69E6A6]/60 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#69E6A6]/20"
              >
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#69E6A6] rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#69E6A6] rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#69E6A6] to-[#5dd195] flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-[#69E6A6]/30">
                        <svg className="w-7 h-7 text-[#0A2640]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#69E6A6] rounded-full animate-pulse"></div>
                    </div>
                    <svg className="w-6 h-6 text-[#69E6A6] group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-white font-bold text-3xl mb-1 group-hover:text-[#69E6A6] transition-colors">{pendingBookings.length}</h3>
                    <p className="text-white/80 text-sm font-medium">Active Bookings</p>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-[#69E6A6] rounded-full" style={{ width: `${Math.min((pendingBookings.length / 10) * 100, 100)}%` }}></div>
                    </div>
                  </div>
                </div>
              </Link>

              <Link
                href="/dashboard/user/bookings?status=COMPLETED"
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#4A9EFF] rounded-full animate-pulse"></div>
                    </div>
                    <svg className="w-6 h-6 text-[#4A9EFF] group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-white font-bold text-3xl mb-1 group-hover:text-[#4A9EFF] transition-colors">{completedBookings.length}</h3>
                    <p className="text-white/80 text-sm font-medium">Completed</p>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-[#4A9EFF] rounded-full" style={{ width: `${Math.min((completedBookings.length / 10) * 100, 100)}%` }}></div>
                    </div>
                  </div>
                </div>
              </Link>

              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFA500]/30 via-[#FFA500]/15 to-[#FFA500]/5 p-6 border border-[#FFA500]/40 hover:border-[#FFA500]/60 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#FFA500]/20">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFA500] rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#FFA500] rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
                </div>
                
                <div className="relative z-10">
                  <div className="mb-4">
                    <div className="relative inline-block">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFA500] to-[#ff9500] flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-[#FFA500]/30">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FFA500] rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-white font-bold text-3xl mb-1 group-hover:text-[#FFA500] transition-colors">{services.length}</h3>
                    <p className="text-white/80 text-sm font-medium">Available Services</p>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-[#FFA500] rounded-full" style={{ width: `${Math.min((services.length / 20) * 100, 100)}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#9B59B6]/30 via-[#9B59B6]/15 to-[#9B59B6]/5 p-6 border border-[#9B59B6]/40 hover:border-[#9B59B6]/60 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#9B59B6]/20">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-[#9B59B6] rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#9B59B6] rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
                </div>
                
                <div className="relative z-10">
                  <div className="mb-4">
                    <div className="relative inline-block">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#9B59B6] to-[#8e44ad] flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-[#9B59B6]/30">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#9B59B6] rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-white font-bold text-3xl mb-1 group-hover:text-[#9B59B6] transition-colors">Rs. {services.reduce((sum, s) => sum + (s.basePrice || 0), 0).toLocaleString()}</h3>
                    <p className="text-white/80 text-sm font-medium">Total Value</p>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-[#9B59B6] rounded-full" style={{ width: `${Math.min((services.reduce((sum, s) => sum + (s.basePrice || 0), 0) / 50000) * 100, 100)}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Bookings Section */}
            {bookings.length > 0 && (
              <div className="mb-8">
                <div className="rounded-2xl bg-[#1C3D5B] border border-white/10 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1">Recent Bookings</h2>
                      <p className="text-white/70 text-sm">Your latest service bookings</p>
                    </div>
                    <Link
                      href="/dashboard/user/bookings"
                      className="text-[#69E6A6] hover:text-[#5dd195] text-sm font-medium transition-colors"
                    >
                      View All →
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {bookings
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .slice(0, 5)
                      .map((booking) => {
                        const getStatusColor = (status: string) => {
                          const colors: Record<string, string> = {
                            PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
                            CONFIRMED: 'bg-[#69E6A6]/20 text-[#69E6A6] border-[#69E6A6]/50',
                            COMPLETED: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
                            DECLINED: 'bg-red-500/20 text-red-400 border-red-500/50',
                            CANCELLED: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
                          };
                          return colors[status] || 'bg-white/10 text-white/70 border-white/20';
                        };
                        return (
                          <Link
                            key={booking.id}
                            href="/dashboard/user/bookings"
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
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <p className="text-white font-medium mb-1">Booking #{booking.id.slice(0, 8)}</p>
                            <p className="text-white/60 text-sm">{booking.area}</p>
                          </Link>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <Link
                href="/dashboard/user/bookings"
                className="group rounded-2xl bg-[#1C3D5B] p-6 border border-white/10 hover:border-[#69E6A6]/50 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-xl bg-[#69E6A6]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-[#69E6A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-xl mb-1">My Bookings</h3>
                    <p className="text-white/70 text-sm">View and manage your service bookings</p>
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

            {/* Services Section */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Browse Services
                  </h2>
                  <p className="text-white/70">Discover professional services for your home</p>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="mb-6 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                    <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#1C3D5B] border border-white/10 text-white placeholder-white/50 focus:border-[#69E6A6] focus:outline-none focus:ring-2 focus:ring-[#69E6A6]/20 transition-all"
                  />
                </div>
              </div>

              {/* Results Count */}
              {!loading && (
                <div className="mb-4">
                  <p className="text-white/70 text-sm">
                    Showing <span className="font-semibold text-white">{filteredServices.length}</span> of <span className="font-semibold text-white">{services.length}</span> service
                    {services.length !== 1 ? 's' : ''}
                    {searchQuery && ` matching "${searchQuery}"`}
                  </p>
                </div>
              )}

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="rounded-2xl bg-[#1C3D5B] border border-white/10 p-5 animate-pulse">
                      <div className="h-48 bg-white/10 rounded-xl mb-4"></div>
                      <div className="h-6 bg-white/10 rounded mb-2"></div>
                      <div className="h-4 bg-white/10 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="rounded-2xl bg-red-500/20 border border-red-500/50 p-6 text-center">
                  <p className="text-red-400 mb-2 font-semibold">Error loading services</p>
                  <p className="text-red-300 text-sm mb-4">{error}</p>
                  <p className="text-white/50 text-xs mb-4">
                    Make sure the backend server is running and the database has been seeded.
                  </p>
                  <button
                    onClick={loadData}
                    className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-400 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredServices.length === 0 && services.length === 0 ? (
                <div className="rounded-2xl bg-[#1C3D5B] border border-white/10 p-12 text-center">
                  <svg className="w-16 h-16 text-white/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="text-white/70 text-lg mb-2">No services available</p>
                  <p className="text-white/50 text-sm mb-4">
                    The database might not have any services yet. Please seed the database or contact support.
                  </p>
                  <p className="text-white/40 text-xs">
                    Total services in database: {services.length}
                  </p>
                </div>
              ) : filteredServices.length === 0 ? (
                <div className="rounded-2xl bg-[#1C3D5B] border border-white/10 p-12 text-center">
                  <svg className="w-16 h-16 text-white/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-white/70 text-lg mb-2">No services found</p>
                  <p className="text-white/50 text-sm">
                    {searchQuery
                      ? 'Try adjusting your search'
                      : 'No services available at the moment'}
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                      }}
                      className="mt-4 px-6 py-2 bg-[#69E6A6]/20 hover:bg-[#69E6A6]/30 border border-[#69E6A6]/50 rounded-lg text-[#69E6A6] transition-colors"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              ) : (
                <ServicesGrid services={filteredServices} />
              )}
            </div>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
