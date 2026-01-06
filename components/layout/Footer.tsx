'use client';

import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { handleSectionNavigation } from '@/utils/scrollToSection';

const FooterComponent = () => {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const router = useRouter();

  // Navigation items matching header
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
    } else if (item.href === '/' && item.sectionId === 'home') {
      // Handle Home link - scroll to top if on home page, otherwise navigate
      if (pathname === '/') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Navigate to home page - the scroll will happen on page load
        // (handled by useEffect in Header)
      }
    }
  };

  return (
    <footer className="bg-gradient-to-b from-[#0A2640] to-[#06243A] text-white border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Image
                src="/images/hamro service.png"
                alt="Hamro Service Logo"
                width={40}
                height={40}
                className="h-10 w-auto object-contain"
              />
              <span className="text-xl font-bold">Hamro Service</span>
            </div>
            <p className="text-white/70 text-sm max-w-md mb-4">
              Your trusted platform for booking home services. Connect with
              skilled professionals for all your service needs. Quality service, every time.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#69E6A6]/20 flex items-center justify-center transition-all hover:scale-110" aria-label="Facebook">
                <svg className="w-5 h-5 text-white/70 hover:text-[#69E6A6]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#69E6A6]/20 flex items-center justify-center transition-all hover:scale-110" aria-label="Twitter">
                <svg className="w-5 h-5 text-white/70 hover:text-[#69E6A6]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#69E6A6]/20 flex items-center justify-center transition-all hover:scale-110" aria-label="LinkedIn">
                <svg className="w-5 h-5 text-white/70 hover:text-[#69E6A6]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Links - Matching Header */}
          <div>
            <h3 className="font-semibold mb-5 text-white text-lg">Navigation</h3>
            <ul className="space-y-3 text-sm">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item)}
                    className="text-white/70 hover:text-[#69E6A6] transition-all hover:translate-x-1 inline-block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="font-semibold mb-5 text-white text-lg">Contact & Support</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/contact" className="text-white/70 hover:text-[#69E6A6] transition-all hover:translate-x-1 inline-block">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-white/70 hover:text-[#69E6A6] transition-all hover:translate-x-1 inline-block">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-white/70 hover:text-[#69E6A6] transition-all hover:translate-x-1 inline-block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-white/70 hover:text-[#69E6A6] transition-all hover:translate-x-1 inline-block">
                  Terms of Service
                </Link>
              </li>
            </ul>
            <div className="mt-4 text-sm text-white/70">
              <p>Email: support@hamroservice.com</p>
              <p className="mt-1">Phone: +977-1-XXXXXXX</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-white/60 text-sm text-center">
            © {currentYear} Hamro Service. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export const Footer = memo(FooterComponent);

