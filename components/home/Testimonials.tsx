const testimonials = [
  {
    name: 'Rajesh Shrestha',
    role: 'Homeowner, Kamalpokhari',
    content: 'Excellent service! The plumber arrived on time and fixed the issue quickly. Very professional and reasonably priced. Highly recommend Hamro Service!',
    rating: 5,
    service: 'Plumbing Repair',
  },
  {
    name: 'Sita Maharjan',
    role: 'Business Owner, Dillibazar',
    content: 'I\'ve used Hamro Service multiple times for cleaning and electrical work. Always reliable and the quality is top-notch. The booking process is so convenient!',
    rating: 5,
    service: 'Cleaning & Electrical',
  },
  {
    name: 'Amit Kumar',
    role: 'Property Manager, Boudha',
    content: 'Great platform for finding trusted professionals. The booking process is simple and the service providers are skilled. Perfect for managing multiple properties.',
    rating: 5,
    service: 'Multiple Services',
  },
];

export function Testimonials() {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0A2640] mb-4">
            What Our <span className="text-[#69E6A6]">Customers</span> Say
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers across Nepal have to say about their experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative rounded-2xl bg-white p-8 border border-gray-200 hover:border-[#69E6A6]/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Gradient border effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#69E6A6]/20 to-[#4A9EFF]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
              
              {/* Rating Stars */}
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 text-[#69E6A6]/20">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h3.983v10h-9.984z" />
                </svg>
              </div>
              
              <p className="text-gray-700 mb-6 italic leading-relaxed relative z-10">
                "{testimonial.content}"
              </p>
              
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-bold text-[#0A2640] text-lg">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#69E6A6]/10 text-[#69E6A6] text-xs font-semibold">
                    {testimonial.service}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

