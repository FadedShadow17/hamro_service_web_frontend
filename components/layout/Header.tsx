'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth/auth.storage';

export function Header() {
  const pathname = usePathname();
  const authenticated = isAuthenticated();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
    { href: '/blogs', label: 'Blogs' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A2640] border-b border-[#0A2640]/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img 
              src="/images/hamro service.png" 
              alt="Hamro Service Logo" 
              className="h-10 w-auto object-contain"
            />
            <span className="text-white text-xl font-bold">Hamro Service</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-[#69E6A6]'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Login Button */}
          <div className="flex items-center space-x-4">
            {authenticated ? (
              <Link
                href="/dashboard"
                className="px-6 py-2 bg-white text-[#0A2640] rounded-full font-medium text-sm hover:bg-white/90 transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-6 py-2 bg-white text-[#0A2640] rounded-full font-medium text-sm hover:bg-white/90 transition-colors"
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

