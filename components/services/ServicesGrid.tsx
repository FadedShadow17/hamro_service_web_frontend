import { Service } from '@/lib/data/services';
import { ServiceCard } from './ServiceCard';

interface ServicesGridProps {
  services: Service[];
}

export function ServicesGrid({ services }: ServicesGridProps) {
  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No services found. Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}

