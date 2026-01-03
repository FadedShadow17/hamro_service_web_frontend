import Link from 'next/link';
import { services } from '@/lib/data/services';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function ServicesPreview() {
  const featuredServices = services.slice(0, 6);

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0A2640] mb-4">
            Our Services
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choose from a wide range of professional home services. All our service providers are verified and skilled.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredServices.map((service) => (
            <Card key={service.id} className="p-6 hover:shadow-xl transition-all duration-300 group">
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-[#0A2640] mb-2 group-hover:text-[#69E6A6] transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-4 text-sm">{service.shortDescription}</p>
              {service.startingPrice && (
                <p className="text-[#0A2640] font-semibold mb-4">
                  Starting at Rs. {service.startingPrice.toLocaleString()}
                </p>
              )}
              <Link
                href={`/services/${service.slug}`}
                className="text-[#69E6A6] font-semibold hover:underline inline-flex items-center group-hover:gap-2 transition-all"
              >
                Book Now
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </Card>
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

