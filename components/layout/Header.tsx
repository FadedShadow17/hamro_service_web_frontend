'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth/auth.storage';

export function Header() {
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check authentication only on client side to avoid hydration mismatch
  useEffect(() => {
    setAuthenticated(isAuthenticated());
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
    { href: '/blogs', label: 'Blogs' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A2640] border-b border-white/10 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 z-50">
            <img 
              src="/images/hamro service.png" 
              alt="Hamro Service Logo" 
              className="h-10 w-auto object-contain"
            />
            <span className="text-white text-xl font-bold hidden sm:inline">Hamro Service</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors relative ${
                    isActive
                      ? 'text-[#69E6A6]'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#69E6A6]"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-3">
            {!authenticated && (
              <Link
                href="/services"
                className="hidden md:block px-5 py-2 bg-[#69E6A6] text-[#0A2640] rounded-full font-semibold text-sm hover:bg-[#5dd195] transition-colors"
              >
                Book Now
              </Link>
            )}
            {authenticated ? (
              <Link
                href="/dashboard"
                className="px-5 py-2 bg-white text-[#0A2640] rounded-full font-semibold text-sm hover:bg-white/90 transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2 bg-white text-[#0A2640] rounded-full font-semibold text-sm hover:bg-white/90 transition-colors"
              >
                Log In
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
          <div className="lg:hidden absolute top-20 left-0 right-0 bg-[#0A2640] border-t border-white/10 shadow-xl">
            <nav className="container mx-auto px-4 py-6 space-y-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-2 text-base font-medium transition-colors ${
                      isActive
                        ? 'text-[#69E6A6]'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              {!authenticated && (
                <Link
                  href="/services"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block mt-4 px-5 py-2 bg-[#69E6A6] text-[#0A2640] rounded-full font-semibold text-center"
                >
                  Book Now
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

