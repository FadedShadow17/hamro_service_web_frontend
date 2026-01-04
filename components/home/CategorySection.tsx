import React from 'react';
import Link from 'next/link';
import { services } from '@/lib/data/services';

const getServiceIcon = (title: string) => {
  const icons: Record<string, React.ReactNode> = {
    'Plumbing': (
      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.12.56-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.12-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
      </svg>
    ),
    'Electrical': (
      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
        <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
      </svg>
    ),
    'Cleaning': (
      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.36 2.72L20.78 4.14L15.06 9.85C16.13 11.39 16.28 13.24 15.38 14.44L9.06 20.78C8.74 21.07 8.22 21.07 7.9 20.78L7.13 20L2.22 15.11C1.93 14.79 1.93 14.27 2.22 13.95L10.5 5.67C11.7 4.77 13.55 4.92 15.09 5.99L20.78 0.3L19.36 2.72ZM14.06 6.69L12.68 8.07L10.5 5.89L11.88 4.5C12.64 3.74 13.9 3.74 14.66 4.5L15.05 4.89C15.81 5.65 15.81 6.91 15.05 7.67L14.06 6.69ZM4.89 9.06L7.07 11.24L4.89 13.42L3.5 12.04C2.74 11.28 2.74 10.02 3.5 9.26L3.89 8.87C4.65 8.11 5.91 8.11 6.67 8.87L7.07 9.26L5.89 10.44L4.5 9.06H4.89ZM18.96 7.38L19.34 7.76C20.1 8.52 20.1 9.78 19.34 10.54L18.96 10.92L17.58 9.54L17.96 9.16C18.72 8.4 18.72 7.14 17.96 6.38L17.58 6L18.96 7.38ZM14.06 14.06L15.44 15.44L14.06 16.82L12.68 15.44L14.06 14.06Z"/>
      </svg>
    ),
    'Carpentry': (
      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.61 19.61L4.39 1.39C3.81 0.81 2.89 0.81 2.31 1.39L1.39 2.31C0.81 2.89 0.81 3.81 1.39 4.39L19.61 22.61C20.19 23.19 21.11 23.19 21.69 22.61L22.61 21.69C23.19 21.11 23.19 20.19 22.61 19.61ZM3.5 2.5L21.5 20.5L20.5 21.5L2.5 3.5L3.5 2.5Z"/>
        <path d="M12 2L2 7L12 12L22 7L12 2ZM2 17L12 22L22 17V12L12 17L2 12V17Z"/>
      </svg>
    ),
    'Painting': (
      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.71 3.29C18.32 2.9 17.68 2.9 17.29 3.29L15.29 5.29L18.71 8.71L20.71 6.71C21.1 6.32 21.1 5.68 20.71 5.29L18.71 3.29ZM14.29 7.71L3.29 18.71C2.9 19.1 2.9 19.74 3.29 20.13L3.87 20.71C4.26 21.1 4.9 21.1 5.29 20.71L16.29 9.71L14.29 7.71ZM2 22L4 20L2 18V22Z"/>
      </svg>
    ),
    'HVAC': (
      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20ZM12 6C8.69 6 6 8.69 6 12S8.69 18 12 18 18 15.31 18 12 15.31 6 12 6ZM12 16C9.79 16 8 14.21 8 12S9.79 8 12 8 16 9.79 16 12 14.21 16 12 16Z"/>
        <circle cx="12" cy="12" r="2"/>
      </svg>
    ),
    'Appliance Repair': (
      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V8H20V18ZM6 13H18V15H6V13ZM6 10H18V12H6V10Z"/>
        <path d="M8 16H16V17H8V16Z"/>
      </svg>
    ),
    'Gardening & Landscaping': (
      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.5 12C17.5 10.62 16.38 9.5 15 9.5C13.62 9.5 12.5 10.62 12.5 12C12.5 13.38 13.62 14.5 15 14.5C16.38 14.5 17.5 13.38 17.5 12ZM15 7C18.31 7 21 9.69 21 13C21 16.31 18.31 19 15 19C11.69 19 9 16.31 9 13C9 9.69 11.69 7 15 7ZM15 17C16.93 17 18.5 15.43 18.5 13.5C18.5 11.57 16.93 10 15 10C13.07 10 11.5 11.57 11.5 13.5C11.5 15.43 13.07 17 15 17Z"/>
        <path d="M7 5C7 3.9 7.9 3 9 3C10.1 3 11 3.9 11 5C11 6.1 10.1 7 9 7C7.9 7 7 6.1 7 5ZM9 1C6.24 1 4 3.24 4 6C4 8.76 6.24 11 9 11C11.76 11 14 8.76 14 6C14 3.24 11.76 1 9 1ZM9 9C7.35 9 6 7.65 6 6C6 4.35 7.35 3 9 3C10.65 3 12 4.35 12 6C12 7.65 10.65 9 9 9Z"/>
        <path d="M3 21H21V23H3V21Z"/>
      </svg>
    ),
  };
  return icons[title] || icons['Plumbing'];
};

export function CategorySection() {
  const featuredCategories = services.slice(0, 8);

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0A2640] mb-4">
            Popular Services
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choose from our most popular home service categories. Quick booking, verified professionals.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredCategories.map((service) => (
            <Link
              key={service.id}
              href="/login"
              className="group relative rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 border border-gray-200 hover:border-[#69E6A6]/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#69E6A6]/10 to-[#4A9EFF]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 text-[#69E6A6]">
                  {getServiceIcon(service.title)}
                </div>
                <h3 className="text-base md:text-lg font-bold text-[#0A2640] mb-2 group-hover:text-[#69E6A6] transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-xs md:text-sm mb-4 line-clamp-2">
                  {service.shortDescription}
                </p>
                <div className="inline-flex items-center text-[#69E6A6] font-semibold text-sm group-hover:gap-2 transition-all">
                  Book Now
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/login"
            className="inline-flex items-center px-8 py-4 bg-[#0A2640] text-white rounded-xl font-semibold hover:bg-[#0F2E4A] transition-all duration-300 hover:shadow-lg"
          >
            View All Services
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

