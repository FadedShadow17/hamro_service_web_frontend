import Link from 'next/link';
import { Service } from '@/lib/data/services';
import { Card } from '@/components/ui/Card';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300 group">
      <div className="flex-grow">
        <div className="text-5xl mb-4">{service.icon}</div>
        <h3 className="text-xl font-semibold text-[#0A2640] mb-2 group-hover:text-[#69E6A6] transition-colors">
          {service.title}
        </h3>
        <p className="text-gray-600 mb-4 text-sm">{service.shortDescription}</p>
        {service.startingPrice && (
          <div className="mb-4">
            <span className="text-2xl font-bold text-[#0A2640]">
              Rs. {service.startingPrice.toLocaleString()}
            </span>
            <span className="text-gray-500 text-sm ml-2">starting</span>
          </div>
        )}
        {service.duration && (
          <p className="text-sm text-gray-500 mb-4">⏱️ {service.duration}</p>
        )}
      </div>
      <div className="flex gap-2 mt-auto">
        <Link
          href={`/services/${service.slug}`}
          className="flex-1 text-center px-4 py-2 bg-[#69E6A6] text-[#0A2640] rounded-lg font-semibold hover:bg-[#5dd195] transition-colors text-sm"
        >
          View Details
        </Link>
        <Link
          href={`/services/${service.slug}?book=true`}
          className="flex-1 text-center px-4 py-2 border-2 border-[#0A2640] text-[#0A2640] rounded-lg font-semibold hover:bg-[#0A2640] hover:text-white transition-colors text-sm"
        >
          Book Now
        </Link>
      </div>
    </Card>
  );
}

