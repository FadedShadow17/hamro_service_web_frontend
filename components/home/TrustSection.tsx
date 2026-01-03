import { Card } from '@/components/ui/Card';

const trustPoints = [
  {
    icon: '✓',
    title: 'Verified Professionals',
    description: 'All our service providers are background-checked and verified for your safety and peace of mind.',
  },
  {
    icon: '⚡',
    title: 'Fast Response',
    description: 'Get connected with professionals quickly. Most services available same-day or next-day.',
  },
  {
    icon: '💰',
    title: 'Transparent Pricing',
    description: 'No hidden fees. Clear, upfront pricing for all services with no surprises.',
  },
  {
    icon: '🛡️',
    title: '24/7 Support',
    description: 'Our customer support team is available round the clock to assist you with any questions.',
  },
];

export function TrustSection() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0A2640] mb-4">
            Why Choose Hamro Service?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We're committed to providing the best home service experience with trusted professionals and reliable service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPoints.map((point, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{point.icon}</div>
              <h3 className="text-xl font-semibold text-[#0A2640] mb-3">{point.title}</h3>
              <p className="text-gray-600 text-sm">{point.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

