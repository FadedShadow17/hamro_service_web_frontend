import Link from 'next/link';
import { services } from '@/lib/data/services';

const categoryIcons: Record<string, string> = {
  'Plumbing': '🔧',
  'Electrical': '⚡',
  'Cleaning': '🧹',
  'Carpentry': '🪚',
  'Painting': '🎨',
  'HVAC': '❄️',
  'Appliance Repair': '🔌',
  'Gardening & Landscaping': '🌳',
};

export function CategorySection() {
  const featuredCategories = services.slice(0, 8);

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0A2640] mb-4">
            Popular Services
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choose from our most popular home service categories. Quick booking, verified professionals.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredCategories.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="group relative rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 border border-gray-200 hover:border-[#69E6A6]/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#69E6A6]/10 to-[#4A9EFF]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-4xl">{service.icon || categoryIcons[service.title] || '🔧'}</span>
                </div>
                <h3 className="text-base md:text-lg font-bold text-[#0A2640] mb-2 group-hover:text-[#69E6A6] transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-xs md:text-sm mb-4 line-clamp-2">
                  {service.shortDescription}
                </p>
                <div className="inline-flex items-center text-[#69E6A6] font-semibold text-sm group-hover:gap-2 transition-all">
                  Book Now
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/services"
            className="inline-flex items-center px-8 py-4 bg-[#0A2640] text-white rounded-xl font-semibold hover:bg-[#0F2E4A] transition-all duration-300 hover:shadow-lg"
          >
            View All Services
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

