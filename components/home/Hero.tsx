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
              <span className="text-[#69E6A6] text-sm font-semibold">Nepal's #1 Home Service Platform</span>
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
                href="/services"
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
                href="/services"
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

          {/* Right Side - Hero Image Placeholder */}
          <div className="relative lg:pl-8">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1C3D5B] to-[#0A2640] border border-white/10 shadow-2xl">
              <div className="aspect-square relative">
                {/* Placeholder for hero image */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#69E6A6]/10 to-[#4A9EFF]/10">
                  <img
                    src="/images/services.png"
                    alt="Hamro Service - Professional Home Services"
                    className="w-full h-full object-cover opacity-80"
                    onError={(e) => {
                      // Fallback if image doesn't exist
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                
                {/* Floating service icons overlay
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-10 left-10 w-16 h-16 bg-[#69E6A6]/20 rounded-2xl backdrop-blur-sm flex items-center justify-center border border-[#69E6A6]/30">
                    <span className="text-3xl">🔧</span>
                  </div>
                  <div className="absolute top-32 right-16 w-16 h-16 bg-[#4A9EFF]/20 rounded-2xl backdrop-blur-sm flex items-center justify-center border border-[#4A9EFF]/30">
                    <span className="text-3xl">⚡</span>
                  </div>
                  <div className="absolute bottom-20 left-20 w-16 h-16 bg-[#69E6A6]/20 rounded-2xl backdrop-blur-sm flex items-center justify-center border border-[#69E6A6]/30">
                    <span className="text-3xl">🧹</span>
                  </div>
                </div> */}
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -z-10 top-10 -right-10 w-32 h-32 bg-[#69E6A6]/10 rounded-full blur-2xl"></div>
            <div className="absolute -z-10 bottom-10 -left-10 w-24 h-24 bg-[#4A9EFF]/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

