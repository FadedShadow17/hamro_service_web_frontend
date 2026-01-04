'use client';

import { RouteGuard } from '@/components/auth/RouteGuard';
import { ContactForm } from '@/components/contact/ContactForm';

export default function ContactPage() {
  return (
    <RouteGuard requireAuth redirectTo="/login">
      <div className="min-h-screen bg-[#0A2640] pt-20 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Contact Us
              </h1>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Have a question or need assistance? We're here to help! Fill out the form below
                and we'll get back to you as soon as possible.
              </p>
            </div>

            {/* Contact Form Card */}
            <div className="rounded-2xl bg-[#1C3D5B] p-8 md:p-12 shadow-2xl border border-white/10">
              <ContactForm />
            </div>

            {/* Additional Info */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#69E6A6]/20 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-[#69E6A6]"
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
                <h3 className="text-white font-semibold mb-2">Email Us</h3>
                <p className="text-white/70 text-sm">support@hamroservice.com</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#69E6A6]/20 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-[#69E6A6]"
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
                <h3 className="text-white font-semibold mb-2">Call Us</h3>
                <p className="text-white/70 text-sm">+977-9808080808</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#69E6A6]/20 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-[#69E6A6]"
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
                <h3 className="text-white font-semibold mb-2">Response Time</h3>
                <p className="text-white/70 text-sm">Within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}

