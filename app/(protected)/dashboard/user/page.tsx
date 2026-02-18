'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, isUser } from '@/lib/auth/auth.storage';
import { RouteGuard } from '@/components/auth/RouteGuard';
import { getServices, type Service } from '@/lib/api/services.api';
import { getMyBookings, type Booking } from '@/lib/api/bookings.api';
import { ServicesGrid } from '@/components/services/ServicesGrid';
import { StatCard, SectionCard, BookingCard } from '@/components/dashboard';
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
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'newest'>('name');

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
    let filtered = [...services];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(query) ||
          service.description?.toLowerCase().includes(query)
      );
    }

    // Sort services
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          const priceA = a.basePrice || 0;
          const priceB = b.basePrice || 0;
          return priceA - priceB;
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [services, searchQuery, sortBy]);

  const pendingBookings = bookings.filter((b) => b.status === 'PENDING' || b.status === 'CONFIRMED');
  const completedBookings = bookings.filter((b) => b.status === 'COMPLETED');
  // Count CONFIRMED bookings that are UNPAID or don't have paymentStatus set
  const payableBookings = bookings.filter((b) => b.status === 'CONFIRMED' && b.paymentStatus !== 'PAID');

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
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#69E6A6]/20 to-[#69E6A6]/10 flex items-center justify-center border border-[#69E6A6]/20">
                  <svg className="w-6 h-6 text-[#69E6A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
                    Welcome back, {user.name}! 
                  </h1>
                  <p className="text-white/70 text-lg">Browse and book services for your home</p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <StatCard
                value={pendingBookings.length}
                label="Active Bookings"
                icon={
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                }
                color="green"
                href="/dashboard/user/bookings"
                progress={Math.min((pendingBookings.length / 10) * 100, 100)}
              />

              <StatCard
                value={completedBookings.length}
                label="Completed"
                icon={
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                color="blue"
                href="/dashboard/user/bookings?status=COMPLETED"
                progress={Math.min((completedBookings.length / 10) * 100, 100)}
              />

              <StatCard
                value={services.length}
                label="Available Services"
                icon={
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
                color="orange"
                onClick={() => {
                  const servicesSection = document.getElementById('services');
                  if (servicesSection) {
                    servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                progress={Math.min((services.length / 20) * 100, 100)}
              />

              <StatCard
                value={payableBookings.length}
                label="Pending Payments"
                icon={
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                }
                color="purple"
                href="/dashboard/user/payments"
                progress={Math.min((payableBookings.length / 10) * 100, 100)}
                badge={payableBookings.length > 0 ? { text: 'Pay Now', color: 'yellow' } : undefined}
              />
            </div>

            {/* Recent Bookings Section */}
            {bookings.length > 0 && (
              <div className="mb-10">
                <SectionCard
                  title="Recent Bookings"
                  subtitle="Your latest service bookings"
                  actionLink={{
                    href: '/dashboard/user/bookings',
                    text: 'View All',
                  }}
                >
                  <div className="space-y-4">
                    {bookings
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .slice(0, 5)
                      .map((booking) => (
                        <BookingCard
                          key={booking.id}
                          booking={booking}
                          href="/dashboard/user/bookings"
                          showProvider={true}
                        />
                      ))}
                  </div>
                </SectionCard>
              </div>
            )}

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
                  href="/dashboard/user/bookings"
                  className="group rounded-2xl bg-gradient-to-br from-[#1C3D5B] to-[#0A2640] p-6 border border-white/10 hover:border-[#69E6A6]/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#69E6A6]/10"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#69E6A6]/20 to-[#69E6A6]/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-[#69E6A6]/20">
                      <svg className="w-7 h-7 text-[#69E6A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-xl mb-1 group-hover:text-[#69E6A6] transition-colors">My Bookings</h3>
                      <p className="text-white/70 text-sm">View and manage all your service bookings</p>
                    </div>
                    <svg className="w-6 h-6 text-[#69E6A6] group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>

                {payableBookings.length > 0 && (
                  <Link
                    href="/dashboard/user/payments"
                    className="group rounded-2xl bg-gradient-to-br from-[#1C3D5B] to-[#0A2640] p-6 border border-yellow-500/30 hover:border-yellow-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-yellow-500/10"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-500/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-yellow-500/20">
                        <svg className="w-7 h-7 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-bold text-xl group-hover:text-yellow-400 transition-colors">Make Payment</h3>
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/50">
                            {payableBookings.length} pending
                          </span>
                        </div>
                        <p className="text-white/70 text-sm">Pay for your confirmed bookings</p>
                      </div>
                      <svg className="w-6 h-6 text-yellow-400 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                )}

                {payableBookings.length === 0 && (
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

            {/* Services Section */}
            <div id="services" className="mb-10 scroll-mt-20">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#69E6A6]/20 to-[#69E6A6]/10 flex items-center justify-center border border-[#69E6A6]/20">
                    <svg className="w-6 h-6 text-[#69E6A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      Browse Services
                    </h2>
                    <p className="text-white/70 text-lg">Discover professional services for your home</p>
                  </div>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="mb-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Search Bar */}
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                      <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search services by name or description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#1C3D5B] border border-white/10 text-white placeholder-white/50 focus:border-[#69E6A6] focus:outline-none focus:ring-2 focus:ring-[#69E6A6]/20 transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-white/50 hover:text-white transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Sort Dropdown */}
                  <div className="relative sm:w-48">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                      </svg>
                    </div>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'newest')}
                      className="w-full pl-12 pr-10 py-3 rounded-xl bg-[#1C3D5B] border border-white/10 text-white focus:border-[#69E6A6] focus:outline-none focus:ring-2 focus:ring-[#69E6A6]/20 transition-all appearance-none cursor-pointer"
                    >
                      <option value="name" className="bg-[#1C3D5B]">Sort by Name</option>
                      <option value="price" className="bg-[#1C3D5B]">Sort by Price</option>
                      <option value="newest" className="bg-[#1C3D5B]">Newest First</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Count and Active Filters */}
              {!loading && (
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <p className="text-white/70 text-sm">
                    Showing <span className="font-semibold text-[#69E6A6]">{filteredServices.length}</span> of <span className="font-semibold text-white">{services.length}</span> service
                    {services.length !== 1 ? 's' : ''}
                  </p>
                  {searchQuery && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#69E6A6]/20 border border-[#69E6A6]/30">
                      <span className="text-[#69E6A6] text-xs font-medium">Search: "{searchQuery}"</span>
                      <button
                        onClick={() => setSearchQuery('')}
                        className="text-[#69E6A6] hover:text-white transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                  {sortBy !== 'name' && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#4A9EFF]/20 border border-[#4A9EFF]/30">
                      <span className="text-[#4A9EFF] text-xs font-medium">
                        {sortBy === 'price' ? 'Sorted by Price' : 'Newest First'}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="rounded-2xl bg-[#1C3D5B] border border-white/10 overflow-hidden animate-pulse">
                      <div className="h-52 bg-gradient-to-br from-white/10 to-white/5"></div>
                      <div className="p-5 space-y-3">
                        <div className="h-6 bg-white/10 rounded w-3/4"></div>
                        <div className="h-4 bg-white/10 rounded w-full"></div>
                        <div className="h-4 bg-white/10 rounded w-2/3"></div>
                        <div className="flex gap-2 mt-4">
                          <div className="h-10 bg-white/10 rounded-lg flex-1"></div>
                          <div className="h-10 bg-white/10 rounded-lg w-12"></div>
                        </div>
                      </div>
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
                <div className="rounded-2xl bg-gradient-to-br from-[#1C3D5B] to-[#0A2640] border border-white/10 p-16 text-center">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#69E6A6]/20 to-[#4A9EFF]/20 flex items-center justify-center">
                    <svg className="w-12 h-12 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-white text-xl font-bold mb-2">No services available</h3>
                  <p className="text-white/60 text-sm mb-6 max-w-md mx-auto">
                    The database might not have any services yet. Please seed the database or contact support.
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-white/50 text-xs">Total services:</span>
                    <span className="text-white font-semibold">{services.length}</span>
                  </div>
                </div>
              ) : filteredServices.length === 0 ? (
                <div className="rounded-2xl bg-gradient-to-br from-[#1C3D5B] to-[#0A2640] border border-white/10 p-16 text-center">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#69E6A6]/20 to-[#4A9EFF]/20 flex items-center justify-center">
                    <svg className="w-12 h-12 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-white text-xl font-bold mb-2">No services found</h3>
                  <p className="text-white/60 text-sm mb-6">
                    {searchQuery
                      ? `No services match "${searchQuery}". Try adjusting your search terms.`
                      : 'No services available at the moment'}
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-[#69E6A6] to-[#5dd195] hover:from-[#5dd195] hover:to-[#4fb882] text-[#0A2640] font-semibold rounded-lg transition-all hover:scale-105 shadow-lg shadow-[#69E6A6]/30 flex items-center gap-2 mx-auto"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
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
