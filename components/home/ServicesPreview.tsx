import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const services: Service[] = [
  {
    id: '1',
    title: 'Plumbing',
    description: 'Expert plumbers for repairs, installations, and maintenance',
    icon: '🔧',
  },
  {
    id: '2',
    title: 'Electrical',
    description: 'Licensed electricians for all your electrical needs',
    icon: '⚡',
  },
  {
    id: '3',
    title: 'Cleaning',
    description: 'Professional cleaning services for your home',
    icon: '🧹',
  },
  {
    id: '4',
    title: 'Carpentry',
    description: 'Skilled carpenters for custom furniture and repairs',
    icon: '🪚',
  },
  {
    id: '5',
    title: 'Painting',
    description: 'Interior and exterior painting services',
    icon: '🎨',
  },
  {
    id: '6',
    title: 'HVAC',
    description: 'Heating, ventilation, and air conditioning services',
    icon: '❄️',
  },
];

export function ServicesPreview() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0A2640] mb-4">
            Our Services
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choose from a wide range of professional home services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-[#0A2640] mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <Link
                href="/services"
                className="text-[#69E6A6] font-medium hover:underline inline-flex items-center"
              >
                Book Now →
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="primary" href="/services">
            View All Services
          </Button>
        </div>
      </div>
    </section>
  );
}

