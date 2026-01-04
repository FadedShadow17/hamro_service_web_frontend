'use client';

import { RouteGuard } from '@/components/auth/RouteGuard';
import { ContactForm } from '@/components/contact/ContactForm';

export default function ContactPage() {
  return (
    <RouteGuard requireAuth redirectTo="/login">
      <div className="min-h-screen bg-[#0A2640] pt-20">
        {/* Hero Section with Gradient Background */}
        <section className="relative bg-[#0A2640] overflow-hidden pb-12">
          {/* Gradient shapes */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#69E6A6]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#4A9EFF]/10 rounded-full blur-3xl"></div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center py-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Get in <span className="text-[#69E6A6]">Touch</span>
              </h1>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Have a question or need assistance? We're here to help! Our support team is ready
                to assist you with any inquiries about our services.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="relative pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left Side - Contact Form */}
              <div className="order-2 lg:order-1">
                <div className="rounded-2xl bg-[#1C3D5B] p-8 md:p-10 shadow-2xl border border-white/10 backdrop-blur-sm">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Send us a Message</h2>
                    <p className="text-white/70 text-sm">
                      Fill out the form below and we'll get back to you within 24 hours.
                    </p>
                  </div>
                  <ContactForm />
                </div>
              </div>

              {/* Right Side - Contact Info & Visual */}
              <div className="order-1 lg:order-2 space-y-8">
                {/* Contact Info Cards */}
                <div className="space-y-6">
                  <div className="rounded-xl bg-gradient-to-br from-[#1C3D5B] to-[#0A2640] p-6 border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-[#69E6A6]/30">
                    <div className="flex items-start space-x-4">
                      <div className="w-14 h-14 rounded-xl bg-[#69E6A6]/20 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-7 h-7 text-[#69E6A6]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg mb-1">Email Us</h3>
                        <p className="text-white/70 text-sm mb-2">
                          Send us an email anytime and we'll respond promptly.
                        </p>
                        <a
                          href="mailto:support@hamroservice.com"
                          className="text-[#69E6A6] hover:text-[#5dd195] font-medium text-sm transition-colors"
                        >
                          support@hamroservice.com →
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-gradient-to-br from-[#1C3D5B] to-[#0A2640] p-6 border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-[#69E6A6]/30">
                    <div className="flex items-start space-x-4">
                      <div className="w-14 h-14 rounded-xl bg-[#4A9EFF]/20 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-7 h-7 text-[#4A9EFF]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg mb-1">Call Us</h3>
                        <p className="text-white/70 text-sm mb-2">
                          Speak directly with our support team during business hours.
                        </p>
                        <a
                          href="tel:+9779808080808"
                          className="text-[#4A9EFF] hover:text-[#3a8eef] font-medium text-sm transition-colors"
                        >
                          +977-9808080808 →
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-gradient-to-br from-[#1C3D5B] to-[#0A2640] p-6 border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-[#69E6A6]/30">
                    <div className="flex items-start space-x-4">
                      <div className="w-14 h-14 rounded-xl bg-[#69E6A6]/20 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-7 h-7 text-[#69E6A6]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg mb-1">Response Time</h3>
                        <p className="text-white/70 text-sm mb-2">
                          We typically respond to all inquiries within 24 hours.
                        </p>
                        <span className="text-[#69E6A6] font-medium text-sm">Within 24 hours</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image Placeholder / Illustration */}
                <div className="relative rounded-2xl bg-gradient-to-br from-[#1C3D5B] to-[#0A2640] p-8 border border-white/10 shadow-xl overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#69E6A6]/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#4A9EFF]/10 rounded-full blur-2xl"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-center mb-6">
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#69E6A6]/20 to-[#4A9EFF]/20 flex items-center justify-center">
                        <svg
                          className="w-12 h-12 text-[#69E6A6]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-white font-bold text-xl text-center mb-3">
                      We're Here to Help
                    </h3>
                    <p className="text-white/70 text-sm text-center mb-6">
                      Our dedicated support team is available to assist you with any questions
                      about our services, bookings, or technical issues.
                    </p>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-[#69E6A6] mb-1">24/7</div>
                        <div className="text-xs text-white/60">Support</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-[#4A9EFF] mb-1">&lt;24h</div>
                        <div className="text-xs text-white/60">Response</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-[#69E6A6] mb-1">100%</div>
                        <div className="text-xs text-white/60">Satisfaction</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="rounded-xl bg-[#1C3D5B] p-6 border border-white/10">
                  <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                  <div className="space-y-3">
                    <a
                      href="/services"
                      className="flex items-center justify-between text-white/70 hover:text-[#69E6A6] transition-colors group"
                    >
                      <span className="text-sm">Browse Services</span>
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </a>
                    <a
                      href="/dashboard"
                      className="flex items-center justify-between text-white/70 hover:text-[#69E6A6] transition-colors group"
                    >
                      <span className="text-sm">My Dashboard</span>
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </a>
                    <a
                      href="/help"
                      className="flex items-center justify-between text-white/70 hover:text-[#69E6A6] transition-colors group"
                    >
                      <span className="text-sm">Help Center</span>
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </RouteGuard>
  );
}

