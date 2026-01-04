import { services } from '@/lib/data/services';
import { Button } from '@/components/ui/Button';
import { ServiceCard } from '@/components/services/ServiceCard';

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
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="primary" href="/login">
            View All Services
          </Button>
        </div>
      </div>
    </section>
  );
}

