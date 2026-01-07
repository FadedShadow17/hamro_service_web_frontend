import Link from 'next/link';
import { Booking, BookingStatus } from '@/lib/api/bookings.api';

interface BookingCardProps {
  booking: Booking;
  href?: string;
  showProvider?: boolean;
  showUser?: boolean;
  className?: string;
}

const statusColors: Record<BookingStatus, string> = {
  PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  CONFIRMED: 'bg-[#69E6A6]/20 text-[#69E6A6] border-[#69E6A6]/50',
  COMPLETED: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  DECLINED: 'bg-red-500/20 text-red-400 border-red-500/50',
  CANCELLED: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
};

export function BookingCard({
  booking,
  href,
  showProvider = false,
  showUser = false,
  className = '',
}: BookingCardProps) {
  // Helper to render phone link/button - use button when inside a Link to avoid nested <a> tags
  const renderPhoneLink = (phone: string, additionalClassName: string = '') => {
    const phoneIcon = (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    );

    const baseClassName = `text-[#69E6A6] hover:text-[#5dd195] transition-colors flex items-center gap-1 ${additionalClassName}`;

    // If inside a Link, use button to avoid nested <a> tags
    if (href) {
      return (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            window.location.href = `tel:${phone}`;
          }}
          className={baseClassName}
        >
          {phoneIcon}
          {phone}
        </button>
      );
    }

    // Otherwise, use regular <a> tag
    return (
      <a
        href={`tel:${phone}`}
        onClick={(e) => e.stopPropagation()}
        className={baseClassName}
      >
        {phoneIcon}
        {phone}
      </a>
    );
  };

  const cardContent = (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[booking.status]}`}>
            {booking.status}
          </span>
          <span className="text-white/50 text-sm">
            Booking #{booking.id.slice(-8)}
          </span>
        </div>
        <div className="space-y-2">
          {booking.service && (
            <div className="flex items-center gap-2 text-white/80">
              <svg className="w-5 h-5 text-[#69E6A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="font-semibold">{booking.service.name}</span>
              {booking.service.basePrice && (
                <span className="text-[#69E6A6]">• Rs. {booking.service.basePrice.toLocaleString()}</span>
              )}
            </div>
          )}
          <div className="flex items-center gap-2 text-white">
            <svg className="w-5 h-5 text-[#69E6A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-semibold">
              {new Date(booking.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span className="text-white/70">at</span>
            <span className="font-semibold">{booking.timeSlot}</span>
          </div>
          <div className="flex items-center gap-2 text-white/70">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{booking.area}, Kathmandu</span>
          </div>
          {showProvider && booking.provider && (
            <div className="flex items-center gap-2 text-white/80 mt-2 pt-2 border-t border-white/10">
              <svg className="w-5 h-5 text-[#69E6A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="font-medium">
                Provider: {booking.provider.fullName || booking.provider.serviceRole || 'Provider'}
              </span>
              {booking.provider.phone && renderPhoneLink(booking.provider.phone, 'ml-2')}
            </div>
          )}
          {showUser && booking.user && (
            <div className="flex items-center gap-2 text-white/80 mt-2 pt-2 border-t border-white/10">
              <svg className="w-5 h-5 text-[#69E6A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="font-medium">Customer: {booking.user.name}</span>
              {booking.user.phone && renderPhoneLink(booking.user.phone)}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const baseClasses = `rounded-xl bg-[#0A2640] border border-white/5 p-4 hover:border-[#69E6A6]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#69E6A6]/10 ${className}`;

  if (href) {
    return (
      <Link href={href} className={`block ${baseClasses}`}>
        {cardContent}
      </Link>
    );
  }

  return <div className={baseClasses}>{cardContent}</div>;
}

