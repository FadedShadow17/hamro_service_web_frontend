const trustPoints = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Verified Professionals',
    description: 'All our service providers are background-checked and verified for your safety and peace of mind.',
    color: 'from-[#69E6A6] to-[#4ADE80]',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Fast Response',
    description: 'Get connected with professionals quickly. Most services available same-day or next-day.',
    color: 'from-[#4A9EFF] to-[#3A8EEF]',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Transparent Pricing',
    description: 'No hidden fees. Clear, upfront pricing for all services with no surprises.',
    color: 'from-[#69E6A6] to-[#4ADE80]',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: '24/7 Support',
    description: 'Our customer support team is available round the clock to assist you with any questions.',
    color: 'from-[#4A9EFF] to-[#3A8EEF]',
  },
];

export function TrustSection() {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0A2640] mb-4">
            Why Choose <span className="text-[#69E6A6]">Hamro Service</span>?
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
            We're committed to providing the best home service experience in Nepal with trusted professionals and reliable service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {trustPoints.map((point, index) => (
            <div
              key={index}
              className="group relative rounded-2xl bg-white p-8 border border-gray-200 hover:border-[#69E6A6]/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${point.color} p-4 text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {point.icon}
              </div>
              <h3 className="text-xl font-bold text-[#0A2640] mb-3 group-hover:text-[#69E6A6] transition-colors">
                {point.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

