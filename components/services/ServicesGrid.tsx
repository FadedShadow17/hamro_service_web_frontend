'use client';

import { Service } from '@/lib/api/services.api';
import Link from 'next/link';
import Image from 'next/image';

interface ServicesGridProps {
  services: Service[];
}

export function ServicesGrid({ services }: ServicesGridProps) {
  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white/70">No services available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {services.map((service) => (
        <Link
          key={service.id}
          href={`/services/${service.id}`}
          className="group relative rounded-2xl bg-[#1C3D5B] border border-white/10 overflow-hidden hover:border-[#69E6A6]/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#69E6A6]/20"
        >
          {/* Service Image */}
          <div className="relative h-48 bg-gradient-to-br from-[#69E6A6]/20 to-[#4A9EFF]/20 overflow-hidden">
            {service.image ? (
              <Image
                src={service.image}
                alt={service.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-16 h-16 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C3D5B] via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
          </div>

          {/* Service Info */}
          <div className="p-5">
            <h3 className="text-white font-bold text-lg mb-2 group-hover:text-[#69E6A6] transition-colors">
              {service.name}
            </h3>
            <p className="text-white/70 text-sm line-clamp-2 mb-4">
              {service.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#69E6A6]/20 text-[#69E6A6]">
                View Details
              </span>
              <svg className="w-5 h-5 text-[#69E6A6] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
