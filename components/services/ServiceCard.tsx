import Link from 'next/link';
import { Service } from '@/lib/data/services';

interface ServiceCardProps {
  service: Service;
}

// Helper function to determine badges
function getBadges(service: Service): string[] {
  const badges: string[] = [];
  
  // Popular services (first 3)
  if (['1', '2', '3'].includes(service.id)) {
    badges.push('Popular');
  }
  
  // Fast services (duration <= 2 hours)
  if (service.duration && service.duration.includes('1-2')) {
    badges.push('Fast');
  }
  
  // Verified badge for all services
  badges.push('Verified');
  
  return badges;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const badges = getBadges(service);
  const bookHref = `/services/${service.slug}?book=true`;

  return (
    <div className="group relative h-full flex flex-col bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-2xl hover:-translate-y-1 hover:border-[#69E6A6]/50 transition-all duration-300">
      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {badges.map((badge, index) => (
          <span
            key={index}
            className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
              badge === 'Popular'
                ? 'bg-[#69E6A6]/20 text-[#0A2640]'
                : badge === 'Fast'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {badge}
          </span>
        ))}
      </div>

      {/* Icon */}
      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
        {service.icon}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-[#0A2640] mb-2 group-hover:text-[#69E6A6] transition-colors">
        {service.title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-2">
        {service.shortDescription}
      </p>

      {/* Pricing & Duration */}
      <div className="mb-5 space-y-2">
        {service.startingPrice && (
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#0A2640]">
              Rs. {service.startingPrice.toLocaleString()}
            </span>
            <span className="text-gray-500 text-xs">starting</span>
          </div>
        )}
        {service.duration && (
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{service.duration}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100">
        <Link
          href={bookHref}
          className="flex-1 text-center px-4 py-2.5 bg-[#69E6A6] text-[#0A2640] rounded-lg font-semibold hover:bg-[#5dd195] transition-colors text-sm shadow-sm hover:shadow-md"
        >
          Book Now
        </Link>
        <Link
          href={`/services/${service.slug}`}
          className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 hover:border-[#69E6A6] hover:text-[#0A2640] transition-colors text-sm"
        >
          Details
        </Link>
      </div>
    </div>
  );
}

