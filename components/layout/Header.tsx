'use client';

import { useState, useEffect, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth/auth.storage';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { scrollToSection, handleSectionNavigation } from '@/utils/scrollToSection';

const HeaderComponent = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

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

  // Check authentication only on client side to avoid hydration mismatch
  useEffect(() => {
    setAuthenticated(isAuthenticated());
  }, []);

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A2640]/95 backdrop-blur-sm border-b border-white/10 shadow-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 z-50">
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

          {/* Desktop Navigation Links */}
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

          {/* CTA Buttons */}
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

            {authenticated ? (
              <Link
                href="/dashboard"
                className="group relative px-6 py-2.5 bg-gradient-to-r from-[#69E6A6] to-[#4ADE80] text-[#0A2640] rounded-full font-semibold text-sm shadow-lg shadow-[#69E6A6]/30 hover:shadow-xl hover:shadow-[#69E6A6]/40 transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Dashboard
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#5dd195] to-[#3a8ee0] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            ) : (
              <Link
                href="/login"
                className="group relative px-6 py-2.5 bg-gradient-to-r from-[#69E6A6] to-[#4ADE80] text-[#0A2640] rounded-full font-semibold text-sm shadow-lg shadow-[#69E6A6]/30 hover:shadow-xl hover:shadow-[#69E6A6]/40 transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Log In
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#5dd195] to-[#3a8ee0] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export const Header = memo(HeaderComponent);

