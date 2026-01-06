'use client';

import { useState, useEffect, memo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { isAuthenticated, getUser, clearAuth, type User, USER_ROLES, isUser, isProvider } from '@/lib/auth/auth.storage';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { scrollToSection, handleSectionNavigation } from '@/utils/scrollToSection';

const HeaderComponent = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Section IDs for scrollspy (always call hook, but use conditionally)
  const sectionIds = ['home', 'services', 'how-it-works', 'why-us', 'testimonials'];
  const scrollSpyResult = useScrollSpy(sectionIds, 100);
  const activeSection = pathname === '/' ? scrollSpyResult : '';

  // Track scroll position to determine if at top of page
  useEffect(() => {
    if (pathname !== '/') {
      setIsAtTop(false);
      return;
    }

    const handleScroll = () => {
      setIsAtTop(window.scrollY < 100);
    };

    // Check initial position
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  // Check authentication and get user data on client side to avoid hydration mismatch
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = isAuthenticated();
      setAuthenticated(isAuth);
      if (isAuth) {
        const userData = getUser();
        setUser(userData);
      } else {
        setUser(null);
      }
    };
    
    checkAuth();
  }, []);

  // Re-check authentication when pathname changes (user might have logged in/out)
  useEffect(() => {
    const isAuth = isAuthenticated();
    setAuthenticated(isAuth);
    if (isAuth) {
      const userData = getUser();
      setUser(userData);
    } else {
      setUser(null);
    }
    setProfileDropdownOpen(false);
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };

    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownOpen]);

  // Handle hash navigation on page load only - runs once when pathname changes to '/'
  useEffect(() => {
    if (pathname === '/' && typeof window !== 'undefined') {
      // Only run once when component mounts or pathname changes to '/'
      const hash = window.location.hash.substring(1);
      if (hash && sectionIds.includes(hash)) {
        // Only scroll if hash exists in URL (user clicked a link)
        // Use a longer delay to ensure page is fully rendered
        const timer = setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            scrollToSection(hash);
          }
        }, 600);
        return () => clearTimeout(timer);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]); // Only depend on pathname, not sectionIds

  // Navigation items configuration
  const navItems = [
    { href: '/', label: 'Home', type: 'route', sectionId: 'home' },
    { href: '#services', label: 'Services', type: 'section', sectionId: 'services' },
    { href: '#how-it-works', label: 'How it Works', type: 'section', sectionId: 'how-it-works' },
    { href: '#why-us', label: 'Why Us', type: 'section', sectionId: 'why-us' },
    { href: '#testimonials', label: 'Testimonials', type: 'section', sectionId: 'testimonials' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: typeof navItems[0]) => {
    if (item.type === 'section') {
      e.preventDefault();
      handleSectionNavigation(item.href, router, pathname);
      setMobileMenuOpen(false);
    } else if (item.href === '/' && item.sectionId === 'home') {
      // Handle Home link - scroll to top if on home page, otherwise navigate
      if (pathname === '/') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setMobileMenuOpen(false);
      } else {
        // Navigate to home page - the scroll will happen on page load
        setMobileMenuOpen(false);
      }
    } else {
      setMobileMenuOpen(false);
    }
  };

  const isNavActive = (item: typeof navItems[0]) => {
    if (item.type === 'section') {
      return pathname === '/' && activeSection === item.sectionId;
    }
    // For Home link, only active when at top of page
    if (item.href === '/' && item.sectionId === 'home') {
      return pathname === '/' && isAtTop;
    }
    return pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
  };

  const handleLogout = () => {
    clearAuth();
    setAuthenticated(false);
    setUser(null);
    setProfileDropdownOpen(false);
    router.push('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A2640]/95 backdrop-blur-sm border-b border-white/10 shadow-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            href={authenticated && user ? (isUser(user) ? '/dashboard/user' : '/dashboard/provider') : '/'} 
            className="flex items-center space-x-2 z-50"
          >
            <Image
              src="/images/hamro service.png"
              alt="Hamro Service Logo"
              width={40}
              height={40}
              className="h-10 w-auto object-contain"
              priority
            />
            <span className="text-white text-xl font-bold hidden sm:inline">Hamro Service</span>
          </Link>

          {/* Desktop Navigation Links - Only show when not authenticated */}
          {!authenticated && (
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => {
                const isActive = isNavActive(item);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item)}
                    className={`text-sm font-medium transition-all relative px-2 py-1 rounded-lg ${
                      isActive
                        ? 'text-[#69E6A6] bg-[#69E6A6]/10'
                        : 'text-white/80 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute -bottom-1 left-2 right-2 h-0.5 bg-[#69E6A6] rounded-full"></span>
                    )}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Home Button - Always Visible */}
            {pathname !== '/' && (
              <Link
                href="/"
                className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-[#69E6A6]/20 border border-white/20 hover:border-[#69E6A6]/50 text-white hover:text-[#69E6A6] transition-all duration-300 hover:scale-110"
                title="Go to Home"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </Link>
            )}

            {/* Context Action - When Authenticated */}
            {authenticated && user && (
              <Link
                href={isUser(user) ? '/bookings' : '/dashboard/provider/bookings'}
                className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-[#69E6A6]/20 border border-white/20 hover:border-[#69E6A6]/50 text-white hover:text-[#69E6A6] transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="font-medium text-sm">{isUser(user) ? 'My Bookings' : 'My Jobs'}</span>
              </Link>
            )}

            {/* Profile Dropdown - When Authenticated */}
            {authenticated && user ? (
              <div className="relative" ref={profileDropdownRef}>
                <div
                  onClick={() => {
                    setProfileDropdownOpen(!profileDropdownOpen);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-[#69E6A6] cursor-pointer hover:bg-[#5dd195] transition-all duration-300 hover:scale-110 shadow-lg shadow-[#69E6A6]/30"
                  title="Profile Menu"
                >
                  <span className="text-[#0A2640] font-bold text-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 top-14 w-72 bg-[#1C3D5B]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-[fadeIn_0.2s_ease-out]">
                    {/* User Info Section */}
                    <div className="p-4 border-b border-white/10">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-12 h-12 rounded-full bg-[#69E6A6] flex items-center justify-center flex-shrink-0">
                          <span className="text-[#0A2640] font-bold text-xl">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold text-sm truncate">{user.name}</p>
                          <p className="text-white/70 text-xs truncate">{user.email}</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#69E6A6]/20 text-[#69E6A6] capitalize">
                          {user.role}
                        </span>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      <div
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-red-500/20 transition-all duration-200 cursor-pointer group"
                      >
                        <svg
                          className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        <span className="font-medium text-sm">Logout</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Log In Link - When Not Authenticated */
              <Link
                href="/login"
                className="text-white/80 hover:text-[#69E6A6] transition-colors duration-200 font-medium text-sm"
              >
                Log In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                setProfileDropdownOpen(false);
              }}
              className="lg:hidden p-2 text-white hover:text-[#69E6A6] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-20 left-0 right-0 bg-[#0A2640]/98 backdrop-blur-sm border-t border-white/10 shadow-xl">
            <nav className="container mx-auto px-4 py-6 space-y-2">
              {/* Show public nav only when not authenticated */}
              {!authenticated ? (
                <>
                  {/* Home Button in Mobile Menu */}
                  {pathname !== '/' && (
                    <Link
                      href="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 py-3 px-4 text-base font-medium transition-all rounded-lg text-white/80 hover:text-[#69E6A6] hover:bg-[#69E6A6]/10"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Home
                    </Link>
                  )}
                  {navItems.map((item) => {
                    const isActive = isNavActive(item);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item)}
                        className={`block py-3 px-4 text-base font-medium transition-all rounded-lg ${
                          isActive
                            ? 'text-[#69E6A6] bg-[#69E6A6]/10'
                            : 'text-white/80 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </>
              ) : (
                /* Show context action in mobile menu when authenticated */
                user && (
                  <Link
                    href={isUser(user) ? '/bookings' : '/dashboard/provider/bookings'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-3 px-4 text-base font-medium transition-all rounded-lg text-white/80 hover:text-[#69E6A6] hover:bg-[#69E6A6]/10"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    {isUser(user) ? 'My Bookings' : 'My Jobs'}
                  </Link>
                )
              )}
              
              {/* User Info and Logout in Mobile Menu */}
              {authenticated && user && (
                <>
                  <div className="border-t border-white/10 my-2 pt-4">
                    <div className="flex items-center space-x-3 px-4 py-2 mb-2">
                      <div className="w-10 h-10 rounded-full bg-[#69E6A6] flex items-center justify-center flex-shrink-0">
                        <span className="text-[#0A2640] font-bold text-lg">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm truncate">{user.name}</p>
                        <p className="text-white/70 text-xs truncate">{user.email}</p>
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 py-3 px-4 text-base font-medium transition-all rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/20 cursor-pointer"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Logout
                    </div>
                  </div>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export const Header = memo(HeaderComponent);

