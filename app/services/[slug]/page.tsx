import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getServiceBySlug, services } from '@/lib/data/services';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-[#0A2640] text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/services"
            className="inline-flex items-center text-white/70 hover:text-white mb-6 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Services
          </Link>
          <div className="max-w-3xl">
            <div className="text-6xl mb-4">{service.icon}</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{service.title}</h1>
            <p className="text-xl text-white/80">{service.shortDescription}</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-[#0A2640] mb-4">Service Overview</h2>
              <p className="text-gray-700 leading-relaxed">{service.longDescription}</p>
            </Card>

            <Card className="p-8">
              <h2 className="text-2xl font-bold text-[#0A2640] mb-6">What's Included</h2>
              <ul className="space-y-3">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-6 h-6 text-[#69E6A6] mr-3 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="text-xl font-bold text-[#0A2640] mb-6">Booking Information</h3>
              
              {service.startingPrice && (
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Starting Price</p>
                  <p className="text-3xl font-bold text-[#0A2640]">
                    Rs. {service.startingPrice.toLocaleString()}
                  </p>
                </div>
              )}

              {service.duration && (
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Estimated Duration</p>
                  <p className="text-lg font-semibold text-[#0A2640]">{service.duration}</p>
                </div>
              )}

              <div className="space-y-3">
                <Button
                  variant="primary"
                  href="/login"
                  className="w-full text-center"
                >
                  Book This Service
                </Button>
                <Button
                  variant="secondary"
                  href="/contact"
                  className="w-full text-center"
                >
                  Contact Us
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Need Help?</p>
                <p className="text-sm text-gray-700">
                  Our support team is available 24/7 to assist you with any questions.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

