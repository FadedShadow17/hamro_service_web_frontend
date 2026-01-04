const steps = [
  {
    number: '01',
    title: 'Choose Your Service',
    description: 'Browse through our wide range of home services and select what you need. From plumbing to electrical, we have it all.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Pick Time & Address',
    description: 'Select your preferred date and time slot. Enter your address and we\'ll send a verified professional to your location.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Get Professional at Doorstep',
    description: 'Our verified professional arrives on time, completes the job with quality work, and you pay securely through our platform.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
];

export function HowItWorksSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0A2640] mb-4">
            How It <span className="text-[#69E6A6]">Works</span>
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
            Booking a service with Hamro Service is simple, fast, and hassle-free. Just three easy steps.
          </p>
        </div>

        <div className="relative">
          {/* Connection line for desktop */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-[#69E6A6] via-[#4A9EFF] to-[#69E6A6]"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center lg:text-left">
                  {/* Step Number Badge */}
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#69E6A6] to-[#4ADE80] text-white font-bold text-2xl mb-6 shadow-lg shadow-[#69E6A6]/30">
                    {step.number}
                  </div>

                  {/* Step Card */}
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 border border-gray-200 hover:border-[#69E6A6]/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#69E6A6]/10 to-[#4A9EFF]/10 flex items-center justify-center text-[#69E6A6] mb-6">
                      {step.icon}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-[#0A2640] mb-4">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Connector dot for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-24 -right-6 w-4 h-4 rounded-full bg-[#69E6A6] border-4 border-white shadow-lg"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

