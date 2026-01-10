import Link from 'next/link';
import { Booking, BookingStatus } from '@/lib/api/bookings.api';

interface BookingCardProps {
  booking: Booking;
  href?: string;
  showProvider?: boolean;
  showUser?: boolean;
  className?: string;
}

const statusColors: Record<BookingStatus, { bg: string; text: string; border: string; icon: string }> = {
  PENDING: {
    bg: 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20',
    text: 'text-yellow-300',
    border: 'border-yellow-500/50',
    icon: '⏳',
  },
  CONFIRMED: {
    bg: 'bg-gradient-to-r from-[#69E6A6]/20 to-emerald-500/20',
    text: 'text-[#69E6A6]',
    border: 'border-[#69E6A6]/50',
    icon: '✓',
  },
  COMPLETED: {
    bg: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20',
    text: 'text-blue-300',
    border: 'border-blue-500/50',
    icon: '✓',
  },
  DECLINED: {
    bg: 'bg-gradient-to-r from-red-500/20 to-rose-500/20',
    text: 'text-red-300',
    border: 'border-red-500/50',
    icon: '✕',
  },
  CANCELLED: {
    bg: 'bg-gradient-to-r from-gray-500/20 to-slate-500/20',
    text: 'text-gray-300',
    border: 'border-gray-500/50',
    icon: '⊘',
  },
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
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    );

    const baseClassName = `px-2.5 py-1 rounded-lg bg-[#69E6A6]/10 hover:bg-[#69E6A6]/20 text-[#69E6A6] hover:text-[#5dd195] transition-all flex items-center gap-1.5 text-[10px] font-semibold border border-[#69E6A6]/20 hover:border-[#69E6A6]/40 ${additionalClassName}`;

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
          <span className="text-[10px]">{phone}</span>
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
        <span className="text-[10px]">{phone}</span>
      </a>
    );
  };

  const status = statusColors[booking.status];

  const cardContent = (
    <div className="relative group">
      {/* Top accent bar with status color */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${status.bg} rounded-t-xl`}></div>
      
      <div className="pt-7">
        {/* Header: Service Name and Status */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1 min-w-0 pr-4">
            {booking.service && (
              <>
                <h3 className="text-white font-bold text-lg mb-2 truncate group-hover:text-[#69E6A6] transition-colors">
                  {booking.service.name}
                </h3>
                {booking.service.basePrice && (
                  <p className="text-[#69E6A6] font-bold text-base">
                    Rs. {booking.service.basePrice.toLocaleString()}
                  </p>
                )}
              </>
            )}
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <span className={`px-3.5 py-1.5 rounded-lg text-xs font-bold ${status.bg} ${status.text} ${status.border} border flex items-center gap-1.5 shadow-lg`}>
              <span className="text-sm">{status.icon}</span>
              <span>{booking.status}</span>
            </span>
            {booking.paymentStatus === 'PAID' && (
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#69E6A6]/20 text-[#69E6A6] border border-[#69E6A6]/50 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>PAID</span>
              </span>
            )}
            <span className="text-white/30 text-[10px] font-mono">
              #{booking.id.slice(-6)}
            </span>
          </div>
        </div>

        {/* Info Grid - Clean Layout */}
        <div className="space-y-4 mb-5">
          {/* Date & Time Row */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 border border-blue-500/20">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-white/50 text-[11px] mb-1 font-medium">Date</p>
                <p className="text-white font-semibold text-sm">
                  {new Date(booking.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0 border border-purple-500/20">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-white/50 text-[11px] mb-1 font-medium">Time</p>
                <p className="text-white font-semibold text-sm">{booking.timeSlot}</p>
              </div>
            </div>
          </div>

          {/* Location Row */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#69E6A6]/10 flex items-center justify-center flex-shrink-0 border border-[#69E6A6]/20">
              <svg className="w-5 h-5 text-[#69E6A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/50 text-[11px] mb-1 font-medium">Location</p>
              <p className="text-white font-semibold text-sm truncate">{booking.area}, Kathmandu</p>
            </div>
          </div>

          {/* Payment Method Display */}
          {booking.paymentStatus === 'PAID' && booking.paymentMethod && (
            <div className="flex items-center gap-3 pt-2 border-t border-white/10">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0 border border-green-500/20">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <p className="text-white/50 text-[11px] mb-1 font-medium">Payment Method</p>
                <p className="text-white font-semibold text-sm capitalize">{booking.paymentMethod}</p>
              </div>
            </div>
          )}
        </div>

        {/* Provider/User Section */}
        {(showProvider && booking.provider) || (showUser && booking.user) ? (
          <div className="pt-4 border-t border-white/10">
            {showProvider && booking.provider && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#69E6A6]/20 to-emerald-500/20 flex items-center justify-center flex-shrink-0 border border-[#69E6A6]/20">
                  <svg className="w-5 h-5 text-[#69E6A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/50 text-[10px] mb-0.5">Provider</p>
                  <p className="text-white font-semibold text-sm truncate">
                    {booking.provider.fullName || booking.provider.serviceRole || 'Provider'}
                  </p>
                </div>
                {booking.provider.phone && (
                  <div className="flex-shrink-0">
                    {renderPhoneLink(booking.provider.phone, '')}
                  </div>
                )}
              </div>
            )}
            {showUser && booking.user && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4A9EFF]/20 to-blue-500/20 flex items-center justify-center flex-shrink-0 border border-[#4A9EFF]/20">
                  <svg className="w-5 h-5 text-[#4A9EFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/50 text-[10px] mb-0.5">Customer</p>
                  <p className="text-white font-semibold text-sm truncate">{booking.user.name}</p>
                </div>
                {booking.user.phone && (
                  <div className="flex-shrink-0">
                    {renderPhoneLink(booking.user.phone, '')}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );

  const baseClasses = `relative rounded-2xl bg-gradient-to-br from-[#1C3D5B] via-[#0F2A47] to-[#0A2640] border border-white/10 p-8 hover:border-[#69E6A6]/40 hover:shadow-2xl hover:shadow-[#69E6A6]/15 transition-all duration-300 hover:-translate-y-1 ${className}`;

  if (href) {
    return (
      <Link href={href} className={`block ${baseClasses}`}>
        {cardContent}
      </Link>
    );
  }

  return <div className={baseClasses}>{cardContent}</div>;
}

