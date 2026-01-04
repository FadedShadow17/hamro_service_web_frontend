import Link from 'next/link';

export function CTASection() {
  return (
    <section className="relative bg-gradient-to-br from-[#06243A] via-[#0A2640] to-[#0F2E4A] py-20 md:py-28 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#69E6A6]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#4A9EFF]/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 rounded-full bg-[#69E6A6]/10 border border-[#69E6A6]/20">
            <span className="text-[#69E6A6] text-sm font-semibold">Ready to Get Started?</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Need a Service <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#69E6A6] to-[#4ADE80]">Today</span>?
          </h2>
          
          <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Book a service in minutes and get connected with a verified professional right away. 
            Quality service, transparent pricing, guaranteed satisfaction.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/login"
              className="group relative px-10 py-5 bg-gradient-to-r from-[#69E6A6] to-[#4ADE80] text-[#0A2640] rounded-xl font-bold text-lg shadow-2xl shadow-[#69E6A6]/40 hover:shadow-[#69E6A6]/60 transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10 flex items-center">
                Book a Service Now
                <svg className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            
            <Link
              href="/login"
              className="px-10 py-5 bg-transparent border-2 border-white/30 text-white rounded-xl font-bold text-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/70">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-[#69E6A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm">Same-day Service</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-[#69E6A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm">Verified Professionals</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-[#69E6A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm">100% Satisfaction</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

