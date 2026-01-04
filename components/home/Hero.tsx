'use client';

import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-[#06243A] via-[#0A2640] to-[#0F2E4A] overflow-hidden">
      {/* Animated gradient shapes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#69E6A6]/15 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#4A9EFF]/15 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#69E6A6]/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Text Content */}
          <div className="text-center lg:text-left">
            <div className="inline-block mb-4 px-4 py-2 rounded-full bg-[#69E6A6]/10 border border-[#69E6A6]/20">
              <span className="text-[#69E6A6] text-sm font-semibold">Kathmandu's #1 Home Service Platform</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight">
              Professional Home Services{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#69E6A6] to-[#4ADE80]">
                Delivered to Your Doorstep
              </span>
            </h1>
            
            <p className="text-white/80 text-lg md:text-xl mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Connect with verified, skilled professionals for all your home service needs in Nepal. 
              From plumbing to electrical work, cleaning to repairs—we've got you covered with quality service and transparent pricing.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Link
                href="/login"
                className="group relative px-8 py-4 bg-gradient-to-r from-[#69E6A6] to-[#4ADE80] text-[#0A2640] rounded-xl font-bold text-lg shadow-lg shadow-[#69E6A6]/30 hover:shadow-xl hover:shadow-[#69E6A6]/40 transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Book a Service
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              
              <Link
                href="/login"
                className="px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-xl font-bold text-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300"
              >
                Explore Services
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                <svg className="w-5 h-5 text-[#69E6A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-white/90 text-sm font-medium">Verified Professionals</span>
              </div>
              
              <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                <svg className="w-5 h-5 text-[#4A9EFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-white/90 text-sm font-medium">Fast Booking</span>
              </div>
              
              <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                <svg className="w-5 h-5 text-[#69E6A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-white/90 text-sm font-medium">Secure Payments</span>
              </div>
            </div>
          </div>

          {/* Right Side - Premium Stats Dashboard */}
          <div className="relative lg:pl-8">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0F2E4A] via-[#0A2640] to-[#06243A] border border-white/10 shadow-2xl p-8">
              {/* Animated background gradients */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#69E6A6]/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#4A9EFF]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>

              {/* Main content */}
              <div className="relative z-10 space-y-6">
                {/* Header */}
                <div className="text-center lg:text-left">
                  <h3 className="text-2xl font-bold text-white mb-2">Live Service Stats</h3>
                  <p className="text-white/60 text-sm">Real-time platform metrics</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Stat Card 1 */}
                  <div className="bg-gradient-to-br from-[#69E6A6]/20 to-[#69E6A6]/5 rounded-2xl p-5 border border-[#69E6A6]/20 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#69E6A6]/30 flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#69E6A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">2.5K+</div>
                    <div className="text-xs text-white/70">Active Providers</div>
                    <div className="mt-2 flex items-center text-[#69E6A6] text-xs">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      +12% this month
                    </div>
                  </div>

                  {/* Stat Card 2 */}
                  <div className="bg-gradient-to-br from-[#4A9EFF]/20 to-[#4A9EFF]/5 rounded-2xl p-5 border border-[#4A9EFF]/20 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#4A9EFF]/30 flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#4A9EFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">15K+</div>
                    <div className="text-xs text-white/70">Completed Jobs</div>
                    <div className="mt-2 flex items-center text-[#4A9EFF] text-xs">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      +28% this month
                    </div>
                  </div>

                  {/* Stat Card 3 */}
                  <div className="bg-gradient-to-br from-[#69E6A6]/20 to-[#4A9EFF]/10 rounded-2xl p-5 border border-white/10 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#69E6A6]/40 to-[#4A9EFF]/40 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">4.9★</div>
                    <div className="text-xs text-white/70">Avg Rating</div>
                    <div className="mt-2 flex items-center text-[#69E6A6] text-xs">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      From 8K+ reviews
                    </div>
                  </div>

                  {/* Stat Card 4 */}
                  <div className="bg-gradient-to-br from-[#4A9EFF]/20 to-[#69E6A6]/10 rounded-2xl p-5 border border-white/10 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4A9EFF]/40 to-[#69E6A6]/40 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">24/7</div>
                    <div className="text-xs text-white/70">Support</div>
                    <div className="mt-2 flex items-center text-[#4A9EFF] text-xs">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      Always available
                    </div>
                  </div>
                </div>

                {/* Service Categories Preview */}
                <div className="pt-4 border-t border-white/10">
                  <div className="text-sm font-semibold text-white/80 mb-3">Popular Services</div>
                  <div className="flex flex-wrap gap-2">
                    {['Plumbing', 'Electrical', 'Cleaning', 'Carpentry'].map((service, idx) => (
                      <div
                        key={service}
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/70 hover:bg-[#69E6A6]/10 hover:border-[#69E6A6]/30 hover:text-[#69E6A6] transition-all duration-300"
                        style={{ animationDelay: `${idx * 0.1}s` }}
                      >
                        {service}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs text-white/60 mb-2">
                    <span>Platform Growth</span>
                    <span>87%</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#69E6A6] to-[#4A9EFF] rounded-full transition-all duration-1000"
                      style={{ width: '87%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

