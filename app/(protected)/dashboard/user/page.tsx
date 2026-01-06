'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, isUser } from '@/lib/auth/auth.storage';
import { RouteGuard } from '@/components/auth/RouteGuard';
import { getServices, type Service } from '@/lib/api/services.api';
import { getServiceCategories, type ServiceCategory } from '@/lib/api/service-categories.api';
import { getMyBookings, type Booking } from '@/lib/api/bookings.api';
import { ServicesGrid } from '@/components/services/ServicesGrid';
import Link from 'next/link';

export default function UserDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
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
      const [servicesData, categoriesData, bookingsData] = await Promise.all([
        getServices(true),
        getServiceCategories(true).catch(() => []), // Categories are optional
        getMyBookings().catch(() => []), // Bookings are optional
      ]);
      setServices(servicesData);
      setCategories(categoriesData);
      setBookings(bookingsData);
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = useMemo(() => {
    let filtered = services;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((service) => service.categoryId === selectedCategory);
    }

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
  }, [services, selectedCategory, searchQuery]);

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
                Welcome back, {user.name}! 
              </h1>
              <p className="text-white/70">Browse and book services for your home</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Link
                href="/bookings"
                className="group rounded-2xl bg-gradient-to-br from-[#69E6A6]/20 to-[#69E6A6]/5 p-6 border border-[#69E6A6]/30 hover:border-[#69E6A6]/50 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 rounded-xl bg-[#69E6A6] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-[#0A2640]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <svg className="w-5 h-5 text-[#69E6A6] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-2xl mb-1">{pendingBookings.length}</h3>
                <p className="text-white/70 text-sm">Active Bookings</p>
              </Link>

              <div className="rounded-2xl bg-gradient-to-br from-[#4A9EFF]/20 to-[#4A9EFF]/5 p-6 border border-[#4A9EFF]/30">
                <div className="w-12 h-12 rounded-xl bg-[#4A9EFF] flex items-center justify-center mb-2">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-2xl mb-1">{completedBookings.length}</h3>
                <p className="text-white/70 text-sm">Completed</p>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-[#FFA500]/20 to-[#FFA500]/5 p-6 border border-[#FFA500]/30">
                <div className="w-12 h-12 rounded-xl bg-[#FFA500] flex items-center justify-center mb-2">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-2xl mb-1">{services.length}</h3>
                <p className="text-white/70 text-sm">Available Services</p>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-[#9B59B6]/20 to-[#9B59B6]/5 p-6 border border-[#9B59B6]/30">
                <div className="w-12 h-12 rounded-xl bg-[#9B59B6] flex items-center justify-center mb-2">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-2xl mb-1">{categories.length}</h3>
                <p className="text-white/70 text-sm">Categories</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <Link
                href="/bookings"
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

              <div className="rounded-2xl bg-[#1C3D5B] p-6 border border-white/10">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-xl bg-[#4A9EFF]/20 flex items-center justify-center">
                    <svg className="w-7 h-7 text-[#4A9EFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-xl mb-1">24/7 Support</h3>
                    <p className="text-white/70 text-sm">Get help anytime you need it</p>
                  </div>
                </div>
              </div>
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

                {/* Category Filter */}
                {categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedCategory === 'all'
                          ? 'bg-[#69E6A6] text-[#0A2640]'
                          : 'bg-[#1C3D5B] text-white/70 hover:text-white hover:bg-[#1C3D5B]/80 border border-white/10'
                      }`}
                    >
                      All Services
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          selectedCategory === category.id
                            ? 'bg-[#69E6A6] text-[#0A2640]'
                            : 'bg-[#1C3D5B] text-white/70 hover:text-white hover:bg-[#1C3D5B]/80 border border-white/10'
                        }`}
                      >
                        {category.icon && <span className="mr-2">{category.icon}</span>}
                        {category.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Results Count */}
              {!loading && (
                <div className="mb-4">
                  <p className="text-white/70 text-sm">
                    Showing <span className="font-semibold text-white">{filteredServices.length}</span> service
                    {filteredServices.length !== 1 ? 's' : ''}
                    {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name || 'category'}`}
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
                  <p className="text-red-400 mb-4">{error}</p>
                  <button
                    onClick={loadData}
                    className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-400 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredServices.length === 0 ? (
                <div className="rounded-2xl bg-[#1C3D5B] border border-white/10 p-12 text-center">
                  <svg className="w-16 h-16 text-white/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-white/70 text-lg mb-2">No services found</p>
                  <p className="text-white/50 text-sm">
                    {searchQuery || selectedCategory !== 'all'
                      ? 'Try adjusting your search or filters'
                      : 'No services available at the moment'}
                  </p>
                  {(searchQuery || selectedCategory !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                      }}
                      className="mt-4 px-6 py-2 bg-[#69E6A6]/20 hover:bg-[#69E6A6]/30 border border-[#69E6A6]/50 rounded-lg text-[#69E6A6] transition-colors"
                    >
                      Clear Filters
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
